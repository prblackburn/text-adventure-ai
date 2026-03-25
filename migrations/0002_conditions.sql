-- Add completed_conditions tracking to sessions
ALTER TABLE sessions ADD COLUMN completed_conditions TEXT NOT NULL DEFAULT '[]';
