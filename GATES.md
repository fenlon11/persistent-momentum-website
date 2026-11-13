# Gates — fenlon11/pmOS#2622

- [x] G1: all-dropped fact-check closes the PR with the redraft marker, writes the avoid file and signals exit 3; kept case unchanged; dry run writes nothing; run.sh decides `redraft` only on a marker-carrying closed PR; `--avoid` titles reach the `<existing>` block (unit tests in scripts/news/*.test.mjs)
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2622; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=6523eb0df4fb56ef1dfb5fb96772ff799aec2abe929c9b03feee695e11852f91; output-bytes=117
- [x] G2: the site still builds
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2622; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=03d9a25aaef4918cdd50f7d7d865b371243e30ad21fae6d0140d05d409b2e463; output-bytes=117
- [x] G3: the new tests fail against origin/main's scripts (reviewer reverts scripts/news/factcheck.mjs, draft.mjs and run.sh to origin/main, runs `node --test scripts/news/factcheck.test.mjs scripts/news/draft.test.mjs`, quotes the failing test names, restores)
  EVIDENCE: builder ran it 2026-11-13: all three reverted -> both files fail at import ("does not provide an export named 'REDRAFT_MARKER'" / "'readAvoid'"), fail 2 pass 0; run.sh alone reverted -> "✖ run.sh: a closed PR carrying the pm-news-redraft comment is redrafted; one without it is skipped", fail 1 pass 26; restored. The reviewer re-runs it.

## Post-merge checks
- PM1: the first week where a fact-check keeps nothing redrafts in the same run
  How: `agents/logs/pm-news-drafts.stdout.log` shows `fact-check kept nothing on PR #<n>; redrafting this week` followed by `opened draft PR` in the same run, and the closed PR carries the `pm-news-redraft` comment. May not happen for weeks; no fixed date.
  Status: pending
