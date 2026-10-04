# Arc Agent

A self-hosted AI agent workspace designed around **bring-your-own API keys**, **free-first routing**, word-paced streaming, durable per-user memory and goals, background runs, high-quality voice transcription, files/images, live execution steps, GitHub plugins, a Browserbase Hosted MCP cloud browser, and owner-only terminal execution.

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

## Streaming and automatic provider recovery

Arc consumes upstream streaming when available, but the browser also word-paces large provider chunks so APIs that return a whole completion at once still appear progressively. Every durable run can move across eligible saved provider credentials. If a route fails because of quota/rate limits, authentication, capacity, or provider/server errors, Arc records the cause in the work log and automatically tries the next eligible route. Paid-only routes stay blocked while Paid AI Usage is off.

## Provider limits meter

Arc keeps a local 24-hour usage meter for each saved credential and captures provider rate-limit headers when they are returned. Exact remaining request/token counts are shown only when the upstream provider supplies those values; otherwise the UI labels the value as Arc-observed usage rather than inventing a remaining quota.

## Goals, files and images

The composer `+` action can attach files/images or create a durable goal. Files are stored on the persistent data volume and become model context when supported. Goals run server-side, keep their task history, and are not cancelled by closing the browser. Provider failover applies to goal runs too.

## Arc Voice

Voice mode records real microphone audio with echo cancellation/noise suppression and silence detection. The server prefers an eligible saved speech-capable provider (for example Groq Whisper) for transcription and falls back to device speech recognition when necessary. Technical-name prompting helps preserve repository, provider and code terminology.

## Hosted cloud browser

Arc integrates **Browserbase Hosted MCP** as the pre-made cloud-browser layer. Add a Browserbase API key in **Plugins**; Arc initializes the hosted MCP server, discovers its available tools, and exposes those managed browser tools to model runs. Arc does not ship a home-grown Chromium automation engine.

## Plugins

Arc now has a plugin connection layer separate from model API keys. GitHub is implemented with encrypted fine-grained personal access tokens. Read-only mode exposes repository listing, metadata, file reads, code search and issue reads. Read/write mode additionally exposes issue creation, comments and file create/update operations. Token permissions and repository scope remain controlled by GitHub itself.

## Durable per-user memory

Arc stores enabled memories at the user-account level in the persistent SQLite database. The same memory context is injected into runs regardless of which saved provider/model is selected. Users can add, disable, re-enable, or delete memories from the Memory view, and Arc can use the `memory_save` / `memory_forget` tools when the user explicitly asks it to remember or forget something. Secrets and one-time credentials are explicitly excluded from memory.

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
