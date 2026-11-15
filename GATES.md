# Gates — fenlon11/pmOS#2706

- [x] G1: Tests pass, covering criteria 1 to 4
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2706; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=0a2a76afe3b69b01d6d1a489224b2d39a1ab4cfe4498493878e6b75a031d4eca; output-bytes=117
- [x] G2: The build passes
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2706; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=ebc7c3c79a7e18bccbb6939b7d517ca2baa0fb7423dc5274542e7947f49b22e3; output-bytes=117
- [x] G3: Lint passes
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=lint
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2706; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=2eb0b3eba987d7d3ca4c283a70525f6f4a34e8f0038cd127ee2368ef6b8f61a7; output-bytes=116
- [x] G4: The form and the privacy page read correctly at both widths (manual gate: review session, Playwright screenshots at 375×812 and 1440×900 on a preview deployment)
  EVIDENCE: builder pre-check 2026-11-15 on local `next start` (live env stripped, /api/newsletter stubbed 200): /newsletter shows "Almost done. Check your inbox to confirm your subscription." and /privacy shows "stored in Persistent Workforce" at 375×812 and 1440×900 (Playwright, isVisible true, screenshots read). Reviewer repeats on a preview deployment per the gate.

## Post-merge checks
- PM1: one real sign-up from production appears in PM's list in PW as pending confirmation and in HubSpot list 9.
  How: a Mac mini session submits a seed address on the live site, then reads both.
  Status: pending
