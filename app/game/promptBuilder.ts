import type { WorldSeed, Beat, Intent } from "./types";

export interface PromptContext {
  seed: WorldSeed;
  beat: Beat;
  history: Array<{ player: string; ai: string }>;
  intent: Intent;
}

export function buildSystemPrompt(seed: WorldSeed, beat: Beat): string {
  return `You are a text adventure game narrator. Setting: ${seed.setting}.
The player is: ${seed.protagonist}.
Current narrative beat: ${beat.name} — ${beat.description}.
Respond in second person, present tense. Keep responses to 2-4 sentences maximum — short, punchy, atmospheric.
Theme: ${seed.theme}. End with one brief question or cue for the player's next action.`;
}

export function buildUserPrompt(ctx: PromptContext): string {
  const historyStr = ctx.history
    .slice(-5)
    .map((h) => `Player: ${h.player}\nNarrator: ${h.ai}`)
    .join("\n\n");

  return `${historyStr ? historyStr + "\n\n" : ""}Player: ${ctx.intent.raw}`;
}
