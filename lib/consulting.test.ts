// Consulting inquiry logic + the /consulting no-pricing rule (fenlon11/pmOS#683). Run with
// `npm test`, after `npm run build` (the rendered-text check reads the prerendered page). fetch, the
// Supabase save and the email are stubbed; nothing here touches HubSpot, a database or Resend.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { inspect } from 'node:util';
import {
  CONVERSION_FORM,
  buildHubSpotPayload,
  handleInquiry,
  withTimeout,
  type Inquiry,
  type InquiryDeps,
  type InquiryRow,
} from './consulting.ts';

const GUID = '00000000-0000-0000-0000-000000000000';

type Payload = ReturnType<typeof buildHubSpotPayload>;

function harness(
  opts: { hubspot?: () => Response; save?: () => void; notify?: () => void; allow?: () => boolean } = {},
) {
  const calls: { url: string; body: Payload }[] = [];
  const saved: InquiryRow[] = [];
  const notified: Inquiry[] = [];
  const logged: unknown[][] = [];
  const limiter = { calls: 0 };
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
    allow: () => {
      limiter.calls++;
      return opts.allow?.() ?? true;
    },
    log: (...args) => logged.push(args),
  };
  return { calls, saved, notified, logged, limiter, deps };
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

test('HubSpot 400 echoing the email: the logged error carries status and codes, never the email', async () => {
  const body = JSON.stringify({
    status: 'error',
    message: 'The request is not valid',
    errors: [{ message: `Email address ${valid.email} is invalid`, errorType: 'INVALID_EMAIL' }],
  });
  const h = harness({ hubspot: () => new Response(body, { status: 400 }) });
  const res = await handleInquiry(valid, undefined, h.deps);
  assert.equal(res.status, 200);
  const logged = inspect(h.logged, { depth: 10 });
  assert.match(logged, /HubSpot 400/);
  assert.match(logged, /INVALID_EMAIL/);
  assert.ok(!logged.includes(valid.email), `email leaked into log: ${logged}`);
});

test('HubSpot fetch that never resolves is abandoned at the timeout; the inquiry is still saved', async () => {
  const h = harness();
  // Like the real fetch: hangs until its signal aborts.
  h.deps.fetch = ((_url: string, init: RequestInit) =>
    new Promise((_, reject) => init.signal?.addEventListener('abort', () => reject(init.signal?.reason)))) as typeof fetch;
  h.deps.timeoutMs = 50;
  const started = Date.now();
  const res = await handleInquiry(valid, undefined, h.deps);
  assert.ok(Date.now() - started < 2000);
  assert.equal(res.status, 200);
  assert.equal(h.saved.length, 1);
  assert.ok(h.logged.some((l) => String(l[0]).includes('HubSpot')));
});

test('withTimeout rejects a call that never settles, and passes through one that does', async () => {
  await assert.rejects(withTimeout(new Promise(() => {}), 20, 'Resend'), /Resend timed out after 20ms/);
  assert.equal(await withTimeout(Promise.resolve('ok'), 20, 'Resend'), 'ok');
});

test('pageUri accepts http(s) only', async () => {
  for (const pageUri of ['javascript:alert(1)', 'data:text/html,hi']) {
    const h = harness();
    const res = await handleInquiry({ ...valid, pageUri }, undefined, h.deps);
    assert.equal(res.status, 400, pageUri);
    assert.ok((res.body.fields as Record<string, string>).pageUri, pageUri);
    assert.equal(h.saved.length + h.calls.length, 0);
  }
  for (const pageUri of ['https://persistentmomentum.com/consulting', 'http://localhost:3000/consulting']) {
    const res = await handleInquiry({ ...valid, pageUri }, undefined, harness().deps);
    assert.equal(res.status, 200, pageUri);
  }
});

test('rate limit: validation failures and honeypot hits never consume a slot', async () => {
  const h = harness();
  await handleInquiry({ ...valid, email: 'nope' }, undefined, h.deps);
  await handleInquiry({ ...valid, website: 'http://spam.example' }, undefined, h.deps);
  assert.equal(h.limiter.calls, 0);
  await handleInquiry(valid, undefined, h.deps);
  assert.equal(h.limiter.calls, 1);
});

test('rate limit exceeded: 429 with no side effects', async () => {
  const h = harness({ allow: () => false });
  const res = await handleInquiry(valid, undefined, h.deps);
  assert.equal(res.status, 429);
  assert.deepEqual(res.body, { error: 'Too many attempts. Please try again in a few minutes.' });
  assert.equal(h.saved.length + h.calls.length + h.notified.length, 0);
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
