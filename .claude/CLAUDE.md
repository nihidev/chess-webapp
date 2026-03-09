# ── PROJECT STATE ─────────────────────────────────────────────────────────────
# Auto-updated by session-start and session-end hooks. Do not edit manually.

## Project
NAME: Chess Webapp
TYPE: NEW_PROJECT
GOAL: A browser-based chess game supporting Human vs Human and Human vs Computer modes with selectable AI difficulty levels

## Current Phase
PHASE: PLANNING
# Phases: NOT_STARTED → PLANNING → FEATURE_1 → FEATURE_2 → ... → DONE

## Features
# Auto-populated by planner agent after docs/PLAN.md is written
TOTAL: ~
COMPLETED: ~
IN_PROGRESS: ~
REMAINING: ~

## Last Session
DATE: 2026-03-09
ENDED_AT: ~
NEXT_ACTION: ~

# ── STACK ─────────────────────────────────────────────────────────────────────

## Stack Profile
<!-- Session-start hook populates this from user input -->
- Language: TypeScript
- Package manager: npm
- Lint/format: ESLint + Prettier | Types: TypeScript strict
- Tests: Vitest | VCS: git + GitHub

## Critical Commands
```bash
uv run pytest -xvs          # run tests
uv run mypy . --strict       # type check
gh pr create --fill          # open PR
```

# ── KEY FILES ─────────────────────────────────────────────────────────────────

- Plan:      `docs/PLAN.md`      — source of truth for all features
- Contracts: `src/contracts.py`  — all types, Protocols, exceptions
- Rules:     `.claude/RULES.md`  — code standards (read before any task)
- Memory:    `docs/MEMORY.md`    — decisions log (updated after each merge)

# ── NON-NEGOTIABLES ───────────────────────────────────────────────────────────

- NEVER use `git commit --no-verify`
- NEVER merge to main with failing tests or mypy errors
- NEVER create files outside your designated scope (see agent roles)
- Run `/compact` when context hits 50% — run `/clear` between features

# ── HOOKS (automatic) ─────────────────────────────────────────────────────────

- session-start: prompts user → writes project state to this file
- post-edit:     ruff fix + format after every Python file write
- pre-commit:    mypy + pytest gate on every commit attempt
- session-end:   saves current phase + next action back to this file
