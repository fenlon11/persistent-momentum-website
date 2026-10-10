// News sitemap + RSS builders (fenlon11/pmOS#685). Run with `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newsSitemapXml, rssXml } from './feeds.ts';

const article = (over: Record<string, unknown>) =>
  ({
    title: 'T',
    description: 'D',
    type: 'news',
    publishedAt: '2026-10-10',
    updatedAt: '2026-10-10',
    author: 'elle-evate',
    reviewedBy: 'pm-editor',
    status: 'published',
    tags: ['models'],
    sources: [],
    slug: 's',
    href: '/news/s',
    body: '',
    ...over,
  }) as Parameters<typeof rssXml>[0][number];

test('news sitemap keeps only news from the last 48 hours, with the required tags', () => {
  const now = new Date('2026-10-11T12:00:00Z');
  const xml = newsSitemapXml(
    [
      article({ title: 'Fresh', href: '/news/fresh', publishedAt: '2026-10-10' }),
      article({ title: 'Old', href: '/news/old', publishedAt: '2026-10-08' }),
      article({ title: 'Guide', href: '/guides/g', type: 'guide', publishedAt: '2026-10-11' }),
    ],
    now,
  );
  assert.match(xml, /<loc>https:\/\/persistentmomentum.com\/news\/fresh<\/loc>/);
  assert.doesNotMatch(xml, /news\/old|guides\/g/);
  for (const tag of ['news:name>Persistent Momentum<', 'news:language>en<', 'news:publication_date>2026-10-10<', 'news:title>Fresh<']) {
    assert.ok(xml.includes(tag), tag);
  }
});

test('news sitemap with nothing recent is still a valid empty urlset', () => {
  const xml = newsSitemapXml([], new Date());
  assert.match(xml, /<urlset[^>]*xmlns:news=/);
  assert.doesNotMatch(xml, /<url>/);
});

test('RSS escapes text and links each item', () => {
  const xml = rssXml([article({ title: 'A & B <C>', href: '/news/a' })]);
  assert.match(xml, /<rss version="2.0"/);
  assert.match(xml, /<title>A &amp; B &lt;C&gt;<\/title>/);
  assert.match(xml, /<guid isPermaLink="true">https:\/\/persistentmomentum.com\/news\/a<\/guid>/);
  assert.match(xml, /<pubDate>Sat, 10 Oct 2026 00:00:00 GMT<\/pubDate>/);
});
