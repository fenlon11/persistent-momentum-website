# Gates — fenlon11/pmOS#2569

- [x] G1: refused hosts (401/403) are removed before selection, other failures are not, probes are reused, one probe per host with concurrency ≤ 4 (unit tests in scripts/news/draft.test.mjs)
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2569; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=6ffdb1ca419b9c70c0f603aee36c011f3885fb25deb34661d7bb5a0f199d9df2; output-bytes=117
- [x] G2: the site still builds
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2569; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=276dc1cff9b437108ec3135debd0bc69975160d02207ffecdae92cb1bbff70bd; output-bytes=117
- [x] G3: the new refusal test fails against origin/main's draft.mjs (reviewer reverts scripts/news/draft.mjs to origin/main, runs `node --test scripts/news/draft.test.mjs`, quotes the failing test names, restores)
  EVIDENCE: builder ran it 2026-11-10: with origin/main's draft.mjs, `node --test scripts/news/draft.test.mjs` → pass 24, fail 4: "a host that refuses the fetch (403) is left out of selection", "a 401 is a refusal too, but a timeout or 503 keeps the host", "one probe per host, at most 4 in flight", "with no refused host the selection prompt matches today's for the same candidates"; restored → 28/28 pass.

## Post-merge checks
- PM1: The next Monday run (2026-11-16 or the first after it) logs a `hosts refused:` line, and no `selected:` story uses only a refused host.
  How: Read `~/pmOS/agents/logs/pm-news-drafts.stdout.log` after the Monday 07:00 run; find the `hosts refused:` line and check each `selected:` story's items are on non-refused hosts.
  Status: pending
