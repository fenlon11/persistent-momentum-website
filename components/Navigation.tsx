'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/pmos', label: 'pmOS' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Dashboard has its own chrome — don't render the public nav over it.
  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-navy/85 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo + wordmark + role label */}
          <Link
            href="/"
            className="group flex items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <Image
              src="/logo.png"
              alt=""
              width={30}
              height={30}
              priority
              className="h-7 w-auto"
            />
            <span className="text-[15px] font-semibold tracking-tight text-white">
              Persistent Momentum
            </span>
            <span aria-hidden className="hidden h-3 w-px bg-white/15 md:inline-block" />
            <span aria-hidden className="annotation hidden md:inline-block">
              Portfolio Operator
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-9 md:flex">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors ${
                    active ? 'text-white' : 'text-mid hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute -bottom-[22px] left-0 right-0 h-px bg-electric"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-mid transition-colors hover:text-white md:hidden"
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
        <div className="border-t border-white/8 bg-navy/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-5 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-2.5 text-sm font-medium transition-colors ${
                  pathname === link.href ? 'text-white' : 'text-mid hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
