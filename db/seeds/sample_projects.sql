-- ============================================================
-- Sample Projects — Full Seed (local + remote safe)
-- Run with: pnpm exec wrangler d1 execute 01x-db --remote --file=db/seeds/sample_projects.sql
-- ============================================================

-- -------------------------------------------------------
-- Members (project creators & collaborators)
-- -------------------------------------------------------
INSERT OR IGNORE INTO members (id, full_name, email, avatar_url, member_type, is_active)
VALUES
  ('mem-aditya',       'Aditya Sharma',   'aditya@example.com',  'https://api.dicebear.com/9.x/initials/svg?seed=AS&backgroundColor=d7ff00&fontColor=000000', 'student', 1),
  ('mem-priya',        'Priya Nair',      'priya@example.com',   'https://api.dicebear.com/9.x/initials/svg?seed=PN&backgroundColor=a855f7&fontColor=ffffff',  'student', 1),
  ('mem-rohan',        'Rohan Mehta',     'rohan@example.com',   'https://api.dicebear.com/9.x/initials/svg?seed=RM&backgroundColor=3b82f6&fontColor=ffffff',  'student', 1),
  ('mem-saanya',       'Saanya Kapoor',   'saanya@example.com',  'https://api.dicebear.com/9.x/initials/svg?seed=SK&backgroundColor=f97316&fontColor=ffffff',  'student', 1),
  ('mem-vikram',       'Vikram Singh',    'vikram@example.com',  'https://api.dicebear.com/9.x/initials/svg?seed=VS&backgroundColor=10b981&fontColor=ffffff',  'student', 1),
  ('mem-tanisha',      'Tanisha Gupta',   'tanisha@example.com', 'https://api.dicebear.com/9.x/initials/svg?seed=TG&backgroundColor=ec4899&fontColor=ffffff',  'student', 1),
  ('mem-arjun',        'Arjun Reddy',     'arjun@example.com',   'https://api.dicebear.com/9.x/initials/svg?seed=AR&backgroundColor=6366f1&fontColor=ffffff',  'student', 1),
  ('mem-nisha',        'Nisha Patel',     'nisha@example.com',   'https://api.dicebear.com/9.x/initials/svg?seed=NP&backgroundColor=f59e0b&fontColor=000000',  'student', 1),
  -- v2 additions
  ('mem-karan-mentor', 'Karan Bajaj',     'karan@example.com',   'https://api.dicebear.com/9.x/initials/svg?seed=KB&backgroundColor=1d4ed8&fontColor=ffffff',  'mentor',  1),
  ('mem-isha',         'Isha Malhotra',   'isha@example.com',    'https://api.dicebear.com/9.x/initials/svg?seed=IM&backgroundColor=7c3aed&fontColor=ffffff',  'student', 1),
  ('mem-dev',          'Dev Khanna',      'dev@example.com',     'https://api.dicebear.com/9.x/initials/svg?seed=DK&backgroundColor=0891b2&fontColor=ffffff',  'student', 1),
  ('mem-zara',         'Zara Siddiqui',   'zara@example.com',    'https://api.dicebear.com/9.x/initials/svg?seed=ZS&backgroundColor=be185d&fontColor=ffffff',  'student', 1);

