import Link from 'next/link';

// Premium deep-navy hero — BRAND.md "deep-space blue + electric accent".
// A single electric-blue accent, an ice-blue radial glow, generous space.
export default function Hero() {
  return (
    <section
      className="relative overflow-hidden px-6 pt-16 pb-20 md:pt-28 md:pb-32"
      style={{
        background:
          'linear-gradient(160deg, var(--color-navy) 0%, var(--color-navy-2) 100%)',
      }}
    >
      {/* Electric glow — echoes the glossy P-mark's glowing edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(30,91,255,0.35) 0%, rgba(30,91,255,0) 70%)',
          filter: 'blur(8px)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-30%] left-[-8%] h-[380px] w-[380px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(168,197,255,0.14) 0%, rgba(168,197,255,0) 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <span
          className="inline-block text-xs font-semibold uppercase tracking-widest px-3.5 py-1.5 mb-6 md:mb-8"
          style={{
            color: 'var(--color-ice)',
            background: 'rgba(30,91,255,0.14)',
            border: '1px solid rgba(168,197,255,0.28)',
            borderRadius: '999px',
            letterSpacing: '0.14em',
          }}
        >
          Persistent Momentum, LLC
        </span>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 md:mb-7 leading-[1.08] md:leading-[1.03] max-w-4xl"
          style={{
            color: 'var(--color-glow-white)',
            letterSpacing: '-0.025em',
          }}
        >
          We build products as persistent as you.
          <br />
          <span
            style={{
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--color-ice)',
            }}
          >
            To keep your momentum going.
          </span>
        </h1>

        <p
          className="text-base md:text-xl mb-8 md:mb-10 max-w-2xl leading-relaxed"
          style={{ color: 'rgba(230,238,255,0.72)' }}
        >
          Persistent Momentum is the company behind{' '}
          <Link
            href="https://workforce.persistentmomentum.com/pricing"
            className="font-semibold underline-offset-4 hover:underline"
            style={{ color: 'var(--color-ice)' }}
          >
            Persistent Workforce
          </Link>
          {' '}and{' '}
          <Link
            href="https://sales.persistentmomentum.com"
            className="font-semibold underline-offset-4 hover:underline"
            style={{ color: 'var(--color-ice)' }}
          >
            Persistent Sales
          </Link>
          . We design, build, and ship software for small teams.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-7">
          <a
            href="https://workforce.persistentmomentum.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-base font-semibold px-7 py-3.5 text-white transition-transform hover:-translate-y-0.5"
            style={{
              background: 'var(--color-electric)',
              borderRadius: 'var(--radius)',
              boxShadow: '0 10px 30px -10px rgba(30,91,255,0.6)',
            }}
          >
            Visit Persistent Workforce <span className="ml-2">→</span>
          </a>
          <a
            href="https://sales.persistentmomentum.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-base font-semibold px-7 py-3.5 transition-colors"
            style={{
              color: 'var(--color-glow-white)',
              border: '1px solid rgba(168,197,255,0.35)',
              borderRadius: 'var(--radius)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            Visit Persistent Sales <span className="ml-2">→</span>
          </a>
        </div>

        <p className="text-sm" style={{ color: 'rgba(168,197,255,0.7)' }}>
          Persistent Workforce is live. Persistent Sales is coming soon.
        </p>
      </div>
    </section>
  );
}
