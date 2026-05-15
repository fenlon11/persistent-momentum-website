import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { Sheet } from '@/components/blueprint';
import { products, statusMeta, categories } from '@/lib/products-data';

export const metadata: Metadata = {
  title: 'Portfolio — Persistent Momentum',
  description:
    'The Persistent Momentum portfolio. Mobile apps, web platforms, and AI-powered automation — each product on its own site, with its own brand.',
};

const bar = [
  { num: '01', label: 'One-line pitch' },
  { num: '02', label: 'Clear ICP' },
  { num: '03', label: 'Pricing model' },
  { num: '04', label: 'pmOS PRD' },
  { num: '05', label: 'Category fit' },
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-navy">
      {/* Header */}
      <section className="relative border-b border-white/8 bg-navy">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-36 sm:px-8 sm:pt-44">
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px flex-1 bg-white/12" />
            <span className="annotation-bright">Sheet A &middot; The portfolio</span>
          </div>

          <p className="annotation mt-12">The portfolio</p>
          <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Products we design, build, and ship.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-mid sm:text-lg">
            Each product is its own brand on its own site. You can love the
            product without knowing we exist — and that&apos;s the point. Use
            what you need; no bundles, no lock-in.
          </p>
        </div>
      </section>

      {/* Product schedule — detail rows */}
      <Sheet sheet="01" title="Product schedule" raised>
        <ol className="overflow-hidden border border-white/12">
          {products.map((p, i) => {
            const s = statusMeta[p.status];
            return (
              <li
                key={p.id}
                className={`relative grid gap-x-8 gap-y-5 px-6 py-8 sm:px-8 lg:grid-cols-[88px_minmax(0,1.4fr)_minmax(0,2fr)_160px] lg:items-start lg:gap-8 ${
                  i > 0 ? 'border-t border-white/12' : ''
                } bg-navy`}
              >
                {/* mark */}
                <span className="annotation-bright">
                  P-{String(i + 1).padStart(2, '0')}
                </span>

                {/* name + tagline + category */}
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-mid">
                    {p.category}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    {p.name}
                  </h2>
                  <p className="mt-1.5 text-sm font-medium text-ice">
                    {p.tagline}
                  </p>
                </div>

                {/* description + features */}
                <div>
                  <p className="text-sm leading-relaxed text-mid">
                    {p.description}
                  </p>
                  <ul className="mt-4 grid grid-cols-1 gap-y-1.5 sm:grid-cols-2 sm:gap-x-6">
                    {p.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-glow/85"
                      >
                        <span
                          aria-hidden
                          className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-electric"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* status + link */}
                <div className="flex flex-col items-start gap-3 lg:items-end">
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden
                      className={`h-1.5 w-1.5 rounded-full ${s.dot}`}
                    />
                    <span className="font-mono text-xs uppercase tracking-wider text-mid">
                      {s.label}
                    </span>
                  </span>
                  {p.externalUrl ? (
                    <a
                      href={p.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-electric transition-colors hover:text-ice"
                    >
                      Visit site
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 17L17 7M17 7H8M17 7v9"
                        />
                      </svg>
                    </a>
                  ) : (
                    <span className="annotation">Site &middot; in design</span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <p className="annotation mt-6">
          Honest count: 1 live, 1 in design. More shipping in 2026.
        </p>
      </Sheet>

      {/* Categories */}
      <Sheet sheet="02" title="Three categories">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-[2.25rem]">
              Every product fits one.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-mid">
              The three categories define what enters the portfolio. Anything
              that doesn&apos;t fit one of them doesn&apos;t get built.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="grid gap-px overflow-hidden border border-white/12 bg-white/12 sm:grid-cols-3">
              {categories.map((c, i) => (
                <div key={c.name} className="relative bg-navy p-6 sm:p-7">
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-2 w-2 border-l border-t border-electric/60"
                  />
                  <p className="font-mono text-xs tracking-widest text-electric">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-3 text-base font-semibold text-white">
                    {c.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-mid">
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Sheet>

      {/* The bar */}
      <Sheet sheet="03" title="The bar" raised>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-[2.25rem]">
              The bar a product clears before we build it.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-mid">
              Products that don&apos;t clear the bar get shelved early — that&apos;s
              the portfolio model working. The bar is encoded in the
              pre-build-foundation skill that gates every new build.
            </p>
          </div>
          <div className="lg:col-span-7">
            <ol className="grid grid-cols-1 gap-px overflow-hidden border border-white/12 bg-white/12 sm:grid-cols-5">
              {bar.map((b) => (
                <li key={b.num} className="bg-navy p-5">
                  <p className="font-mono text-xs tracking-widest text-electric">
                    {b.num}
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-snug text-white">
                    {b.label}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Sheet>

      {/* CTA */}
      <Sheet>
        <div className="relative border border-white/12 bg-navy-raised p-8 sm:p-10">
          <span
            aria-hidden
            className="absolute left-0 top-0 h-3 w-3 border-l border-t border-electric/60"
          />
          <span
            aria-hidden
            className="absolute right-0 bottom-0 h-3 w-3 border-b border-r border-electric/60"
          />
          <p className="annotation-bright mb-4">Investors, partners, press</p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Have a product idea or a partnership?
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-mid">
            The portfolio grows when a product clears the bar — a clear
            problem, a clear customer, a clear way to charge.
          </p>
          <Link
            href="/contact"
            className="group mt-7 inline-flex items-center gap-2 bg-electric px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1A4FE0]"
          >
            Talk to us
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </Sheet>

      <Footer />

      {/* tiny logo watermark for typography variety */}
      <span aria-hidden className="hidden">
        <Image src="/logo.png" alt="" width={1} height={1} />
      </span>
    </main>
  );
}
