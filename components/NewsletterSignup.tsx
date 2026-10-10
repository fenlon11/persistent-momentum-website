// Newsletter signup slot. Disabled placeholder: the working form (posting to
// the PM HubSpot portal) ships in fenlon11/pmOS#682 and replaces this body.
export default function NewsletterSignup({
  tone = 'dark',
}: {
  tone?: 'dark' | 'light';
}) {
  const dark = tone === 'dark';

  return (
    <form
      id="newsletter"
      aria-label="Newsletter signup"
      className="w-full max-w-xl"
    >
      <fieldset disabled className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="you@company.com"
          className="w-full min-w-0 flex-1 px-4 py-3.5 text-base disabled:cursor-not-allowed"
          style={{
            background: dark ? 'rgba(230,238,255,0.08)' : 'var(--color-bg-light-card)',
            border: dark
              ? '1px solid rgba(168,197,255,0.28)'
              : '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            color: dark ? 'var(--color-glow-white)' : 'var(--color-text-dark)',
          }}
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center text-base font-semibold px-7 py-3.5 text-white disabled:cursor-not-allowed disabled:opacity-70"
          style={{
            background: 'var(--color-electric)',
            borderRadius: 'var(--radius)',
          }}
        >
          Subscribe
        </button>
      </fieldset>
      <p
        className="mt-3 text-sm"
        style={{
          color: dark ? 'rgba(168,197,255,0.7)' : 'var(--color-text-dark-muted)',
        }}
      >
        Signups open soon. Weekly, free, unsubscribe any time.
      </p>
    </form>
  );
}
