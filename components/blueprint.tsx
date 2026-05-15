// Blueprint primitives — the visual system for the corporate site.
// Brief: ~/pmOS/brain/Designs/persistent-momentum-website-redesign/README.md
//
// Restrained, precise, technical. Don't add decorative variants. If you need
// something new, ask whether the brief actually calls for it.

import type { ReactNode } from 'react';

/* ───────────────────────────── Sheet ───────────────────────────── */
/* Section wrapper with optional drafting-style "SHEET N / TOTAL — TITLE"     */
/* header rule. The blueprint's structural unit.                              */
export function Sheet({
  id,
  sheet,
  total,
  title,
  className = '',
  raised = false,
  children,
}: {
  id?: string;
  sheet?: string;
  total?: string;
  title?: string;
  className?: string;
  raised?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative border-b border-white/8 ${
        raised ? 'bg-navy-raised blueprint-grid-fine' : ''
      } ${className}`}
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        {(sheet || title) && (
          <div className="mb-10 flex items-center gap-4 sm:mb-14">
            {sheet && (
              <span className="annotation-bright">
                Sheet {sheet}
                {total ? ` / ${total}` : ''}
              </span>
            )}
            <span className="hairline h-px flex-1" />
            {title && <span className="annotation">{title}</span>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/* ──────────────────────────── Annotation ─────────────────────────── */
/* Mono uppercase tick label. Use sparingly — one or two per section.        */
export function Annotation({
  children,
  bright = false,
  className = '',
}: {
  children: ReactNode;
  bright?: boolean;
  className?: string;
}) {
  return (
    <span className={`${bright ? 'annotation-bright' : 'annotation'} ${className}`}>
      {children}
    </span>
  );
}

/* ─────────────────────────── Hairline ─────────────────────────── */
/* Thin schematic line. Horizontal or vertical, optional accent.            */
export function Hairline({
  vertical = false,
  accent = false,
  strong = false,
  className = '',
}: {
  vertical?: boolean;
  accent?: boolean;
  strong?: boolean;
  className?: string;
}) {
  const stroke = accent ? 'hairline-accent' : strong ? 'hairline-strong' : 'hairline';
  return (
    <span
      aria-hidden
      className={`block ${stroke} ${vertical ? 'w-px h-full' : 'h-px w-full'} ${className}`}
    />
  );
}

/* ─────────────────────────── Frame ─────────────────────────── */
/* Container with corner crop marks. Use for cards/diagrams that need to    */
/* read as schematic regions, not for every box.                            */
export function Frame({
  className = '',
  children,
  padded = true,
}: {
  className?: string;
  children: ReactNode;
  padded?: boolean;
}) {
  return (
    <div
      className={`corner-marks relative ${
        padded ? 'p-6 sm:p-8' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────── Tick ─────────────────────────── */
/* Small accent dot or square — schematic node marker. */
export function Tick({
  shape = 'dot',
  className = '',
}: {
  shape?: 'dot' | 'square';
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-block ${
        shape === 'dot' ? 'rounded-full' : ''
      } h-1.5 w-1.5 bg-electric ${className}`}
    />
  );
}

/* ─────────────────────────── Titleblock ─────────────────────────── */
/* Drafting titleblock — a metadata grid like the corner of a real          */
/* schematic. Used for the site footer. Cells are real fields, not decor.   */
export function Titleblock({ cells }: { cells: { label: string; value: ReactNode }[] }) {
  return (
    <div className="grid grid-cols-2 overflow-hidden border border-white/10 sm:grid-cols-4">
      {cells.map((cell, i) => (
        <div
          key={i}
          className={`px-4 py-3 ${
            i % 2 === 1 ? 'border-l border-white/10' : ''
          } ${i >= 2 ? 'border-t border-white/10 sm:border-t-0' : ''} ${
            i % 4 !== 0 ? 'sm:border-l sm:border-white/10' : ''
          }`}
        >
          <p className="annotation mb-1">{cell.label}</p>
          <p className="font-mono text-xs leading-tight text-glow">{cell.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────── Dimension ─────────────────────────── */
/* Schematic stat — `┤ FIGURE ├` with mono label under. For the math/stats. */
export function Dimension({
  figure,
  label,
  detail,
}: {
  figure: ReactNode;
  label: string;
  detail?: string;
}) {
  return (
    <div className="relative px-6 py-7">
      {/* dimension tick marks left/right of the figure */}
      <div className="flex items-center gap-3">
        <span aria-hidden className="hairline-strong h-3 w-px" />
        <span className="font-mono text-3xl font-semibold leading-none tracking-tight text-electric sm:text-4xl">
          {figure}
        </span>
        <span aria-hidden className="hairline-strong h-3 w-px" />
      </div>
      <p className="mt-4 text-sm font-semibold text-white">{label}</p>
      {detail && <p className="mt-1.5 text-sm leading-relaxed text-mid">{detail}</p>}
    </div>
  );
}
