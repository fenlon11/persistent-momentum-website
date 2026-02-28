'use client';
import { useState, useEffect, useCallback } from 'react';

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface Task {
  id: string;
  brand_id: string;
  title: string;
  description: string | null;
  priority: number;
  status: 'queued' | 'in_progress' | 'blocked' | 'completed' | 'cancelled';
  tags: string[];
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  brands: Brand;
}

const STATUS_CONFIG: Record<string, { icon: string; label: string; color: string; border: string }> = {
  queued: { icon: '🔵', label: 'Queued', color: 'bg-blue-500/10 text-blue-400', border: 'border-blue-500/20' },
  in_progress: { icon: '🟡', label: 'In Progress', color: 'bg-amber-500/10 text-amber-400', border: 'border-amber-500/20' },
  blocked: { icon: '🔴', label: 'Blocked', color: 'bg-red-500/10 text-red-400', border: 'border-red-500/20' },
  completed: { icon: '✅', label: 'Completed', color: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/20' },
  cancelled: { icon: '⚫', label: 'Cancelled', color: 'bg-slate-500/10 text-slate-400', border: 'border-slate-500/20' },
};

const ALL_STATUSES = ['queued', 'in_progress', 'blocked', 'completed', 'cancelled'];

export default function Pipeline() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string[]>(['queued', 'in_progress', 'blocked']);
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [addingFor, setAddingFor] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState(0);
  const [newTags, setNewTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter.length > 0 && statusFilter.length < ALL_STATUSES.length) {
        params.set('status', statusFilter.join(','));
      }
      if (brandFilter !== 'all') {
        params.set('brand_id', brandFilter);
      }
      const res = await fetch(`/api/tasks?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
        setBrands(data.brands || []);
      }
    } catch (e) {
      console.error('Failed to fetch tasks:', e);
    }
    setLoading(false);
  }, [statusFilter, brandFilter]);

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

  const addTask = async (brandId: string) => {
    if (!newTitle.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_id: brandId,
          title: newTitle.trim(),
          priority: newPriority,
          tags: newTags ? newTags.split(',').map(t => t.trim()).filter(Boolean) : [],
        }),
      });
      if (res.ok) {
        setAddingFor(null);
        setNewTitle('');
        setNewPriority(0);
        setNewTags('');
        fetchTasks();
      }
    } catch (e) {
      console.error('Failed to add task:', e);
    }
    setSubmitting(false);
  };

  // Group tasks by brand
  const grouped = tasks.reduce<Record<string, { brand: Brand; tasks: Task[] }>>((acc, task) => {
    const brandId = task.brand_id;
    if (!acc[brandId]) {
      acc[brandId] = { brand: task.brands, tasks: [] };
    }
    acc[brandId].tasks.push(task);
    return acc;
  }, {});

  const toggleStatus = (status: string) => {
    setStatusFilter(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const totalTasks = tasks.length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Task Pipeline</h2>
          <p className="text-sm text-slate-400 mt-1">{totalTasks} task{totalTasks !== 1 ? 's' : ''} across {Object.keys(grouped).length} project{Object.keys(grouped).length !== 1 ? 's' : ''}</p>
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
        {brands.length > 1 && (
          <select
            value={brandFilter}
            onChange={e => setBrandFilter(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-700/50 rounded-lg px-2 py-1 text-slate-300 ml-auto"
          >
            <option value="all">All Projects</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
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

      {/* Grouped by project */}
      {Object.entries(grouped).map(([brandId, { brand, tasks: brandTasks }]) => (
        <div key={brandId} className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{brand.name}</span>
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{brandTasks.length}</span>
            </div>
            <button
              onClick={() => setAddingFor(addingFor === brandId ? null : brandId)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Add Task
            </button>
          </div>

          {/* Inline add form */}
          {addingFor === brandId && (
            <div className="bg-slate-800/50 rounded-lg p-3 space-y-2 border border-slate-700/30">
              <input
                type="text"
                placeholder="Task title..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/50 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                autoFocus
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Priority"
                  value={newPriority || ''}
                  onChange={e => setNewPriority(parseInt(e.target.value) || 0)}
                  className="w-20 bg-slate-900 border border-slate-700/50 rounded-lg px-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                />
                <input
                  type="text"
                  placeholder="Tags (comma-separated)"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700/50 rounded-lg px-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                />
                <button
                  onClick={() => addTask(brandId)}
                  disabled={submitting || !newTitle.trim()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs rounded-lg transition-colors"
                >
                  {submitting ? '...' : 'Add'}
                </button>
                <button
                  onClick={() => { setAddingFor(null); setNewTitle(''); setNewPriority(0); setNewTags(''); }}
                  className="px-2 py-1.5 text-slate-400 hover:text-white text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Task list */}
          <div className="space-y-2">
            {brandTasks.map(task => {
              const cfg = STATUS_CONFIG[task.status];
              return (
                <div key={task.id} className="flex items-start gap-3 group">
                  <span className="text-sm mt-0.5 flex-shrink-0">{cfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-white">{task.title}</span>
                      {task.priority > 0 && (
                        <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded">P{task.priority}</span>
                      )}
                      {task.tags?.map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{task.description}</p>
                    )}
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
