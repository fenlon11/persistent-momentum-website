# Gates — fenlon11/pmOS#2449

- [x] G1: normUrl strips tracking parameters, spares fill dropped slots, unused spares are never drafted, UTM duplicates collapse, the selection is truncated to CAPS + SPARES (unit tests in scripts/news/draft.test.mjs)
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2449; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=991d1ec51ecbe5fe0aec382b7cbd5aaace01c9d8142d50323ef0e33e1c408088; output-bytes=117
- [x] G2: the site still builds
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2449; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=b54c9bc1eb22eeabe55fd2b48045693a325ec1059dd30fc092a92552c96d861b; output-bytes=117
- [x] G3: the new tests fail against origin/main's draft.mjs (reviewer reverts scripts/news/draft.mjs to origin/main, runs `node --test scripts/news/draft.test.mjs`, quotes the failing test names, restores)
  EVIDENCE: builder run 2026-11-08: origin/main draft.mjs fails import (no SPARES export); with `export const SPARES = 2;` appended to it, `node --test scripts/news/draft.test.mjs` -> pass 18, fail 5: "normUrl drops tracking parameters and keeps the rest in order", "draftWeek: spares fill the slots of dropped stories", "draftWeek: the same page with and without UTM parameters is one document", "the selection names the spare limit and is truncated to CAPS + SPARES in rank order", "draftWeek: caps, fetch failures, duplicates and drafter skips ..." (adjusted cap test). "spares are never drafted when no pick is dropped" passes on old code by design (old code drafts no spares). Restored; reviewer re-runs.

## Post-merge checks
- PM1: The next Monday run (2026-11-09 or the first after it) logs `selected:` with spares marked, and its draft PR body counts kept vs dropped stories.
  How: Read `agents/logs/pm-news-drafts.stdout.log` in pmOS after the Monday 07:00 ET run; confirm a `selected:` line with `[news, spare]`-style marks (when spares were picked) and the `opened draft PR ... (N draft(s), M dropped)` line.
  Status: pending
