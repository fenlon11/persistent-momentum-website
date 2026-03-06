import { products } from '@/lib/products-data';

const statusConfig: Record<string, { label: string; dotClass: string; borderClass: string; bgClass: string }> = {
  'building': {
    label: 'In Development',
    dotClass: 'bg-amber-400 animate-pulse',
    borderClass: 'border-amber-500/30 hover:border-amber-400/50',
    bgClass: 'from-amber-500/5 to-transparent',
  },
  'coming-soon': {
    label: 'Coming Soon',
    dotClass: 'bg-slate-400',
    borderClass: 'border-slate-700/30 hover:border-[#3E8BF5]/50',
    bgClass: 'from-[#3E8BF5]/5 to-transparent',
  },
  'active': {
    label: 'Live',
    dotClass: 'bg-emerald-400 animate-pulse',
    borderClass: 'border-emerald-500/30 hover:border-emerald-400/50',
    bgClass: 'from-emerald-500/5 to-transparent',
  },
};

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
            Products That
            <span className="text-[#3E8BF5]"> Deliver</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Standalone tools or add-ons to Persistent Sales — your AI-powered business platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {products.map((product) => {
            const config = statusConfig[product.status] || statusConfig['coming-soon'];
            return (
              <a
                key={product.id}
                href={`/products/${product.slug}`}
                className="group relative block"
              >
                <div className={`relative h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border ${config.borderClass} p-6 transition-all duration-500 overflow-hidden hover:scale-[1.02]`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.bgClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                  <div className="relative space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${product.gradient} bg-opacity-10`}>
                        <span className="text-2xl">{product.icon}</span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/30 border border-slate-600/30 text-xs font-medium text-slate-300">
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`}></span>
                        {config.label}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#3E8BF5] transition-colors">
                        {product.name}
                      </h3>
                      {product.isPrimary && (
                        <span className="text-xs text-[#3E8BF5] font-medium">Primary Platform</span>
                      )}
                    </div>

                    <p className="text-slate-400 leading-relaxed text-sm">
                      {product.tagline}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {product.features.slice(0, 4).map((feature) => (
                        <div key={feature.title} className="flex items-start gap-1.5 text-slate-300">
                          <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#3E8BF5]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs">{feature.title}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2 text-[#3E8BF5] text-sm font-medium group-hover:gap-3 transition-all">
                      Learn More
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
