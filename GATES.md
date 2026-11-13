# Gates — fenlon11/pmOS#2661

- [x] G1: the repo test suite passes with the new collector and draft tests
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2661; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=b56550bc788ab95645fc699f2cc3f48838d0acb096cfced257442d5c1260c3fb; output-bytes=117
- [x] G2: (manual, Mac mini build session) a live collector run shows all five top labs with non-research tier-1 items (or a named empty feed) and 4+ press outlets; the count table is in the PR body
  EVIDENCE: 2026-11-13 Mac mini, `python3 scripts/news/collect.py --days 8 --out /tmp/p2661/out` exit 0, 467 items, 0 without lab, 0 press without outlet. Run output: "top labs, tier-1 items: Anthropic 41, Apple 10, Google 33, Meta 13, OpenAI 22" (non-research sources per lab: claude-api/app-release-notes + claude-blog; apple-newsroom + apple-developer-news; google-workspace-updates + gemini-api-changelog; meta-newsroom; chatgpt-release-notes + openai-news) and "press outlets with items: 6 (Ars Technica, Bloomberg, CNBC, TechCrunch, The Information, The Verge)". Count table in the handoff comment / PR body.

## Post-merge checks
- PM1: the next `com.pmos.pm-news-sources` bundle (`PM_NEWS_BUNDLE=1` run, or Wednesday 08:05) has `index.json` rows with `lab` on every row and `tier: "press"` + `outlet` on press rows, with 4+ outlets among them. This also closes pmOS#2648's G2.
  How: `jq '[.rows[] | select(.tier=="press") | .outlet] | unique' "$(cat ~/.pmos/pm-news/newsletter/sources/LATEST)/index.json"` and `jq '[.rows[] | select(.lab==null)] | length'` (expect 0).
  Status: pending
