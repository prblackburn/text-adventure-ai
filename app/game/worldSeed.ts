import type { WorldSeed } from "./types";

const SEEDS: WorldSeed[] = [
  {
    theme: "noir detective",
    setting: "Rain-soaked city, 1940s",
    protagonist: "A weary private detective with a troubled past",
    hook: "A mysterious woman walks into your office with a case that's bigger than it seems.",
  },
  {
    theme: "fantasy dungeon",
    setting: "Ancient underground labyrinth",
    protagonist: "An adventurer seeking lost relics",
    hook: "The entrance collapses behind you. The only way out is through.",
  },
  {
    theme: "sci-fi colony",
    setting: "Remote planet, distant future",
    protagonist: "A colonist with a hidden past",
    hook: "The communication array goes dark. Something is coming.",
  },
];

export function generateSeed(): { seed: WorldSeed; ruleIndex: number } {
  const ruleIndex = Math.floor(Math.random() * SEEDS.length);
  return { seed: SEEDS[ruleIndex], ruleIndex };
}
