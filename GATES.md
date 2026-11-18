# Gates — fenlon11/pmOS#2664

- [x] G1: The repo suite passes, including the new anthropic-research regression test
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2664; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=c798971af7c472e551e8ca295bb04b17e69c978ba2af7558b85d07e6e82d8071; output-bytes=117
- [x] G2: A live collector run on the mini shows `anthropic-research` with ≥1 item and no `pattern matched nothing` line for an Anthropic source; output pasted in the PR (manual gate)
  EVIDENCE: 2026-11-18 03:3x ET, `python3 scripts/news/collect.py --days 8 --out /tmp/p2662` exit=0 on the mini from this worktree: ` 24  ok          anthropic-research`, ` 26  ok          anthropic-news`, all claude-* sources ok; the only `pattern matched nothing` line is `ibm-newsroom` (IBM, not Anthropic); no anthropic-engineering line.

## Post-merge checks
- PM1: fenlon11/pmOS#2662 no longer reproduces on main.
  How: read the next `com.pmos.pm-news-sources` run log after merge for `anthropic-research` items and the absence of `anthropic-engineering`; then close fenlon11/pmOS#2662 with the merge link.
  Status: pending
