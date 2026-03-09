# Shared Rules — Read Once, Apply Always

## Code Standards
- Type hints on ALL function signatures (no bare `Any` without justification)
- One-line docstring on every public function
- Frozen dataclasses for value objects; Protocols for abstractions
- Functions ≤ 25 lines — extract helpers when reusable
- No bare `except` — catch specific exceptions, re-raise as domain exceptions
- f-strings for formatting; pathlib over os.path
- Descriptive names: `get_active_tasks()` not `get()`

## Architecture Invariants
- `contracts.py` — single source of truth: dataclasses, Protocols, enums, exceptions
- `core.py` — pure business logic, zero I/O (receives storage via DI, never creates it)
- `storage.py` — implements Protocol from contracts; owns all file I/O
- `main.py` — thin: parse args → wire deps → call core → print; no business logic

## Git Discipline
- Conventional commits: `feat:`, `fix:`, `test:`, `docs:`, `chore:`
- One branch per feature: `feat/<slug>` branched from `main`
- Commit only working code — no broken imports, no placeholder TODOs
- NEVER use `--no-verify` on commits or pushes

## Error Handoff Format (reviewer → implementer)
When tests fail, reviewer reports back using this exact structure:
```
HANDOFF: feat/<slug>
FAILING: <test name or mypy error>
FILE: <path>:<line>
ERROR: <exact error message>
ACTION: Fix implementation in src/ — do not modify tests
```

## Context Hygiene
- Run `/compact` at 50% context usage
- Run `/clear` after every feature merge before starting next feature
- Never @-include entire files in CLAUDE.md — use file:line pointers instead
- Preserve across /clear: PLAN.md path, current feature, last commit hash
