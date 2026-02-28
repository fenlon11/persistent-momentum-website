'use client';

import { useState } from 'react';
import TabNav, { DashboardTab } from '@/components/dashboard/TabNav';
import SystemMap from '@/components/dashboard/SystemMap';
import Pipeline from '@/components/dashboard/Pipeline';
import FleetStatus from '@/components/dashboard/FleetStatus';
import RevenueTracker from '@/components/dashboard/RevenueTracker';
import SecretsRegistry from '@/components/dashboard/SecretsRegistry';
import ClaudeMdViewer from '@/components/dashboard/ClaudeMdViewer';

export default function DashboardContent({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('pipeline');

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Command Center</h1>
            <p className="text-sm text-slate-400 mt-1">Persistent Momentum HQ</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'system' && <SystemMap />}
          {activeTab === 'pipeline' && <Pipeline />}
          {activeTab === 'fleet' && <FleetStatus />}
          {activeTab === 'revenue' && <RevenueTracker />}
          {activeTab === 'secrets' && <SecretsRegistry />}
          {activeTab === 'claude-md' && <ClaudeMdViewer />}
        </div>
      </div>
    </div>
  );
}
