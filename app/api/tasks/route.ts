import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabasePlatform, isPlatformConfigured } from '@/lib/supabase-platform';

async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('dashboard_session')?.value === 'authenticated';
}

export async function GET(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isPlatformConfigured() || !supabasePlatform) {
    return NextResponse.json({ tasks: [] });
  }

  const { searchParams } = request.nextUrl;
  const statusFilter = searchParams.get('status');
  const productFilter = searchParams.get('product_slug');

  let query = supabasePlatform
    .from('cc_task_queue')
    .select('id, title, prompt, target_worker, priority, status, source, product_slug, loop_type, attempt_count, max_attempts, result_summary, assigned_at, completed_at, created_at')
    .order('priority', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(200);

  if (statusFilter) {
    const statuses = statusFilter.split(',');
    query = query.in('status', statuses);
  }
  if (productFilter) {
    query = query.eq('product_slug', productFilter);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tasks: data ?? [] });
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isPlatformConfigured() || !supabasePlatform) {
    return NextResponse.json({ error: 'Platform Supabase not configured' }, { status: 503 });
  }

  const body = await request.json();
  const { title, prompt, product_slug, priority, target_worker, loop_type, source } = body;

  if (!title || !prompt) {
    return NextResponse.json({ error: 'title and prompt are required' }, { status: 400 });
  }

  const { data, error } = await supabasePlatform
    .from('cc_task_queue')
    .insert({
      title,
      prompt,
      product_slug: product_slug || null,
      priority: priority ?? 0,
      status: 'pending',
      source: source || 'dashboard',
      target_worker: target_worker || null,
      loop_type: loop_type || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ task: data }, { status: 201 });
}
