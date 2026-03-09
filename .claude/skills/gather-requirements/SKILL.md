---
name: gather-requirements
description: Collects project idea, target users, then suggests stack options based on the idea. Ends with user typing CONFIRM. Called by /start_project Phase 0-1.
user-invocable: true
disable-model-invocation: false
allowed-tools: Bash, Write
---

# Gather Requirements

## Step 1 — Project Idea

Ask only:
```
👋 Let's build something. Tell me:

1. What's the project name?
2. What problem does it solve? (2–3 sentences)
3. Who is it for?
```

Wait for answers. Do NOT ask about stack yet.

---

## Step 2 — Stack Suggestion

Based on the idea, reason about the best fit and offer 2–3 options:

```
Based on your idea, here are natural fits:

  A: <Stack>  — <one line why>
  B: <Stack>  — <one line why>
  C: Other    — describe your own

Which do you prefer?
```

Wait for answer.

---

## Step 3 — CONFIRM

Print a summary and wait:

```
Here's what we'll build:

  Name:  <name>
  Goal:  <one sentence>
  Stack: <stack>
  For:   <users>

Type CONFIRM to lock this in, or correct anything.
```

Do NOT proceed until user types CONFIRM.

---

## Output

After CONFIRM, derive the slug and return all values to the orchestrator:

```
PROJECT_NAME: <name as entered>
PROJECT_SLUG: <name lowercased, spaces→hyphens, special chars removed>
              e.g. "My Task Manager" → "my-task-manager"
GOAL:         <one sentence>
STACK:        <chosen stack>
FOR:          <target users>
```

Do NOT run `update-claude-md.sh` here — the orchestrator does that after creating the project folder.
