'use client';
import { useState, useEffect, useCallback } from 'react';

interface SystemHealth {
  id: string;
  service_name: string;
  service_type: string;
  status: 'healthy' | 'degraded' | 'down' | 'unknown';
  last_check_at: string | null;
  last_healthy_at: string | null;
  endpoint_url: string | null;
  metadata: {
    description?: string;
    schedule?: string;
    icon?: string;
    category?: string;
    [key: string]: unknown;
  } | null;
  created_at: string;
}

interface ActivityLog {
  id: string;
  worker_name: string;
  action: string;
  status: 'success' | 'error' | 'info';
  details: Record<string, unknown> | null;
  brand_id: string | null;
  created_at: string;
}

const STATUS_DOT: Record<string, string> = {
  healthy: 'bg-emerald-500',
  degraded: 'bg-amber-500 animate-pulse',
  down: 'bg-red-500',
  unknown: 'bg-slate-500',
};

const ACTIVITY_BADGE: Record<string, string> = {
  success: 'bg-emerald-500/10 text-emerald-400',
  error: 'bg-red-500/10 text-red-400',
  info: 'bg-blue-500/10 text-blue-400',
};

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function displayName(serviceName: string): string {
  return serviceName
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export default function FleetStatus() {
  const [workers, setWorkers] = useState<SystemHealth[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Fleet fetch error:', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const healthyCount = workers.filter(w => w.status === 'healthy').length;
  const degradedCount = workers.filter(w => w.status === 'degraded' || w.status === 'down').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Worker Fleet</h2>
        <p className="text-sm text-slate-400 mt-1">
          {loading ? 'Loading...' : `${healthyCount}/${workers.length} workers healthy`}
        </p>
      </div>

      {/* Stats bar */}
      {!loading && workers.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{workers.length}</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
          <div className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-emerald-400">{healthyCount}</div>
            <div className="text-xs text-slate-500">Healthy</div>
          </div>
          <div className={`bg-slate-900/80 border ${degradedCount > 0 ? 'border-red-500/20' : 'border-slate-700/50'} rounded-xl p-3 text-center`}>
            <div className={`text-2xl font-bold ${degradedCount > 0 ? 'text-red-400' : 'text-slate-400'}`}>{degradedCount}</div>
            <div className="text-xs text-slate-500">Issues</div>
          </div>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-slate-900/80 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-slate-900/80 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Worker grid */}
      {!loading && workers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {workers.map(worker => (
            <div key={worker.id} className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-3 flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{worker.metadata?.icon || '⚡'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white truncate">
                    {displayName(worker.service_name)}
                  </span>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[worker.status]}`} />
                </div>
                <div className="text-xs text-slate-400 truncate mt-0.5">
                  {worker.metadata?.description || worker.service_type}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
                  {worker.metadata?.schedule && (
                    <span>⏰ {worker.metadata.schedule}</span>
                  )}
                  {worker.last_check_at && (
                    <span>Checked {timeAgo(worker.last_check_at)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && workers.length === 0 && (
        <div className="text-center text-slate-500 text-sm py-8 bg-slate-900/50 rounded-xl border border-slate-700/50">
          No workers registered yet.
        </div>
      )}

      {/* Activity Feed */}
      <div>
        <div className="text-sm font-semibold text-white mb-3">Activity Feed</div>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : activity.length > 0 ? (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {activity.map(log => (
              <div key={log.id} className="bg-slate-900/50 rounded-lg p-3 flex items-center gap-3 text-xs">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  ACTIVITY_BADGE[log.status]?.includes('emerald') ? 'bg-emerald-500' :
                  ACTIVITY_BADGE[log.status]?.includes('red') ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <span className="text-slate-300 font-medium">{log.worker_name}</span>
                  <span className="text-slate-500"> — {log.action}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${ACTIVITY_BADGE[log.status] || 'bg-slate-500/10 text-slate-400'}`}>
                  {log.status}
                </span>
                <span className="text-slate-600 whitespace-nowrap flex-shrink-0">
                  {timeAgo(log.created_at)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 text-xs py-6 bg-slate-900/50 rounded-lg">
            No activity logs yet.
          </div>
        )}
      </div>
    </div>
  );
}
