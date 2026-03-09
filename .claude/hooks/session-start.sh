#!/usr/bin/env bash
# session-start.sh — fires when Claude Code session begins (SessionStart hook)
# Reads current CLAUDE.md state, prompts user for intent, updates CLAUDE.md.

set -euo pipefail

CLAUDE_MD=".claude/CLAUDE.md"
MEMORY_MD="docs/MEMORY.md"
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$PROJECT_ROOT"

# ── Read current state ─────────────────────────────────────────────────────
CURRENT_PHASE=$(grep "^PHASE:" "$CLAUDE_MD" 2>/dev/null | awk '{print $2}' || echo "NOT_STARTED")
CURRENT_NAME=$(grep "^NAME:" "$CLAUDE_MD" 2>/dev/null | awk '{$1=""; print $0}' | xargs || echo "~")
LAST_ACTION=$(grep "^NEXT_ACTION:" "$CLAUDE_MD" 2>/dev/null | sed 's/^NEXT_ACTION: *//' || echo "~")
NOW=$(date "+%Y-%m-%d %H:%M")

# ── Determine if new or continuing ────────────────────────────────────────
if [[ "$CURRENT_PHASE" == "NOT_STARTED" || "$CURRENT_NAME" == "~" ]]; then
  IS_NEW=true
else
  IS_NEW=false
fi

# ── Build context prompt for Claude ───────────────────────────────────────
# This script prints a structured message that Claude Code injects at session start.
# Claude reads this and uses it to orient the session before the user types anything.

if $IS_NEW; then
  cat <<EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  NEW SESSION — No active project detected.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Claude will ask you two questions to get started:
  1. Are you starting a NEW PROJECT or adding a FEATURE to an existing one?
  2. Describe what you want to build in 1–3 sentences.

Your answer will be written to .claude/CLAUDE.md and used
to orient the planner agent before any code is written.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SESSION_STATE=new
PROJECT_NAME=$CURRENT_NAME
PHASE=$CURRENT_PHASE
EOF
else
  cat <<EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  RESUMING: $CURRENT_NAME
  Phase:    $CURRENT_PHASE
  Last session suggested: $LAST_ACTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Claude will confirm: continue from last session, or start something new?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SESSION_STATE=resuming
PROJECT_NAME=$CURRENT_NAME
PHASE=$CURRENT_PHASE
NEXT_ACTION=$LAST_ACTION
EOF
fi
