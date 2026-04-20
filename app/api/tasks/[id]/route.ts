import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabasePlatform, isPlatformConfigured } from '@/lib/supabase-platform';

async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('dashboard_session')?.value === 'authenticated';
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isPlatformConfigured() || !supabasePlatform) {
    return NextResponse.json({ error: 'Platform Supabase not configured' }, { status: 503 });
  }

  const { id } = await params;
  const body = await request.json();
  const allowed = ['status', 'title', 'prompt', 'priority', 'product_slug', 'result_summary'];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  if (updates.status === 'completed') {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabasePlatform
    .from('cc_task_queue')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ task: data });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isPlatformConfigured() || !supabasePlatform) {
    return NextResponse.json({ error: 'Platform Supabase not configured' }, { status: 503 });
  }

  const { id } = await params;
  const { error } = await supabasePlatform.from('cc_task_queue').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
