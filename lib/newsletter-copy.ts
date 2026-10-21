// Newsletter constants shared by the signup form (client) and lib/newsletter.ts (server), kept
// free of zod so the form doesn't ship the validator to every page (fenlon11/pmOS#682).
export const NEWSLETTER_NAME = 'The Momentum Update';
export const HUBSPOT_PORTAL_ID = '247620603';
// "The Momentum Update" subscription type (portal 247620603, created 2026-10-11). Not a secret.
export const NEWSLETTER_SUBSCRIPTION_TYPE_ID = 3819778043;
export const CONVERSION_FORM = 'ai_news_newsletter';
// HubSpot persona stamped on every newsletter signup (portal persona_1 = "Newsletter reader",
// pmOS#1291). Consulting contacts get theirs by hand after the intro call.
export const NEWSLETTER_PERSONA = 'persona_1';

// Shown next to the button and sent verbatim as the HubSpot consent text, so what the reader
// agreed to and what HubSpot records are the same words. The form renders these constants (the
// middle part of CONSENT_TO_PROCESS_PARTS is the /privacy link); a test pins both sides to them.
export const COMMUNICATIONS_TEXT = `I agree to receive ${NEWSLETTER_NAME} by email. Unsubscribe any time.`;
export const CONSENT_TO_PROCESS_PARTS = [
  'I agree to let Persistent Momentum store and process my personal data as described in its ',
  'Privacy Policy',
  '.',
] as const;
export const CONSENT_TO_PROCESS_TEXT = CONSENT_TO_PROCESS_PARTS.join('');

export const SUCCESS_MESSAGE = "You're in. The next issue lands in your inbox.";
