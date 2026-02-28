'use client';

import { useState, FormEvent } from 'react';

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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-3xl mb-3">🔒</div>
          <h1 className="text-xl font-bold text-white">Dashboard Access</h1>
          <p className="text-sm text-slate-400 mt-1">Enter your PIN to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••••"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-center text-2xl tracking-[0.5em] placeholder:tracking-[0.3em] placeholder:text-slate-600 focus:outline-none focus:border-[#3E8BF5] focus:ring-1 focus:ring-[#3E8BF5] transition-colors"
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || pin.length === 0}
            className="w-full py-3 bg-[#3E8BF5] hover:bg-[#3E8BF5]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            {loading ? 'Verifying...' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
}
