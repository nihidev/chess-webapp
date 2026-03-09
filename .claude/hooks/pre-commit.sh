#!/usr/bin/env bash
# pre-commit.sh — fires on every git commit attempt
# Blocks commit if mypy or pytest fails. Shows concise errors.

set -euo pipefail

PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$PROJECT_ROOT"

echo "→ mypy..."
if ! uv run mypy . --strict --no-error-summary 2>&1 | tail -5; then
  echo "✗ mypy failed — fix type errors before committing"
  exit 1
fi

echo "→ pytest..."
if ! uv run pytest -x --tb=short -q 2>&1 | tail -20; then
  echo "✗ tests failed — fix before committing"
  exit 1
fi

echo "✓ all checks passed"
