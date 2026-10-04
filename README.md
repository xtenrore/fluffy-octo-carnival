# Arc Agent

A self-hosted AI agent workspace designed around **bring-your-own API keys**, **free-first routing**, **true token streaming**, background runs, voice input/output, website reading, and optional terminal execution.

## Quick start

Requirements: Node.js 22.5+

```bash
npm start
```

Open `http://127.0.0.1:3000`.

No npm dependencies are required. The app uses Node's built-in HTTP server, SQLite, crypto, fetch, and Web APIs in the browser.

## Important defaults

- **Paid AI usage is OFF by default** for every new account.
- API keys are encrypted at rest with AES-256-GCM.
- Passwords use scrypt with per-user salts.
- Sessions use random opaque tokens; only their hashes are stored.
- Browser access rejects local/private network targets to reduce SSRF risk.
- Host terminal execution is compiled into the app but is unavailable unless the deployment owner sets `ENABLE_HOST_TERMINAL=1`; users must then explicitly enable it in Settings.
- Arc shows routing, tool calls, status, and provider-visible summaries. It does **not** expose hidden chain-of-thought.

## Providers

Built-in adapters include:

- Gemini (OpenAI-compatible endpoint)
- Groq
- Mistral
- Cloudflare Workers AI (requires Account ID + API token)
- OpenRouter
- OpenAI
- xAI
- DeepSeek
- Cerebras
- Together AI
- Fireworks AI
- NVIDIA NIM
- SambaNova
- Any custom OpenAI-compatible endpoint
- Local streaming Demo provider (no key)

Provider/model availability and pricing change over time. Arc stores model IDs as user-editable values instead of hard-coding a permanent list.

## Background execution

When a message is sent, Arc creates a durable task in SQLite and runs it server-side. Closing the browser does not cancel the run. Returning to the chat reconnects to stored task events and live streaming.

## Terminal access

For a private, single-user deployment only:

```bash
ENABLE_HOST_TERMINAL=1 npm start
```

Then enable **Host terminal** inside Settings. This grants the agent arbitrary shell access to the server process account. Do not enable it on an internet-facing multi-user instance without a real OS/container sandbox.

## Production notes

Place Arc behind HTTPS, set `APP_ORIGIN`, use a stable `APP_MASTER_KEY_BASE64`, persist the data directory (`.data/` locally or `DATA_DIR=/data` on Railway), and use a reverse proxy with request limits. For true multi-tenant terminal execution, replace the host-terminal runner with isolated containers or microVMs.
