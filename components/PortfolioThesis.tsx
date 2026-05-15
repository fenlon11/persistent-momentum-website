// Short "why a portfolio" section — one paragraph + two stats.
// Light theme, holdco voice. Replaces the old blueprint Thesis component.

export default function PortfolioThesis() {
  return (
    <section className="px-6 py-24" style={{ background: 'var(--color-bg-light)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-12 md:gap-16 items-start">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
            >
              The thesis
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-5"
              style={{
                color: 'var(--color-text-dark)',
                letterSpacing: '-0.02em',
              }}
            >
              Two products today. More coming.
            </h2>
            <p
              className="text-lg leading-relaxed mb-4"
              style={{ color: 'var(--color-text-dark-muted)' }}
            >
              Each product is its own brand, on its own site, with its own
              customers. You can love the product without knowing we exist —
              and that&apos;s the point.
            </p>
            <p
              className="text-lg leading-relaxed"
              style={{ color: 'var(--color-text-dark-muted)' }}
            >
              We design, build, and ship the next one faster than the last.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:gap-8">
            <Stat figure="1" label="Live today" />
            <Stat figure="1" label="Coming soon" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ figure, label }: { figure: string; label: string }) {
  return (
    <div
      className="p-6"
      style={{
        background: 'var(--color-bg-light-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <p
        className="text-5xl font-bold mb-2"
        style={{
          color: 'var(--color-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {figure}
      </p>
      <p
        className="text-sm font-medium"
        style={{ color: 'var(--color-text-dark-muted)' }}
      >
        {label}
      </p>
    </div>
  );
}
