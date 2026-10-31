# Gates — fenlon11/pmOS#1625

- [x] G1: The website repo suite passes, including the new askClaude error-message tests
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-1625; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=dd7cef7383bad65810790c1e951073140b97616a54bdcfadb064459c87268532; output-bytes=117
- [x] G2: Reviewer confirms the plist has Mon–Thu 07:00 `StartCalendarInterval` entries and `run.sh` exits 0 before any drafting when a `content/ai-news-*` PR exists from the last 6 days (manual gate)
  EVIDENCE: review 2026-10-31 — `plutil -lint` OK; `plutil -extract StartCalendarInterval json` → [{Weekday:1,Hour:7,Minute:0},{2,7,0},{3,7,0},{4,7,0}]. Guard sits before mkdir/fetch/worktree/draft. Ran the guard block from run.sh against GitHub: real week (SINCE 2026-10-26T04:00:00Z) → falls through; SINCE stubbed 2026-10-19 → `already drafted this week (content/ai-news-2026-10-20 …)` exit 0; gh stubbed to fail → exit 1, nothing drafted; wrong prefix mutation → falls through. Week-start math: Mon 11-02/Tue 11-03/Thu 11-05 → 2026-11-02T05:00:00Z (Monday kept, DST-correct). Monday-start window accepted over the spec's rolling 6 days: inside 6 days on Mon–Thu and avoids week drift (build note).

## Post-merge checks
- PM1: The installed `~/Library/LaunchAgents/com.pmos.pm-news-drafts.plist` matches the repo copy (Mon–Thu entries).
  How: `plutil -p ~/Library/LaunchAgents/com.pmos.pm-news-drafts.plist` → `StartCalendarInterval` lists weekdays 1–4.
  Status: pending
- PM2: The next com.pmos.loop-outcomes verdict for com.pmos.pm-news-drafts after the next Mon–Thu run is delivered=true.
  How: `node ~/pmOS/scripts/loops/outcomes.mjs --json` → the loops[] entry for com.pmos.pm-news-drafts; then close fenlon11/pmOS#1478 with the merge link.
  Status: pending
