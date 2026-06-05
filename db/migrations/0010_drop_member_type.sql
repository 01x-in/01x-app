-- Drop redundant member_type column from members table.
-- Role is derived from users.member_id / users.mentor_id — no need to store it here.
ALTER TABLE members DROP COLUMN member_type;
