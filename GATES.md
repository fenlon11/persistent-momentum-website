## Gates
- [x] G1: title and description fixes apply under the exactly-once rule, an over-long description drops with a schema reason, YAML quoting survives, body fixes never touch frontmatter (unit tests in scripts/news/factcheck.test.mjs)
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2568; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=d8020b3d70c0bc950cf9592fbb0aa69bb00025add7ed1d4d0bc546ed636537b5; output-bytes=117
- [x] G2: the site still builds
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2568; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=b9b1c0fe1f59f4f359a274d59b6f9b022458182f7fa3e435b400a6b14b84cc22; output-bytes=117
- [x] G3: the new title-fix test fails against origin/main's factcheck.mjs (reviewer reverts scripts/news/factcheck.mjs to origin/main, runs `node --test scripts/news/factcheck.test.mjs`, quotes the failing test names, restores)
  EVIDENCE: builder ran it 2026-11-10 (`git show origin/main:scripts/news/factcheck.mjs > scripts/news/factcheck.mjs && node --test scripts/news/factcheck.test.mjs`): ℹ fail 5 — ✖ a sourced title fix corrects the title and keeps the article; ✖ a description fix applies the same way; one past 160 characters drops with a schema reason; ✖ a title fix whose old text occurs 0 or 2 times is skipped and drops the article; ✖ a title holding ": " and a double quote still round-trips through gray-matter after a fix; ✖ commentBody names the field of a frontmatter fix. Restored; branch file passes 21/21. Reviewer re-runs.

## Post-merge checks
- PM1: The next fact-check run (Mon 2026-11-16 or the first after it) logs `kept, N fix(es)` for any article that would earlier have dropped only on a title or description claim, or no such article appears that week.
  How: Read `agents/logs/pm-news-drafts.stdout.log` in ~/pmOS after the run.
  Status: pending
