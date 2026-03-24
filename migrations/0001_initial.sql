-- Sessions: one row per game run
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  world_seed TEXT NOT NULL,
  current_beat INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Turns: the full conversation history for a session
CREATE TABLE IF NOT EXISTS turns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  player_input TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  intent TEXT,
  beat INTEGER,
  created_at INTEGER NOT NULL
);

-- Response pool: pre-generated or cached responses keyed by beat + type
CREATE TABLE IF NOT EXISTS response_pool (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  beat INTEGER NOT NULL,
  response_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_turns_session_id ON turns(session_id);
CREATE INDEX IF NOT EXISTS idx_turns_created_at ON turns(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_response_pool_beat ON response_pool(beat, response_type);
