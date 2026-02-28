import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('dashboard_session')?.value === 'authenticated';
}

export async function GET(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!supabase) {
    return NextResponse.json({ tasks: [], brands: [] });
  }

  const { searchParams } = request.nextUrl;
  const statusFilter = searchParams.get('status');
  const brandFilter = searchParams.get('brand_id');

  let query = supabase
    .from('build_queue')
    .select('*, brands(id, name, slug)')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  if (statusFilter) {
    const statuses = statusFilter.split(',');
    query = query.in('status', statuses);
  }
  if (brandFilter) {
    query = query.eq('brand_id', brandFilter);
  }

  const [tasksResult, brandsResult] = await Promise.all([
    query,
    supabase.from('brands').select('id, name, slug').eq('is_active', true).order('name'),
  ]);

  if (tasksResult.error) {
    return NextResponse.json({ error: tasksResult.error.message }, { status: 500 });
  }

  return NextResponse.json({
    tasks: tasksResult.data ?? [],
    brands: brandsResult.data ?? [],
  });
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const body = await request.json();
  const { brand_id, title, description, priority, tags } = body;

  if (!brand_id || !title) {
    return NextResponse.json({ error: 'brand_id and title are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('build_queue')
    .insert({
      brand_id,
      title,
      description: description || null,
      priority: priority ?? 0,
      status: 'queued',
      tags: tags || [],
    })
    .select('*, brands(id, name, slug)')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ task: data }, { status: 201 });
}
