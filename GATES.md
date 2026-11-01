# Gates — fenlon11/pmOS#1658

- [x] G1: The site suite passes, including the new audit/token regression tests
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-1658; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=1f37842e8492a2d636668b1e3bacd1284402902aa9e4301780ed92b376b5b1b7; output-bytes=117
- [ ] G2: Reviewer copies the branch to a path with a space, plants `#123456`, and the audit exits non-zero; on the unchanged main it exits 0 (manual gate)
  EVIDENCE: pending
- [ ] G3: Reviewer confirms the rendered home page at 1440×900 is pixel-identical in type and spacing to main at the default font size (manual gate)
  EVIDENCE: pending

## Post-merge checks
- PM1: On main, the audit fails a planted hex from a spaced path and `npm test` passes.
  How: repeat the G2 steps on `origin/main` after merge; comment the result on fenlon11/pmOS#979. #979 closes when the pmOS `projects/persistent-momentum/DESIGN-SYSTEM.md` "Surfaces that consume it" row for persistentmomentum.com no longer reads "Not yet" (item 5); otherwise note item 5 as the remaining part.
  Status: pending
