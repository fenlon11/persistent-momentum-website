export default function Services() {
  const categories = [
    {
      title: 'Mobile Apps',
      description:
        'Native iOS and Android products built on Expo and React Native. From first screen through App Store submission.',
      bullets: [
        'iOS & Android on Expo / React Native',
        'Supabase auth, data, and real-time sync',
        'RevenueCat for subscriptions',
        'App Store submission + review management',
      ],
    },
    {
      title: 'Web Platforms',
      description:
        'Next.js SaaS products deployed on Vercel with Supabase and Stripe. Dashboards, tools, workflow apps — shipped fast.',
      bullets: [
        'Next.js 16 + Tailwind on Vercel',
        'Supabase with RLS and Edge Functions',
        'Stripe billing + customer portal',
        'Playwright smoke tests before launch',
      ],
    },
    {
      title: 'AI-Powered Automation',
      description:
        'Workflow, content, and operations automation built on the Claude API. Runs on Cloudflare Workers and Supabase.',
      bullets: [
        'Claude API for reasoning and generation',
        'Cloudflare Workers for scheduled jobs',
        'Content + rendering pipelines',
        'Analytics and guardrails included',
      ],
    },
  ];

  return (
    <section id="services" className="relative py-16 bg-gradient-to-b from-slate-900 to-[#07112C] overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E5BFF]/10 border border-[#1E5BFF]/20 backdrop-blur-sm mb-6">
            <span className="text-sm text-[#1E5BFF] font-medium">Three categories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            What we
            <span className="text-[#1E5BFF]"> build</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Every product we ship lands in one of three categories.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((category) => (
            <div key={category.title} className="group relative">
              <div className="relative h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-[#1E5BFF]/50 transition-all duration-500 overflow-hidden">
                <div className="relative space-y-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#1E5BFF] transition-colors">
                    {category.title}
                  </h3>

                  <p className="text-slate-400 leading-relaxed text-sm">
                    {category.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    {category.bullets.map((bullet, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-300">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#1E5BFF]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E5BFF] text-white font-semibold text-sm rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-[#1E5BFF]/50 transition-all duration-300"
          >
            Work with us
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
