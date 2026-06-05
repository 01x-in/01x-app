-- Replace users.role with is_admin flag.
-- Role is now derived: is_admin=1 → admin, mentor_id IS NOT NULL → mentor, member_id IS NOT NULL → member.
ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0;
UPDATE users SET is_admin = 1 WHERE role = 'admin';
DROP INDEX IF EXISTS idx_users_role;
ALTER TABLE users DROP COLUMN role;

-- Drop members.mentor_id — redundant, the link already lives at users.mentor_id.
-- Cannot ALTER TABLE DROP on FK columns in SQLite; recreate the table instead.
CREATE TABLE members_new (
  id                 TEXT NOT NULL PRIMARY KEY,
  created_at         TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at         TEXT NOT NULL DEFAULT (datetime('now')),
  full_name          TEXT NOT NULL,
  email              TEXT NOT NULL UNIQUE,
  avatar_url         TEXT,
  bio                TEXT,
  location           TEXT,
  linkedin_url       TEXT,
  github_url         TEXT,
  website_url        TEXT,
  tech_stack         TEXT,
  areas_of_interest  TEXT,
  is_active          INTEGER NOT NULL DEFAULT 1
);

INSERT INTO members_new
  SELECT id, created_at, updated_at, full_name, email,
         avatar_url, bio, location, linkedin_url, github_url,
         website_url, tech_stack, areas_of_interest, is_active
  FROM members;

DROP TABLE members;
ALTER TABLE members_new RENAME TO members;

CREATE INDEX IF NOT EXISTS idx_members_email  ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_active ON members(is_active);
