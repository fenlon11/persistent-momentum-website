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
      products: [],
      current: null,
      previous: null,
      daily: [],
      events: [],
    });
  }

  const { searchParams } = request.nextUrl;
  const productSlug = searchParams.get('product') || '';
  const range = parseInt(searchParams.get('range') || '30');

  const now = new Date();
  const currentStart = new Date(now.getTime() - range * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const previousStart = new Date(now.getTime() - range * 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const today = now.toISOString().slice(0, 10);

  try {
    // Fetch all products
    const { data: products, error: prodErr } = await supabasePmos
      .from('products')
      .select('id, slug, name')
      .order('name');

    if (prodErr) {
      console.error('Error fetching products:', prodErr);
      return NextResponse.json({ error: 'Failed to fetch products', products: [], current: null, previous: null, daily: [], events: [] });
    }

    const productList = products || [];

    // Determine which product to query
    const selectedProduct = productSlug
      ? productList.find((p) => p.slug === productSlug)
      : productList[0];

    if (!selectedProduct) {
      return NextResponse.json({ products: productList, current: null, previous: null, daily: [], events: [] });
    }

    // Fetch current period metrics
    const { data: currentMetrics } = await supabasePmos
      .from('product_metrics_daily')
      .select('date, mrr, active_subs, downloads, rating')
      .eq('product_id', selectedProduct.id)
      .gte('date', currentStart)
      .lte('date', today)
      .order('date', { ascending: true });

    // Fetch previous period metrics for comparison
    const { data: previousMetrics } = await supabasePmos
      .from('product_metrics_daily')
      .select('date, mrr, active_subs, downloads, rating')
      .eq('product_id', selectedProduct.id)
      .gte('date', previousStart)
      .lt('date', currentStart)
      .order('date', { ascending: true });

    // Aggregate current period
    const currentRows = currentMetrics || [];
    const previousRows = previousMetrics || [];

    const latest = currentRows.length > 0 ? currentRows[currentRows.length - 1] : null;
    const prevLatest = previousRows.length > 0 ? previousRows[previousRows.length - 1] : null;

    const totalDownloadsCurrent = currentRows.reduce((sum, r) => sum + (r.downloads || 0), 0);
    const totalDownloadsPrevious = previousRows.reduce((sum, r) => sum + (r.downloads || 0), 0);

    const current = latest
      ? {
          mrr: latest.mrr || 0,
          active_subs: latest.active_subs || 0,
          downloads: totalDownloadsCurrent,
          rating: latest.rating || 0,
        }
      : null;

    const previous = prevLatest
      ? {
          mrr: prevLatest.mrr || 0,
          active_subs: prevLatest.active_subs || 0,
          downloads: totalDownloadsPrevious,
          rating: prevLatest.rating || 0,
        }
      : null;

    // Fetch recent events
    const { data: events } = await supabasePmos
      .from('product_events')
      .select('id, event_type, description, created_at')
      .eq('product_id', selectedProduct.id)
      .gte('created_at', currentStart)
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      products: productList,
      current,
      previous,
      daily: currentRows,
      events: events || [],
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch analytics data',
      products: [],
      current: null,
      previous: null,
      daily: [],
      events: [],
    });
  }
}
