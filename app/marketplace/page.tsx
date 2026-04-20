import { Metadata } from 'next';
import MarketplaceGrid from '@/components/MarketplaceGrid';

export const metadata: Metadata = {
  title: 'Agent Marketplace — Persistent Momentum',
  description: 'Browse our fleet of autonomous Agents. Automation, monitoring, marketing, and analytics tools that run when you\'re not.',
};

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero section with top padding for fixed nav */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E5BFF]/10 border border-[#1E5BFF]/20 backdrop-blur-sm mb-6">
            <span className="text-sm text-[#1E5BFF] font-medium">Agent Marketplace</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Agent <span className="text-[#1E5BFF]">Marketplace</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Background automation for monitoring, marketing, analytics, and operational tasks.
          </p>
        </div>
        <MarketplaceGrid />
      </section>
    </main>
  );
}
