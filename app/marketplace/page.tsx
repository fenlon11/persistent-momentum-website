import { Metadata } from 'next';
import MarketplaceGrid from '@/components/MarketplaceGrid';

export const metadata: Metadata = {
  title: 'Worker Marketplace — Persistent Momentum',
  description: 'Browse our fleet of autonomous Workers. Automation, monitoring, marketing, and analytics tools running 24/7.',
};

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero section with top padding for fixed nav */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3E8BF5]/10 border border-[#3E8BF5]/20 backdrop-blur-sm mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-[#3E8BF5] font-medium">8 Workers Active</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Worker <span className="text-[#3E8BF5]">Marketplace</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Autonomous Workers running 24/7. Monitoring, marketing, analytics, and automation — all on autopilot.
          </p>
        </div>
        <MarketplaceGrid />
      </section>
    </main>
  );
}
