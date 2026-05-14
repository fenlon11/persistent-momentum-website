import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Careers — Persistent Momentum',
  description:
    'A portfolio operator shipping products in Tech, AI, and Automation. Small team, fast cycles, real software shipped without six-month roadmap meetings.',
};

const principles = [
  {
    title: 'Small team, fast cycles',
    detail:
      'No layers, no roadmap theatre. You scope it, you build it, you ship it — usually inside the week.',
  },
  {
    title: 'pmOS does the grind',
    detail:
      'Research, scaffolding, content, analysis — the build system handles the repetitive work. Your hours go to judgment.',
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
    label: 'Web platforms',
    detail: 'Next.js, Supabase, Stripe. Dashboards, tools, and workflow apps for business customers.',
  },
  {
    label: 'AI-powered automation',
    detail: 'Claude API, content and ops pipelines, the automation products like Persistent Marketer.',
  },
  {
    label: 'The build system itself',
    detail: 'pmOS — the agents, skills, and pipelines that make the whole portfolio possible.',
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-navy">
      {/* header */}
      <section className="border-b border-white/8 bg-navy">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-36 sm:px-8 sm:pt-44">
          <p className="eyebrow mb-5">Careers</p>
          <h1 className="max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Build and ship real software — without the six-month roadmap meeting.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mid">
            Persistent Momentum is a portfolio operator shipping products in Tech, AI,
            and Automation. We are a small team running fast cycles on top of pmOS, our
            automated build system. If that sounds like how you want to work, talk to us.
          </p>
        </div>
      </section>

      {/* how we work */}
      <section className="border-b border-white/8 bg-navy-raised">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <p className="eyebrow mb-5">How we work</p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-white/8 bg-white/8 sm:grid-cols-2">
            {principles.map((principle) => (
              <div key={principle.title} className="bg-navy p-7">
                <h2 className="text-base font-semibold text-white">{principle.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-mid">{principle.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* what you'd work on */}
      <section className="border-b border-white/8 bg-navy">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <p className="eyebrow mb-5">What you would work on</p>
          <h2 className="max-w-xl text-balance text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">
            Open problems across the portfolio.
          </h2>
          <div className="mt-10 space-y-px overflow-hidden rounded-xl border border-white/8 bg-white/8">
            {areas.map((area) => (
              <div key={area.label} className="flex flex-col gap-1 bg-navy p-7 sm:flex-row sm:gap-8">
                <p className="text-base font-semibold text-white sm:w-64 sm:flex-shrink-0">
                  {area.label}
                </p>
                <p className="text-sm leading-relaxed text-mid">{area.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="bg-navy">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="rounded-xl border border-white/8 bg-navy-raised p-8 sm:p-10">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              No formal listings — yet.
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-mid">
              We hire when the right builder turns up, not on a calendar. Send us what
              you have shipped and what you want to build next.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-lg bg-electric px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1A4FE0]"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
