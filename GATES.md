# GATES — fenlon11/pmOS#686

Copied from the spec's `## Gates` section before any code.

G1/G2 `--dir` is retargeted from the main checkout to this worktree: run verbatim they would build
whatever branch the main checkout has parked (an old `copy/` branch on 2026-10-10), not this one —
a false green.

- [x] G1: repo build still passes with the scripts added
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-686 --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-686; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=acb3102bfbd1e0db9f80fd2e1befad6b41a39686844dd1a04d44d09b9609394b; output-bytes=116
- [x] G2: drafter output validates against the content schema
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-686 --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-686; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=c2227dfdcaae1c3021a2a51e03034456b9a297be72961077e2b143d602d787e4; output-bytes=115
- [x] G3: LaunchAgent loaded and healthy
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/launchagent.mjs --label=com.pmos.pm-news-drafts --expect=loaded
  EXPECT: LAUNCHAGENT CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-686; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=159c02765aaea49788cb36fe34ab74491f942e12baf41596ee477b84679462e0; output-bytes=84
- [x] G4: (manual) the first real run opened a draft PR labelled `matt-only` with a per-article checklist and did not merge. Evidence: PR URL.
  EVIDENCE: https://github.com/fenlon11/persistent-momentum-website/pull/24, opened by `launchctl kickstart gui/501/com.pmos.pm-news-drafts` (plist temporarily pinned to PM_NEWS_REF=loop/pmOS-686-news-drafts) at 2026-10-10 17:09 EDT. `gh pr view 24` → draft=true state=OPEN merged=null labels=matt-only, head content/ai-news-2026-10-10, 1 file (content/news/2026-10-10-anthropic-claude-haiku-5-5.mdx), body has the 5-item checklist per article plus the dropped-stories list. `launchctl list com.pmos.pm-news-drafts` → LastExitStatus = 0. Plist then reinstalled with PM_NEWS_REF=main (the committed form).
