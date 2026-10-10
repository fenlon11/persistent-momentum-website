import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/content/PageShell';
import { formatDate } from '@/components/content/format';
import { corrections } from '@/content/corrections';
import { SITE_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Corrections — Persistent Momentum',
  description: 'How to report an error on Persistent Momentum, and the log of every correction we have made.',
  alternates: { canonical: '/corrections' },
};

const text = { color: 'var(--color-text-dark)' };
const muted = { color: 'var(--color-text-dark-muted)' };
const heading = { color: 'var(--color-text-dark)', letterSpacing: '-0.02em' };
const link = { color: 'var(--color-primary)' };

export default function CorrectionsPage() {
  return (
    <PageShell
      eyebrow="Corrections"
      title="Corrections"
      intro={<p>If we got something wrong, we want to know, and we fix it in the open.</p>}
    >
      <div className="max-w-3xl">
        <section className="mt-4">
          <h2 className="text-2xl font-bold mb-4" style={heading}>
            How to report an error
          </h2>
          <p className="text-lg leading-relaxed" style={text}>
            Email{' '}
            <a href={`mailto:${SITE_EMAIL}`} className="font-semibold underline underline-offset-2" style={link}>
              {SITE_EMAIL}
            </a>{' '}
            or use the{' '}
            <Link href="/contact" className="font-semibold underline underline-offset-2" style={link}>
              contact form
            </Link>
            . Include the article link, what is wrong and, if you have one, the source that shows it.
            We check the claim against the primary source. If it is wrong, we fix the article, change
            its updated date and add an entry below. See our{' '}
            <Link href="/editorial-policy" className="font-semibold underline underline-offset-2" style={link}>
              editorial policy
            </Link>{' '}
            for how articles are made.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4" style={heading}>
            Corrections log
          </h2>
          {corrections.length === 0 ? (
            <p className="text-lg" style={muted}>
              No corrections yet.
            </p>
          ) : (
            <ul className="space-y-6">
              {corrections.map((c) => (
                <li key={`${c.date}-${c.href}`}>
                  <p className="text-sm" style={muted}>
                    <time dateTime={c.date}>{formatDate(c.date)}</time>
                  </p>
                  <Link href={c.href} className="text-lg font-semibold underline underline-offset-2" style={link}>
                    {c.title}
                  </Link>
                  <p className="text-lg leading-relaxed" style={text}>
                    {c.summary}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageShell>
  );
}
