'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface PostMetrics {
  id: string;
  content_type: string;
  platform: string;
  scheduled_at: string;
  hook_text: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  performance_score: number;
}

interface Totals {
  total_posts: number;
  total_reach: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_saves: number;
  total_views: number;
  avg_score: number;
}

interface ByType {
  type: string;
  count: number;
  reach: number;
  likes: number;
  avg_score: number;
}

interface MarketingData {
  brands: { id: string; brand_name: string }[];
  posts: PostMetrics[];
  totals: Totals | null;
  byType: ByType[];
  error?: string;
}

const COLORS = ['#3E8BF5', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid rgb(51 65 85 / 0.5)',
  borderRadius: '8px',
  color: '#e2e8f0',
  fontSize: 12,
};

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 p-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  );
}

export default function MarketingMetrics({ range }: { range: number }) {
  const [data, setData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/marketing?range=${range}`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [range]);

  if (loading) {
    return (
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-bold text-white">Marketing</h3>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!data || !data.totals || data.totals.total_posts === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-bold text-white mb-3">Marketing</h3>
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 p-6 text-center">
          <div className="text-3xl mb-2">📱</div>
          <p className="text-slate-400 text-sm">No marketing posts found in this period. Content from Instagram and other platforms will appear here once the AME pipeline posts and the analyzer collects metrics.</p>
        </div>
      </div>
    );
  }

  const { totals, byType, posts } = data;

  // Top posts by engagement (reach)
  const topPosts = [...posts].sort((a, b) => b.reach - a.reach).slice(0, 5);

  // Posts per day for bar chart
  const dailyMap = new Map<string, number>();
  for (const p of posts) {
    const day = p.scheduled_at?.slice(0, 10) || 'unknown';
    dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
  }
  const dailyPosts = Array.from(dailyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({
      label: new Date(date + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      posts: count,
    }));

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-bold text-white">Marketing</h3>
        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">Instagram</span>
      </div>

      {/* Totals row */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Posts" value={totals.total_posts} icon="📝" />
        <StatCard label="Reach" value={totals.total_reach} icon="👀" />
        <StatCard label="Likes" value={totals.total_likes} icon="❤️" />
        <StatCard label="Comments" value={totals.total_comments} icon="💬" />
        <StatCard label="Shares" value={totals.total_shares} icon="🔄" />
        <StatCard label="Saves" value={totals.total_saves} icon="🔖" />
      </div>

      {/* Content type breakdown + posting frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* By content type */}
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 p-4">
          <h4 className="text-sm font-semibold text-white mb-3">By Content Type</h4>
          {byType.length > 0 ? (
            <div className="space-y-2">
              {byType.map((t, i) => (
                <div key={t.type} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm text-slate-300 capitalize w-16">{t.type}</span>
                  <span className="text-xs text-slate-500">{t.count} posts</span>
                  <div className="flex-1" />
                  <span className="text-xs text-slate-400">{t.reach.toLocaleString()} reach</span>
                  <span className="text-xs font-medium text-blue-400">{(t.avg_score * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No type data</p>
          )}
        </div>

        {/* Posting frequency */}
        {dailyPosts.length > 1 && (
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 p-4">
            <h4 className="text-sm font-semibold text-white mb-3">Posting Frequency</h4>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={dailyPosts}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(51 65 85 / 0.4)" />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="posts" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top performing posts */}
      {topPosts.length > 0 && topPosts.some(p => p.reach > 0) && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 p-4">
          <h4 className="text-sm font-semibold text-white mb-3">Top Posts</h4>
          <div className="space-y-2">
            {topPosts.filter(p => p.reach > 0).map((post, i) => (
              <div key={post.id} className="flex items-center gap-3 text-xs bg-slate-800/50 rounded-lg p-2.5">
                <span className="text-slate-500 font-mono w-5">{i + 1}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium capitalize ${
                  post.content_type === 'reel' ? 'bg-purple-500/20 text-purple-400' :
                  post.content_type === 'story' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>{post.content_type}</span>
                <span className="text-slate-300 truncate flex-1">{post.hook_text || 'Untitled'}</span>
                <span className="text-slate-500">{post.reach.toLocaleString()} reach</span>
                <span className="text-slate-500">{post.likes} ❤️</span>
                <span className={`font-medium ${post.performance_score >= 0.5 ? 'text-emerald-400' : post.performance_score >= 0.2 ? 'text-amber-400' : 'text-slate-500'}`}>
                  {(post.performance_score * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
