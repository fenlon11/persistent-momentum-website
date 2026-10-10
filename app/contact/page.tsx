import { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Contact — Persistent Momentum',
  description:
    'Talk to Persistent Momentum — investors, partners, talent, press. Customers should go to the relevant product site.',
};

const channels = [
  {
    href: 'mailto:info@persistentmomentum.com',
    label: 'Email',
    value: 'info@persistentmomentum.com',
    note: 'The fastest way to reach us — 24-hour response, weekdays.',
  },
];

export default function ContactPage() {
  return (
    <main>
      {/* Header + form */}
      <section className="px-6 pt-6 pb-16 md:pt-20 md:pb-24" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{
                  color: 'var(--color-primary)',
                  letterSpacing: '0.12em',
                }}
              >
                Contact
              </p>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 md:mb-6 leading-[1.1] md:leading-[1.05]"
                style={{
                  color: 'var(--color-text-dark)',
                  letterSpacing: '-0.02em',
                }}
              >
                Investors, partners,
                <br />
                <span
                  style={{
                    fontStyle: 'italic',
                    fontWeight: 300,
                    color: 'var(--color-text-dark-muted)',
                  }}
                >
                  talent, press.
                </span>
              </h1>
              <p
                className="text-lg md:text-xl max-w-md leading-relaxed mb-10"
                style={{ color: 'var(--color-text-dark-muted)' }}
              >
                The corporate door. If you&apos;re a customer looking for one of
                our products, the product&apos;s own site is where you want to
                go &mdash;{' '}
                <a
                  href="https://workforce.persistentmomentum.com"
                  className="font-semibold underline-offset-4 hover:underline"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Persistent Workforce
                </a>
                . Interested in consulting?{' '}
                <Link
                  href="/consulting"
                  className="font-semibold underline-offset-4 hover:underline"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Start at our consulting page
                </Link>
                .
              </p>

              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{
                  color: 'var(--color-primary)',
                  letterSpacing: '0.12em',
                }}
              >
                Direct channels
              </p>
              <div
                className="overflow-hidden"
                style={{
                  background: 'var(--color-bg-light-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                {channels.map((c, i) => (
                  <a
                    key={c.label}
                    href={c.href}
                    className="block p-5 transition-colors"
                    style={{
                      borderTop:
                        i > 0 ? '1px solid var(--color-border-light)' : 'none',
                    }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-widest mb-1.5"
                      style={{
                        color: 'var(--color-primary)',
                        letterSpacing: '0.12em',
                      }}
                    >
                      {c.label}
                    </p>
                    <p
                      className="text-base font-bold"
                      style={{ color: 'var(--color-text-dark)' }}
                    >
                      {c.value}
                    </p>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: 'var(--color-text-dark-muted)' }}
                    >
                      {c.note}
                    </p>
                  </a>
                ))}
              </div>

              <p
                className="mt-5 text-sm"
                style={{ color: 'var(--color-text-dark-muted)' }}
              >
                Persistent Momentum, LLC &middot; United States
              </p>
            </div>

            {/* form */}
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
