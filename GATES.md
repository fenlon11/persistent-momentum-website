# GATES — fenlon11/pmOS#683

Copied from the spec's `## Gates` section (revised 2026-10-17 after the 2026-10-11 REVIEW FAIL: the
original G3 was a post-deploy check in a pre-merge ledger and a false green before merge, so it moved to
step 6a's deploy gate; G4 and G5 are manual gates, not abandoned ones).

G1/G2 `--dir` is retargeted from the main checkout to this worktree: run verbatim they would build
whatever branch the main checkout has parked (an old `copy/` branch), not this one — a false green.

- [x] G1: build passes
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-683 --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-683; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=b44d077b7e0008cf17d8ea7b738375bb4bc30f3a3e34621a5925539a438f35df; output-bytes=116
- [x] G2: route and no-pricing tests pass
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-683 --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-683; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=b457c8e694b55576be328ab55883957613fae079fc4087611641d6ff33e3b4f1; output-bytes=115
- [ ] G3: (manual, post-deploy) a `.example` test inquiry appears on HubSpot form "PM – Consulting inquiry" with `pm_conversion_form = consulting_inquiry` (evidence: contact record ID, never the email). Verifier: an interactive session with the claude.ai HubSpot connector, after the production deploy. Cleanup in the same pass: delete the build's probe submission (2026-10-11T20:39Z, firstname "T", company "X", email "not-an-email").
- [ ] G4: (manual) screenshots at both viewports of /consulting.

## Builder notes for the manual gates (not verdicts)

- Live page proof is step 6a's deploy gate, not a ledger row:
  `verify-web-deploy.mjs --url=https://persistentmomentum.com/consulting --expect="How an engagement works"`.
  Only the new page carries that marker; the old placeholder already said "AI systems", which is why the
  first ledger's G3 passed before merge and proved nothing.
- G3: HubSpot accepts reserved-domain addresses and drops them silently (#682 round 2), so the post-deploy
  check should submit a `persistentmomentum.com` address, read the contact back, then flag it
  `pm_mock_record = true` or delete it.
- G4: built locally (`next start`, playwright-core 1.57 + cached Chromium): 375×812 scrollWidth=375=innerWidth,
  1440×900 scrollWidth=1440=innerWidth, no horizontal scroll, and an empty submit shows 7 inline field errors
  at both sizes. Review (2026-10-11) re-took them on its own build:
  `scripts/verify/screenshots/pmos-683-consulting-{375,1440}{,-errors}.png` (pmOS), copy inspected and matching
  the spec.
