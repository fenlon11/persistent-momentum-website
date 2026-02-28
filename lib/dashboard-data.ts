// ===== SYSTEM ARCHITECTURE =====
export interface SystemNode {
  id: string;
  label: string;
  description: string;
  type: 'orchestrator' | 'builder' | 'worker' | 'product' | 'infrastructure';
  status: 'active' | 'building' | 'planned';
  icon: string;
}

export interface SystemConnection {
  from: string;
  to: string;
  label: string;
  type: 'data' | 'command' | 'deploy' | 'monitor';
}

export const systemNodes: SystemNode[] = [
  { id: 'claude-ai', label: 'Claude.ai', description: 'Orchestrator — strategy, planning, research, MCP connectors', type: 'orchestrator', status: 'active', icon: '🧠' },
  { id: 'claude-code', label: 'Claude Code', description: 'Builder — build, test, deploy, refactor via Desktop MCP', type: 'builder', status: 'active', icon: '⚡' },
  { id: 'github', label: 'GitHub', description: 'Source of truth — all repos, CLAUDE.md, headquarters', type: 'infrastructure', status: 'active', icon: '📦' },
  { id: 'vercel', label: 'Vercel', description: 'Frontend hosting — websites, APIs, dashboards', type: 'infrastructure', status: 'active', icon: '▲' },
  { id: 'cloudflare', label: 'Cloudflare Workers', description: '8 autonomous Workers — automation fleet', type: 'infrastructure', status: 'active', icon: '☁️' },
  { id: 'supabase', label: 'Supabase', description: 'Database, auth, real-time — app backends', type: 'infrastructure', status: 'active', icon: '⚡' },
  { id: 'rabbit-golf', label: 'Rabbit Golf', description: 'Golf GPS app — LIVE in App Store', type: 'product', status: 'active', icon: '🐇' },
  { id: 'orbit', label: 'Orbit CRM', description: 'Real estate CRM for FUB teams — $149/mo', type: 'product', status: 'building', icon: '🌀' },
  { id: 'recruiterflow', label: 'RecruiterFlow', description: 'Recruiting automation tool', type: 'product', status: 'building', icon: '🎯' },
  { id: 'macbook', label: 'MacBook Pro', description: 'Dev machine + MCP host via Cloudflare Tunnel', type: 'infrastructure', status: 'active', icon: '💻' },
];

export const systemConnections: SystemConnection[] = [
  { from: 'claude-ai', to: 'claude-code', label: 'Task prompts via Desktop MCP', type: 'command' },
  { from: 'claude-ai', to: 'github', label: 'Code review, CLAUDE.md', type: 'data' },
  { from: 'claude-code', to: 'github', label: 'Push code', type: 'deploy' },
  { from: 'claude-code', to: 'macbook', label: 'Build & test locally', type: 'command' },
  { from: 'github', to: 'vercel', label: 'Auto-deploy on push', type: 'deploy' },
  { from: 'github', to: 'cloudflare', label: 'Worker deployments', type: 'deploy' },
  { from: 'cloudflare', to: 'supabase', label: 'Activity logs, data', type: 'data' },
  { from: 'vercel', to: 'supabase', label: 'App data, auth', type: 'data' },
  { from: 'cloudflare', to: 'rabbit-golf', label: 'IG automation, ASO', type: 'monitor' },
  { from: 'cloudflare', to: 'orbit', label: 'Planned integrations', type: 'monitor' },
  { from: 'supabase', to: 'rabbit-golf', label: 'Backend data', type: 'data' },
  { from: 'supabase', to: 'orbit', label: 'Backend data', type: 'data' },
];

// ===== PROJECT PIPELINE =====
export type Phase = 'research' | 'plan' | 'build' | 'market' | 'monetize' | 'analyze' | 'scale';

export interface ProjectMilestone {
  label: string;
  completed: boolean;
  date?: string;
}

export interface Project {
  id: string;
  name: string;
  icon: string;
  description: string;
  currentPhase: Phase;
  phases: Record<Phase, { status: 'completed' | 'active' | 'upcoming'; notes?: string }>;
  milestones: ProjectMilestone[];
  nextActions: string[];
  pricing?: string;
  mrr: number;
  domain?: string;
}

export const phases: { id: Phase; label: string; icon: string }[] = [
  { id: 'research', label: 'Research', icon: '🔬' },
  { id: 'plan', label: 'Plan', icon: '📋' },
  { id: 'build', label: 'Build', icon: '🔨' },
  { id: 'market', label: 'Market', icon: '📣' },
  { id: 'monetize', label: 'Monetize', icon: '💰' },
  { id: 'analyze', label: 'Analyze', icon: '📊' },
  { id: 'scale', label: 'Scale', icon: '🚀' },
];

