import { products, statusMeta } from '@/lib/products-data';

// Homepage's product feature section — two large cards.
// Recruiter (live) gets the highlighted treatment;
// Sales (coming-soon) sits beside it at the same visual weight.

export default function FeaturedProducts() {
  return (
    <section
      id="products"
      className="px-6 py-24"
      style={{
        background: 'var(--color-bg-light-secondary)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 max-w-2xl">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{
              color: 'var(--color-primary)',
              letterSpacing: '0.12em',
            }}
          >
            The products
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              color: 'var(--color-text-dark)',
              letterSpacing: '-0.02em',
            }}
          >
            Software for small teams.
          </h2>
          <p
            className="text-lg"
            style={{ color: 'var(--color-text-dark-muted)' }}
          >
            Two products today. Each one has its own brand, its own site, and its
            own customers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {products.map((p) => {
            const status = statusMeta[p.status];
            const isLive = p.status === 'live';
            return (
              <a
                key={p.id}
                href={p.externalUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
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

                <h3
                  className="text-2xl font-bold mb-2"
                  style={{
                    color: 'var(--color-text-dark)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {p.name}
                </h3>
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
                  {isLive ? 'Visit site' : 'Learn more'}
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
  );
}
