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
    title: `${product.name} — Persistent Momentum`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const statusLabel =
    product.status === 'building'
      ? 'In Development'
      : product.status === 'active'
        ? 'Live'
        : 'Coming Soon';

  const statusDot =
    product.status === 'building'
      ? 'bg-amber-400 animate-pulse'
      : product.status === 'active'
        ? 'bg-emerald-400 animate-pulse'
        : 'bg-slate-400';

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/30 mb-6">
            <span className={`w-2 h-2 rounded-full ${statusDot}`}></span>
            <span className="text-sm text-slate-300 font-medium">{statusLabel}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            {product.name}
          </h1>

          <p className="text-xl text-[#3E8BF5] font-medium mb-4">{product.tagline}</p>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            {product.description}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/products/${product.slug}/pricing`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#3E8BF5] text-white font-semibold rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-[#3E8BF5]/50 transition-all duration-300"
            >
              View Pricing
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300"
            >
              Browse Agents
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-12">What&apos;s Included</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {product.features.map((feature) => (
            <div
              key={feature.title}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-[#3E8BF5]/30 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Add-on messaging */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-3">
            {product.isPrimary
              ? 'The Platform Other Products Plug Into'
              : 'Works Standalone or as an Add-on'}
          </h3>
          <p className="text-slate-400 mb-6">
            {product.isPrimary
              ? 'Persistent Sales is the foundation. Marketing, Operations, and Recruiter all connect seamlessly as add-ons — or run independently.'
              : `${product.name} works great on its own. Need more power? Plug it into Persistent Sales for unified contacts, pipelines, and analytics.`}
          </p>
          {!product.isPrimary && (
            <Link
              href="/products/persistent-sales"
              className="inline-flex items-center gap-2 text-[#3E8BF5] font-medium hover:gap-3 transition-all"
            >
              Learn about Persistent Sales
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <Link
          href={`/products/${product.slug}/pricing`}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#3E8BF5] text-white font-semibold text-lg rounded-xl hover:scale-105 hover:shadow-2xl hover:shadow-[#3E8BF5]/50 transition-all duration-300"
        >
          See Pricing Plans
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </section>
    </main>
  );
}
