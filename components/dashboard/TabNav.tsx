'use client';

export type DashboardTab = 'system' | 'pipeline' | 'fleet' | 'revenue' | 'claude-md';

const tabs: { id: DashboardTab; label: string; icon: string }[] = [
  { id: 'system', label: 'System', icon: '🗺️' },
  { id: 'pipeline', label: 'Pipeline', icon: '📊' },
  { id: 'fleet', label: 'Fleet', icon: '☁️' },
  { id: 'revenue', label: 'Revenue', icon: '💰' },
  { id: 'claude-md', label: 'CLAUDE.md', icon: '📄' },
];

interface TabNavProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="sticky top-16 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="flex overflow-x-auto scrollbar-hide max-w-6xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap
              ${activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent'
              }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
