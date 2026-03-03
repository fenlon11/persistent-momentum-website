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
      logs: [],
      countsByType: {},
    });
  }

  const { searchParams } = request.nextUrl;
  const days = parseInt(searchParams.get('days') || '7');
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  try {
    // Get recent session logs
    const { data: logs, error: logsError } = await supabasePmos
      .from('pmos_session_logs')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(100);

    if (logsError) {
      console.error('Error fetching session logs:', logsError);
    }

    // Calculate counts by type
    const countsByType: Record<string, number> = {};
    (logs || []).forEach((log) => {
      const type = log.entry_type || 'event';
      countsByType[type] = (countsByType[type] || 0) + 1;
    });

    return NextResponse.json({
      logs: logs || [],
      countsByType,
    });
  } catch (error) {
    console.error('pmOS sessions API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch pmOS session data',
      logs: [],
      countsByType: {},
    });
  }
}
