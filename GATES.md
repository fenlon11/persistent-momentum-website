# Gates — fenlon11/pmOS#2797

- [x] G1: The repo suite passes, including the new regression assertion
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2797; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=9e1b65c8e0ff5849d8a17ce7595e4c6e1bad9174675ec0d001323b2036a500a3; output-bytes=117
- [ ] G2: Reviewer confirms `grep -c chatgpt-release-notes scripts/news/sources.json` prints 0 on the branch and the new assertion fails when the entry is restored (manual gate)
  EVIDENCE: pending

## Post-merge checks
- PM1: the next `com.pmos.pm-news-sources` run logs no `error` line for `chatgpt-release-notes` and still prints an OpenAI count on the `top labs, tier-1 items:` line.
  How: `tail -30 ~/pmOS/agents/logs/pm-news-sources.stdout.log` after the next 08:05 ET run; then close fenlon11/pmOS#2789 with the merge link.
  Status: pending
