# Gates — fenlon11/pmOS#2223

- [x] G1: the site builds (the build output the canonical test reads)
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2223; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=7cb2f5fcbfb1b37c59305a86c65a7a7e810b07d8aef321ad0326008b5a3dbce5; output-bytes=117
- [x] G2: tests pass (new canonical test included)
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2223; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=13cd0803da1d361a0174b2585027d76b85de221534d0c273b6b36f5f00913386; output-bytes=117
- [x] G3: lint passes
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=lint
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2223; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=5d0b0f7ab1a36d71f46a17dfe2c5efcfeeb3d491225955c2ca89d7f0bbf61a3a; output-bytes=116
- [x] G4: `/tags/aws`, `/consulting` and `/` built HTML each carry exactly one self-canonical plus the RSS alternate (manual: reviewer quotes the Test plan step 3 grep output)
  EVIDENCE: built HTML (`grep -o` on .next/server/app): tags/aws.html → `<link rel="canonical" href="https://persistentmomentum.com/tags/aws"/>`; consulting.html → `…/consulting"/>`; index.html → `href="https://persistentmomentum.com"/>`; each also carries `<link rel="alternate" type="application/rss+xml" … href="https://persistentmomentum.com/feed.xml"/>`. New build-output test enforces exactly one self-canonical on every page.
- [x] G5: sitemap, robots and news-sitemap sources unchanged (manual: reviewer quotes the empty Test plan step 4 diff)
  EVIDENCE: `git diff --stat origin/main -- app/sitemap.ts app/robots.ts app/news-sitemap.xml` printed nothing (exit 0).
- [x] G6: `/` and `/tags/aws` render unchanged at 375×812 and 1440×900 (manual: Playwright screenshot paths)
  EVIDENCE: Playwright (local `next start` of this branch vs live persistentmomentum.com): / and /tags/aws at 375x812 and 1440x900 — same scrollHeight (3870/2080, 2256/1148), no overflow, body innerText branch==live true at all 4; screenshots ~/pmOS/output/pmos-2223/{branch,live}-{home,tags-aws}-{375x812,1440x900}.png

## Post-merge checks
- PM1: production pages carry their self-canonical
  How: after the Vercel production deploy, `curl -s https://persistentmomentum.com/tags/aws | grep -o '<link rel="canonical"[^>]*>'` prints `href="https://persistentmomentum.com/tags/aws"`, and the same loop over all 36 sitemap `<loc>`s finds 0 without a canonical.
  Status: pending
