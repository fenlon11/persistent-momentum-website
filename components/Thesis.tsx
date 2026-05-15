import { Sheet } from './blueprint';

export default function Thesis() {
  return (
    <Sheet sheet="02 / 06" title="The thesis">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-[2.25rem]">
            Portfolio velocity beats single-product velocity.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-mid sm:text-lg">
            Anyone can build one product. The system that builds <em>many</em>{' '}
            is harder to copy than any single one. We ship products in three
            categories, each in its own brand on its own site, with its own
            customers. The portfolio compounds.
          </p>
          <p className="mt-4 text-base leading-relaxed text-mid sm:text-lg">
            We are not a startup betting a company on one idea. We are an
            operator running a build system on a roadmap of shots on goal.
          </p>
        </div>

        {/* Side annotation block — a quote / standout, set like a margin note */}
        <aside
          aria-label="Operating principle"
          className="relative lg:col-span-5"
        >
          <span
            aria-hidden
            className="absolute -left-2 top-0 h-full w-px bg-electric/40 lg:left-0"
          />
          <div className="pl-6">
            <p className="annotation-bright mb-3">Operating principle</p>
            <p className="font-mono text-sm leading-relaxed text-glow">
              &ldquo;We ship and we compound. The product does the talking.
              The system is the moat.&rdquo;
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <Stat figure="3" label="Categories" />
              <Stat figure="1" label="Build system" />
              <Stat figure="10–12" label="Products / yr" />
            </div>
          </div>
        </aside>
      </div>
    </Sheet>
  );
}

function Stat({ figure, label }: { figure: string; label: string }) {
  return (
    <div>
      <p className="font-mono text-2xl font-semibold tracking-tight text-electric sm:text-3xl">
        {figure}
      </p>
      <p className="mt-1.5 text-xs uppercase tracking-wider text-mid">{label}</p>
    </div>
  );
}
