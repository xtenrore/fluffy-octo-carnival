# Verification report

Checked on 2026-10-04 with Node.js 22.x and Chromium.

## Automated checks

`npm test` passes 6/6 integration tests covering:

1. New accounts default to `paidAiAllowed=false`.
2. AI provider credentials are encrypted at rest and masked in API responses.
3. GitHub plugin connection secrets are encrypted at rest and masked in API responses.
4. A demo chat streams server-side, persists the assistant response, and persists detailed task events for the work-step UI.
5. Paid-only providers remain blocked while Paid AI Usage is off.
6. When the deployment opts into host terminal support, the first/deployment-owner account successfully executes the terminal self-test command, while later accounts receive HTTP 403 and cannot enable host terminal.

`node --check` passes for `server.mjs` and `public/app.js`.

## New v1.1 capabilities

- Inline ChatGPT-style observable work steps plus a persistent activity drawer.
- GitHub plugin connection with read-only or read/write modes.
- GitHub tools for repo listing/metadata, file reads, code search, issues, comments, issue creation, and file create/update.
- Deployment-owner-only host terminal, including an in-app terminal self-test endpoint.
- Existing text streaming and Markdown rendering remain enabled.

## Safety boundaries

The work-step display represents observable execution events, not hidden chain-of-thought. GitHub write tools are only exposed when the saved GitHub connection is explicitly set to read/write. Host terminal remains owner-only because it executes with the Arc service process permissions.
