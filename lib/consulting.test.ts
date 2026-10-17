// Consulting inquiry logic + the /consulting no-pricing rule (fenlon11/pmOS#683). Run with
// `npm test`, after `npm run build` (the rendered-text check reads the prerendered page). fetch, the
// Supabase save and the email are stubbed; nothing here touches HubSpot, a database or Resend.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  CONVERSION_FORM,
  buildHubSpotPayload,
  handleInquiry,
  type Inquiry,
  type InquiryDeps,
  type InquiryRow,
} from './consulting.ts';

const GUID = '00000000-0000-0000-0000-000000000000';

type Payload = ReturnType<typeof buildHubSpotPayload>;

function harness(opts: { hubspot?: () => Response; save?: () => void; notify?: () => void } = {}) {
  const calls: { url: string; body: Payload }[] = [];
  const saved: InquiryRow[] = [];
  const notified: Inquiry[] = [];
  const logged: unknown[][] = [];
  const deps: InquiryDeps = {
    formGuid: GUID,
    fetch: (async (url: string, init: RequestInit) => {
      calls.push({ url, body: JSON.parse(String(init.body)) });
      return (opts.hubspot ?? (() => new Response('{"inlineMessage":""}', { status: 200 })))();
    }) as typeof fetch,
    save: async (row) => {
      opts.save?.();
      saved.push(row);
    },
    notify: async (inquiry) => {
      opts.notify?.();
      notified.push(inquiry);
    },
    log: (...args) => logged.push(args),
  };
  return { calls, saved, notified, logged, deps };
}

const valid = {
  firstname: 'Ada',
  lastname: 'Lovelace',
  email: 'ada@test.example',
  company: 'Analytical Engines',
  role: 'COO',
  companySize: '25-50',
  need: 'both',
  message: 'Our CRM and our reporting do not agree with each other.',
  pageUri: 'https://persistentmomentum.com/consulting',
  pageName: 'Consulting',
};

test('valid inquiry: 200, Supabase row, one stamped HubSpot submission, one notification', async () => {
  const h = harness();
  const res = await handleInquiry(valid, 'hutk123', h.deps);

  assert.equal(res.status, 200);
  assert.equal(res.body.message, "Thanks. We'll be in touch soon.");
  assert.deepEqual(h.saved, [
    {
      name: 'Ada Lovelace',
      email: 'ada@test.example',
      message: valid.message,
      company: 'Analytical Engines',
      role: 'COO',
      company_size: '25-50',
      need: 'both',
      source: 'consulting',
    },
  ]);
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].url, `https://api.hsforms.com/submissions/v3/integration/submit/247620603/${GUID}`);
  const p = h.calls[0].body;
  assert.deepEqual(
    p.fields.map((f) => [f.objectTypeId, f.name, f.value]),
    [
      ['0-1', 'firstname', 'Ada'],
      ['0-1', 'lastname', 'Lovelace'],
      ['0-1', 'email', 'ada@test.example'],
      ['0-1', 'company', 'Analytical Engines'],
      ['0-1', 'jobtitle', 'COO'],
      ['0-1', 'numemployees', '25-50'],
      ['0-1', 'message', `Need: Both\n\n${valid.message}`],
      ['0-1', 'pm_conversion_form', CONVERSION_FORM],
    ],
  );
  assert.equal(CONVERSION_FORM, 'consulting_inquiry');
  assert.deepEqual(p.context, { hutk: 'hutk123', pageUri: valid.pageUri, pageName: 'Consulting' });
  assert.equal(p.legalConsentOptions.consent.consentToProcess, true);
  assert.equal(h.notified.length, 1);
});

test('no role: jobtitle is not sent and the row stores null', async () => {
  const h = harness();
  const res = await handleInquiry({ ...valid, role: '' }, undefined, h.deps);
  assert.equal(res.status, 200);
  assert.equal(h.saved[0].role, null);
  assert.ok(!h.calls[0].body.fields.some((f) => f.name === 'jobtitle'));
  assert.deepEqual(h.calls[0].body.context, { pageUri: valid.pageUri, pageName: 'Consulting' });
});

