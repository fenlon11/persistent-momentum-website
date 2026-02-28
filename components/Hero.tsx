export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#3E8BF5]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-[#3E8BF5]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#3E8BF5]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3E8BF5]/10 border border-[#3E8BF5]/20 backdrop-blur-sm">
            <div className="w-2 h-2 bg-[#3E8BF5] rounded-full animate-pulse"></div>
            <span className="text-sm text-[#3E8BF5] font-medium">Software Studio</span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <img src="/logo.png" alt="Persistent Momentum" className="w-20 h-20 sm:w-24 sm:h-24" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Persistent
              <br />
              <span className="text-[#3E8BF5]">Momentum</span>
            </h1>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            We Build Apps That <span className="text-[#3E8BF5]">Make Money</span>
          </h2>

          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Professional utility apps for service professionals.
            <span className="text-[#3E8BF5] font-medium"> From idea to App Store, powered by AI.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
            <a
              href="#products"
              className="group relative px-8 py-4 bg-[#3E8BF5] text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#3E8BF5]/50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                See Our Work
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-[#3E8BF5]/80 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>

            <a
              href="#contact"
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-[#3E8BF5]/50 transition-all duration-300"
            >
              Work With Us
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-[#3E8BF5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
