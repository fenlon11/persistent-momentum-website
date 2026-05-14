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
      <div className="w-full max-w-sm rounded-xl border border-white/8 bg-navy-raised p-8">
        <div className="mb-8 text-center">
          <Image
            src="/logo.png"
            alt="Persistent Momentum"
            width={44}
            height={44}
            priority
            className="mx-auto mb-4 h-10 w-auto"
          />
          <p className="eyebrow mb-2">pmOS</p>
          <h1 className="text-lg font-semibold tracking-tight text-white">Command Center</h1>
          <p className="mt-1 text-sm text-mid">Enter your PIN to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••••"
            className="w-full rounded-lg border border-white/10 bg-navy px-4 py-3 text-center text-2xl tracking-[0.5em] text-white transition-colors placeholder:tracking-[0.3em] placeholder:text-mid focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric"
            autoFocus
          />

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading || pin.length === 0}
            className="w-full rounded-lg bg-electric py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1A4FE0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Verifying…' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
}
