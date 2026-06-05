-- Migrate applications and mentor_applications from INTEGER AUTOINCREMENT
-- to TEXT UUID primary keys — consistent with every other entity table.
-- Also adds CHECK constraints on status (previously just a comment).
-- Test data only — tables are dropped and recreated clean.

DROP TABLE IF EXISTS applications;
CREATE TABLE applications (
  id         TEXT NOT NULL PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  status     TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'approved', 'rejected')),

  -- Demographics
  full_name        TEXT NOT NULL,
  email            TEXT NOT NULL,
  location         TEXT,
  linkedin_url     TEXT,

  -- Product Vision
  what_building    TEXT,
  why_matters      TEXT,
  current_approach TEXT,
  problem_solved   TEXT,

  -- Current Stage
  current_stage    TEXT,
  product_link     TEXT,

  -- Team
  has_cofounder    TEXT,
  open_to_connect  TEXT,

  -- Technical Profile
  background       TEXT,
  primary_skill    TEXT,
  superpower       TEXT,

  -- Commitment
  hours_per_week   TEXT,
  investment_range TEXT,

  -- Expectations
  primary_goal      TEXT,
  success_looks_like TEXT,
  wants_mentors     TEXT,

  -- Strategic
  tried_before    TEXT,
  what_happened   TEXT,
  biggest_blocker TEXT,
  heard_from      TEXT,
  why_now         TEXT,
  ready_to_commit TEXT,

  -- Community
  comfortable_public TEXT,
  willing_to_help    TEXT,

  -- Closing
  biggest_fear  TEXT,
  specific_help TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_email_unique ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status  ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created ON applications(created_at);

-- ──────────────────────────────────────────────────────────────────────────

DROP TABLE IF EXISTS mentor_applications;
CREATE TABLE mentor_applications (
  id         TEXT NOT NULL PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  status     TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'approved', 'rejected')),

  -- Profile
  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  title        TEXT NOT NULL,
  location     TEXT,
  linkedin_url TEXT,
  twitter_url  TEXT,

  -- Expertise
  domains          TEXT,
  years_experience TEXT,
  bio_short        TEXT,
  biggest_win      TEXT,
  best_at          TEXT,

  -- Mentoring Style
  mentoring_approach TEXT,
  why_mentor         TEXT,
  ideal_mentee       TEXT,

  -- Availability
  one_on_one_frequency TEXT,
  async_feedback       TEXT,
  weekend_sessions     TEXT,

  -- Closing
  heard_about_us TEXT,
  anything_else  TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mentor_apps_email_unique ON mentor_applications(email);
CREATE INDEX IF NOT EXISTS idx_mentor_apps_status  ON mentor_applications(status);
CREATE INDEX IF NOT EXISTS idx_mentor_apps_created ON mentor_applications(created_at);
