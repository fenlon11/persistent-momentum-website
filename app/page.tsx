import Hero from '@/components/Hero';
import Positioning from '@/components/Positioning';
import PortfolioProducts from '@/components/PortfolioProducts';
import PmosSystem from '@/components/PmosSystem';
import ClosingCTA from '@/components/ClosingCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-navy">
      <Hero />
      <Positioning />
      <PortfolioProducts />
      <PmosSystem />
      <ClosingCTA />
      <Footer />
    </main>
  );
}
