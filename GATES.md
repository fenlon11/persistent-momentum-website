# Gates — fenlon11/pmOS#2210

- [x] G1: unit tests for `decideMerge` and the merge call shape pass, with the rest of the suite
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2210; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=19b97b0a495977b3df6afbcef9a45d168347f1238669a3a712b875999b8f91f7; output-bytes=117
- [x] G2: the site still builds
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2210; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=1d0247a7e9729c1fe7abac789e719bb2d0ff37e95b6d1b191e2f59c99352a346; output-bytes=117
- [x] G3: `merge-approved.mjs --pr 44 --dry-run` on the mini prints the waiting/decision line and makes no write (manual: reviewer quotes the output and `gh pr view 44 --json state`)
  EVIDENCE: 2026-11-03 17:40 ET `PMOS_REPO=$HOME/pmOS node --no-warnings scripts/news/merge-approved.mjs --pr 44 --dry-run` → `PR #44: not merging: PR #44 is MERGED, not OPEN; mergeable is UNKNOWN; decision 438c9cf0 is class delegated, not matt-only`, exit 0; `gh pr view 44 --json state` → `{"state":"MERGED"}` (already merged as 62662772 by operator-pass at 17:21 UTC, before this build; the script wrote nothing)
- [x] G4: `run.sh` decide-only prints `decision: merge-check #<n>` for an open fact-checked PR (manual: reviewer quotes the line)
  EVIDENCE: 2026-11-03 no open fact-checked PR exists (#44 MERGED), so the live `PM_NEWS_DECIDE_ONLY=1 bash scripts/news/run.sh` prints `decision: skip`; the real run.sh with gh stubbed to `content/ai-news-2026-11-02 44 OPEN false` + 1 marker prints `decision: merge-check #44` (test "run.sh: an open, ready PR with the fact-check marker gets a merge check", pass, in G1's suite)

## Post-merge checks
- PM1: The first week where Matt answers a "Merge PM AI-news PR" row `merge`, the next 07:00 run merges that PR (merge commit on `main`) and posts the read-back comment with every article URL at HTTP 200.
  How: `gh pr view <n> -R fenlon11/persistent-momentum-website --json state,mergeCommit,comments` after the 07:00 run following the answer; read `~/.pmos/pm-news` run log.
  Status: pending
- PM2: That Wednesday's `site.json` in `~/.pmos/pm-news/newsletter/sources/<date>/` lists the merged article(s) with status 200.
  How: `jq` the file for the merged article URLs.
  Status: pending
