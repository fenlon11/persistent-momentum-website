// Collector feed parsing (collect.py is Python; this runs it through python3 so `npm test` covers it).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const dir = fileURLToPath(new URL('.', import.meta.url));

function feedUrls(xml) {
  const code = 'import json, sys, collect; print(json.dumps([u for _, u, _, _ in collect.parse_feed(sys.stdin.read())]))';
  return JSON.parse(execFileSync('python3', ['-c', code], { cwd: dir, input: xml }).toString());
}

test('Atom entry with comment links yields the article link (NVIDIA developer feed, 2026-10-22)', () => {
  const xml = `<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Post</title>
    <link rel="alternate" type="text/html" href="https://developer.nvidia.com/blog/post/" />
    <link rel="replies" type="text/html" href="https://developer.nvidia.com/blog/post/#comments" />
    <link rel="replies" type="application/atom+xml" href="https://developer.nvidia.com/blog/post/feed/" />
    <published>2026-10-21T09:52:16Z</published></entry></feed>`;
  assert.deepEqual(feedUrls(xml), ['https://developer.nvidia.com/blog/post/']);
});

test('Atom link without rel and RSS link text still parse', () => {
  const atom = '<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>A</title><link href="https://a.example/1" /></entry></feed>';
  const rss = '<rss><channel><item><title>B</title><link>https://b.example/2</link></item></channel></rss>';
  assert.deepEqual(feedUrls(atom), ['https://a.example/1']);
  assert.deepEqual(feedUrls(rss), ['https://b.example/2']);
});

// fetch() with urllib.request.urlopen stubbed: no network. DeepMind's CDN sometimes sends gzip unasked (pmOS#2585).
const FETCH_STUB = `
import base64, json, sys, collect
req = json.load(sys.stdin)
class R:
    headers = {"Content-Encoding": req["encoding"]} if req["encoding"] else {}
    def read(self): return base64.b64decode(req["body"])
    def __enter__(self): return self
    def __exit__(self, *a): return False
collect.urllib.request.urlopen = lambda *a, **k: R()
try:
    body = collect.fetch("https://feed.example/rss.xml")
    print(json.dumps({"body": body}))
except Exception as e:
    print(json.dumps({"error": type(e).__name__}))
`;

function stubFetch(encoding, bytes) {
  const input = JSON.stringify({ encoding, body: Buffer.from(bytes).toString('base64') });
  return JSON.parse(execFileSync('python3', ['-c', FETCH_STUB], { cwd: dir, input }).toString());
}

const RSS = '<?xml version="1.0" encoding="UTF-8"?><rss><channel><item><title>Gemini</title><link>https://deepmind.google/blog/gemini/</link></item></channel></rss>';

test('gzip body with Content-Encoding: gzip decodes to the original XML and parses', () => {
  const res = stubFetch('gzip', gzipSync(RSS));
  assert.equal(res.body, RSS);
  assert.deepEqual(feedUrls(res.body), ['https://deepmind.google/blog/gemini/']);
});

test('gzip body with no Content-Encoding header (magic bytes only) decodes', () => {
  assert.equal(stubFetch(null, gzipSync(RSS)).body, RSS);
});

test('Content-Encoding header is matched case-insensitively', () => {
  assert.equal(stubFetch('GZIP', gzipSync(RSS)).body, RSS);
});

test('plain XML body with no Content-Encoding is returned unchanged', () => {
  assert.equal(stubFetch(null, Buffer.from(RSS)).body, RSS);
});

test('Content-Encoding: gzip on a body that is not gzip raises, never returns a string', () => {
  const res = stubFetch('gzip', Buffer.from(RSS));
  assert.equal(res.body, undefined);
  assert.ok(res.error, 'fetch raised');
});

test('collect.py imports only standard library modules', () => {
  const code = `import ast, json, sys
tree = ast.parse(open('collect.py').read())
mods = {a.name.split('.')[0] for n in ast.walk(tree) if isinstance(n, ast.Import) for a in n.names}
mods |= {n.module.split('.')[0] for n in ast.walk(tree) if isinstance(n, ast.ImportFrom) and n.module}
print(json.dumps(sorted(m for m in mods if m not in sys.stdlib_module_names)))`;
  assert.deepEqual(JSON.parse(execFileSync('python3', ['-c', code], { cwd: dir }).toString()), []);
});

// Top-lab tags, press outlets and the press keyword filter (fenlon11/pmOS#2661). main() runs end to end with
// fetch() stubbed and sources.json replaced by a fixture: no network, scratch output directory.
const MAIN_STUB = `
import json, sys, tempfile, collect
from pathlib import Path
req = json.load(sys.stdin)
here = Path(tempfile.mkdtemp())
(here / "sources.json").write_text(json.dumps({"sources": req["sources"]}))
collect.HERE = here
collect.fetch = lambda url: req["pages"][url]
sys.argv = ["collect.py", "--out", str(here / "out")]
collect.main()
print("@@" + (here / "out" / next(p.name for p in (here / "out").glob("items-*.json"))).read_text())
`;

function runCollect(sources, pages) {
  const out = execFileSync('python3', ['-c', MAIN_STUB], { cwd: dir, input: JSON.stringify({ sources, pages }) }).toString();
  return { log: out.split('@@')[0], items: JSON.parse(out.split('@@')[1]).items };
}

const rss = (...titles) => `<rss><channel>${titles.map((t, i) => `<item><title>${t}</title><link>https://x.example/${i}</link><pubDate>${new Date().toUTCString()}</pubDate></item>`).join('')}</channel></rss>`;

