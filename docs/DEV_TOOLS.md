# Developer testing tools

The existing README documents an inspection overlay: append `?dev` to a `/play/{sessionId}` URL; press D while the input field is not focused to toggle it. This is a documented entry point, not a live playtest performed during this policy rollout.

## Record for each implemented tool

- Real enable/disable controls, build availability and source paths.
- Supported shortcuts, deterministic setup and limitations.
- Visible assisted-session marker; input/focus/pause ownership.
- Scene, retry and reset behavior; effects on ordinary saves, scores and rewards.
- Actual checks and evidence, labelled assisted or normal-play acceptance.

New cheats must be opt-in and isolated from ordinary progression. Use the game's existing browser tooling; no engine migration or runtime cheat menu is included in this change. See [the shared process](AGENT_PROCESS.md).

Existing setup/validation guides:

- [README.md](../README.md)
