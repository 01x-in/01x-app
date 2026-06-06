-- ──────────────────────────────────────────────────────────────────────────────
-- 0002_inbox.sql — Incoming email inbox (Resend inbound)
--
-- Adds a branded @01x.in inbox address per user and a table of received emails.
-- Bodies are NOT stored; only metadata + the Resend email_id (body is fetched
-- on-demand from the Received Emails API when a message is opened).
-- ──────────────────────────────────────────────────────────────────────────────

-- Branded inbox address, e.g. john.wick@01x.in (members) or john@01x.in (mentors).
-- Nullable so existing rows stay valid; assigned only on new approvals.
ALTER TABLE users ADD COLUMN inbox_email TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_inbox_email ON users(inbox_email);

-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS inbox_messages (
  id               TEXT NOT NULL PRIMARY KEY,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  user_id          TEXT NOT NULL,
  resend_email_id  TEXT NOT NULL UNIQUE,         -- for on-demand body fetch + idempotency
  message_id       TEXT,                         -- RFC Message-ID from the sender
  from_address     TEXT,
  from_name        TEXT,
  to_address       TEXT,                          -- the @01x.in address it was routed to
  subject          TEXT,
  has_attachments  INTEGER NOT NULL DEFAULT 0,    -- 1 = has attachments
  attachments_json TEXT,                          -- JSON array of attachment metadata
  is_read          INTEGER NOT NULL DEFAULT 0,    -- 1 = read
  received_at      TEXT,                          -- Resend data.created_at
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_inbox_messages_user
  ON inbox_messages(user_id, received_at DESC);
