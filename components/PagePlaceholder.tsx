import Link from 'next/link';
import Footer from '@/components/Footer';

// Holding page for a nav destination whose real page ships in its own issue
// (news + guides #681, newsletter #682, consulting #683). Pages using it are
// noindex so search never sees the empty state.
export default function PagePlaceholder({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <main>
      <section className="px-6 pt-16 pb-24 md:pt-24 md:pb-32" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}
          >
            {eyebrow}
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-5 leading-[1.1]"
            style={{ color: 'var(--color-text-dark)', letterSpacing: '-0.02em' }}
          >
            {title}
          </h1>
          <p className="text-lg mb-8" style={{ color: 'var(--color-text-dark-muted)' }}>
            {body}
          </p>
          {children ?? (
            <Link
              href="/newsletter"
              className="inline-flex items-center justify-center text-base font-semibold px-7 py-3.5 text-white"
              style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius)' }}
            >
              Get the newsletter <span className="ml-2">→</span>
            </Link>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
