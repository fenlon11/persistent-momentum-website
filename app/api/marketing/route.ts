import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabasePlatform, isPlatformConfigured } from '@/lib/supabase-platform';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get('dashboard_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isPlatformConfigured() || !supabasePlatform) {
    return NextResponse.json({ posts: [], totals: null, byType: [] });
  }

  const { searchParams } = request.nextUrl;
  const range = parseInt(searchParams.get('range') || '30');
  const brand = searchParams.get('brand') || '';

  const since = new Date(Date.now() - range * 86400000).toISOString();

  try {
    // Get brand_id if filtering
    let brandId: string | null = null;
    if (brand) {
      const { data: brands } = await supabasePlatform
        .from('ame_brand_configs')
        .select('id')
        .eq('brand_name', brand)
        .limit(1);
      brandId = brands?.[0]?.id || null;
    } else {
      // Default to first active brand
      const { data: brands } = await supabasePlatform
        .from('ame_brand_configs')
        .select('id, brand_name')
        .limit(1);
      brandId = brands?.[0]?.id || null;
    }

    // Get all brands for selector
    const { data: allBrands } = await supabasePlatform
      .from('ame_brand_configs')
      .select('id, brand_name')
      .order('brand_name');

    // Get posted content with performance data
    let contentQuery = supabasePlatform
      .from('ame_content_queue')
      .select('id, content_type, platform, scheduled_at, status, hook_text, platform_post_id')
      .eq('status', 'posted')
      .gte('scheduled_at', since.slice(0, 10))
      .order('scheduled_at', { ascending: false });

    if (brandId) {
      contentQuery = contentQuery.eq('brand_id', brandId);
    }

    const { data: posts } = await contentQuery;
    const postList = posts || [];

    // Get performance data for these posts
    const postIds = postList.map(p => p.id);
    let performanceData: Array<{
      content_queue_id: string;
      views: number;
      likes: number;
      comments: number;
      shares: number;
      saves: number;
      reach: number;
      performance_score: number;
      measured_at: string;
    }> = [];

    if (postIds.length > 0) {
      // Get latest performance snapshot per post
      const { data: perf } = await supabasePlatform
        .from('ame_content_performance')
        .select('content_queue_id, views, likes, comments, shares, saves, reach, performance_score, measured_at')
        .in('content_queue_id', postIds)
        .order('measured_at', { ascending: false });
      performanceData = perf || [];
    }

    // Dedupe: keep latest measurement per post
    const latestPerf = new Map<string, typeof performanceData[0]>();
    for (const p of performanceData) {
      if (!latestPerf.has(p.content_queue_id)) {
        latestPerf.set(p.content_queue_id, p);
      }
    }

    // Merge posts with their performance
    const enrichedPosts = postList.map(post => {
      const perf = latestPerf.get(post.id);
      return {
        id: post.id,
        content_type: post.content_type,
        platform: post.platform,
        scheduled_at: post.scheduled_at,
        hook_text: post.hook_text,
        views: perf?.views || 0,
        likes: perf?.likes || 0,
        comments: perf?.comments || 0,
        shares: perf?.shares || 0,
        saves: perf?.saves || 0,
        reach: perf?.reach || 0,
        performance_score: perf?.performance_score || 0,
      };
    });

    // Calculate totals
    const totals = {
      total_posts: enrichedPosts.length,
      total_reach: enrichedPosts.reduce((s, p) => s + p.reach, 0),
      total_likes: enrichedPosts.reduce((s, p) => s + p.likes, 0),
      total_comments: enrichedPosts.reduce((s, p) => s + p.comments, 0),
      total_shares: enrichedPosts.reduce((s, p) => s + p.shares, 0),
      total_saves: enrichedPosts.reduce((s, p) => s + p.saves, 0),
      total_views: enrichedPosts.reduce((s, p) => s + p.views, 0),
      avg_score: enrichedPosts.length > 0
        ? enrichedPosts.reduce((s, p) => s + p.performance_score, 0) / enrichedPosts.length
        : 0,
    };

    // Group by content type
    const typeMap = new Map<string, { count: number; reach: number; likes: number; score: number }>();
    for (const p of enrichedPosts) {
      const existing = typeMap.get(p.content_type) || { count: 0, reach: 0, likes: 0, score: 0 };
      existing.count += 1;
      existing.reach += p.reach;
      existing.likes += p.likes;
      existing.score += p.performance_score;
      typeMap.set(p.content_type, existing);
    }
    const byType = Array.from(typeMap.entries()).map(([type, data]) => ({
      type,
      count: data.count,
      reach: data.reach,
      likes: data.likes,
      avg_score: data.count > 0 ? data.score / data.count : 0,
    }));

    return NextResponse.json({
      brands: allBrands || [],
      posts: enrichedPosts,
      totals,
      byType,
    });
  } catch (error) {
    console.error('Marketing API error:', error);
    return NextResponse.json({ posts: [], totals: null, byType: [], error: 'Failed to fetch marketing data' });
  }
}
