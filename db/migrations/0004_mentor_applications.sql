-- Migration: Mentor applications table
-- Captures responses from the /mentor/apply conversational flow

CREATE TABLE IF NOT EXISTS mentor_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL DEFAULT 'pending',        -- pending | approved | rejected

  -- Profile
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,

  -- Expertise
  domains TEXT,                  -- selected primary domain
  years_experience TEXT,
  bio_short TEXT,
  biggest_win TEXT,
  best_at TEXT,

  -- Mentoring Style
  mentoring_approach TEXT,
  why_mentor TEXT,
  ideal_mentee TEXT,

  -- Availability
  one_on_one_frequency TEXT,     -- weekly | biweekly | monthly
  async_feedback TEXT,
  weekend_sessions TEXT,

  -- Closing
  heard_about_us TEXT,
  anything_else TEXT
);

CREATE INDEX IF NOT EXISTS idx_mentor_apps_email ON mentor_applications(email);
CREATE INDEX IF NOT EXISTS idx_mentor_apps_status ON mentor_applications(status);
CREATE INDEX IF NOT EXISTS idx_mentor_apps_created ON mentor_applications(created_at);
