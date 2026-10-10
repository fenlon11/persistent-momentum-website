import { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';
import NewsletterSignup from '@/components/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Newsletter — Persistent Momentum',
  robots: { index: false },
};

export default function NewsletterPage() {
  return (
    <PagePlaceholder
      eyebrow="Newsletter"
      title="The AI news newsletter."
      body="What the AI companies actually shipped, what it means for your business, and one thing to try."
    >
      <NewsletterSignup tone="light" />
    </PagePlaceholder>
  );
}
