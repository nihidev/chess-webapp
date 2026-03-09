#!/usr/bin/env bash
# post-edit.sh — fires after every file write via Claude Code hook
# Runs ruff fix + format silently. Never blocks Claude.

set -euo pipefail

# Only run on Python files
EDITED_FILE="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"
if [[ "$EDITED_FILE" != *.py ]]; then
  exit 0
fi

# Find project root (where pyproject.toml lives)
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)

cd "$PROJECT_ROOT"

# Run ruff fix then format — suppress output unless error
uv run ruff check . --fix --quiet 2>&1 || true
uv run ruff format . --quiet 2>&1 || true
