-- ──────────────────────────────────────────────────────────────────────────────
-- 0004_mentors_drop_style_availability.sql — Drop mentoring_style/availability
--
-- "Mentoring style" and "Availability" (async feedback, weekend sessions,
-- 1:1 frequency) were removed from the admin mentor form, CSV import, and
-- public mentor profile/cards. The columns are no longer written or read.
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE mentors DROP COLUMN mentoring_style;
ALTER TABLE mentors DROP COLUMN availability;
