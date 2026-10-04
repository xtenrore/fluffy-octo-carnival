# Arc Agent

A self-hosted AI agent workspace designed around **bring-your-own API keys**, **free-first routing**, **true token streaming**, background runs, voice input/output, live execution steps, website reading, GitHub plugins, and optional terminal execution.

## Live deployment

Arc Agent is currently deployed on Railway at:

**https://arc-agent-production.up.railway.app**

The production service uses a persistent `/data` volume, does not use Railway sleep mode, restarts automatically, serves over HTTPS, and exposes host terminal only to the deployment-owner Arc account when the deployment-level terminal flags are enabled.

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
- Host terminal execution is owner-only. `ENABLE_HOST_TERMINAL=1` makes it available only to the first/deployment-owner Arc account; other accounts cannot enable it.
- Arc shows live work steps inline in chat and in the activity panel: model routing, browser/GitHub/terminal actions, results, retries and completion state.

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

## Plugins

Arc now has a plugin connection layer separate from model API keys. GitHub is implemented with encrypted fine-grained personal access tokens. Read-only mode exposes repository listing, metadata, file reads, code search and issue reads. Read/write mode additionally exposes issue creation, comments and file create/update operations. Token permissions and repository scope remain controlled by GitHub itself.

## Background execution

When a message is sent, Arc creates a durable task in SQLite and runs it server-side. Closing the browser does not cancel the run. Returning to the chat reconnects to stored task events and live streaming.

## Terminal access

The host terminal is intentionally restricted to the first/deployment-owner Arc account. Enable the deployment capability with:

```bash
ENABLE_HOST_TERMINAL=1 npm start
```

Optionally set `OWNER_HOST_TERMINAL_DEFAULT=1` to turn the owner setting on automatically. Other Arc accounts still receive no host-terminal capability. The owner can run a built-in terminal self-test from Settings. This remains a powerful permission: when enabled, the model can execute arbitrary shell commands with the Arc server process permissions.

## Production notes

Place Arc behind HTTPS, set `APP_ORIGIN`, use a stable `APP_MASTER_KEY_BASE64`, persist the data directory (`.data/` locally or `DATA_DIR=/data` on Railway), and use a reverse proxy with request limits. For true multi-tenant terminal execution, replace the host-terminal runner with isolated containers or microVMs.
