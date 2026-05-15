'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';

interface DashboardLoginProps {
  onAuthenticated: () => void;
}

export default function DashboardLogin({ onAuthenticated }: DashboardLoginProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (res.ok) {
        onAuthenticated();
      } else {
        setError('Invalid PIN');
        setPin('');
      }
    } catch {
      setError('Connection error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-5">
      <div className="relative w-full max-w-sm border border-white/12 bg-navy-raised p-8">
        {/* corner ticks */}
        <span
          aria-hidden
          className="absolute left-0 top-0 h-3 w-3 border-l border-t border-electric/60"
        />
        <span
          aria-hidden
          className="absolute right-0 bottom-0 h-3 w-3 border-b border-r border-electric/60"
        />

        {/* identity strip */}
        <div className="mb-7 flex items-center gap-3">
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            priority
            className="h-7 w-auto"
          />
          <div className="flex-1">
            <p className="annotation">pmOS &middot; Command Center</p>
            <p className="text-sm font-semibold text-white">Operator console</p>
          </div>
          <span
            aria-hidden
            className="h-2 w-2 rounded-full bg-emerald-400/80 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
          />
        </div>

        <p className="annotation mb-3">Auth &middot; Enter 6-digit PIN</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••••"
            className="w-full border border-white/15 bg-navy px-4 py-3 text-center text-2xl tracking-[0.5em] text-white transition-colors placeholder:tracking-[0.3em] placeholder:text-mid focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
            autoFocus
            aria-label="6-digit PIN"
          />

          {error && (
            <p
              role="alert"
              className="border border-red-500/30 bg-red-500/8 px-3 py-2 text-center font-mono text-xs uppercase tracking-widest text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || pin.length === 0}
            className="group inline-flex w-full items-center justify-center gap-2 bg-electric py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1A4FE0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Verifying…' : 'Unlock'}
            {!loading && (
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
