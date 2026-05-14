const steps = [
  { n: '01', name: 'Research', detail: 'Markets, competitors, and real demand signals.' },
  { n: '02', name: 'Plan', detail: 'Business plan, brand, and a tight build spec.' },
  { n: '03', name: 'Build', detail: 'Full-stack app shipped by an autonomous build loop.' },
  { n: '04', name: 'Ship', detail: 'Deploy, domain, billing, and smoke tests.' },
  { n: '05', name: 'Market', detail: 'Content and social automation drive the funnel.' },
  { n: '06', name: 'Analyze', detail: 'Metrics in, learnings out, the system improves.' },
];

export default function PmosSystem() {
  return (
    <section className="border-b border-white/8 bg-navy">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow mb-5">The system</p>
          <h2 className="text-balance text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">
            pmOS is the factory.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-mid">
            pmOS is the repeatable system that builds and scales every product in the
            portfolio — taking an idea from research to revenue with minimal human
            work. Each run makes the next one cheaper and faster. The portfolio
            compounds.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="group bg-navy p-7">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm font-semibold text-electric">{step.n}</span>
                <span className="text-base font-semibold text-white">{step.name}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-mid">{step.detail}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 font-mono text-xs uppercase tracking-wider text-mid">
          research &rarr; plan &rarr; build &rarr; ship &rarr; market &rarr; analyze &rarr; repeat
        </p>
      </div>
    </section>
  );
}
