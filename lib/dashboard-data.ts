// ===== SYSTEM ARCHITECTURE =====
export interface SystemNode {
  id: string;
  label: string;
  description: string;
  type: 'orchestrator' | 'builder' | 'agent' | 'product' | 'infrastructure';
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
  { id: 'cloudflare', label: 'Persistent Agents', description: '6 Persistent Agents — automation fleet', type: 'infrastructure', status: 'active', icon: '☁️' },
  { id: 'supabase', label: 'Supabase', description: 'Database, auth, real-time — app backends', type: 'infrastructure', status: 'active', icon: '⚡' },
  { id: 'persistent-sales', label: 'Persistent Sales', description: 'Primary CRM platform — contacts, deals, pipelines', type: 'product', status: 'building', icon: '💼' },
  { id: 'persistent-marketing', label: 'Persistent Marketing', description: 'Content pipelines, social automation, SEO', type: 'product', status: 'planned', icon: '📣' },
  { id: 'persistent-operations', label: 'Persistent Operations', description: 'Workflow automation and system monitoring', type: 'product', status: 'planned', icon: '⚙️' },
  { id: 'persistent-recruiter', label: 'Persistent Recruiter', description: 'AI-powered recruiting automation', type: 'product', status: 'building', icon: '🎯' },
  { id: 'macbook', label: 'MacBook Pro', description: 'Dev machine + MCP host via Cloudflare Tunnel', type: 'infrastructure', status: 'active', icon: '💻' },
];

export const systemConnections: SystemConnection[] = [
  { from: 'claude-ai', to: 'claude-code', label: 'Task prompts via Desktop MCP', type: 'command' },
  { from: 'claude-ai', to: 'github', label: 'Code review, CLAUDE.md', type: 'data' },
  { from: 'claude-code', to: 'github', label: 'Push code', type: 'deploy' },
  { from: 'claude-code', to: 'macbook', label: 'Build & test locally', type: 'command' },
  { from: 'github', to: 'vercel', label: 'Auto-deploy on push', type: 'deploy' },
  { from: 'github', to: 'cloudflare', label: 'Agent deployments', type: 'deploy' },
  { from: 'cloudflare', to: 'supabase', label: 'Activity logs, data', type: 'data' },
  { from: 'vercel', to: 'supabase', label: 'App data, auth', type: 'data' },
  { from: 'cloudflare', to: 'persistent-sales', label: 'CRM automation', type: 'monitor' },
  { from: 'cloudflare', to: 'persistent-recruiter', label: 'Recruiting automation', type: 'monitor' },
  { from: 'supabase', to: 'persistent-sales', label: 'Backend data', type: 'data' },
  { from: 'supabase', to: 'persistent-recruiter', label: 'Backend data', type: 'data' },
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
    id: 'persistent-sales',
    name: 'Persistent Sales',
    icon: '💼',
    description: 'Primary CRM platform — contacts, deals, pipelines, and AI-powered follow-ups',
    currentPhase: 'plan',
    domain: 'persistentmomentum.com/products/persistent-sales',
    pricing: 'Starter $49/mo — Pro $99/mo — Platform $199/mo',
    mrr: 0,
    phases: {
      research: { status: 'completed', notes: 'Market analysis complete' },
      plan: { status: 'active', notes: 'Feature spec and architecture in progress' },
      build: { status: 'upcoming' },
      market: { status: 'upcoming' },
      monetize: { status: 'upcoming' },
      analyze: { status: 'upcoming' },
      scale: { status: 'upcoming' },
    },
    milestones: [
      { label: 'Market research', completed: true },
      { label: 'Product spec finalized', completed: false },
      { label: 'MVP build', completed: false },
      { label: 'Beta launch', completed: false },
      { label: 'First paying customer', completed: false },
    ],
    nextActions: [
      'Finalize CRM feature spec',
      'Design add-on architecture',
      'Build contact & deal management MVP',
    ],
  },
  {
    id: 'persistent-marketing',
    name: 'Persistent Marketing',
    icon: '📣',
    description: 'Content pipelines, social media automation, SEO, and campaign analytics',
    currentPhase: 'research',
    pricing: 'Solo $39/mo — Growth $79/mo — Add-on +$49/mo',
    mrr: 0,
    phases: {
      research: { status: 'active', notes: 'Evaluating content automation landscape' },
      plan: { status: 'upcoming' },
      build: { status: 'upcoming' },
      market: { status: 'upcoming' },
      monetize: { status: 'upcoming' },
      analyze: { status: 'upcoming' },
      scale: { status: 'upcoming' },
    },
    milestones: [
      { label: 'Market research started', completed: true },
      { label: 'Feature spec', completed: false },
      { label: 'MVP build', completed: false },
    ],
    nextActions: [
      'Define content pipeline feature set',
      'Research social API integrations',
    ],
  },
  {
    id: 'persistent-operations',
    name: 'Persistent Operations',
    icon: '⚙️',
    description: 'Workflow automation, system monitoring, and task orchestration',
    currentPhase: 'research',
    pricing: 'Essentials $29/mo — Business $69/mo — Add-on +$39/mo',
    mrr: 0,
    phases: {
      research: { status: 'active', notes: 'Scoping workflow builder requirements' },
      plan: { status: 'upcoming' },
      build: { status: 'upcoming' },
      market: { status: 'upcoming' },
      monetize: { status: 'upcoming' },
      analyze: { status: 'upcoming' },
      scale: { status: 'upcoming' },
    },
    milestones: [
      { label: 'Concept defined', completed: true },
      { label: 'Feature spec', completed: false },
      { label: 'MVP build', completed: false },
    ],
    nextActions: [
      'Define workflow builder scope',
      'Map integration requirements',
    ],
  },
  {
    id: 'persistent-recruiter',
    name: 'Persistent Recruiter',
    icon: '🎯',
    description: 'AI-powered recruiting automation and candidate pipeline management',
    currentPhase: 'build',
    mrr: 0,
    phases: {
      research: { status: 'completed' },
      plan: { status: 'completed' },
      build: { status: 'active', notes: 'Core features in development' },
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
      'Complete core candidate pipeline',
      'Set up outreach automation',
      'Deploy to production',
    ],
  },
  {
    id: 'pm-platform',
    name: 'PM Platform',
    icon: '⚙️',
    description: 'The Persistent Momentum system itself — website, Agents, dashboard',
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
      { label: '6 Agents deployed', completed: true },
      { label: 'Marketplace page', completed: true },
      { label: 'Command Center dashboard', completed: false },
      { label: 'Agent activity logging', completed: false },
    ],
    nextActions: [
      'Deploy Command Center to Vercel',
      'Set up Supabase activity logging',
      'Agent optimization scoring',
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
