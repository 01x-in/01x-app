-- Applications table: stores form submissions (mirrors FormData type)
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL DEFAULT 'pending',

  -- Demographics
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT,
  linkedin_url TEXT,

  -- Product Vision
  what_building TEXT,
  why_matters TEXT,
  current_approach TEXT,
  problem_solved TEXT,

  -- Current Stage
  current_stage TEXT,
  product_link TEXT,

  -- Team
  has_cofounder TEXT,
  open_to_connect TEXT,

  -- Technical Profile
  background TEXT,
  primary_skill TEXT,
  superpower TEXT,

  -- Commitment
  hours_per_week TEXT,
  investment_range TEXT,

  -- Expectations
  primary_goal TEXT,
  success_looks_like TEXT,
  wants_mentors TEXT,

  -- Strategic
  tried_before TEXT,
  what_happened TEXT,
  biggest_blocker TEXT,
  heard_from TEXT,
  why_now TEXT,
  ready_to_commit TEXT,

  -- Community
  comfortable_public TEXT,
  willing_to_help TEXT,

  -- Closing
  biggest_fear TEXT,
  specific_help TEXT
);

-- Mentors table
CREATE TABLE IF NOT EXISTS mentors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  domains TEXT NOT NULL,           -- JSON array e.g. ["Product","Growth"]
  bio_short TEXT NOT NULL,
  bio_long TEXT,
  highlights TEXT NOT NULL,        -- JSON array
  mentoring_style TEXT NOT NULL,   -- JSON array
  availability TEXT NOT NULL,      -- JSON object
  socials TEXT,                    -- JSON object (nullable)
  location TEXT,
  image_src TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0,
  sort_rank INTEGER NOT NULL DEFAULT 999
);

-- Index for querying applications by email or status
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created ON applications(created_at);
