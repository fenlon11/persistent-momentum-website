'use client';

import { useState } from 'react';
import { workers, categories } from '@/lib/workers-data';

const comingSoon = [
  { icon: '🧠', label: 'Skills', description: 'Teachable capabilities that Workers can learn and share.' },
  { icon: '🔧', label: 'Tools', description: 'Plug-and-play utilities for data, APIs, and workflows.' },
  { icon: '🔗', label: 'Integrations', description: 'Connect Workers to Slack, Notion, Stripe, and more.' },
];

export default function MarketplaceGrid() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? workers
    : workers.filter((w) => w.category === activeCategory);

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-[#3E8BF5] text-white shadow-lg shadow-[#3E8BF5]/25'
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-slate-700/30'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Worker grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((worker) => (
          <div
            key={worker.id}
            className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-6 transition-all duration-300 hover:border-[#3E8BF5]/50 hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{worker.icon}</span>
              {worker.status === 'active' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-xs font-medium text-emerald-400">Active</span>
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">{worker.name}</h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">{worker.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {worker.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="px-2.5 py-1 rounded-full bg-slate-700/50 text-slate-300 text-xs"
                >
                  {cap}
                </span>
              ))}
            </div>

            {worker.schedule && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-3 border-t border-slate-700/30">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {worker.schedule}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Coming Soon</h2>
        <p className="text-slate-500 text-center mb-10 text-sm">More marketplace categories on the way.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comingSoon.map((item) => (
            <div
              key={item.label}
              className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-2xl border border-slate-700/20 p-6 opacity-50"
            >
              <span className="text-3xl grayscale">{item.icon}</span>
              <h3 className="text-lg font-semibold text-slate-500 mt-4 mb-2">{item.label}</h3>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
