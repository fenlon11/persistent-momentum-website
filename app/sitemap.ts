import type { MetadataRoute } from 'next';
import { getArticles, getAuthors, getTags } from '@/lib/content';
import { absoluteUrl } from '@/lib/site';

// Canonical, indexable URLs only (fenlon11/pmOS#685). lastmod is set only where it is real:
// an article's updatedAt, or the newest updatedAt among the articles a page lists. Google
// ignores priority/changefreq, so neither is emitted. Noindex placeholders (/consulting,
// /newsletter, an empty index) stay out.
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticles();
  const newest = (list: typeof articles) =>
    list.length > 0 ? list.map((a) => a.updatedAt).sort().at(-1) : undefined;
  const entry = (path: string, lastModified?: string) => ({
    url: absoluteUrl(path),
    ...(lastModified ? { lastModified } : {}),
  });

  const news = articles.filter((a) => a.type === 'news');
  const guides = articles.filter((a) => a.type === 'guide');

  return [
    entry('/', newest(articles)),
    ...(news.length > 0 ? [entry('/news', newest(news))] : []),
    ...(guides.length > 0 ? [entry('/guides', newest(guides))] : []),
    ...articles.map((a) => entry(a.href, a.updatedAt)),
    ...getAuthors().map((a) => entry(a.href, newest(articles.filter((x) => x.author === a.slug)))),
    ...getTags().map((t) => entry(`/tags/${t}`, newest(articles.filter((x) => x.tags.includes(t))))),
    ...['/about', '/editorial-policy', '/corrections', '/contact', '/careers', '/privacy', '/terms'].map((p) => entry(p)),
  ];
}
