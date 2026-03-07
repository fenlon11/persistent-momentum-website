export default function CompanyMission() {
  const pillars = [
    {
      title: 'Solve Real Problems',
      description:
        'Every product starts with a frustration we\'ve seen firsthand. If the problem isn\'t painful enough to complain about, it\'s not worth building for.',
    },
    {
      title: 'Ship Fast, Iterate Faster',
      description:
        'We get working software into users\' hands quickly, then improve based on real feedback — not assumptions.',
    },
    {
      title: 'AI Where It Matters',
      description:
        'We use AI to automate the tedious parts — data entry, follow-ups, scheduling — so professionals can focus on relationships.',
    },
    {
      title: 'Built for Independence',
      description:
        'Each product works on its own. No forced bundles, no lock-in. Use what you need, add more when you\'re ready.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-950" id="about">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm mb-6">
            <span className="text-sm text-emerald-400 font-medium">Our Mission</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why We Build
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Persistent Momentum builds software for service professionals — the people
            who are too busy doing great work to wrestle with bad tools. We make the
            tools that get out of the way and let you focus on what you do best.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/30 hover:bg-slate-800/80 transition-all duration-300"
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
            Every Persistent product is designed to work independently or together.
            Start with the one that solves your biggest headache — expand when you&apos;re ready.
          </p>
        </div>
      </div>
    </section>
  );
}
