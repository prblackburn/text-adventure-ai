export interface WorldSeed {
  theme: string;
  setting: string;
  protagonist: string;
  hook: string;
}

export type IntentType = "explore" | "interact" | "combat" | "dialogue" | "examine" | "use" | "other";

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
