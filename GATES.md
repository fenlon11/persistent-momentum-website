# Gates — fenlon11/pmOS#1658

- [x] G1: The site suite passes, including the new audit/token regression tests
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-1658; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=1f37842e8492a2d636668b1e3bacd1284402902aa9e4301780ed92b376b5b1b7; output-bytes=117
- [x] G2: Reviewer copies the branch to a path with a space, plants `#123456`, and the audit exits non-zero; on the unchanged main it exits 0 (manual gate)
  EVIDENCE: review 2026-10-31: `git archive` of 1e3de58 and origin/main into `/tmp/pmw space review-1658/{branch,main}`, `#123456` planted in components/Planted.tsx; `node scripts/audit-theme.mjs` → main exit=0 with 0 bytes of output (guard skipped), branch exit=1 `components/Planted.tsx:1  #123456`. Same branch copy, hex in content/planted.mdx → exit=1 `content/planted.mdx:1  #123456`; `&#8217;` + `url(#fade)` + `href="#feed"` → branch exit=0 clean, while main from a no-space path flags `#8217 #fade #feed`.
- [x] G3: Reviewer confirms the rendered home page at 1440×900 is pixel-identical in type and spacing to main at the default font size (manual gate)
  EVIDENCE: review 2026-10-31: production builds of 1e3de58 (CSS fa99815d…, `--pm-text-body:1rem`) and origin/main (CSS 12c62d2e…, `--pm-text-body:16px`) served side by side; Playwright full-page `/` screenshots are byte-identical (sha256 3dacfe47a5ab68e4… both at 1440×900, f8232bc920461b03… both at 375×812; scripts/verify/screenshots/pmOS-1658-{branch,main}-*.png); computed font-size/line-height/padding/margin/gap/box of all 139 elements: 0 diffs at both widths. At a 20px root, body text is 20px on the branch vs 16px on main (rem scales).

## Post-merge checks
- PM1: On main, the audit fails a planted hex from a spaced path and `npm test` passes.
  How: repeat the G2 steps on `origin/main` after merge; comment the result on fenlon11/pmOS#979. #979 closes when the pmOS `projects/persistent-momentum/DESIGN-SYSTEM.md` "Surfaces that consume it" row for persistentmomentum.com no longer reads "Not yet" (item 5); otherwise note item 5 as the remaining part.
  Status: pending
