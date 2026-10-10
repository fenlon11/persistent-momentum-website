import { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Consulting — Persistent Momentum',
  robots: { index: false },
};

export default function ConsultingPage() {
  return (
    <PagePlaceholder
      eyebrow="Consulting"
      title="Business and AI systems consulting."
      body="We help operators put AI to work in the systems they already run. The full page and inquiry form are on the way. Until then, email us."
    >
      <a
        href="mailto:info@persistentmomentum.com"
        className="inline-flex items-center justify-center text-base font-semibold px-7 py-3.5 text-white"
        style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius)' }}
      >
        info@persistentmomentum.com
      </a>
    </PagePlaceholder>
  );
}
