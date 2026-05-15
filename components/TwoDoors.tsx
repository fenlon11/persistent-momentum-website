import Link from 'next/link';
import { Sheet } from './blueprint';

const doors = [
  {
    href: '/contact',
    label: 'Investors, partners, press',
    title: 'Talk to us',
    detail:
      'Acquirers, distribution partners, journalists — start here. The corporate side runs through this door.',
  },
  {
    href: '/careers',
    label: 'Builders',
    title: 'Build with us',
    detail:
      'Small team, fast cycles, real software shipped without six-month roadmap meetings. Send what you have shipped.',
  },
];

export default function TwoDoors() {
  return (
    <Sheet sheet="06 / 06" title="Two doors" raised>
      <div className="grid gap-px overflow-hidden border border-white/12 bg-white/12 md:grid-cols-2">
        {doors.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="group relative flex flex-col bg-navy p-8 transition-colors hover:bg-navy-raised sm:p-10"
          >
            {/* corner ticks */}
            <span
              aria-hidden
              className="absolute left-0 top-0 h-3 w-3 border-l border-t border-electric/60"
            />
            <span
              aria-hidden
              className="absolute right-0 bottom-0 h-3 w-3 border-b border-r border-electric/60"
            />

            <p className="annotation-bright mb-4">{d.label}</p>
            <h3 className="text-2xl font-semibold tracking-tight text-white">
              {d.title}
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-mid">
              {d.detail}
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-electric transition-colors group-hover:text-ice">
              {d.label.split(',')[0] === 'Builders' ? 'See open problems' : 'Get in touch'}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </Sheet>
  );
}
