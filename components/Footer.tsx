import Link from 'next/link';
import Image from 'next/image';

const columns: {
  heading: string;
  links: { href: string; label: string; external?: boolean }[];
}[] = [
  {
    heading: 'Products',
    links: [
      {
        href: 'https://recruiter.persistentmomentum.com',
        label: 'Persistent Recruiter',
        external: true,
      },
      {
        href: 'https://sales.persistentmomentum.com',
        label: 'Persistent Sales',
        external: true,
      },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/portfolio', label: 'Portfolio' },
      { href: '/careers', label: 'Careers' },
      { href: '/contact', label: 'Contact' },
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
        background: 'var(--color-bg-secondary)',
        borderTop: '1px solid var(--color-border)',
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
                style={{ color: 'var(--color-text)' }}
              >
                Persistent Momentum
              </span>
            </Link>
            <p
              className="mt-4 max-w-xs text-sm leading-relaxed"
              style={{ color: 'var(--color-text-muted)' }}
            >
              We build products. Each one stands alone.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading} className="sm:col-span-2">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{
                  color: 'var(--color-text-muted)',
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
                        className="transition-colors"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="transition-colors"
                        style={{ color: 'var(--color-text)' }}
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
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <p
            className="text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            &copy; {year} Persistent Momentum &middot; All rights reserved
          </p>
          <p
            className="text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            persistentmomentum.com
          </p>
        </div>
      </div>
    </footer>
  );
}
