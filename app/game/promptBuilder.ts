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
Respond in second person, present tense. Keep responses to 2-3 paragraphs. Be evocative and atmospheric.
Theme: ${seed.theme}. Always end your response with a subtle prompt for what might happen next.`;
}

export function buildUserPrompt(ctx: PromptContext): string {
  const historyStr = ctx.history
    .slice(-5)
    .map((h) => `Player: ${h.player}\nNarrator: ${h.ai}`)
    .join("\n\n");

  return `${historyStr ? historyStr + "\n\n" : ""}Player: ${ctx.intent.raw}`;
}