-- -------------------------------------------------------
-- Projects — Solo builders
-- -------------------------------------------------------
INSERT OR IGNORE INTO projects (
  id, title, tagline, description, stage, visibility, published,
  creator_id, tech_stack, product_url, github_url,
  upvotes_count, is_featured, featured_rank
) VALUES
  (
    'proj-learnloop',
    'LearnLoop',
    'AI-powered spaced repetition for technical concepts',
    'LearnLoop uses GPT-4 to generate personalised flashcards from any study material and surfaces them at the optimal moment using spaced repetition algorithms.',
    'x', 'public', 1, 'mem-aditya',
    '["Next.js","TypeScript","OpenAI","Supabase","Vercel"]',
    'https://learnloop.example.com', 'https://github.com/example/learnloop',
    42, 1, 1
  ),
  (
    'proj-shipfast',
    'ShipFast India',
    'Next.js SaaS boilerplate built for Indian founders',
    'A production-ready Next.js template with Razorpay, Supabase auth, and a Tailwind design system — everything an Indian founder needs to go live in a weekend.',
    'x', 'public', 1, 'mem-priya',
    '["Next.js","Tailwind","Supabase","Razorpay","Resend"]',
    'https://shipfastindia.example.com', 'https://github.com/example/shipfast-india',
    37, 1, 2
  ),
  (
    'proj-folio',
    'Folio',
    'Portfolio builder that turns LinkedIn into a live site',
    'Paste your LinkedIn URL, and Folio generates a fully editable, beautifully designed portfolio site in under 60 seconds. No design skills needed.',
    'one', 'public', 1, 'mem-rohan',
    '["React","Node.js","Puppeteer","Cloudflare Workers"]',
    'https://getfolio.example.com', 'https://github.com/example/folio',
    28, 1, 3
  ),
  (
    'proj-standups',
    'DailyDrop',
    'Async standup tool for remote teams across timezones',
    'DailyDrop replaces live standups with 60-second async video updates. Teams stay aligned without scheduling headaches.',
    'one', 'public', 1, 'mem-saanya',
    '["Vue.js","FastAPI","WebRTC","Cloudflare R2"]',
    'https://dailydrop.example.com', NULL,
    21, 1, 4
  ),
  (
    'proj-pocketcfo',
    'PocketCFO',
    'Plain-language financial insights for bootstrapped startups',
    'Connect your bank or Stripe account and PocketCFO explains your runway, burn rate, and growth in plain language — no spreadsheets required.',
    'x', 'public', 1, 'mem-vikram',
    '["Next.js","Plaid","OpenAI","PostgreSQL","Stripe"]',
    'https://pocketcfo.example.com', 'https://github.com/example/pocketcfo',
    19, 1, 5
  ),
  (
    'proj-mentorme',
    'MentorMe',
    'Find and schedule 1:1s with senior engineers in your niche',
    'A focused marketplace for synchronous 1:1 mentoring sessions. Pay-per-session, no subscriptions, matched by tech stack and career goal.',
    'one', 'public', 1, 'mem-tanisha',
    '["Next.js","Prisma","Calendly API","Stripe","Tailwind"]',
    'https://mentorme.example.com', NULL,
    15, 1, 6
  ),
  (
    'proj-grepsearch',
    'GrepSearch',
    'Semantically search your own notes and docs in real time',
    'GrepSearch embeds all your notes with OpenAI and lets you search them conversationally. Works with Notion, Obsidian, and plain markdown folders.',
    'one', 'public', 1, 'mem-arjun',
    '["Electron","TypeScript","OpenAI","SQLite","LanceDB"]',
    'https://grepsearch.example.com', 'https://github.com/example/grepsearch',
    12, 1, 7
  ),
  (
    'proj-tasveer',
    'Tasveer',
    'WhatsApp bot that turns family photos into printed albums',
    'Send photos to a WhatsApp number, and Tasveer automatically compiles them into a print-ready photo album delivered to your door.',
    'x', 'public', 1, 'mem-nisha',
    '["Twilio","Node.js","Cloudflare Workers","Sharp","Printful API"]',
    'https://tasveer.example.com', NULL,
    9, 1, 8
  );

-- -------------------------------------------------------
-- Projects — Multi-builder & Mentor-built
-- -------------------------------------------------------

-- Mentor-built solo
INSERT OR IGNORE INTO projects (
  id, title, tagline, description, stage, visibility, published,
  creator_id, tech_stack, product_url, upvotes_count, is_featured, featured_rank
) VALUES (
  'proj-stacklens',
  'StackLens',
  'Code review tool that flags architectural debt before it compounds',
  'Built by a senior engineer after years of firefighting legacy codebases. StackLens statically analyses your repo and surfaces architectural risks with actionable remediation steps — not just lint warnings.',
  'x', 'public', 1, 'mem-karan-mentor',
  '["Rust","TypeScript","Tree-sitter","Cloudflare Workers","React"]',
  'https://stacklens.example.com',
  31, 1, 9
);

-- 3-student team
INSERT OR IGNORE INTO projects (
  id, title, tagline, description, stage, visibility, published,
  creator_id, tech_stack, product_url, github_url, upvotes_count, is_featured, featured_rank
) VALUES (
  'proj-campuslink',
  'CampusLink',
  'Alumni-to-student mentorship marketplace for Indian colleges',
  'Three friends built CampusLink after struggling to find seniors who could help with placements. It matches students with verified alumni for mock interviews, resume reviews, and career guidance.',
  'one', 'public', 1, 'mem-isha',
  '["Next.js","Prisma","PostgreSQL","Razorpay","Resend"]',
  'https://campuslink.example.com', 'https://github.com/example/campuslink',
  18, 1, 10
);

INSERT OR IGNORE INTO project_collaborators (project_id, member_id, role)
VALUES
  ('proj-campuslink', 'mem-dev',  'co-founder'),
  ('proj-campuslink', 'mem-zara', 'co-founder');

-- Mentor + student collab
INSERT OR IGNORE INTO projects (
  id, title, tagline, description, stage, visibility, published,
  creator_id, tech_stack, product_url, upvotes_count, is_featured, featured_rank
) VALUES (
  'proj-auditai',
  'AuditAI',
  'AI-powered smart contract auditing for indie Solidity devs',
  'A mentor and one of their mentees built AuditAI together during a 01X cohort sprint. It runs a GPT-4-based audit pipeline on Solidity contracts and outputs a prioritised vulnerability report.',
  'one', 'public', 1, 'mem-arjun',
  '["Python","FastAPI","OpenAI","Slither","React","Cloudflare Pages"]',
  'https://auditai.example.com',
  14, 1, 11
);

INSERT OR IGNORE INTO project_collaborators (project_id, member_id, role)
VALUES
  ('proj-auditai', 'mem-karan-mentor', 'mentor-builder');
