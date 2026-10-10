import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import NewsletterSignup from '@/components/NewsletterSignup';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { getAuthor, getRelated, type Article } from '@/lib/content';
import { statusLabels } from '@/lib/content/schema';
import { reviewers } from '@/content/reviewers';
import Byline from './Byline';
import MdxBody from './MdxBody';
import { ArticleCard } from './ArticleList';
import { formatDate, typeLabel } from './format';

const muted = { color: 'var(--color-text-dark-muted)' };
const heading = { color: 'var(--color-text-dark)', letterSpacing: '-0.02em' };

export default function ArticlePage({ article }: { article: Article }) {
  // The loader already verified the author file exists.
  const author = getAuthor(article.author)!;
  const reviewer = reviewers.find((r) => r.slug === article.reviewedBy);
  const related = getRelated(article);

  return (
    <main>
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd data={breadcrumbJsonLd(article)} />
      <article className="px-6 pt-12 pb-20 md:pt-20" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}>
            <Link href={article.type === 'news' ? '/news' : '/guides'}>{typeLabel[article.type]}</Link>
            {article.statusLabel && <> · {statusLabels[article.statusLabel]}</>}
            {article.status === 'draft' && <> · Draft</>}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-5 leading-[1.1]" style={heading}>
            {article.title}
          </h1>
          <div className="text-sm flex flex-wrap gap-x-4 gap-y-1 mb-8" style={muted}>
            <Byline author={author} />
            <span>
              Published <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </span>
            <span>
              Updated <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
            </span>
          </div>

          {/* Answer-first: the summary sits above the fold, before the body. */}
          <section
            aria-labelledby="short-version"
            className="p-6 mb-10"
            style={{
              background: 'var(--color-bg-light-secondary)',
              borderLeft: '4px solid var(--color-primary)',
              borderRadius: 'var(--radius)',
            }}
          >
            <h2 id="short-version" className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}>
              The short version
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-dark)' }}>
              {article.description}
            </p>
          </section>

          {article.heroImage && (
            <Image src={article.heroImage} alt="" width={1200} height={630} className="w-full h-auto mb-10" style={{ borderRadius: 'var(--radius-lg)' }} />
          )}

          <MdxBody source={article.body} />

          {/* FAQ renders as visible Q&A only, never FAQPage JSON-LD (playbook §5 P0 #11). */}
          {article.faq && article.faq.length > 0 && (
            <section aria-labelledby="faq" className="mt-12">
              <h2 id="faq" className="text-2xl font-bold mb-5" style={heading}>
                Questions
              </h2>
              <dl className="space-y-5">
                {article.faq.map((f) => (
                  <div key={f.q}>
                    <dt className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-dark)' }}>{f.q}</dt>
                    <dd className="text-lg leading-relaxed" style={muted}>{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section aria-labelledby="sources" className="mt-12 pt-8" style={{ borderTop: '1px solid var(--color-border)' }}>
            <h2 id="sources" className="text-2xl font-bold mb-5" style={heading}>
              Sources
            </h2>
            <ol className="list-decimal pl-6 space-y-3">
              {article.sources.map((s) => (
                <li key={s.url} className="text-base" style={{ color: 'var(--color-text-dark)' }}>
                  <a href={s.url} className="font-semibold underline underline-offset-2" style={{ color: 'var(--color-primary)' }}>
                    {s.title}
                  </a>
                  <span style={muted}> · {s.publisher}</span>
                  <span className="block text-sm [overflow-wrap:anywhere]" style={muted}>
                    {s.url}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* "How this was made" on every article (playbook §5 P0 #6). */}
          <p className="mt-8 text-sm" style={muted}>
            {author.kind === 'ai' ? (
              <>Drafted by {author.name}, our {author.title ?? 'AI editor'} (an AI system).</>
            ) : (
              <>Researched and drafted with AI assistance.</>
            )}{' '}
            Reviewed and approved by {reviewer?.name ?? 'a Persistent Momentum editor'}. How we work:{' '}
            <Link href="/editorial-policy" className="underline underline-offset-2" style={{ color: 'var(--color-primary)' }}>
              /editorial-policy
            </Link>
            . Spot an error?{' '}
            <Link href="/corrections" className="underline underline-offset-2" style={{ color: 'var(--color-primary)' }}>
              /corrections
            </Link>
            .
          </p>

          {article.tags.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tags">
              {article.tags.map((t) => (
                <li key={t}>
                  <Link
                    href={`/tags/${t}`}
                    className="inline-block text-sm px-3 py-1"
                    style={{ color: 'var(--color-primary)', border: '1px solid var(--color-border)', borderRadius: '999px' }}
                  >
                    #{t}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>

      {/* Newsletter slot: the disabled placeholder until fenlon11/pmOS#682 wires it up. */}
      <section className="px-6 py-14" style={{ background: 'var(--color-bg-light-secondary)', borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-2" style={heading}>
            Get the weekly AI news
          </h2>
          <p className="text-base mb-5" style={muted}>
            What shipped, what it means for your business, and one thing to try.
          </p>
          <NewsletterSignup tone="light" />
        </div>
      </section>

      {related.length > 0 && (
        <section className="px-6 py-14" style={{ background: 'var(--color-bg)' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6" style={heading}>
              Related
            </h2>
            <ul className="grid gap-5 md:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.href} article={a} />
              ))}
            </ul>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
