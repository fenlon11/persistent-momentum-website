# Gates — fenlon11/pmOS#3258

- [x] G1: Website unit tests pass
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-3258; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=8223c6bd5dd75e9c37c212cf27e9bf40399d6b6ad0ebfcf434d9702b212f137a; output-bytes=117
- [x] G2: The site still serves its home page
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/http.mjs --url=https://persistentmomentum.com --expect-status=200
  EXPECT: HTTP CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-3258; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=46729fa01041a3d1a50b80b624e9478059169099e2f44cd58df25274e05bdfbc; output-bytes=65
- [x] G3: Late-week decisions are right (manual gate: reviewer quotes the five new run.sh test names passing in the `npm test` output)
  EVIDENCE: npm test 2026-11-27 01:32 EST, 205 pass / 0 fail; passing: "run.sh: Friday with no PR this week skips; no new draft after Thursday", "run.sh: Saturday with a closed redraft-marked PR skips; no redraft after Thursday", "run.sh: Friday with an open draft PR without the marker still fact-checks it", "run.sh: Saturday with an open ready PR carrying the marker still runs the merge check", "run.sh: Tuesday with no PR still drafts (Mon–Thu unchanged)"
