'use client';

import { useState, useEffect, useCallback } from 'react';

interface SkillInvocation {
  id: string;
  skill_name: string;
  status: string;
  model_used: string | null;
  duration_ms: number | null;
  error_message: string | null;
  created_at: string;
}

interface SkillStat {
  skill_name: string;
  total_count: number;
  completed_count: number;
  failed_count: number;
  avg_duration_ms: number | null;
}

interface SkillsResponse {
  invocations: SkillInvocation[];
  stats: SkillStat[];
  error?: string;
}

const STATUS_COLOR: Record<string, string> = {
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  started: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  running: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
};

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function formatDuration(ms: number | null): string {
  if (ms == null) return '—';
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

function successRate(stat: SkillStat): number {
  if (stat.total_count === 0) return 0;
  return Math.round((stat.completed_count / stat.total_count) * 100);
}

export default function SkillsView() {
  const [data, setData] = useState<SkillsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/platform/skills?days=${days}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error('Skills fetch failed', e);
    }
    setLoading(false);
  }, [days]);

  useEffect(() => {
    setLoading(true);
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const stats = (data?.stats ?? []).slice().sort((a, b) => b.total_count - a.total_count);
  const invocations = data?.invocations ?? [];
  const filteredInvocations = selectedSkill
    ? invocations.filter((i) => i.skill_name === selectedSkill)
    : invocations;

  const totalInvocations = stats.reduce((s, x) => s + x.total_count, 0);
  const totalCompleted = stats.reduce((s, x) => s + x.completed_count, 0);
  const totalFailed = stats.reduce((s, x) => s + x.failed_count, 0);
  const overallRate = totalInvocations > 0 ? Math.round((totalCompleted / totalInvocations) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Skills</h2>
          <p className="text-sm text-slate-400 mt-1">
            {totalInvocations} invocation{totalInvocations !== 1 ? 's' : ''} · {stats.length} distinct skill{stats.length !== 1 ? 's' : ''} · last {days} days
            {' · '}from <span className="font-mono">pm_skill_invocations</span>
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="text-xs bg-slate-900 border border-slate-700/50 rounded-lg px-2 py-1 text-slate-300"
        >
          <option value={1}>Last 24 hours</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Invocations</p>
          <p className="text-2xl font-bold text-white mt-1">{totalInvocations}</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{totalCompleted}</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Failed</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{totalFailed}</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Success rate</p>
          <p className="text-2xl font-bold text-white mt-1">{overallRate}%</p>
        </div>
      </div>

      {loading && stats.length === 0 && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-900/80 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Per-skill breakdown */}
      {stats.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Per-skill breakdown</h3>
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/50 text-xs text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Skill</th>
                  <th className="text-right px-3 py-2 font-medium">Total</th>
                  <th className="text-right px-3 py-2 font-medium">Done</th>
                  <th className="text-right px-3 py-2 font-medium">Failed</th>
                  <th className="text-right px-3 py-2 font-medium">Success</th>
                  <th className="text-right px-3 py-2 font-medium">Avg dur</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat) => {
                  const isSelected = selectedSkill === stat.skill_name;
                  const rate = successRate(stat);
                  return (
                    <tr
                      key={stat.skill_name}
                      onClick={() => setSelectedSkill(isSelected ? null : stat.skill_name)}
                      className={`border-t border-slate-700/30 cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#1E5BFF]/10' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="px-4 py-2.5 text-white font-mono text-xs">{stat.skill_name}</td>
                      <td className="px-3 py-2.5 text-right text-slate-300">{stat.total_count}</td>
                      <td className="px-3 py-2.5 text-right text-emerald-400">{stat.completed_count}</td>
                      <td className="px-3 py-2.5 text-right text-red-400">{stat.failed_count || ''}</td>
                      <td className="px-3 py-2.5 text-right">
                        <span
                          className={`text-xs ${
                            rate >= 90 ? 'text-emerald-400' : rate >= 70 ? 'text-amber-400' : 'text-red-400'
                          }`}
                        >
                          {rate}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-slate-400 text-xs">
                        {formatDuration(stat.avg_duration_ms)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {selectedSkill && (
            <p className="text-xs text-slate-500">
              Filtering invocations to <span className="font-mono text-[#1E5BFF]">{selectedSkill}</span>
              {' · '}
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-slate-400 hover:text-white underline"
              >
                clear
              </button>
            </p>
          )}
        </div>
      )}

      {/* Recent invocations */}
      {invocations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">
            Recent invocations
            {selectedSkill && (
              <span className="text-slate-400 font-normal text-xs ml-2">({filteredInvocations.length})</span>
            )}
          </h3>
          <div className="space-y-2">
            {filteredInvocations.slice(0, 30).map((inv) => (
              <div
                key={inv.id}
                className="bg-slate-900/60 border border-slate-700/30 rounded-lg p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border flex-shrink-0 mt-0.5 ${
                        STATUS_COLOR[inv.status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}
                    >
                      {inv.status}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-white font-mono">{inv.skill_name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-3 flex-wrap">
                        <span>{timeAgo(inv.created_at)}</span>
                        {inv.duration_ms != null && <span>{formatDuration(inv.duration_ms)}</span>}
                        {inv.model_used && (
                          <span className="font-mono text-slate-400">{inv.model_used}</span>
                        )}
                      </div>
                      {inv.error_message && (
                        <div className="text-xs text-red-400 mt-1.5 font-mono whitespace-pre-wrap">
                          {inv.error_message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredInvocations.length > 30 && (
            <p className="text-xs text-slate-500 text-center">
              Showing 30 of {filteredInvocations.length}. Filter by skill or shorten range to see more.
            </p>
          )}
        </div>
      )}

      {!loading && totalInvocations === 0 && (
        <div className="text-center py-12 text-sm text-slate-500">
          No skill invocations recorded in the selected range.
          {data?.error && <p className="text-red-400 mt-2">{data.error}</p>}
        </div>
      )}
    </div>
  );
}
