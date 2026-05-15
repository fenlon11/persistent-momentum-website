import Link from 'next/link';
import Image from 'next/image';

// Footer = drafting titleblock. Real metadata in cells, not decoration.
// Linkable site sections sit above the titleblock as columns.

const navColumns: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: 'The site',
    links: [
      { href: '/portfolio', label: 'Portfolio' },
      { href: '/pmos', label: 'pmOS' },
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
  const now = new Date();
  const year = now.getFullYear();
  const rev = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`;

  const titleblockCells: { label: string; value: string }[] = [
    { label: 'Project', value: 'Persistent Momentum' },
    { label: 'Drawn by', value: 'fenlon11' },
    { label: 'Sheet', value: '01 / 01' },
    { label: 'Issue', value: rev },
  ];

  return (
    <footer className="border-t border-white/10 bg-navy">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        {/* Identity + nav columns */}
        <div className="grid gap-12 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo.png"
                alt=""
                width={30}
                height={30}
                className="h-7 w-auto"
              />
              <span className="text-[15px] font-semibold tracking-tight text-white">
                Persistent Momentum
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mid">
              A portfolio operator. We design, build, and ship mobile apps, web
              platforms, and AI-powered automation. pmOS is the build system that
              makes it work.
            </p>
            <p className="annotation mt-6">Each product stands alone</p>
          </div>

          {navColumns.map((col) => (
            <div key={col.heading} className="sm:col-span-3">
              <p className="annotation mb-4">{col.heading}</p>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-mid transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Titleblock — drafting metadata grid */}
        <div className="mt-14 grid grid-cols-2 overflow-hidden border border-white/15 sm:grid-cols-4">
          {titleblockCells.map((cell, i) => (
            <div
              key={cell.label}
              className={`px-5 py-4 ${i > 0 ? 'border-l border-white/15' : ''} ${
                i >= 2 ? 'border-t border-white/15 sm:border-t-0' : ''
              } ${i === 2 ? 'border-l-0 sm:border-l' : ''}`}
            >
              <p className="annotation mb-1.5">{cell.label}</p>
              <p className="font-mono text-xs leading-tight text-glow">
                {cell.value}
              </p>
            </div>
          ))}
        </div>

        {/* Copyright + tagline */}
        <div className="mt-6 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] uppercase tracking-wider text-mid/70">
            &copy; {year} Persistent Momentum &middot; All rights reserved
          </p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-mid/70">
            Built with pmOS
          </p>
        </div>
      </div>
    </footer>
  );
}
