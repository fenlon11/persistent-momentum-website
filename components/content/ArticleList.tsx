import Link from 'next/link';
import type { Article } from '@/lib/content';
import { formatDate, typeLabel } from './format';
import { statusLabels } from '@/lib/content/schema';

export function ArticleCard({ article }: { article: Article }) {
  return (
    <li
      className="p-6"
      style={{
        background: 'var(--color-bg-light-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}>
        {typeLabel[article.type]}
        {article.statusLabel && <> · {statusLabels[article.statusLabel]}</>}
        {article.status === 'draft' && <> · Draft</>}
      </p>
      <h3 className="text-xl font-bold mb-2 leading-snug" style={{ color: 'var(--color-text-dark)' }}>
        <Link href={article.href} className="hover:underline underline-offset-2">
          {article.title}
        </Link>
      </h3>
      <p className="text-base mb-3" style={{ color: 'var(--color-text-dark-muted)' }}>
        {article.description}
      </p>
      <time dateTime={article.publishedAt} className="text-sm" style={{ color: 'var(--color-text-dark-muted)' }}>
        {formatDate(article.publishedAt)}
      </time>
    </li>
  );
}

// A list of articles with prev/next pagination. Page 1 lives at `basePath`, page n at
// `${basePath}/page/n`, so every page is a static route with one canonical URL.
export default function ArticleList({
  articles,
  page = 1,
  totalPages = 1,
  basePath,
  empty,
}: {
  articles: Article[];
  page?: number;
  totalPages?: number;
  basePath?: string;
  empty: string;
}) {
  if (articles.length === 0) {
    return (
      <div
        className="p-8"
        style={{
          background: 'var(--color-bg-light-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <p className="text-base" style={{ color: 'var(--color-text-dark-muted)' }}>
          {empty}
        </p>
      </div>
    );
  }

  const href = (n: number) => (n === 1 ? basePath! : `${basePath}/page/${n}`);

  return (
    <>
      <ul className="grid gap-5 md:grid-cols-2">
        {articles.map((a) => (
          <ArticleCard key={a.href} article={a} />
        ))}
      </ul>
      {basePath && totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-10 flex items-center justify-between gap-4 text-base font-semibold">
          {page > 1 ? (
            <Link href={href(page - 1)} style={{ color: 'var(--color-primary)' }}>
              ← Newer
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm font-normal" style={{ color: 'var(--color-text-dark-muted)' }}>
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={href(page + 1)} style={{ color: 'var(--color-primary)' }}>
              Older →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}
