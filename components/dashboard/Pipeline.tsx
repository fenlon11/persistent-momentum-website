'use client';
import { useState, useEffect, useCallback } from 'react';

interface Task {
  id: string;
  title: string;
  prompt: string;
  target_worker: string | null;
  priority: number | null;
  status: 'pending' | 'running' | 'completed' | 'failed' | string;
  source: string | null;
  product_slug: string | null;
  loop_type: string | null;
  attempt_count: number | null;
  max_attempts: number | null;
  result_summary: string | null;
  assigned_at: string | null;
  completed_at: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { icon: string; label: string; color: string; border: string }> = {
  pending: { icon: '🔵', label: 'Pending', color: 'bg-blue-500/10 text-blue-400', border: 'border-blue-500/20' },
  running: { icon: '🟡', label: 'Running', color: 'bg-amber-500/10 text-amber-400', border: 'border-amber-500/20' },
  completed: { icon: '✅', label: 'Completed', color: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/20' },
  failed: { icon: '🔴', label: 'Failed', color: 'bg-red-500/10 text-red-400', border: 'border-red-500/20' },
};

const ALL_STATUSES = ['pending', 'running', 'completed', 'failed'];

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function groupLabel(slug: string | null): string {
  if (!slug) return 'Unassigned';
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function Pipeline() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string[]>(['pending', 'running', 'failed']);
  const [productFilter, setProductFilter] = useState<string>('all');

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter.length > 0 && statusFilter.length < ALL_STATUSES.length) {
        params.set('status', statusFilter.join(','));
      }
      if (productFilter !== 'all') {
        params.set('product_slug', productFilter);
      }
      const res = await fetch(`/api/tasks?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (e) {
      console.error('Failed to fetch tasks:', e);
    }
    setLoading(false);
  }, [statusFilter, productFilter]);

  useEffect(() => {
    setLoading(true);
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const updateStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchTasks();
    } catch (e) {
      console.error('Failed to update task:', e);
    }
  };

  // Group tasks by product_slug
  const grouped = tasks.reduce<Record<string, { slug: string | null; tasks: Task[] }>>((acc, task) => {
    const key = task.product_slug || '__unassigned__';
    if (!acc[key]) {
      acc[key] = { slug: task.product_slug, tasks: [] };
    }
    acc[key].tasks.push(task);
    return acc;
  }, {});

  // Distinct products for filter
  const productSlugs = Array.from(
    new Set(tasks.map(t => t.product_slug).filter((s): s is string => !!s))
  );

  const toggleStatus = (status: string) => {
    setStatusFilter(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Task Pipeline</h2>
          <p className="text-sm text-slate-400 mt-1">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} across {Object.keys(grouped).length} product{Object.keys(grouped).length !== 1 ? 's' : ''}
            {' · '}from <span className="font-mono">cc_task_queue</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 mr-1">Status:</span>
        {ALL_STATUSES.map(s => {
          const cfg = STATUS_CONFIG[s];
          const active = statusFilter.includes(s);
          return (
            <button
              key={s}
              onClick={() => toggleStatus(s)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                active ? `${cfg.color} ${cfg.border}` : 'text-slate-500 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {cfg.icon} {cfg.label}
            </button>
          );
        })}
        {productSlugs.length > 1 && (
          <select
            value={productFilter}
            onChange={e => setProductFilter(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-700/50 rounded-lg px-2 py-1 text-slate-300 ml-auto"
          >
            <option value="all">All products</option>
            {productSlugs.map(slug => (
              <option key={slug} value={slug}>{groupLabel(slug)}</option>
            ))}
          </select>
        )}
      </div>

      {/* Loading */}
      {loading && tasks.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-900/80 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Grouped */}
      {Object.entries(grouped).map(([key, { slug, tasks: groupTasks }]) => (
        <div key={key} className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{groupLabel(slug)}</span>
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{groupTasks.length}</span>
            </div>
          </div>

          <div className="space-y-2">
            {groupTasks.map(task => {
              const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
              return (
                <div key={task.id} className="flex items-start gap-3 group">
                  <span className="text-sm mt-0.5 flex-shrink-0">{cfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-white">{task.title}</span>
                      {task.priority && task.priority > 0 && (
                        <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded">P{task.priority}</span>
                      )}
                      {task.loop_type && (
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{task.loop_type}</span>
                      )}
                      {task.target_worker && (
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">{task.target_worker}</span>
                      )}
                    </div>
                    {(task.result_summary || task.prompt) && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                        {task.result_summary || task.prompt}
                      </p>
                    )}
                    <div className="text-[11px] text-slate-600 mt-1">
                      {timeAgo(task.created_at)}
                      {task.attempt_count != null && task.max_attempts != null && task.attempt_count > 0 && (
                        <> · attempt {task.attempt_count}/{task.max_attempts}</>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => updateStatus(task.id, 'completed')}
                        className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded hover:bg-emerald-500/20 transition-colors"
                        title="Mark complete"
                      >
                        Done
                      </button>
                    )}
                    <select
                      value={task.status}
                      onChange={e => updateStatus(task.id, e.target.value)}
                      className="text-[10px] bg-slate-800 border border-slate-700/50 rounded px-1 py-0.5 text-slate-400"
                    >
                      {ALL_STATUSES.map(s => (
                        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {!loading && tasks.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          No tasks match the current filters.
        </div>
      )}
    </div>
  );
}
