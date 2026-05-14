'use client';
import { systemNodes, systemConnections } from '@/lib/dashboard-data';

const tiers = [
  { label: 'Orchestration', types: ['orchestrator', 'builder'] },
  { label: 'Infrastructure', types: ['infrastructure'] },
  { label: 'Products', types: ['product'] },
];

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500',
  building: 'bg-amber-500',
  planned: 'bg-mid',
};

const connectionTypeColors: Record<string, string> = {
  command: 'text-electric',
  data: 'text-emerald-400',
  deploy: 'text-amber-400',
  monitor: 'text-purple-400',
};

export default function SystemMap() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">System Architecture</h2>
        <p className="text-sm text-mid mt-1">How the Persistent Momentum system operates</p>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-electric"></span> Command</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Data</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Deploy</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400"></span> Monitor</span>
      </div>

      {tiers.map((tier, tierIndex) => {
        const tierNodes = systemNodes.filter((n) => tier.types.includes(n.type));
        const tierNodeIds = tierNodes.map(n => n.id);
        const outboundConnections = systemConnections.filter(c => tierNodeIds.includes(c.from));

        return (
          <div key={tier.label}>
            <div className="text-xs font-semibold text-mid uppercase tracking-wider mb-3">{tier.label}</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {tierNodes.map((node) => (
                <div
                  key={node.id}
                  className="relative bg-navy-raised border border-white/8 rounded-xl p-3 hover:border-electric/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{node.icon}</span>
                    <span className={`w-2 h-2 rounded-full ${statusColors[node.status]} ${node.status === 'active' ? 'animate-pulse' : ''}`}></span>
                  </div>
                  <div className="text-sm font-semibold text-white">{node.label}</div>
                  <div className="text-xs text-mid mt-1 line-clamp-2">{node.description}</div>
                </div>
              ))}
            </div>

            {tierIndex < tiers.length - 1 && outboundConnections.length > 0 && (
              <div className="my-4 pl-4 border-l-2 border-white/8 space-y-1">
                <div className="text-xs text-mid mb-1">↓ Data Flow</div>
                {outboundConnections.slice(0, 4).map((conn, i) => {
                  const fromNode = systemNodes.find(n => n.id === conn.from);
                  const toNode = systemNodes.find(n => n.id === conn.to);
                  return (
                    <div key={i} className={`text-xs ${connectionTypeColors[conn.type]}`}>
                      {fromNode?.icon} → {toNode?.icon} {conn.label}
                    </div>
                  );
                })}
                {outboundConnections.length > 4 && (
                  <div className="text-xs text-mid">+{outboundConnections.length - 4} more</div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="bg-gradient-to-r from-electric/10 to-emerald-500/10 border border-electric/25 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white">System Health</div>
            <div className="text-xs text-mid mt-1">Based on node status</div>
          </div>
          <div className="text-3xl font-bold text-emerald-400">
            {Math.round((systemNodes.filter(n => n.status === 'active').length / systemNodes.length) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}
