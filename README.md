# Persistent Momentum Landing Page

A professional landing page for Persistent Momentum with an A2P-compliant contact form, email notifications, and database storage.

## Features

- ✅ Modern, responsive design with Tailwind CSS
- ✅ A2P-compliant SMS opt-in (TCPA compliant)
- ✅ Email notifications via Resend
- ✅ Contact submission storage in Supabase
- ✅ Form validation with Zod
- ✅ TypeScript for type safety

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend
- **Validation**: Zod + React Hook Form
- **Deployment**: Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration file:
   - Copy contents from `supabase/migrations/20250101000000_create_contact_submissions.sql`
   - Paste and execute in Supabase SQL Editor
3. Get your credentials from Settings → API:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 3. Set Up Resend

1. Create account at [resend.com](https://resend.com)
2. Add and verify your domain (persistentmomentum.com)
3. Create an API key
4. Get your `RESEND_API_KEY`

**Important**: Update the `from` addresses in `lib/resend.ts` to use your verified domain.

### 4. Configure Environment Variables

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
NOTIFICATION_EMAIL=your_email@persistentmomentum.com
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 6. Test the Contact Form

1. Fill out the form with test data
2. Check that:
   - Form submission succeeds
   - Confirmation email arrives to customer
   - Notification email arrives to you
   - Submission appears in Supabase database

## Deployment to Vercel

### Option 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Option 2: Using Vercel Dashboard

1. Push code to GitHub
2. Import repository at [vercel.com](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy

### Add Environment Variables to Vercel

Go to Project Settings → Environment Variables and add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NOTIFICATION_EMAIL`

### Configure Custom Domain

1. Go to Project Settings → Domains
2. Add `persistentmomentum.com`
3. Update DNS in Cloudflare:
   - Add A record pointing to Vercel's IP
   - Or add CNAME record pointing to your Vercel URL

## A2P Compliance Features

The contact form includes TCPA-compliant SMS opt-in:

- ✅ Explicit checkbox (unchecked by default)
- ✅ Clear disclosure language
- ✅ Links to Privacy Policy and Terms
- ✅ Timestamp and IP tracking
- ✅ Database storage of consent records

### SMS Opt-in Language

> "I consent to receive text messages from Persistent Momentum at the phone number provided. Message frequency varies. Reply STOP to opt-out at any time. Message and data rates may apply."

## Project Structure

```
├── app/
│   ├── api/contact/         # Contact form API endpoint
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ContactForm.tsx      # A2P compliant contact form
│   ├── Footer.tsx           # Footer component
│   ├── Hero.tsx             # Hero section
│   └── Services.tsx         # Services section
├── lib/
│   ├── resend.ts            # Email templates and sending
│   └── supabase.ts          # Supabase client configuration
├── supabase/
│   └── migrations/          # Database schema
└── .env.example             # Environment variables template
```

## Email Templates

Two email templates are sent on form submission:

1. **Customer Confirmation** - Sent to the person who filled out the form
2. **Internal Notification** - Sent to your team with full submission details

Templates are HTML-formatted and include all submission details.

## Database Schema

The `contact_submissions` table stores:

- Contact information (name, email, phone, company)
- Service interest
- Message
- SMS consent flag and timestamp
- IP address (for consent tracking)
- Opt-out tracking fields
- Created timestamp

## Future Enhancements

- [ ] Add SMS notifications via Twilio (requires A2P registration)
- [ ] Admin dashboard to view submissions
- [ ] Automated follow-up emails
- [ ] Integration with CRM

## Google Search Console report

`scripts/seo/gsc-report.mjs` reads the `sc-domain:persistentmomentum.com` property read-only: the submitted sitemaps (`sitemap.xml`, `news-sitemap.xml`) and a URL Inspection of every `/news/` and `/guides/` URL in the live sitemap. It never submits a sitemap, requests indexing or changes anything in Search Console. The weekly news run (`scripts/news/run.sh`) calls it right after the IndexNow ping and writes `gsc-report-YYYY-MM-DD.json` to `$PM_NEWS_STATE`; a failure is a warning, never a stop.

```bash
GSC_SERVICE_ACCOUNT_FILE=~/.pmos/gsc-service-account.json node scripts/seo/gsc-report.mjs [--json] [--state <dir>]
# gsc-report: sitemaps <n>/2 Success · articles indexed <i>/<total>, then one line per sitemap and article
```

Without `GSC_SERVICE_ACCOUNT_FILE` (or with the file missing) it prints `gsc-report: skipped, no GSC credentials` and exits 0. Exit 1 means a token or API call failed or timed out (20 s per call); the message names the endpoint and the HTTP status or timeout.

One-time setup (an operator browser task, free, no billing account needed):

1. In Google Cloud, create a project and a service account; enable the **Google Search Console API**.
2. Create a JSON key for the service account and save it on the mini as `~/.pmos/gsc-service-account.json`, then `chmod 600` it.
3. In Search Console, open the `persistentmomentum.com` domain property → Settings → Users and permissions, and add the service account's email as a **Restricted** user.
4. Set `GSC_SERVICE_ACCOUNT_FILE` to the **absolute** path (`/Users/macminipro/.pmos/gsc-service-account.json`) in the `EnvironmentVariables` of `com.pmos.pm-news-drafts` (`~/Library/LaunchAgents/com.pmos.pm-news-drafts.plist`) and reload the agent. launchd does not expand `~`; the script expands a leading `~/` itself, but the plist's other values are absolute, so keep it consistent.

## Support

For issues or questions, contact the development team.

---

Built with ❤️ for Persistent Momentum
