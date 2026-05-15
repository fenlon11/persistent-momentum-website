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
    <div
      className="min-h-screen pb-16"
      style={{ background: 'var(--color-bg-light)' }}
    >
      {/* Console chrome */}
      <div
        className="sticky top-0 z-20"
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt=""
              width={28}
              height={28}
              style={{ height: 24, width: 'auto' }}
            />
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{
                  color: 'var(--color-primary)',
                  letterSpacing: '0.12em',
                }}
              >
                pmOS &middot; Command Center
              </p>
              <p
                className="text-sm font-bold"
                style={{ color: 'var(--color-text-dark)' }}
              >
                Operator console
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-1.5 text-xs font-medium uppercase tracking-widest transition-colors"
            style={{
              color: 'var(--color-text-dark-muted)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              letterSpacing: '0.1em',
            }}
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
            <Overview onJumpTo={(target) => setArea(target)} />
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
        <span
          className="text-[10px] tracking-widest font-semibold"
          style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
        >
          {code}
        </span>
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--color-text-dark)' }}
        >
          {title}
        </h2>
        <span
          aria-hidden
          className="h-px flex-1"
          style={{ background: 'var(--color-border)' }}
        />
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
    <section
      className="pt-10"
      style={{ borderTop: '1px solid var(--color-border)' }}
    >
      <header className="mb-6 flex items-baseline gap-3">
        <span
          className="text-[10px] tracking-widest font-semibold"
          style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
        >
          {code}
        </span>
        <h3
          className="text-lg font-bold"
          style={{ color: 'var(--color-text-dark)' }}
        >
          {title}
        </h3>
      </header>
      {children}
    </section>
  );
}
