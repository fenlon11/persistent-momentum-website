'use client';
import { useState, useEffect } from 'react';
import { workers } from '@/lib/workers-data';

interface WorkerHealth { id: string; status: string; lastModified?: string; }
interface ActivityLog { id: string; worker_name: string; action: string; status: string; created_at: string; }

export default function FleetStatus() {
  const [health, setHealth] = useState<WorkerHealth[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthRes, activityRes] = await Promise.all([
          fetch('/api/workers/health'),
          fetch('/api/workers/activity'),
        ]);
        if (healthRes.ok) { const data = await healthRes.json(); setHealth(data.workers || []); }
        if (activityRes.ok) { const data = await activityRes.json(); setActivity(data.logs || []); }
      } catch (e) { console.error('Fleet fetch error:', e); }
      setLoading(false);
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getWorkerStatus = (workerId: string) => health.find(w => w.id === workerId)?.status || 'unknown';
  const statusDot = (status: string) => {
    const colors: Record<string, string> = { active: 'bg-emerald-500 animate-pulse', error: 'bg-red-500', unknown: 'bg-amber-500' };
    return colors[status] || colors.unknown;
  };
  const activeCount = workers.filter(w => getWorkerStatus(w.id) === 'active').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Worker Fleet</h2>
        <p className="text-sm text-slate-400 mt-1">{activeCount}/{workers.length} workers active</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-white">{workers.length}</div>
          <div className="text-xs text-slate-500">Total</div>
        </div>
        <div className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-emerald-400">{activeCount}</div>
          <div className="text-xs text-slate-500">Active</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-amber-400">{workers.length - activeCount}</div>
          <div className="text-xs text-slate-500">Unknown</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {workers.map((worker) => {
          const status = getWorkerStatus(worker.id);
          return (
            <div key={worker.id} className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-3 flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{worker.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white truncate">{worker.name}</span>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot(status)}`}></span>
                </div>
                <div className="text-xs text-slate-400 truncate">{worker.description}</div>
                {worker.schedule && <div className="text-xs text-slate-500 mt-1">⏰ {worker.schedule}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <div className="text-sm font-semibold text-white mb-3">Activity Feed</div>
        {loading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-slate-800 rounded-lg animate-pulse"></div>)}</div>
        ) : activity.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {activity.map((log) => (
              <div key={log.id} className="bg-slate-900/50 rounded-lg p-3 flex items-center gap-3 text-xs">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${log.status === 'success' ? 'bg-emerald-500' : log.status === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                <div className="flex-1 min-w-0">
                  <span className="text-slate-300 font-medium">{log.worker_name}</span>
                  <span className="text-slate-500"> — {log.action}</span>
                </div>
                <span className="text-slate-600 whitespace-nowrap flex-shrink-0">{new Date(log.created_at).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 text-xs py-6 bg-slate-900/50 rounded-lg">
            No activity logs yet. Workers will report here once Supabase logging is configured.
          </div>
        )}
      </div>
    </div>
  );
}
