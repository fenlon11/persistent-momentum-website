// Search Console report tests (fenlon11/pmOS#2236): every run uses --fixtures or the no-credentials
// skip, and fetch is replaced with a thrower, so these never contact Google or the live site.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(HERE, 'gsc-report.mjs');
const FIX = path.join(HERE, 'fixtures');
const NO_NETWORK = 'data:text/javascript,globalThis.fetch=()=>{throw new Error("network call in test")}';

function run(args, env = {}, preload = NO_NETWORK) {
  const base = { ...process.env };
  delete base.GSC_SERVICE_ACCOUNT_FILE;
  const r = spawnSync(process.execPath, ['--import', preload, SCRIPT, ...args], { encoding: 'utf8', env: { ...base, ...env } });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

// A throwaway service-account key signed with a fresh RSA key (never a real credential).
function writeKey(dir) {
  const { privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  const keyFile = path.join(dir, 'sa.json');
  fs.writeFileSync(keyFile, JSON.stringify({ client_email: 'report@example.iam.gserviceaccount.com', private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }) }));
  return keyFile;
}

test('all-indexed property: 2/2 sitemaps, 4/4 articles, exit 0', () => {
  const r = run(['--fixtures', path.join(FIX, 'all-indexed')]);
  assert.equal(r.code, 0, r.err);
  assert.equal(r.out.split('\n')[0], 'gsc-report: sitemaps 2/2 Success · articles indexed 4/4');
  assert.equal(r.out.match(/^ {2}article /gm).length, 4, 'only /news/ and /guides/ URLs are inspected');
});

test('partial property: sitemap error, not-indexed article and canonical mismatch are listed', () => {
  const r = run(['--fixtures', path.join(FIX, 'partial')]);
  assert.equal(r.code, 0, r.err);
  assert.equal(r.out.split('\n')[0], 'gsc-report: sitemaps 1/2 Success · articles indexed 2/4');
  assert.match(r.out, /sitemap https:\/\/persistentmomentum\.com\/news-sitemap\.xml .*errors=1/);
  assert.match(r.out, /article https:\/\/persistentmomentum\.com\/news\/openai-gpt-launch coverageState="Discovered - currently not indexed" verdict=NEUTRAL lastCrawlTime=never/);
  assert.match(r.out, /article https:\/\/persistentmomentum\.com\/news\/anthropic-agents .* googleCanonical=https:\/\/persistentmomentum\.com\/news$/m);
  assert.doesNotMatch(r.out, /ai-pilot-roi-cost-control .*googleCanonical=/, 'matching canonical is not printed');
});

test('--json and --state write the same report as one JSON object', () => {
  const state = fs.mkdtempSync(path.join(os.tmpdir(), 'gsc-state-'));
  const r = run(['--fixtures', path.join(FIX, 'partial'), '--json', '--state', state]);
  assert.equal(r.code, 0, r.err);
  const printed = JSON.parse(r.out);
  assert.deepEqual(printed.summary, { sitemapsSuccess: 1, sitemapsExpected: 2, articlesIndexed: 2, articlesTotal: 4 });
  const files = fs.readdirSync(state);
  assert.equal(files.length, 1);
  assert.match(files[0], /^gsc-report-\d{4}-\d{2}-\d{2}\.json$/);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(state, files[0]), 'utf8')), printed);
});

test('no credentials: skip line, exit 0, no network call', () => {
  for (const env of [{}, { GSC_SERVICE_ACCOUNT_FILE: path.join(os.tmpdir(), 'gsc-does-not-exist.json') }]) {
    const r = run([], env);
    assert.equal(r.code, 0, r.err);
    assert.equal(r.out, 'gsc-report: skipped, no GSC credentials\n');
    assert.equal(r.err, '');
  }
});

test('stubbed 403: exit 1 names endpoint and status, never the token or key', () => {
  const keyFile = writeKey(fs.mkdtempSync(path.join(os.tmpdir(), 'gsc-key-')));
  const r = run(['--fixtures', path.join(FIX, 'forbidden')], { GSC_SERVICE_ACCOUNT_FILE: keyFile });
  assert.equal(r.code, 1);
  assert.match(r.err, /GET https:\/\/www\.googleapis\.com\/webmasters\/v3\/sites\/sc-domain%3Apersistentmomentum\.com\/sitemaps -> HTTP 403/);
  for (const s of [r.out, r.err]) {
    assert.doesNotMatch(s, /ya29\./);
    assert.doesNotMatch(s, /-----BEGIN/);
  }
});

test('a leading ~/ in GSC_SERVICE_ACCOUNT_FILE (as launchd passes it) resolves against HOME', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'gsc-home-'));
  writeKey(home);
  const r = run(['--fixtures', path.join(FIX, 'forbidden')], { HOME: home, GSC_SERVICE_ACCOUNT_FILE: '~/sa.json' });
  assert.doesNotMatch(r.out, /skipped/, 'the key was found, not skipped');
  assert.equal(r.code, 1);
  assert.match(r.err, /sitemaps -> HTTP 403/);
});

test('a stalled network call times out: exit 1 names the endpoint, never hangs', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsc-timeout-'));
  const keyFile = writeKey(dir);
  // Stub fetch: a call without an AbortSignal would hang forever; with one, it fails as the timeout
  // would fire (TimeoutError), so the test proves the signal is passed without waiting 20 s.
  const stub = path.join(dir, 'stall.mjs');
  fs.writeFileSync(stub, `globalThis.fetch = (url, init = {}) => init.signal instanceof AbortSignal
    ? Promise.reject(new DOMException('The operation was aborted due to timeout', 'TimeoutError'))
    : new Promise(() => setInterval(() => {}, 1e9));\n`);
  const r = spawnSync(process.execPath, ['--import', stub, SCRIPT], { encoding: 'utf8', timeout: 10_000, env: { ...process.env, GSC_SERVICE_ACCOUNT_FILE: keyFile } });
  assert.equal(r.signal, null, 'script hung: fetch was called without a timeout signal');
  assert.equal(r.status, 1, r.stderr);
  assert.equal(r.stderr, 'gsc-report: failed: POST https://oauth2.googleapis.com/token -> timeout after 20s\n');
  assert.doesNotMatch(r.stdout + r.stderr, /-----BEGIN|ya29\./);
});

test('the only Google endpoints in the source are token, sitemaps GET and urlInspection', () => {
  const src = fs.readFileSync(SCRIPT, 'utf8');
  const hosts = [...src.matchAll(/https:\/\/[a-z0-9.]*google(?:apis)?\.com[^'`\s]*/g)].map((m) => m[0]);
  assert.deepEqual([...new Set(hosts)].sort(), [
    'https://oauth2.googleapis.com/token',
    'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(PROPERTY)}/sitemaps',
  ]);
});
