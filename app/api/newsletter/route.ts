import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createRateLimiter, handleSignup, newsletterDestination, type SignupRow } from '@/lib/newsletter';
import { liveFormGuid } from '@/lib/live-forms';

// Newsletter signup → HubSpot form and/or Persistent Workforce + Supabase backup (fenlon11/pmOS#682, fenlon11/pmOS#2706). Logic lives in
// lib/newsletter.ts so it can be unit-tested without Next.
const allow = createRateLimiter();

async function save(row: SignupRow) {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const { error } = await supabaseAdmin.from('newsletter_signups').insert([row]);
  if (error) throw new Error(error.message);
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!allow(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again in a few minutes.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Validation failed', fields: { form: 'Invalid request' } }, { status: 400 });
  }

  const result = await handleSignup(body, request.cookies.get('hubspotutk')?.value, {
    formGuid: liveFormGuid(process.env.HUBSPOT_PM_NEWSLETTER_FORM_GUID),
    pwListSlug: liveFormGuid(process.env.PM_NEWSLETTER_PW_LIST_SLUG),
    destination: newsletterDestination(process.env.PM_NEWSLETTER_DESTINATION),
    fetch,
    save,
  });
  return NextResponse.json(result.body, { status: result.status });
}
