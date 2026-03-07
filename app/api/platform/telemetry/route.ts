import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabasePlatform, isPlatformConfigured } from '@/lib/supabase-platform';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get('dashboard_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isPlatformConfigured() || !supabasePlatform) {
    return NextResponse.json({
      error: 'Platform Supabase not configured',
      events: [],
      guardrailBlocksCount: 0,
    });
  }

  const { searchParams } = request.nextUrl;
  const hours = parseInt(searchParams.get('hours') || '24');
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  try {
    // Get recent telemetry events
    const { data: events, error: eventsError } = await supabasePlatform
      .from('pmos_telemetry')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(100);

    if (eventsError) {
      console.error('Error fetching telemetry:', eventsError);
    }

    // Count guardrail blocks
    const { count: guardrailBlocksCount } = await supabasePlatform
      .from('pmos_telemetry')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'guardrail_block')
      .gte('created_at', since);

    return NextResponse.json({
      events: events || [],
      guardrailBlocksCount: guardrailBlocksCount || 0,
    });
  } catch (error) {
    console.error('Platform telemetry API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch platform telemetry data',
      events: [],
      guardrailBlocksCount: 0,
    });
  }
}
