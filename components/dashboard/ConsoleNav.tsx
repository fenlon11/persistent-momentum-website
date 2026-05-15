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
    <div
      className="sticky top-[60px] z-10 -mx-5 sm:-mx-8"
      style={{
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="flex overflow-x-auto px-5 sm:px-8" style={{ scrollbarWidth: 'none' }}>
        {AREAS.map((a) => {
          const isActive = a.id === active;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onChange(a.id)}
              className="group relative flex flex-shrink-0 flex-col items-start whitespace-nowrap px-5 py-3 text-left transition-colors"
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className="text-[10px] font-semibold tracking-widest"
                style={{
                  color: isActive
                    ? 'var(--color-primary)'
                    : 'var(--color-text-dark-muted)',
                  letterSpacing: '0.12em',
                }}
              >
                {String(AREAS.indexOf(a) + 1).padStart(2, '0')}
              </span>
              <span
                className="text-sm font-semibold"
                style={{
                  color: isActive
                    ? 'var(--color-text-dark)'
                    : 'var(--color-text-dark-muted)',
                }}
              >
                {a.label}
              </span>
              {isActive && (
                <span
                  aria-hidden
                  className="absolute -bottom-px left-0 right-0 h-[2px]"
                  style={{ background: 'var(--color-primary)' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
