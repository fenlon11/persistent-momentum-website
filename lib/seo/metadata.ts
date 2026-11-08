import type { Metadata } from 'next';
import type { Article } from '@/lib/content';
import { FEED_TYPES, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

// Per-article metadata (fenlon11/pmOS#685): canonical URL, the feed link (re-added because a page's
// own `alternates` replaces the layout's), and article OG/Twitter tags. og:image comes from the
// route's opengraph-image.tsx.
// Self-referencing canonical for any indexable page (fenlon11/pmOS#2223). Keeps the feed link,
// which a page's own `alternates` would otherwise drop.
export const pageAlternates = (path: string): Metadata['alternates'] => ({ canonical: path, types: FEED_TYPES });

// Same defaults as app/layout.tsx's openGraph.
const DEFAULT_TITLE = 'Persistent Momentum — AI news for business operators';
const OG_IMAGES = [{ url: '/logo.png', width: 780, height: 780, alt: SITE_NAME }];

// Metadata for any indexable non-article page (fenlon11/pmOS#2454): canonical + feed link, and an
// openGraph whose og:url is the page itself. A page's `openGraph` replaces the layout's whole, so
// type, siteName and images are re-supplied here.
export function pageMetadata(
  path: string,
  { title, description = SITE_DESCRIPTION }: { title?: string; description?: string } = {},
): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: pageAlternates(path),
    openGraph: { type: 'website', siteName: SITE_NAME, url: path, title: title ?? DEFAULT_TITLE, description, images: OG_IMAGES },
  };
}

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
