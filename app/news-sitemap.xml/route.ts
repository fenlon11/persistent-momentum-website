import { getArticles } from '@/lib/content';
import { newsSitemapXml } from '@/lib/seo/feeds';

// Google News sitemap (fenlon11/pmOS#685). Rendered per request so the 48-hour window moves with
// the clock, not with the last deploy; next.config.ts traces content/ into this function.
export const dynamic = 'force-dynamic';

export function GET() {
  return new Response(newsSitemapXml(getArticles('news')), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
