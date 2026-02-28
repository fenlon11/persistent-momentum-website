'use client';
import { projects, phases } from '@/lib/dashboard-data';

const phaseStatusColors: Record<string, string> = {
  completed: 'bg-emerald-500',
  active: 'bg-blue-500 animate-pulse',
  upcoming: 'bg-slate-700',
};

export default function Pipeline() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Project Pipeline</h2>
        <p className="text-sm text-slate-400 mt-1">Research → Plan → Build → Market → Monetize → Analyze → Scale</p>
      </div>

      {projects.map((project) => (
        <div key={project.id} className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-3xl flex-shrink-0">{project.icon}</span>
              <div className="min-w-0">
                <div className="text-lg font-bold text-white truncate">{project.name}</div>
                <div className="text-xs text-slate-400 truncate">{project.description}</div>
              </div>
            </div>
            {project.pricing && (
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                {project.pricing}
              </span>
            )}
          </div>

          <div>
            <div className="flex gap-1">
              {phases.map((phase) => {
                const status = project.phases[phase.id].status;
                return (
                  <div key={phase.id} className="flex-1 group relative">
                    <div className={`h-2 rounded-full ${phaseStatusColors[status]}`}></div>
                    <div className="text-center mt-1">
                      <span className="text-[10px] text-slate-500 hidden sm:inline">{phase.label}</span>
                      <span className="text-[10px] text-slate-500 sm:hidden">{phase.icon}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Milestones</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {project.milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className={m.completed ? 'text-emerald-400' : 'text-slate-600'}>{m.completed ? '✅' : '⬜'}</span>
                  <span className={`flex-1 min-w-0 truncate ${m.completed ? 'text-slate-300' : 'text-slate-500'}`}>{m.label}</span>
                  {m.date && <span className="text-slate-600 flex-shrink-0">{m.date}</span>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Next Actions</div>
            <div className="space-y-1">
              {project.nextActions.map((action, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-blue-400">
                  <span className="flex-shrink-0">→</span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs border-t border-slate-700/50 pt-3">
            {project.domain && <span className="text-slate-500">{project.domain}</span>}
            <span className="text-slate-400 ml-auto">
              MRR: <span className={project.mrr > 0 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>${project.mrr}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
