import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabasePlatform, isPlatformConfigured } from '@/lib/supabase-platform';

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get('dashboard_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isPlatformConfigured() || !supabasePlatform) {
    return NextResponse.json({ logs: [] });
  }

  const { data, error } = await supabasePlatform
    .from('worker_activity_logs')
    .select('id, worker_name, action, status, details, brand_id, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ logs: data ?? [] });
}
