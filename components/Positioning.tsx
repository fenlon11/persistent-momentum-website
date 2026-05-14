const facts = [
  {
    figure: '3',
    label: 'Product categories',
    detail: 'Mobile apps, web platforms, and AI-powered automation — every product fits one.',
  },
  {
    figure: '1',
    label: 'Build system',
    detail: 'pmOS runs the cycle: research → build → ship → market → analyze → repeat.',
  },
  {
    figure: '10–12',
    label: 'Products in 2026',
    detail: 'Shots on goal, not one big bet. Portfolio velocity beats single-product velocity.',
  },
];

export default function Positioning() {
  return (
    <section className="border-b border-white/8 bg-navy">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow mb-5">What we are</p>
          <h2 className="text-balance text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">
            A portfolio operator — not a startup betting a company on one idea.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-mid">
            Persistent Momentum is to its products what Anthropic is to Claude: the
            company that builds them. Each product stands alone, with its own brand,
            its own customers, and its own site. You can love the product without
            knowing we exist.
          </p>
          <p className="mt-4 text-base leading-relaxed text-mid">
            Anyone can build one product. The system that builds many is harder to
            copy than any single one — that system is pmOS, and it is the moat.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/8 bg-white/8 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-navy p-7">
              <p className="font-mono text-4xl font-semibold tracking-tight text-electric">
                {fact.figure}
              </p>
              <p className="mt-3 text-sm font-semibold text-white">{fact.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-mid">{fact.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
