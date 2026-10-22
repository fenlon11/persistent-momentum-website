// Collector feed parsing (collect.py is Python; this runs it through python3 so `npm test` covers it).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

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
