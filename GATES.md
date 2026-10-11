# GATES — fenlon11/pmOS#683

Copied from the spec's `## Gates` section before any code.

G1/G2 `--dir` is retargeted from the main checkout to this worktree: run verbatim they would build
whatever branch the main checkout has parked (an old `copy/` branch), not this one — a false green.

- [x] G1: build passes
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-683 --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-683; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=6c8c261a17b53b0fcb35e1a834911fe5bbdcf40269481f212ecc5a4b27c3ddc9; output-bytes=116
- [x] G2: route and no-pricing tests pass
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-683 --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-683; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=b457c8e694b55576be328ab55883957613fae079fc4087611641d6ff33e3b4f1; output-bytes=115
- [ ] G3: live /consulting serves both practice areas
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/http.mjs --url=https://persistentmomentum.com/consulting --expect-status=200 --marker='AI systems'
  EXPECT: HTTP CHECK PASS
  EVIDENCE: pending
- [ ] G4: (manual) a `.example` test inquiry appears on HubSpot form "PM – Consulting inquiry" with `pm_conversion_form = consulting_inquiry` (evidence: contact record ID). Verifier: interactive hsOS session with the HubSpot connector.
- [ ] G5: (manual) screenshots at both viewports of /consulting.

ABANDON: G3 post-deploy gate, and pre-merge it is a FALSE GREEN: the live placeholder's title "Business and AI systems consulting." already contains 'AI systems' (curl 2026-10-11: 10 hits, 0 hits for "How an engagement works"), so the CHECK exits 0 before this branch ships. After the prod deploy, re-run it AND confirm the page contains "How an engagement works" (only on the new page).
ABANDON: G4 post-deploy manual gate. The headless build loop has no HubSpot connector and never approves its own build. After the deploy, an interactive hsOS session submits one `.example` inquiry on /consulting and records the contact ID with pm_conversion_form=consulting_inquiry, then flags or deletes it. Also delete the probe submission described in the handoff (2026-10-11T20:39Z, firstname "T", company "X", email "not-an-email").
ABANDON: G5 manual reviewer gate. Built locally (next start, playwright-core 1.57 + cached Chromium): 375x812 scrollWidth=375=innerWidth, 1440x900 scrollWidth=1440=innerWidth, no horizontal scroll, and an empty submit shows 7 inline field errors at both sizes. Screenshots are at /tmp/pmos683-shots/ on the mini (not committed). The reviewer re-takes them on the preview or prod deploy.
