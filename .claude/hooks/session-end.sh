#!/usr/bin/env bash
# session-end.sh — fires on SessionEnd / Stop hook
# Reads current git + test state, asks Claude to summarize next action,
# then patches CLAUDE.md with phase + next_action for next session continuity.

set -euo pipefail

PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$PROJECT_ROOT"
CLAUDE_MD=".claude/CLAUDE.md"
NOW=$(date "+%Y-%m-%d %H:%M")

# ── Derive current phase from git branches ─────────────────────────────────
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
MERGED_FEATURES=$(git log main --oneline --grep="^merge: feat/" 2>/dev/null | wc -l | xargs)
OPEN_FEATURE=""
if [[ "$CURRENT_BRANCH" == feat/* ]]; then
  OPEN_FEATURE="${CURRENT_BRANCH#feat/}"
fi

# Determine phase label
if [[ "$CURRENT_BRANCH" == "main" && "$MERGED_FEATURES" -eq 0 ]]; then
  PHASE="PLANNING"
elif [[ -n "$OPEN_FEATURE" ]]; then
  PHASE="FEATURE_${OPEN_FEATURE}"
elif [[ "$CURRENT_BRANCH" == "main" && "$MERGED_FEATURES" -gt 0 ]]; then
  PHASE="FEATURE_${MERGED_FEATURES}_DONE"
else
  PHASE=$(grep "^PHASE:" "$CLAUDE_MD" | awk '{print $2}')
fi

# ── Derive feature counts ──────────────────────────────────────────────────
TOTAL=$(grep "^TOTAL:" "$CLAUDE_MD" | awk '{print $2}' || echo "~")
COMPLETED=$MERGED_FEATURES

# ── Patch CLAUDE.md ────────────────────────────────────────────────────────
sed -i "s|^PHASE: .*|PHASE: ${PHASE}|"         "$CLAUDE_MD"
sed -i "s|^ENDED_AT: .*|ENDED_AT: ${NOW}|"     "$CLAUDE_MD"
sed -i "s|^DATE: .*|DATE: ${NOW}|"             "$CLAUDE_MD"
sed -i "s|^COMPLETED: .*|COMPLETED: ${COMPLETED}|" "$CLAUDE_MD"

# ── Print summary for Claude to use as NEXT_ACTION ────────────────────────
# Claude Code Stop hook: Claude reads this output and writes a NEXT_ACTION
# summary back via update-claude-md.sh --next-action "..."
cat <<EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SESSION ENDING — Saving state to .claude/CLAUDE.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Phase saved:     $PHASE
  Features done:   $COMPLETED / $TOTAL
  Branch:          $CURRENT_BRANCH
  Time:            $NOW

  Claude: please write a one-sentence NEXT_ACTION summary
  describing exactly what to do at the start of the next session.
  Then run:
    bash .claude/hooks/update-claude-md.sh --next-action "<your summary>"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
