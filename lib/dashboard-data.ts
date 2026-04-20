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
// The live `project_state` table in pmOS Supabase is the source of truth —
// ProjectPipeline + RevenueTracker fetch from /api/projects. Only the phase
// definitions live here (static UI scaffold, not project data).
export type Phase = 'research' | 'plan' | 'build' | 'market' | 'monetize' | 'analyze' | 'scale';

export const phases: { id: Phase; label: string; icon: string }[] = [
  { id: 'research', label: 'Research', icon: '🔬' },
  { id: 'plan', label: 'Plan', icon: '📋' },
  { id: 'build', label: 'Build', icon: '🔨' },
  { id: 'market', label: 'Market', icon: '📣' },
  { id: 'monetize', label: 'Monetize', icon: '💰' },
  { id: 'analyze', label: 'Analyze', icon: '📊' },
  { id: 'scale', label: 'Scale', icon: '🚀' },
];

// ===== REVENUE TARGETS =====
// Current MRR / ARR / shipped-product count are derived live in RevenueTracker
// from /api/projects (backed by project_state). Only targets live here.
export interface RevenueTarget {
  period: string;
  target: number;
  current: number;
}

export const revenueTargets = {
  targetMRR2026: 10000,
  targetARR2026: 120000,
  longTermTargetMRR: 100000,
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
