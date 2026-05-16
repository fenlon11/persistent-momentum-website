// Short "thesis" section — operator-empathy framing.
// Replaces the prior portfolio-math description with an owner-first voice.

export default function PortfolioThesis() {
  return (
    <section className="px-6 py-24" style={{ background: 'var(--color-bg-light)' }}>
      <div className="max-w-3xl mx-auto">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
        >
          The thesis
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold mb-6 leading-[1.1]"
          style={{
            color: 'var(--color-text-dark)',
            letterSpacing: '-0.02em',
          }}
        >
          Built by operators.
          <br />
          <span
            style={{
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--color-text-dark-muted)',
            }}
          >
            For operators.
          </span>
        </h2>
        <p
          className="text-lg leading-relaxed"
          style={{ color: 'var(--color-text-dark-muted)' }}
        >
          We&apos;ve run small businesses. We&apos;ve hired our next person
          while still doing the job ourselves. We&apos;ve chased down deals we
          couldn&apos;t afford to lose. Every product we ship is the tool we
          wished we had &mdash; and the tool we&apos;d buy ourselves.
        </p>
      </div>
    </section>
  );
}
