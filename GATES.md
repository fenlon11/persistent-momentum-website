# Gates — fenlon11/pmOS#2454

- [x] G1: Production build succeeds
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2454; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=2a3d6c029c6382117c851d2ff7d7438168681c75592828dea3e8a107a1df29b4; output-bytes=117
- [x] G2: The repo suite passes, including the new og:url build-output test
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2454; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=7d8a5d0b606f8c2ad57d85617866ebf9142509dd957db7f75560a266806ef69f; output-bytes=117
- [ ] G3: Reviewer confirms the new test fails against origin/main's build output and passes on the branch, and that `.next/server/app/news.html` carries `og:url` `https://persistentmomentum.com/news` (manual gate)
  EVIDENCE: pending

## Post-merge checks
- PM1: production `og:url` matches each page.
  How: `curl -s https://persistentmomentum.com/news | grep -o '<meta property="og:url"[^>]*>'` → `.../news`; same for `/guides` and `/about`; then close fenlon11/pmOS#2235 with the merge link.
  Status: pending
