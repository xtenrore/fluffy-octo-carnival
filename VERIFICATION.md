# Verification report

Checked on 2026-10-04 with Node.js 22.x.

## Automated checks

`npm test` passes **11/11 integration tests** covering:

1. New accounts default to `paidAiAllowed=false`, and host terminal is unavailable unless the deployment explicitly enables it.
2. AI provider credentials are encrypted at rest and masked in API responses.
3. GitHub plugin connection secrets are encrypted at rest and masked in API responses.
4. Demo chat runs as a durable server-side task, streams incremental events, persists the final assistant response, and persists the observable work log.
5. Paid-only providers remain blocked while Paid AI Usage is off and Arc can still use an eligible safe fallback.
6. Attachments can be uploaded and referenced by a chat message.
7. Durable goals remain active when only the local demo fallback is available instead of being falsely marked complete.
8. User memory persists across chats and provider/model changes.
9. The limits meter returns local 24-hour usage plus provider status/rate-limit metadata when available.
10. A mocked provider HTTP 429 is explained in the work log, rate-limit metadata is captured, and Arc automatically switches to another eligible route.
11. When the deployment opts into host terminal support, only the first/deployment-owner account receives terminal capability; later accounts cannot enable it.

`node --check` passes for both `server.mjs` and `public/app.js`.

## Requested behavior verified in code

- **Word-paced output:** provider chunks are queued and revealed progressively, so a provider that returns a large completion in one chunk does not dump the whole answer into the UI at once.
- **Provider failover:** quota, authentication, capacity, rate-limit, server and provider failures are recorded with a reason, then the run continues with the next eligible saved provider. Partial failed-provider output is reset before the replacement route continues.
- **Provider limits:** Arc records a 24-hour local usage meter and captures provider-reported remaining requests/tokens/reset headers when the upstream exposes them. Arc does not fabricate exact quota remaining when the provider does not return it.
- **Durable goals:** the composer plus-button can create a goal and attach files/images; the goal is executed by a durable server-side task and can survive the browser closing.
- **Files/images:** attachments are persisted under the durable data directory. Text files are supplied as model context and supported images can be sent as image content.
- **Voice:** Arc records real audio, applies browser audio constraints/silence detection, sends audio to server-side transcription using an eligible saved speech-capable provider, and uses device speech recognition only as a fallback.
- **Arc identity:** the system prompt and assistant UI identify the agent as Arc, while the underlying provider/model appears only as routing metadata.
- **GitHub plugin:** encrypted GitHub connection supports repository/file/code/issue reads and an explicit read/write mode for issue/comment/file mutations.
- **Hosted cloud browser:** Browserbase Hosted MCP is used as the pre-made browser integration; Arc discovers Browserbase MCP tools dynamically instead of implementing its own browser engine.
- **Owner terminal:** arbitrary shell execution is available only to the first/deployment-owner account when the deployment capability is enabled.
- **Observable work log:** the activity UI exposes concrete routing, provider switches, tool actions, results and errors. It does not claim to expose private model chain-of-thought.

## Safety boundaries

Paid AI remains off by default. Provider and plugin secrets remain encrypted. GitHub write tools require an explicitly writable connection. Host terminal is owner-only because it executes with the Arc service process permissions. Browserbase requires the user to provide their own Browserbase API key through Arc's encrypted Plugins UI.
