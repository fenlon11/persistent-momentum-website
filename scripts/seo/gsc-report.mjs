#!/usr/bin/env node
// Read-only Google Search Console index report (fenlon11/pmOS#2236, roadmap pm/N10). Reads the
// property's submitted sitemaps and inspects every /news/ and /guides/ URL in the live sitemap.
// It never submits a sitemap, never requests indexing and changes nothing in Search Console.
//
//   node scripts/seo/gsc-report.mjs [--state <dir>] [--json] [--fixtures <dir>]
//
// Credentials: GSC_SERVICE_ACCOUNT_FILE = path to a service-account JSON key (setup: README
// "Google Search Console report"). Unset or missing file -> prints the skip line and exits 0.
// --fixtures <dir> replaces every network call with files from <dir> (tests; never contacts Google):
//   sitemap.xml, sitemaps.json, inspect.json ({ "<url>": <inspect response> }), optional token.json
//   (used only when credentials are set) and status.json ({ "sitemaps": 403 } stubs an HTTP status).
// Exit: 0 report produced or skipped; 1 an API or token call failed.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://persistentmomentum.com';
const PROPERTY = 'sc-domain:persistentmomentum.com';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SITEMAPS_URL = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(PROPERTY)}/sitemaps`;
const INSPECT_URL = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
const EXPECTED_SITEMAPS = [`${SITE}/sitemap.xml`, `${SITE}/news-sitemap.xml`];

class CallError extends Error {}

const argv = process.argv.slice(2);
const opt = (name) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : undefined);
const asJson = argv.includes('--json');
const stateDir = opt('--state');
const fixtures = opt('--fixtures');
if ((argv.includes('--state') && !stateDir) || (argv.includes('--fixtures') && !fixtures)) {
  console.error('usage: node scripts/seo/gsc-report.mjs [--state <dir>] [--json] [--fixtures <dir>]');
  process.exit(2);
}

const keyFile = process.env.GSC_SERVICE_ACCOUNT_FILE;
const hasCreds = Boolean(keyFile) && fs.existsSync(keyFile);
if (!hasCreds && !fixtures) {
  console.log('gsc-report: skipped, no GSC credentials');
  process.exit(0);
}

const redact = (s) => String(s).replace(/ya29\.[\w.-]+/g, '[token]').replace(/-----BEGIN[\s\S]*?-----END[^-]*-----/g, '[key]');

// One HTTP call. `name` is the fixture key and the label in error messages.
async function call(name, url, init = {}) {
  let status;
  let text;
  if (fixtures) {
    const stubbed = readFixture('status.json', '{}');
    status = JSON.parse(stubbed)[name] ?? 200;
    text = status === 200 ? fixtureBody(name, init) : JSON.stringify({ error: { code: status, message: 'stubbed' } });
  } else {
    const res = await fetch(url, init);
    status = res.status;
    text = await res.text();
  }
  if (status !== 200) {
    let detail = '';
    try { detail = JSON.parse(text).error?.message ?? ''; } catch { /* non-JSON error body */ }
    throw new CallError(`${init.method ?? 'GET'} ${url} -> HTTP ${status}${detail ? ` (${redact(detail).slice(0, 200)})` : ''}`);
  }
  return text;
}

function readFixture(file, fallback) {
  const p = path.join(fixtures, file);
  if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8');
  if (fallback !== undefined) return fallback;
  throw new CallError(`fixture missing: ${file}`);
}

function fixtureBody(name, init) {
  if (name === 'sitemap') return readFixture('sitemap.xml');
  if (name === 'sitemaps') return readFixture('sitemaps.json');
  if (name === 'token') return readFixture('token.json', JSON.stringify({ access_token: 'fixture' }));
  const all = JSON.parse(readFixture('inspect.json'));
  const { inspectionUrl } = JSON.parse(init.body);
  if (!(inspectionUrl in all)) throw new CallError(`fixture inspect.json has no entry for ${inspectionUrl}`);
  return JSON.stringify(all[inspectionUrl]);
}

const b64url = (buf) => Buffer.from(buf).toString('base64url');

async function accessToken() {
  if (!hasCreds) return 'fixture';
  let sa;
  try { sa = JSON.parse(fs.readFileSync(keyFile, 'utf8')); } catch { throw new CallError('GSC_SERVICE_ACCOUNT_FILE is not valid JSON'); }
  if (!sa.client_email || !sa.private_key) throw new CallError('GSC_SERVICE_ACCOUNT_FILE lacks client_email or private_key');
  const iat = Math.floor(Date.now() / 1000);
  const unsigned = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(JSON.stringify({ iss: sa.client_email, scope: SCOPE, aud: TOKEN_URL, iat, exp: iat + 3600 }))}`;
  let sig;
  try { sig = crypto.sign('RSA-SHA256', Buffer.from(unsigned), sa.private_key); } catch { throw new CallError('GSC_SERVICE_ACCOUNT_FILE private_key could not sign'); }
  const body = new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${b64url(sig)}` });
  const text = await call('token', TOKEN_URL, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: body.toString() });
  const token = JSON.parse(text).access_token;
  if (!token) throw new CallError(`POST ${TOKEN_URL} -> no access_token in response`);
  return token;
}

function articleUrls(xml) {
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  return [...new Set(locs.filter((u) => /^\/(news|guides)\//.test(new URL(u).pathname)))];
}

function summarize(sitemapList, inspections) {
  const byPath = new Map((sitemapList ?? []).map((s) => [s.path, s]));
  const sitemaps = EXPECTED_SITEMAPS.map((p) => {
    const s = byPath.get(p);
    if (!s) return { path: p, submitted: false, success: false };
    const errors = Number(s.errors ?? 0);
    const warnings = Number(s.warnings ?? 0);
    const submittedUrls = (s.contents ?? []).reduce((n, c) => n + Number(c.submitted ?? 0), 0);
    const success = !s.isPending && Boolean(s.lastDownloaded) && errors === 0;
    return { path: p, submitted: true, isPending: Boolean(s.isPending), lastDownloaded: s.lastDownloaded ?? null, errors, warnings, submittedUrls, success };
  });
  const articles = inspections.map(({ url, result }) => {
    const r = result?.inspectionResult?.indexStatusResult ?? {};
    const a = { url, coverageState: r.coverageState ?? null, verdict: r.verdict ?? null, lastCrawlTime: r.lastCrawlTime ?? null, indexed: r.verdict === 'PASS' };
    if (r.googleCanonical && r.googleCanonical !== url) a.googleCanonical = r.googleCanonical;
    return a;
  });
  return {
    property: PROPERTY,
    summary: {
      sitemapsSuccess: sitemaps.filter((s) => s.success).length,
      sitemapsExpected: EXPECTED_SITEMAPS.length,
      articlesIndexed: articles.filter((a) => a.indexed).length,
      articlesTotal: articles.length,
    },
    sitemaps,
    articles,
  };
}

function formatText(report) {
  const { summary: s } = report;
  const lines = [`gsc-report: sitemaps ${s.sitemapsSuccess}/${s.sitemapsExpected} Success · articles indexed ${s.articlesIndexed}/${s.articlesTotal}`];
  for (const m of report.sitemaps) {
    lines.push(m.submitted
      ? `  sitemap ${m.path} isPending=${m.isPending} lastDownloaded=${m.lastDownloaded ?? 'never'} errors=${m.errors} warnings=${m.warnings} submitted=${m.submittedUrls}`
      : `  sitemap ${m.path} not submitted`);
  }
  for (const a of report.articles) {
    lines.push(`  article ${a.url} coverageState="${a.coverageState ?? 'unknown'}" verdict=${a.verdict ?? 'unknown'} lastCrawlTime=${a.lastCrawlTime ?? 'never'}${a.googleCanonical ? ` googleCanonical=${a.googleCanonical}` : ''}`);
  }
  return lines.join('\n');
}

async function main() {
  const token = await accessToken();
  const auth = { authorization: `Bearer ${token}` };
  const xml = await call('sitemap', `${SITE}/sitemap.xml`);
  const urls = articleUrls(xml);
  const list = JSON.parse(await call('sitemaps', SITEMAPS_URL, { headers: auth })).sitemap;
  const inspections = [];
  for (const url of urls) {
    const text = await call('inspect', INSPECT_URL, {
      method: 'POST',
      headers: { ...auth, 'content-type': 'application/json' },
      body: JSON.stringify({ inspectionUrl: url, siteUrl: PROPERTY }),
    });
    inspections.push({ url, result: JSON.parse(text) });
  }
  const report = { generatedAt: new Date().toISOString(), ...summarize(list, inspections) };
  console.log(asJson ? JSON.stringify(report, null, 2) : formatText(report));
  if (stateDir) {
    fs.mkdirSync(stateDir, { recursive: true });
    const d = new Date();
    const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    fs.writeFileSync(path.join(stateDir, `gsc-report-${day}.json`), `${JSON.stringify(report, null, 2)}\n`);
  }
}

main().catch((err) => {
  console.error(`gsc-report: failed: ${err instanceof CallError ? err.message : redact(err?.message ?? err)}`);
  process.exit(1);
});
