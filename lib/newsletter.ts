// Newsletter signup core (fenlon11/pmOS#682). Framework-free so lib/newsletter.test.ts can run it
// under `node --test`; app/api/newsletter/route.ts is the thin Next wrapper.
// Signups post to HubSpot portal 247620603's form "PM – The Momentum Update subscribe" through the
// unauthenticated v3 submit endpoint, and every address is also saved to Supabase
// `newsletter_signups` so a HubSpot failure never loses it.
// fenlon11/pmOS#2706: Persistent Workforce (PW) is the second destination, chosen by
// PM_NEWSLETTER_DESTINATION (`hubspot` | `both` | `pw`, default `hubspot`). Each destination fails on
// its own; the visitor sees success if either accepted.
import { z } from 'zod';
import {
  COMMUNICATIONS_TEXT,
  CONSENT_TO_PROCESS_TEXT,
  CONFIRM_MESSAGE,
  CONVERSION_FORM,
  HUBSPOT_PORTAL_ID,
  NEWSLETTER_PERSONA,
  NEWSLETTER_SUBSCRIPTION_TYPE_ID,
  SUCCESS_MESSAGE,
} from './newsletter-copy.ts';

export * from './newsletter-copy.ts';

export const signupSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  firstname: z.string().trim().max(80).optional().default(''),
  // Honeypot: hidden from people, filled by bots.
  website: z.string().optional().default(''),
  pageUri: z.string().url().max(2000).optional(),
  pageName: z.string().max(300).optional(),
});

export type SignupRow = {
  email: string;
  firstname: string | null;
  page_uri: string | null;
  hubspot_status: number | null;
  hubspot_error: string | null;
  // Present only when PW is a destination, so a deploy that lands before the pw_* columns
  // migration still saves HubSpot-only rows.
  pw_status?: number | null;
  pw_error?: string | null;
};

export type Destination = 'hubspot' | 'both' | 'pw';

export function newsletterDestination(value: string | undefined): Destination {
  return value === 'both' || value === 'pw' ? value : 'hubspot';
}

// PW's public subscribe endpoint (persistent-workforce#814). PW runs double opt-in, so the reader
// gets a confirm email from PW.
export const PW_SUBSCRIBE_URL = 'https://workforce.persistentmomentum.com/api/public/subscribe';

export type SignupDeps = {
  formGuid: string | undefined;
  // PM's list public slug in PW. undefined outside Vercel production (lib/live-forms.ts guard).
  pwListSlug?: string;
  destination?: Destination;
  fetch: typeof fetch;
  save: (row: SignupRow) => Promise<void>;
  log?: (...args: unknown[]) => void;
};

export type SignupResult = { status: number; body: Record<string, unknown> };

const RETRY_MESSAGE = "We couldn't sign you up just now. Please try again in a minute.";

export function buildHubSpotPayload(
  input: { email: string; firstname: string; pageUri?: string; pageName?: string },
  hutk?: string,
) {
  const fields = [
    { objectTypeId: '0-1', name: 'email', value: input.email },
    ...(input.firstname ? [{ objectTypeId: '0-1', name: 'firstname', value: input.firstname }] : []),
    { objectTypeId: '0-1', name: 'pm_conversion_form', value: CONVERSION_FORM },
    { objectTypeId: '0-1', name: 'hs_persona', value: NEWSLETTER_PERSONA },
  ];
  const context: Record<string, string> = {};
  if (hutk) context.hutk = hutk;
  if (input.pageUri) context.pageUri = input.pageUri;
  if (input.pageName) context.pageName = input.pageName;

  return {
    submittedAt: String(Date.now()),
    fields,
    context,
    legalConsentOptions: {
      consent: {
        consentToProcess: true,
        text: CONSENT_TO_PROCESS_TEXT,
        communications: [
          { value: true, subscriptionTypeId: NEWSLETTER_SUBSCRIPTION_TYPE_ID, text: COMMUNICATIONS_TEXT },
        ],
      },
    },
  };
}

