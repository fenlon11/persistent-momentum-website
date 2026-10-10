// XML builders for /news-sitemap.xml and /feed.xml (fenlon11/pmOS#685, playbook §2.4). Pure
// functions over the loaded articles, so feeds.test.ts can check them without a build.
import type { Article } from '../content/index.ts';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from '../site.ts';

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const NEWS_WINDOW_MS = 48 * 60 * 60 * 1000;

// Google News sitemap: news published in the last 48 h only, with the required tags.
// publication_date is the original publish date (a calendar day, read as 00:00 UTC).
export function newsSitemapXml(articles: Article[], now = new Date()) {
  const recent = articles.filter((a) => {
    if (a.type !== 'news') return false;
    const age = now.getTime() - Date.parse(`${a.publishedAt}T00:00:00Z`);
    return age >= 0 && age <= NEWS_WINDOW_MS;
  });
  const urls = recent.map(
    (a) => `  <url>
    <loc>${escapeXml(absoluteUrl(a.href))}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${a.publishedAt}</news:publication_date>
      <news:title>${escapeXml(a.title)}</news:title>
    </news:news>
  </url>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.map((u) => `${u}\n`).join('')}</urlset>
`;
}

const rfc822 = (isoDate: string) => new Date(`${isoDate}T00:00:00Z`).toUTCString();

export const FEED_LIMIT = 50;

// RSS 2.0, newest first. lastBuildDate is the newest updatedAt so the feed only changes when
// content does.
export function rssXml(articles: Article[]) {
  const items = articles.slice(0, FEED_LIMIT).map((a) => {
    const url = escapeXml(absoluteUrl(a.href));
    return [
      '    <item>',
      `      <title>${escapeXml(a.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${rfc822(a.publishedAt)}</pubDate>`,
      `      <description>${escapeXml(a.description)}</description>`,
      ...a.tags.map((t) => `      <category>${escapeXml(t)}</category>`),
      '    </item>',
    ].join('\n');
  });
  const lastBuild = articles.map((a) => a.updatedAt).sort().at(-1);
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${absoluteUrl('/feed.xml')}" rel="self" type="application/rss+xml"/>
${lastBuild ? `    <lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>\n` : ''}${items.map((i) => `${i}\n`).join('')}  </channel>
</rss>
`;
}
