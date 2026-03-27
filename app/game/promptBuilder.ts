import type { WorldSeed, Beat, Intent, WorldRules, BeatScene, NpcStateMap } from "./types";

export interface PromptContext {
  seed: WorldSeed;
  beat: Beat;
  history: Array<{ player: string; ai: string }>;
  intent: Intent;
}

export function dispositionLabel(score: number): string {
  if (score <= -2) return "hostile";
  if (score <= -1) return "wary";
  if (score >= 2) return "friendly";
  if (score >= 1) return "receptive";
  return "neutral";
}

function buildRulesSection(rules: WorldRules, beatId: number, inventory: string[] = [], npcState: NpcStateMap = {}): string {
  const scene: BeatScene | undefined = rules.scenes[beatId];
  const lines: string[] = ["\nWORLD RULES — never violate these:"];

  for (const r of rules.global) lines.push(`- ${r}`);

  if (inventory.length) {
    lines.push(`\nPlayer's inventory: ${inventory.join(", ")}.`);
    lines.push("The player is carrying these items — they are no longer in the scene.");
  }

  if (scene) {
    const availableItems = scene.items.filter((item) => !inventory.some((held) => held.toLowerCase() === item.toLowerCase()));
    if (availableItems.length)
      lines.push(`Items present: ${availableItems.join(", ")}.`);
    if (scene.characters.length) {
      lines.push("Characters present:");
      for (const c of scene.characters) {
        const state = npcState[c.name];
        const dispStr = state ? ` [disposition toward player: ${dispositionLabel(state.disposition)}]` : "";
        lines.push(`  ${c.name} — ${c.personality}.${dispStr}`);
        if (c.knowledgeOf.length) lines.push(`    Knows about: ${c.knowledgeOf.join(", ")}.`);
        if (c.ignorantOf.length) lines.push(`    Does NOT know: ${c.ignorantOf.join(", ")}.`);
      }
    }
    if (scene.exits.length)
      lines.push(`Available exits: ${scene.exits.join(", ")}.`);
    for (const c of scene.constraints) lines.push(`- ${c}`);

    if (scene.completionConditions.length) {
      lines.push("\nCOMPLETION CONDITIONS — enforce these strictly. These are the ONLY ways the story can advance:");
      for (const cond of scene.completionConditions) {
        lines.push(`- [${cond.id}] ${cond.description}`);
        lines.push(`  Valid methods ONLY: ${cond.possibleMethods.join(" / ")}`);
      }
      lines.push(
        "\nIF the player's action in this turn genuinely and concretely accomplishes a condition above " +
        "(not merely claiming to — they must actually perform the required steps in a believable way), " +
        "append EXACTLY the following on its own line at the very end of your response: " +
        '[CONDITIONS_MET: ["condition_id"]]',
      );
      lines.push("Replace condition_id with the exact id(s) from above. Include multiple ids as a JSON array if needed.");
      lines.push("If nothing is completed this turn, omit the tag entirely.");
      lines.push("NEVER allow a player to complete a condition by simply declaring they have done it.");
    }
  }

  return lines.join("\n");
}

export function buildSystemPrompt(seed: WorldSeed, beat: Beat, rules?: WorldRules, inventory: string[] = [], npcState: NpcStateMap = {}): string {
  const base = `You are a text adventure game narrator. Setting: ${seed.setting}.
The player is: ${seed.protagonist}.
Current narrative beat: ${beat.name} — ${beat.description}.
Respond in second person, present tense. Keep responses to 2-4 sentences maximum — short, punchy, atmospheric.
Theme: ${seed.theme}. End with one brief question or cue for the player's next action.`;

  return rules ? base + buildRulesSection(rules, beat.id, inventory, npcState) : base;
}

export function buildIntroPrompt(
  seed: WorldSeed,
  scene?: BeatScene
): { system: string; user: string } {
  const system = `You are a text adventure game narrator writing the opening scene of a new story.
Setting: ${seed.setting}.
The player is: ${seed.protagonist}.
The story hook: ${seed.hook}.
Theme: ${seed.theme}.

Write an atmospheric opening scene in 3-5 sentences that:
- Establishes mood and location immediately.
- Naturally weaves in what the protagonist has on them or within arm's reach — do not list items robotically.
- Ends with a single flavourful hint toward a possible first action (not a question, not a menu of options).
Write in second person, present tense. Do not ask the player anything. Do not use bullet points or headers.`;

  const user = scene?.items.length
    ? `Items present in this scene: ${scene.items.join(", ")}.\nBegin the story.`
    : "Begin the story.";

  return { system, user };
}

export function buildUserPrompt(ctx: PromptContext): string {
  const historyStr = ctx.history
    .slice(-5)
    .map((h) => `Player: ${h.player}\nNarrator: ${h.ai}`)
    .join("\n\n");

  return `${historyStr ? historyStr + "\n\n" : ""}Player: ${ctx.intent.raw}`;
}
