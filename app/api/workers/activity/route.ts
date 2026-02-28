import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('dashboard_session');
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ logs: [] });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('worker_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase query error:', error.message);
      return NextResponse.json({ logs: [] });
    }

    return NextResponse.json({ logs: data ?? [] });
  } catch {
    return NextResponse.json({ logs: [] });
  }
}
