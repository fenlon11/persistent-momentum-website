import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/content/PageShell';
import { defaultReviewer } from '@/content/reviewers';
import { SITE_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Editorial policy — Persistent Momentum',
  description:
    'How Persistent Momentum sources, drafts, reviews and corrects its AI news, and which steps are automated and which are done by a person.',
  alternates: { canonical: '/editorial-policy' },
};

const text = { color: 'var(--color-text-dark)' };
const muted = { color: 'var(--color-text-dark-muted)' };
const heading = { color: 'var(--color-text-dark)', letterSpacing: '-0.02em' };
const link = { color: 'var(--color-primary)' };

const sourcing = [
  'Every article links to at least one primary source: the company announcement, the docs, the changelog, the paper or the filing. If we cannot find a primary source, the item does not run.',
  'Each news item says whether a release is announced, rolling out or available now, so you know whether you can use it today.',
  'No rumors, leaks or unnamed sources. A company claim is labelled as the company’s claim, and our analysis is labelled as analysis.',
  'We summarise in our own words and quote sparingly, with attribution and a link. We never republish a press release.',
];

const automated = [
  'Watching AI company announcements, docs and changelogs for new releases.',
  'Drafting the article, the summary and the metadata from the primary sources.',
  'Building the site, the RSS feed and the sitemaps, and notifying search engines when a page changes.',
];

const human = [
  'Deciding whether an item runs at all.',
  'Checking every fact, link, date, quote and headline, including the structured data, against the source.',
  'Approving the article before it is published. Nothing publishes without that approval.',
  'Handling corrections.',
];

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed" style={text}>
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4" style={heading}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function EditorialPolicyPage() {
  return (
    <PageShell
      eyebrow="Editorial policy"
      title="How we make Persistent Momentum"
      intro={
        <p>
          Every article on this site is drafted with AI and reviewed by a human editor before it is
          published. This page says who does what.
        </p>
      }
    >
      <div className="max-w-3xl">
        <Section title="Who drafts">
          <p className="text-lg leading-relaxed mb-4" style={text}>
            <Link href="/authors/elle-evate" className="font-semibold underline underline-offset-2" style={link}>
              Elle Evate
            </Link>{' '}
            is Persistent Momentum&apos;s Head of AI Content. Elle is an AI system, not a person. Elle
            researches and drafts articles from primary sources. Every byline Elle drafts reads
            &ldquo;Elle Evate · Head of AI Content (AI)&rdquo;.
          </p>
        </Section>

        <Section title="Who reviews">
          <p className="text-lg leading-relaxed" style={text}>
            Every article is reviewed by a human editor at Persistent Momentum, who checks it against
            its sources and approves it before it is published. Each article ends with a line saying
            how it was made: drafted by Elle Evate, reviewed and approved by {defaultReviewer.name}.
          </p>
        </Section>

        <Section title="Sourcing rules">
          <List items={sourcing} />
        </Section>

        <Section title="What is automated">
          <List items={automated} />
        </Section>

        <Section title="What a person does">
          <List items={human} />
        </Section>

        <Section title="Dates and updates">
          <p className="text-lg leading-relaxed" style={text}>
            Each article shows the date it was published and the date it was last updated. The
            updated date changes only when the content changes in substance, not for typo fixes.
          </p>
        </Section>

        <Section title="Corrections">
          <p className="text-lg leading-relaxed" style={text}>
            When we get something wrong, we fix the article, change its updated date and add an
            entry to the{' '}
            <Link href="/corrections" className="font-semibold underline underline-offset-2" style={link}>
              corrections log
            </Link>
            . To report an error, email{' '}
            <a href={`mailto:${SITE_EMAIL}`} className="font-semibold underline underline-offset-2" style={link}>
              {SITE_EMAIL}
            </a>
            .
          </p>
        </Section>

        <Section title="Independence">
          <p className="text-lg leading-relaxed" style={muted}>
            We do not run sponsored content or paid placements. Persistent Momentum also sells
            business and AI systems{' '}
            <Link href="/consulting" className="font-semibold underline underline-offset-2" style={link}>
              consulting
            </Link>
            ; that is our own service, it is labelled as ours, and it never decides what we cover.
          </p>
        </Section>
      </div>
    </PageShell>
  );
}
