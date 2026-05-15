import Link from 'next/link';
import { Sheet } from './blueprint';
import { products, statusMeta } from '@/lib/products-data';

export default function PortfolioBoard() {
  return (
    <Sheet sheet="04 / 06" title="The portfolio" raised>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="max-w-2xl text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-[2.25rem]">
          Each product stands alone.
        </h2>
        <Link
          href="/portfolio"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-electric transition-colors hover:text-ice"
        >
          Full portfolio
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-mid sm:text-lg">
        Each product is its own brand on its own site, with its own customers.
        You probably want the product, not us — the links go to where the work
        actually lives.
      </p>

      {/* Schedule — drafting-style table */}
      <div className="mt-12 overflow-hidden border border-white/12">
        {/* Header row */}
        <div className="hidden grid-cols-[64px_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,2fr)_140px] gap-6 border-b border-white/12 bg-navy/60 px-6 py-3 md:grid">
          <span className="annotation">Mark</span>
          <span className="annotation">Product</span>
          <span className="annotation">Category</span>
          <span className="annotation">One-line</span>
          <span className="annotation text-right">Status</span>
        </div>

        {products.map((p, i) => {
          const s = statusMeta[p.status];
          const Inner = (
            <>
              <span className="annotation-bright self-start md:self-center">
                P-{String(i + 1).padStart(2, '0')}
              </span>
              <div className="md:order-none">
                <p className="text-base font-semibold text-white">{p.name}</p>
                <p className="mt-1 text-sm text-ice">{p.tagline}</p>
              </div>
              <p className="text-sm text-mid md:order-none">
                {p.category}
              </p>
              <p className="text-sm leading-relaxed text-mid md:order-none">
                {p.description}
              </p>
              <div className="flex items-center justify-start gap-2 md:justify-end">
                <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                <span className="font-mono text-xs uppercase tracking-wider text-mid">
                  {s.label}
                </span>
              </div>
            </>
          );

          const baseClass =
            'grid grid-cols-2 gap-x-6 gap-y-3 px-6 py-6 md:grid-cols-[64px_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,2fr)_140px] md:items-center md:gap-6';
          const borderClass =
            i > 0 ? 'border-t border-white/12' : '';

          return p.externalUrl ? (
            <a
              key={p.id}
              href={p.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative block ${baseClass} ${borderClass} bg-navy transition-colors hover:bg-navy-raised`}
            >
              {Inner}
              {/* link affordance */}
              <span className="annotation absolute right-6 -bottom-3 hidden translate-y-full bg-navy-raised px-1 text-electric group-hover:inline-block md:block">
                {p.externalUrl.replace('https://', '')} →
              </span>
            </a>
          ) : (
            <div
              key={p.id}
              className={`${baseClass} ${borderClass} bg-navy`}
            >
              {Inner}
            </div>
          );
        })}
      </div>

      {/* Note under the schedule */}
      <p className="annotation mt-6">
        Honest count: 1 live, 1 in design. More shipping in 2026.
      </p>
    </Sheet>
  );
}
