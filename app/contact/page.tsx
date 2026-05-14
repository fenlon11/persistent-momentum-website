import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Contact — Persistent Momentum',
  description:
    'Get in touch with Persistent Momentum — product ideas, partnerships, or questions about the portfolio.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-navy">
      <section className="border-b border-white/8 bg-navy">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-36 sm:px-8 sm:pt-44">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* left — intro + direct channels */}
            <div>
              <p className="eyebrow mb-5">Contact</p>
              <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                Tell us what you&apos;re working on.
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-mid">
                Product ideas, partnerships, press, or a question about the portfolio —
                send it over and we&apos;ll get back to you.
              </p>

              <div className="mt-10 space-y-px overflow-hidden rounded-xl border border-white/8 bg-white/8">
                <a
                  href="mailto:info@persistentmomentum.com"
                  className="block bg-navy-raised p-6 transition-colors hover:bg-navy"
                >
                  <p className="eyebrow mb-2">Email</p>
                  <p className="text-sm font-semibold text-white">info@persistentmomentum.com</p>
                  <p className="mt-1 text-sm text-mid">We typically respond within 24 hours.</p>
                </a>
                <a
                  href="tel:+14078012515"
                  className="block bg-navy-raised p-6 transition-colors hover:bg-navy"
                >
                  <p className="eyebrow mb-2">Phone</p>
                  <p className="text-sm font-semibold text-white">(407) 801-2515</p>
                  <p className="mt-1 text-sm text-mid">Monday–Friday, 9am–5pm ET.</p>
                </a>
              </div>
            </div>

            {/* right — form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
