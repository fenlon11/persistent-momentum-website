# GATES — fenlon11/pmOS#682

Copied from the spec's `## Gates` section before any code.

G1/G2 `--dir` is retargeted from the main checkout to this worktree: run verbatim they would build
whatever branch the main checkout has parked (`copy/thesis-operators-for-operators-2026-05-16` on
2026-10-11), not this one — a false green.

- [x] G1: build passes
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-682 --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-682; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=65b7b17062ac2aaeb934823354ea7b62b5ec03339df47604ec940fb2aa7f3cd0; output-bytes=116
- [x] G2: route unit tests pass
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-682 --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-682; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=8000edc5b5ab04ef4b1472d9b5a3eda3d106b87e5a2c9999b094b7b95ce7c79d; output-bytes=115
- [x] G3: live /newsletter serves the signup form
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/http.mjs --url=https://persistentmomentum.com/newsletter --expect-status=200 --marker='newsletter'
  EXPECT: HTTP CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-682; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=978cb1075daa42815e97da473ee096f83740fbb858a623e1d22a300015436501; output-bytes=107
- [ ] G4: (manual) one `.example` test submission appears on the HubSpot form "PM – AI News & Updates subscribe" with `pm_conversion_form = ai_news_newsletter`. Evidence: submission timestamp and contact record ID, not the email. Verifier: an interactive hsOS session with the claude.ai HubSpot connector.
- [ ] G5: (manual) screenshots at both viewports of /newsletter and the home hero.

## Builder notes for the manual gates (not verdicts)

- G4: the built route (`next start`, prod build) posted one `.example` address with first name
  "pmOS682 Test" to the live form at 2026-10-11T19:55:57Z and returned 200, which the route only does
  on a 2xx from HubSpot. The reviewer still has to read the submission and its
  `pm_conversion_form` value in HubSpot.
- G5: local Playwright renders at 375×812 and 1440×900 of `/`, `/newsletter` and the draft article
  (`next dev`) showed `scrollWidth == innerWidth` on every page, with 2 signup forms on `/` and
  `/newsletter` (page + footer) and 3 on an article (after the summary, end of article, footer).
  The screenshots were local to the build session; review should take its own on the preview deploy.
- G3 passes before merge only because the old placeholder page also contains "newsletter";
  re-run it after the deploy.
