'use client';

export type DashboardArea = 'console' | 'operations' | 'portfolio' | 'knowledge' | 'config';

export const AREAS: { id: DashboardArea; label: string; sub: string }[] = [
  { id: 'console', label: 'Console', sub: 'Overview · health · queue · revenue' },
  { id: 'operations', label: 'Operations', sub: 'Pipeline · agents · system' },
  { id: 'portfolio', label: 'Portfolio', sub: 'Products · revenue · analytics' },
  { id: 'knowledge', label: 'Knowledge', sub: 'Skills · memory · CLAUDE.md' },
  { id: 'config', label: 'Config', sub: 'Secrets · environment' },
];

export default function ConsoleNav({
  active,
  onChange,
}: {
  active: DashboardArea;
  onChange: (a: DashboardArea) => void;
}) {
  return (
    <div className="sticky top-0 z-40 -mx-5 border-y border-white/12 bg-navy/95 backdrop-blur-md sm:-mx-8">
      <div className="scrollbar-hide flex overflow-x-auto px-5 sm:px-8">
        {AREAS.map((a) => {
          const isActive = a.id === active;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onChange(a.id)}
              className={`group relative flex flex-shrink-0 flex-col items-start whitespace-nowrap px-5 py-3 text-left transition-colors ${
                isActive ? '' : 'hover:bg-white/[0.02]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={`font-mono text-[10px] tracking-widest ${
                  isActive ? 'text-electric' : 'text-mid'
                }`}
              >
                {String(AREAS.indexOf(a) + 1).padStart(2, '0')}
              </span>
              <span
                className={`text-sm font-semibold ${
                  isActive ? 'text-white' : 'text-mid group-hover:text-glow'
                }`}
              >
                {a.label}
              </span>
              {isActive && (
                <span
                  aria-hidden
                  className="absolute -bottom-px left-0 right-0 h-px bg-electric"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
