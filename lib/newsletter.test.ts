// Newsletter route logic (fenlon11/pmOS#682). Run with `npm test`. fetch and the Supabase save are
// stubbed; nothing here touches HubSpot or a database.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  COMMUNICATIONS_TEXT,
  CONSENT_TO_PROCESS_PARTS,
  CONVERSION_FORM,
  buildHubSpotPayload,
  NEWSLETTER_PERSONA,
  NEWSLETTER_SUBSCRIPTION_TYPE_ID,
  createRateLimiter,
  handleSignup,
  type SignupDeps,
  type SignupRow,
} from './newsletter.ts';

const GUID = '00000000-0000-0000-0000-000000000000';

type Payload = ReturnType<typeof buildHubSpotPayload>;

function harness(response: () => Response | Promise<Response>) {
  const calls: { url: string; body: Payload }[] = [];
  const saved: SignupRow[] = [];
  const deps: SignupDeps = {
    formGuid: GUID,
    fetch: (async (url: string, init: RequestInit) => {
      calls.push({ url, body: JSON.parse(String(init.body)) });
      return response();
    }) as typeof fetch,
    save: async (row) => {
      saved.push(row);
    },
    log: () => {},
  };
  return { calls, saved, deps };
}

const valid = { email: 'reader@test.example', firstname: 'Ada', pageUri: 'https://persistentmomentum.com/', pageName: 'Home' };

test('valid email: 200, one HubSpot submission with the stamp, persona, consent and context', async () => {
  const h = harness(() => new Response('{"inlineMessage":"Thanks"}', { status: 200 }));
  const res = await handleSignup(valid, 'abc123', h.deps);

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].url, `https://api.hsforms.com/submissions/v3/integration/submit/247620603/${GUID}`);

  const p = h.calls[0].body;
  assert.deepEqual(
    p.fields.map((f) => [f.objectTypeId, f.name, f.value]),
    [
      ['0-1', 'email', 'reader@test.example'],
      ['0-1', 'firstname', 'Ada'],
      ['0-1', 'pm_conversion_form', CONVERSION_FORM],
      ['0-1', 'hs_persona', NEWSLETTER_PERSONA],
    ],
  );
  assert.equal(NEWSLETTER_PERSONA, 'persona_1');
  assert.deepEqual(p.context, { hutk: 'abc123', pageUri: valid.pageUri, pageName: 'Home' });
  assert.equal(p.legalConsentOptions.consent.consentToProcess, true);
  assert.equal(p.legalConsentOptions.consent.communications[0].subscriptionTypeId, NEWSLETTER_SUBSCRIPTION_TYPE_ID);
  assert.equal(p.legalConsentOptions.consent.communications[0].value, true);

  assert.equal(h.saved.length, 1);
  assert.equal(h.saved[0].hubspot_status, 200);
});

test('no hutk cookie and no first name: neither is sent', async () => {
  const h = harness(() => new Response('{}', { status: 200 }));
  await handleSignup({ email: 'reader@test.example' }, undefined, h.deps);
  const p = h.calls[0].body;
  assert.equal(p.context.hutk, undefined);
  assert.ok(!p.fields.some((f) => f.name === 'firstname'));
});

test('invalid email: 400 with a field error, no HubSpot call, nothing saved', async () => {
  const h = harness(() => new Response('{}', { status: 200 }));
  const res = await handleSignup({ email: 'not-an-email' }, undefined, h.deps);
  assert.equal(res.status, 400);
  assert.equal((res.body.fields as Record<string, string>).email, 'Please enter a valid email address');
  assert.equal(h.calls.length, 0);
  assert.equal(h.saved.length, 0);
});

test('honeypot filled: 200, no HubSpot call, nothing saved', async () => {
  const h = harness(() => new Response('{}', { status: 200 }));
  const res = await handleSignup({ ...valid, website: 'http://spam.example' }, undefined, h.deps);
  assert.equal(res.status, 200);
  assert.equal(h.calls.length, 0);
  assert.equal(h.saved.length, 0);
});

test('HubSpot 4xx: clear error, address still saved with the failure', async () => {
  const h = harness(() => new Response('{"errors":[{"errorType":"REQUIRED_FIELD","message":"x"}]}', { status: 400 }));
  const res = await handleSignup(valid, undefined, h.deps);
  assert.equal(res.status, 502);
  assert.match(String(res.body.error), /try again/);
  assert.equal(h.saved.length, 1);
  assert.equal(h.saved[0].hubspot_status, 400);
  assert.match(String(h.saved[0].hubspot_error), /REQUIRED_FIELD/);
});

test('HubSpot INVALID_EMAIL: 400 field error', async () => {
  const h = harness(() => new Response('{"errors":[{"errorType":"INVALID_EMAIL","message":"x"}]}', { status: 400 }));
  const res = await handleSignup(valid, undefined, h.deps);
  assert.equal(res.status, 400);
  assert.ok((res.body.fields as Record<string, string>).email);
});

test('HubSpot 5xx and network failure: 502, address saved', async () => {
  for (const response of [
    () => new Response('oops', { status: 503 }),
    () => Promise.reject(new Error('ECONNRESET')),
  ]) {
    const h = harness(response);
    const res = await handleSignup(valid, undefined, h.deps);
    assert.equal(res.status, 502);
    assert.equal(h.saved.length, 1);
    assert.ok(h.saved[0].hubspot_error);
  }
});

test('missing form GUID: 503, address saved, no HubSpot call', async () => {
  const h = harness(() => new Response('{}', { status: 200 }));
  const res = await handleSignup(valid, undefined, { ...h.deps, formGuid: undefined });
  assert.equal(res.status, 503);
  assert.equal(h.calls.length, 0);
  assert.equal(h.saved.length, 1);
});

test('Supabase down: HubSpot success still returns 200; both down returns 500', async () => {
  const ok = harness(() => new Response('{}', { status: 200 }));
  const down = async () => {
    throw new Error('db down');
  };
  assert.equal((await handleSignup(valid, undefined, { ...ok.deps, save: down })).status, 200);

  const bad = harness(() => new Response('oops', { status: 500 }));
  assert.equal((await handleSignup(valid, undefined, { ...bad.deps, save: down })).status, 500);
});

test('rate limiter: allows the limit per window, then blocks, then recovers', () => {
  const allow = createRateLimiter(2, 1000);
  assert.equal(allow('1.2.3.4', 0), true);
  assert.equal(allow('1.2.3.4', 10), true);
  assert.equal(allow('1.2.3.4', 20), false);
  assert.equal(allow('5.6.7.8', 20), true);
  assert.equal(allow('1.2.3.4', 1500), true);
});

test('consent: HubSpot records exactly the words the form shows', () => {
  const consent = buildHubSpotPayload({ email: 'reader@test.example', firstname: '' }, undefined).legalConsentOptions.consent;
  assert.equal(consent.text, CONSENT_TO_PROCESS_PARTS.join(''));
  assert.equal(consent.communications[0].text, COMMUNICATIONS_TEXT);
  // The form must render those same constants, not its own copy of the wording.
  const form = readFileSync(new URL('../components/NewsletterSignup.tsx', import.meta.url), 'utf8');
  assert.match(form, /\{COMMUNICATIONS_TEXT\}/);
  for (const i of [0, 1, 2]) assert.match(form, new RegExp(`\\{CONSENT_TO_PROCESS_PARTS\\[${i}\\]\\}`));
  assert.doesNotMatch(form, /\bagree\b/i);
});
