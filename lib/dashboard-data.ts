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
  { id: 'github', label: 'GitHub', description: 'Source of truth — all repos, CLAUDE.md, pmOS', type: 'infrastructure', status: 'active', icon: '📦' },
  { id: 'vercel', label: 'Vercel', description: 'Frontend hosting — product sites + corporate site + dashboard', type: 'infrastructure', status: 'active', icon: '▲' },
  { id: 'cloudflare', label: 'Cloudflare Workers', description: 'Automation fleet — scheduled jobs, content pipeline, ingestion', type: 'infrastructure', status: 'active', icon: '☁️' },
  { id: 'supabase', label: 'Supabase', description: 'pmOS data layer — memories, telemetry, worker registry, queues', type: 'infrastructure', status: 'active', icon: '⚡' },
  { id: 'persistent-recruiter', label: 'Persistent Recruiter', description: 'Web platform — recruiting software for small teams (v1 launch sprint)', type: 'product', status: 'building', icon: '🎯' },
  { id: 'persistent-marketer', label: 'Persistent Marketer', description: 'AI-powered content and social automation (planned)', type: 'product', status: 'planned', icon: '📣' },
  { id: 'macbook', label: 'MacBook Pro', description: 'Dev machine + MCP host via Cloudflare Tunnel', type: 'infrastructure', status: 'active', icon: '💻' },
];

export const systemConnections: SystemConnection[] = [
  { from: 'claude-ai', to: 'claude-code', label: 'Task prompts via Desktop MCP', type: 'command' },
  { from: 'claude-ai', to: 'github', label: 'Code review, CLAUDE.md', type: 'data' },
  { from: 'claude-code', to: 'github', label: 'Push code', type: 'deploy' },
  { from: 'claude-code', to: 'macbook', label: 'Build & test locally', type: 'command' },
  { from: 'github', to: 'vercel', label: 'Auto-deploy on push', type: 'deploy' },
  { from: 'github', to: 'cloudflare', label: 'Worker deployments', type: 'deploy' },
  { from: 'cloudflare', to: 'supabase', label: 'Activity, telemetry, content', type: 'data' },
  { from: 'vercel', to: 'supabase', label: 'App data, auth, RLS', type: 'data' },
  { from: 'cloudflare', to: 'persistent-recruiter', label: 'Automation jobs', type: 'monitor' },
  { from: 'supabase', to: 'persistent-recruiter', label: 'Backend data', type: 'data' },
  { from: 'supabase', to: 'persistent-marketer', label: 'Backend data (planned)', type: 'data' },
];

// ===== PROJECT PIPELINE =====
// These are the canonical PM products shown in Project Pipeline.
// Live `project_state` table in pmOS Supabase will eventually back this — for now static.
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
    id: 'persistent-recruiter',
    name: 'Persistent Recruiter',
    icon: '🎯',
    description: 'Recruiting software small teams actually use. Next.js + Supabase. v1 launch sprint in flight.',
    currentPhase: 'build',
    domain: 'persistentrecruiter.com',
    pricing: 'Recruiter $49/mo · Company $149/mo',
    mrr: 0,
    phases: {
      research: { status: 'completed' },
      plan: { status: 'completed', notes: 'PRD 2026-04-19' },
      build: { status: 'active', notes: 'Rewire + merge + decommission per PRD' },
      market: { status: 'upcoming' },
      monetize: { status: 'upcoming' },
      analyze: { status: 'upcoming' },
      scale: { status: 'upcoming' },
    },
    milestones: [
      { label: 'PRD signed', completed: true, date: '2026-04-19' },
      { label: 'pr-funnel merged into app', completed: false },
      { label: 'pm-CRM Railway decommissioned', completed: false },
      { label: 'Stripe checkout live', completed: false },
      { label: 'persistentrecruiter.com domain', completed: false },
      { label: 'First paying customer', completed: false, date: '2026-05-10' },
    ],
    nextActions: [
      'Rewire pr-funnel/api/submit to Supabase direct',
      'Merge pr-funnel routes into persistent-recruiter',
      'Stripe checkout + webhook',
      'Discovery Video migration into PR dashboard',
      'Playwright smoke suite',
    ],
  },
  {
    id: 'persistent-marketer',
    name: 'Persistent Marketer',
    icon: '📣',
    description: 'AI-powered content and social automation for business. Next up after Recruiter launch.',
    currentPhase: 'research',
    pricing: 'TBA',
    mrr: 0,
    phases: {
      research: { status: 'active', notes: 'Scoping MVP after PR launch' },
      plan: { status: 'upcoming' },
      build: { status: 'upcoming' },
      market: { status: 'upcoming' },
      monetize: { status: 'upcoming' },
      analyze: { status: 'upcoming' },
      scale: { status: 'upcoming' },
    },
    milestones: [
      { label: 'Concept validated via Rabbit Golf pipeline', completed: true },
      { label: 'MVP scope defined', completed: false },
      { label: 'PRD', completed: false },
      { label: 'First customer', completed: false },
    ],
    nextActions: [
      'Define MVP scope post-PR-launch',
      'Decide pricing model',
      'Write PRD',
    ],
  },
  {
    id: 'pm-portfolio',
    name: 'Persistent Momentum (portfolio)',
    icon: '🏗️',
    description: 'The portfolio operator itself — corporate site, dashboard, pmOS. Path to $100k MRR across 10–12 products in 2026.',
    currentPhase: 'build',
    domain: 'persistentmomentum.com',
    mrr: 0,
    phases: {
      research: { status: 'completed' },
      plan: { status: 'completed', notes: 'Canonical BUSINESS-PLAN.md + BRAND.md v0.1 (2026-04-20)' },
      build: { status: 'active', notes: 'Corporate site live; dashboard being fixed' },
      market: { status: 'upcoming' },
      monetize: { status: 'upcoming', notes: 'Revenue comes through individual products' },
      analyze: { status: 'upcoming' },
      scale: { status: 'upcoming' },
    },
    milestones: [
      { label: 'Canonical PM docs (v0.1)', completed: true, date: '2026-04-20' },
      { label: 'Corporate site rebranded', completed: true, date: '2026-04-20' },
      { label: 'Command Center dashboard working', completed: false },
      { label: 'First PM product shipped (Recruiter)', completed: false },
      { label: 'Second PM product shipped (Marketer)', completed: false },
    ],
    nextActions: [
      'Wire PMOS_SUPABASE_* env vars in Vercel',
      'Ship Recruiter v1',
      'Start Marketer v1 scoping',
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
  longTermTargetMRR: 100000,
  productCount: 0, // live products shipped
  targetProducts2026: 12,
  monthlyTargets: [
    { period: 'May 2026', target: 500, current: 0 },
    { period: 'Jun 2026', target: 1000, current: 0 },
    { period: 'Jul 2026', target: 2000, current: 0 },
    { period: 'Aug 2026', target: 3000, current: 0 },
    { period: 'Sep 2026', target: 4500, current: 0 },
    { period: 'Oct 2026', target: 6000, current: 0 },
    { period: 'Nov 2026', target: 8000, current: 0 },
    { period: 'Dec 2026', target: 10000, current: 0 },
  ] as RevenueTarget[],
};
