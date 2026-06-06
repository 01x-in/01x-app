-- Migrate applications and mentor_applications from INTEGER AUTOINCREMENT
-- to TEXT UUID primary keys — consistent with every other entity table.
-- No production data — drop and recreate cleanly.
-- Also adds CHECK constraints on status (previously just a comment).

DROP TABLE IF EXISTS applications;
CREATE TABLE applications (
  id         TEXT NOT NULL PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  status     TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'approved', 'rejected')),

  full_name        TEXT NOT NULL,
  email            TEXT NOT NULL,
  location         TEXT,
  linkedin_url     TEXT,
  what_building    TEXT,
  why_matters      TEXT,
  current_approach TEXT,
  problem_solved   TEXT,
  current_stage    TEXT,
  product_link     TEXT,
  has_cofounder    TEXT,
  open_to_connect  TEXT,
  background       TEXT,
  primary_skill    TEXT,
  superpower       TEXT,
  hours_per_week   TEXT,
  investment_range TEXT,
  primary_goal       TEXT,
  success_looks_like TEXT,
  wants_mentors      TEXT,
  tried_before    TEXT,
  what_happened   TEXT,
  biggest_blocker TEXT,
  heard_from      TEXT,
  why_now         TEXT,
  ready_to_commit TEXT,
  comfortable_public TEXT,
  willing_to_help    TEXT,
  biggest_fear  TEXT,
  specific_help TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_email_unique ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status  ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created ON applications(created_at);

DROP TABLE IF EXISTS mentor_applications;
CREATE TABLE mentor_applications (
  id         TEXT NOT NULL PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  status     TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'approved', 'rejected')),

  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  title        TEXT NOT NULL,
  location     TEXT,
  linkedin_url TEXT,
  twitter_url  TEXT,
  domains          TEXT,
  years_experience TEXT,
  bio_short        TEXT,
  biggest_win      TEXT,
  best_at          TEXT,
  mentoring_approach TEXT,
  why_mentor         TEXT,
  ideal_mentee       TEXT,
  one_on_one_frequency TEXT,
  async_feedback       TEXT,
  weekend_sessions     TEXT,
  heard_about_us TEXT,
  anything_else  TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_mentor_apps_email_unique ON mentor_applications(email);
CREATE INDEX IF NOT EXISTS idx_mentor_apps_status  ON mentor_applications(status);
CREATE INDEX IF NOT EXISTS idx_mentor_apps_created ON mentor_applications(created_at);