const FIXTURE = [
  { id: 'lab-feed', company: 'Anthropic', lab: 'top', tier: 1, type: 'feed', url: 'https://lab.example/rss' },
  { id: 'other-feed', company: 'NVIDIA', lab: 'other', tier: 1, type: 'feed', url: 'https://other.example/rss' },
  { id: 'verge', company: 'The Verge', lab: 'other', tier: 'press', outlet: 'The Verge', type: 'feed', url: 'https://press.example/rss' },
];
const PAGES = {
  'https://lab.example/rss': rss('Claude news'),
  'https://other.example/rss': rss('GPU news'),
  'https://press.example/rss': rss('NVIDIA ships a new chip', 'New AI rules in Europe', 'Data centers strain the grid', 'The best headphones of the year', 'Netflix raises prices', 'Ai Weiwei opens a show'),
};

test('every collected item carries lab from its source', () => {
  const { items } = runCollect(FIXTURE, PAGES);
  assert.deepEqual(Object.fromEntries(items.filter((i) => i.tier !== 'press').map((i) => [i.source, i.lab])), { 'lab-feed': 'top', 'other-feed': 'other' });
  assert.ok(items.every((i) => i.lab === 'top' || i.lab === 'other'));
});

test('press items carry outlet; tier-1 items do not', () => {
  const { items } = runCollect(FIXTURE, PAGES);
  const press = items.filter((i) => i.tier === 'press');
  assert.ok(press.length > 0);
  assert.ok(press.every((i) => i.outlet === 'The Verge' && i.lab === 'other'));
  assert.ok(items.filter((i) => i.tier !== 'press').every((i) => !('outlet' in i)));
});

test('press keeps items naming a tracked company or AI/model/chip/GPU/data center, drops the rest', () => {
  const { items, log } = runCollect(FIXTURE, PAGES);
  const kept = items.filter((i) => i.tier === 'press').map((i) => i.title);
  assert.deepEqual(kept, ['NVIDIA ships a new chip', 'New AI rules in Europe', 'Data centers strain the grid']);
  assert.match(log, /press outlets with items: 1 \(The Verge\)/);
});

test('the run names a top lab whose official feeds were empty, and a page whose pattern matched nothing', () => {
  const sources = [...FIXTURE,
    { id: 'apple-feed', company: 'Apple', lab: 'top', tier: 1, type: 'feed', url: 'https://apple.example/rss' },
    { id: 'lab-page', company: 'Anthropic', lab: 'top', tier: 1, type: 'html', url: 'https://lab.example/notes', pattern: '<h3>(?P<date>[A-Z][a-z]+ \\d{1,2}, \\d{4})</h3>' }];
  const { log } = runCollect(sources, { ...PAGES, 'https://apple.example/rss': rss(), 'https://lab.example/notes': '<p>redesigned</p>' });
  assert.match(log, /top labs with no tier-1 items this window: Apple/);
  assert.match(log, /error: pattern matched nothing\s+lab-page/);
});

const HTML_STUB = `
import json, sys, collect
from datetime import datetime, timezone
req = json.load(sys.stdin)
now = datetime(2026, 11, 13, 12, tzinfo=timezone.utc)
print(json.dumps([[t, u, d.date().isoformat() if d else None] for t, u, d, _ in collect.parse_html(req["body"], req["src"], now)]))
`;
const parseHtml = (src, body) => JSON.parse(execFileSync('python3', ['-c', HTML_STUB], { cwd: dir, input: JSON.stringify({ src, body }) }).toString());

test('html sources date items from their headings; a yearless date takes its section year', () => {
  const dated = parseHtml({ url: 'https://lab.example/notes', pattern: '<h3>(?P<date>[^<]+)</h3><p>(?P<title>.*?)</p>' },
    '<h3>November 12, 2026</h3><p>Launched <b>X</b></p><h3>Oct 2, 2026</h3><p>Y</p>');
  assert.deepEqual(dated, [['Launched X', 'https://lab.example/notes', '2026-11-12'], ['Y', 'https://lab.example/notes', '2026-10-02']]);
  const yearless = parseHtml({ url: 'https://lab.example/log', pattern: '<i>(?P<date>[A-Z][a-z]{2} \\d{1,2})</i><p>(?P<title>.*?)</p>', year_from: '<h2>[A-Z][a-z]+, (\\d{4})</h2>' },
    '<h2>November, 2026</h2><i>Nov 5</i><p>New</p><h2>November, 2025</h2><i>Nov 12</i><p>Old</p>');
  assert.deepEqual(yearless.map((r) => r[2]), ['2026-11-05', '2025-11-12']);
  const slugged = parseHtml({ url: 'https://lab.example/blog', pattern: 'href="/a/(?P<slug>[a-z-]+)"><h3>(?P<title>.*?)</h3>', url_template: 'https://lab.example/a/{0}' },
    '<a href="/a/big-launch"><h3>Big launch</h3></a>');
  assert.deepEqual(slugged, [['Big launch', 'https://lab.example/a/big-launch', null]]);
});

test('sources.json: every source has lab; the five top labs are the only "top"; press sources name an outlet', () => {
  const { sources } = JSON.parse(execFileSync('cat', ['sources.json'], { cwd: dir }).toString());
  assert.ok(sources.every((s) => s.lab === 'top' || s.lab === 'other'), 'lab on every source');
  assert.deepEqual([...new Set(sources.filter((s) => s.lab === 'top').map((s) => s.company))].sort(), ['Anthropic', 'Apple', 'Google', 'Meta', 'OpenAI']);
  assert.ok(sources.filter((s) => ['Anthropic', 'Apple', 'Google', 'Meta', 'OpenAI'].includes(s.company)).every((s) => s.lab === 'top'));
  const press = sources.filter((s) => s.tier === 'press');
  assert.ok(press.length >= 6 && press.every((s) => s.outlet));
});
