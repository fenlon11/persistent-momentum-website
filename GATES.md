# GATES — fenlon11/pmOS#942

Copied from the spec's `## Gates` section, with two changes that follow the #683 precedent (its ledger,
revised after a 2026-10-11 REVIEW FAIL):

- G1 `--dir` is retargeted from the main checkout to this worktree. Run verbatim it would build whatever
  branch the main checkout has parked (an old `copy/` branch), not this one, which is a false green.
- G3 is a post-deploy check. Before the merge it would pass against today's production because every page
  already says "Persistent Momentum", which proves nothing. It is a manual post-deploy gate here, with a
  marker only this change renders.

- [x] G1: audit in build
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-942 --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-942; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=332f7e75a5e99164ae263bfacf064a23d186e5ab20640b9e30a8ba4bf63bd4ef; output-bytes=116
- [ ] G2: (manual) before/after screenshots at 375×812 and 1440×900 of `/`, `/consulting` and one article. Verifier: loop-review (Playwright). Evidence: screenshot paths.
- [ ] G3: (manual, post-deploy) `node ~/pmOS/projects/persistent-momentum-system/verify-web-deploy.mjs --url=https://persistentmomentum.com --expect='data-design-tokens="1.0.0"'` prints VERIFY PASS. Verifier: loop-review's deploy step after the merge.

## Builder notes for the manual gates (not verdicts)

- G2: builder shots (`next dev`, because both articles are drafts and a production build gives drafts no
  route), playwright via `pw-content-planner` + cached chromium_headless_shell-1234. All 12 captures: status 200,
  scrollWidth = viewport width, 0 page errors; after = font Inter, marker 1.0.0. Files (pmOS):
  `scripts/verify/screenshots/pmos-942-{before,after}-{home,consulting,article}-{375,1440}.png`; script
  `scripts/verify/capture-pmos942.mjs <port> <label>`. Expected token-driven differences: Inter replaces the
  system font (the old `--font-body` never resolved: `--font-open-sans` was set on `<body>` but read on
  `:root`, so prod rendered `ui-sans-serif`, not Open Sans); accent `#15448e`/`#1e5bff` → Electric Blue
  `#2657D4`; light alt sections slate → Glow White `#D9FBFF`; muted text slate → Royal Blue (Mid-Gray fails
  4.5:1 at small sizes); body 15px/1.55 → 16px/1.6. Layout, copy and spacing unchanged.
- G3: the production build's `index.html` carries `data-design-tokens="1.0.0"` (checked locally); nothing on
  today's production does.
