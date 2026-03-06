'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const productLinks = [
  { href: '/products/persistent-sales', label: 'Persistent Sales', icon: '💼' },
  { href: '/products/persistent-marketing', label: 'Persistent Marketing', icon: '📣' },
  { href: '/products/persistent-operations', label: 'Persistent Operations', icon: '⚙️' },
  { href: '/products/persistent-recruiter', label: 'Persistent Recruiter', icon: '🎯' },
];

const links = [
  { href: '/', label: 'Home' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isProductPage = pathname.startsWith('/products');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Persistent Momentum" className="w-8 h-8" />
            <span className="text-lg font-bold">
              <span className="text-white">Persistent</span>
              <span className="text-[#3E8BF5]"> Momentum</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/' ? 'text-[#3E8BF5]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Home
            </Link>

            {/* Products dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isProductPage ? 'text-[#3E8BF5]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Products
                <svg className={`w-3.5 h-3.5 transition-transform ${productsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {productsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                  {productLinks.map((product) => (
                    <Link
                      key={product.href}
                      href={product.href}
                      onClick={() => setProductsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        pathname === product.href
                          ? 'text-[#3E8BF5] bg-[#3E8BF5]/10'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span>{product.icon}</span>
                      {product.label}
                    </Link>
                  ))}
                  <div className="border-t border-slate-700/50">
                    <Link
                      href="/products"
                      onClick={() => setProductsOpen(false)}
                      className="block px-4 py-3 text-xs text-slate-500 hover:text-[#3E8BF5] transition-colors"
                    >
                      View All Products →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {links.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-[#3E8BF5]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-sm font-medium transition-colors ${
                pathname === '/' ? 'text-[#3E8BF5]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Home
            </Link>

            {/* Mobile products sub-menu */}
            <button
              onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
              className={`flex items-center justify-between w-full py-2 text-sm font-medium transition-colors ${
                isProductPage ? 'text-[#3E8BF5]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Products
              <svg className={`w-3.5 h-3.5 transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {mobileProductsOpen && (
              <div className="pl-4 space-y-1">
                {productLinks.map((product) => (
                  <Link
                    key={product.href}
                    href={product.href}
                    onClick={() => { setMobileOpen(false); setMobileProductsOpen(false); }}
                    className={`flex items-center gap-2 py-2 text-sm transition-colors ${
                      pathname === product.href ? 'text-[#3E8BF5]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{product.icon}</span>
                    {product.label}
                  </Link>
                ))}
              </div>
            )}

            {links.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors ${
                  pathname === link.href ? 'text-[#3E8BF5]' : 'text-slate-400 hover:text-white'
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
