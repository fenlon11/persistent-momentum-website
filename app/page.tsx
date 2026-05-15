import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import PortfolioThesis from '@/components/PortfolioThesis';
import Cta from '@/components/Cta';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <PortfolioThesis />
      <Cta />
      <Footer />
    </main>
  );
}
