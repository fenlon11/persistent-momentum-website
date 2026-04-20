export default function CompanyMission() {
  const pillars = [
    {
      title: 'Solve real problems',
      description:
        'Every product starts with a frustration we\'ve seen firsthand. If the problem isn\'t painful enough to complain about, it\'s not worth building for.',
    },
    {
      title: 'Ship fast, compound faster',
      description:
        'We get working software into customers\' hands quickly, then improve from real use. Every product makes the next one cheaper to ship.',
    },
    {
      title: 'AI where it matters',
      description:
        'We use AI to automate the tedious parts — data entry, follow-ups, scheduling, content — so operators can focus on the work that actually needs them.',
    },
    {
      title: 'Built for independence',
      description:
        'Each product stands alone. No forced bundles, no lock-in. Use what you need. Add more when you\'re ready.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900/50 to-[#07112C]" id="about">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E5BFF]/10 border border-[#1E5BFF]/20 backdrop-blur-sm mb-6">
            <span className="text-sm text-[#1E5BFF] font-medium">How we work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why we build
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Persistent Momentum is a portfolio operator. We design, build, and ship
            mobile apps, web platforms, and AI-powered automation for businesses that
            want modern tools that ship.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-[#1E5BFF]/30 hover:bg-slate-800/80 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom message */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 max-w-2xl mx-auto">
            Every product stands on its own. Start with the one that solves the
            loudest problem. Add more when you&apos;re ready.
          </p>
        </div>
      </div>
    </section>
  );
}
