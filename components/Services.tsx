export default function Services() {
  const services = [
    {
      title: 'App Development',
      description: 'From concept to App Store. Mobile and web apps built with modern frameworks like React Native, Next.js, and Expo.',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-500',
      bullets: [
        'iOS & Android with React Native + Expo',
        'Web apps with Next.js & Vercel',
        'Supabase backend & authentication',
        'App Store submission & deployment',
      ],
    },
    {
      title: 'AI & Automation',
      description: 'Custom AI integrations, Cloudflare Workers, and workflow automation that runs 24/7 without human intervention.',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-cyan-500 to-blue-500',
      bullets: [
        'AI-powered features & integrations',
        'Cloudflare Workers & edge computing',
        'n8n & Make workflow automation',
        'API integrations & data pipelines',
      ],
    },
    {
      title: 'Marketing Systems',
      description: 'Automated content pipelines, social media automation, and SEO-optimized websites that generate leads on autopilot.',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      gradient: 'from-blue-500 to-indigo-500',
      bullets: [
        'SEO-optimized websites & landing pages',
        'Automated content pipelines',
        'Social media automation',
        'Analytics & conversion tracking',
      ],
    },
  ];

  return (
    <section id="services" className="relative py-16 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3E8BF5]/10 border border-[#3E8BF5]/20 backdrop-blur-sm mb-6">
            <span className="text-sm text-[#3E8BF5] font-medium">What We Do</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Services That
            <span className="text-[#3E8BF5]"> Deliver</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            End-to-end solutions from idea to revenue
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div key={index} className="group relative">
              <div className="relative h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-[#3E8BF5]/50 transition-all duration-500 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                <div className="relative space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${service.gradient}`}>
                      <div className="text-white">{service.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#3E8BF5] transition-colors">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-slate-400 leading-relaxed text-sm">
                    {service.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    {service.bullets.map((bullet, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-300">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#3E8BF5]" fill="currentColor" viewBox="0 0 20 20">
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3E8BF5] text-white font-semibold text-sm rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-[#3E8BF5]/50 transition-all duration-300"
          >
            Start a Project
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
