import Hero from '@/components/Hero';
import Products from '@/components/Products';
import Services from '@/components/Services';
import PmosShowcase from '@/components/PmosShowcase';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Products />
      <Services />
      <PmosShowcase />
      <ContactForm />
      <Footer />
    </main>
  );
}
