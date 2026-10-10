import Link from 'next/link';
import Image from 'next/image';

const columns: {
  heading: string;
  links: { href: string; label: string; external?: boolean }[];
}[] = [
  {
    heading: 'Read',
    links: [
      { href: '/newsletter', label: 'Newsletter' },
      { href: '/news', label: 'News' },
      { href: '/guides', label: 'Guides' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/consulting', label: 'Consulting' },
      { href: '/about', label: 'About' },
      { href: '/editorial-policy', label: 'Editorial policy' },
      { href: '/corrections', label: 'Corrections' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background:
          'linear-gradient(160deg, var(--color-navy) 0%, var(--color-navy-2) 100%)',
        color: 'var(--color-glow-white)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-12">
          <div className="sm:col-span-5">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt=""
                width={32}
                height={32}
                style={{ height: 28, width: 'auto' }}
              />
              <span
                className="font-semibold text-base tracking-tight"
                style={{ color: 'var(--color-glow-white)' }}
              >
                Persistent Momentum, LLC
              </span>
            </Link>
            <p
              className="mt-4 max-w-xs text-sm leading-relaxed"
              style={{ color: 'rgba(230,238,255,0.62)' }}
            >
              AI news for business operators, plus business and AI systems
              consulting.
            </p>
            <p className="mt-4 text-sm">
              <a
                href="mailto:info@persistentmomentum.com"
                className="underline-offset-4 hover:underline"
                style={{ color: 'var(--color-ice)' }}
              >
                info@persistentmomentum.com
              </a>
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading} className="sm:col-span-2">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{
                  color: 'rgba(168,197,255,0.7)',
                  letterSpacing: '0.12em',
                }}
              >
                {col.heading}
              </p>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) =>
                  l.external ? (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:underline underline-offset-4"
                        style={{ color: 'var(--color-glow-white)' }}
                      >
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="transition-colors hover:underline underline-offset-4"
                        style={{ color: 'var(--color-glow-white)' }}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-12 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: '1px solid rgba(168,197,255,0.16)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(230,238,255,0.55)' }}>
            &copy; {year} Persistent Momentum, LLC &middot; All rights reserved
          </p>
          <p className="text-xs" style={{ color: 'rgba(230,238,255,0.55)' }}>
            Our products:{' '}
            <a
              href="https://workforce.persistentmomentum.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:underline"
            >
              Persistent Workforce
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
