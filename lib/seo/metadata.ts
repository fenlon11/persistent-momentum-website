import type { Metadata } from 'next';
import type { Article } from '@/lib/content';
import { FEED_TYPES, SITE_NAME } from '@/lib/site';

// Per-article metadata (fenlon11/pmOS#685): canonical URL, the feed link (re-added because a page's
// own `alternates` replaces the layout's), and article OG/Twitter tags. og:image comes from the
// route's opengraph-image.tsx.
export function articleMetadata(article: Article): Metadata {
  const title = `${article.title} — ${SITE_NAME}`;
  return {
    title,
    description: article.description,
    alternates: { canonical: article.href, types: FEED_TYPES },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      url: article.href,
      title: article.title,
      description: article.description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      tags: article.tags,
    },
    twitter: { card: 'summary_large_image', title: article.title, description: article.description },
  };
}
