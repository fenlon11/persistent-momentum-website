# GATES — fenlon11/pmOS#681

Copied verbatim from the spec's `## Gates` section, before any code.

## Pre-merge gates (this ledger)

- [x] G1: production build passes
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-681 --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-681; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=315278ab1b75452353396c27713f0cafdc4d32a605bb7b59959fd86123d41153; output-bytes=116
- [x] G2: schema tests pass (including the failing-fixture case)
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-681 --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-681; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=5c9dbebedb327568dc5e062139b8cb3322be9b71e563add1862540e6a8b3e564; output-bytes=115
- [x] G4: (manual) screenshots of a published test-build article at 375×812 and 1440×900 show summary, dates, byline, Sources list and no horizontal scroll. Evidence: screenshot paths.
  EVIDENCE: test build 2026-10-10 (news fixture temporarily `status: published` plus a long-URL source, and 25 temp published items for pagination, all reverted before commit) → `next start -p 3681` → `node ~/pmOS/scripts/verify/capture-pmos681.mjs`: 375x812 /news/example-news-article scrollWidth=375 OK missing=[]; 1440x900 scrollWidth=1440 OK missing=[] (checked: "The short version", "Published Oct 10, 2026", "Updated Oct 10, 2026", "By Elle Evate · Head of AI Content (AI)", Sources, the long-URL source, the "Drafted by Elle Evate…" line, Related); "The short version" above the fold at 375x812 = true; /news, /, /authors/elle-evate both viewports OK; forbidden=[] ("Matt", "Fenlon"). curl: /news page 1 = 20 newest (Example news article first), /news/page/2 = items 01–06, /news/page/1 + /page/3 + /news/nope = 404. Screenshots: ~/pmOS/scripts/verify/screenshots/pmos-681-{article,news-index,home,author-elle}-{375x812,1440x900}.png, pmos-681-article-fold-375x812.png. Reviewer re-checks by eye.

G1/G2 `--dir` is retargeted from the main checkout to this worktree: run verbatim, it would build
`main`, not this branch (a false green).

## Post-deploy gates (pmos-review step 6a, after merge)

G3 checks the live `https://persistentmomentum.com/news`, which serves `main`. Before the merge it
would pass on #680's placeholder page, a green that says nothing about this branch, so it sits
outside the pre-merge ledger, unchanged, as the step 6a live proof. Not waived.

```
G3: live /news index serves
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/http.mjs --url=https://persistentmomentum.com/news --expect-status=200
  EXPECT: HTTP CHECK PASS
```
