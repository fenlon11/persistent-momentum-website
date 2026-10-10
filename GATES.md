# GATES — fenlon11/pmOS#686

Copied from the spec's `## Gates` section before any code.

G1/G2 `--dir` is retargeted from the main checkout to this worktree: run verbatim they would build
whatever branch the main checkout has parked (an old `copy/` branch on 2026-10-10), not this one —
a false green.

- [ ] G1: repo build still passes with the scripts added
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-686 --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: pending
- [ ] G2: drafter output validates against the content schema
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-686 --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: pending
- [ ] G3: LaunchAgent loaded and healthy
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/launchagent.mjs --label=com.pmos.pm-news-drafts --expect=loaded
  EXPECT: LAUNCHAGENT CHECK PASS
  EVIDENCE: pending
- [ ] G4: (manual) the first real run opened a draft PR labelled `matt-only` with a per-article checklist and did not merge. Evidence: PR URL.
  EVIDENCE: pending
