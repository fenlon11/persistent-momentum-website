import { Metadata } from 'next';
import ConsultingForm from '@/components/ConsultingForm';
import { INTRO_CALL_URL } from '@/lib/consulting';
import Footer from '@/components/Footer';

// Consulting page (fenlon11/pmOS#683). Matt's rules: no pricing anywhere, and no invented clients,
// logos, testimonials or results. lib/consulting.test.ts checks the rendered text for pricing terms.
export const metadata: Metadata = {
  title: 'Consulting — Persistent Momentum',
  description:
    'Business and AI systems consulting for owners and operators of small and mid-size businesses: CRM, sales and operations workflows, reporting, AI assistants and agents.',
};

const practices = [
  {
    title: 'Business systems',
    intro: 'The tools your team runs the business on, set up so they match how you actually work.',
    items: [
      'CRM setup, cleanup and migration',
      'Sales and operations workflows',
      'Reporting you can read in five minutes',
    ],
  },
  {
    title: 'AI systems',
    intro: 'AI put to work on real tasks in your business, with a person checking the output where it matters.',
    items: [
      'Choosing AI tools that fit your team',
      'Assistants and agents for specific jobs',
      'Automating repetitive work',
    ],
  },
];

const steps = [
  {
    title: 'Intro call',
    detail: 'You tell us what is slow, manual or broken. We ask questions until we understand it.',
  },
  {
    title: 'Written scope',
    detail: 'We send a scope that says what we will build, what we will not, and how you will know it works.',
  },
  {
    title: 'Build and handoff',
    detail: 'We build it with your team, document it, and hand it over so you can run it without us.',
  },
];

const eyebrowStyle = { color: 'var(--color-primary)', letterSpacing: '0.12em' };
const headingStyle = { color: 'var(--color-text-dark)', letterSpacing: '-0.02em' };
const mutedStyle = { color: 'var(--color-text-dark-muted)' };
const cardStyle = {
  background: 'var(--color-bg-light-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
};

export default function ConsultingPage() {
  return (
    <main>
      <section className="px-6 pt-16 pb-12 md:pt-24 md:pb-16" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={eyebrowStyle}>
            Consulting
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-[1.1]" style={headingStyle}>
            Business and AI systems consulting.
          </h1>
          <p className="text-lg leading-relaxed" style={mutedStyle}>
            For owners and operators of small and mid-size businesses. We set up the systems your team
            runs on and put AI to work where it saves real time.
          </p>
        </div>
      </section>

      <section className="px-6 pb-12 md:pb-16" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
          {practices.map((p) => (
            <div key={p.title} className="p-6 sm:p-8" style={cardStyle}>
              <h2 className="text-2xl font-bold mb-3" style={headingStyle}>
                {p.title}
              </h2>
              <p className="mb-5 leading-relaxed" style={mutedStyle}>
                {p.intro}
              </p>
              <ul className="space-y-2">
                {p.items.map((item) => (
                  <li key={item} className="flex gap-3" style={{ color: 'var(--color-text-dark)' }}>
                    <span aria-hidden style={{ color: 'var(--color-primary)' }}>
                      →
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-12 md:pb-16" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={headingStyle}>
            How an engagement works
          </h2>
          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={eyebrowStyle}>
                  Step {i + 1}
                </p>
                <h3 className="text-lg font-bold mb-2" style={headingStyle}>
                  {s.title}
                </h3>
                <p className="leading-relaxed" style={mutedStyle}>
                  {s.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 pb-16 md:pb-24" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={headingStyle}>
            Tell us what you need
          </h2>
          <p className="mb-8 leading-relaxed" style={mutedStyle}>
            Whether you want to learn more or are ready to start, send a note and we will reply by email.
            Prefer to talk first?{' '}
            <a href={INTRO_CALL_URL} className="underline underline-offset-4" style={{ color: 'var(--color-primary)' }}>
              Book a 30-minute intro call
            </a>
            .
          </p>
          <ConsultingForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
