# Template: docs/ARCHITECTURE.md

```markdown
# Architecture: <project-name>

## Overview
<2–3 paragraphs: what the system does, key design decisions, what's intentionally out of scope>

## Feature Map
| Feature | Branch | Key Files | What It Does |
|---|---|---|---|
| <Feature 1 name> | feat/<slug> | <file1>, <file2> | <one sentence> |

## Data Flow
<Describe how data moves through the system end-to-end. Use a text diagram if helpful.>

Example for a web API:
  User request
    → HTTP layer (routes.py / routes/)
    → Business logic (core.py / services/)
    → Data layer (client.py / storage.py / db/)
    → External API or DB
    → Response back to user

## Component Relationships
<How modules/packages depend on each other. Which are shared? Which are feature-specific?>

## Key Design Patterns Used
- <Pattern name>: <brief why>

## External Dependencies
| Package | Purpose | Used In |
|---|---|---|
| <package> | <what it does> | <file or layer> |

## Configuration & Environment
<List env vars, config files, and what they control>

## What Is Intentionally NOT Here
<Things out of scope — important for future contributors to know>
```

---

# Template: docs/CODEBASE.md

```markdown
# Codebase Guide: <project-name>

## Directory Structure
<Tree view. Annotate every file/directory with one-line explanation.>

project-root/
├── src/
│   ├── main.py          # App entry point — wires deps, starts server
│   ├── contracts.py     # All types, Protocols, exceptions (source of truth)
│   └── ...
├── tests/
│   └── ...
└── docs/

## Entry Points
<How to start the app, run tests, build>

## Key Files (Start Here)

### `<file path>`
**Owns:** <what this file is responsible for>
**Key exports:** <functions, classes, types a developer will use>
**Depends on:** <what it imports from>
**Do NOT put here:** <what belongs elsewhere>

## How to Add a New Feature
1. Branch from main: `git checkout -b feat/<name>`
2. Add types/Protocols to `<contracts file>` first
3. Implement logic in `<core file>`
4. Add route/handler in `<routes file>`
5. Write tests in `tests/test_<name>.py`
6. Run `<test command>` — must be green
7. Open PR → squash-merge → delete branch

## Common Patterns in This Codebase
- **Pattern name**: <explanation + example file:line>

## Gotchas & Non-Obvious Decisions
- <gotcha>: <why it's done this way>
```
