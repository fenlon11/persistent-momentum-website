import Link from 'next/link';
import { products, statusMeta, categories } from '@/lib/products-data';

export default function PortfolioProducts() {
  return (
    <section id="products" className="border-b border-white/8 bg-navy-raised">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow mb-5">What we make</p>
            <h2 className="text-balance text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">
              The portfolio
            </h2>
            <p className="mt-4 text-base leading-relaxed text-mid">
              Each product is its own brand on its own site. Use what you need —
              there are no bundles and no lock-in.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-electric transition-colors hover:text-ice"
          >
            All products &rarr;
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {products.map((product) => {
            const status = statusMeta[product.status];
            return (
              <div
                key={product.id}
                className="flex flex-col rounded-xl border border-white/8 bg-navy p-7 transition-colors hover:border-white/15"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-mid">
                    {product.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-mid">
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-ice">{product.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-mid">{product.description}</p>

                <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-glow/80">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-electric" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex-1" />
                {product.externalUrl ? (
                  <a
                    href={product.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-electric transition-colors hover:text-ice"
                  >
                    {product.externalUrl.replace('https://', '')}
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H8M17 7v9" />
                    </svg>
                  </a>
                ) : (
                  <span className="font-mono text-xs uppercase tracking-wider text-mid">
                    Site coming soon
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* three-category strip */}
        <div className="mt-5 grid gap-px overflow-hidden rounded-xl border border-white/8 bg-white/8 sm:grid-cols-3">
          {categories.map((category) => (
            <div key={category.name} className="bg-navy p-6">
              <p className="text-sm font-semibold text-white">{category.name}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-mid">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
