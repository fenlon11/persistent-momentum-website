import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import NewsletterSignup from '@/components/NewsletterSignup';
import { NEWSLETTER_NAME } from '@/lib/newsletter-copy';

export const metadata: Metadata = {
  title: `${NEWSLETTER_NAME} — Persistent Momentum`,
  description:
    'The Momentum Update: what the AI companies actually shipped, what it means for your business, and one thing to try. Every item links to its primary source.',
};

const whatYouGet = [
  {
    title: 'What actually shipped',
    detail:
      'The releases from the AI companies that matter to a business, and whether each one is announced, in preview, or available today.',
  },
  {
    title: 'Primary sources only',
    detail:
      'Every item links to the announcement, the docs, the changelog or the paper. No rumors, no unnamed sources.',
  },
  {
    title: 'One thing to try',
    detail: 'A concrete thing you can do with what shipped, small enough to try the same day.',
  },
];

export default function NewsletterPage() {
  return (
    <main>
      <section className="px-6 pt-16 pb-24 md:pt-24 md:pb-32" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
          >
            AI news that matters · From Persistent Momentum
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-5 leading-[1.1]"
            style={{ color: 'var(--color-text-dark)', letterSpacing: '-0.02em' }}
          >
            {NEWSLETTER_NAME}
          </h1>
          <p className="text-lg mb-8" style={{ color: 'var(--color-text-dark-muted)' }}>
            What the AI companies actually shipped, what it means for your business, and one thing to try.
          </p>

          <NewsletterSignup tone="light" />

          <h2 className="text-2xl font-bold mt-14 mb-5" style={{ color: 'var(--color-text-dark)', letterSpacing: '-0.02em' }}>
            What you get
          </h2>
          <ul className="space-y-5">
            {whatYouGet.map((item) => (
              <li key={item.title}>
                <p className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-dark)' }}>
                  {item.title}
                </p>
                <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-dark-muted)' }}>
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-base" style={{ color: 'var(--color-text-dark-muted)' }}>
            Who writes it and how every item is checked:{' '}
            <Link href="/about" className="underline underline-offset-2" style={{ color: 'var(--color-primary)' }}>
              About Persistent Momentum
            </Link>
            .
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
