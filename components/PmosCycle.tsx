import { Sheet } from './blueprint';

// pmOS cycle — the schematic centerpiece.
// Rendered as a horizontal SVG flow at >= md, a vertical stack on mobile.

type Station = {
  num: string;
  name: string;
  detail: string;
};

const stations: Station[] = [
  { num: '01', name: 'Research', detail: 'Markets, competitors, and real demand signals.' },
  { num: '02', name: 'Plan', detail: 'Business plan, brand, and a tight build spec.' },
  { num: '03', name: 'Build', detail: 'A full product shipped by an autonomous build loop.' },
  { num: '04', name: 'Ship', detail: 'Deploy, domain, billing, and smoke tests.' },
  { num: '05', name: 'Market', detail: 'Content and social automation drive the funnel.' },
  { num: '06', name: 'Analyze', detail: 'Metrics in, learnings out. The system improves.' },
];

export default function PmosCycle() {
  return (
    <Sheet sheet="03 / 06" title="The system">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 className="text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-[2.25rem]">
            pmOS is the factory.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-mid sm:text-lg">
            pmOS is the repeatable system that builds and scales every product
            in the portfolio — taking an idea from research to revenue with
            minimal human work.
          </p>
          <p className="mt-4 text-base leading-relaxed text-mid sm:text-lg">
            Each run makes the next one cheaper and faster. Anyone can build one
            product. The factory is the moat.
          </p>
          <p className="annotation mt-8">
            research &rarr; plan &rarr; build &rarr; ship &rarr; market &rarr; analyze &rarr; repeat
          </p>
        </div>

        <div className="lg:col-span-7">
          {/* Desktop / tablet: SVG schematic */}
          <div className="hidden md:block">
            <CycleSchematic />
          </div>

          {/* Mobile: vertical stack */}
          <div className="md:hidden">
            <CycleStack />
          </div>
        </div>
      </div>
    </Sheet>
  );
}

/* ───────────────────── Desktop SVG schematic ───────────────────── */

