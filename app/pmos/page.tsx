import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Sheet } from '@/components/blueprint';
import { CycleSchematic, CycleStack } from '@/components/PmosCycle';

export const metadata: Metadata = {
  title: 'pmOS — Persistent Momentum',
  description:
    'pmOS is the build system that runs the Persistent Momentum portfolio. Research, plan, build, ship, market, analyze — repeat.',
};

const properties = [
  {
    label: 'Autonomous',
    detail:
      'A 24/7 agent army runs the cycle. Two tiers: kernel agents on a priority queue, plus role agents on cron sweeps. Humans approve direction; the system does the grind.',
  },
  {
    label: 'Local-first',
    detail:
      'The Mac mini is canonical compute. Public edge runs on Vercel, Supabase, and Cloudflare — everything else is portable. No platform lock-in by default.',
  },
  {
    label: 'Transferable',
    detail:
      'Every operating decision is in git, Supabase, and a knowledge base any successor can read. The system is documented to be handed off.',
  },
  {
    label: 'Compounding',
    detail:
      'Each product adds to the data, content, and distribution layer the next product inherits. The portfolio is worth more than the sum of its products.',
  },
];

const humanInTheLoop = [
  {
    num: '01',
    title: 'Judgment, not grind',
    detail:
      'Strategic direction, design review, irreversible decisions. The agents handle everything else.',
  },
  {
    num: '02',
    title: 'Approval gates',
    detail:
      'Customer-facing publishes, paid spend, and main-branch deploys to production. Internal work auto-applies.',
  },
  {
    num: '03',
    title: 'Kill / graduate calls',
    detail:
      'At day 90, every product is reviewed against revenue thresholds. Shelve a loser, double down on a winner.',
  },
];

export default function PmosPage() {
  return (
    <main className="min-h-screen bg-navy">
      {/* Header */}
      <section className="relative border-b border-white/8 bg-navy">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-36 sm:px-8 sm:pt-44">
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px flex-1 bg-white/12" />
            <span className="annotation-bright">Sheet B &middot; The system</span>
          </div>

          <p className="annotation mt-12">pmOS &middot; The build system</p>
          <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
            pmOS is how the portfolio compounds.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-mid sm:text-lg">
            Anyone can build one product. pmOS is the repeatable system that
            takes an idea from research to revenue, makes the next run cheaper
            and faster than the last, and lets a small team operate a portfolio
            instead of a single bet.
          </p>
        </div>
      </section>

      {/* The cycle, in full */}
      <Sheet sheet="01" title="The cycle" raised>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-[2.25rem]">
              Six stations. One return loop.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-mid sm:text-lg">
              The cycle is the spine of pmOS. Every product flows through every
              station — and every learning at the analyze station feeds back
              into the next cycle&apos;s research.
            </p>
            <p className="annotation mt-8">
              research &rarr; plan &rarr; build &rarr; ship &rarr; market &rarr; analyze &rarr; repeat
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="hidden md:block">
              <CycleSchematic />
            </div>
            <div className="md:hidden">
              <CycleStack />
            </div>
          </div>
        </div>
      </Sheet>

      {/* Properties of the system */}
      <Sheet sheet="02" title="System properties">
        <h2 className="max-w-3xl text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-[2.25rem]">
          Why this works.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-mid sm:text-lg">
          Four properties make pmOS a system worth operating against — not just
          a stack of tools.
        </p>
        <div className="mt-12 grid gap-px overflow-hidden border border-white/12 bg-white/12 sm:grid-cols-2">
          {properties.map((p, i) => (
            <div key={p.label} className="relative bg-navy p-7 sm:p-8">
              <p className="annotation-bright mb-4">
                {String(i + 1).padStart(2, '0')} &middot; {p.label}
              </p>
              <p className="text-base leading-relaxed text-glow/90">{p.detail}</p>
            </div>
          ))}
        </div>
      </Sheet>

      {/* Human in the loop */}
      <Sheet sheet="03" title="Human in the loop" raised>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-[2.25rem]">
              The agents handle the grind. Humans handle judgment.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-mid sm:text-lg">
              pmOS doesn&apos;t aim for zero humans. It aims for zero
              human-grind — so the humans we do have spend their time on the
              decisions that actually move the portfolio.
            </p>
          </div>
          <ol className="lg:col-span-7">
            {humanInTheLoop.map((row, i) => (
              <li
                key={row.num}
                className={`relative grid grid-cols-[64px_minmax(0,1fr)] items-baseline gap-5 px-1 py-6 ${
                  i > 0 ? 'border-t border-white/12' : ''
                }`}
              >
                <span className="font-mono text-sm tracking-widest text-electric">
                  {row.num}
                </span>
                <div>
                  <p className="text-base font-semibold text-white">{row.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-mid">
                    {row.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Sheet>

      {/* The moat */}
      <Sheet sheet="04" title="The moat">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-[2.25rem]">
              The moat is the factory, not any single product.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-mid sm:text-lg">
              A competitor copying one product still can&apos;t copy the system
              that ships the next ten. As long as pmOS gets a little better with
              every cycle, the gap widens.
            </p>
            <p className="mt-4 text-base leading-relaxed text-mid sm:text-lg">
              Every product feeds the data, content, and distribution layer.
              The portfolio is the output; the layer is the asset.
            </p>
          </div>
          <aside className="relative lg:col-span-5">
            <span
              aria-hidden
              className="absolute -left-2 top-0 h-full w-px bg-electric/40 lg:left-0"
            />
            <div className="pl-6">
              <p className="annotation-bright mb-3">From the brand</p>
              <p className="font-mono text-sm leading-relaxed text-glow">
                &ldquo;Persistent Momentum is to its products what Anthropic is
                to Claude — the company that builds them; the product is what
                you meet. pmOS is the factory.&rdquo;
              </p>
            </div>
          </aside>
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
          <p className="annotation-bright mb-4">Two doors</p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Want to see pmOS up close?
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-mid">
            Investors and partners can request a walkthrough. Builders curious
            about the agent stack can apply to work on it directly.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 bg-electric px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1A4FE0]"
            >
              Request a walkthrough
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              href="/careers"
              className="group inline-flex items-center justify-center gap-2 border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-electric/70 hover:bg-white/[0.03]"
            >
              Build on it
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </Sheet>

      <Footer />
    </main>
  );
}
