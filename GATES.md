## Gates
- [x] G1: The repo suite passes, including the new run.sh source test
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2985; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=c33f7cc58bff8ac46c3298ef628aa3f70f3d0fc4f4d7eb2efad08060e27f1f82; output-bytes=117
- [x] G2: `indexnow-since.mjs --dry-run` on the mini lists the 4 PR #63 URLs and writes nothing; output pasted in the PR (manual gate)
  EVIDENCE: 2026-11-21 on the mini, `node scripts/news/indexnow-since.mjs --state ~/.pmos/pm-news --dry-run` exit 0; urlList = /guides/chatgpt-google-ai-answers-business-visibility, /news/anthropic-claude-meetings-google-meet, /news/anthropic-claude-sheets-whiteboards-data, /news/google-gemini-4-hydrogen (exactly the 4 PR #63 URLs); shasum of ~/.pmos/pm-news/indexnow-last-main identical before and after (9f2eef5e…), so nothing written.

## Post-merge checks
- PM1: the next week's merge pings at merge time.
  How: after the next `content/ai-news-*` PR merges through the run, `agents/logs/pm-news-drafts.stdout.log` shows an `indexnow: HTTP 200` (or 202) line for its URLs in the same run as `merged as`.
  Status: pending
