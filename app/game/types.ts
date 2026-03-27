export interface WorldSeed {
  theme: string;
  setting: string;
  protagonist: string;
  hook: string;
}

export type IntentType = "explore" | "interact" | "pick_up" | "drop" | "combat" | "dialogue" | "examine" | "use" | "other" | "intro";

export interface Intent {
  type: IntentType;
  subject?: string;
  raw: string;
}

export interface Beat {
  id: number;
  name: string;
  description: string;
  keywords: string[];
}

export interface CharacterDef {
  name: string;
  personality: string;
  knowledgeOf: string[];
  ignorantOf: string[];
}

export interface CompletionCondition {
  id: string;
  description: string;
  possibleMethods: string[];
}

export interface BeatScene {
  items: string[];
  characters: CharacterDef[];
  exits: string[];
  constraints: string[];
  completionConditions: CompletionCondition[];
}

export interface WorldRules {
  global: string[];
  scenes: Partial<Record<number, BeatScene>>;
}

export interface NpcState {
  disposition: number;
  interactionCount: number;
}

export type NpcStateMap = Record<string, NpcState>;
