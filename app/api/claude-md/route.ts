import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const GITHUB_RAW_URLS = [
  'https://raw.githubusercontent.com/fenlon11/headquarters/main/CLAUDE.md',
  'https://raw.githubusercontent.com/fenlon11/persistent-momentum/main/CLAUDE.md',
];

let cache: { content: string; fetchedAt: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('dashboard_session');
  if (!session?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL) {
    return NextResponse.json({ content: cache.content, cached: true });
  }

  for (const url of GITHUB_RAW_URLS) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'PM-Dashboard' },
        next: { revalidate: 300 },
      });
      if (res.ok) {
        const content = await res.text();
        cache = { content, fetchedAt: Date.now() };
        return NextResponse.json({ content, cached: false });
      }
    } catch {
      continue;
    }
  }

  return NextResponse.json({
    content: '# CLAUDE.md\n\nUnable to fetch from GitHub. Check repository access.',
    cached: false,
  });
}
