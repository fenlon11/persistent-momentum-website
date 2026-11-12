# Gates — fenlon11/pmOS#2573

- [x] G1: The repo suite passes, including the new prBody regression assertion
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2573; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=19bcc6392f6fc8961c1bffcdcf5a63631fa13b2b74e4a9827fdeea9ddb382d23; output-bytes=117
- [ ] G2: Reviewer runs `grep -n "matt-only" scripts/news/draft.mjs` on the branch and confirms no hits (manual gate)
  EVIDENCE: pending

## Post-merge checks
- PM1: the next weekly AI-news draft PR (week of 2026-11-16) carries no `matt-only` label and its body names the delegated decision.
  How: `gh pr list -R fenlon11/persistent-momentum-website --search "AI news week of" --json number,labels,body --limit 1`; then close fenlon11/pmOS#2572 with the merge link.
  Status: pending
