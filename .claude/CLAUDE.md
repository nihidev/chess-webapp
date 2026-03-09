# ── PROJECT STATE ─────────────────────────────────────────────────────────────
# Auto-updated by session-start and session-end hooks. Do not edit manually.

## Project
NAME: Chess Webapp
TYPE: NEW_PROJECT
GOAL: A browser-based chess game supporting Human vs Human and Human vs Computer modes with selectable AI difficulty levels

## Current Phase
PHASE: FEATURE_1_READY
# Phases: NOT_STARTED → PLANNING → FEATURE_1 → FEATURE_2 → ... → DONE

## Features
# Auto-populated by planner agent after docs/PLAN.md is written
TOTAL: 5
COMPLETED: 0
IN_PROGRESS: ~
REMAINING: 5

## Last Session
DATE: 2026-03-09
ENDED_AT: ~
NEXT_ACTION: Implement Feature 1 — scaffold-and-contracts

# ── STACK ─────────────────────────────────────────────────────────────────────

## Stack Profile
- Language: TypeScript (strict)
- Package manager: npm
- Lint/format: ESLint + Prettier | Types: TypeScript strict
- Tests: Vitest | VCS: git + GitHub

## Critical Commands
```bash
npm run dev              # start Vite dev server at localhost:5173
npm run build            # TypeScript compile + Vite production build
npm run lint             # ESLint check
npm run test             # run Vitest test suite
npm run test -- --run    # run Vitest once (CI mode, no watch)
gh pr create --fill      # open PR
```

# ── KEY FILES ─────────────────────────────────────────────────────────────────

- Plan:      `docs/PLAN.md`      — source of truth for all features
- Contracts: `src/types.ts`      — all shared types, enums, interfaces
- Rules:     `.claude/RULES.md`  — code standards (read before any task)
- Memory:    `docs/MEMORY.md`    — decisions log (updated after each merge)

# ── NON-NEGOTIABLES ───────────────────────────────────────────────────────────

- NEVER use `git commit --no-verify`
- NEVER merge to main with failing tests or TypeScript errors
- NEVER create files outside your designated scope (see agent roles)
- Run `/compact` when context hits 50% — run `/clear` between features
- No `any` types — use `unknown` and narrow, or define a proper type in `src/types.ts`

# ── HOOKS (automatic) ─────────────────────────────────────────────────────────

- session-start: prompts user → writes project state to this file
- post-edit:     ESLint + Prettier format after every TypeScript/TSX file write
- pre-commit:    tsc + vitest gate on every commit attempt
- session-end:   saves current phase + next action back to this file
