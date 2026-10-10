import Link from 'next/link';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />

      {/* Latest — empty until the content system (fenlon11/pmOS#681) lands. */}
      <section className="px-6 py-20" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-6"
            style={{ color: 'var(--color-text-dark)', letterSpacing: '-0.02em' }}
          >
            Latest
          </h2>
          <div
            className="p-8"
            style={{
              background: 'var(--color-bg-light-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <p className="text-base" style={{ color: 'var(--color-text-dark-muted)' }}>
              The first news and guides are on the way. Subscribe above to get
              them when they publish.
            </p>
          </div>
        </div>
      </section>

      {/* Consulting — our own service, never styled like sponsored content. */}
      <section
        className="px-6 py-20"
        style={{
          background: 'var(--color-bg-light-secondary)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
            >
              Consulting from Persistent Momentum
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ color: 'var(--color-text-dark)', letterSpacing: '-0.02em' }}
            >
              Business and AI systems, built with you.
            </h2>
            <p className="text-base md:text-lg" style={{ color: 'var(--color-text-dark-muted)' }}>
              We help operators put AI to work in the systems they already run.
            </p>
          </div>
          <Link
            href="/consulting"
            className="inline-flex flex-shrink-0 items-center justify-center text-base font-semibold px-7 py-3.5 text-white"
            style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius)' }}
          >
            Talk to us about consulting <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
