# Gates — fenlon11/pmOS#1513

- [x] G1: The site repo suite passes, including the new style-resolution tests
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-1513 --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-1513; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=2463955428ba5e952c12a1adfa58418d6902769dbf6f57b49c93af02112d548e; output-bytes=117
- [x] G2: Reviewer runs the resolver with the canonical path and with `PM_NEWS_STYLE_PATH=/nonexistent/style.md`, sees the two log lines from acceptance 1–2, and confirms the `git grep` from acceptance 3 is clean (manual gate)
  EVIDENCE: met (builder observation; reviewer re-runs) — `node -e "import('./scripts/news/draft.mjs').then(m=>console.log(m.resolveStyle().log))"` → `style: /Users/macminipro/pmOS/projects/persistent-momentum/hubspot/02-rules/ai-newsletter-style.md`; same with `PM_NEWS_STYLE_PATH=/nonexistent/style.md` → `style: fallback <worktree>/scripts/news/STYLE.md (/nonexistent/style.md not found)`, no throw; `git grep -n "AI News & Updates\|~/hsOS" -- scripts/news` → only STYLE.md:43, the verbatim "was the working name" line from the canonical file.

## Post-merge checks
- PM1: The next `com.pmos.pm-news-drafts` run logs `style: /Users/macminipro/pmOS/projects/persistent-momentum/hubspot/02-rules/ai-newsletter-style.md`.
  How: `grep "style:" $(ls -t ~/pmOS/agents/logs/pm-news-drafts* | head -1)` after the next Monday run; then comment on fenlon11/pmOS#737 that the site part landed (#737 stays open for the pmOS BRAND.md/BUSINESS-PLAN.md renames).
  Status: pending
