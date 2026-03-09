# Plan Format Template

Use this format when writing `docs/PLAN.md`:

```markdown
# Project Plan: <name>

## Overview
One paragraph: what we're building, key decisions, what's out of scope.

## Stack
Language | package manager | linter | test framework | persistence

## Features (ordered by dependency)

### Feature 1: <name>
- **Branch**: feat/<slug>
- **Files**: src/contracts.py, src/core.py (list only files this feature touches)
- **Description**: What this does in 2 sentences max
- **Acceptance criteria**:
  - [ ] Specific, testable criterion
  - [ ] Another criterion
- **Depends on**: nothing

### Feature 2: <name>
- **Branch**: feat/<slug>
- **Files**: <files>
- **Description**: <description>
- **Acceptance criteria**:
  - [ ] Criterion
- **Depends on**: Feature 1
```

## Constraints

- Feature 1 is ALWAYS: scaffold + data model + contracts.py
- 3–5 features total (scoped for ~45 min coding)
- Every criterion must be testable by the tester without reading src/
