# Gates — fenlon11/pmOS#2752

- [x] G1: the four descriptions no longer call the product recruiting or hiring software, proven by the new test in the suite
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=test
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2752; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=b7587788322a4f8992b791cbc75ee49d2f586e16edba73c2541e6274b5573867; output-bytes=117
- [x] G2: the site builds
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-2752; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=8fd191ba9609ed3690f4c066faac703e18e894d595eabc4f3db5129d8e0b24c1; output-bytes=118
- [x] G3: `/careers` shows the new description at 375×812 and 1440×900 with no overflow and no claim about a feature that is not live (manual; reviewer runs Playwright against a local production build and attaches both screenshots)
  EVIDENCE: reviewer 2026-11-18, local `next start` of aafb6d2 with HubSpot/Resend env unset; Playwright /careers: 375x812 overflow=false scrollWidth=375 newText=true recruit/hiring=false unlisted-feature-terms=false; 1440x900 overflow=false scrollWidth=1440 newText=true recruit/hiring=false unlisted-feature-terms=false; screenshots viewed: ~/pmOS/scripts/verify/screenshots/pmOS-2752-careers-375x812.png, ~/pmOS/scripts/verify/screenshots/pmOS-2752-careers-1440x900.png (card text wraps cleanly, no clipping)

## Post-merge checks
- PM1: `https://persistentmomentum.com/careers` returns 200 and shows the new description.
  How: once the Vercel team is resumed (decision `04190634`), `curl -s -o /dev/null -w '%{http_code}' https://persistentmomentum.com/careers` returns 200 and the page HTML contains "AI employees".
  Status: pending
