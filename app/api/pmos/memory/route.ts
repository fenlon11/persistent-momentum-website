import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabasePmos, isPmosConfigured } from '@/lib/supabase-pmos';

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get('dashboard_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isPmosConfigured() || !supabasePmos) {
    return NextResponse.json({
      error: 'pmOS Supabase not configured',
      total: 0,
      byCategory: {},
      recent: [],
    });
  }

  try {
    // Get total count
    const { count: totalCount } = await supabasePmos
      .from('pm_memories')
      .select('*', { count: 'exact', head: true });

    // Get all memories for category breakdown
    const { data: allMemories } = await supabasePmos
      .from('pm_memories')
      .select('category');

    // Calculate category breakdown
    const byCategory: Record<string, number> = {};
    (allMemories || []).forEach((m) => {
      const cat = m.category || 'uncategorized';
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    });

    // Get recent memories
    const { data: recentMemories } = await supabasePmos
      .from('pm_memories')
      .select('id, content, category, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      total: totalCount || 0,
      byCategory,
      recent: recentMemories || [],
    });
  } catch (error) {
    console.error('pmOS memory API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch pmOS memory data',
      total: 0,
      byCategory: {},
      recent: [],
    });
  }
}
