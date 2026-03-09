#!/usr/bin/env bash
# update-claude-md.sh — called by Claude after collecting user input at session start
# Usage: bash .claude/hooks/update-claude-md.sh \
#          --name "My Project" \
#          --type "NEW_PROJECT|NEW_FEATURE" \
#          --goal "One sentence description" \
#          --language "Python 3.12+" \
#          --phase "PLANNING"
#
# Also called by session-end hook to update phase + next action:
# Usage: bash .claude/hooks/update-claude-md.sh \
#          --phase "FEATURE_2" \
#          --next-action "Implement storage layer" \
#          --completed "2" \
#          --in-progress "storage" \
#          --remaining "core,cli"

set -euo pipefail

PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$PROJECT_ROOT"
CLAUDE_MD=".claude/CLAUDE.md"
NOW=$(date "+%Y-%m-%d %H:%M")

# ── Parse args ─────────────────────────────────────────────────────────────
NAME=""
TYPE=""
GOAL=""
LANGUAGE=""
PHASE=""
NEXT_ACTION=""
COMPLETED=""
IN_PROGRESS=""
REMAINING=""
TOTAL=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --name)        NAME="$2";        shift 2 ;;
    --type)        TYPE="$2";        shift 2 ;;
    --goal)        GOAL="$2";        shift 2 ;;
    --language)    LANGUAGE="$2";    shift 2 ;;
    --phase)       PHASE="$2";       shift 2 ;;
    --next-action) NEXT_ACTION="$2"; shift 2 ;;
    --completed)   COMPLETED="$2";   shift 2 ;;
    --in-progress) IN_PROGRESS="$2"; shift 2 ;;
    --remaining)   REMAINING="$2";   shift 2 ;;
    --total)       TOTAL="$2";       shift 2 ;;
    *) shift ;;
  esac
done

# ── Patch CLAUDE.md fields (sed in-place) ─────────────────────────────────
patch_field() {
  local key="$1"
  local value="$2"
  if [[ -n "$value" ]]; then
    sed -i "s|^${key}: .*|${key}: ${value}|" "$CLAUDE_MD"
  fi
}

patch_field "NAME"        "$NAME"
patch_field "TYPE"        "$TYPE"
patch_field "GOAL"        "$GOAL"
patch_field "PHASE"       "$PHASE"
patch_field "NEXT_ACTION" "$NEXT_ACTION"
patch_field "COMPLETED"   "$COMPLETED"
patch_field "IN_PROGRESS" "$IN_PROGRESS"
patch_field "REMAINING"   "$REMAINING"
patch_field "TOTAL"       "$TOTAL"
patch_field "DATE"        "$NOW"
patch_field "ENDED_AT"    "~"  # reset on new session start

# Update language in stack section
if [[ -n "$LANGUAGE" ]]; then
  sed -i "s|^- Language: .*|- Language: ${LANGUAGE}|" "$CLAUDE_MD"
fi

echo "✓ CLAUDE.md updated at $NOW"
