---
name: github-push
description: Pushes the current feature branch to GitHub, opens a PR, squash-merges it, deletes the branch (remote + local), and syncs main. Called automatically after user types LGTM on a feature.
user-invocable: false
disable-model-invocation: false
allowed-tools: Bash
---

# GitHub Push, Merge & Cleanup

Execute in order. Stop and report if any step fails.

```bash
BRANCH=$(git branch --show-current)
FEATURE=$(echo "$BRANCH" | sed 's/feat\///')

# 1. Push branch
git push -u origin "$BRANCH"

# 2. Open PR
gh pr create \
  --title "feat: ${FEATURE}" \
  --body "## Summary
- Built and tested
- Verified by user: LGTM

## Checks
- Tests: passing
- Lint/types: clean"

# 3. Squash-merge + delete remote branch
gh pr merge --squash --delete-branch --yes

# 4. Sync local main + delete local branch
git checkout main
git pull origin main
git branch -d "$BRANCH"
```

Print:
```
✅ Merged: <branch> → main
   Branch deleted (local + remote)
```

Return to orchestrator.
