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
  mrr: number;
  active_subs: number;
  downloads: number;
  rating: number;
}

interface ProductEvent {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
}

interface KPIData {
  mrr: number;
  active_subs: number;
  downloads: number;
  rating: number;
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

function formatCurrency(val: number) {
  return `$${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function pctChange(current: number, previous: number): string | null {
  if (!previous) return null;
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

function KPICard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string | null;
}) {
  const isPositive = change && change.startsWith('+');
  const isNegative = change && change.startsWith('-');

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-4">
      <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      {change && (
        <p
          className={`text-xs mt-1 ${
            isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-slate-500'
          }`}
        >
          {change} vs prev period
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
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Analytics</h2>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-8 text-center">
          <p className="text-slate-400 text-lg mb-2">No analytics data available</p>
          <p className="text-slate-500 text-sm">
            {data?.error || 'Connect your pmOS Supabase to see product metrics.'}
          </p>
        </div>
      </div>
    );
  }

  const { products, current, previous, daily, events } = data;

  const chartData = daily.map((d) => ({
    ...d,
    label: formatChartDate(d.date),
  }));

  return (
    <div className="space-y-6">
      {/* Header with product selector and range pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Analytics</h2>
          {products.length > 1 && (
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

      {/* Empty state */}
      {!current && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-8 text-center">
          <p className="text-slate-400 text-lg mb-2">No metrics yet</p>
          <p className="text-slate-500 text-sm">
            Product metrics will appear here once data flows into product_metrics_daily.
          </p>
        </div>
      )}

      {/* KPI Cards */}
      {current && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KPICard
            label="MRR"
            value={formatCurrency(current.mrr)}
            change={previous ? pctChange(current.mrr, previous.mrr) : null}
          />
          <KPICard
            label="Active Subs"
            value={current.active_subs.toLocaleString()}
            change={previous ? pctChange(current.active_subs, previous.active_subs) : null}
          />
          <KPICard
            label="Downloads"
            value={current.downloads.toLocaleString()}
            change={previous ? pctChange(current.downloads, previous.downloads) : null}
          />
          <KPICard
            label="Rating"
            value={current.rating.toFixed(1)}
            change={previous ? pctChange(current.rating, previous.rating) : null}
          />
        </div>
      )}

      {/* MRR Line Chart */}
      {chartData.length > 0 && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-4">
          <h3 className="text-sm font-semibold text-white mb-4">MRR Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(51 65 85 / 0.4)" />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v}`, 'MRR']} />
              <Line
                type="monotone"
                dataKey="mrr"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Downloads Bar Chart */}
      {chartData.length > 0 && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Daily Downloads</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(51 65 85 / 0.4)" />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="downloads" fill="#3E8BF5" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Events List */}
      {events.length > 0 && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Events</h3>
          <div className="space-y-2">
            {events.map((ev) => {
              const dt = new Date(ev.created_at);
              return (
                <div
                  key={ev.id}
                  className="flex items-start gap-3 py-2 border-b border-slate-800/50 last:border-0"
                >
                  <span className="flex-shrink-0 mt-0.5 w-2 h-2 rounded-full bg-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200">{ev.description}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      <span className="text-slate-400">{ev.event_type}</span>
                      {' · '}
                      {dt.toLocaleDateString('en', { month: 'short', day: 'numeric' })}{' '}
                      {dt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
