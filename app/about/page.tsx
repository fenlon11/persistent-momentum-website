import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About — Persistent Momentum',
  description:
    'Who writes Persistent Momentum, how every item is sourced and reviewed, and how to reach us.',
};

const standards = [
  {
    title: 'Every item links to a primary source',
    detail:
      'The company announcement, the docs, the changelog, the paper or the filing. If we cannot find a primary source, we do not run the item.',
  },
  {
    title: 'Announced vs available',
    detail:
      'Each item says whether a release is announced, in preview, or generally available, so you know whether you can use it today.',
  },
  {
    title: 'No rumors',
    detail:
      'No leaks, no unnamed sources, no speculation dressed up as news. Analysis is labelled as analysis.',
  },
  {
    title: 'AI-assisted drafting, human review',
    detail:
      'AI helps us research and draft. A person checks every fact, link and date against the source and approves each item before it publishes.',
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="px-6 pt-16 pb-12 md:pt-24 md:pb-16" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
          >
            About
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-5 leading-[1.1]"
            style={{ color: 'var(--color-text-dark)', letterSpacing: '-0.02em' }}
          >
            AI news for people who run a business.
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-dark-muted)' }}>
            Persistent Momentum covers what the AI companies actually ship,
            what it means for your business, and one thing to try. The site is
            published by Persistent Momentum, LLC. Matt Fenlon, who runs
            Persistent Momentum, reviews and approves every article before it
            publishes.
          </p>
        </div>
      </section>

      <section
        className="px-6 py-16"
        style={{
          background: 'var(--color-bg-light-secondary)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-8"
            style={{ color: 'var(--color-text-dark)', letterSpacing: '-0.02em' }}
          >
            Our editorial and sourcing standard
          </h2>
          <ul className="space-y-6">
            {standards.map((s) => (
              <li key={s.title}>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-dark)' }}>
                  {s.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-dark-muted)' }}>
                  {s.detail}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-base" style={{ color: 'var(--color-text-dark-muted)' }}>
            The full rules are in our{' '}
            <Link
              href="/editorial-policy"
              className="font-semibold underline-offset-4 hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              editorial policy
            </Link>
            . Found an error? See{' '}
            <Link
              href="/corrections"
              className="font-semibold underline-offset-4 hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              corrections
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="px-6 py-16" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ color: 'var(--color-text-dark)', letterSpacing: '-0.02em' }}
          >
            Contact
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-dark-muted)' }}>
            Tips, corrections and press:{' '}
            <a
              href="mailto:info@persistentmomentum.com"
              className="font-semibold underline-offset-4 hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              info@persistentmomentum.com
            </a>
            . We also do business and AI systems consulting;{' '}
            <Link
              href="/consulting"
              className="font-semibold underline-offset-4 hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              start here
            </Link>
            .
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
