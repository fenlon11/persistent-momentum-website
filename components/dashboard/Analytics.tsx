'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Product {
  id: string;
  slug: string;
  name: string;
}

interface DailyMetric {
  date: string;
  mrr_cents: number;
  active_subscriptions: number;
  active_trials: number;
  downloads: number;
  redownloads: number;
  revenue_cents: number;
  sessions: number;
  active_devices: number;
  rating_average: number;
}

interface ProductEvent {
  id: string;
  event_type: string;
  title: string;
  date: string;
  created_at: string;
}

interface KPIData {
  mrr_cents: number;
  active_subscriptions: number;
  active_trials: number;
  downloads: number;
  rating_average: number;
  rating_count: number;
  review_count: number;
  revenue_cents: number;
}

interface AnalyticsData {
  products: Product[];
  current: KPIData | null;
  previous: KPIData | null;
  daily: DailyMetric[];
  events: ProductEvent[];
  error?: string;
}

type Range = 30 | 60 | 90;

function formatCurrency(cents: number) {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(dollars);
}

function pctChange(current: number, previous: number): string | null {
  if (!previous) return null;
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

function KPICard({ label, value, subtitle, change }: { label: string; value: string; subtitle?: string; change: string | null }) {
  const isPositive = change && change.startsWith('+');
  const isNegative = change && change.startsWith('-');

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 p-4">
      <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      {change && (
        <p className={`text-xs mt-1 font-medium ${isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-slate-500'}`}>
          {isPositive ? '↑' : isNegative ? '↓' : ''} {change} vs prev period
        </p>
      )}
    </div>
  );
}

function formatChartDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid rgb(51 65 85 / 0.5)',
  borderRadius: '8px',
  color: '#e2e8f0',
  fontSize: 12,
};

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>(30);
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ range: String(range) });
    if (selectedProduct) params.set('product', selectedProduct);

    fetch(`/api/analytics?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (!selectedProduct && d.products?.length > 0) {
          setSelectedProduct(d.products[0].slug);
        }
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [range, selectedProduct]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Analytics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-slate-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Analytics</h2>
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 p-8 text-center">
          <div className="text-4xl mb-3">📈</div>
          <p className="text-slate-300 text-lg mb-2">Analytics Dashboard</p>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            {data?.error === 'pmOS Supabase not configured'
              ? 'Connect your pmOS Supabase to see product metrics. Add PMOS_SUPABASE_URL and PMOS_SUPABASE_SERVICE_KEY to your environment.'
              : 'Analytics data will appear here once the sync worker starts collecting metrics from RevenueCat and App Store Connect.'}
          </p>
        </div>
      </div>
    );
  }

  const { products, current, previous, daily, events } = data;

  // Transform daily data for charts (cents → dollars for display)
  const chartData = daily.map((d) => ({
    label: formatChartDate(d.date),
    mrr: d.mrr_cents / 100,
    downloads: d.downloads,
    revenue: d.revenue_cents / 100,
    sessions: d.sessions,
    active_subs: d.active_subscriptions,
  }));

  // Calculate download totals from daily array
  const last7Days = daily.slice(-7);
  const downloads7d = last7Days.reduce((sum, d) => sum + (d.downloads || 0), 0);
  const downloadsToday = daily.length > 0 ? daily[daily.length - 1].downloads || 0 : 0;

  return (
    <div className="space-y-6">
      {/* Header with product selector and range pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Analytics</h2>
          {products.length > 0 && (
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex gap-1">
          {([30, 60, 90] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                range === r
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 border border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* Empty state when no metrics data */}
      {!current && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 p-8 text-center">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-slate-300 text-lg mb-2">Waiting for metrics</p>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Product metrics will appear here once the <code className="text-blue-400">pm-analytics-sync</code> worker starts collecting data from RevenueCat and App Store Connect.
          </p>
        </div>
      )}

      {/* KPI Cards */}
      {current && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KPICard
            label="MRR"
            value={formatCurrency(current.mrr_cents)}
            change={previous ? pctChange(current.mrr_cents, previous.mrr_cents) : null}
          />
          <KPICard
            label="Active Subs"
            value={current.active_subscriptions.toLocaleString()}
            subtitle={current.active_trials > 0 ? `${current.active_trials} trials` : undefined}
            change={previous ? pctChange(current.active_subscriptions, previous.active_subscriptions) : null}
          />
          <KPICard
            label="Downloads"
            value={current.downloads.toLocaleString()}
            subtitle={`Today: ${downloadsToday} · 7d: ${downloads7d}`}
            change={previous ? pctChange(current.downloads, previous.downloads) : null}
          />
          <KPICard
            label="Rating"
            value={current.rating_average ? `★ ${Number(current.rating_average).toFixed(1)}` : '—'}
            subtitle={current.rating_count > 0 ? `${current.rating_count} ratings · ${current.review_count} reviews` : undefined}
            change={previous?.rating_average ? pctChange(Number(current.rating_average), Number(previous.rating_average)) : null}
          />
        </div>
      )}

      {/* MRR Line Chart */}
      {chartData.length > 0 && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(51 65 85 / 0.4)" />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${Number(v).toFixed(2)}`, 'MRR']} />
              <Line type="monotone" dataKey="mrr" stroke="#3E8BF5" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#3E8BF5' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Downloads Bar Chart */}
      {chartData.length > 0 && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Daily Downloads</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(51 65 85 / 0.4)" />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="downloads" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Events */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/80 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Recent Events</h3>
        {events.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {events.map((event) => (
              <div key={event.id} className="flex items-start gap-3 text-xs bg-slate-800/50 rounded-lg p-3">
                <span className="text-slate-500 whitespace-nowrap">{new Date(event.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  event.event_type === 'release' ? 'bg-blue-500/20 text-blue-400' :
                  event.event_type === 'review' ? 'bg-amber-500/20 text-amber-400' :
                  event.event_type === 'marketing' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {event.event_type}
                </span>
                <span className="text-slate-300">{event.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-3 text-center">
            Events like app releases, reviews, and marketing campaigns will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
