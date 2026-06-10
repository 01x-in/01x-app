-- ──────────────────────────────────────────────────────────────────────────────
-- 0003_users_email_unique.sql — Enforce unique user emails at the DB level
--
-- The application-level duplicate check in createMentorUser (SELECT then
-- INSERT) is not atomic; two concurrent requests for the same email could
-- both pass the check. This unique index is the last-resort guard — D1
-- rejects the second INSERT, which createMentorUser maps back to
-- DuplicateUserError.
--
-- Note: if any existing rows share an email (case-sensitive), this migration
-- will fail until those rows are de-duplicated first.
-- ──────────────────────────────────────────────────────────────────────────────

DROP INDEX IF EXISTS idx_users_email;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email);