export const projects: Project[] = [
  {
    id: 'rabbit-golf',
    name: 'Rabbit Golf',
    icon: '🐇',
    description: 'Golf GPS app with course mapping, shot tracking, and AI caddy',
    currentPhase: 'market',
    domain: 'rabbit-golf.com',
    pricing: 'Freemium — Pro $9.99/mo',
    mrr: 0,
    phases: {
      research: { status: 'completed', notes: 'Market analysis complete' },
      plan: { status: 'completed', notes: 'Feature spec finalized' },
      build: { status: 'completed', notes: 'Live in App Store' },
      market: { status: 'active', notes: '15+ SEO articles, IG automation live, GSC set up' },
      monetize: { status: 'upcoming', notes: 'RevenueCat integrated, waiting for conversions' },
      analyze: { status: 'upcoming' },
      scale: { status: 'upcoming' },
    },
    milestones: [
      { label: 'App Store launch', completed: true, date: '2025-01' },
      { label: 'Website + SEO blog', completed: true, date: '2025-02' },
      { label: 'IG automation live', completed: true, date: '2025-02' },
      { label: 'GSC connected', completed: true, date: '2025-02' },
      { label: 'First paid subscriber', completed: false },
      { label: '100 downloads', completed: false },
      { label: '$500 MRR', completed: false },
    ],
    nextActions: [
      'Drive app downloads through IG content',
      'Optimize App Store listing (ASO)',
      'Launch referral program',
      'GSC automation via service account',
    ],
  },
  {
    id: 'orbit',
    name: 'Orbit CRM',
    icon: '🌀',
    description: 'Real estate CRM for mid-size Follow Up Boss teams',
    currentPhase: 'plan',
    domain: 'orbitcrm.io',
    pricing: '$149/mo per team',
    mrr: 0,
    phases: {
      research: { status: 'completed', notes: 'Target market: FUB teams 10-50 agents' },
      plan: { status: 'active', notes: 'Branding finalized, domain secured' },
      build: { status: 'upcoming' },
      market: { status: 'upcoming' },
      monetize: { status: 'upcoming' },
      analyze: { status: 'upcoming' },
      scale: { status: 'upcoming' },
    },
    milestones: [
      { label: 'Market research', completed: true },
      { label: 'Domain secured (orbitcrm.io)', completed: true },
      { label: 'Branding complete', completed: true },
      { label: 'MVP build', completed: false },
      { label: 'Beta launch', completed: false },
      { label: 'First paying team', completed: false },
    ],
    nextActions: [
      'Build MVP feature set',
      'FUB API integration',
      'Landing page with waitlist',
    ],
  },
  {
    id: 'recruiterflow',
    name: 'RecruiterFlow',
    icon: '🎯',
    description: 'Recruiting automation and candidate pipeline management',
    currentPhase: 'build',
    mrr: 0,
    phases: {
      research: { status: 'completed' },
      plan: { status: 'completed' },
      build: { status: 'active', notes: 'Vercel deployment issues being resolved' },
      market: { status: 'upcoming' },
      monetize: { status: 'upcoming' },
      analyze: { status: 'upcoming' },
      scale: { status: 'upcoming' },
    },
    milestones: [
      { label: 'Concept validated', completed: true },
      { label: 'Core build started', completed: true },
      { label: 'Vercel deployment', completed: false },
      { label: 'Beta launch', completed: false },
    ],
    nextActions: [
      'Resolve Vercel deployment issues',
      'Complete core features',
      'Set up landing page',
    ],
  },
  {
    id: 'pm-platform',
    name: 'PM Platform',
    icon: '⚙️',
    description: 'The Persistent Momentum system itself — website, Workers, dashboard',
    currentPhase: 'build',
    domain: 'persistentmomentum.com',
    mrr: 0,
    phases: {
      research: { status: 'completed' },
      plan: { status: 'completed' },
      build: { status: 'active', notes: 'Website, marketplace, dashboard being built' },
      market: { status: 'upcoming' },
      monetize: { status: 'upcoming', notes: 'Future white-label potential' },
      analyze: { status: 'upcoming' },
      scale: { status: 'upcoming' },
    },
    milestones: [
      { label: 'Website live', completed: true },
      { label: '8 Workers deployed', completed: true },
      { label: 'Marketplace page', completed: true },
      { label: 'Command Center dashboard', completed: false },
      { label: 'Worker activity logging', completed: false },
    ],
    nextActions: [
      'Deploy Command Center to Vercel',
      'Set up Supabase activity logging',
      'Worker optimization scoring',
    ],
  },
];

// ===== REVENUE TARGETS =====
export interface RevenueTarget {
  period: string;
  target: number;
  current: number;
}

export const revenueTargets = {
  currentMRR: 0,
  currentARR: 0,
  targetMRR2026: 10000,
  targetARR2026: 120000,
  productCount: 4,
  targetProducts2026: 12,
  monthlyTargets: [
    { period: 'Mar 2026', target: 500, current: 0 },
    { period: 'Apr 2026', target: 1000, current: 0 },
    { period: 'May 2026', target: 2000, current: 0 },
    { period: 'Jun 2026', target: 3000, current: 0 },
    { period: 'Jul 2026', target: 4500, current: 0 },
    { period: 'Aug 2026', target: 6000, current: 0 },
    { period: 'Sep 2026', target: 7500, current: 0 },
    { period: 'Oct 2026', target: 8500, current: 0 },
    { period: 'Nov 2026', target: 9500, current: 0 },
    { period: 'Dec 2026', target: 10000, current: 0 },
  ] as RevenueTarget[],
};
