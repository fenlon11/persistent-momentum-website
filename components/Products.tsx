export default function Products() {
  return (
    <section id="products" className="relative py-24 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3E8BF5]/10 border border-[#3E8BF5]/20 backdrop-blur-sm mb-6">
            <span className="text-sm text-[#3E8BF5] font-medium">Our Products</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Apps That
            <span className="text-[#3E8BF5]"> Deliver</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Professional utility apps built for people who work with their hands and their heads
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Rabbit Golf — Live */}
          <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-emerald-500/30 p-8 hover:border-emerald-400/50 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex p-3 rounded-xl bg-emerald-500/10">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-400">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Live in App Store
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                Rabbit Golf
              </h3>

              <p className="text-slate-400 leading-relaxed text-sm">
                Golf scoring and game tracking app. Keep score, track your games, and play with friends.
              </p>

              <a
                href="https://apps.apple.com/app/rabbit-golf/id6740487777"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium text-sm transition-colors group/link"
              >
                View on App Store
                <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Coming Soon Card 1 */}
          <div className="group relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-2xl border border-slate-700/30 border-dashed p-8 transition-all duration-500">
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex p-3 rounded-xl bg-slate-700/30">
                  <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-700/30 border border-slate-600/30 text-xs font-medium text-slate-500">
                  Coming Soon
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-500">
                Next App
              </h3>

              <p className="text-slate-600 leading-relaxed text-sm">
                Another professional utility app in the pipeline. Stay tuned.
              </p>
            </div>
          </div>

          {/* Coming Soon Card 2 */}
          <div className="group relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-2xl border border-slate-700/30 border-dashed p-8 transition-all duration-500">
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex p-3 rounded-xl bg-slate-700/30">
                  <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-700/30 border border-slate-600/30 text-xs font-medium text-slate-500">
                  Coming Soon
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-500">
                More Coming
              </h3>

              <p className="text-slate-600 leading-relaxed text-sm">
                We ship fast. More professional tools on the way.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
