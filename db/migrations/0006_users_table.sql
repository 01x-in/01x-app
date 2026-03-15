-- Users table: bridges Clerk identity to platform roles
-- Each approved application creates a Clerk user + a row here
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,                    -- Internal UUID
  clerk_id TEXT NOT NULL UNIQUE,          -- Clerk user ID (user_xxx)
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,

  -- Role: determines dashboard view
  role TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('admin', 'member', 'mentor')),

  -- Links to platform tables (nullable, set during approval)
  member_id TEXT UNIQUE,
  mentor_id TEXT UNIQUE,

  is_active INTEGER NOT NULL DEFAULT 1,

  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
  FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_users_clerk ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Trigger: auto-update updated_at
CREATE TRIGGER IF NOT EXISTS trigger_users_updated_at
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
END;
