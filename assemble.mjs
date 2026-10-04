import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const packed = join(root, '.packed');
const manifest = {
  server: 'server.mjs',
  app: 'public/app.js',
  index: 'public/index.html',
  styles: 'public/styles.css',
  test: 'tests/integration.test.mjs',
};

for (const [prefix, target] of Object.entries(manifest)) {
  const parts = readdirSync(packed)
    .filter((name) => name.startsWith(`${prefix}.gz.b64.`))
    .sort();
  if (!parts.length) throw new Error(`Missing packed source for ${target}`);
  const b64 = parts.map((name) => readFileSync(join(packed, name), 'utf8')).join('');
  const contents = gunzipSync(Buffer.from(b64, 'base64'));
  const output = join(root, target);
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, contents);
}

console.log('Arc Agent source assembled.');
