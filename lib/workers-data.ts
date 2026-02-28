export interface Worker {
  id: string;
  name: string;
  description: string;
  category: 'automation' | 'monitoring' | 'marketing' | 'analytics';
  status: 'active' | 'development' | 'paused';
  icon: string;
  capabilities: string[];
  schedule?: string;
}

export const workers: Worker[] = [
  {
    id: 'pm-health-monitor',
    name: 'Health Monitor',
    description: 'Monitors all Workers and services for uptime. Alerts on failures and tracks response times.',
    category: 'monitoring',
    status: 'active',
    icon: '🫀',
    capabilities: ['Uptime monitoring', 'Alert notifications', 'Response time tracking'],
    schedule: 'Every 5 minutes',
  },
  {
    id: 'daily-dashboard',
    name: 'Daily Dashboard',
    description: 'Compiles daily business metrics and delivers morning briefings with key performance data.',
    category: 'analytics',
    status: 'active',
    icon: '📊',
    capabilities: ['Daily metric compilation', 'Morning briefings', 'KPI tracking'],
    schedule: 'Daily at 7am',
  },
  {
    id: 'aso-monitor',
    name: 'ASO Monitor',
    description: 'Tracks App Store rankings, keyword positions, and competitor movements for all published apps.',
    category: 'monitoring',
    status: 'active',
    icon: '📱',
    capabilities: ['Keyword tracking', 'Ranking alerts', 'Competitor analysis'],
    schedule: 'Every 6 hours',
  },
  {
    id: 'seo-indexing-agent',
    name: 'SEO Indexing Agent',
    description: 'Automatically submits new pages to Google for indexing and monitors crawl status.',
    category: 'marketing',
    status: 'active',
    icon: '🔍',
    capabilities: ['Auto-indexing', 'Crawl monitoring', 'Sitemap management'],
    schedule: 'On new content',
  },
  {
    id: 'ig-automation',
    name: 'IG Automation',
    description: 'Manages Instagram content scheduling and posting for brand accounts. Posts reels, stories, and feed posts.',
    category: 'automation',
    status: 'active',
    icon: '📸',
    capabilities: ['Reel scheduling', 'Story posting', 'Feed management'],
    schedule: '7am / 11am / 5pm',
  },
  {
    id: 'analytics-digest',
    name: 'Analytics Digest',
    description: 'Aggregates analytics from multiple sources into unified weekly and monthly reports.',
    category: 'analytics',
    status: 'active',
    icon: '📈',
    capabilities: ['Multi-source aggregation', 'Weekly reports', 'Trend analysis'],
    schedule: 'Weekly',
  },
  {
    id: 'rabbit-golf-ig',
    name: 'Rabbit Golf IG',
    description: 'Dedicated Instagram automation for Rabbit Golf brand. Content calendar driven posting.',
    category: 'marketing',
    status: 'active',
    icon: '🐇',
    capabilities: ['Content calendar', 'Brand-specific posts', 'Engagement tracking'],
    schedule: '7am / 11am / 5pm',
  },
  {
    id: 'elle-cloud',
    name: 'Elle Cloud',
    description: 'Personal automation worker handling custom tasks and integrations.',
    category: 'automation',
    status: 'active',
    icon: '☁️',
    capabilities: ['Custom automations', 'Integration hub', 'Task orchestration'],
    schedule: 'On demand',
  },
];

export const categories = [
  { id: 'all', label: 'All Workers' },
  { id: 'automation', label: 'Automation' },
  { id: 'monitoring', label: 'Monitoring' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'analytics', label: 'Analytics' },
] as const;
