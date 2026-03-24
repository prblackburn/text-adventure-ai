import type { Beat } from "./types";

export const BEATS: Beat[] = [
  { id: 0, name: "Introduction", description: "The story begins", keywords: ["start", "begin", "new"] },
  { id: 1, name: "Rising Action", description: "Tension builds", keywords: ["explore", "discover"] },
  { id: 2, name: "Confrontation", description: "A challenge arises", keywords: ["fight", "confront", "challenge"] },
  { id: 3, name: "Climax", description: "The critical moment", keywords: ["climax", "decisive", "final"] },
  { id: 4, name: "Resolution", description: "The story concludes", keywords: ["resolve", "end", "finish"] },
];

export function getBeat(id: number): Beat {
  return BEATS[id] ?? BEATS[0];
}
