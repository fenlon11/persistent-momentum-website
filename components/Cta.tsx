import Link from 'next/link';

// Final CTA — light, centered, recruiter-style.
// Holdco audience (investors, partners, talent, press) — not customer-funnel.

export default function Cta() {
  return (
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
          Investors, partners, press.
        </h2>
        <p
          className="text-lg mb-10"
          style={{ color: 'var(--color-text-dark-muted)' }}
        >
          The corporate side runs through this door. If you&apos;re a customer
          looking for one of our products, the product&apos;s own site is where
          you want to go.
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
  );
}
