-- Replace `featured` with `is_approved` and `is_featured`
ALTER TABLE mentors ADD COLUMN is_approved INTEGER NOT NULL DEFAULT 0;
ALTER TABLE mentors ADD COLUMN is_featured INTEGER NOT NULL DEFAULT 0;

-- Migrate existing data: featured=1 → both approved and featured
UPDATE mentors SET is_approved = 1, is_featured = featured;

-- Drop old column (SQLite doesn't support DROP COLUMN in all versions,
-- but D1 does support it)
ALTER TABLE mentors DROP COLUMN featured;
