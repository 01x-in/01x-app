# 01x-app — Claude Code Rules

## Git Workflow

- **Never commit directly to `main`.**
- All work must be on a `feature/<slug>` or `fix/<slug>` branch.
- Push the branch and open a PR — changes land on `main` only via merge.
- Before starting any new task, create the branch first:
  ```
  git checkout -b feature/<slug>
  ```
