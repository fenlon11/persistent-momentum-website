'use client';

import { useState } from 'react';
import {
  secretsRegistry,
  groupByService,
  getRegistryStats,
  type SecretEntry,
  type KeyStatus,
} from '@/lib/secrets-registry';

const statusConfig: Record<KeyStatus, { label: string; color: string; dot: string }> = {
  set: { label: 'Set', color: 'text-emerald-400', dot: 'bg-emerald-500' },
  missing: { label: 'Missing', color: 'text-red-400', dot: 'bg-red-500' },
  expired: { label: 'Expired', color: 'text-amber-400', dot: 'bg-amber-500' },
  unknown: { label: 'Unknown', color: 'text-[var(--color-text-dark-muted)]', dot: 'bg-mid' },
};

function StatusBadge({ status }: { status: KeyStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot} ${status === 'missing' ? 'animate-pulse' : ''}`} />
      {cfg.label}
    </span>
  );
}

function KeyRow({ entry }: { entry: SecretEntry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-[var(--color-border-light)] last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 hover:bg-[var(--color-bg-light-secondary)] transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-xs sm:text-sm text-[var(--color-primary)] font-mono truncate">{entry.keyName}</code>
            {entry.required && (
              <span className="text-[10px] uppercase tracking-wider text-amber-500/70 font-semibold">req</span>
            )}
          </div>
          <p className="text-xs text-[var(--color-text-dark-muted)] mt-0.5 truncate">{entry.purpose}</p>
        </div>
        <div className="flex items-center gap-3 ml-2 shrink-0">
          <StatusBadge status={entry.status} />
          <svg
            className={`w-4 h-4 text-[var(--color-text-dark-muted)] transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 space-y-2 bg-[var(--color-bg-light-secondary)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[var(--color-text-dark-muted)]">Project:</span>{' '}
              <span className="text-[var(--color-text-dark)]">{entry.project}</span>
            </div>
            <div>
              <span className="text-[var(--color-text-dark-muted)]">File:</span>{' '}
              <code className="text-[var(--color-text-dark)] text-[11px]">{entry.envFile}</code>
            </div>
            {entry.lastVerified && (
              <div>
                <span className="text-[var(--color-text-dark-muted)]">Last verified:</span>{' '}
                <span className="text-[var(--color-text-dark)]">{new Date(entry.lastVerified).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          {entry.notes && (
            <p className="text-xs text-amber-400/80 bg-amber-500/10 rounded px-2 py-1">
              ⚠️ {entry.notes}
            </p>
          )}
          {entry.docsUrl && (
            <a
              href={entry.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
            >
              Open docs / rotate key →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function SecretsRegistry() {
  const [filter, setFilter] = useState<'all' | KeyStatus>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = getRegistryStats(secretsRegistry);
  const projects = ['all', ...new Set(secretsRegistry.map(e => e.project))];

  // Filter entries
  let filtered = secretsRegistry;
  if (filter !== 'all') {
    filtered = filtered.filter(e => e.status === filter);
  }
  if (projectFilter !== 'all') {
    filtered = filtered.filter(e => e.project === projectFilter);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      e => e.keyName.toLowerCase().includes(q) ||
           e.service.toLowerCase().includes(q) ||
           e.purpose.toLowerCase().includes(q)
    );
  }

  const groups = groupByService(filtered);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-[var(--color-bg-light-secondary)] rounded-lg p-3 text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-[10px] sm:text-xs text-[var(--color-text-dark-muted)] uppercase tracking-wider">Total Keys</div>
        </div>
        <div className="bg-[var(--color-bg-light-secondary)] rounded-lg p-3 text-center">
          <div className="text-xl sm:text-2xl font-bold text-emerald-400">{stats.set}</div>
          <div className="text-[10px] sm:text-xs text-[var(--color-text-dark-muted)] uppercase tracking-wider">Configured</div>
        </div>
        <div className="bg-[var(--color-bg-light-secondary)] rounded-lg p-3 text-center">
          <div className="text-xl sm:text-2xl font-bold text-red-400">{stats.missing}</div>
          <div className="text-[10px] sm:text-xs text-[var(--color-text-dark-muted)] uppercase tracking-wider">Missing</div>
        </div>
        <div className="hidden sm:block bg-[var(--color-bg-light-secondary)] rounded-lg p-3 text-center">
          <div className="text-xl sm:text-2xl font-bold text-[var(--color-text-dark-muted)]">{stats.services}</div>
          <div className="text-[10px] sm:text-xs text-[var(--color-text-dark-muted)] uppercase tracking-wider">Services</div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search keys, services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--color-bg-light-secondary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-dark-muted)] hover:text-white text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {/* Status filters */}
          {(['all', 'set', 'missing', 'expired', 'unknown'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === s
                  ? 'bg-[rgba(21,68,142,0.20)] text-[var(--color-primary)] border border-[rgba(21,68,142,0.30)]'
                  : 'bg-[var(--color-bg-light-secondary)] text-[var(--color-text-dark-muted)] border border-[var(--color-border)] hover:border-[var(--color-border)]'
              }`}
            >
              {s === 'all' ? `All (${stats.total})` : `${statusConfig[s].label} (${secretsRegistry.filter(e => e.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Project filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {projects.map((p) => (
            <button
              key={p}
              onClick={() => setProjectFilter(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                projectFilter === p
                  ? 'bg-[rgba(21,68,142,0.20)] text-[var(--color-primary)] border border-[rgba(21,68,142,0.30)]'
                  : 'bg-[var(--color-bg-light-secondary)] text-[var(--color-text-dark-muted)] border border-[var(--color-border)] hover:border-[var(--color-border)]'
              }`}
            >
              {p === 'all' ? 'All Projects' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Service Groups */}
      {groups.length === 0 ? (
        <div className="text-center py-8 text-[var(--color-text-dark-muted)] text-sm">No keys match your filters</div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <div key={group.service} className="bg-[var(--color-bg-light-secondary)] rounded-xl overflow-hidden border border-[var(--color-border-light)]">
              <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-[var(--color-bg-light-secondary)]">
                <span className="text-lg">{group.icon}</span>
                <h3 className="text-sm font-semibold text-white">{group.service}</h3>
                <span className="text-xs text-[var(--color-text-dark-muted)] ml-auto">{group.keys.length} key{group.keys.length !== 1 ? 's' : ''}</span>
              </div>
              <div>
                {group.keys.map((entry) => (
                  <KeyRow key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <p className="text-[10px] text-[color:rgba(100,116,139,0.7)] text-center px-4">
        🔒 No secrets are stored here. This is an inventory only. Actual values live in .env.local on your machine.
      </p>
    </div>
  );
}
