import Hero from '@/components/Hero';
import Thesis from '@/components/Thesis';
import PmosCycle from '@/components/PmosCycle';
import PortfolioBoard from '@/components/PortfolioBoard';
import PortfolioMath from '@/components/PortfolioMath';
import TwoDoors from '@/components/TwoDoors';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-navy">
      <Hero />
      <Thesis />
      <PmosCycle />
      <PortfolioBoard />
      <PortfolioMath />
      <TwoDoors />
      <Footer />
    </main>
  );
}
