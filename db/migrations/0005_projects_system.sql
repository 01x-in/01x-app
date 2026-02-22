-- Projects System Migration
-- This migration creates the complete Projects system for 01X platform
-- Supporting Zero (Idea) → One (MVP) → X (Scale) progression

-- ============================================================================
-- Members Table
-- ============================================================================
-- Unified table for all platform members (students, mentors, etc.)
-- Links to existing mentors table via email/unique identifier
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY, -- UUID or unique identifier
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- Basic Info
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,

  -- Member Type
  member_type TEXT NOT NULL DEFAULT 'student', -- 'student', 'mentor', 'both'

  -- Links
  mentor_id TEXT, -- Reference to mentors table if they are a mentor
  linkedin_url TEXT,
  github_url TEXT,
  website_url TEXT,

  -- Profile
  tech_stack TEXT, -- JSON array of technologies
  areas_of_interest TEXT, -- JSON array

  -- Status
  is_active INTEGER NOT NULL DEFAULT 1,

  FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_type ON members(member_type);
CREATE INDEX IF NOT EXISTS idx_members_active ON members(is_active);

-- ============================================================================
-- Cohorts Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS cohorts (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- Basic Info
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,

  -- Timing
  start_date TEXT,
  end_date TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'upcoming', -- 'upcoming', 'active', 'completed', 'archived'
  is_active INTEGER NOT NULL DEFAULT 1,

  -- Meta
  cohort_number INTEGER,
  max_members INTEGER,

  -- Image
  cover_image_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_cohorts_status ON cohorts(status);
CREATE INDEX IF NOT EXISTS idx_cohorts_active ON cohorts(is_active);

-- ============================================================================
-- Cohort Memberships (Many-to-Many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cohort_memberships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  cohort_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student', -- 'student', 'mentor'

  FOREIGN KEY (cohort_id) REFERENCES cohorts(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,

  UNIQUE(cohort_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_cohort_memberships_cohort ON cohort_memberships(cohort_id);
CREATE INDEX IF NOT EXISTS idx_cohort_memberships_member ON cohort_memberships(member_id);

-- ============================================================================
-- Projects Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- Basic Info
  title TEXT NOT NULL,
  tagline TEXT, -- 1-line summary
  description TEXT, -- Long form description

  -- Stage & Visibility
  stage TEXT NOT NULL DEFAULT 'zero', -- 'zero' (Idea), 'one' (MVP), 'x' (Scale)
  visibility TEXT NOT NULL DEFAULT 'private', -- 'private', 'collaborators', 'public'
  published INTEGER NOT NULL DEFAULT 0, -- boolean: can only be 1 if stage is 'one' or 'x'

  -- Creator
  creator_id TEXT NOT NULL,

  -- Associations
  cohort_id TEXT, -- Optional: project built in a cohort

  -- Media
  cover_image_url TEXT,
  demo_video_url TEXT,
  product_url TEXT, -- Live product link
  github_url TEXT,
  screenshots TEXT, -- JSON array of image URLs

  -- Technical
  tech_stack TEXT, -- JSON array of technologies
  problem_statement TEXT,
  target_audience TEXT,
  one_pager TEXT, -- Markdown formatted overview

  -- Scale Metrics (only for stage 'x')
  metrics TEXT, -- JSON object: { users, revenue, growth_percentage }
  testimonials TEXT, -- JSON array of testimonial objects
  launch_date TEXT,

  -- Community Features
  upvotes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,

  -- Flags
  request_feedback INTEGER NOT NULL DEFAULT 0, -- boolean
  looking_for_collaborators INTEGER NOT NULL DEFAULT 0, -- boolean
  is_featured INTEGER NOT NULL DEFAULT 0, -- Manual curation for homepage

  -- Ranking
  featured_rank INTEGER DEFAULT 999, -- Lower = higher priority on homepage

  FOREIGN KEY (creator_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (cohort_id) REFERENCES cohorts(id) ON DELETE SET NULL,

  -- Constraint: published can only be 1 if stage is 'one' or 'x'
  CHECK (
    (published = 0) OR
    (published = 1 AND stage IN ('one', 'x'))
  ),

  -- Constraint: visibility cannot be 'public' if stage is 'zero'
  CHECK (
    (stage != 'zero') OR
    (stage = 'zero' AND visibility IN ('private', 'collaborators'))
  )
);

CREATE INDEX IF NOT EXISTS idx_projects_creator ON projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_cohort ON projects(cohort_id);
CREATE INDEX IF NOT EXISTS idx_projects_stage ON projects(stage);
CREATE INDEX IF NOT EXISTS idx_projects_visibility ON projects(visibility);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_upvotes ON projects(upvotes_count);

-- ============================================================================
-- Project Collaborators (Many-to-Many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_collaborators (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  project_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  role TEXT DEFAULT 'collaborator', -- 'collaborator', 'contributor', etc.

  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,

  UNIQUE(project_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_project_collaborators_project ON project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_member ON project_collaborators(member_id);

-- ============================================================================
-- Project Mentors (Many-to-Many)
-- ============================================================================
-- Links mentors who are guiding/advising a project
CREATE TABLE IF NOT EXISTS project_mentors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  project_id TEXT NOT NULL,
  mentor_id TEXT NOT NULL, -- References mentors table

  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE,

  UNIQUE(project_id, mentor_id)
);

CREATE INDEX IF NOT EXISTS idx_project_mentors_project ON project_mentors(project_id);
CREATE INDEX IF NOT EXISTS idx_project_mentors_mentor ON project_mentors(mentor_id);

-- ============================================================================
-- Project Upvotes (Many-to-Many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_upvotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  project_id TEXT NOT NULL,
  member_id TEXT NOT NULL,

  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,

  UNIQUE(project_id, member_id) -- One upvote per member per project
);

CREATE INDEX IF NOT EXISTS idx_project_upvotes_project ON project_upvotes(project_id);
CREATE INDEX IF NOT EXISTS idx_project_upvotes_member ON project_upvotes(member_id);

-- ============================================================================
-- Project Comments
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_comments (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  project_id TEXT NOT NULL,
  member_id TEXT NOT NULL,

  content TEXT NOT NULL,

  -- Nested comments (replies)
  parent_comment_id TEXT,

  -- Moderation
  is_deleted INTEGER NOT NULL DEFAULT 0,

  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_comment_id) REFERENCES project_comments(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_project_comments_project ON project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_member ON project_comments(member_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_parent ON project_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_created ON project_comments(created_at);

-- ============================================================================
-- Triggers for Updated At
-- ============================================================================

-- Update members.updated_at
CREATE TRIGGER IF NOT EXISTS trigger_members_updated_at
AFTER UPDATE ON members
FOR EACH ROW
BEGIN
  UPDATE members SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Update projects.updated_at
CREATE TRIGGER IF NOT EXISTS trigger_projects_updated_at
AFTER UPDATE ON projects
FOR EACH ROW
BEGIN
  UPDATE projects SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Update project_comments.updated_at
CREATE TRIGGER IF NOT EXISTS trigger_project_comments_updated_at
AFTER UPDATE ON project_comments
FOR EACH ROW
BEGIN
  UPDATE project_comments SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ============================================================================
-- Triggers for Upvotes Count
-- ============================================================================

-- Increment upvotes_count when upvote added
CREATE TRIGGER IF NOT EXISTS trigger_project_upvote_added
AFTER INSERT ON project_upvotes
FOR EACH ROW
BEGIN
  UPDATE projects
  SET upvotes_count = upvotes_count + 1
  WHERE id = NEW.project_id;
END;

-- Decrement upvotes_count when upvote removed
CREATE TRIGGER IF NOT EXISTS trigger_project_upvote_removed
AFTER DELETE ON project_upvotes
FOR EACH ROW
BEGIN
  UPDATE projects
  SET upvotes_count = upvotes_count - 1
  WHERE id = OLD.project_id;
END;

-- ============================================================================
-- Triggers for Comments Count
-- ============================================================================

-- Increment comments_count when comment added
CREATE TRIGGER IF NOT EXISTS trigger_project_comment_added
AFTER INSERT ON project_comments
FOR EACH ROW
WHEN NEW.is_deleted = 0
BEGIN
  UPDATE projects
  SET comments_count = comments_count + 1
  WHERE id = NEW.project_id;
END;

-- Decrement comments_count when comment soft deleted
CREATE TRIGGER IF NOT EXISTS trigger_project_comment_deleted
AFTER UPDATE OF is_deleted ON project_comments
FOR EACH ROW
WHEN NEW.is_deleted = 1 AND OLD.is_deleted = 0
BEGIN
  UPDATE projects
  SET comments_count = comments_count - 1
  WHERE id = NEW.project_id;
END;

-- Decrement comments_count when comment hard deleted
CREATE TRIGGER IF NOT EXISTS trigger_project_comment_removed
AFTER DELETE ON project_comments
FOR EACH ROW
WHEN OLD.is_deleted = 0
BEGIN
  UPDATE projects
  SET comments_count = comments_count - 1
  WHERE id = OLD.project_id;
END;
