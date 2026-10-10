import NewsletterSignup from '@/components/NewsletterSignup';

// Premium deep-navy hero — BRAND.md "deep-space blue + electric accent".
// A single electric-blue accent, an ice-blue radial glow, generous space.
export default function Hero() {
  return (
    <section
      className="relative overflow-hidden px-6 pt-16 pb-20 md:pt-28 md:pb-32"
      style={{
        background:
          'linear-gradient(160deg, var(--color-navy) 0%, var(--color-navy-2) 100%)',
      }}
    >
      {/* Electric glow — echoes the glossy P-mark's glowing edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(30,91,255,0.35) 0%, rgba(30,91,255,0) 70%)',
          filter: 'blur(8px)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-30%] left-[-8%] h-[380px] w-[380px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(168,197,255,0.14) 0%, rgba(168,197,255,0) 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <span
          className="inline-block text-xs font-semibold uppercase tracking-widest px-3.5 py-1.5 mb-6 md:mb-8"
          style={{
            color: 'var(--color-ice)',
            background: 'rgba(30,91,255,0.14)',
            border: '1px solid rgba(168,197,255,0.28)',
            borderRadius: '999px',
            letterSpacing: '0.14em',
          }}
        >
          AI News &amp; Updates
        </span>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 md:mb-7 leading-[1.08] md:leading-[1.03] max-w-4xl"
          style={{
            color: 'var(--color-glow-white)',
            letterSpacing: '-0.025em',
          }}
        >
          What the AI companies actually shipped.
        </h1>

        <p
          className="text-base md:text-xl mb-8 md:mb-10 max-w-2xl leading-relaxed"
          style={{ color: 'rgba(230,238,255,0.72)' }}
        >
          What it means for your business, and one thing to try. Every item
          links to its primary source.
        </p>

        <NewsletterSignup />
      </div>
    </section>
  );
}
