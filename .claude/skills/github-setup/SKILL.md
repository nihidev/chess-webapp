---
name: github-setup
description: Creates a GitHub repository for the current project, pushes the initial commit, and confirms the remote URL. Called by /start_project after planning is confirmed.
user-invocable: true
disable-model-invocation: false
allowed-tools: Bash
---

# GitHub Setup

Run in order:

```bash
# 1. Ensure git is initialised
git init 2>/dev/null || true
git add .
git diff --cached --quiet || git commit -m "chore: initial scaffold"

# 2. Create GitHub repo + set remote + push
gh repo create <project-name> --public --source=. --remote=origin --push
```

If `gh` fails with auth error → tell user to run `gh auth login` and retry.

Confirm:
```
✅ GitHub repo ready
   URL:    https://github.com/<user>/<project-name>
   Branch: main
```

Return to orchestrator.
