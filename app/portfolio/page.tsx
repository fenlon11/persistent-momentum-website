import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { products, statusMeta, categories } from '@/lib/products-data';

export const metadata: Metadata = {
  title: 'Portfolio — Persistent Momentum',
  description:
    'The Persistent Momentum portfolio. Persistent Recruiter is live. Persistent Sales is coming soon.',
};

export default function PortfolioPage() {
  return (
    <main>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <section className="px-6 pt-6 pb-12 md:pt-20 md:pb-16" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-6xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
          >
            Portfolio
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 md:mb-6 leading-[1.1] md:leading-[1.05] max-w-4xl"
            style={{
              color: 'var(--color-text-dark)',
              letterSpacing: '-0.02em',
            }}
          >
            What we build.
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl leading-relaxed"
            style={{ color: 'var(--color-text-dark-muted)' }}
          >
            Every product is its own brand on its own site, with its own
            customers. Use what you need; no bundles, no lock-in.
          </p>
        </div>
      </section>

      {/* ── Products ────────────────────────────────────────────────── */}
      <section
        className="px-6 py-20"
        style={{
          background: 'var(--color-bg-light-secondary)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((p) => {
              const status = statusMeta[p.status];
              const isLive = p.status === 'live';
              const href = p.externalUrl ?? '#';
              return (
                <a
                  key={p.id}
                  href={href}
                  target={p.externalUrl ? '_blank' : undefined}
                  rel={p.externalUrl ? 'noopener noreferrer' : undefined}
                  className="group block p-8"
                  style={{
                    background: 'var(--color-bg-light-card)',
                    border: isLive
                      ? '2px solid var(--color-primary)'
                      : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: isLive
                      ? '0 12px 32px -12px rgba(21,68,142,0.18)'
                      : 'none',
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{
                        color: 'var(--color-primary)',
                        letterSpacing: '0.12em',
                      }}
                    >
                      {p.category}
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs font-medium">
                      <span
                        aria-hidden
                        className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                      />
                      <span style={{ color: 'var(--color-text-dark-muted)' }}>
                        {status.label}
                      </span>
                    </span>
                  </div>

                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{
                      color: 'var(--color-text-dark)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {p.name}
                  </h2>
                  <p
                    className="text-base font-medium mb-4"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {p.tagline}
                  </p>
                  <p
                    className="text-base leading-relaxed mb-6"
                    style={{ color: 'var(--color-text-dark-muted)' }}
                  >
                    {p.description}
                  </p>

                  <ul className="space-y-2 mb-7">
                    {p.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm"
                        style={{ color: 'var(--color-text-dark)' }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: 'var(--color-primary)' }}
                          aria-hidden
                        >
                          <path
                            d="M16.667 5.833 8.333 14.166l-4.166-4.167"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {p.externalUrl
                      ? isLive
                        ? `Visit ${p.externalUrl.replace('https://', '')}`
                        : `Preview at ${p.externalUrl.replace('https://', '')}`
                      : 'Coming soon'}
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────────── */}
      <section className="px-6 py-24" style={{ background: 'var(--color-bg-light)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 max-w-2xl">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
            >
              Three categories
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{
                color: 'var(--color-text-dark)',
                letterSpacing: '-0.02em',
              }}
            >
              Every product fits one.
            </h2>
            <p
              className="text-lg"
              style={{ color: 'var(--color-text-dark-muted)' }}
            >
              These categories define what enters the portfolio. Anything that
              doesn&apos;t fit one of them doesn&apos;t get built.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((c) => (
              <div
                key={c.name}
                className="p-7"
                style={{
                  background: 'var(--color-bg-light-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <h3
                  className="text-lg font-bold mb-3"
                  style={{
                    color: 'var(--color-text-dark)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {c.name}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'var(--color-text-dark-muted)' }}
                >
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section
        className="px-6 py-24 text-center"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold mb-5"
            style={{
              color: 'var(--color-text-dark)',
              letterSpacing: '-0.02em',
            }}
          >
            Have a product idea, or a partnership?
          </h2>
          <p
            className="text-lg mb-10"
            style={{ color: 'var(--color-text-dark-muted)' }}
          >
            The portfolio grows when a product clears the bar — a clear
            problem, a clear customer, a clear way to charge.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center text-base font-semibold px-8 py-4 text-white transition-colors"
            style={{
              background: 'var(--color-primary)',
              borderRadius: 'var(--radius)',
            }}
          >
            Talk to us <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
