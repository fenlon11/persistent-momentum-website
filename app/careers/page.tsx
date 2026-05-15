import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Careers — Persistent Momentum',
  description:
    'Persistent Momentum builds software for small teams. Small crew, fast cycles, real software shipped without six-month roadmap meetings.',
};

const principles = [
  {
    title: 'Small team, fast cycles',
    detail:
      'No layers, no roadmap theatre. You scope it, you build it, you ship it — usually inside the week.',
  },
  {
    title: 'Modern stack',
    detail:
      'Next.js, Supabase, Stripe, Claude API. Everything is current and chosen because it ships fastest.',
  },
  {
    title: 'Ship real software',
    detail:
      'Every product goes live with real customers. Nothing sits in a drawer waiting for a launch committee.',
  },
  {
    title: 'The work compounds',
    detail:
      'Every product makes the next one cheaper to build. You are not starting from zero each time.',
  },
];

const areas = [
  {
    label: 'Persistent Recruiter',
    detail:
      'Our live product. Web platform for recruiters and small hiring teams — pipelines, outreach, Discovery Videos.',
  },
  {
    label: 'Persistent Sales',
    detail:
      'In design. A modern sales workflow for small teams, built on the same foundation as Recruiter.',
  },
  {
    label: 'The next product',
    detail:
      'What gets built after Sales is open. Bring an idea, or pick one off the research queue.',
  },
];

export default function CareersPage() {
  return (
    <main>
      {/* Header */}
      <section className="px-6 pt-12 pb-12 md:pt-20 md:pb-16" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-6xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
          >
            Careers
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 md:mb-6 leading-[1.1] md:leading-[1.05] max-w-3xl"
            style={{
              color: 'var(--color-text-dark)',
              letterSpacing: '-0.02em',
            }}
          >
            Build real software.
            <br />
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 300,
                color: 'var(--color-text-dark-muted)',
              }}
            >
              Without the six-month roadmap meeting.
            </span>
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl leading-relaxed"
            style={{ color: 'var(--color-text-dark-muted)' }}
          >
            Persistent Momentum runs a small team and fast cycles. If
            that&apos;s how you want to work, talk to us.
          </p>
        </div>
      </section>

      {/* How we work */}
      <section
        className="px-6 py-24"
        style={{
          background: 'var(--color-bg-light-secondary)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 max-w-2xl">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
            >
              How we work
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{
                color: 'var(--color-text-dark)',
                letterSpacing: '-0.02em',
              }}
            >
              Four operating principles.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {principles.map((p) => (
              <div
                key={p.title}
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
                  {p.title}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'var(--color-text-dark-muted)' }}
                >
                  {p.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open problems */}
      <section className="px-6 py-24" style={{ background: 'var(--color-bg-light)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 max-w-2xl">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
            >
              What you would work on
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{
                color: 'var(--color-text-dark)',
                letterSpacing: '-0.02em',
              }}
            >
              Open problems across the portfolio.
            </h2>
          </div>

          <div
            className="overflow-hidden"
            style={{
              background: 'var(--color-bg-light-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            {areas.map((a, i) => (
              <div
                key={a.label}
                className="flex flex-col gap-1 p-7 sm:flex-row sm:gap-8"
                style={{
                  borderTop: i > 0 ? '1px solid var(--color-border-light)' : 'none',
                }}
              >
                <p
                  className="text-base font-bold sm:w-72 sm:flex-shrink-0"
                  style={{
                    color: 'var(--color-text-dark)',
                  }}
                >
                  {a.label}
                </p>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'var(--color-text-dark-muted)' }}
                >
                  {a.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
            No formal listings — yet.
          </h2>
          <p
            className="text-lg mb-10"
            style={{ color: 'var(--color-text-dark-muted)' }}
          >
            We hire when the right builder turns up, not on a calendar. Send us
            what you have shipped and what you want to build next.
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
