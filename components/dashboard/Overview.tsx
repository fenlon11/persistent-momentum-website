'use client';

import { useEffect, useState } from 'react';

// Console / Overview landing — the "is the machine healthy, what's running,
// what needs me" view. Pulls from existing endpoints; no new data plumb.

type AgentRow = {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'degraded' | 'offline' | string;
  last_run_at?: string | null;
  last_status?: string | null;
};

type TaskRow = {
  id: string;
  title: string;
  status: string;
  target_worker?: string | null;
  product_slug?: string | null;
  created_at: string;
  assigned_at?: string | null;
};

type ProjectRow = {
  slug: string;
  name: string;
  mrr?: number | null;
  status?: string | null;
};

export default function Overview({
  onJumpTo,
}: {
  onJumpTo: (area: 'operations' | 'portfolio' | 'knowledge' | 'config') => void;
}) {
  const [agents, setAgents] = useState<AgentRow[] | null>(null);
  const [tasks, setTasks] = useState<TaskRow[] | null>(null);
  const [projects, setProjects] = useState<ProjectRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const [aRes, tRes, pRes] = await Promise.all([
          fetch('/api/agents/health').then((r) => r.json()),
          fetch('/api/tasks?status=pending,running').then((r) => r.json()),
          fetch('/api/projects').then((r) => r.json()),
        ]);
        if (!alive) return;
        setAgents(aRes.agents ?? []);
        setTasks(tRes.tasks ?? []);
        setProjects(Array.isArray(pRes.projects) ? pRes.projects : pRes ?? []);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : 'Failed to load console data');
      }
    }
    load();
    const id = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const agentTotals = countAgents(agents);
  const running = (tasks ?? []).filter((t) => t.status === 'running');
  const pending = (tasks ?? []).filter((t) => t.status === 'pending');
  const totalMrr = (projects ?? []).reduce((sum, p) => sum + (p.mrr ?? 0), 0);
  const liveProducts = (projects ?? []).filter(
    (p) => (p.status ?? '').toLowerCase() === 'live' || (p.status ?? '').toLowerCase() === 'shipped'
  ).length;

  return (
    <div className="space-y-8">
      {/* Status line */}
      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-4 text-[11px] uppercase tracking-widest font-semibold"
        style={{
          color: 'var(--color-text-dark-muted)',
          borderBottom: '1px solid var(--color-border)',
          letterSpacing: '0.12em',
        }}
      >
        <span className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              error
                ? 'bg-red-500'
                : agentTotals.degraded > 0
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
            }`}
          />
          <span style={{ color: 'var(--color-text-dark)' }}>
            pmOS {error ? 'offline' : 'operating'}
          </span>
        </span>
        <span>
          {agentTotals.active} active · {agentTotals.degraded} degraded ·{' '}
          {agentTotals.offline} offline
        </span>
        <span>{running.length} running · {pending.length} pending</span>
        <span>{liveProducts} products live</span>
      </div>

      {error && (
        <div
          className="p-4 text-xs"
          style={{
            background: 'rgba(220, 38, 38, 0.08)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            color: 'rgb(153, 27, 27)',
            borderRadius: 'var(--radius)',
          }}
        >
          {error}
        </div>
      )}

      {/* 4 console tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile
          code="01"
          label="Agents"
          figure={loadingOr(agents, () => `${agentTotals.active}/${agentTotals.total}`)}
          detail={agentTotals.degraded > 0 ? `${agentTotals.degraded} degraded` : 'All healthy'}
          tone={agentTotals.degraded > 0 ? 'warn' : 'ok'}
          onClick={() => onJumpTo('operations')}
        />
        <Tile
          code="02"
          label="Queue"
          figure={loadingOr(tasks, () => String(pending.length))}
          detail={`${running.length} running`}
          tone="info"
          onClick={() => onJumpTo('operations')}
        />
        <Tile
          code="03"
          label="Products"
          figure={loadingOr(projects, () => String(liveProducts))}
          detail={`${(projects ?? []).length} total tracked`}
          tone="info"
          onClick={() => onJumpTo('portfolio')}
        />
        <Tile
          code="04"
          label="Combined MRR"
          figure={loadingOr(projects, () =>
            totalMrr > 0 ? `$${formatMrr(totalMrr)}` : '—',
          )}
          detail="Live via pm_mrr_snapshots"
          tone="info"
          onClick={() => onJumpTo('portfolio')}
        />
      </div>

      {/* Activity column */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Panel title="Now running" code="OPS-A" onMore={() => onJumpTo('operations')}>
          {tasks === null ? (
            <p
              className="text-xs"
              style={{ color: 'var(--color-text-dark-muted)' }}
            >
              Loading…
            </p>
          ) : running.length === 0 && pending.length === 0 ? (
            <p
              className="text-xs"
              style={{ color: 'var(--color-text-dark-muted)' }}
            >
              Queue is empty.
            </p>
          ) : (
            <ul
              className="overflow-hidden"
              style={{
                background: 'var(--color-bg-light-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              {[...running, ...pending].slice(0, 6).map((t, i) => (
                <li
                  key={t.id}
                  className="flex items-baseline gap-3 px-4 py-3 text-sm"
                  style={{
                    borderTop:
                      i > 0 ? '1px solid var(--color-border-light)' : 'none',
                  }}
                >
                  <span
                    aria-hidden
                    className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                      t.status === 'running' ? 'bg-amber-500' : 'bg-sky-500'
                    }`}
                  />
                  <span
                    className="flex-1 truncate"
                    style={{ color: 'var(--color-text-dark)' }}
                  >
                    {t.title}
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-wider font-medium"
                    style={{
                      color: 'var(--color-text-dark-muted)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {t.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Agent heartbeats"
          code="OPS-B"
          onMore={() => onJumpTo('operations')}
        >
          {agents === null ? (
            <p
              className="text-xs"
              style={{ color: 'var(--color-text-dark-muted)' }}
            >
              Loading…
            </p>
          ) : agents.length === 0 ? (
            <p
              className="text-xs"
              style={{ color: 'var(--color-text-dark-muted)' }}
            >
              No agents registered.
            </p>
          ) : (
            <ul
              className="overflow-hidden"
              style={{
                background: 'var(--color-bg-light-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              {agents.slice(0, 6).map((a, i) => (
                <li
                  key={a.id}
                  className="grid grid-cols-[12px_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3"
                  style={{
                    borderTop:
                      i > 0 ? '1px solid var(--color-border-light)' : 'none',
                  }}
                >
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 rounded-full ${
                      a.status === 'active'
                        ? 'bg-emerald-500'
                        : a.status === 'degraded'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                    }`}
                  />
                  <span
                    className="truncate text-sm font-medium"
                    style={{ color: 'var(--color-text-dark)' }}
                  >
                    {a.name}
                  </span>
                  <span
                    className="truncate text-[11px]"
                    style={{ color: 'var(--color-text-dark-muted)' }}
                  >
                    {a.role}
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-wider font-medium"
                    style={{
                      color: 'var(--color-text-dark-muted)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {a.last_status ?? a.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

/* ───────────────────── helpers ───────────────────── */

function countAgents(agents: AgentRow[] | null) {
  if (!agents) return { total: 0, active: 0, degraded: 0, offline: 0 };
  return agents.reduce(
    (acc, a) => {
      acc.total += 1;
      const s = (a.status ?? '').toLowerCase();
      if (s === 'active') acc.active += 1;
      else if (s === 'degraded') acc.degraded += 1;
      else acc.offline += 1;
      return acc;
    },
    { total: 0, active: 0, degraded: 0, offline: 0 },
  );
}

function loadingOr<T>(value: T | null, render: () => string): string {
  return value === null ? '…' : render();
}

function formatMrr(amount: number) {
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}k`;
  return amount.toFixed(0);
}

function Tile({
  code,
  label,
  figure,
  detail,
  tone,
  onClick,
}: {
  code: string;
  label: string;
  figure: string;
  detail: string;
  tone: 'ok' | 'warn' | 'info';
  onClick?: () => void;
}) {
  const figColor =
    tone === 'warn'
      ? 'rgb(180, 83, 9)' // amber-700
      : tone === 'ok'
        ? 'rgb(4, 120, 87)' // emerald-700
        : 'var(--color-primary)';
  return (
    <button
      type="button"
      onClick={onClick}
      className="group p-5 text-left transition-colors hover:shadow"
      style={{
        background: 'var(--color-bg-light-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <p
        className="text-[10px] tracking-widest font-semibold"
        style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
      >
        {code}
      </p>
      <p
        className="mt-2 text-xs font-semibold uppercase tracking-widest"
        style={{
          color: 'var(--color-text-dark-muted)',
          letterSpacing: '0.12em',
        }}
      >
        {label}
      </p>
      <p
        className="mt-3 text-3xl font-bold leading-none tracking-tight"
        style={{ color: figColor, letterSpacing: '-0.02em' }}
      >
        {figure}
      </p>
      <p
        className="mt-2 text-xs"
        style={{ color: 'var(--color-text-dark-muted)' }}
      >
        {detail}
      </p>
    </button>
  );
}

function Panel({
  title,
  code,
  onMore,
  children,
}: {
  title: string;
  code: string;
  onMore?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="mb-4 flex items-center gap-3">
        <span
          className="text-[10px] tracking-widest font-semibold"
          style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
        >
          {code}
        </span>
        <h3
          className="text-sm font-bold"
          style={{ color: 'var(--color-text-dark)' }}
        >
          {title}
        </h3>
        {onMore && (
          <button
            type="button"
            onClick={onMore}
            className="ml-auto text-[10px] uppercase tracking-widest font-semibold transition-colors"
            style={{
              color: 'var(--color-text-dark-muted)',
              letterSpacing: '0.12em',
            }}
          >
            view all →
          </button>
        )}
      </header>
      {children}
    </section>
  );
}
