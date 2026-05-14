import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/8 bg-navy">
      {/* single quiet ambient glow — one accent, no pulsing orbs */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-50 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #1E5BFF55 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-36 text-center sm:px-8 sm:pt-44">
        <Image
          src="/logo.png"
          alt="Persistent Momentum"
          width={88}
          height={88}
          priority
          className="mx-auto mb-8 h-16 w-auto sm:h-20"
        />

        <p className="eyebrow mb-6">Portfolio Operator</p>

        <h1 className="text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[2.9rem]">
          We design, build, and ship{' '}
          <span className="text-electric">mobile apps</span>,{' '}
          <span className="text-electric">web platforms</span>, and{' '}
          <span className="text-electric">AI-powered automation</span>{' '}
          for your business.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-mid sm:text-lg">
          Each product stands alone. pmOS — our build system — is how we ship them.
          Persistent Momentum is the company that builds them; the product is what you meet.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="w-full rounded-lg bg-electric px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1A4FE0] sm:w-auto"
          >
            See what we make
          </Link>
          <Link
            href="/contact"
            className="w-full rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/5 sm:w-auto"
          >
            Work with us
          </Link>
        </div>
      </div>
    </section>
  );
}
