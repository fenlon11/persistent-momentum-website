# Gates — fenlon11/pmOS#1617

- [x] G1: The repo test suite passes, including the new consulting regression tests
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-1617; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=1257b2f097db29cc74c72454ce4447ff5a398093e68d855d007d072e63daaaa0; output-bytes=117
- [x] G2: The production build passes (theme audit + next build)
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-1617; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=95726f5d4256a65fcf55994fd7ff864d76c61e56153d594542fdefbdcc59443c; output-bytes=117
- [ ] G3: Reviewer reads the diff and confirms all five scope items, including that the raw HubSpot body is never logged and that the form checks `response.ok` before parsing (manual gate)
  EVIDENCE: pending

## Post-merge checks
- PM1: fenlon11/pmOS#913 no longer reproduces on main.
  How: `git -C ~/pmOS/projects/persistent-momentum/persistent-momentum-website show origin/main:lib/consulting.ts | grep -c "text.slice(0, 500)"` prints 0; then close fenlon11/pmOS#913 with the merge link.
  Status: pending
