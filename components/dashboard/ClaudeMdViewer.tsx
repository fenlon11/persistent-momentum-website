'use client';
import { useState, useEffect } from 'react';

export default function ClaudeMdViewer() {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchClaudeMd = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/claude-md');
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
        setLastFetched(new Date());
      } else {
        setContent('Failed to load CLAUDE.md');
      }
    } catch {
      setContent('Failed to load CLAUDE.md — check API route');
    }
    setLoading(false);
  };

  useEffect(() => { fetchClaudeMd(); }, []);

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold text-white mt-6 mb-2">{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-semibold text-blue-400 mt-5 mb-2">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-semibold text-slate-300 mt-4 mb-1">{line.slice(4)}</h3>;
      if (line.startsWith('- ')) return <div key={i} className="text-sm text-slate-400 pl-4 py-0.5">• {line.slice(2)}</div>;
      if (line.startsWith('---')) return <hr key={i} className="border-slate-700 my-4" />;
      if (line.trim() === '') return <div key={i} className="h-2"></div>;
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
      return <p key={i} className="text-sm text-slate-400 py-0.5" dangerouslySetInnerHTML={{ __html: formatted }}></p>;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">CLAUDE.md</h2>
          <p className="text-sm text-slate-400 mt-1">Live system config from GitHub</p>
        </div>
        <button onClick={fetchClaudeMd} className="text-xs bg-slate-800 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
          Refresh
        </button>
      </div>

      {lastFetched && <div className="text-xs text-slate-600">Last fetched: {lastFetched.toLocaleTimeString()}</div>}

      <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-slate-800 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }}></div>
            ))}
          </div>
        ) : content ? (
          <div className="font-mono text-xs sm:text-sm leading-relaxed">{renderContent(content)}</div>
        ) : (
          <div className="text-slate-500 text-center py-8">No content loaded</div>
        )}
      </div>
    </div>
  );
}
