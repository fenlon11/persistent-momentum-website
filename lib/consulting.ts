// Consulting inquiry core (fenlon11/pmOS#683). Framework-free so lib/consulting.test.ts can run it
// under `node --test`; app/api/consulting/route.ts is the thin Next wrapper and
// components/ConsultingForm.tsx reuses the schema and options.
// Every inquiry is saved to Supabase `contact_submissions` first (the backup system of record),
// then posted to HubSpot portal 247620603's form "PM – Consulting inquiry" and emailed to
// NOTIFICATION_EMAIL. HubSpot or email failing never drops the lead.
import { z } from 'zod';

export const HUBSPOT_PORTAL_ID = '247620603';
export const CONVERSION_FORM = 'consulting_inquiry';
export const SUCCESS_MESSAGE = "Thanks. We'll be in touch soon.";
export const CONSENT_TO_PROCESS_TEXT =
  'Persistent Momentum will use the information you provide to respond to your inquiry, as described in our privacy policy.';

// HubSpot's default `numemployees` stored values (read 2026-10-10). Sent exactly as HubSpot stores them.
export const COMPANY_SIZES = ['1-5', '5-25', '25-50', '50-100', '100-500', '500-1000', '1000+'] as const;

export const NEEDS = {
  business: 'Business systems',
  ai: 'AI systems',
  both: 'Both',
  unsure: 'Not sure yet',
} as const;

// A missing field gets the same message as an empty one.
const required = (message: string, max: number) => z.string({ error: message }).trim().min(1, message).max(max);

export const inquirySchema = z.object({
  firstname: required('Please enter your first name', 80),
  lastname: required('Please enter your last name', 80),
  email: z.string({ error: 'Please enter a valid work email' }).trim().email('Please enter a valid work email'),
  company: required('Please enter your company', 200),
  role: z.string().trim().max(120).optional().default(''),
  companySize: z.enum(COMPANY_SIZES, { message: 'Please choose a company size' }),
  need: z.enum(Object.keys(NEEDS) as [keyof typeof NEEDS, ...(keyof typeof NEEDS)[]], {
    message: 'Please choose what you need',
  }),
  message: z
    .string({ error: 'Please tell us a bit more (at least 20 characters)' })
    .trim()
    .min(20, 'Please tell us a bit more (at least 20 characters)')
    .max(5000),
  // Honeypot: hidden from people, filled by bots.
  website: z.string().optional().default(''),
  pageUri: z.string().url().max(2000).optional(),
  pageName: z.string().max(300).optional(),
});

export type Inquiry = z.infer<typeof inquirySchema>;

export type InquiryRow = {
  name: string;
  email: string;
  message: string;
  company: string;
  role: string | null;
  company_size: string;
  need: string;
  source: 'consulting';
};

export type InquiryDeps = {
  formGuid: string | undefined;
  fetch: typeof fetch;
  save: (row: InquiryRow) => Promise<void>;
  notify: (inquiry: Inquiry) => Promise<void>;
  log?: (...args: unknown[]) => void;
};

export type InquiryResult = { status: number; body: Record<string, unknown> };

const RETRY_MESSAGE =
  "We couldn't send your message just now. Please try again, or email info@persistentmomentum.com.";

export function buildHubSpotPayload(input: Inquiry, hutk?: string) {
  const contact = (name: string, value: string) => ({ objectTypeId: '0-1', name, value });
  const fields = [
    contact('firstname', input.firstname),
    contact('lastname', input.lastname),
    contact('email', input.email),
    contact('company', input.company),
    ...(input.role ? [contact('jobtitle', input.role)] : []),
    contact('numemployees', input.companySize),
    contact('message', `Need: ${NEEDS[input.need]}\n\n${input.message}`),
    contact('pm_conversion_form', CONVERSION_FORM),
  ];
  const context: Record<string, string> = {};
  if (hutk) context.hutk = hutk;
  if (input.pageUri) context.pageUri = input.pageUri;
  if (input.pageName) context.pageName = input.pageName;

  return {
    submittedAt: String(Date.now()),
    fields,
    context,
    legalConsentOptions: { consent: { consentToProcess: true, text: CONSENT_TO_PROCESS_TEXT } },
  };
}

export async function handleInquiry(body: unknown, hutk: string | undefined, deps: InquiryDeps): Promise<InquiryResult> {
  const log = deps.log ?? console.error;
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      fields[key] ??= issue.message;
    }
    return { status: 400, body: { error: 'Validation failed', fields } };
  }
  const input = parsed.data;

  // Bots get the same success a person gets, and nothing is sent or stored.
  if (input.website) return { status: 200, body: { success: true, message: SUCCESS_MESSAGE } };

  let saved = true;
  try {
    await deps.save({
      name: `${input.firstname} ${input.lastname}`,
      email: input.email,
      message: input.message,
      company: input.company,
      role: input.role || null,
      company_size: input.companySize,
      need: input.need,
      source: 'consulting',
    });
  } catch (err) {
    saved = false;
    log('[consulting] Supabase save failed', err);
  }

  const [hubspot, notified] = await Promise.allSettled([submitToHubSpot(deps, input, hutk), deps.notify(input)]);
  if (hubspot.status === 'rejected') log('[consulting] HubSpot submission failed', hubspot.reason);
  if (notified.status === 'rejected') log('[consulting] notification email failed', notified.reason);

  // Success as long as the lead landed somewhere we keep it.
  if (saved || hubspot.status === 'fulfilled') {
    return { status: 200, body: { success: true, message: SUCCESS_MESSAGE } };
  }
  return { status: 500, body: { error: RETRY_MESSAGE } };
}

async function submitToHubSpot(deps: InquiryDeps, input: Inquiry, hutk: string | undefined) {
  if (!deps.formGuid) throw new Error('HUBSPOT_PM_CONSULTING_FORM_GUID not set');
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${deps.formGuid}`;
  const res = await deps.fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildHubSpotPayload(input, hutk)),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HubSpot ${res.status}: ${text.slice(0, 500)}`);
  }
}
