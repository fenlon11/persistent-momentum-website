export default function PmosShowcase() {
  const features = [
    {
      icon: '🧠',
      title: '3-Tier Memory',
      description:
        'Curated facts, session logs, and semantic vector search. Your AI never forgets context.',
    },
    {
      icon: '⚡',
      title: '18 Skills',
      description:
        'Research, content, code review, deployment, and more. Pre-built workflows that just work.',
    },
    {
      icon: '🛡️',
      title: 'Guardrails',
      description:
        'Automatic protection against destructive operations. Safe autonomous execution.',
    },
    {
      icon: '📊',
      title: 'Real-time Telemetry',
      description:
        'Track every skill invocation, memory capture, and decision. Full observability.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-950" id="pmos">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm mb-6">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-emerald-400 font-medium">Operating System</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            pmOS: Your AI Operating System
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            The brain behind Persistent Momentum. Skills, memory, and guardrails that
            let AI agents operate autonomously while staying safe.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/30 hover:bg-slate-800/80 transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem value="18" label="Skills" />
          <StatItem value="3" label="AI Agents" />
          <StatItem value="3-Tier" label="Memory System" />
          <StatItem value="24/7" label="Autonomous" />
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">
            Built for solo entrepreneurs running AI-powered businesses
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors duration-300"
          >
            View Dashboard
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-center">
      <div className="text-2xl font-bold text-emerald-400">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}
