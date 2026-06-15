-- ──────────────────────────────────────────────────────────────────────────────
-- 0004_mentors_drop_style_availability.sql — Drop mentoring_style/availability
--
-- "Mentoring style" and "Availability" (async feedback, weekend sessions,
-- 1:1 frequency) were removed from the admin mentor form, CSV import, and
-- public mentor profile/cards. The columns are no longer written or read.
--
-- Cloudflare D1 does not support ALTER TABLE ... DROP COLUMN, so the table is
-- recreated without the two columns: create the new table, copy the rows,
-- drop the old table, rename, and recreate the indexes.
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE mentors_new (
  id             TEXT NOT NULL PRIMARY KEY,
  name           TEXT NOT NULL,
  title          TEXT NOT NULL,
  domains        TEXT NOT NULL,
  bio_short      TEXT NOT NULL,
  bio_long       TEXT,
  highlights     TEXT NOT NULL,
  socials        TEXT,
  location       TEXT,
  image_src      TEXT NOT NULL,
  sort_rank      INTEGER NOT NULL DEFAULT 999,
  is_approved    INTEGER NOT NULL DEFAULT 0,
  is_featured    INTEGER NOT NULL DEFAULT 0,
  is_team        INTEGER NOT NULL DEFAULT 0
);

INSERT INTO mentors_new (id, name, title, domains, bio_short, bio_long, highlights, socials, location, image_src, sort_rank, is_approved, is_featured, is_team)
SELECT id, name, title, domains, bio_short, bio_long, highlights, socials, location, image_src, sort_rank, is_approved, is_featured, is_team
FROM mentors;

DROP TABLE mentors;

ALTER TABLE mentors_new RENAME TO mentors;

CREATE INDEX IF NOT EXISTS idx_mentors_approved ON mentors(is_approved);
CREATE INDEX IF NOT EXISTS idx_mentors_featured ON mentors(is_featured);
CREATE INDEX IF NOT EXISTS idx_mentors_team     ON mentors(is_team);
