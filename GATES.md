# GATES — fenlon11/pmOS#685

Copied from the spec's `## Gates` section before any code.

## Pre-merge gates (this ledger)

- [x] G1: build passes
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-685 --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-685; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=c56aa8b8bc46186bec566b0c3af2abd2b98cda01545eae4aeb746619c841ff82; output-bytes=116
- [x] G2: JSON-LD, no-FAQ and reviewedBy tests pass
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=/Users/macminipro/pmOS/.claude/worktrees/pmOS-685 --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-685; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=1bc9af18fa436ee6cc53fb86a544ae71bc4b6048fc5c822475d52893f019ecd5; output-bytes=115
- [x] G7: (manual) Lighthouse on a test-build article shows LCP ≤ 2.5 s and CLS ≤ 0.1; crawler-UA curls return 200; the Vercel AI Bots ruleset is Off or Log. Evidence: command output.
  EVIDENCE: test build 2026-10-10 (both draft fixtures temporarily `status: published`, reverted before commit) → `next start -p 3685`. Lighthouse 12 (Playwright Chromium headless, mobile, simulated throttling) on /news/example-news-article: LCP 1.7 s (1718 ms), CLS 0, FCP 1.7 s, perf score 0.70 (TBT 2,890 ms, outside this gate, noted in the handoff). Crawler-UA curls (`curl -A "Mozilla/5.0 (compatible; <bot>/1.0)"`), Googlebot, bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User, GPTBot, ClaudeBot, CCBot: all 200 on the local test article and all 200 on live https://persistentmomentum.com/about. Vercel AI Bots ruleset: `GET /v1/security/firewall/config/active?projectId=prj_VVmIGQixcV0eGqKOzcuS8cllLOIo` (project persistent_momentum, the one `vercel inspect persistentmomentum.com` resolves) → HTTP 404 `{"code":"not_found","message":"Config not found"}`: no firewall config was ever saved, so the managed AI Bots ruleset sits at Vercel's default, disabled (= Off). Same test build: `npm test` → "articles checked: 2", 26/26 pass (rendered JSON-LD headline/dates equal the h1 and time[datetime] on both article pages); og:image 1200x675 PNG 200; news-sitemap.xml listed the 2026-10-10 news item with all required news tags.

G1/G2 `--dir` is retargeted from the main checkout to this worktree: run verbatim, they would build
`main`, not this branch (a false green). G2 runs after G1 because the no-FAQ/robots tests read the
`next build` output in `.next/`.

## Post-deploy gates (pmos-review step 6a, after merge)

G3–G6 check the live `https://persistentmomentum.com`, which serves `main`. Before the merge they
fail (robots.txt is Cloudflare's comment-only managed file over an origin 404) or would pass on
something unrelated, so they sit outside the pre-merge ledger, unchanged, as the step 6a live
proof. Not waived.

```
G3: live robots.txt allows the answer-engine search bots
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/http.mjs --url=https://persistentmomentum.com/robots.txt --expect-status=200 --marker='Claude-SearchBot'
  EXPECT: HTTP CHECK PASS
G4: live sitemap serves
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/http.mjs --url=https://persistentmomentum.com/sitemap.xml --expect-status=200 --marker='<urlset'
  EXPECT: HTTP CHECK PASS
G5: live RSS feed serves
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/http.mjs --url=https://persistentmomentum.com/feed.xml --expect-status=200 --marker='<rss'
  EXPECT: HTTP CHECK PASS
G6: live editorial policy names the review step
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/http.mjs --url=https://persistentmomentum.com/editorial-policy --expect-status=200 --marker='reviewed by'
  EXPECT: HTTP CHECK PASS
```

G8 (manual, after the first real article merges): Rich Results Test passes NewsArticle. Verifier:
the standing browser session (pm_browser_tasks). Not satisfiable by this build — no published
article exists yet.
