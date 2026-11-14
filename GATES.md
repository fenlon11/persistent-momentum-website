# Gates — fenlon11/pmOS#2644

- [x] G1: The news unit suite passes, including the new folded-title / folded-description / still-drops tests
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2644; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=d25fe662d757855374040f8481cf06844da43f93770b3fbed192991cb5a71ae1; output-bytes=117
- [x] G2: The site still builds
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2644; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=f0fcdc40fee0c00d999360d3620ec313ea17da53625ca80cc9bd4fa5124e1b56; output-bytes=117
- [x] G3: The new tests fail on origin/main's factcheck.mjs (manual gate: reviewer reverts scripts/news/factcheck.mjs to origin/main, runs `node --test scripts/news/factcheck.test.mjs`, quotes the failing test names, restores)
  EVIDENCE: 2026-11-14 builder ran `git show origin/main:scripts/news/factcheck.mjs > scripts/news/factcheck.mjs; node --test scripts/news/factcheck.test.mjs` → "ℹ pass 28 / ℹ fail 2"; failing: "a title fix copied from a folded title (line break + indent in old) applies once and keeps the article", "a description fix copied from a folded description applies once and keeps the article". Test (c) "a folded-title fix whose normalised old occurs 0 times is still skipped…" passes on main by design (it guards existing drop behaviour). File restored; branch suite 90/90 pass.

## Post-merge checks
- PM1: fenlon11/pmOS#2643 no longer reproduces on main.
  How: on the next weekly news run whose draft has a folded title or description fix, read the fact-check comment on the news PR and confirm no `old text not found in the title`/`description` drop; then close fenlon11/pmOS#2643 with the merge link.
  Status: pending
