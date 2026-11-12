# Gates — fenlon11/pmOS#2585

- [x] G1: gzip bodies (header or magic bytes) decompress, plain bodies are unchanged, corrupt gzip raises (unit tests in scripts/news/collect.test.mjs)
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2585; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=0c02ce73c26620db18e9aee7fc542ddd7d513faeddaf9f019dbc49efe5a1cbc0; output-bytes=117
- [x] G2: the site still builds
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2585; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=d6f28f30f749e7e3443d41473795f8821fe79050ffc54794ba2eac930ae41101; output-bytes=117
- [x] G3: the new gzip tests fail against origin/main's collect.py (reviewer reverts scripts/news/collect.py to origin/main, runs `node --test scripts/news/collect.test.mjs`, quotes the failing test names, restores)
  EVIDENCE: builder run 2026-11-12 (`git show origin/main:scripts/news/collect.py > scripts/news/collect.py; node --test scripts/news/collect.test.mjs`): 4 fail — "gzip body with Content-Encoding: gzip decodes to the original XML and parses", "gzip body with no Content-Encoding header (magic bytes only) decodes", "Content-Encoding header is matched case-insensitively", "Content-Encoding: gzip on a body that is not gzip raises, never returns a string"; plain-body and stdlib tests pass on main as expected; file restored. Reviewer re-runs.
- [x] G4: live DeepMind feed parses on 6 consecutive fetches (Test plan step 3; quote the six counts)
  EVIDENCE: builder run 2026-11-12 Test plan step 3: counts 100 100 100 100 100 100, no ParseError. Note: a further 8 raw probes all returned Content-Encoding None (69011 bytes), so the live gzip path was not hit this window; it is covered by the stubbed G1 tests and PM1.

## Post-merge checks
- PM1: Over the next 8 `com.pmos.pm-news-sources` runs after the merge, google-deepmind shows `ok` on every line and no `ParseError ... line 1, column 0` (benchmark today ~1 in 4 fails; healthy 0 of 8).
  How: `grep 'google-deepmind' ~/pmOS/agents/logs/pm-news-sources.stdout.log | tail -8`
  Status: pending
