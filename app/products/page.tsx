import { Metadata } from 'next';
import Link from 'next/link';
import { products } from '@/lib/products-data';

export const metadata: Metadata = {
  title: 'Products — Persistent Momentum',
  description: 'Business tools for service professionals. CRM, marketing, operations, and recruiting — standalone or integrated.',
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Our <span className="text-[#3E8BF5]">Products</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Each product works on its own or plugs into Persistent Sales as an add-on.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-6 hover:border-[#3E8BF5]/50 hover:scale-[1.02] transition-all duration-300"
            >
              <h2 className="text-xl font-bold text-white group-hover:text-[#3E8BF5] transition-colors mb-3">
                {product.name}
              </h2>
              <p className="text-sm text-slate-400 mb-4">{product.tagline}</p>
              <span className="text-[#3E8BF5] text-sm font-medium">Learn more →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
