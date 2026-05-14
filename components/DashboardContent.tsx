'use client';

import { useState } from 'react';
import Image from 'next/image';
import TabNav, { DashboardTab } from '@/components/dashboard/TabNav';
import SystemMap from '@/components/dashboard/SystemMap';
import Pipeline from '@/components/dashboard/Pipeline';
import AgentsStatus from '@/components/dashboard/AgentsStatus';
import SkillsView from '@/components/dashboard/SkillsView';
import PlatformOverview from '@/components/dashboard/PlatformOverview';
import RevenueTracker from '@/components/dashboard/RevenueTracker';
import SecretsRegistry from '@/components/dashboard/SecretsRegistry';
import ClaudeMdViewer from '@/components/dashboard/ClaudeMdViewer';
import Analytics from '@/components/dashboard/Analytics';

export default function DashboardContent({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('pipeline');

  return (
    <div className="min-h-screen bg-navy pb-16 pt-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Persistent Momentum" width={34} height={34} className="h-8 w-auto" />
            <div>
              <p className="eyebrow">pmOS</p>
              <h1 className="text-xl font-semibold tracking-tight text-white">Command Center</h1>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-mid transition-colors hover:border-white/25 hover:text-white"
          >
            Log out
          </button>
        </div>

        {/* Tab Navigation */}
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'system' && <SystemMap />}
          {activeTab === 'pipeline' && <Pipeline />}
          {activeTab === 'agents' && <AgentsStatus />}
          {activeTab === 'skills' && <SkillsView />}
          {activeTab === 'platform' && <PlatformOverview />}
          {activeTab === 'revenue' && <RevenueTracker />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'secrets' && <SecretsRegistry />}
          {activeTab === 'claude-md' && <ClaudeMdViewer />}
        </div>
      </div>
    </div>
  );
}
