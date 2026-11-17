# Gates — fenlon11/pmOS#2756

- [x] G1: the new test passes in the suite
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2756; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=b6891f1b126aae33922cee14562ea5840d5252944ba0a2e2399e5f34b0868754; output-bytes=117
- [x] G2: the site builds
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2756; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=995b07e955fa7254e2a1d780b57bc340c2cf455461047659c3db25c157227371; output-bytes=117
- [ ] G3: the issue branch's head commit has zero GitHub deployment records, with one recent non-agent branch shown as a benchmark (manual; the review lane runs the `gh api` read and quotes both results in the PR body)
  EVIDENCE: pending

## Post-merge checks
- PM1: The next `loop/**` push to this repo after the merge has zero records in GitHub's deployments list for its head commit.
  How: `gh api "repos/fenlon11/persistent-momentum-website/deployments?sha=<head of next loop/** push>"` returns `[]`.
  Status: pending
