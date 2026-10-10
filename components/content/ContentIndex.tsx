import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getArticles, pageCount, paginate, type ContentType } from '@/lib/content';
import ArticleList from './ArticleList';
import PageShell from './PageShell';

const copy = {
  news: {
    basePath: '/news',
    eyebrow: 'News',
    title: 'AI news',
    intro: 'What the AI companies shipped, what it means for your business, and one thing to try. Every story links to its primary source.',
    empty: 'The first stories publish soon. Subscribe to the newsletter to get them when they do.',
    metaTitle: 'AI News — Persistent Momentum',
  },
  guide: {
    basePath: '/guides',
    eyebrow: 'Guides',
    title: 'Guides',
    intro: 'Plain explainers on putting AI to work in a business.',
    empty: 'The first guides publish soon. Subscribe to the newsletter to get them when they do.',
    metaTitle: 'Guides — Persistent Momentum',
  },
} as const;

// Pages 2..n of an index; page 1 is the index route itself.
export function indexPageParams(type: ContentType) {
  const total = pageCount(getArticles(type).length);
  return Array.from({ length: total - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export function indexMetadata(type: ContentType, page = 1): Metadata {
  const empty = getArticles(type).length === 0;
  return {
    title: page > 1 ? `${copy[type].metaTitle} — page ${page}` : copy[type].metaTitle,
    description: copy[type].intro,
    // Keep search off the empty state (same rule as PagePlaceholder).
    ...(empty ? { robots: { index: false } } : {}),
  };
}

export default function ContentIndex({ type, page = 1 }: { type: ContentType; page?: number }) {
  const articles = getArticles(type);
  const totalPages = pageCount(articles.length);
  if (!Number.isInteger(page) || page < 1 || page > totalPages) notFound();
  const c = copy[type];

  return (
    <PageShell eyebrow={c.eyebrow} title={c.title} intro={<p>{c.intro}</p>}>
      <ArticleList articles={paginate(articles, page)} page={page} totalPages={totalPages} basePath={c.basePath} empty={c.empty} />
    </PageShell>
  );
}
