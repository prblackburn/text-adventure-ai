import type { Intent } from "../game/types";

// Only these intent types produce responses generic enough to cache across sessions.
const CACHEABLE_INTENTS = new Set(["examine", "explore"]);

// Subjects that indicate the player is looking at the room/area in general.
const GENERIC_SUBJECTS = new Set(["room", "area", "surroundings", "around", "here", "place", "space", ""]);

export function buildCacheKey(intent: Intent, ruleIndex: number | undefined): string | null {
  if (!CACHEABLE_INTENTS.has(intent.type)) return null;
  const subject = (intent.subject ?? "").toLowerCase().trim().split(/\s+/)[0] ?? "";
  if (!GENERIC_SUBJECTS.has(subject)) return null;
  const theme = ruleIndex ?? "default";
  return `${theme}:${intent.type}:${subject || "room"}`;
}

export async function getCachedResponse(
  db: D1Database,
  beat: number,
  cacheKey: string
): Promise<string | null> {
  const row = await db
    .prepare("SELECT content FROM response_pool WHERE beat = ? AND response_type = ? LIMIT 1")
    .bind(beat, cacheKey)
    .first<{ content: string }>();
  return row?.content ?? null;
}

export async function setCachedResponse(
  db: D1Database,
  beat: number,
  cacheKey: string,
  content: string
): Promise<void> {
  await db
    .prepare("INSERT INTO response_pool (beat, response_type, content) VALUES (?, ?, ?)")
    .bind(beat, cacheKey, content)
    .run();
}
