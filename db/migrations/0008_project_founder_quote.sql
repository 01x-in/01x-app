-- Migration: Add founder_quote to projects
-- Used to display a short founder story/quote on the login page showcase

ALTER TABLE projects ADD COLUMN founder_quote TEXT;
