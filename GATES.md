# Gates — fenlon11/pmOS#2986

- [x] G1: The repo suite passes, including the five new merge-approved cases
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2986; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=beb505e3ad7a14a6c48dd23bcc7082575db4b7eb125ac006df1328b2ca2100ae; output-bytes=117
- [x] G2: A dry run on the mini prints the planned re-date for a PR with an article dated before today and writes nothing; output pasted in the PR (manual gate)
  EVIDENCE: 2026-11-21 04:38 EST, evidence/pmOS-2986-g2-dry-run-pr63.txt. No open ready weekly PR exists (PR #63 merged 11-18), so the real CLI stops at the gate ("PR #63 is MERGED, not OPEN"). Harness with real gh reads of PR #63's head bbbe089 (4 files dated 2026-11-17), real clock, only state/decision rows overridden, every write blocked: "would re-date" 4 files (3 news renamed to 2026-11-21-<slug>.mdx, 1 guide re-dated), "would squash-merge PR #63 at the re-date commit on bbbe089 ... nothing written", writes=0; branch tip still bbbe089 after the run.

## Post-merge checks
- PM1: the next weekly merge goes into the news sitemap.
  How: after the next `content/ai-news-*` PR merges, `git log -1 --stat origin/main` shows the news files dated the merge day, and `curl -s https://persistentmomentum.com/news-sitemap.xml | grep -c '<url>'` is ≥ 1 the same day.
  Status: pending
