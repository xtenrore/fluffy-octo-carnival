# Security model

Arc treats API credentials and terminal/browser tools as privileged capabilities.

## Key vault
Credentials are encrypted with AES-256-GCM using a server-side master key. Secrets are never returned by the API after saving; clients receive only masked metadata.

## Paid usage guard
`paid_ai_allowed` defaults to false. When off, providers marked paid-only are blocked. OpenRouter is additionally restricted to `openrouter/free` or model IDs ending in `:free`. Other providers may offer both free and billed account modes under the same API endpoint, so Arc cannot override billing configured at the provider account level; users should also disable billing/auto-recharge at the provider when zero-cost operation is mandatory.

## Browser tool
Only HTTP(S) is allowed. Hostnames are resolved before each request and localhost/private/link-local addresses are rejected. Redirects are followed manually and revalidated.

## Terminal tool
Arbitrary shell execution is disabled unless the deployment owner starts the server with `ENABLE_HOST_TERMINAL=1`. Even when deployment-level terminal support is enabled, Arc exposes it only to the first/deployment-owner account. `OWNER_HOST_TERMINAL_DEFAULT=1` may turn that owner setting on automatically. Treat this as equivalent to granting the model the server user's shell permissions.

## Reasoning display
Arc displays observable execution events (routing decisions, tool calls/results, status, public text, and explicitly exposed summaries). It intentionally does not surface hidden model chain-of-thought.

## Plugin connections
Plugin secrets are stored in the same AES-256-GCM encrypted vault model as AI provider keys, but in a separate connection table. GitHub connections support read-only and read/write modes. Write tools are never exposed to the model for a read-only connection. GitHub token repository scope and underlying permissions are still enforced by GitHub.

## Live work steps
Arc persists task events and renders them as an observable work log inline and in the activity panel. These events include routing, tool invocations/results, retries, status and explicit progress metadata. The UI does not claim to expose private hidden model chain-of-thought.