test('invalid input: 400 with field errors, no side effects', async () => {
  const h = harness();
  const res = await handleInquiry(
    { ...valid, email: 'nope', message: 'too short', companySize: '10-20', need: 'pricing', firstname: '' },
    undefined,
    h.deps,
  );
  assert.equal(res.status, 400);
  const fields = res.body.fields as Record<string, string>;
  assert.deepEqual(Object.keys(fields).sort(), ['companySize', 'email', 'firstname', 'message', 'need']);
  assert.equal(h.saved.length + h.calls.length + h.notified.length, 0);
});

test('missing fields get the same message as empty ones', async () => {
  const h = harness();
  const res = await handleInquiry({}, undefined, h.deps);
  const fields = res.body.fields as Record<string, string>;
  assert.equal(fields.firstname, 'Please enter your first name');
  assert.equal(fields.email, 'Please enter a valid work email');
  assert.equal(fields.message, 'Please tell us a bit more (at least 20 characters)');
});

test('non-object body: 400', async () => {
  const h = harness();
  const res = await handleInquiry(null, undefined, h.deps);
  assert.equal(res.status, 400);
});

test('honeypot filled: 200 with no side effects', async () => {
  const h = harness();
  const res = await handleInquiry({ ...valid, website: 'http://spam.example' }, undefined, h.deps);
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(h.saved.length + h.calls.length + h.notified.length, 0);
});

test('HubSpot failure keeps the Supabase insert and still returns 200', async () => {
  const h = harness({ hubspot: () => new Response('{"status":"error"}', { status: 500 }) });
  const res = await handleInquiry(valid, undefined, h.deps);
  assert.equal(res.status, 200);
  assert.equal(h.saved.length, 1);
  assert.equal(h.notified.length, 1);
  assert.ok(h.logged.some((l) => String(l[0]).includes('HubSpot')));
});

test('missing form GUID keeps the Supabase insert and still returns 200', async () => {
  const h = harness();
  h.deps.formGuid = undefined;
  const res = await handleInquiry(valid, undefined, h.deps);
  assert.equal(res.status, 200);
  assert.equal(h.saved.length, 1);
  assert.equal(h.calls.length, 0);
});

test('notification failure still returns 200', async () => {
  const h = harness({
    notify: () => {
      throw new Error('resend down');
    },
  });
  const res = await handleInquiry(valid, undefined, h.deps);
  assert.equal(res.status, 200);
  assert.equal(h.saved.length, 1);
  assert.equal(h.calls.length, 1);
});

test('Supabase failure with HubSpot success: 200, the lead is in HubSpot', async () => {
  const h = harness({
    save: () => {
      throw new Error('db down');
    },
  });
  const res = await handleInquiry(valid, undefined, h.deps);
  assert.equal(res.status, 200);
  assert.equal(h.calls.length, 1);
});

test('Supabase and HubSpot both failing: 500', async () => {
  const h = harness({
    save: () => {
      throw new Error('db down');
    },
    hubspot: () => new Response('', { status: 503 }),
  });
  const res = await handleInquiry(valid, undefined, h.deps);
  assert.equal(res.status, 500);
});

// Rendered-text rule: no pricing anywhere on /consulting.
const html = path.resolve(import.meta.dirname, '../.next/server/app/consulting.html');

test('/consulting renders both practice areas and no pricing terms', () => {
  assert.ok(fs.existsSync(html), `no ${html}: run \`npm run build\` before \`npm test\``);
  const text = fs
    .readFileSync(html, 'utf8')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, ' ');
  assert.match(text, /Business systems/);
  assert.match(text, /AI systems/);
  for (const term of [/\$/, /\bprice/i, /\bpricing\b/i, /per hour/i, /starting at/i]) {
    assert.doesNotMatch(text, term);
  }
});
