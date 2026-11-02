# Cloudflare Workers

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
