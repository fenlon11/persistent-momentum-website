import Link from 'next/link';

const paths = [
  {
    href: '/contact',
    eyebrow: 'Partners & buyers',
    title: 'Work with us',
    detail: 'Have a product idea, a partnership, or a question about the portfolio? Start here.',
    cta: 'Get in touch',
  },
  {
    href: '/careers',
    eyebrow: 'Builders',
    title: 'Build with us',
    detail: 'Small team, fast cycles, real software shipped without six-month roadmap meetings.',
    cta: 'See open problems',
  },
];

export default function ClosingCTA() {
  return (
    <section className="bg-navy">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {paths.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="group rounded-xl border border-white/8 bg-navy-raised p-8 transition-colors hover:border-white/15"
            >
              <p className="eyebrow mb-5">{path.eyebrow}</p>
              <h3 className="text-xl font-semibold tracking-tight text-white">{path.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mid">{path.detail}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-electric transition-colors group-hover:text-ice">
                {path.cta}
                <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
