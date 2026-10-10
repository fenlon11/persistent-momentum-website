# GATES — fenlon11/pmOS#680

Copied verbatim from the spec's `## Gates` section, before any code.

## Pre-merge gates (this ledger)

- [x] G1: production build passes
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-680 --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-680; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=2c092046890d020934d38aba03d43785fb7a05c4dfc7bd2b9ca054fea7abeeb4; output-bytes=116
- [x] G2: lint passes
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-680 --task=lint
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-680; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=d4617db47d90b10313ab9eb336d6448622a18dcdbb3c28d6fbcf4a97044f0fc9; output-bytes=115
- [x] G6: (manual) screenshots at 375×812 and 1440×900 of / and /about show no horizontal scroll, no Persistent Sales, no pricing. Evidence: screenshot paths plus scrollWidth readings.
  EVIDENCE: `node ~/pmOS/scripts/verify/capture-pmos680.mjs` against `next start` (this branch, review-fix rebuild), 2026-10-10: 375x812 / scrollWidth=375, /about 375, /consulting 375; 1440x900 / 1440, /about 1440, /consulting 1440 — all OK; forbidden=[] ("Persistent Sales", "sales.persistentmomentum.com", "$", "Matt", "Fenlon") on every page; mobile nav items News/Guides/Newsletter/Consulting/Subscribe. Screenshots: ~/pmOS/scripts/verify/screenshots/pmos-680-{home,about,consulting}-{375x812,1440x900}.png, pmos-680-mobile-nav-375x812.png. Reviewer re-checks by eye.

G1/G2 `--dir` is retargeted from the main checkout to this worktree: run verbatim, it would build
`main`, not this branch (a false green).

## Post-deploy gates (pmos-review step 6a, after merge)

The spec's G3–G5 check the live `https://persistentmomentum.com`, which serves `main` and cannot
reflect this branch until it merges and Vercel deploys. Run before the merge they can only fail, so
they sit outside the pre-merge ledger, unchanged, as the step 6a live proof. Not waived.

```
G3: live home shows the AI news promise
  CHECK: node ~/pmOS/projects/persistent-momentum-system/verify-web-deploy.mjs --url=https://persistentmomentum.com/ --expect='What the AI companies actually shipped'
  EXPECT: VERIFY PASS
G4: live /about states the sourcing standard
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/http.mjs --url=https://persistentmomentum.com/about --expect-status=200 --marker='primary source'
  EXPECT: HTTP CHECK PASS
G5: HubSpot tracking code present on the live home page
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/http.mjs --url=https://persistentmomentum.com/ --expect-status=200 --marker='247620603.js'
  EXPECT: HTTP CHECK PASS
```
