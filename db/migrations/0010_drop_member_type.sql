-- Drop redundant member_type column from members table.
-- Role is derived from users.member_id / users.mentor_id — no need to store it here.
-- Must drop the index first or D1 rejects the column drop.
DROP INDEX IF EXISTS idx_members_type;
ALTER TABLE members DROP COLUMN member_type;
