# Gates — fenlon11/pmOS#2017

- [x] G1: unit tests for fix application, article drops, `reviewedBy`, decision dedupe, marker skip and no-merge all pass
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2017; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=690be74b8e22a47a2e35e3ba966e37b7518042c52a32b655dada6894285f8fde; output-bytes=117
- [x] G2: the site still builds with the new script in the tree
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2017; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=36edc58ff869b494bfc81ab766c85bd8a0e96c288743480288ca4af56670183e; output-bytes=117
- [x] G3: (manual; verifier: the Mac mini build or review session, which has `gh`, network and the Max OAuth token file) `factcheck.mjs --pr 34 --dry-run` prints a fact-check comment covering all three of PR #34's articles against live source pages, and PR #34's comment count and `pm.js decisions pending` are unchanged before and after. Evidence: the command, the printed comment saved to a file in the worktree, and the before/after counts.
  EVIDENCE: 2026-11-01 15:47Z on the mini, `node scripts/news/factcheck.mjs --pr 34 --dry-run` exit 0; printed comment in evidence/g3-dry-run-pr34.txt covers all 3 of PR #34's articles (10/10 sources HTTP 200; guide kept 3 fixes, Gemini kept 1 fix, NVIDIA dropped: description's $2,599 price unsupported by the fetched pages) and ends 'dry run: no push, no comment, no gh pr ready, no decision row'. evidence/g3-counts.txt: PR #34 comments before=4 after=4; `pm.js decisions pending | grep -c 'PR #34'` before=0 after=0.

## Post-merge checks
- PM1: Week of 2026-11-02: the first real run on that week's `content/ai-news-*` PR posts the marker comment, the PR leaves draft, its Vercel preview is green, and exactly one `matt-only` row names the PR (`pm.js decisions pending`).
  How: after the Mon–Thu 07:00 `com.pmos.pm-news-drafts` fires in the week of 2026-11-02, `gh pr list -R fenlon11/persistent-momentum-website --search "head:content/ai-news" --state all`, open that PR, confirm the `<!-- pm-news-factcheck head=` comment, `isDraft=false`, green Vercel check, and `node ~/pmOS/projects/persistent-momentum-system/pm.js decisions pending | grep -c 'PR #<n>'` → 1.
  Status: pending
