-- ============================================================================
-- Schema Cleanup: Fix all design smells identified in audit
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. updated_at triggers — members, projects, cohorts, project_comments
--    (users already has one; these were missing)
-- ────────────────────────────────────────────────────────────────────────────

CREATE TRIGGER IF NOT EXISTS trigger_members_updated_at
AFTER UPDATE ON members
FOR EACH ROW
BEGIN
  UPDATE members SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trigger_projects_updated_at
AFTER UPDATE ON projects
FOR EACH ROW
BEGIN
  UPDATE projects SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trigger_cohorts_updated_at
AFTER UPDATE ON cohorts
FOR EACH ROW
BEGIN
  UPDATE cohorts SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trigger_project_comments_updated_at
AFTER UPDATE ON project_comments
FOR EACH ROW
BEGIN
  UPDATE project_comments SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ────────────────────────────────────────────────────────────────────────────
-- 2. Unique email on applications tables
--    Prevents the same person being approved twice → two Clerk users
-- ────────────────────────────────────────────────────────────────────────────

CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_email_unique
  ON applications(email);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mentor_applications_email_unique
  ON mentor_applications(email);

-- ────────────────────────────────────────────────────────────────────────────
-- 3. Drop mentors.image_alt — presentation data; derive from name in app layer
-- ────────────────────────────────────────────────────────────────────────────

ALTER TABLE mentors DROP COLUMN image_alt;

-- ────────────────────────────────────────────────────────────────────────────
-- 4. Recreate join tables without surrogate INTEGER id
--    No production data — drop and recreate cleanly.
-- ────────────────────────────────────────────────────────────────────────────

DROP TABLE IF EXISTS project_collaborators;
CREATE TABLE project_collaborators (
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

DROP TABLE IF EXISTS project_mentors;
CREATE TABLE project_mentors (
  project_id TEXT NOT NULL,
  mentor_id  TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (project_id, mentor_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (mentor_id)  REFERENCES mentors(id)  ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_project_mentors_project ON project_mentors(project_id);
CREATE INDEX IF NOT EXISTS idx_project_mentors_mentor  ON project_mentors(mentor_id);

DROP TABLE IF EXISTS project_upvotes;
CREATE TABLE project_upvotes (
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
AFTER INSERT ON project_upvotes
FOR EACH ROW
BEGIN
  UPDATE projects SET upvotes_count = upvotes_count + 1 WHERE id = NEW.project_id;
END;

CREATE TRIGGER IF NOT EXISTS trigger_project_upvote_removed
AFTER DELETE ON project_upvotes
FOR EACH ROW
BEGIN
  UPDATE projects SET upvotes_count = MAX(0, upvotes_count - 1) WHERE id = OLD.project_id;
END;

DROP TABLE IF EXISTS cohort_memberships;
CREATE TABLE cohort_memberships (
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
