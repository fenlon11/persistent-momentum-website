'use client';

import { useState } from 'react';
import Image from 'next/image';
import ConsoleNav, { DashboardArea } from '@/components/dashboard/ConsoleNav';
import Overview from '@/components/dashboard/Overview';
import SystemMap from '@/components/dashboard/SystemMap';
import Pipeline from '@/components/dashboard/Pipeline';
import AgentsStatus from '@/components/dashboard/AgentsStatus';
import SkillsView from '@/components/dashboard/SkillsView';
import PlatformOverview from '@/components/dashboard/PlatformOverview';
import RevenueTracker from '@/components/dashboard/RevenueTracker';
import SecretsRegistry from '@/components/dashboard/SecretsRegistry';
import ClaudeMdViewer from '@/components/dashboard/ClaudeMdViewer';
import Analytics from '@/components/dashboard/Analytics';
import ProjectPipeline from '@/components/dashboard/ProjectPipeline';

export default function DashboardContent({ onLogout }: { onLogout: () => void }) {
  const [area, setArea] = useState<DashboardArea>('console');

  return (
    <div className="min-h-screen bg-navy pb-16">
      {/* Console chrome — sticky header with command-center title + logout */}
      <div className="border-b border-white/10 bg-navy/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt=""
              width={28}
              height={28}
              className="h-6 w-auto"
            />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-mid">
                pmOS &middot; Command Center
              </p>
              <p className="text-sm font-semibold text-white">
                Operator console
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="border border-white/12 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-mid transition-colors hover:border-electric/60 hover:text-glow"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ConsoleNav active={area} onChange={setArea} />

        <div className="mt-8">
          {area === 'console' && (
            <Overview
              onJumpTo={(target) => setArea(target)}
            />
          )}

          {area === 'operations' && (
            <AreaShell title="Operations" code="OPS">
              <Group title="Pipeline" code="OPS-A">
                <Pipeline />
              </Group>
              <Group title="Agent registry" code="OPS-B">
                <AgentsStatus />
              </Group>
              <Group title="System map" code="OPS-C">
                <SystemMap />
              </Group>
            </AreaShell>
          )}

          {area === 'portfolio' && (
            <AreaShell title="Portfolio" code="PTF">
              <Group title="Products" code="PTF-A">
                <ProjectPipeline />
              </Group>
              <Group title="Revenue" code="PTF-B">
                <RevenueTracker />
              </Group>
              <Group title="Analytics" code="PTF-C">
                <Analytics />
              </Group>
            </AreaShell>
          )}

          {area === 'knowledge' && (
            <AreaShell title="Knowledge" code="KNW">
              <Group title="Skills" code="KNW-A">
                <SkillsView />
              </Group>
              <Group title="Memory + platform" code="KNW-B">
                <PlatformOverview />
              </Group>
              <Group title="CLAUDE.md viewer" code="KNW-C">
                <ClaudeMdViewer />
              </Group>
            </AreaShell>
          )}

          {area === 'config' && (
            <AreaShell title="Config" code="CFG">
              <Group title="Secrets registry" code="CFG-A">
                <SecretsRegistry />
              </Group>
            </AreaShell>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── helpers ───────────────────── */

function AreaShell({
  title,
  code,
  children,
}: {
  title: string;
  code: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-14">
      <header className="flex items-center gap-3">
        <span className="font-mono text-[10px] tracking-widest text-electric">
          {code}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        <span aria-hidden className="h-px flex-1 bg-white/10" />
      </header>
      {children}
    </div>
  );
}

function Group({
  title,
  code,
  children,
}: {
  title: string;
  code: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-white/10 pt-10">
      <header className="mb-6 flex items-baseline gap-3">
        <span className="font-mono text-[10px] tracking-widest text-electric">
          {code}
        </span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </header>
      {children}
    </section>
  );
}
