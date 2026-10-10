#!/usr/bin/env bash
# Weekly AI news pipeline (fenlon11/pmOS#686), fired by LaunchAgent com.pmos.pm-news-drafts every
# Monday 07:00 (the mini's local time, America/New_York). launchd runs this file straight from
# origin/$PM_NEWS_REF (see com.pmos.pm-news-drafts.plist), so the code is always the merged version
# and the repo's main checkout is never touched.
#
# Steps: IndexNow ping for last week's merged articles -> collect.py -> draft.mjs (opens a draft PR,
# never merges). Runs in a throwaway worktree. State (seen.json, items, IndexNow baseline) lives in
# $PM_NEWS_STATE. Exits non-zero when the collector loses 3+ tier-1 sources or no draft passes.
#
# Install:  cp scripts/news/com.pmos.pm-news-drafts.plist ~/Library/LaunchAgents/
#           launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.pmos.pm-news-drafts.plist
# Run now:  launchctl kickstart gui/$(id -u)/com.pmos.pm-news-drafts
set -euo pipefail

REPO="${PM_NEWS_REPO:-$HOME/pmOS/projects/persistent-momentum/persistent-momentum-website}"
REF="${PM_NEWS_REF:-main}"
STATE="${PM_NEWS_STATE:-$HOME/.pmos/pm-news}"

# Headless Claude runs on the Max OAuth token, never an API key (pmOS auth pin).
unset ANTHROPIC_API_KEY
if [[ -z "${CLAUDE_CODE_OAUTH_TOKEN:-}" && -f "$HOME/.pmos/claude-oauth-token" ]]; then
  CLAUDE_CODE_OAUTH_TOKEN="$(tr -d '[:space:]' < "$HOME/.pmos/claude-oauth-token")"
  export CLAUDE_CODE_OAUTH_TOKEN
fi

echo "[pm-news-drafts] $(date '+%Y-%m-%d %H:%M:%S %Z') start, ref origin/$REF"
mkdir -p "$STATE"
git -C "$REPO" fetch -q origin
WT="$(mktemp -d "${TMPDIR:-/tmp}/pm-news-code.XXXXXX")"
cleanup() { git -C "$REPO" worktree remove --force "$WT" 2>/dev/null || rm -rf "$WT"; git -C "$REPO" worktree prune; }
trap cleanup EXIT
git -C "$REPO" worktree add -q --detach "$WT" "origin/$REF"
cd "$WT"
npm ci --no-audit --no-fund --ignore-scripts --loglevel=error

node scripts/news/indexnow-since.mjs --state "$STATE" || echo "[pm-news-drafts] WARN: IndexNow ping failed; it retries next run"
python3 scripts/news/collect.py --out "$STATE/items"
node scripts/news/draft.mjs --items "$STATE/items"
echo "[pm-news-drafts] $(date '+%Y-%m-%d %H:%M:%S %Z') done"
