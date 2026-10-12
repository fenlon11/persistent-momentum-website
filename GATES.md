# GATES — fenlon11/pmOS#703

Copied from the spec's `## Gates` section before any code.

G1/G2 `--dir` is retargeted from the main checkout to this worktree: run verbatim they would build
whatever branch the main checkout has parked (`copy/thesis-operators-for-operators-2026-05-16` on
2026-10-12), not this one — a false green. G3–G6 read the live site, so they can only pass after the
merge deploys to production.

- [x] G1: production build passes
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-703 --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-703; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=e7e2f3b0a62a8d1337a3823a0fb3e731bc9b07c9bd46198669581b46e10af4a7; output-bytes=116
- [x] G2: lint passes
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-703 --task=lint
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-703; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=78410bc946d1489b6afdd00f7181fbb92e3aec0a4b0d56808d7845bf4c40ed33; output-bytes=115
- [ ] G3: live home shows the new title
  CHECK: node ~/pmOS/projects/persistent-momentum-system/verify-web-deploy.mjs --url=https://persistentmomentum.com/ --expect='Stay up to date on the AI news that matters'
  EXPECT: VERIFY PASS
  EVIDENCE: pending
- [ ] G4: live home shows the new subtitle
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/http.mjs --url=https://persistentmomentum.com/ --expect-status=200 --marker='We track what the big AI companies ship'
  EXPECT: HTTP CHECK PASS
  EVIDENCE: pending
- [ ] G5: live /newsletter carries the new message
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/http.mjs --url=https://persistentmomentum.com/newsletter --expect-status=200 --marker='Stay up to date on the AI news that matters'
  EXPECT: HTTP CHECK PASS
  EVIDENCE: pending
- [ ] G6: live /about carries the new message
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/http.mjs --url=https://persistentmomentum.com/about --expect-status=200 --marker='stay up to date on the AI news that matters'
  EXPECT: HTTP CHECK PASS
  EVIDENCE: pending
- [ ] G7: (manual) both greps above are clean, and screenshots of /, /about and /newsletter at 375×812 show no horizontal scroll. Evidence: grep output, screenshot paths, scrollWidth readings.

## Builder notes (not verdicts)

- G3–G6 are post-deploy gates: they read https://persistentmomentum.com, which serves `main`, so they
  fail before the merge by construction (all four returned 200 with the old copy on 2026-10-12).
  Pre-merge proxy, same markers against this branch's `next build` + `next start` on :3703: all four
  `HTTP CHECK PASS`. Home has exactly one `<h1>` ("Stay up to date on the AI news that matters.") and its
  meta description equals the new site description (153 chars). Re-run G3–G6 after the deploy.
- G7 greps: `git grep -n -i "weekly" -- app components content/authors public` → no output (exit 1).
  `git grep -n -i "actually shipped" -- . ':!content/news/'` → one hit, `scripts/news/STYLE.md:34`, the
  canonical theme's own `Retired 2026-10-11: "What the AI companies actually shipped…"` marker. The spec
  says to re-copy the Theme section from hsOS verbatim, and that line is part of it; nothing a reader
  sees carries the old line.
- G7 viewports (Playwright, `next start`): scrollWidth == innerWidth on /, /about, /newsletter at 375×812
  (375) and 1440×900 (1440). Screenshots: `~/pmOS/scripts/verify/screenshots/pmOS-703-{home,about,newsletter}-{375x812,1440x900}.png`.
