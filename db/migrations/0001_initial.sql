-- ============================================================================
-- 01X Platform — Initial Schema
-- ============================================================================
--
-- Identity model:
--   users.is_admin = 1        → admin
--   users.mentor_id IS NOT NULL → mentor
--   users.member_id IS NOT NULL → student/member
--
-- All entity PKs are TEXT UUIDs generated in the application layer.
-- ============================================================================


-- ============================================================================
-- Inbound Applications (pre-approval, no auth required)
-- ============================================================================

CREATE TABLE IF NOT EXISTS applications (
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
  current_stage TEXT,
  product_link  TEXT,

  -- Team
  has_cofounder   TEXT,
  open_to_connect TEXT,

  -- Technical Profile
  background    TEXT,
  primary_skill TEXT,
  superpower    TEXT,

  -- Commitment
  hours_per_week   TEXT,
  investment_range TEXT,

  -- Expectations
  primary_goal       TEXT,
  success_looks_like TEXT,
  wants_mentors      TEXT,

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

CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_email  ON applications(email);
CREATE INDEX        IF NOT EXISTS idx_applications_status  ON applications(status);
CREATE INDEX        IF NOT EXISTS idx_applications_created ON applications(created_at);

-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS mentor_applications (
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
  one_on_one_frequency TEXT,   -- weekly | biweekly | monthly
  async_feedback       TEXT,
  weekend_sessions     TEXT,

  -- Closing
  heard_about_us TEXT,
  anything_else  TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mentor_apps_email  ON mentor_applications(email);
CREATE INDEX        IF NOT EXISTS idx_mentor_apps_status  ON mentor_applications(status);
CREATE INDEX        IF NOT EXISTS idx_mentor_apps_created ON mentor_applications(created_at);


-- ============================================================================
-- Core Platform Tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS mentors (
  id             TEXT NOT NULL PRIMARY KEY,
  name           TEXT NOT NULL,
  title          TEXT NOT NULL,
  domains        TEXT NOT NULL,          -- JSON array e.g. ["Product","Growth"]
  bio_short      TEXT NOT NULL,
  bio_long       TEXT,
  highlights     TEXT NOT NULL,          -- JSON array
  mentoring_style TEXT NOT NULL,         -- JSON array
  availability   TEXT NOT NULL,          -- JSON object { oneOnOneFrequency, maxMentees, ... }
  socials        TEXT,                   -- JSON object (nullable)
  location       TEXT,
  image_src      TEXT NOT NULL,
  sort_rank      INTEGER NOT NULL DEFAULT 999,
  is_approved    INTEGER NOT NULL DEFAULT 0,
  is_featured    INTEGER NOT NULL DEFAULT 0,
  is_team        INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_mentors_approved ON mentors(is_approved);
CREATE INDEX IF NOT EXISTS idx_mentors_featured ON mentors(is_featured);
CREATE INDEX IF NOT EXISTS idx_mentors_team     ON mentors(is_team);

-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS members (
  id                TEXT NOT NULL PRIMARY KEY,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now')),
  full_name         TEXT NOT NULL,
  email             TEXT NOT NULL UNIQUE,
  avatar_url        TEXT,
  bio               TEXT,
  location          TEXT,
  linkedin_url      TEXT,
  github_url        TEXT,
  website_url       TEXT,
  tech_stack        TEXT,               -- JSON array
  areas_of_interest TEXT,               -- JSON array
  is_active         INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_members_email  ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_active ON members(is_active);

CREATE TRIGGER IF NOT EXISTS trigger_members_updated_at
AFTER UPDATE ON members FOR EACH ROW
BEGIN
  UPDATE members SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id         TEXT NOT NULL PRIMARY KEY,
  clerk_id   TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  email      TEXT NOT NULL,
  full_name  TEXT NOT NULL,
  avatar_url TEXT,
  is_admin   INTEGER NOT NULL DEFAULT 0,    -- 1 = admin
  member_id  TEXT UNIQUE,                   -- set → student/member
  mentor_id  TEXT UNIQUE,                   -- set → mentor
  is_active  INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
  FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_users_clerk  ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email  ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

CREATE TRIGGER IF NOT EXISTS trigger_users_updated_at
AFTER UPDATE ON users FOR EACH ROW
BEGIN
  UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cohorts (
  id             TEXT NOT NULL PRIMARY KEY,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now')),
  name           TEXT NOT NULL,
  tagline        TEXT,
  description    TEXT,
  start_date     TEXT,
  end_date       TEXT,
  status         TEXT NOT NULL DEFAULT 'upcoming'
                   CHECK (status IN ('upcoming', 'active', 'completed', 'archived')),
  is_active      INTEGER NOT NULL DEFAULT 1,
  cohort_number  INTEGER,
  max_members    INTEGER,
  cover_image_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_cohorts_status ON cohorts(status);
CREATE INDEX IF NOT EXISTS idx_cohorts_active ON cohorts(is_active);

CREATE TRIGGER IF NOT EXISTS trigger_cohorts_updated_at
AFTER UPDATE ON cohorts FOR EACH ROW
BEGIN
  UPDATE cohorts SET updated_at = datetime('now') WHERE id = NEW.id;
END;


-- ============================================================================
-- Projects
-- ============================================================================

CREATE TABLE IF NOT EXISTS projects (
  id          TEXT NOT NULL PRIMARY KEY,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),

  title       TEXT NOT NULL,
  tagline     TEXT,
  description TEXT,

  stage      TEXT NOT NULL DEFAULT 'zero'
               CHECK (stage IN ('zero', 'one', 'x')),
  visibility TEXT NOT NULL DEFAULT 'private'
               CHECK (visibility IN ('private', 'collaborators', 'public')),
  published  INTEGER NOT NULL DEFAULT 0,

  creator_id TEXT NOT NULL,
  cohort_id  TEXT,

  -- Media
  cover_image_url TEXT,
  demo_video_url  TEXT,
  product_url     TEXT,
  github_url      TEXT,
  screenshots     TEXT,                  -- JSON array of image URLs

  -- Technical
  tech_stack        TEXT,                -- JSON array
  problem_statement TEXT,
  target_audience   TEXT,
  one_pager         TEXT,                -- Markdown

  -- Scale metrics (stage 'x' only)
  metrics      TEXT,                     -- JSON object
  testimonials TEXT,                     -- JSON array
  launch_date  TEXT,

  -- Community
  upvotes_count          INTEGER NOT NULL DEFAULT 0,
  comments_count         INTEGER NOT NULL DEFAULT 0,
  request_feedback       INTEGER NOT NULL DEFAULT 0,
  looking_for_collaborators INTEGER NOT NULL DEFAULT 0,

  -- Curation
  is_featured          INTEGER NOT NULL DEFAULT 0,
  featured_rank        INTEGER NOT NULL DEFAULT 999,
  login_screen_showcase INTEGER NOT NULL DEFAULT 0,
  founder_quote        TEXT,

  FOREIGN KEY (creator_id) REFERENCES members(id) ON DELETE RESTRICT,
  FOREIGN KEY (cohort_id)  REFERENCES cohorts(id)  ON DELETE SET NULL,

  CHECK ((published = 0) OR (published = 1 AND stage IN ('one', 'x'))),
  CHECK ((stage != 'zero') OR (visibility IN ('private', 'collaborators')))
);

CREATE INDEX IF NOT EXISTS idx_projects_creator  ON projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_cohort   ON projects(cohort_id);
CREATE INDEX IF NOT EXISTS idx_projects_stage    ON projects(stage);
CREATE INDEX IF NOT EXISTS idx_projects_visibility ON projects(visibility);
CREATE INDEX IF NOT EXISTS idx_projects_published  ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured   ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_showcase   ON projects(login_screen_showcase);
CREATE INDEX IF NOT EXISTS idx_projects_created    ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_upvotes    ON projects(upvotes_count);

CREATE TRIGGER IF NOT EXISTS trigger_projects_updated_at
AFTER UPDATE ON projects FOR EACH ROW
BEGIN
  UPDATE projects SET updated_at = datetime('now') WHERE id = NEW.id;
END;


-- ============================================================================
-- Join Tables (composite PKs — no surrogate id)
-- ============================================================================

CREATE TABLE IF NOT EXISTS cohort_memberships (
  cohort_id  TEXT NOT NULL,
  member_id  TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'student'
               CHECK (role IN ('student', 'mentor')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (cohort_id, member_id),
  FOREIGN KEY (cohort_id) REFERENCES cohorts(id)  ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id)  ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cohort_memberships_cohort ON cohort_memberships(cohort_id);
CREATE INDEX IF NOT EXISTS idx_cohort_memberships_member ON cohort_memberships(member_id);

-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS project_collaborators (
  project_id TEXT NOT NULL,
  member_id  TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'collaborator'
               CHECK (role IN ('collaborator', 'contributor')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (project_id, member_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id)  REFERENCES members(id)  ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_project_collaborators_project ON project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_member  ON project_collaborators(member_id);

-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS project_mentors (
  project_id TEXT NOT NULL,
  mentor_id  TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (project_id, mentor_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (mentor_id)  REFERENCES mentors(id)  ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_project_mentors_project ON project_mentors(project_id);
CREATE INDEX IF NOT EXISTS idx_project_mentors_mentor  ON project_mentors(mentor_id);

-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS project_upvotes (
  project_id TEXT NOT NULL,
  member_id  TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (project_id, member_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id)  REFERENCES members(id)  ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_project_upvotes_project ON project_upvotes(project_id);
CREATE INDEX IF NOT EXISTS idx_project_upvotes_member  ON project_upvotes(member_id);

CREATE TRIGGER IF NOT EXISTS trigger_project_upvote_added
AFTER INSERT ON project_upvotes FOR EACH ROW
BEGIN
  UPDATE projects SET upvotes_count = upvotes_count + 1 WHERE id = NEW.project_id;
END;

CREATE TRIGGER IF NOT EXISTS trigger_project_upvote_removed
AFTER DELETE ON project_upvotes FOR EACH ROW
BEGIN
  UPDATE projects SET upvotes_count = MAX(0, upvotes_count - 1) WHERE id = OLD.project_id;
END;

-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS project_comments (
  id               TEXT NOT NULL PRIMARY KEY,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now')),
  project_id       TEXT NOT NULL,
  member_id        TEXT NOT NULL,
  content          TEXT NOT NULL,
  parent_comment_id TEXT,
  is_deleted       INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (project_id)        REFERENCES projects(id)        ON DELETE CASCADE,
  FOREIGN KEY (member_id)         REFERENCES members(id)         ON DELETE CASCADE,
  FOREIGN KEY (parent_comment_id) REFERENCES project_comments(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_project_comments_project ON project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_member  ON project_comments(member_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_parent  ON project_comments(parent_comment_id);

CREATE TRIGGER IF NOT EXISTS trigger_project_comments_updated_at
AFTER UPDATE ON project_comments FOR EACH ROW
BEGIN
  UPDATE project_comments SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trigger_project_comment_added
AFTER INSERT ON project_comments FOR EACH ROW
WHEN NEW.is_deleted = 0
BEGIN
  UPDATE projects SET comments_count = comments_count + 1 WHERE id = NEW.project_id;
END;

CREATE TRIGGER IF NOT EXISTS trigger_project_comment_deleted
AFTER UPDATE OF is_deleted ON project_comments FOR EACH ROW
WHEN NEW.is_deleted = 1 AND OLD.is_deleted = 0
BEGIN
  UPDATE projects SET comments_count = MAX(0, comments_count - 1) WHERE id = NEW.project_id;
END;

CREATE TRIGGER IF NOT EXISTS trigger_project_comment_removed
AFTER DELETE ON project_comments FOR EACH ROW
WHEN OLD.is_deleted = 0
BEGIN
  UPDATE projects SET comments_count = MAX(0, comments_count - 1) WHERE id = OLD.project_id;
END;
