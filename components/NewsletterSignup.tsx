'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { COMMUNICATIONS_TEXT, CONSENT_TO_PROCESS_PARTS, NEWSLETTER_NAME, SUCCESS_MESSAGE } from '@/lib/newsletter-copy';

// Newsletter signup (fenlon11/pmOS#682). Posts to /api/newsletter, which submits to the PM
// HubSpot form and keeps a Supabase backup. `tone` follows the section background: dark for the
// home hero and footer, light for article and /newsletter slots. `compact` drops the first-name
// field (footer).
export default function NewsletterSignup({
  tone = 'dark',
  compact = false,
}: {
  tone?: 'dark' | 'light';
  compact?: boolean;
}) {
  const dark = tone === 'dark';
  const id = useId();
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setState('sending');
    setError(null);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.get('email'),
          firstname: data.get('firstname') ?? '',
          website: data.get('website') ?? '',
          pageUri: window.location.href,
          pageName: document.title,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setState('done');
        return;
      }
      setError(json.fields?.email ?? Object.values(json.fields ?? {})[0] ?? json.error ?? 'Something went wrong. Please try again.');
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setState('idle');
  }

  const muted = dark ? 'rgba(168,197,255,0.7)' : 'var(--color-text-dark-muted)';
  const linkColor = dark ? 'var(--color-ice)' : 'var(--color-primary)';

  if (state === 'done') {
    return (
      <p
        role="status"
        className="w-full max-w-xl text-lg font-semibold"
        style={{ color: dark ? 'var(--color-glow-white)' : 'var(--color-text-dark)' }}
      >
        {SUCCESS_MESSAGE}
      </p>
    );
  }

  const inputStyle = {
    background: dark ? 'rgba(230,238,255,0.08)' : 'var(--color-bg-light-card)',
    border: dark ? '1px solid rgba(168,197,255,0.28)' : '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    color: dark ? 'var(--color-glow-white)' : 'var(--color-text-dark)',
  };

  return (
    <form onSubmit={onSubmit} aria-label={`Subscribe to ${NEWSLETTER_NAME}`} className="w-full max-w-xl" noValidate>
      {/* Honeypot: off-screen, skipped by keyboard and screen readers. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Compact forms sit in narrow columns (footer, article summary): stay stacked until lg, or the
          email field collapses to ~80px at 640px beside the fixed-width button. */}
      <div className={`flex flex-col gap-3 ${compact ? 'lg:flex-row' : 'sm:flex-row'}`}>
        {!compact && (
          <>
            <label htmlFor={`${id}-firstname`} className="sr-only">
              First name (optional)
            </label>
            <input
              id={`${id}-firstname`}
              name="firstname"
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              className="w-full min-w-0 sm:w-36 px-4 py-3.5 text-base"
              style={inputStyle}
            />
          </>
        )}
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full min-w-0 flex-1 px-4 py-3.5 text-base"
          style={inputStyle}
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          className="inline-flex items-center justify-center text-base font-semibold px-7 py-3.5 text-white disabled:opacity-70"
          style={{ background: 'var(--color-electric)', borderRadius: 'var(--radius)' }}
        >
          {state === 'sending' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-3 text-sm font-semibold" style={{ color: dark ? 'var(--color-error-on-dark)' : 'var(--color-error)' }}>
          {error}
        </p>
      )}
      <p className="mt-3 text-sm" style={{ color: muted }}>
        Free. {COMMUNICATIONS_TEXT} {CONSENT_TO_PROCESS_PARTS[0]}
        <Link href="/privacy" className="underline underline-offset-2" style={{ color: linkColor }}>
          {CONSENT_TO_PROCESS_PARTS[1]}
        </Link>
        {CONSENT_TO_PROCESS_PARTS[2]}
      </p>
    </form>
  );
}
