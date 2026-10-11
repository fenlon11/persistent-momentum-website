import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';
import { createRateLimiter, handleInquiry, NEEDS, type Inquiry, type InquiryRow } from '@/lib/consulting';

// Consulting inquiry → Supabase + HubSpot form + email notification (fenlon11/pmOS#683). Logic
// lives in lib/consulting.ts so it can be unit-tested without Next.
const allow = createRateLimiter();

async function save(row: InquiryRow) {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const { error } = await supabaseAdmin.from('contact_submissions').insert([row]);
  if (error) throw new Error(error.message);
}

async function notify(inquiry: Inquiry) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL;
  if (!key || !to) throw new Error('RESEND_API_KEY or NOTIFICATION_EMAIL not set');
  const { error } = await new Resend(key).emails.send({
    from: 'Persistent Momentum <noreply@persistentmomentum.com>',
    to,
    replyTo: inquiry.email,
    subject: `Consulting inquiry: ${inquiry.firstname} ${inquiry.lastname}, ${inquiry.company}`,
    text: [
      `Name: ${inquiry.firstname} ${inquiry.lastname}`,
      `Email: ${inquiry.email}`,
      `Company: ${inquiry.company}`,
      `Role: ${inquiry.role || '-'}`,
      `Company size: ${inquiry.companySize}`,
      `Need: ${NEEDS[inquiry.need]}`,
      '',
      inquiry.message,
    ].join('\n'),
  });
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

  const result = await handleInquiry(body, request.cookies.get('hubspotutk')?.value, {
    formGuid: process.env.HUBSPOT_PM_CONSULTING_FORM_GUID,
    fetch,
    save,
    notify,
  });
  return NextResponse.json(result.body, { status: result.status });
}
