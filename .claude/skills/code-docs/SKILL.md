---
name: code-docs
description: Generates comprehensive code documentation after project completion. Produces Feature Architecture (how features connect and data flows) and Codebase Explanation (file structure, key modules, entry points). Called automatically by /start_project after all branches are merged to main.
user-invocable: true
disable-model-invocation: false
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Code Documentation Generator

You are a **technical documentation agent**. Read the finished codebase and produce two documents any new developer (or future AI agent) can immediately understand.

Do NOT modify any source code. Read only, then write docs.

---

## STEP 1 — Read the project

1. Read `docs/PLAN.md` — intended features and acceptance criteria
2. Read `.claude/CLAUDE.md` — project name, goal, stack
3. Run `git log --oneline main` — commit history per feature
4. Glob all source files: `src/**/*`, `app/**/*`, `lib/**/*`, `components/**/*` (adapt to stack)
5. Read each meaningful source file — skip lock files, `node_modules`, `__pycache__`, `.env`
6. Run the test suite to confirm green:
   - Python: `uv run pytest -q`
   - Node/Next: `npm test`
   - Go: `go test ./...`

---

## STEP 2 — Write `docs/ARCHITECTURE.md`

Explains **how the system is designed**. Use the template in `template-architecture.md` as your structure guide. Cover:
- Overview (2–3 paragraphs: what it does, key decisions, what's out of scope)
- Feature Map (table: feature name, branch, key files, one-sentence description)
- Data Flow (end-to-end, text diagram if helpful)
- Component Relationships (module dependencies, shared vs feature-specific)
- Key Design Patterns (one bullet per pattern with brief why)
- External Dependencies (table: package, purpose, where used)
- Configuration & Environment (env vars, config files)
- What Is Intentionally NOT Here

---

## STEP 3 — Write `docs/CODEBASE.md`

Explains **where things live**. Use the template in `template-architecture.md` as your structure guide. Cover:
- Directory Structure (tree view with one-line annotation per file/dir)
- Entry Points (how to start app, run tests, build)
- Key Files (for each: owns, key exports, depends on, do NOT put here)
- How to Add a New Feature (numbered steps)
- Common Patterns in This Codebase
- Gotchas & Non-Obvious Decisions

---

## STEP 4 — Update `README.md`

Append or update a **Documentation** section linking to PLAN.md, ARCHITECTURE.md, CODEBASE.md. If no README exists, create a minimal one with: project name, one-line description, quick start commands, docs table.

---

## STEP 5 — Commit the docs

```bash
git add docs/ARCHITECTURE.md docs/CODEBASE.md README.md
git commit -m "docs: add architecture and codebase documentation"
git push origin main
```

Print:
```
📚 Documentation complete!

  docs/ARCHITECTURE.md  — system design & feature map
  docs/CODEBASE.md      — file guide & entry points
  README.md             — updated with docs links

  Committed and pushed to main.
```

---

## Rules

- Read every source file before writing — do not guess structure
- Be specific: use actual file names, function names, line references
- Write for a developer who has never seen this codebase
- Do NOT document test files in detail — just note they exist and what they cover
- Do NOT copy-paste source code into docs — describe what it does, link to the file
- Keep each document under 300 lines — depth over breadth
