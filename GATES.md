## Gates
- [x] G1: The branch builds with the pinned target version.
  CHECK: node ~/pmOS/scripts/pmos-loop/checks/repo.mjs --dir=. --task=build
  EXPECT: REPO CHECK PASS
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/Users/macminipro/pmOS/.claude/worktrees/pmOS-3305; path=1d6c009ae5f2/5 entries; EXPECT=matched; output-sha256=3697edc3ae5c32efad9f0b5614f048cbaf3c5a2a58a38cc49fdba565ce46c41d; output-bytes=118
- [x] G2: (manual; verifier: review loop) `package.json` pins next + eslint-config-next exactly to the target read from live Dependabot rows at build time, and the lockfile resolves next = target, sharp ≥ 0.35.5. Evidence: the `gh api` row read + `npm ls next sharp` output.
  EVIDENCE: builder 2026-11-26 — live Dependabot read (gh api dependabot/alerts?state=open, package next): critical/high max first_patched = 15.5.28 (#112 critical GHSA-2464-fhr4-w9xw, #111 high); all 33 open next rows clear at 15.5.29 (#116-#118 medium). Target 15.5.29 (issue title). package.json: "next": "15.5.29", "eslint-config-next": "15.5.29". `npm ls next sharp` → next@15.5.29 -> sharp@0.35.5.
- [x] G3: (manual; verifier: review loop) Home page renders with images at 375×812 and 1440×900. Evidence: screenshot paths.
  EVIDENCE: builder 2026-11-26 — local `next start` of this branch's build; Playwright: 375x812 imgs=2 loaded=2, 1440x900 imgs=2 loaded=2; ~/pmOS/scratchpad/pmos3305/home-375x812.png, home-1440x900.png; local /_next/image?url=%2Flogo.png&w=256&q=75 → 200 image/png.

## Post-merge checks
- PM1: Production readback
  How: read Vercel `targets.production.meta.githubCommitSha` for the project, then `gh api repos/fenlon11/persistent-momentum-website/contents/package-lock.json?ref=<sha>` shows next = target; `curl -s -o /dev/null -w '%{http_code} %{content_type}' 'https://persistentmomentum.com/_next/image?url=%2Flogo.png&w=256&q=75'` → `200 image/*`.
  Status: pending
- PM2: Zero open critical `next` rows
  How: `gh api --paginate "repos/fenlon11/persistent-momentum-website/dependabot/alerts?state=open&per_page=100"` filtered to package next + severity critical returns nothing. Record before/after in `docs/defects/DEF-20261025-deployed-next-critical-advisories/execute.md` `## Evidence` (pmOS).
  Status: pending
