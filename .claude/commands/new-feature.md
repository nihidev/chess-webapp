# /new-feature

Triggers the full feature cycle for one feature from `docs/PLAN.md`.

## Usage
```
/new-feature <feature-name-or-number>
```

## Pre-conditions (abort if not met)
- `docs/PLAN.md` must exist
- Must be on `main` branch
- Feature must not already be merged (`git log --oneline | grep <slug>`)

## Steps

**1 — Parallel build:**
Spawn simultaneously:
- implementer agent → `feat/<slug>` → code + commit
- tester agent → `tests/test_<slug>.py` → run suite

If tests fail → HANDOFF (RULES.md format) → re-run implementer → re-run tester.

**2 — Reviewer gate:**
Run reviewer agent → ruff + mypy + pytest must be green.
If not → HANDOFF → implementer → re-run reviewer.

**3 — Verification gate ⛔**
Print acceptance criteria from PLAN.md:
```
⛔ VERIFICATION GATE — <feature name>
  1. <criterion>
  2. <criterion>
Type LGTM or describe the issue.
```
Wait. Issue → fix → re-reviewer → re-gate. Loop until LGTM.

**4 — GitHub push 🚀**
Invoke `/github-push` skill → PR → squash-merge → branch deleted → main synced.

**5 — Done**
```
✅ Feature shipped. Run /clear before next feature.
```
