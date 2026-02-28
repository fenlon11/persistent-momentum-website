'use client';

import { projects, phases } from '@/lib/dashboard-data';
import type { Project, Phase } from '@/lib/dashboard-data';

function PhaseTimeline({ project }: { project: Project }) {
  return (
    <div className="relative mt-4 mb-2">
      {/* Connecting line */}
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
                    ? 'border-[#3E8BF5] bg-[#3E8BF5] animate-pulse'
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
                    ? 'text-[#3E8BF5] font-medium'
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

function ProjectCard({ project }: { project: Project }) {
  const completedMilestones = project.milestones.filter((m) => m.completed).length;
  const totalMilestones = project.milestones.length;

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30 backdrop-blur-xl rounded-2xl p-5">
      {/* Header */}
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

      {/* Domain + Pricing */}
      {(project.domain || project.pricing) && (
        <div className="flex flex-wrap gap-3 mb-3 text-xs">
          {project.domain && (
            <a
              href={`https://${project.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3E8BF5] hover:underline"
            >
              {project.domain}
            </a>
          )}
          {project.pricing && <span className="text-slate-500">{project.pricing}</span>}
        </div>
      )}

      {/* Phase Timeline */}
      <PhaseTimeline project={project} />

      {/* Milestones */}
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

      {/* Next Actions */}
      {project.nextActions.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Next Actions</h4>
          <div className="border-l-2 border-[#3E8BF5]/30 pl-3 space-y-1.5">
            {project.nextActions.map((action, i) => (
              <p key={i} className="text-xs text-slate-300">
                {action}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectPipeline() {
  const totalMilestones = projects.reduce((sum, p) => sum + p.milestones.length, 0);
  const completedMilestones = projects.reduce((sum, p) => sum + p.milestones.filter((m) => m.completed).length, 0);
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  return (
    <div>
      {/* Overall progress */}
      <div className="mb-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30 backdrop-blur-xl rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-300 font-medium">Pipeline Progress</span>
          <span className="text-xs text-slate-400">
            {completedMilestones} of {totalMilestones} milestones completed
          </span>
        </div>
        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-[#3E8BF5] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Project cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
