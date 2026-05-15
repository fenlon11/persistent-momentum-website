import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Contact — Persistent Momentum',
  description:
    'Talk to Persistent Momentum — investors, partners, talent, press. The corporate side runs through this door.',
};

const channels = [
  {
    href: 'mailto:info@persistentmomentum.com',
    label: 'Email',
    value: 'info@persistentmomentum.com',
    note: '24-hour response, weekdays.',
  },
  {
    href: 'tel:+14078012515',
    label: 'Phone',
    value: '(407) 801-2515',
    note: 'Mon–Fri, 9am–5pm ET.',
  },
];

const audiences = [
  { code: 'INV', label: 'Investors & acquirers' },
  { code: 'PTR', label: 'Distribution partners' },
  { code: 'TLT', label: 'Builders & talent' },
  { code: 'PR', label: 'Press' },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-navy">
      <section className="relative border-b border-white/8 bg-navy">
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-36 sm:px-8 sm:pt-44">
          {/* Sheet header */}
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px flex-1 bg-white/12" />
            <span className="annotation-bright">Sheet D &middot; Contact</span>
          </div>

          <div className="mt-12 grid gap-14 lg:grid-cols-2 lg:gap-16">
            {/* left — intro + audiences + direct channels */}
            <div>
              <p className="annotation">Contact</p>
              <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
                Investors, partners, talent, press.
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-mid sm:text-lg">
                The corporate door. If you&apos;re a customer of one of our
                products, the product&apos;s own site is probably where you want
                to go — they&apos;re each linked from{' '}
                <a
                  href="/portfolio"
                  className="text-electric underline-offset-4 hover:underline"
                >
                  the portfolio
                </a>
                .
              </p>

              {/* Who this page is for */}
              <div className="mt-12">
                <p className="annotation mb-4">Who this page is for</p>
                <div className="grid grid-cols-2 gap-px overflow-hidden border border-white/12 bg-white/12">
                  {audiences.map((a) => (
                    <div key={a.code} className="bg-navy px-4 py-4">
                      <p className="font-mono text-[11px] tracking-widest text-electric">
                        {a.code}
                      </p>
                      <p className="mt-1.5 text-sm font-semibold text-white">
                        {a.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct channels */}
              <div className="mt-10">
                <p className="annotation mb-4">Direct channels</p>
                <ul className="space-y-px overflow-hidden border border-white/12 bg-white/12">
                  {channels.map((c) => (
                    <li key={c.label}>
                      <a
                        href={c.href}
                        className="block bg-navy px-5 py-5 transition-colors hover:bg-navy-raised"
                      >
                        <p className="annotation mb-1.5">{c.label}</p>
                        <p className="text-base font-semibold text-white">
                          {c.value}
                        </p>
                        <p className="mt-1 text-sm text-mid">{c.note}</p>
                      </a>
                    </li>
                  ))}
                </ul>
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
