# Gates — fenlon11/pmOS#2343

- [x] G1: The repo suite passes, including the new guard tests
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2343; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=b5399742989c1b5409af2ad288200e05f2e2ef542b501352603fbd8456c19fad; output-bytes=117
- [ ] G2: Reviewer runs `next start` with the shell's HubSpot GUIDs exported and no `VERCEL_ENV`, POSTs a valid consulting payload with `api.hsforms.com` intercepted (no request leaves), and confirms zero hsforms requests plus the "not set" log line (manual gate)
  EVIDENCE: pending
- [ ] G3: Reviewer confirms Vercel exposes system env vars to the production runtime for this project (`vercel api /v9/projects/<project>` → `autoExposeSystemEnvs: true`, or the project's env includes `VERCEL_ENV`) so production leads still reach HubSpot (manual gate)
  EVIDENCE: pending

## Post-merge checks
- PM1: production still submits to HubSpot after the merge.
  How: read the next real consulting or newsletter submission's HubSpot form submission count (or the Vercel function log for `/api/consulting` showing no "not set" error) after the deploy; then close fenlon11/pmOS#1990 with the merge link.
  Status: pending
