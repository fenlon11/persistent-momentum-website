import Footer from '@/components/Footer';

// Page frame shared by the index, tag and author pages.
export default function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main>
      <section className="px-6 pt-16 pb-24 md:pt-24 md:pb-32" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary)', letterSpacing: '0.12em' }}>
            {eyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-[1.1]" style={{ color: 'var(--color-text-dark)', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          {intro && (
            <div className="text-lg mb-10 max-w-3xl" style={{ color: 'var(--color-text-dark-muted)' }}>
              {intro}
            </div>
          )}
          {children}
        </div>
      </section>
      <Footer />
    </main>
  );
}
