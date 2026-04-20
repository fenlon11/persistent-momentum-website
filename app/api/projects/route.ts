import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabasePlatform, isPlatformConfigured } from '@/lib/supabase-platform';
import type { Phase } from '@/lib/dashboard-data';

interface DisplayConfig {
  name: string;
  icon: string;
  domain?: string;
  pricing?: string;
}

// Known projects get nicer display; unknown slugs fall back to slug-derived name.
const DISPLAY: Record<string, DisplayConfig> = {
  'persistent-recruiter': {
    name: 'Persistent Recruiter',
    icon: '🎯',
    domain: 'persistentrecruiter.com',
    pricing: 'Recruiter $49/mo · Company $149/mo',
  },
  'persistent-marketer': {
    name: 'Persistent Marketer',
    icon: '📣',
  },
  'rabbit-golf': {
    name: 'Rabbit Golf',
    icon: '🐰',
    domain: 'rabbit-golf.com',
    pricing: 'Pro $4.99/mo · $49.99/yr',
  },
  'golf-course-database': {
    name: 'Golf Course Database',
    icon: '🏌️',
  },
};

function prettifyFallback(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// Map DB `stage` to the 7-phase pipeline status record used by the UI.
function stageToPhases(stage: string): { currentPhase: Phase; phases: Record<Phase, { status: 'completed' | 'active' | 'upcoming' }> } {
  const allPhases: Phase[] = ['research', 'plan', 'build', 'market', 'monetize', 'analyze', 'scale'];

  // Which phase is "current" for this stage?
  const stageMap: Record<string, Phase> = {
    idea: 'research',
    research: 'research',
    planning: 'plan',
    plan: 'plan',
    building: 'build',
    build: 'build',
    shipping: 'market',
    live: 'market',
    shipped: 'market',
    marketing: 'market',
    monetizing: 'monetize',
    scaling: 'scale',
  };

  const currentPhase: Phase = stageMap[stage.toLowerCase()] ?? 'plan';
  const currentIdx = allPhases.indexOf(currentPhase);

  const phases = {} as Record<Phase, { status: 'completed' | 'active' | 'upcoming' }>;
  allPhases.forEach((p, i) => {
    phases[p] = {
      status: i < currentIdx ? 'completed' : i === currentIdx ? 'active' : 'upcoming',
    };
  });

  return { currentPhase, phases };
}

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get('dashboard_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isPlatformConfigured() || !supabasePlatform) {
    return NextResponse.json({ projects: [] });
  }

  const { data, error } = await supabasePlatform
    .from('project_state')
    .select('slug, stage, priority, metrics, next_steps, app_repo_path, claude_md_path, last_synced_at, updated_at')
    .order('slug');

  if (error) {
    return NextResponse.json({ error: error.message, projects: [] }, { status: 500 });
  }

  const projects = (data ?? []).map((row) => {
    const display = DISPLAY[row.slug] ?? { name: prettifyFallback(row.slug), icon: '📦' };
    const { currentPhase, phases } = stageToPhases(row.stage);
    const metrics = (row.metrics ?? {}) as Record<string, number>;
    const nextSteps = Array.isArray(row.next_steps) ? (row.next_steps as string[]) : [];
    const mrrCents = typeof metrics.mrr_cents === 'number' ? metrics.mrr_cents : 0;

    return {
      id: row.slug,
      slug: row.slug,
      name: display.name,
      icon: display.icon,
      description: row.priority ?? '',
      stage: row.stage,
      currentPhase,
      phases,
      milestones: [] as Array<{ label: string; completed: boolean; date?: string }>,
      nextActions: nextSteps,
      pricing: display.pricing ?? null,
      domain: display.domain ?? null,
      mrr: Math.floor(mrrCents / 100),
      completionPct: typeof metrics.completion_pct === 'number' ? metrics.completion_pct : null,
      lastSyncedAt: row.last_synced_at,
    };
  });

  return NextResponse.json({ projects });
}
