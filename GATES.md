# Gates — fenlon11/pmOS#2236

- [x] G1: tests pass, new gsc-report test included
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2236; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=4d83cf295f01e30f609e0dce9394e3eefdf39f8467c284d959ea5c85e656ca03; output-bytes=117
- [x] G2: the site still builds
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2236; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=cb1c21f7f410ef070b86af1accdcf11008dc17dba9655f843578879d5573b5e0; output-bytes=117
- [x] G3: lint passes
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=lint
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2236; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=cd3619af8ae80a2cf7d5db596d2331ca28d1736cd9f1914ec3f165290ca33331; output-bytes=116
- [x] G4: without credentials the script prints the skip line and exits 0; each fixture prints the expected summary (manual: reviewer quotes Test plan step 3 output)
  EVIDENCE: builder run 2026-11-04 — `env -u GSC_SERVICE_ACCOUNT_FILE node scripts/seo/gsc-report.mjs` -> "gsc-report: skipped, no GSC credentials", exit 0; --fixtures scripts/seo/fixtures/all-indexed -> "gsc-report: sitemaps 2/2 Success · articles indexed 4/4", exit 0; fixtures/partial -> "gsc-report: sitemaps 1/2 Success · articles indexed 2/4", exit 0; fixtures/forbidden -> "gsc-report: failed: GET https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Apersistentmomentum.com/sitemaps -> HTTP 403 (stubbed)", exit 1; run.sh report line with creds unset -> skip line, exit 0. Reviewer re-quotes.
- [x] G5: the script calls only read endpoints and the site's app/lib/public are unchanged (manual: reviewer quotes Test plan step 4 output)
  EVIDENCE: builder run 2026-11-04 — `git grep -nE "googleapis.com|search.google" -- scripts/seo/` hits gsc-report.mjs:20-23 only (scope id webmasters.readonly, oauth2 token, sitemaps GET, urlInspection/index:inspect) plus the test's expected-list of the same four; 0 hits in fixtures; `git diff origin/main --stat -- app/ lib/ public/` empty. Reviewer re-quotes.

## Post-merge checks
- PM1: live read with a provisioned service account
  How: once the operator provisions the service account (README "Google Search Console report" block; browser task deb3d921), a Mac mini session runs `GSC_SERVICE_ACCOUNT_FILE=~/.pmos/gsc-service-account.json node scripts/seo/gsc-report.mjs` from origin/main and posts the summary and per-article lines on fenlon11/pmOS#2236 and fenlon11/pmOS#2223.
  Status: pending
