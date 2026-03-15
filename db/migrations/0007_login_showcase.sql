-- Add login_screen_showcase boolean to projects table
-- Projects with this flag will appear in the login page carousel
ALTER TABLE projects ADD COLUMN login_screen_showcase INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_projects_login_showcase ON projects(login_screen_showcase);
