import { getArticles } from '@/lib/content';
import { rssXml } from '@/lib/seo/feeds';

// RSS 2.0 feed of published news and guides (fenlon11/pmOS#685), built with the site.
export const dynamic = 'force-static';

export function GET() {
  return new Response(rssXml(getArticles()), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
