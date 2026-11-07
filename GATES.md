# Gates — fenlon11/pmOS#2343

- [x] G1: The repo suite passes, including the new guard tests
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2343; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=b5399742989c1b5409af2ad288200e05f2e2ef542b501352603fbd8456c19fad; output-bytes=117
- [x] G2: Reviewer runs `next start` with the shell's HubSpot GUIDs exported and no `VERCEL_ENV`, POSTs a valid consulting payload with `api.hsforms.com` intercepted (no request leaves), and confirms zero hsforms requests plus the "not set" log line (manual gate)
  EVIDENCE: reviewer 2026-11-07 at 54d1d53 (fresh `npm run build`): `next start -p 3953` with the shell's real HUBSPOT_PM_CONSULTING/NEWSLETTER_FORM_GUID set, VERCEL_ENV/RESEND/Supabase unset, `--require spy.cjs` blocking any hsforms fetch; POST /api/consulting + /api/newsletter → `SPY lines: 0`, log `[consulting] HubSpot submission failed Error: HUBSPOT_PM_CONSULTING_FORM_GUID not set`. Control (fake GUIDs + PM_ALLOW_LIVE_FORMS=1) → `SPY lines: 2` (`SPY hsforms request BLOCKED: https://api.hsforms.com/submissions/v3/integration/submit/247620603/<guid>` for both routes).
- [x] G3: Reviewer confirms Vercel exposes system env vars to the production runtime for this project (`vercel api /v9/projects/<project>` → `autoExposeSystemEnvs: true`, or the project's env includes `VERCEL_ENV`) so production leads still reach HubSpot (manual gate)
  EVIDENCE: reviewer 2026-11-07: `vercel api /v9/projects/prj_VVmIGQixcV0eGqKOzcuS8cllLOIo` → `name persistent_momentum repo fenlon11 persistent-momentum-website autoExposeSystemEnvs True`; HUBSPOT_PM_NEWSLETTER/CONSULTING_FORM_GUID targets ['production','preview'].

## Post-merge checks
- PM1: production still submits to HubSpot after the merge.
  How: read the next real consulting or newsletter submission's HubSpot form submission count (or the Vercel function log for `/api/consulting` showing no "not set" error) after the deploy; then close fenlon11/pmOS#1990 with the merge link.
  Status: pending
