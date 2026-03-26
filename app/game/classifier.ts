import type { Intent, IntentType } from "./types";

const INTENT_PATTERNS: Record<Exclude<IntentType, "other" | "intro">, string[]> = {
  explore: ["go", "walk", "move", "travel", "head", "explore", "navigate", "run"],
  pick_up: ["take", "grab", "pick", "get", "collect"],
  drop: ["drop", "leave", "discard", "put"],
  interact: ["push", "pull", "open", "close", "touch"],
  combat: ["attack", "fight", "hit", "strike", "shoot", "kill", "stab", "slash"],
  dialogue: ["talk", "say", "ask", "tell", "speak", "shout", "whisper", "greet"],
  examine: ["look", "examine", "inspect", "check", "read", "search", "study"],
  use: ["use", "activate", "equip", "wear", "drink", "eat", "apply"],
};

export function classifyIntent(input: string): Intent {
  const lower = input.toLowerCase();
  const words = lower.split(/\s+/);

  for (const [type, patterns] of Object.entries(INTENT_PATTERNS) as [Exclude<IntentType, "other">, string[]][]) {
    for (const pattern of patterns) {
      if (words.includes(pattern) || lower.startsWith(pattern)) {
        const charIdx = lower.indexOf(pattern);
        const after = input.slice(charIdx + pattern.length).trim();
        const subject = after.length > 0 ? after : undefined;
        return { type, subject, raw: input };
      }
    }
  }

  return { type: "other", raw: input };
}
