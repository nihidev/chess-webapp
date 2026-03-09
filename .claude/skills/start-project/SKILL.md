---
name: start-project
description: Full project lifecycle orchestrator. Creates a dedicated project folder, runs /gather-requirements → planner → /github-setup → /feature-loop (per feature) → /code-docs → ships v1.0.0. Each project gets its own isolated folder. Single entry point for any new project.
user-invocable: true
disable-model-invocation: true
allowed-tools: Bash, Read, Write
---

# /start_project — Orchestrator

Run each phase in order. Never skip. Never proceed past a gate without user input.

---

## Phase 0 — Requirements
Invoke `/gather-requirements` skill.
Ends when user types CONFIRM. Captures: `PROJECT_NAME`, `PROJECT_SLUG`, `GOAL`, `STACK`.

`PROJECT_SLUG` = project name lowercased, spaces replaced with hyphens.
e.g. "My Task Manager" → `my-task-manager`

---

## Phase 1 — Project Folder Setup

After CONFIRM, create an isolated folder for this project:

1. Locate repo root: `git rev-parse --show-toplevel` (fallback: `pwd`)
2. Create `$SETUP_DIR/projects/$PROJECT_SLUG/`
3. Copy `.claude/` skeleton into the new project folder
4. Run `bash .claude/hooks/update-claude-md.sh` with name, goal, language, phase=PLANNING
5. `git init && git add .claude && git commit -m "chore: init $PROJECT_SLUG with claude scaffold"`

All remaining phases run from inside `$PROJECT_DIR`.

Print:
```
📁 Project folder created: projects/<PROJECT_SLUG>/
   .claude/ scaffold copied
   Git initialised
   Working directory: <PROJECT_DIR>
```

---

## Phase 2 — Planning
From inside `$PROJECT_DIR`, invoke **planner** agent → writes `docs/PLAN.md`.
Walk user through the plan.

```
📋 Plan written to docs/PLAN.md — <N> features.
Type CONFIRM to start building.
```

Wait for CONFIRM.

---

## Phase 3 — GitHub Repo
Invoke `/github-setup` skill using `PROJECT_SLUG` as the repo name.

---

## Phase 4 — Feature Loop
For each feature in `docs/PLAN.md` (in order):
1. Invoke `/feature-loop` skill with: feature N, name, slug, acceptance criteria
2. Wait for `/feature-loop` to complete (handles build → test → LGTM → push internally)
3. Run `/clear` before next feature

---

## Phase 5 — Final Validation Gate ⛔

Run the full test suite on main (use stack-appropriate command from `.claude/CLAUDE.md`).

Print results, then:

```
⛔ FINAL VALIDATION GATE

All features are on main. Do a full end-to-end check.

Type LGTM to complete the project.
Type any issue to fix it first.
```

Wait. Issue → fix → rerun checks → re-show gate. Loop until LGTM.

---

## Phase 6 — Documentation
Invoke `/code-docs` skill. Waits for docs to be committed to main.

---

## Phase 7 — Done

```bash
git tag v1.0.0
git push origin v1.0.0
bash .claude/hooks/update-claude-md.sh --phase "DONE"
```

```
🎉 PROJECT COMPLETE
   Folder: <PROJECT_DIR>
   Repo:   https://github.com/<user>/<PROJECT_SLUG>
   Tag:    v1.0.0
   Docs:   docs/ARCHITECTURE.md · docs/CODEBASE.md

   Next feature: /new-feature <name>
   New project:  /start_project  (creates a new folder)
```

---

## Hard Rules
- Every ⛔ gate requires explicit user input — never skip
- Never push failing tests or lint errors
- Never use `--no-verify` or `--force-push`
- Each project lives in its own folder — never mix projects in one directory
- If any `gh`/`git` command fails, print the error and wait for user to fix
