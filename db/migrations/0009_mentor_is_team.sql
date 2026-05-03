-- Add is_team flag to identify 01x core team members (founders/builders)
-- Team members serve as primary mentors in the cohort
ALTER TABLE mentors ADD COLUMN is_team INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_mentors_is_team ON mentors(is_team);
