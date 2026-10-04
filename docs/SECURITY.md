# Security model

Arc treats API credentials and terminal/browser tools as privileged capabilities.

## Key vault
Credentials are encrypted with AES-256-GCM using a server-side master key. Secrets are never returned by the API after saving; clients receive only masked metadata.

## Paid usage guard
`paid_ai_allowed` defaults to false. When off, providers marked paid-only are blocked. OpenRouter is additionally restricted to `openrouter/free` or model IDs ending in `:free`. Other providers may offer both free and billed account modes under the same API endpoint, so Arc cannot override billing configured at the provider account level; users should also disable billing/auto-recharge at the provider when zero-cost operation is mandatory.

## Browser tool
Only HTTP(S) is allowed. Hostnames are resolved before each request and localhost/private/link-local addresses are rejected. Redirects are followed manually and revalidated.

## Terminal tool
Arbitrary shell execution is disabled unless the deployment owner starts the server with `ENABLE_HOST_TERMINAL=1`. The user must then explicitly select Host terminal. Treat this as equivalent to granting the model the server user's shell permissions.

## Reasoning display
Arc displays observable execution events (routing decisions, tool calls/results, status, public text, and explicitly exposed summaries). It intentionally does not surface hidden model chain-of-thought.