export async function handleSignup(body: unknown, hutk: string | undefined, deps: SignupDeps): Promise<SignupResult> {
  const log = deps.log ?? console.error;
  const parsed = signupSchema.safeParse(body);
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

  const row: SignupRow = {
    email: input.email,
    firstname: input.firstname || null,
    page_uri: input.pageUri ?? null,
    hubspot_status: null,
    hubspot_error: null,
  };

  const destination = deps.destination ?? 'hubspot';
  const toHubSpot = destination !== 'pw';
  const toPw = destination !== 'hubspot';

  let hubspot: SignupResult | null = null;
  if (toHubSpot) {
    if (!deps.formGuid) {
      row.hubspot_error = 'HUBSPOT_PM_NEWSLETTER_FORM_GUID not set';
      log('[newsletter] form GUID missing; address saved to Supabase only');
      hubspot = { status: 503, body: { error: RETRY_MESSAGE } };
    } else {
      hubspot = await submitToHubSpot(deps, input, hutk, row, log);
    }
  }

  let pw: SignupResult | null = null;
  if (toPw) {
    row.pw_status = null;
    row.pw_error = null;
    if (!deps.pwListSlug) {
      row.pw_error = 'PM_NEWSLETTER_PW_LIST_SLUG not set';
      log('[newsletter] PW list slug missing; PW skipped');
      pw = { status: 503, body: { error: RETRY_MESSAGE } };
    } else {
      pw = await submitToPw(deps, deps.pwListSlug, input, row, log);
    }
  }

  // PW's confirm email is the next step whenever PW took the address.
  let result: SignupResult;
  if (pw && pw.status === 200) result = { status: 200, body: { success: true, message: CONFIRM_MESSAGE } };
  else if (hubspot && hubspot.status === 200) result = hubspot;
  else result = (hubspot ?? pw) as SignupResult;

  try {
    await deps.save(row);
  } catch (err) {
    log('[newsletter] Supabase save failed', err);
    // A destination has the address, so the signup still counts. If none has it, say so.
    if (result.status >= 500) return { status: 500, body: { error: RETRY_MESSAGE } };
  }
  return result;
}

async function submitToPw(
  deps: SignupDeps,
  slug: string,
  input: z.infer<typeof signupSchema>,
  row: SignupRow,
  log: (...args: unknown[]) => void,
): Promise<SignupResult> {
  let res: Response;
  try {
    res = await deps.fetch(PW_SUBSCRIBE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, email: input.email, name: input.firstname }),
    });
  } catch (err) {
    row.pw_error = `network: ${err instanceof Error ? err.message : String(err)}`.slice(0, 500);
    log('[newsletter] PW request failed', err);
    return { status: 502, body: { error: RETRY_MESSAGE } };
  }

  row.pw_status = res.status;
  if (res.ok) return { status: 200, body: { success: true, message: CONFIRM_MESSAGE } };

  const text = await res.text().catch(() => '');
  row.pw_error = text.slice(0, 500) || null;
  log('[newsletter] PW rejected submission', res.status);
  if (res.status === 400) {
    return { status: 400, body: { error: 'Validation failed', fields: { email: 'Please enter a valid email address' } } };
  }
  return { status: 502, body: { error: RETRY_MESSAGE } };
}

async function submitToHubSpot(
  deps: SignupDeps,
  input: z.infer<typeof signupSchema>,
  hutk: string | undefined,
  row: SignupRow,
  log: (...args: unknown[]) => void,
): Promise<SignupResult> {
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${deps.formGuid}`;
  let res: Response;
  try {
    res = await deps.fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildHubSpotPayload(input, hutk)),
    });
  } catch (err) {
    row.hubspot_error = `network: ${err instanceof Error ? err.message : String(err)}`.slice(0, 500);
    log('[newsletter] HubSpot request failed', err);
    return { status: 502, body: { error: RETRY_MESSAGE } };
  }

  row.hubspot_status = res.status;
  if (res.ok) return { status: 200, body: { success: true, message: SUCCESS_MESSAGE } };

  const text = await res.text().catch(() => '');
  row.hubspot_error = text.slice(0, 500) || null;
  // Status and error codes only: HubSpot's rejection body can echo the submitted address.
  log('[newsletter] HubSpot rejected submission', res.status, text.match(/[A-Z][A-Z_]{3,}/g)?.join(',') ?? '');

  // HubSpot's own email check is stricter than zod's; surface it as a field error.
  if (res.status === 400 && /INVALID_EMAIL|BLOCKED_EMAIL/.test(text)) {
    return { status: 400, body: { error: 'Validation failed', fields: { email: 'Please enter a valid email address' } } };
  }
  return { status: 502, body: { error: RETRY_MESSAGE } };
}

// Per-IP fixed window. In-memory, so per serverless instance: a speed bump for scripts, not a
// guarantee (HubSpot's own 50 req / 10 s limit sits behind it).
export function createRateLimiter(limit = 5, windowMs = 10 * 60 * 1000) {
  const hits = new Map<string, number[]>();
  return (key: string, now = Date.now()) => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 10_000) hits.clear();
    return true;
  };
}
