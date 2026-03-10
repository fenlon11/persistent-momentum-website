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
    // Fetch all active products
    const { data: products, error: prodErr } = await supabasePlatform
      .from('products')
      .select('id, slug, name, status')
      .eq('status', 'active')
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

    // Fetch current period daily metrics (actual column names from DB)
    const { data: currentMetrics } = await supabasePlatform
      .from('product_metrics_daily')
      .select('date, mrr_cents, active_subscriptions, active_trials, downloads, redownloads, revenue_cents, rating_average, rating_count, review_count, sessions, active_devices, crash_count, impressions, product_page_views')
      .eq('product_id', selectedProduct.id)
      .gte('date', currentStart)
      .lte('date', today)
      .order('date', { ascending: true });

    // Fetch previous period metrics for comparison
    const { data: previousMetrics } = await supabasePlatform
      .from('product_metrics_daily')
      .select('date, mrr_cents, active_subscriptions, active_trials, downloads, revenue_cents, rating_average, rating_count, review_count')
      .eq('product_id', selectedProduct.id)
      .gte('date', previousStart)
      .lt('date', currentStart)
      .order('date', { ascending: true });

    const currentRows = currentMetrics || [];
    const previousRows = previousMetrics || [];

    const latest = currentRows.length > 0 ? currentRows[currentRows.length - 1] : null;
    const prevLatest = previousRows.length > 0 ? previousRows[previousRows.length - 1] : null;

    const totalDownloadsCurrent = currentRows.reduce((sum, r) => sum + (r.downloads || 0), 0);
    const totalDownloadsPrevious = previousRows.reduce((sum, r) => sum + (r.downloads || 0), 0);

    // Normalize to frontend-friendly shape
    const current = latest
      ? {
          mrr_cents: latest.mrr_cents || 0,
          active_subscriptions: latest.active_subscriptions || 0,
          active_trials: latest.active_trials || 0,
          downloads: totalDownloadsCurrent,
          rating_average: latest.rating_average || 0,
          rating_count: latest.rating_count || 0,
          review_count: latest.review_count || 0,
          revenue_cents: currentRows.reduce((sum, r) => sum + (r.revenue_cents || 0), 0),
        }
      : null;

    const previous = prevLatest
      ? {
          mrr_cents: prevLatest.mrr_cents || 0,
          active_subscriptions: prevLatest.active_subscriptions || 0,
          active_trials: prevLatest.active_trials || 0,
          downloads: totalDownloadsPrevious,
          rating_average: prevLatest.rating_average || 0,
          rating_count: prevLatest.rating_count || 0,
          review_count: prevLatest.review_count || 0,
          revenue_cents: previousRows.reduce((sum, r) => sum + (r.revenue_cents || 0), 0),
        }
      : null;

    // Map daily rows to consistent shape for charts
    const daily = currentRows.map((r) => ({
      date: r.date,
      mrr_cents: r.mrr_cents || 0,
      active_subscriptions: r.active_subscriptions || 0,
      active_trials: r.active_trials || 0,
      downloads: r.downloads || 0,
      redownloads: r.redownloads || 0,
      revenue_cents: r.revenue_cents || 0,
      sessions: r.sessions || 0,
      active_devices: r.active_devices || 0,
      rating_average: r.rating_average || 0,
    }));

    // Fetch recent events
    const { data: events } = await supabasePlatform
      .from('product_events')
      .select('id, event_type, title, details, date, created_at')
      .eq('product_id', selectedProduct.id)
      .gte('date', currentStart)
      .order('date', { ascending: false })
      .limit(20);

    return NextResponse.json({
      products: productList,
      current,
      previous,
      daily,
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
