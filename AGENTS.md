# Cloudflare Workers

## Shared development process

Read [the shared development process](docs/AGENT_PROCESS.md) and [local adoption notes](docs/PROCESS_ADOPTION.md). Maintain the [changelog](CHANGELOG.md), [developer testing guide](docs/DEV_TOOLS.md), [asset tracker](docs/ASSET_TRACKER.md) and existing request/decision ledger in the same feature PR. Cheats must be explicit, visible and isolated from normal progression; distinguish assisted QA from normal playthroughs.

The shared guide's explicit documentation-only gate applies to prose/agent-instruction changes: review the diff, check formatting/local references and run `git diff --check`. All executable changes retain this repository's required local, build/package, review and delivery gates. Preserve local engine, prototype, save and release policies.

## Reuse existing modules first

- Before implementing or extending a feature, inspect the relevant existing gameplay modules, shared helpers, engine/platform adapters and presentation components, together with their callers, documentation and tests. Search the affected areas rather than auditing unrelated systems.
- Reuse suitable existing APIs by default. Prefer configuration, composition or a small compatible extension before creating a parallel implementation. A copied or imported module only counts as reused when the real feature calls it.
- For browser games, also check the relevant modules in [web-game-template](https://github.com/prblackburn/web-game-template): `src/core/index.ts`, `src/adapters`, `docs/CORE.md` and `docs/STARTER_MODULES.md`. Use local copies when present; inspect the upstream source at a recorded commit when assessing missing modules or updates. Follow `docs/REUSE.md` locally or upstream when adopting code, reconcile local changes and record the adopted revision. For Unity/Unreal games, apply the same policy to native components, systems and engine facilities; this rule does not require porting TypeScript modules or changing engines.
- A separate implementation requires a concrete reason: incompatible behaviour, correctness, ownership/lifecycle, dependency boundaries or measured performance. Record the candidate module paths, the mismatch and why composition or a small extension would not suffice in the existing implementation plan (when present) and PR description. Do not bypass a suitable module merely because rewriting it is easier.
- Integrate reuse through the actual callers and remove the duplicate implementation it replaces within the task's scope. Preserve the project's units, timing, input edges, randomness, state ownership and applicable persistence/lifecycle contracts. Run the existing required checks and meaningful integration regressions for changed behaviour.
- Include a brief reuse assessment in feature PRs: modules reused or extended, and relevant candidates rejected with reasons; say when no suitable existing module was found. Review must resolve unexplained duplication before merge. Do not force unsuitable abstractions, activate unused modules or expand the task into a wholesale migration.
- Preserve this policy in new template copies. Existing repositories need explicit updates; policy changes and code updates do not propagate automatically.

STOP. Your knowledge of Cloudflare Workers APIs and limits may be outdated. Always retrieve current documentation before any Workers, KV, R2, D1, Durable Objects, Queues, Vectorize, AI, or Agents SDK task.

## Docs

- https://developers.cloudflare.com/workers/
- MCP: `https://docs.mcp.cloudflare.com/mcp`

For all limits and quotas, retrieve from the product's `/platform/limits/` page. eg. `/workers/platform/limits`

## Commands

| Command               | Purpose                   |
| --------------------- | ------------------------- |
| `npx wrangler dev`    | Local development         |
| `npx wrangler deploy` | Deploy to Cloudflare      |
| `npx wrangler types`  | Generate TypeScript types |

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
