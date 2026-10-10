# Persistent Momentum Website — persistentmomentum.com

> **This project is part of pmOS.** Read `~/pmOS/CLAUDE.md` (master instructions) and `~/pmOS/projects/persistent-momentum/BRAND.md` (parent brand rules — governs this site's copy). Separate git repo: `fenlon11/persistent-momentum-website`, Vercel deploy on main, PR-merge workflow with short-lived typed branches (`copy/…-YYYY-MM-DD`, `fix/…`).

Next.js 15 (App Router) + React 19 + Tailwind v4 site with two jobs (set 2026-10-10, canonical: pmOS `projects/persistent-momentum/BUSINESS-PLAN.md` § Go-to-market): (1) **AI news** — news articles + evergreen guides built to win SEO/AEO, converting to a newsletter signup in the PM HubSpot portal 247620603; (2) **business and AI systems consulting** — contact form, no pricing anywhere. Persistent Workforce gets one quiet footer link only (Persistent Sales retired 2026-10-10). Also: a TCPA/A2P-compliant contact form (Supabase + Resend), and a **PIN-gated internal pmOS Command Center** at `/dashboard` reading live telemetry from the pmOS platform Supabase.

## Commands

`npm run dev` / `build` / `start` / `lint`. No test script — verify per pmOS protocol (Playwright screenshots 375×812 + 1440×900).

## Two Supabase projects — don't conflate

- **Main site** (contact form): `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` → `lib/supabase.ts`.
- **pmOS platform** (dashboard reads, project `klrrjnzpkvdlfucjrasy`): `PMOS_SUPABASE_URL` / `PMOS_SUPABASE_SERVICE_KEY` → `lib/supabase-platform.ts` (read-only; no-ops gracefully when unset).
- Dashboard gate: `DASHBOARD_PIN` (Matt-only). `/dashboard` and its `/api/*` routes live in the public prod app — treat platform-key handling as sensitive.
- Contact email: `RESEND_API_KEY`, `NOTIFICATION_EMAIL`.

## Brand rules (BRAND.md is law on this surface)

- **No Rabbit Golf anywhere customer-facing** — not products list, footer, deck, or careers (`lib/products-data.ts` enforces; only Persistent Workforce listed).
- Forbidden copy terms: "platform" as modifier, "AI-powered" as adjective, synergy, journey, transformation, ecosystem, holistic/end-to-end, unlock, next-generation, revolutionary, empower/enable/accelerate (vague), solutions, leverage. Preferred: product, build/ship, portfolio, operator, customer, factory, compound.
- BRAND.md's palette/typography (Deep Navy `#07112C` / Electric Blue / Geist) is **aspirational `[GAP]`** — the shipped site uses primary `#15448e` + Open Sans, token names shared with recruiter.persistentmomentum.com so components can move between sites.

## Design tokens + design-sync

Tokens are CSS vars in `app/globals.css` (re-exposed via Tailwind `@theme inline`; light theme only). The `com.pmos.pmweb-design-sync` LaunchAgent reconciles them bidirectionally with Claude Design — **its source of truth is the worktree `~/pmOS/.claude/worktrees/pmweb-design-source` (branch `design-source` tracking origin/main), not this checkout**. Token edits on main drive the forward sync; Claude Design edits come back as `design/reverse-sync-<date>` branches for review. It syncs tokens, it does not deploy code.

## Gotchas

- `next.config.ts` has permanent 308 redirects: `/portfolio`, `/products*` and `/pmos*` → `/about` (portfolio page retired in the 2026-10-10 AI news reset; pmOS is internal-only since 2026-05-15). Don't recreate those routes.
- **`pm-analytics-sync/` is a nested independent git repo** (CF Worker syncing RevenueCat + ASC metrics into pmOS Supabase every 6h) — excluded from `tsconfig.json`, not part of the Next.js build, has its own wrangler secrets. Don't stage it from this repo.
- **No personal name, home address or phone on any public page, feed or structured data** (Matt, 2026-10-10). Reviewer credit is the role in `content/reviewers.ts` ("a Persistent Momentum editor"). Elle Evate is the Head of AI Content and is always disclosed as AI — "(AI)" on every byline, never `Person` in JSON-LD, never `reviewedBy`.
- Persistent Sales was retired 2026-10-10 (Matt: "It's all Persistent Workforce now"). Don't re-add it or link sales.persistentmomentum.com.

## Key files

`app/globals.css` (tokens) · `lib/products-data.ts` (canonical product list + RG exclusion) · `lib/supabase.ts` / `lib/supabase-platform.ts` · `next.config.ts` (redirects) · `.env.example` (full env catalog) · `components/dashboard/` (14 Command Center widgets).
