#!/usr/bin/env bash
# Weekly AI news pipeline (fenlon11/pmOS#686), fired by LaunchAgent com.pmos.pm-news-drafts Mon–Thu
# 07:00 (the mini's local time, America/New_York). The first run of the week to open a draft PR wins;
# later runs exit 0 at the guard below, so a failed Monday is retried Tuesday (fenlon11/pmOS#1625).
# launchd runs this file straight from origin/$PM_NEWS_REF (see com.pmos.pm-news-drafts.plist), so the
# code is always the merged version and the repo's main checkout is never touched.
#
# Steps: IndexNow ping for last week's merged articles -> collect.py -> draft.mjs (opens a draft PR,
# never merges); a later run that week -> factcheck.mjs (readies the PR, files the merge decision).
# Runs in a throwaway worktree. State (seen.json, items, IndexNow baseline) lives in $PM_NEWS_STATE.
# Exits non-zero when the collector loses 3+ tier-1 sources or no draft passes.
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

# One draft PR per week: skip when a content/ai-news-* PR (any state) was opened since this week's
# Monday 00:00 local, which on Mon–Thu is always inside the last 6 days. A rolling 6-day window would
# instead let a Thursday success skip the next Mon–Wed and pin the week to Thursday, with no retry left.
# A gh failure stops the run (set -e) rather than risk a second PR; the next weekday retries.
# When that PR is open, still a draft and has no fact-check marker comment, the run fact-checks it
# instead (factcheck.mjs, fenlon11/pmOS#2017); the Mon–Thu schedule gives that stage its retries.
# PM_NEWS_DECIDE_ONLY=1 prints the decision and exits before any write (tests use it).
SINCE="$(date -u -r "$(date -v-mon -v0H -v0M -v0S +%s)" '+%Y-%m-%dT%H:%M:%SZ')"
RECENT="$(gh pr list --repo fenlon11/persistent-momentum-website --state all --limit 100 --json number,headRefName,createdAt,state,isDraft \
  --jq "[.[] | select((.headRefName | startswith(\"content/ai-news-\")) and .createdAt >= \"$SINCE\")] | .[0] // empty | \"\\(.headRefName) \\(.number) \\(.state) \\(.isDraft)\"")"
FACTCHECK_PR=""
if [[ -n "$RECENT" ]]; then
  read -r RECENT_REF RECENT_PR RECENT_STATE RECENT_DRAFT <<< "$RECENT"
  if [[ "$RECENT_STATE" == "OPEN" && "$RECENT_DRAFT" == "true" ]] && [[ "$(gh pr view "$RECENT_PR" --repo fenlon11/persistent-momentum-website --json comments \
    --jq '[.comments[].body | select(contains("<!-- pm-news-factcheck "))] | length')" == "0" ]]; then
    FACTCHECK_PR="$RECENT_PR"
    echo "[pm-news-drafts] already drafted this week ($RECENT_REF, PR #$RECENT_PR, draft, not fact-checked); fact-checking it"
  else
    echo "[pm-news-drafts] already drafted this week ($RECENT_REF, PR #$RECENT_PR opened since $SINCE); nothing to do"
    [[ -n "${PM_NEWS_DECIDE_ONLY:-}" ]] && echo "decision: skip"
    exit 0
  fi
fi
if [[ -n "${PM_NEWS_DECIDE_ONLY:-}" ]]; then
  if [[ -n "$FACTCHECK_PR" ]]; then echo "decision: factcheck #$FACTCHECK_PR"; else echo "decision: draft"; fi
  exit 0
fi

mkdir -p "$STATE"
git -C "$REPO" fetch -q origin
WT="$(mktemp -d "${TMPDIR:-/tmp}/pm-news-code.XXXXXX")"
cleanup() { git -C "$REPO" worktree remove --force "$WT" 2>/dev/null || rm -rf "$WT"; git -C "$REPO" worktree prune; }
trap cleanup EXIT
git -C "$REPO" worktree add -q --detach "$WT" "origin/$REF"
cd "$WT"
npm ci --no-audit --no-fund --ignore-scripts --loglevel=error

if [[ -n "$FACTCHECK_PR" ]]; then
  node scripts/news/factcheck.mjs --pr "$FACTCHECK_PR"
  echo "[pm-news-drafts] $(date '+%Y-%m-%d %H:%M:%S %Z') done"
  exit 0
fi
node scripts/news/indexnow-since.mjs --state "$STATE" || echo "[pm-news-drafts] WARN: IndexNow ping failed; it retries next run"
python3 scripts/news/collect.py --out "$STATE/items"
node scripts/news/draft.mjs --items "$STATE/items"
echo "[pm-news-drafts] $(date '+%Y-%m-%d %H:%M:%S %Z') done"
