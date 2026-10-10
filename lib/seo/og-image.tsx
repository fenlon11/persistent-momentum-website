import { ImageResponse } from 'next/og';
import type { Article } from '@/lib/content';

// Per-article social/Discover image (fenlon11/pmOS#685, playbook P1 #18): 1200×675 (16:9),
// generated at build by next/og. Title card in the site palette; never a logo-only image.
export const ogImageSize = { width: 1200, height: 675 };

export function articleOgImage(article: Article) {
  const section = article.type === 'news' ? 'News' : 'Guide';
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(160deg, #07112c 0%, #0b1c44 100%)',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, letterSpacing: 4, color: '#a8c5ff' }}>
          {section.toUpperCase()}
        </div>
        <div style={{ display: 'flex', fontSize: article.title.length > 70 ? 56 : 68, fontWeight: 700, lineHeight: 1.1 }}>
          {article.title}
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#e6eeff' }}>Persistent Momentum · persistentmomentum.com</div>
      </div>
    ),
    ogImageSize,
  );
}
