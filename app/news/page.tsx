import { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'AI News — Persistent Momentum',
  robots: { index: false },
};

export default function NewsPage() {
  return (
    <PagePlaceholder
      eyebrow="News"
      title="AI news, coming soon."
      body="What the AI companies shipped, what it means for your business, and one thing to try. The first stories publish soon."
    />
  );
}
