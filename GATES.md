# GATES — fenlon11/pmOS#683

Copied from the spec's `## Gates` section (revised 2026-10-17 after the 2026-10-11 REVIEW FAIL: the
original G3 was a post-deploy check in a pre-merge ledger and a false green before merge, so it moved to
step 6a's deploy gate; G4 and G5 are manual gates, not abandoned ones).

G1/G2 `--dir` is retargeted from the main checkout to this worktree: run verbatim they would build
whatever branch the main checkout has parked (an old `copy/` branch), not this one — a false green.

- [x] G1: build passes
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-683 --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-683; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=31647e3d4df421eeee5f565c1a225c3dcb0c3f6d28542c939c879a1985c60501; output-bytes=116
- [x] G2: route and no-pricing tests pass
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-683 --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-683; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=05d2d529f9798352f6f9b907f1f612593cccd83adcf026f94fe61a1d29ac8783; output-bytes=116
- [ ] G3: (manual, post-deploy) a test inquiry on prod appears on HubSpot form "PM – Consulting inquiry" with `pm_conversion_form = consulting_inquiry` (evidence: contact record ID, never the email; use a `persistentmomentum.com` address, HubSpot silently drops `.example`). Verifier: an interactive session with the HubSpot connector after the deploy; it also deletes the build's probe submission (2026-10-11T20:39Z, firstname "T", company "X").
- [x] G4: (manual) screenshots at both viewports of /consulting.
  EVIDENCE: reviewer 2026-10-17 on 4f7eec8 (`next start -p 3683`, playwright-core): 375x812 scrollWidth=375=innerWidth, 1440x900 scrollWidth=1440=innerWidth; rendered text has 0 pricing/forbidden terms, contains Business systems / AI systems / How an engagement works; empty submit shows 7 inline field errors. Renders inspected. Shots: pmOS scripts/verify/screenshots/pmos-683-r3-consulting-{375,1440}{,-errors}.png

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
