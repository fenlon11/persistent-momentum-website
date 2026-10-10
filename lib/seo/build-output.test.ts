// Checks on the `next build` output (fenlon11/pmOS#685). Run `npm run build` first; the pmOS gate
// ledger runs the build gate before the test gate.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const appOut = path.join(root, '.next/server/app');

function files(dir: string, keep: (f: string) => boolean): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return files(full, keep);
    return keep(full) ? [full] : [];
  });
}

const decode = (s: string) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");

const jsonLd = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));

test('a production build exists', () => {
  assert.ok(fs.existsSync(appOut), `no ${appOut}: run \`npm run build\` before \`npm test\``);
});

const built = fs.existsSync(appOut);
const html = built ? files(appOut, (f) => f.endsWith('.html')) : [];

test('no FAQPage or HowTo in the build output or app/', { skip: !built }, () => {
  const out = files(appOut, (f) => /\.(html|body|rsc|meta)$/.test(f));
  const src = files(path.join(root, 'app'), (f) => /\.(ts|tsx|mdx?)$/.test(f));
  const hits = [...out, ...src].filter((f) => /FAQPage|HowTo/.test(fs.readFileSync(f, 'utf8')));
  assert.deepEqual(hits.map((f) => path.relative(root, f)), []);
});

test('no Person anywhere in the JSON-LD; Organization on every page', { skip: !built }, () => {
  assert.ok(html.length > 0);
  for (const f of html) {
    const blocks = jsonLd(fs.readFileSync(f, 'utf8'));
    assert.ok(blocks.some((b) => b['@type'] === 'Organization'), `${path.relative(root, f)}: no Organization`);
    assert.doesNotMatch(JSON.stringify(blocks), /"Person"/, path.relative(root, f));
  }
});

test('every prerendered article: JSON-LD dates and headline equal the visible text', { skip: !built }, (t) => {
  const articles = html.filter((f) => /\/(news|guides)\/[^/]+\.html$/.test(f) && !/\/page\//.test(f));
  const checked = articles.filter((f) => {
    const page = fs.readFileSync(f, 'utf8');
    const ld = jsonLd(page).find((b) => b['@type'] === 'NewsArticle' || b['@type'] === 'BlogPosting');
    if (!ld) return false;
    const h1 = decode(/<h1[^>]*>(.*?)<\/h1>/s.exec(page)![1].replace(/<[^>]+>/g, ''));
    const times = [...page.matchAll(/<time dateTime="([^"]+)"/gi)].map((m) => m[1]);
    const rel = path.relative(root, f);
    assert.equal(ld.headline, h1, `${rel}: headline`);
    assert.equal(ld.datePublished, times[0], `${rel}: datePublished`);
    assert.equal(ld.dateModified, times[1], `${rel}: dateModified`);
    assert.match(page, /Reviewed and approved by /, `${rel}: "How this was made" line`);
    return true;
  });
  // No article is published yet, so a production build may have none; the unit test in
  // jsonld.test.ts still covers the mapping.
  t.diagnostic(`articles checked: ${checked.length}`);
  assert.equal(checked.length, articles.length, 'an article page has no NewsArticle/BlogPosting JSON-LD');
});

test('robots.txt names the answer-engine bots and both sitemaps', { skip: !built }, () => {
  const robots = fs.readFileSync(path.join(appOut, 'robots.txt.body'), 'utf8');
  for (const bot of ['Googlebot', 'bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'Claude-SearchBot', 'Claude-User']) {
    assert.match(robots, new RegExp(`User-Agent: ${bot}\\b`), bot);
  }
  assert.match(robots, /Sitemap: https:\/\/persistentmomentum.com\/sitemap.xml/);
  assert.match(robots, /Sitemap: https:\/\/persistentmomentum.com\/news-sitemap.xml/);
  assert.match(robots, /Disallow: \/dashboard/);
  assert.doesNotMatch(robots, /^Disallow: \/$/m, 'no site-wide Disallow (training crawlers are allowed)');
});

test('exactly one IndexNow key file, named after the key it holds', () => {
  const keyFiles = fs.readdirSync(path.join(root, 'public')).filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  assert.equal(keyFiles.length, 1);
  assert.equal(fs.readFileSync(path.join(root, 'public', keyFiles[0]), 'utf8'), keyFiles[0].replace('.txt', ''));
});
