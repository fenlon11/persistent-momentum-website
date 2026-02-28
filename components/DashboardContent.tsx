'use client';

import { useState, useEffect, useCallback } from 'react';
import { workers as workerList } from '@/lib/workers-data';

interface WorkerHealth {
  id: string;
  name: string;
  status: 'active' | 'error' | 'unknown';
  modified_on: string | null;
}

interface ActivityLog {
  id: string;
  worker_id: string;
  worker_name: string;
  action: string;
  status: string;
  details: string;
  created_at: string;
}

const workerIconMap = new Map(workerList.map((w) => [w.id, w.icon]));

function StatusDot({ status }: { status: string }) {
  const color =
    status === 'active'
      ? 'bg-emerald-400'
      : status === 'error'
        ? 'bg-red-400'
        : 'bg-yellow-400';
  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} />
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === 'success'
      ? 'bg-emerald-500/20 text-emerald-400'
      : status === 'error'
        ? 'bg-red-500/20 text-red-400'
        : 'bg-[#3E8BF5]/20 text-[#3E8BF5]';
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-800 rounded-lg" />
        <div className="flex-1">
          <div className="h-4 bg-slate-800 rounded w-24 mb-2" />
          <div className="h-3 bg-slate-800 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardContent({ onLogout }: { onLogout: () => void }) {
  const [health, setHealth] = useState<WorkerHealth[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [healthRes, activityRes] = await Promise.all([
        fetch('/api/workers/health'),
        fetch('/api/workers/activity'),
      ]);

      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setHealth(healthData.workers);
        setLastCheck(new Date());
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setLogs(activityData.logs);
      }
    } catch {
      // Silently handle — UI shows empty states
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const activeCount = health.filter((w) => w.status === 'active').length;
  const errorCount = health.filter((w) => w.status === 'error').length;

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Worker Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">Fleet monitoring & activity</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Workers', value: '8', color: 'text-white' },
            { label: 'Active', value: loading ? '—' : String(activeCount), color: 'text-emerald-400' },
            { label: 'Errors', value: loading ? '—' : String(errorCount), color: errorCount > 0 ? 'text-red-400' : 'text-white' },
            { label: 'Last Check', value: lastCheck ? lastCheck.toLocaleTimeString() : '—', color: 'text-slate-300' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4"
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Fleet Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Fleet Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : health.map((worker) => (
                  <div
                    key={worker.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{workerIconMap.get(worker.id) ?? '⚙️'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{worker.name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <StatusDot status={worker.status} />
                          <span className="text-xs text-slate-400 capitalize">{worker.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Activity Feed</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-16 h-3 bg-slate-800 rounded" />
                    <div className="w-6 h-6 bg-slate-800 rounded" />
                    <div className="flex-1 h-3 bg-slate-800 rounded" />
                    <div className="w-14 h-5 bg-slate-800 rounded-full" />
                  </div>
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-500">No activity logs yet</p>
                <p className="text-xs text-slate-600 mt-1">
                  Activity will appear here once workers start reporting
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="px-4 py-3 flex items-center gap-4">
                    <span className="text-xs text-slate-500 w-20 shrink-0">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                    <span className="text-base">{workerIconMap.get(log.worker_id) ?? '⚙️'}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-white font-medium">{log.worker_name}</span>
                      <span className="text-sm text-slate-400 ml-2">{log.action}</span>
                    </div>
                    <StatusBadge status={log.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
