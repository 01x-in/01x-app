# 01x-app — Claude Code Rules

## Git Workflow

- **Never commit directly to `main`.**
- All work must be on a `feature/<slug>` or `fix/<slug>` branch.
- Push the branch and open a PR — changes land on `main` only via merge.
- Before starting any new task, create the branch first:
  ```
  git checkout -b feature/<slug>
  ```

## PR Reviews

- PRs get automated review comments from `entelligence-ai-pr-reviews[bot]` and `chatgpt-codex-connector[bot]`.
- Check both: `gh api repos/01x-in/01x-app/pulls/<N>/comments` (inline) and `.../issues/<N>/comments` (summary).

## Dev Server

- A `next dev` server is often already running on :3000 outside Claude's session — `preview_start` will fail with "Another next dev server is already running".
- Use `curl localhost:3000/<path>` for a quick sanity check instead of starting a new server.
