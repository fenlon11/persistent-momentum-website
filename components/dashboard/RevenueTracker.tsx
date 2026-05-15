'use client';

import { useEffect, useState } from 'react';
import { revenueTargets } from '@/lib/dashboard-data';

interface ApiProject {
  id: string;
  slug: string;
  name: string;
  icon: string;
  stage: string;
  mrr: number;
}

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`;

const pct = (current: number, target: number) =>
  target === 0 ? 0 : Math.min(Math.round((current / target) * 100), 100);

const SHIPPED_STAGES = new Set(['live', 'shipped', 'scaling', 'monetizing']);

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-light-secondary)] backdrop-blur-sm p-4">
      <p className="text-xs text-[var(--color-text-dark-muted)] uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      {sub && <p className="text-xs text-[var(--color-text-dark-muted)] mt-1">{sub}</p>}
    </div>
  );
}

function ProgressRing({ current, target }: { current: number; target: number }) {
  const percentage = pct(current, target);
  const radius = 80;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width={200} height={200} className="-rotate-90">
          <circle
            cx={100}
            cy={100}
            r={radius}
            fill="none"
            stroke="rgb(51 65 85 / 0.5)"
            strokeWidth={stroke}
          />
          <circle
            cx={100}
            cy={100}
            r={radius}
            fill="none"
            stroke="#1E5BFF"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{percentage}%</span>
          <span className="text-xs text-[var(--color-text-dark-muted)]">of {fmt(target)}</span>
        </div>
      </div>
      <p className="text-sm text-[var(--color-text-dark-muted)]">MRR Progress</p>
    </div>
  );
}

function MonthlyBars() {
  const max = Math.max(...revenueTargets.monthlyTargets.map((m) => m.target), 1);
  const now = new Date();
  const currentLabel = `${now.toLocaleString('en', { month: 'short' })} ${now.getFullYear()}`;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-white">Monthly targets</h3>
      <div className="space-y-2">
        {revenueTargets.monthlyTargets.map((m) => {
          const isCurrent = m.period === currentLabel;
          const isPast = !isCurrent && new Date(`1 ${m.period}`) < now;
          const targetWidth = (m.target / max) * 100;
          const currentWidth = (m.current / max) * 100;

          return (
            <div key={m.period} className="flex items-center gap-3">
              <span
                className={`w-20 text-xs shrink-0 ${
                  isCurrent ? 'text-[#1E5BFF] font-semibold' : 'text-[var(--color-text-dark-muted)]'
                }`}
              >
                {m.period}
              </span>
              <div className="flex-1 relative h-5">
                <div
                  className={`absolute inset-y-0 left-0 rounded ${
                    isPast
                      ? 'bg-white/15'
                      : isCurrent
                        ? 'border border-[#1E5BFF]/40 bg-[#1E5BFF]/10'
                        : 'border border-[var(--color-border)]'
                  }`}
                  style={{ width: `${targetWidth}%` }}
                />
                {m.current > 0 && (
                  <div
                    className={`absolute inset-y-0 left-0 rounded ${
                      isCurrent ? 'bg-[#1E5BFF]' : 'bg-emerald-500/70'
                    }`}
                    style={{ width: `${currentWidth}%` }}
                  />
                )}
                <span className="absolute right-2 top-0.5 text-xs text-[var(--color-text-dark-muted)]">
                  {fmt(m.target)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProductBreakdown({ projects, totalMRR }: { projects: ApiProject[]; totalMRR: number }) {
  const productsWithMRR = projects.filter((p) => p.mrr > 0);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-white">Per-product MRR</h3>
      {productsWithMRR.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {productsWithMRR.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg-light-secondary)] p-3 flex items-center gap-2"
            >
              <span className="text-lg">{p.icon}</span>
              <div>
                <p className="text-xs text-[var(--color-text-dark)] font-medium">{p.name}</p>
                <p className="text-sm font-bold text-white">{fmt(p.mrr)}</p>
                {totalMRR > 0 && (
                  <p className="text-[10px] text-[var(--color-text-dark-muted)]">
                    {Math.round((p.mrr / totalMRR) * 100)}% of total
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="text-xs text-[var(--color-text-dark-muted)]">No revenue yet — all products at $0 MRR</p>
          <div className="grid grid-cols-2 gap-2">
            {projects.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg-light-secondary)] p-3 flex items-center gap-2 opacity-60"
              >
                <span className="text-lg">{p.icon}</span>
                <div>
                  <p className="text-xs text-[var(--color-text-dark-muted)]">{p.name}</p>
                  <p className="text-xs text-[color:rgba(100,116,139,0.7)]">$0</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RevenueRunway({ currentMRR }: { currentMRR: number }) {
  const { targetMRR2026 } = revenueTargets;

  if (currentMRR === 0) {
    return (
      <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-light-secondary)] backdrop-blur-sm p-4">
        <h3 className="text-sm font-semibold text-white">Revenue runway</h3>
        <p className="text-xs text-[var(--color-text-dark-muted)] mt-2">
          Not enough data — start generating MRR to project your runway to {fmt(targetMRR2026)}.
        </p>
      </div>
    );
  }

  const monthsWithRevenue = revenueTargets.monthlyTargets.filter((m) => m.current > 0);
  if (monthsWithRevenue.length < 2) {
    return (
      <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-light-secondary)] backdrop-blur-sm p-4">
        <h3 className="text-sm font-semibold text-white">Revenue runway</h3>
        <p className="text-xs text-[var(--color-text-dark-muted)] mt-2">
          Need at least 2 months of data to project growth rate.
        </p>
        <p className="text-lg font-bold text-white mt-1">Current: {fmt(currentMRR)}/mo</p>
      </div>
    );
  }

  const first = monthsWithRevenue[0].current;
  const last = monthsWithRevenue[monthsWithRevenue.length - 1].current;
  const monthlyGrowth = (last - first) / (monthsWithRevenue.length - 1);
  const remaining = targetMRR2026 - currentMRR;
  const monthsToTarget = monthlyGrowth > 0 ? Math.ceil(remaining / monthlyGrowth) : null;

  const targetDate =
    monthsToTarget !== null
      ? new Date(new Date().getFullYear(), new Date().getMonth() + monthsToTarget)
      : null;

  return (
    <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-light-secondary)] backdrop-blur-sm p-4">
      <h3 className="text-sm font-semibold text-white">Revenue runway</h3>
      <div className="mt-2 space-y-1">
        <p className="text-xs text-[var(--color-text-dark-muted)]">
          Growth rate: <span className="text-white font-medium">+{fmt(monthlyGrowth)}/mo</span>
        </p>
        {targetDate ? (
          <p className="text-xs text-[var(--color-text-dark-muted)]">
            {fmt(targetMRR2026)} target:{' '}
            <span className="text-[#1E5BFF] font-semibold">
              {targetDate.toLocaleString('en', { month: 'short', year: 'numeric' })}
            </span>{' '}
            ({monthsToTarget} months)
          </p>
        ) : (
          <p className="text-xs text-amber-400">Growth stalled — revenue not increasing</p>
        )}
      </div>
    </div>
  );
}

export default function RevenueTracker() {
  const [projects, setProjects] = useState<ApiProject[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (!cancelled && res.ok) setProjects(data.projects || []);
      } catch {
        /* silent — empty state renders */
      }
    }
    load();
    const interval = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const { targetMRR2026, targetARR2026, targetProducts2026 } = revenueTargets;
  const currentMRR = projects.reduce((sum, p) => sum + p.mrr, 0);
  const currentARR = currentMRR * 12;
  const shippedCount = projects.filter((p) => SHIPPED_STAGES.has(p.stage.toLowerCase())).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Revenue Tracker</h2>
        <p className="text-sm text-[var(--color-text-dark-muted)] mt-1">Progress toward $10k MRR by end of 2026 · {fmt(revenueTargets.longTermTargetMRR)} long-term</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Current MRR" value={fmt(currentMRR)} sub={`of ${fmt(targetMRR2026)} target`} />
        <StatCard label="Target MRR 2026" value={fmt(targetMRR2026)} sub="End of year goal" />
        <StatCard label="Current ARR" value={fmt(currentARR)} sub={`of ${fmt(targetARR2026)} target`} />
        <StatCard
          label="Products shipped"
          value={`${shippedCount}/${targetProducts2026}`}
          sub={`${Math.max(0, targetProducts2026 - shippedCount)} more to build`}
        />
      </div>

      <div className="grid lg:grid-cols-[auto_1fr] gap-6 items-start">
        <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-light-secondary)] backdrop-blur-sm p-6 flex justify-center">
          <ProgressRing current={currentMRR} target={targetMRR2026} />
        </div>
        <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-light-secondary)] backdrop-blur-sm p-4">
          <MonthlyBars />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-light-secondary)] backdrop-blur-sm p-4">
          <ProductBreakdown projects={projects} totalMRR={currentMRR} />
        </div>
        <RevenueRunway currentMRR={currentMRR} />
      </div>
    </div>
  );
}
