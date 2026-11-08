# Process adoption

Adopted policy version: 2026-11-08.

Source: [web-game-template at `9ad7dbd3e414`](https://github.com/prblackburn/web-game-template/tree/9ad7dbd3e414ae9153915f2ed06fa3742ac07fea); [pinned process guide](https://github.com/prblackburn/web-game-template/blob/9ad7dbd3e414ae9153915f2ed06fa3742ac07fea/docs/AGENT_PROCESS.md), introduced by [template PR #17](https://github.com/prblackburn/web-game-template/pull/17).

Local copy: [AGENT_PROCESS.md](AGENT_PROCESS.md), mandatory from [AGENTS.md](../AGENTS.md) and indexed in [the docs index](README.md). This adoption copies process rules and starter documentation only. It does not copy gameplay modules, implement runtime cheats, audit historical assets or change deployment settings. Existing developer/asset/decision records are preserved; starter records label incomplete inventories honestly.

Local application: Preserve the existing game stack, controls, local save policy and deployment configuration. Documentation-only diffs use the explicit documentation gate; executable changes retain all existing required checks, hooks, reviews and protections. Existing native release/human acceptance gates remain in force.

Keep this revision separate from any gameplay-module adoption revision. Future policy syncs must compare upstream changes with local decisions and preserve local deviations. The adoption PR is the merge/validation record; no status-only follow-up commit is required.
