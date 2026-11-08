# Shared game development process

Policy version: 2026-11-08. The canonical copy is maintained in [web-game-template](https://github.com/prblackburn/web-game-template/blob/main/docs/AGENT_PROCESS.md). Copies are explicit adoptions; they do not update automatically.

## Scope and working agreement

Read the current task, root and applicable directory instructions, and affected design/code/test documentation before editing. Preserve the game's engine, presentation, controls, save policy, toolchain and release requirements. These process rules apply to browser, Unity and Unreal games; they do not require migrating engines, importing TypeScript or introducing a backend. User instructions take precedence. Resolve conflicting requirements before dependent work.

Deliver the smallest playable version of the authorized change. Use observable acceptance criteria and existing plans rather than building a new workflow framework. Reuse suitable existing modules and actual callers; record concrete reasons for a separate implementation. Keep tuning decisions distinct from agreed requirements.

## Requests and handoffs

Record new requests, exact constraints, decisions and open questions in the existing repository plan or [playtest ledger](PLAYTEST_DECISIONS.md) when they arise, including queued work. A short entry needs the request, status, linked issue/PR, verification and next action. Distinguish queued, in progress, implemented, merged, deployed and verified; never infer delivery from a plan or an open PR. Keep rejected/superseded decisions traceable.

For interrupted sessions, reconcile the ledger against current source, branches and PR history before resuming. Preserve unrelated work. Use separate branches/worktrees and one named owner per shared file. Integrate separate features through small sequential PRs; independent read-only audits may run together. Serialize heavyweight builds, game/editor sessions and captures when they compete for memory or shared outputs, with an explicit handoff.

## Changelog

Always maintain [CHANGELOG.md](../CHANGELOG.md), with dated newest-first entries and planned work clearly separated from delivered changes. Every player-visible feature/fix PR must describe the result in plain player language, including changed controls or limitations where relevant. Update existing in-game release notes in the same PR; link their source rather than maintaining contradictory histories. Process-only changes belong in a clearly labelled development entry and need no in-game gameplay announcement. Do not invent historical releases.

## Developer cheats and repeatable testing

Maintain [DEV_TOOLS.md](DEV_TOOLS.md) with real enable/disable instructions, controls, supported shortcuts, source locations, reset behavior and persistence effects. Provide a minimal discoverable developer mode appropriate to the game as gameplay work needs it: for example stage/mission selection, refill/unlock, invulnerability, resource overrides, inspection and deterministic fixtures. Reuse existing tools; add only shortcuts that make current features practical to test. Document missing tools honestly; a policy file does not implement a cheat.

Cheats start off for normal play and require explicit opt-in. Mark assisted sessions visibly. Keep modified rewards, progression, achievements, scores and saves isolated from ordinary play; where the game has no persistence, say so. Reset and scene/lifecycle transitions must be safe, and disabling a switch must not silently persist modified state. Native development-only tools must respect shipping-build restrictions; browser client flags are not authorization for protected server operations.

Keep developer controls out of normal input paths when inactive. Opening/closing panels must handle held inputs, focus and pause safely. Test consequential toggles and reset/persistence behavior when implementing tools.

## Asset replacement record

Maintain [ASSET_TRACKER.md](ASSET_TRACKER.md) for every visual/audio asset or element that could be replaced by authored art/audio, including procedural/generated placeholders, floor/wall tiles, characters, poses, weapons, props, UI, VFX, music and sound/dialogue variants. Keep current placeholders and human-made replacements in separate columns, with stable IDs, source paths, usage/variants, author, source/licence, approval and integration status. Update additions, changes and removals in the same PR. Planned, generated, human-authored and integrated are distinct states; never mark a proposed replacement as shipped.

For an adopted legacy game, label an incomplete historical inventory explicitly and fill affected rows during work. Do not claim an empty starter table is a complete audit.

## Verification and honest evidence

Choose checks from changed behavior and actual risks. For executable changes, preserve the repository's full local gate, meaningful regressions, hooks, native/package requirements and human acceptance gates. API writes bypass hooks and need equivalent local validation. Do not enable or rely on GitHub Actions while the owner's hosted-CI suspension remains in effect. Failed required local checks block merge; disclose unavailable checks without inventing passes.

For strictly documentation-only changes (prose and agent instructions), review the final diff, check formatting and local references, and run `git diff --check`. Gameplay suites, native builds, packaging, screenshots and redeployment are unnecessary for prose. Code, scripts, dependencies, configuration, assets and executable snippets that change behavior do not qualify. This explicit exception scopes blanket full-check wording in inherited rules; it does not waive required review or branch protection.

Label fixture setup and cheat-assisted QA explicitly. They complement a normal player-input playthrough of affected progression; teleports or state mutation do not prove normal end-to-end acceptance. Wait for simulation time, rendered frames and settled input/state rather than assuming wall-clock sleeps equal gameplay progress. Retry browser capability in the current environment before carrying forward a historical blocker.

Tie each result to the tested source/build and environment. Distinguish pass, fail and not tested, code inspection from execution, and observations from hypotheses. Reuse passing results only while relevant inputs/environment are unchanged; rerun affected checks after changes or failures. Never weaken assertions or alter criteria to conceal failures.

## Delivery and documentation

Update affected controls, design, implementation/reuse notes, QA and deployment guides in the implementation PR. Keep records brief; use existing guides rather than duplicating specifications. Final review must compare the integrated diff with acceptance criteria and docs.

The owner authorizes branches, PRs, review/fixes and merging ready in-scope changes, subject to required checks, reviews and protections. Do not claim self-review is independent review. Record final validation and delivery in the PR; avoid completion-only commits that trigger repeat work.

For significant gameplay/visual changes, capture and inspect genuine current-build screenshots, share representative evidence in the responsible chat and PR, and use short video when motion matters. Verify the actual released commit and provide a clickable playtest URL for deployed browser games or the game's native build/launch instructions. Preserve Cloudflare Git integration where used and native package gates where used. Report blocked captures/deployments and distinguish merged, deployed and verified. Documentation-only work needs no invented gameplay evidence.

## Adoption and upkeep

New template copies inherit these rules and starter records. Existing projects adopt this file explicitly, link it from AGENTS and the docs index, and record the exact template revision plus local deviations in their local adoption record. Policy adoption does not mean reusable gameplay code or runtime tools were copied. Keep engine-specific rules and existing records intact. Future updates require reviewing the upstream diff against local rules; never overwrite local decisions wholesale.
