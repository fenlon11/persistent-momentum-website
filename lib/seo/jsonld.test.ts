// JSON-LD rules (fenlon11/pmOS#685). Run with `npm test`. build-output.test.ts repeats the
// date/headline check against the rendered HTML of every prerendered article.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import matter from 'gray-matter';
import { frontmatterSchema } from '../content/schema.ts';
import { articleJsonLd, breadcrumbJsonLd, organizationJsonLd, profilePageJsonLd, serializeJsonLd } from './jsonld.ts';

const fm = frontmatterSchema.parse(
  matter(fs.readFileSync(new URL('../content/fixtures/valid.mdx', import.meta.url), 'utf8')).data,
);
const news = { ...fm, slug: 'example', href: '/news/example', body: '' };
const guide = { ...news, type: 'guide' as const, statusLabel: undefined, href: '/guides/example' };

test('NewsArticle dates and headline equal what ArticlePage shows', () => {
  const ld = articleJsonLd(news);
  assert.equal(ld['@type'], 'NewsArticle');
  // ArticlePage renders <h1>{title}</h1> and <time dateTime={publishedAt|updatedAt}>.
  assert.equal(ld.headline, news.title);
  assert.equal(ld.datePublished, news.publishedAt);
  assert.equal(ld.dateModified, news.updatedAt);
  assert.equal(ld.url, 'https://persistentmomentum.com/news/example');
  assert.deepEqual(ld.image, ['https://persistentmomentum.com/news/example/opengraph-image']);
});

test('guides are BlogPosting', () => {
  assert.equal(articleJsonLd(guide)['@type'], 'BlogPosting');
});

test('author and publisher are the Organization, even when Elle Evate (AI) drafted it', () => {
  assert.equal(news.author, 'elle-evate');
  const ld = articleJsonLd(news);
  assert.equal(ld.author['@type'], 'Organization');
  assert.equal(ld.publisher['@type'], 'Organization');
  assert.doesNotMatch(JSON.stringify(ld), /"Person"|Elle/);
});

test('breadcrumb is Home > section > article', () => {
  const items = breadcrumbJsonLd(news).itemListElement;
  assert.deepEqual(items.map((i) => i.name), ['Home', 'News', news.title]);
  assert.deepEqual(items.map((i) => i.position), [1, 2, 3]);
});

test('Organization has a logo and no street address', () => {
  const org = organizationJsonLd();
  assert.equal(org.logo.url, 'https://persistentmomentum.com/logo.png');
  assert.doesNotMatch(JSON.stringify(org), /address|telephone|Person/i);
});

test('ProfilePage only for an Organization author; never for the AI author', () => {
  const base = { slug: 's', href: '/authors/s', body: '', description: 'd' };
  assert.equal(profilePageJsonLd({ ...base, name: 'Elle Evate', kind: 'ai' }), null);
  const org = profilePageJsonLd({ ...base, name: 'Team', kind: 'organization' });
  assert.equal(org?.['@type'], 'ProfilePage');
  assert.equal(org?.mainEntity['@type'], 'Organization');
});

test('serialised JSON-LD cannot close its script tag', () => {
  const out = serializeJsonLd({ headline: '</script><script>alert(1)</script>' });
  assert.doesNotMatch(out, /<\/script>/);
  assert.equal(JSON.parse(out).headline, '</script><script>alert(1)</script>');
});
