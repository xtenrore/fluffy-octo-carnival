# Verification report

Checked on 2026-10-04 with Node.js v22.16.0 and Chromium.

## Automated checks

`npm test` passes 4/4 integration tests:

1. New accounts default to `paidAiAllowed=false`, terminal disabled, and no host-terminal capability unless the deployment owner explicitly enables it.
2. Saved API secrets are encrypted at rest and API responses return masked metadata instead of the secret.
3. A demo chat runs as a durable server-side task, streams incremental output, and persists the final assistant message.
4. A paid-only provider is blocked when Paid AI Usage is off.

`node --check` passes for both `server.mjs` and `public/app.js`.

## Visual checks

The core shell was rendered headlessly in Chromium at:

- 390 × 844 mobile viewport
- 1440 × 900 desktop viewport

The layout was checked for composer overflow, mobile menu spacing, auth form fit, desktop sidebar fit, and centered model selector. A desktop centering issue discovered during visual QA was fixed by explicitly assigning topbar grid columns.

## Provider interface checks

The built-in adapters use current official REST conventions checked against provider documentation for Gemini streaming/OpenAI compatibility, Groq OpenAI compatibility, Mistral streaming chat completions, Cloudflare Workers AI Account ID + API token REST setup, and OpenRouter free routing.

Real external inference was not executed because no user API keys were provided for this build. The local Demo provider exists specifically so streaming, persistence, Markdown rendering flow, and task lifecycle can be exercised without spending money or exposing credentials.
