export interface Session {
  id: string;
  world_seed: string;
  current_beat: number;
  created_at: number;
  updated_at: number;
}

export interface Turn {
  id: number;
  session_id: string;
  player_input: string;
  ai_response: string;
  intent: string | null;
  beat: number | null;
  created_at: number;
}

export async function getSession(db: D1Database, id: string): Promise<Session | null> {
  const result = await db.prepare("SELECT * FROM sessions WHERE id = ?").bind(id).first<Session>();
  return result ?? null;
}

export async function createSession(db: D1Database, session: Pick<Session, "id" | "world_seed" | "current_beat">): Promise<void> {
  const now = Date.now();
  await db
    .prepare("INSERT INTO sessions (id, world_seed, current_beat, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
    .bind(session.id, session.world_seed, session.current_beat, now, now)
    .run();
}

export async function getTurns(db: D1Database, sessionId: string, limit = 20): Promise<Turn[]> {
  const results = await db
    .prepare("SELECT * FROM turns WHERE session_id = ? ORDER BY created_at ASC LIMIT ?")
    .bind(sessionId, limit)
    .all<Turn>();
  return results.results;
}

export async function addTurn(db: D1Database, turn: Omit<Turn, "id" | "created_at">): Promise<void> {
  const now = Date.now();
  await db
    .prepare("INSERT INTO turns (session_id, player_input, ai_response, intent, beat, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(turn.session_id, turn.player_input, turn.ai_response, turn.intent, turn.beat, now)
    .run();
}

export async function updateSessionBeat(db: D1Database, sessionId: string, beat: number): Promise<void> {
  const now = Date.now();
  await db
    .prepare("UPDATE sessions SET current_beat = ?, updated_at = ? WHERE id = ?")
    .bind(beat, now, sessionId)
    .run();
}
