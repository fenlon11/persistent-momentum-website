'use client';

export type DashboardTab = 'system' | 'pipeline' | 'agents' | 'skills' | 'platform' | 'revenue' | 'analytics' | 'secrets' | 'claude-md';

const tabs: { id: DashboardTab; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'agents', label: 'Agents' },
  { id: 'skills', label: 'Skills' },
  { id: 'platform', label: 'Platform' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'secrets', label: 'Secrets' },
  { id: 'claude-md', label: 'CLAUDE.md' },
];

interface TabNavProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="sticky top-16 z-40 border-b border-white/8 bg-navy/90 backdrop-blur-md">
      <div className="scrollbar-hide flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-electric text-white'
                : 'border-transparent text-mid hover:text-glow'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
