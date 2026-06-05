-- Migrate applications and mentor_applications from INTEGER AUTOINCREMENT
-- to TEXT primary keys — consistent with every other entity table.
-- Existing rows are preserved: integer IDs are cast to TEXT strings.
-- Also adds CHECK constraints on status (previously just a comment).

-- ── applications ─────────────────────────────────────────────────────────────

CREATE TABLE applications_new (
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
  primary_goal      TEXT,
  success_looks_like TEXT,
  wants_mentors     TEXT,
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

INSERT INTO applications_new SELECT CAST(id AS TEXT), created_at, status,
  full_name, email, location, linkedin_url,
  what_building, why_matters, current_approach, problem_solved,
  current_stage, product_link, has_cofounder, open_to_connect,
  background, primary_skill, superpower, hours_per_week, investment_range,
  primary_goal, success_looks_like, wants_mentors,
  tried_before, what_happened, biggest_blocker, heard_from, why_now, ready_to_commit,
  comfortable_public, willing_to_help, biggest_fear, specific_help
FROM applications;

DROP TABLE applications;
ALTER TABLE applications_new RENAME TO applications;

CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_email_unique ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status  ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created ON applications(created_at);

-- ── mentor_applications ───────────────────────────────────────────────────────

CREATE TABLE mentor_applications_new (
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

INSERT INTO mentor_applications_new SELECT CAST(id AS TEXT), created_at, status,
  full_name, email, title, location, linkedin_url, twitter_url,
  domains, years_experience, bio_short, biggest_win, best_at,
  mentoring_approach, why_mentor, ideal_mentee,
  one_on_one_frequency, async_feedback, weekend_sessions,
  heard_about_us, anything_else
FROM mentor_applications;

DROP TABLE mentor_applications;
ALTER TABLE mentor_applications_new RENAME TO mentor_applications;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mentor_apps_email_unique ON mentor_applications(email);
CREATE INDEX IF NOT EXISTS idx_mentor_apps_status  ON mentor_applications(status);
CREATE INDEX IF NOT EXISTS idx_mentor_apps_created ON mentor_applications(created_at);
