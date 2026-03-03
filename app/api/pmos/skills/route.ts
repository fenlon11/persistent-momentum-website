import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabasePmos, isPmosConfigured } from '@/lib/supabase-pmos';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get('dashboard_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isPmosConfigured() || !supabasePmos) {
    return NextResponse.json({
      error: 'pmOS Supabase not configured',
      invocations: [],
      stats: [],
    });
  }

  const { searchParams } = request.nextUrl;
  const days = parseInt(searchParams.get('days') || '7');
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  try {
    // Get recent invocations
    const { data: invocations, error: invocationsError } = await supabasePmos
      .from('pmos_skill_invocations')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(50);

    if (invocationsError) {
      console.error('Error fetching skill invocations:', invocationsError);
    }

    // Get aggregated stats using RPC if available, otherwise compute manually
    let stats: Array<{
      skill_name: string;
      total_count: number;
      completed_count: number;
      failed_count: number;
      avg_duration_ms: number | null;
    }> = [];

    try {
      const { data: rpcStats } = await supabasePmos.rpc('get_skill_stats', {
        p_since: since,
      });
      if (rpcStats) {
        stats = rpcStats;
      }
    } catch {
      // RPC not available, compute manually from invocations
      if (invocations) {
        const skillMap = new Map<
          string,
          { total: number; completed: number; failed: number; durations: number[] }
        >();

        for (const inv of invocations) {
          const skill = inv.skill_name;
          if (!skillMap.has(skill)) {
            skillMap.set(skill, { total: 0, completed: 0, failed: 0, durations: [] });
          }
          const entry = skillMap.get(skill)!;
          entry.total++;
          if (inv.status === 'completed') entry.completed++;
          if (inv.status === 'failed') entry.failed++;
          if (inv.duration_ms) entry.durations.push(inv.duration_ms);
        }

        stats = Array.from(skillMap.entries()).map(([skill_name, data]) => ({
          skill_name,
          total_count: data.total,
          completed_count: data.completed,
          failed_count: data.failed,
          avg_duration_ms:
            data.durations.length > 0
              ? data.durations.reduce((a, b) => a + b, 0) / data.durations.length
              : null,
        }));
      }
    }

    return NextResponse.json({
      invocations: invocations || [],
      stats,
    });
  } catch (error) {
    console.error('pmOS skills API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch pmOS skill data',
      invocations: [],
      stats: [],
    });
  }
}
