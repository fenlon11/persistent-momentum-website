import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { products, statusMeta, categories } from '@/lib/products-data';

export const metadata: Metadata = {
  title: 'Products — Persistent Momentum',
  description:
    'The Persistent Momentum portfolio — mobile apps, web platforms, and AI-powered automation. Each product stands alone on its own site.',
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-navy">
      {/* header */}
      <section className="border-b border-white/8 bg-navy">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-36 sm:px-8 sm:pt-44">
          <p className="eyebrow mb-5">The portfolio</p>
          <h1 className="max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Products we design, build, and ship.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mid">
            Every product is its own brand on its own site, with its own customers.
            Persistent Momentum is the company that builds them — use what you need,
            no bundles, no lock-in.
          </p>
        </div>
      </section>

      {/* products */}
      <section className="border-b border-white/8 bg-navy-raised">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="grid gap-5 md:grid-cols-2">
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

                  <h2 className="mt-4 text-xl font-semibold tracking-tight text-white">
                    {product.name}
                  </h2>
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
                      Visit {product.externalUrl.replace('https://', '')}
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
        </div>
      </section>

      {/* categories */}
      <section className="border-b border-white/8 bg-navy">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <p className="eyebrow mb-5">Three categories</p>
          <h2 className="max-w-xl text-balance text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">
            Every product fits one of three categories.
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-white/8 bg-white/8 sm:grid-cols-3">
            {categories.map((category) => (
              <div key={category.name} className="bg-navy p-7">
                <p className="text-base font-semibold text-white">{category.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-mid">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="bg-navy">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="rounded-xl border border-white/8 bg-navy-raised p-8 sm:p-10">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Have a product idea or a partnership?
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-mid">
              The portfolio grows when a product passes the bar — a clear problem, a
              clear customer, a clear way to charge.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-lg bg-electric px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1A4FE0]"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
