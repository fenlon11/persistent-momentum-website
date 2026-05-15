import Link from 'next/link';

export default function Hero() {
  return (
    <section className="px-6 pt-12 pb-16 md:pt-20 md:pb-24" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto">
        <span
          className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1.5 mb-5 md:mb-7"
          style={{
            color: 'var(--color-primary)',
            background: 'rgba(21,68,142,0.06)',
            border: '1px solid rgba(21,68,142,0.18)',
            borderRadius: '999px',
            letterSpacing: '0.12em',
          }}
        >
          Persistent Momentum
        </span>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 md:mb-6 leading-[1.1] md:leading-[1.05] max-w-4xl"
          style={{
            color: 'var(--color-text)',
            letterSpacing: '-0.02em',
          }}
        >
          We build products as persistent as you.
          <br />
          <span
            style={{
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--color-text-muted)',
            }}
          >
            To keep your momentum going.
          </span>
        </h1>

        <p
          className="text-base md:text-xl mb-7 md:mb-9 max-w-2xl leading-relaxed"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Persistent Momentum is the company behind{' '}
          <Link
            href="https://recruiter.persistentmomentum.com"
            className="font-semibold underline-offset-4 hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            Persistent Recruiter
          </Link>
          {' '}and{' '}
          <Link
            href="https://sales.persistentmomentum.com"
            className="font-semibold underline-offset-4 hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            Persistent Sales
          </Link>
          . We design, build, and ship software for small teams.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <a
            href="https://recruiter.persistentmomentum.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-base font-semibold px-7 py-3.5 text-white transition-colors"
            style={{
              background: 'var(--color-primary)',
              borderRadius: 'var(--radius)',
            }}
          >
            Visit Persistent Recruiter <span className="ml-2">→</span>
          </a>
          <a
            href="https://sales.persistentmomentum.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-base font-semibold px-7 py-3.5 transition-colors"
            style={{
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              background: 'var(--color-bg)',
            }}
          >
            Visit Persistent Sales <span className="ml-2">→</span>
          </a>
        </div>

        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Persistent Recruiter is live. Persistent Sales is coming soon.
        </p>
      </div>
    </section>
  );
}
