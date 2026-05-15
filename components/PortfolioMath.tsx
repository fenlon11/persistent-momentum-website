import { Sheet } from './blueprint';

const milestones = [
  { q: 'Q2 2026', focus: 'PR v2 shipped + sellable', detail: 'Workflows + Integrations.' },
  { q: 'Q3 2026', focus: 'Persistent Marketer v1', detail: 'AI-powered content + social pipeline.' },
  { q: 'Q4 2026', focus: '4–6 products live', detail: 'Mid-portfolio mix.' },
  { q: 'EOY 2026', focus: '10–12 products', detail: 'Portfolio breadth across three categories.' },
];

export default function PortfolioMath() {
  return (
    <Sheet sheet="05 / 06" title="The math">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 className="text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-[2.25rem]">
            Portfolio math, not single-bet math.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-mid sm:text-lg">
            $100k MRR is a portfolio number. Two or three products at $10k–$30k.
            A handful at $1k–$5k. A long tail under $1k. Shots on goal, not one
            big bet.
          </p>
          <p className="mt-4 text-base leading-relaxed text-mid sm:text-lg">
            Every product clears a bar before it gets built: one-line pitch,
            clear ICP, pricing, fit with one of three categories. Most products
            stay small. A few grow. The portfolio compounds.
          </p>
        </div>

        <div className="lg:col-span-7">
          {/* Timeline schematic — milestones as drafting-style chevrons */}
          <p className="annotation mb-5">2026 timeline</p>
          <ol className="relative overflow-hidden border border-white/12">
            {milestones.map((m, i) => (
              <li
                key={m.q}
                className={`relative grid grid-cols-[88px_minmax(0,1fr)_minmax(0,1.2fr)] items-baseline gap-4 px-5 py-5 sm:gap-6 sm:px-7 ${
                  i > 0 ? 'border-t border-white/12' : ''
                }`}
              >
                <span className="font-mono text-xs tracking-widest text-electric">
                  {m.q}
                </span>
                <p className="text-base font-semibold text-white">{m.focus}</p>
                <p className="text-sm leading-relaxed text-mid">{m.detail}</p>
              </li>
            ))}
            {/* Final target — accent row */}
            <li className="relative grid grid-cols-[88px_minmax(0,1fr)_minmax(0,1.2fr)] items-baseline gap-4 border-t border-electric/40 bg-electric/[0.05] px-5 py-5 sm:gap-6 sm:px-7">
              <span className="font-mono text-xs tracking-widest text-electric">
                2027 →
              </span>
              <p className="text-base font-semibold text-white">$100k MRR</p>
              <p className="text-sm leading-relaxed text-glow/80">
                A portfolio worth acquiring.
              </p>
            </li>
          </ol>
          <p className="annotation mt-5">
            Live MRR &middot; wired to <span className="text-glow">pm_mrr_snapshots</span>, not typed in
          </p>
        </div>
      </div>
    </Sheet>
  );
}
