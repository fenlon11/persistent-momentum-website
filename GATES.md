# GATES — fenlon11/pmOS#2561

- [x] G1: factcheck files the merge row as `--class classify` (argv asserted in `factcheck.test.mjs`), dedupe unchanged
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2561; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=cad754de55c6719584fc9bc8f808c30ba41ed71b2e660fe0276688617ba7941f; output-bytes=117
- [x] G2: merge-approved accepts an answered `merge` row of class `delegated` or `matt-only` and refuses class `auto`, unanswered rows and non-merge answers (asserted in `merge-approved.test.mjs`)
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2561; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=cad754de55c6719584fc9bc8f808c30ba41ed71b2e660fe0276688617ba7941f; output-bytes=117
- [ ] G3: Reviewer: live dry run against PR #51 (`merge-approved.mjs --pr 51 --dry-run`, read-only) no longer reports `not matt-only` for row 2d6b6487 — manual gate; the reviewer pastes the dry-run output
  EVIDENCE: pending

## Post-merge checks
- PM1: The next `com.pmos.pm-news-drafts` run that fact-checks a PR logs no `FAIL: ... decisions add` line and files one `Merge PM AI-news PR #<n>` row of class `delegated`.
  How: Mon 2026-11-16 (or Tue retry): `grep "decisions add" agents/logs/pm-news-drafts.stderr.log`; `node pm.js decisions pending`.
  Status: pending
- PM2: Once the row is answered `merge`, the next run's `merge-approved.mjs --pr <n>` merges the PR and comments the live read-back.
  How: PR #51 was merged by hand 2026-11-10 (a001c346); observe on the week-of-11-16 PR instead.
  Status: pending
