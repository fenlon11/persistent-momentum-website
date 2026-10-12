# GATES — fenlon11/pmOS#682

Copied from the spec's `## Gates` section before any code.

G1/G2 `--dir` is retargeted from the main checkout to this worktree: run verbatim they would build
whatever branch the main checkout has parked (`copy/thesis-operators-for-operators-2026-05-16` on
2026-10-11), not this one — a false green.

- [x] G1: build passes
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-682 --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-682; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=0d4f44c02086f97964a21d77aae16638e3565f5bd0749ff3882b00348767bddf; output-bytes=116
- [x] G2: route unit tests pass
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-682 --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-682; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=b65fd882c7680281f45b25c4b7feefd1cceb49aa5fef07a120cb92588548723b; output-bytes=115
- [x] G3: live /newsletter serves the signup form
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/http.mjs --url=https://persistentmomentum.com/newsletter --expect-status=200 --marker='newsletter'
  EXPECT: HTTP CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-682; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=978cb1075daa42815e97da473ee096f83740fbb858a623e1d22a300015436501; output-bytes=107
- [ ] G4: (manual) one `.example` test submission appears on the HubSpot form "PM – AI News & Updates subscribe" with `pm_conversion_form = ai_news_newsletter`. Evidence: submission timestamp and contact record ID, not the email. Verifier: an interactive hsOS session with the claude.ai HubSpot connector.
- [ ] G5: (manual) screenshots at both viewports of /newsletter and the home hero.

## Builder notes for the manual gates (not verdicts)

- G4 (round 2, after REVIEW FAIL): the `.example` submission at 2026-10-11T19:55:57Z got a 200 from
  `api.hsforms.com` but **never became a contact**. HubSpot accepts reserved-domain addresses and then
  drops them silently, so the spec's ".example is acceptable" does not hold for HubSpot-form gates.
  Re-test through the same built route (prod build, `next start`, real GUID) with a PM-domain address
  (`persistentmomentum.com`, iCloud MX), first name "pmOS682 Retest": route 200 at 2026-10-11T20:16:00Z.
  Read back with the `hsos-claude` key (portal 247620603): contact **567771282115**, createdate
  2026-10-11T20:16:00.716Z, `pm_conversion_form = ai_news_newsletter`, `lifecyclestage = subscriber`.
  Flagged afterwards per the spec: `pm_mock_record = true` (read back `'true'`), which puts it in
  segment 12 "Mock records, never email". The form-submissions list itself needs a `forms`-scoped key
  that this portal does not have in Bitwarden; the contact read is the proof.
- G5: local Playwright renders at 375×812 and 1440×900 of `/`, `/newsletter` and the draft article
  (`next dev`) showed `scrollWidth == innerWidth` on every page, with 2 signup forms on `/` and
  `/newsletter` (page + footer) and 3 on an article (after the summary, end of article, footer).
  The screenshots were local to the build session; review should take its own on the preview deploy.
- G3 passes before merge only because the old placeholder page also contains "newsletter";
  re-run it after the deploy.
- Round 3 (REVIEW FAIL, consent text): the form now renders `COMMUNICATIONS_TEXT` and
  `CONSENT_TO_PROCESS_PARTS` (the middle part is the /privacy link), and `buildHubSpotPayload` sends
  the same constants. New unit test `consent: HubSpot records exactly the words the form shows` is red
  against the round-2 form and green now. Fresh `next build` + `next start`: `/` and `/newsletter`
  each contain both consent sentences twice (page form + footer) and "By subscribing you agree" zero
  times. The visible copy got longer; G5 screenshots must be re-taken (no Playwright on this host in
  the build session, so no viewport check was run for round 3).
- Round 4 (REVIEW FAIL, footer email field collapsed at 640–800px): `compact` forms now stay stacked
  until `lg` (non-compact keep `sm:flex-row`). Prod build + `next start`, Playwright, footer form
  (form / email input / button px): 640 → 223/223/223, 667 → 235/235/235, 768 → 277/277/277
  (stacked, full width), 1024 → 383/239/133, 1440 → 437/292/133. Was 640 → 223/79/133. Page forms
  unchanged; `scrollWidth == innerWidth` at 375, 640, 667, 768, 1024, 1280, 1440 on `/` and
  `/newsletter`. Draft article (`next dev`) compact slot: 640 → email 576, 1024 → 431; no overflow.
  Screenshots: `~/pmOS/scripts/verify/screenshots/pmOS-682-r4-{home,newsletter}-{375x812,1440x900}.png`
  and `pmOS-682-r4-footer-form-640.png`. Also from the non-blocking list: a 400 on a non-email
  field shows that field's message, and the HubSpot rejection log line carries the status and error
  codes only (the body can echo the address; `hubspot_error` in the DB row is unchanged).
