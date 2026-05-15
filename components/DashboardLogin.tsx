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
    <div
      className="flex min-h-screen items-center justify-center px-5"
      style={{ background: 'var(--color-bg-light)' }}
    >
      <div
        className="w-full max-w-sm p-8"
        style={{
          background: 'var(--color-bg-light-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 12px 32px -12px rgba(15,23,42,0.08)',
        }}
      >
        {/* identity strip */}
        <div className="mb-6 flex items-center gap-3">
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            priority
            style={{ height: 28, width: 'auto' }}
          />
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{
                color: 'var(--color-primary)',
                letterSpacing: '0.12em',
              }}
            >
              pmOS
            </p>
            <p
              className="text-base font-bold"
              style={{ color: 'var(--color-text-dark)' }}
            >
              Command Center
            </p>
          </div>
        </div>

        <p
          className="text-sm mb-4"
          style={{ color: 'var(--color-text-dark-muted)' }}
        >
          Enter your PIN to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••••"
            className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] focus:outline-none"
            style={{
              background: 'var(--color-bg-light-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--color-text-dark)',
            }}
            autoFocus
            aria-label="6-digit PIN"
          />

          {error && (
            <p
              role="alert"
              className="text-center text-sm font-medium px-3 py-2"
              style={{
                color: 'rgb(153, 27, 27)',
                background: 'rgba(220, 38, 38, 0.08)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: 'var(--radius)',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || pin.length === 0}
            className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: 'var(--color-primary)',
              borderRadius: 'var(--radius)',
            }}
          >
            {loading ? 'Verifying…' : 'Unlock'}
            {!loading && <span aria-hidden>→</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
