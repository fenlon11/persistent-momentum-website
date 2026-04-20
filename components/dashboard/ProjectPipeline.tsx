'use client';

import { useState, useEffect } from 'react';
import { phases } from '@/lib/dashboard-data';
import type { Phase } from '@/lib/dashboard-data';

interface ApiProject {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  stage: string;
  currentPhase: Phase;
  phases: Record<Phase, { status: 'completed' | 'active' | 'upcoming' }>;
  milestones: Array<{ label: string; completed: boolean; date?: string }>;
  nextActions: string[];
  pricing: string | null;
  domain: string | null;
  mrr: number;
  completionPct: number | null;
  lastSyncedAt: string | null;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'never';
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function PhaseTimeline({ project }: { project: ApiProject }) {
  return (
    <div className="relative mt-4 mb-2">
      <div className="absolute top-3 left-3 right-3 h-0.5 bg-slate-700/50" />
      <div className="relative flex justify-between">
        {phases.map((phase) => {
          const status = project.phases[phase.id].status;
          return (
            <div key={phase.id} className="flex flex-col items-center z-10" style={{ width: `${100 / 7}%` }}>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] ${
                  status === 'completed'
                    ? 'bg-emerald-500 border-emerald-400'
                    : status === 'active'
                    ? 'border-[#1E5BFF] bg-[#1E5BFF] animate-pulse'
                    : 'bg-slate-800 border-slate-600'
                }`}
              >
                {status === 'completed' ? '✓' : ''}
              </div>
              <span
                className={`text-[10px] mt-1.5 leading-tight text-center ${
                  status === 'completed'
                    ? 'text-emerald-400'
                    : status === 'active'
                    ? 'text-[#1E5BFF] font-medium'
                    : 'text-slate-600'
                }`}
              >
                {phase.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MRRBadge({ mrr }: { mrr: number }) {
  const isZero = mrr === 0;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isZero
          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      }`}
    >
      ${mrr.toLocaleString()} MRR
    </span>
  );
}

function ProjectCard({ project }: { project: ApiProject }) {
  const completedMilestones = project.milestones.filter((m) => m.completed).length;
  const totalMilestones = project.milestones.length;

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30 backdrop-blur-xl rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{project.icon}</span>
          <div>
            <h3 className="text-white font-semibold text-sm">{project.name}</h3>
            <p className="text-slate-400 text-xs mt-0.5">{project.description}</p>
          </div>
        </div>
        <MRRBadge mrr={project.mrr} />
      </div>

      {(project.domain || project.pricing || project.completionPct !== null) && (
        <div className="flex flex-wrap gap-3 mb-3 text-xs">
          {project.domain && (
            <a
              href={`https://${project.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1E5BFF] hover:underline"
            >
              {project.domain}
            </a>
          )}
          {project.pricing && <span className="text-slate-500">{project.pricing}</span>}
          {project.completionPct !== null && (
            <span className="text-slate-500">{project.completionPct}% complete</span>
          )}
        </div>
      )}

      <PhaseTimeline project={project} />

      {totalMilestones > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            Milestones ({completedMilestones}/{totalMilestones})
          </h4>
          <div className="space-y-1.5">
            {project.milestones.map((m, i) => (
              <label key={i} className="flex items-center gap-2 text-xs cursor-default">
                <span
                  className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center ${
                    m.completed
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'border-slate-600 bg-slate-800/50'
                  }`}
                >
                  {m.completed && (
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className={m.completed ? 'text-slate-400 line-through' : 'text-slate-300'}>{m.label}</span>
                {m.date && <span className="text-slate-600 ml-auto">{m.date}</span>}
              </label>
            ))}
          </div>
        </div>
      )}

      {project.nextActions.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Next actions</h4>
          <div className="border-l-2 border-[#1E5BFF]/30 pl-3 space-y-1.5">
            {project.nextActions.map((action, i) => (
              <p key={i} className="text-xs text-slate-300">
                {action}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-700/30 text-[10px] text-slate-600 flex items-center justify-between">
        <span className="font-mono">{project.stage}</span>
        <span>synced {timeAgo(project.lastSyncedAt)}</span>
      </div>
    </div>
  );
}

export default function ProjectPipeline() {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || 'Failed to load projects');
        } else {
          setProjects(data.projects || []);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const totalMilestones = projects.reduce((sum, p) => sum + p.milestones.length, 0);
  const completedMilestones = projects.reduce((sum, p) => sum + p.milestones.filter((m) => m.completed).length, 0);
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  return (
    <div>
      {/* Overall progress — hidden if no milestones tracked yet */}
      {totalMilestones > 0 && (
        <div className="mb-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30 backdrop-blur-xl rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300 font-medium">Pipeline progress</span>
            <span className="text-xs text-slate-400">
              {completedMilestones} of {totalMilestones} milestones completed
            </span>
          </div>
          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-[#1E5BFF] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {loading && projects.length === 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-slate-900/80 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="text-center py-12 text-sm text-slate-500">
          {error
            ? `Error: ${error}`
            : 'No projects in project_state. Add a row to the table to see it here.'}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
