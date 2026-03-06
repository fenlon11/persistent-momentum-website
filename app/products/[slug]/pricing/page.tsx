import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { products, getProductBySlug } from '@/lib/products-data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Not Found' };
  return {
    title: `${product.name} Pricing — Persistent Momentum`,
    description: `Pricing plans for ${product.name}. ${product.tagline}`,
  };
}

export default async function PricingPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {product.name}
        </Link>

        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          {product.name} <span className="text-[#3E8BF5]">Pricing</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          {product.tagline}. Choose the plan that fits your needs.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {product.pricing.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border p-6 transition-all duration-300 ${
                tier.highlighted
                  ? 'border-[#3E8BF5]/50 scale-[1.02] shadow-xl shadow-[#3E8BF5]/10'
                  : 'border-slate-700/30 hover:border-slate-600/50'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#3E8BF5] text-white text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">{tier.name}</h3>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  {tier.period && (
                    <span className="text-slate-400 text-sm">{tier.period}</span>
                  )}
                </div>

                <p className="text-sm text-slate-400">{tier.description}</p>

                <div className="border-t border-slate-700/50 pt-4 space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#3E8BF5]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  disabled
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    tier.highlighted
                      ? 'bg-[#3E8BF5] text-white opacity-75 cursor-not-allowed'
                      : 'bg-slate-700/50 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add-on note */}
      {!product.isPrimary && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm">
              <span className="text-white font-medium">Already using Persistent Sales?</span>{' '}
              Add {product.shortName} as an add-on for seamless CRM integration.
            </p>
          </div>
        </section>
      )}

      {/* Back link */}
      <section className="py-12 px-4 text-center">
        <Link
          href="/products"
          className="text-[#3E8BF5] text-sm font-medium hover:underline"
        >
          ← View All Products
        </Link>
      </section>
    </main>
  );
}
