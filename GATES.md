# GATES — fenlon11/pmOS#1291

## Gates
- [x] G1: unit tests pass (newsletter payload carries hs_persona = persona_1)
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-1291 --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-1291; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=6769f262fabcb78dfb84a3fce8404c6a5be64b5ca1713a5b306f7e51b08a9fba; output-bytes=117

## Post-merge checks
- PM1: After the Vercel prod deploy, a newsletter signup creates or updates the HubSpot contact (portal 247620603) with Persona = `persona_1` and `pm_conversion_form = ai_news_newsletter`; the test contact is then flagged `pm_mock_record = true` (spec G2, moved here because the test plan runs it "after deploy").
  How: one signup on https://persistentmomentum.com with an `info+pmos1291@` PM address; read the contact back by ID through the claude.ai HubSpot connector (or Bitwarden `hsos-claude` key) for `hs_persona` and `pm_conversion_form`; set `pm_mock_record = true`. A 400 FIELD_NOT_IN_FORM_DEFINITION in the Vercel function log means the hidden Persona field on form 48798d18 is missing.
  Status: pending
