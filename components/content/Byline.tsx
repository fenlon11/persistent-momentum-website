import Link from 'next/link';
import type { AuthorEntry } from '@/lib/content';

// Author byline. An AI author always carries the visible "(AI)" marker, at every viewport
// (Matt, 2026-10-10): "Elle Evate · Head of AI Content (AI)". Never hide or iconify it.
export default function Byline({ author }: { author: AuthorEntry }) {
  return (
    <span>
      By{' '}
      <Link href={author.href} className="font-semibold underline-offset-2 hover:underline" style={{ color: 'var(--color-text-dark)' }}>
        {author.name}
      </Link>
      {author.title && <> · {author.title}</>}
      {author.kind === 'ai' && (
        <>
          {' '}
          <AiBadge />
        </>
      )}
    </span>
  );
}

export function AiBadge() {
  return (
    <span
      className="inline-block text-xs font-semibold px-1.5 py-0.5 align-middle"
      style={{
        color: 'var(--color-primary)',
        background: 'var(--color-bg-light-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius)',
      }}
    >
      (AI)
    </span>
  );
}

// Non-photographic avatar: initials, or an "AI" label for an AI author. Never a human-looking photo.
export function AuthorAvatar({ author }: { author: AuthorEntry }) {
  const label =
    author.kind === 'ai'
      ? 'AI'
      : author.name
          .split(/\s+/)
          .filter((w) => /^[A-Z]/.test(w))
          .slice(0, 2)
          .map((w) => w[0])
          .join('');
  return (
    <span
      aria-hidden
      className="inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
      style={{ background: author.kind === 'ai' ? 'var(--color-electric)' : 'var(--color-primary)' }}
    >
      {label}
    </span>
  );
}
