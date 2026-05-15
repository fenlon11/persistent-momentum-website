import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Sheet } from '@/components/blueprint';

export const metadata: Metadata = {
  title: 'Careers — Persistent Momentum',
  description:
    'A portfolio operator shipping products in tech, AI, and automation. Small team, fast cycles, real software shipped without six-month roadmap meetings.',
};

const principles = [
  {
    num: '01',
    title: 'Small team, fast cycles',
    detail:
      'No layers, no roadmap theatre. You scope it, you build it, you ship it — usually inside the week.',
  },
  {
    num: '02',
    title: 'pmOS does the grind',
    detail:
      'Research, scaffolding, content, analysis — the build system handles the repetitive work. Your hours go to judgment.',
  },
  {
    num: '03',
    title: 'Ship real software',
    detail:
      'Every product goes live with real customers. Nothing sits in a drawer waiting for a launch committee.',
  },
  {
    num: '04',
    title: 'The work compounds',
    detail:
      'Every product makes the next one cheaper to build. You are not starting from zero each time.',
  },
];

const areas = [
  {
    code: 'WEB',
    label: 'Web platforms',
    detail:
      'Next.js, Supabase, Stripe. Dashboards, tools, and workflow apps for business customers.',
  },
  {
    code: 'AI',
    label: 'AI-powered automation',
    detail:
      'Claude API, content and ops pipelines, the automation products like Persistent Marketer.',
  },
  {
    code: 'PMOS',
    label: 'The build system itself',
    detail:
      'pmOS — the agents, skills, and pipelines that make the whole portfolio possible.',
  },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-navy">
      {/* Header */}
      <section className="relative border-b border-white/8 bg-navy">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-36 sm:px-8 sm:pt-44">
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px flex-1 bg-white/12" />
            <span className="annotation-bright">Sheet C &middot; Careers</span>
          </div>
          <p className="annotation mt-12">Careers</p>
          <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Build real software. Without the six-month roadmap meeting.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-mid sm:text-lg">
            Persistent Momentum is a portfolio operator. We run a small team and
            fast cycles on top of pmOS, our automated build system. If
            that&apos;s how you want to work, talk to us.
          </p>
        </div>
      </section>

      {/* How we work */}
      <Sheet sheet="01" title="How we work" raised>
        <div className="grid gap-px overflow-hidden border border-white/12 bg-white/12 sm:grid-cols-2">
          {principles.map((p) => (
            <div key={p.num} className="relative bg-navy p-6 sm:p-7">
              <span
                aria-hidden
                className="absolute left-0 top-0 h-2 w-2 border-l border-t border-electric/60"
              />
              <p className="font-mono text-xs tracking-widest text-electric">
                {p.num}
              </p>
              <h2 className="mt-3 text-base font-semibold text-white">
                {p.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mid">{p.detail}</p>
            </div>
          ))}
        </div>
      </Sheet>

      {/* Open problems */}
      <Sheet sheet="02" title="Open problems">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-[2.25rem]">
              What you&apos;d work on.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-mid">
              No formal listings. We hire when the right builder turns up, not
              on a calendar — and the work spans the whole portfolio.
            </p>
          </div>
          <ol className="lg:col-span-7">
            {areas.map((a, i) => (
              <li
                key={a.code}
                className={`grid grid-cols-[72px_minmax(0,1fr)] items-baseline gap-5 px-1 py-6 ${
                  i > 0 ? 'border-t border-white/12' : ''
                }`}
              >
                <span className="font-mono text-xs tracking-widest text-electric">
                  {a.code}
                </span>
                <div>
                  <p className="text-base font-semibold text-white">{a.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-mid">
                    {a.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Sheet>

      {/* CTA */}
      <Sheet>
        <div className="relative border border-white/12 bg-navy-raised p-8 sm:p-10">
          <span
            aria-hidden
            className="absolute left-0 top-0 h-3 w-3 border-l border-t border-electric/60"
          />
          <span
            aria-hidden
            className="absolute right-0 bottom-0 h-3 w-3 border-b border-r border-electric/60"
          />
          <p className="annotation-bright mb-4">Application</p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            No formal listings — yet.
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-mid">
            Send us what you have shipped and what you want to build next.
            Short and specific beats long and polished.
          </p>
          <Link
            href="/contact"
            className="group mt-7 inline-flex items-center gap-2 bg-electric px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1A4FE0]"
          >
            Talk to us
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </Sheet>

      <Footer />
    </main>
  );
}
