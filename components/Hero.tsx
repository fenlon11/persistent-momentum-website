import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { num: '01', label: 'Mobile apps' },
  { num: '02', label: 'Web platforms' },
  { num: '03', label: 'AI automation' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/8 bg-navy">
      {/* Single quiet ambient glow — restrained, off-center, no pulse */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[10%] top-[-20%] h-[420px] w-[820px] rounded-full opacity-40 blur-[140px]"
        style={{
          background:
            'radial-gradient(circle, rgba(30, 91, 255, 0.4) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-36 sm:px-8 sm:pt-44">
        {/* Sheet header — establishes the metaphor on first paint */}
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            priority
            className="h-8 w-auto"
          />
          <span aria-hidden className="h-px flex-1 bg-white/12" />
          <span className="annotation-bright">Sheet 01 / 06</span>
        </div>

        {/* Top label */}
        <p className="annotation mt-12">
          Persistent Momentum &middot; Established 2026
        </p>

        {/* Headline — left-aligned, structural */}
        <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
          A <span className="text-electric">portfolio operator</span>.
          <br className="hidden sm:block" />
          <span className="text-glow">
            {' '}We design, build, and ship mobile apps, web platforms, and
            AI-powered automation.
          </span>
        </h1>

        {/* Supporting paragraph */}
        <p className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-mid sm:text-lg">
          Persistent Momentum is to its products what Anthropic is to Claude —
          the company that builds them; the product is what you meet.{' '}
          <span className="text-glow">pmOS</span> is the build system that makes
          it work.
        </p>

        {/* CTAs — holdco language, not customer language */}
        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Link
            href="/portfolio"
            className="group inline-flex w-full items-center justify-center gap-2 bg-electric px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1A4FE0] sm:w-auto"
          >
            The portfolio
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
          <Link
            href="/pmos"
            className="group inline-flex w-full items-center justify-center gap-2 border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-electric/70 hover:bg-white/[0.03] sm:w-auto"
          >
            How pmOS works
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>

        {/* Schematic strip — three categories, drafting-style stations */}
        <div className="relative mt-20 pb-20 sm:mt-28 sm:pb-28">
          <span aria-hidden className="annotation absolute -top-6 left-0">
            Product categories
          </span>
          <div className="grid gap-px border border-white/12 bg-white/12 sm:grid-cols-3">
            {categories.map((c) => (
              <div
                key={c.num}
                className="group relative bg-navy px-6 py-7 transition-colors hover:bg-navy-raised"
              >
                {/* corner ticks */}
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-2 w-2 border-l border-t border-electric/60"
                />
                <span
                  aria-hidden
                  className="absolute right-0 bottom-0 h-2 w-2 border-b border-r border-electric/60"
                />
                <p className="font-mono text-xs tracking-widest text-electric">
                  {c.num}
                </p>
                <p className="mt-3 text-base font-semibold text-white">
                  {c.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
