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