export function CycleSchematic() {
  // Grid: 3 columns × 2 rows of stations, with a return path from the last
  // station back to the first. Compact, readable, no horizontal scroll.
  // ViewBox carefully sized so stroke width 1 renders as a real hairline.
  const cols = 3;
  const cellW = 180;
  const cellH = 110;
  const padX = 16;
  const padY = 12;
  const totalW = cols * cellW + 2 * padX;
  const rows = 2;
  const totalH = rows * cellH + 2 * padY + 26; // extra for return arc

  // Position helpers
  function pos(i: number) {
    const row = Math.floor(i / cols);
    const col = row % 2 === 0 ? i % cols : cols - 1 - (i % cols); // serpentine
    return {
      x: padX + col * cellW,
      y: padY + row * cellH,
      cx: padX + col * cellW + cellW / 2,
      cy: padY + row * cellH + cellH / 2,
      col,
      row,
    };
  }

  return (
    <figure
      aria-label="The pmOS cycle: research, plan, build, ship, market, analyze, repeat."
      className="corner-marks relative"
    >
      {/* Sheet title for the diagram */}
      <figcaption className="annotation mb-4">Diagram &middot; The cycle</figcaption>

      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        className="block h-auto w-full"
        role="img"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#A8C5FF" opacity="0.55" />
          </marker>
          <marker
            id="arrow-accent"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#1E5BFF" opacity="0.9" />
          </marker>
        </defs>

        {/* Connectors between stations */}
        {stations.slice(0, -1).map((_, i) => {
          const a = pos(i);
          const b = pos(i + 1);
          if (a.row === b.row) {
            // horizontal, serpentine direction
            const goingRight = b.col > a.col;
            const x1 = a.cx + (goingRight ? 56 : -56);
            const x2 = b.cx + (goingRight ? -56 : 56);
            return (
              <line
                key={i}
                x1={x1}
                y1={a.cy}
                x2={x2}
                y2={b.cy}
                stroke="#A8C5FF"
                strokeOpacity="0.35"
                strokeWidth="1"
                markerEnd="url(#arrow)"
              />
            );
          }
          // vertical drop at the row end (right side on row 0, left side on row 1)
          const x = a.cx + (a.col === cols - 1 ? 56 : -56);
          return (
            <line
              key={i}
              x1={x}
              y1={a.cy}
              x2={x}
              y2={b.cy}
              stroke="#A8C5FF"
              strokeOpacity="0.35"
              strokeWidth="1"
              markerEnd="url(#arrow)"
            />
          );
        })}

        {/* Return loop — from station 06 (bottom-left) back up to station 01 (top-left) */}
        {(() => {
          const last = pos(stations.length - 1);
          const first = pos(0);
          // last is at col 0 row 1 (serpentine puts station 06 there)
          const leftX = last.cx - 56;
          const xLeft = padX - 6;
          return (
            <path
              key="return"
              d={`M ${leftX} ${last.cy}
                  L ${xLeft} ${last.cy}
                  L ${xLeft} ${first.cy}
                  L ${first.cx - 56} ${first.cy}`}
              fill="none"
              stroke="#1E5BFF"
              strokeOpacity="0.55"
              strokeWidth="1"
              strokeDasharray="3 3"
              markerEnd="url(#arrow-accent)"
            />
          );
        })()}

        {/* Stations */}
        {stations.map((s, i) => {
          const p = pos(i);
          return (
            <g key={s.num}>
              {/* station rect */}
              <rect
                x={p.cx - 56}
                y={p.cy - 22}
                width="112"
                height="44"
                fill="#0C1838"
                stroke="#A8C5FF"
                strokeOpacity="0.35"
                strokeWidth="1"
              />
              {/* corner ticks */}
              <path
                d={`M ${p.cx - 56} ${p.cy - 22 + 5} L ${p.cx - 56} ${p.cy - 22} L ${p.cx - 56 + 5} ${p.cy - 22}`}
                stroke="#1E5BFF"
                strokeOpacity="0.8"
                strokeWidth="1"
                fill="none"
              />
              <path
                d={`M ${p.cx + 56 - 5} ${p.cy + 22} L ${p.cx + 56} ${p.cy + 22} L ${p.cx + 56} ${p.cy + 22 - 5}`}
                stroke="#1E5BFF"
                strokeOpacity="0.8"
                strokeWidth="1"
                fill="none"
              />
              {/* station number */}
              <text
                x={p.cx}
                y={p.cy - 4}
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="9"
                fill="#1E5BFF"
                letterSpacing="0.18em"
              >
                {s.num}
              </text>
              {/* station name */}
              <text
                x={p.cx}
                y={p.cy + 12}
                textAnchor="middle"
                fontFamily="system-ui, sans-serif"
                fontSize="13"
                fontWeight="600"
                fill="#E6EEFF"
              >
                {s.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Schematic legend */}
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="block h-px w-8"
            style={{
              background:
                'repeating-linear-gradient(to right, rgba(30,91,255,0.7) 0 3px, transparent 3px 6px)',
            }}
          />
          <span className="annotation">Return loop &middot; repeat</span>
        </div>
        <div className="flex items-center gap-2">
          <span aria-hidden className="block h-px w-8 bg-ice/40" />
          <span className="annotation">Forward step</span>
        </div>
      </div>
    </figure>
  );
}

/* ───────────────────── Mobile vertical stack ───────────────────── */

export function CycleStack() {
  return (
    <ol className="relative space-y-5">
      {/* Connecting vertical hairline */}
      <span
        aria-hidden
        className="absolute left-[15px] top-3 bottom-3 w-px bg-ice/25"
      />
      {stations.map((s) => (
        <li key={s.num} className="relative flex gap-4 pl-0">
          <span
            aria-hidden
            className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center border border-electric/60 bg-navy font-mono text-[10px] tracking-widest text-electric"
          >
            {s.num}
          </span>
          <div>
            <p className="text-base font-semibold leading-snug text-white">
              {s.name}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-mid">{s.detail}</p>
          </div>
        </li>
      ))}
      <li className="relative flex items-center gap-4 pl-0">
        <span
          aria-hidden
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-electric/80 bg-navy font-mono text-[10px] tracking-widest text-electric"
        >
          ↺
        </span>
        <p className="annotation-bright">Repeat</p>
      </li>
    </ol>
  );
}
