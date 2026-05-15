'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

type NavLink = {
  href: string;
  label: string;
  external?: boolean;
};

// Two product domains get top-billing in the parent nav.
// No "pmOS" link — pmOS is internal.
// Portfolio + Careers removed from nav 2026-05-15 (pages still exist; just
// not surfaced in the chrome).
const links: NavLink[] = [
  {
    href: 'https://recruiter.persistentmomentum.com',
    label: 'Recruiter',
    external: true,
  },
  {
    href: 'https://sales.persistentmomentum.com',
    label: 'Sales',
    external: true,
  },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Dashboard has its own chrome — don't render the public nav over it.
  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
        {/* Logo + wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 flex-shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/logo.png"
            alt=""
            width={44}
            height={44}
            priority
            style={{ height: '40px', width: 'auto' }}
          />
          <span
            className="font-semibold text-base tracking-tight hidden sm:inline"
            style={{ color: 'var(--color-text)' }}
          >
            Persistent Momentum
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((link) => {
            const active = !link.external && pathname === link.href;
            const className =
              'text-sm font-medium transition-colors';
            const sharedStyle = {
              color: active ? 'var(--color-text)' : 'var(--color-text-muted)',
            };
            return link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                style={sharedStyle}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={className}
                style={sharedStyle}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right-side contact CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="text-sm font-semibold text-white px-4 py-2 transition-colors hidden sm:inline-block"
            style={{
              background: 'var(--color-primary)',
              borderRadius: 'var(--radius)',
            }}
          >
            Contact
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 md:hidden"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.98)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <div className="space-y-1 px-6 py-4">
            {links.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-sm font-medium"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-sm font-medium"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {link.label}
                </Link>
              ),
            )}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 block py-2.5 text-center text-sm font-semibold text-white"
              style={{
                background: 'var(--color-primary)',
                borderRadius: 'var(--radius)',
              }}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
