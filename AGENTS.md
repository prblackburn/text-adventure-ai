# Cloudflare Workers

STOP. Your knowledge of Cloudflare Workers APIs and limits may be outdated. Always retrieve current documentation before any Workers, KV, R2, D1, Durable Objects, Queues, Vectorize, AI, or Agents SDK task.

## Docs

- https://developers.cloudflare.com/workers/
- MCP: `https://docs.mcp.cloudflare.com/mcp`

For all limits and quotas, retrieve from the product's `/platform/limits/` page. eg. `/workers/platform/limits`

## Commands

| Command | Purpose |
|---------|---------|
| `npx wrangler dev` | Local development |
| `npx wrangler deploy` | Deploy to Cloudflare |
| `npx wrangler types` | Generate TypeScript types |

Run `wrangler types` after changing bindings in wrangler.jsonc.

## Node.js Compatibility

https://developers.cloudflare.com/workers/runtime-apis/nodejs/

## Errors

- **Error 1102** (CPU/Memory exceeded): Retrieve limits from `/workers/platform/limits/`
- **All errors**: https://developers.cloudflare.com/workers/observability/errors/

## Product Docs

Retrieve API references and limits from:
`/kv/` · `/r2/` · `/d1/` · `/durable-objects/` · `/queues/` · `/vectorize/` · `/workers-ai/` · `/agents/`

## Delivery evidence and pull request authority

- The owner grants standing authority to create branches and pull requests, review changes, fix review findings and merge ready PRs for authorized work in this repository. Do not stop for repeated permission to create, review or merge a PR. Keep separate PRs for separate features, review the final diff, pass the existing local validation gate and respect repository protections and explicit task constraints. Never claim an independent review when performing a self-review.
- For every significant gameplay or visual update, capture and inspect genuine screenshots from the running game that demonstrate the changed behavior. Share representative screenshots directly in the chat responsible for that update, as well as in the PR or its linked QA evidence; a PR-only attachment is insufficient. Capture each significant change, not just a generic title screen. Include a short gameplay video when motion or timing needs it. Do not substitute generated mockups or stale captures.
- Every implementation delivery must include a fresh, clickable Cloudflare playtest link in that same chat. Use the actual preview URL containing the PR changes, or the production URL after the merged changes deploy. A stable production URL may be reused only after freshly verifying it. Confirm the deployment succeeded for the delivered commit and open the deployed game to verify it loads and includes the changes; report the verified commit and distinguish preview from production. A local build or an old production URL does not establish deployment success.
- If capture, deployment or verification is blocked, state the blocker and what remains unverified in the responsible chat and PR. Never invent a screenshot, URL or successful deployment, or present a stale build as containing the update. A documentation-only change needs no gameplay capture or new deployment; say it is documentation-only and do not imply the game changed.
