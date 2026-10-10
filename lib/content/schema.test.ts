// Frontmatter schema tests (fenlon11/pmOS#681). Run with `npm test` (node:test, native type stripping).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import matter from 'gray-matter';
import { frontmatterSchema, isVisible } from './schema.ts';

const fixture = (name: string) =>
  matter(fs.readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8')).data;

const issuePaths = (data: unknown) => {
  const r = frontmatterSchema.safeParse(data);
  return r.success ? [] : r.error.issues.map((i) => i.path.join('.'));
};

test('valid fixture passes and normalises YAML dates', () => {
  const fm = frontmatterSchema.parse(fixture('valid.mdx'));
  assert.equal(fm.publishedAt, '2026-10-01');
  assert.equal(fm.updatedAt, '2026-10-02');
});

test('fixture with no sources fails', () => {
  assert.deepEqual(issuePaths(fixture('missing-sources.mdx')), ['sources']);
});

test('empty sources array fails', () => {
  assert.deepEqual(issuePaths({ ...fixture('valid.mdx'), sources: [] }), ['sources']);
});

test('description over 160 characters fails', () => {
  assert.deepEqual(issuePaths({ ...fixture('valid.mdx'), description: 'x'.repeat(161) }), ['description']);
  assert.deepEqual(issuePaths({ ...fixture('valid.mdx'), description: 'x'.repeat(160) }), []);
});

test('source url must be https', () => {
  const sources = [{ title: 'T', url: 'http://example.com/x', publisher: 'P' }];
  assert.deepEqual(issuePaths({ ...fixture('valid.mdx'), sources }), ['sources.0.url']);
});

test('Elle Evate (AI) can never be reviewedBy', () => {
  assert.deepEqual(issuePaths({ ...fixture('valid.mdx'), reviewedBy: 'elle-evate' }), ['reviewedBy']);
});

test('published articles need a reviewer; drafts do not', () => {
  const noReviewer = { ...fixture('valid.mdx') };
  delete noReviewer.reviewedBy;
  assert.deepEqual(issuePaths(noReviewer), ['reviewedBy']);
  assert.deepEqual(issuePaths({ ...noReviewer, status: 'draft' }), []);
});

test('statusLabel is news-only and faq is guide-only', () => {
  assert.deepEqual(issuePaths({ ...fixture('valid.mdx'), type: 'guide' }), ['statusLabel']);
  assert.deepEqual(issuePaths({ ...fixture('valid.mdx'), faq: [{ q: 'Q', a: 'A' }] }), ['faq']);
});

test('unknown frontmatter keys fail', () => {
  assert.ok(issuePaths({ ...fixture('valid.mdx'), summary: 'x' }).length > 0);
});

test('drafts are hidden in production only', () => {
  assert.equal(isVisible({ status: 'draft' }, 'production'), false);
  assert.equal(isVisible({ status: 'published' }, 'production'), true);
  assert.equal(isVisible({ status: 'draft' }, 'development'), true);
});
