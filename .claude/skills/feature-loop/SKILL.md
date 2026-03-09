---
name: feature-loop
description: Runs the full build-test-review-verify-push cycle for a single feature. Reads acceptance criteria from docs/PLAN.md, runs implementer+tester in parallel, gates on user LGTM, then calls github-push. Called by /start_project and /new-feature.
user-invocable: false
disable-model-invocation: false
allowed-tools: Bash, Read, Glob
---

# Feature Loop — Single Feature

## Input
Receive: feature number N, feature name, slug, acceptance criteria (from PLAN.md).

---

## Step 1 — Build (parallel)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔨 Feature <N>/<TOTAL>: <name>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Spawn simultaneously:
- **implementer** agent → `feat/<slug>` → code + commit
- **tester** agent → `tests/test_<slug>.py` → run suite

If tester reports failures → send HANDOFF (RULES.md format) to implementer → re-run tester.
Repeat until green.

---

## Step 2 — Reviewer gate

Run **reviewer** agent → diff + quality checks (ruff, mypy, pytest).
Must be fully green. If not → HANDOFF → implementer → re-run reviewer.

---

## Step 3 — Verification gate ⛔

```
⛔ VERIFICATION GATE — Feature <N>: <name>

Verify:
  1. <criterion 1 from PLAN.md>
  2. <criterion 2 from PLAN.md>
  ...

Type LGTM or describe the issue.
```

**Wait.** Do not proceed until user responds.

- **LGTM** → Step 4
- **Issue** → fix → re-run reviewer → re-show gate → wait again

---

## Step 4 — Push to GitHub 🚀

Invoke `/github-push` skill.

After it completes, print:
```
✅ Feature <N> shipped · <N-left> remaining
```

Remind: "Run /clear before next feature."
