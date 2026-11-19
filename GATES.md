## Gates
- [x] G1: The repo suite passes, including the new ibm-newsroom feed tests
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2920; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=4b90c045db4e1d2f54e9119ce50fc54f23c96bef3938819ce222de3459d5fa8e; output-bytes=117
- [x] G2: A live collector run on the mini shows `ibm-newsroom` with ≥1 item and no `pattern matched nothing` line for it; output pasted in the PR (manual gate)
  EVIDENCE: 2026-11-18 21:15 ET on the mini, branch tree: `python3 scripts/news/collect.py --days 8 --out /tmp/p2916` printed `  3  ok          ibm-newsroom`; `grep -i "matched nothing"` on the run output: no ibm-newsroom line.

## Post-merge checks
- PM1: fenlon11/pmOS#2916 no longer reproduces on main.
  How: read the next `com.pmos.pm-news-sources` or `com.pmos.pm-news-drafts` run log after merge for an `ibm-newsroom` line with ≥1 item; then close fenlon11/pmOS#2916 with the merge link.
  Status: pending
