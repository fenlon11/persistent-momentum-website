# Gates — fenlon11/pmOS#1625

- [x] G1: The website repo suite passes, including the new askClaude error-message tests
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-1625; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=dd7cef7383bad65810790c1e951073140b97616a54bdcfadb064459c87268532; output-bytes=117
- [ ] G2: Reviewer confirms the plist has Mon–Thu 07:00 `StartCalendarInterval` entries and `run.sh` exits 0 before any drafting when a `content/ai-news-*` PR exists from the last 6 days (manual gate)
  EVIDENCE: pending

## Post-merge checks
- PM1: The installed `~/Library/LaunchAgents/com.pmos.pm-news-drafts.plist` matches the repo copy (Mon–Thu entries).
  How: `plutil -p ~/Library/LaunchAgents/com.pmos.pm-news-drafts.plist` → `StartCalendarInterval` lists weekdays 1–4.
  Status: pending
- PM2: The next com.pmos.loop-outcomes verdict for com.pmos.pm-news-drafts after the next Mon–Thu run is delivered=true.
  How: `node ~/pmOS/scripts/loops/outcomes.mjs --json` → the loops[] entry for com.pmos.pm-news-drafts; then close fenlon11/pmOS#1478 with the merge link.
  Status: pending
