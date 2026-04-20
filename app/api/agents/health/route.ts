import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabasePlatform, isPlatformConfigured } from '@/lib/supabase-platform';

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get('dashboard_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isPlatformConfigured() || !supabasePlatform) {
    return NextResponse.json({ agents: [] });
  }

  const { data, error } = await supabasePlatform
    .from('worker_registry')
    .select('id, name, role, status, cron_schedule, repo, last_run_at, last_status, updated_at, created_at')
    .order('status', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ agents: data ?? [] });
}
