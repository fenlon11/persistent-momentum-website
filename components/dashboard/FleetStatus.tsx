'use client';
import { useState, useEffect, useCallback } from 'react';

interface Worker {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'retired' | string;
  cron_schedule: string | null;
  repo: string | null;
  last_run_at: string | null;
  last_status: string | null;
  updated_at: string | null;
  created_at: string;
}

interface ActivityLog {
  id: string;
  worker_name: string;
  action: string;
  status: 'success' | 'error' | 'info' | string;
  details: Record<string, unknown> | null;
  brand_id: string | null;
  created_at: string;
}

const STATUS_DOT: Record<string, string> = {
  active: 'bg-emerald-500',
  retired: 'bg-slate-600',
  unknown: 'bg-slate-500',
};

const LAST_STATUS_BADGE: Record<string, string> = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  running: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const ACTIVITY_BADGE: Record<string, string> = {
  success: 'bg-emerald-500/10 text-emerald-400',
  completed: 'bg-emerald-500/10 text-emerald-400',
  error: 'bg-red-500/10 text-red-400',
  failed: 'bg-red-500/10 text-red-400',
  info: 'bg-blue-500/10 text-blue-400',
};

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'never';
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function displayName(name: string): string {
  return name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function FleetStatus() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRetired, setShowRetired] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [healthRes, activityRes] = await Promise.all([
        fetch('/api/fleet'),
        fetch('/api/fleet/activity'),
      ]);

      if (healthRes.ok) {
        const data = await healthRes.json();
        setWorkers(data.workers || []);
      }

      if (activityRes.ok) {
        const data = await activityRes.json();
        setActivity(data.logs || []);
      }
    } catch (e) {
      console.error('Fleet fetch failed', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const visibleWorkers = workers.filter(w => showRetired || w.status === 'active');
  const activeCount = workers.filter(w => w.status === 'active').length;
  const retiredCount = workers.filter(w => w.status === 'retired').length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Fleet</h2>
          <p className="text-sm text-slate-400 mt-1">
            {activeCount} active · {retiredCount} retired · {activity.length} recent event{activity.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowRetired(!showRetired)}
          className="text-xs px-2.5 py-1 rounded-full border border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-white transition-colors"
        >
          {showRetired ? 'Hide retired' : 'Show retired'}
        </button>
      </div>

      {loading && workers.length === 0 && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-slate-900/80 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Workers */}
      <div className="grid gap-3">
        {visibleWorkers.map(worker => (
          <div
            key={worker.id}
            className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <span
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${STATUS_DOT[worker.status] || STATUS_DOT.unknown}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white">{displayName(worker.name)}</span>
                    {worker.last_status && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${LAST_STATUS_BADGE[worker.last_status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                        {worker.last_status}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{worker.role}</div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 flex-wrap">
                    {worker.cron_schedule && (
                      <span className="font-mono">{worker.cron_schedule}</span>
                    )}
                    <span>last run {timeAgo(worker.last_run_at)}</span>
                    {worker.repo && (
                      <a
                        href={`https://github.com/${worker.repo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1E5BFF] hover:underline"
                      >
                        {worker.repo}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!loading && visibleWorkers.length === 0 && (
          <div className="text-center py-8 text-sm text-slate-500">
            {workers.length === 0
              ? 'No workers registered. Configure PMOS_SUPABASE_URL and PMOS_SUPABASE_SERVICE_KEY in Vercel.'
              : 'No active workers (all retired).'}
          </div>
        )}
      </div>

      {/* Recent activity */}
      {activity.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Recent activity</h3>
          <div className="space-y-2">
            {activity.slice(0, 20).map(log => (
              <div
                key={log.id}
                className="flex items-start gap-3 bg-slate-900/60 border border-slate-700/30 rounded-lg p-3"
              >
                <span className={`text-[10px] px-2 py-0.5 rounded ${ACTIVITY_BADGE[log.status] || 'bg-slate-500/10 text-slate-400'} flex-shrink-0 mt-0.5`}>
                  {log.status}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-400">{displayName(log.worker_name)}</span>
                    {' · '}
                    <span>{log.action}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {timeAgo(log.created_at)}
                    {log.brand_id && (
                      <>
                        {' · '}
                        <span className="font-mono">{log.brand_id}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
