-- Add per-session inventory tracking
ALTER TABLE sessions ADD COLUMN inventory TEXT NOT NULL DEFAULT '[]';
