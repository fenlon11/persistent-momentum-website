'use client';

import { useState, useEffect, useCallback } from 'react';

interface MemoryStats {
  total: number;
  byCategory: Record<string, number>;
  recent: Array<{ id: string; content: string; category: string; created_at: string }>;
  error?: string;
}

interface SkillInvocation {
  id: string;
  skill_name: string;
  status: string;
  model_used: string | null;
  duration_ms: number | null;
  created_at: string;
  error_message: string | null;
}

interface SkillStats {
  invocations: SkillInvocation[];
  stats: Array<{
    skill_name: string;
    total_count: number;
    completed_count: number;
    failed_count: number;
    avg_duration_ms: number | null;
  }>;
  error?: string;
}

interface SessionLog {
  id: string;
  entry_type: string;
  content: string;
  log_date: string;
  created_at: string;
}

interface SessionStats {
  logs: SessionLog[];
  countsByType: Record<string, number>;
  error?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  preference: 'bg-blue-500',
  fact: 'bg-emerald-500',
  decision: 'bg-purple-500',
  goal: 'bg-amber-500',
  behavior: 'bg-cyan-500',
  technical: 'bg-slate-500',
  blocker: 'bg-red-500',
  uncategorized: 'bg-gray-500',
};

const LOG_TYPE_ICONS: Record<string, string> = {
  event: '📋',
  decision: '🎯',
  blocker: '🚧',
  shipped: '🚀',
  error: '❌',
};

export default function PmosOverview() {
  const [memory, setMemory] = useState<MemoryStats | null>(null);
  const [skills, setSkills] = useState<SkillStats | null>(null);
  const [sessions, setSessions] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [memoryRes, skillsRes, sessionsRes] = await Promise.all([
        fetch('/api/pmos/memory'),
        fetch('/api/pmos/skills?days=7'),
        fetch('/api/pmos/sessions?days=7'),
      ]);

      if (memoryRes.ok) setMemory(await memoryRes.json());
      if (skillsRes.ok) setSkills(await skillsRes.json());
      if (sessionsRes.ok) setSessions(await sessionsRes.json());
    } catch (e) {
      console.error('pmOS fetch error:', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-900/80 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-slate-900/80 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">pmOS Dashboard</h2>
        <p className="text-sm text-slate-400 mt-1">
          Persistent Momentum Operating System
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Memories" value={memory?.total || 0} color="emerald" />
        <StatCard
          label="Skills (7d)"
          value={skills?.invocations.length || 0}
          color="blue"
        />
        <StatCard
          label="Shipped (7d)"
          value={sessions?.countsByType?.shipped || 0}
          color="purple"
        />
        <StatCard
          label="Blockers"
          value={sessions?.countsByType?.blocker || 0}
          color={sessions?.countsByType?.blocker ? 'red' : 'slate'}
        />
      </div>

      {/* Error Messages */}
      {memory?.error && (
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
          <p className="text-amber-400 text-sm">
            Memory: {memory.error}. Run the Supabase migration to enable telemetry.
          </p>
        </div>
      )}

      {/* Memory by Category */}
      {memory && Object.keys(memory.byCategory).length > 0 && (
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3">
            Memory by Category
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(memory.byCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => (
                <span
                  key={category}
                  className={`text-xs px-3 py-1.5 rounded-full text-white ${CATEGORY_COLORS[category] || 'bg-slate-600'}`}
                >
                  {category}: {count}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent Skills */}
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3">
            Recent Skill Invocations
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {skills?.invocations.slice(0, 10).map((inv) => (
              <div key={inv.id} className="flex items-center gap-2 text-xs">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    inv.status === 'completed'
                      ? 'bg-emerald-500'
                      : inv.status === 'failed'
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                  }`}
                />
                <span className="text-white font-medium truncate">
                  {inv.skill_name}
                </span>
                {inv.model_used && (
                  <span className="text-slate-500">{inv.model_used}</span>
                )}
                {inv.duration_ms && (
                  <span className="text-slate-600">{inv.duration_ms}ms</span>
                )}
              </div>
            ))}
            {!skills?.invocations.length && (
              <p className="text-slate-500 text-xs">
                No skill invocations recorded yet
              </p>
            )}
          </div>
        </div>

        {/* Session Log */}
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3">
            Session Log (7d)
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sessions?.logs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-start gap-2 text-xs">
                <span className="flex-shrink-0">
                  {LOG_TYPE_ICONS[log.entry_type] || '📝'}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-white line-clamp-2">{log.content}</span>
                  <span className="text-slate-600 ml-2">{log.log_date}</span>
                </div>
              </div>
            ))}
            {!sessions?.logs.length && (
              <p className="text-slate-500 text-xs">No session logs recorded yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Memories */}
      {memory?.recent && memory.recent.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3">
            Recent Memories
          </h3>
          <div className="space-y-2">
            {memory.recent.map((mem) => (
              <div key={mem.id} className="flex items-start gap-2 text-xs">
                <span
                  className={`w-2 h-2 mt-1 rounded-full flex-shrink-0 ${CATEGORY_COLORS[mem.category] || 'bg-slate-500'}`}
                />
                <span className="text-slate-300 flex-1 line-clamp-2">
                  {mem.content}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Stats Table */}
      {skills?.stats && skills.stats.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3">
            Skill Performance (7d)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left py-2">Skill</th>
                  <th className="text-right py-2">Total</th>
                  <th className="text-right py-2">Success</th>
                  <th className="text-right py-2">Failed</th>
                  <th className="text-right py-2">Avg Time</th>
                </tr>
              </thead>
              <tbody>
                {skills.stats.slice(0, 10).map((stat) => (
                  <tr key={stat.skill_name} className="border-b border-slate-800">
                    <td className="py-2 text-white font-medium">
                      {stat.skill_name}
                    </td>
                    <td className="py-2 text-right text-slate-300">
                      {stat.total_count}
                    </td>
                    <td className="py-2 text-right text-emerald-400">
                      {stat.completed_count}
                    </td>
                    <td className="py-2 text-right text-red-400">
                      {stat.failed_count}
                    </td>
                    <td className="py-2 text-right text-slate-400">
                      {stat.avg_duration_ms
                        ? `${Math.round(stat.avg_duration_ms)}ms`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: 'border-emerald-500/20 text-emerald-400',
    blue: 'border-blue-500/20 text-blue-400',
    purple: 'border-purple-500/20 text-purple-400',
    red: 'border-red-500/20 text-red-400',
    slate: 'border-slate-700/50 text-slate-400',
  };

  return (
    <div
      className={`bg-slate-900/80 border ${colorClasses[color]} rounded-xl p-3 text-center`}
    >
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
