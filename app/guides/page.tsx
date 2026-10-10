import { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Guides — Persistent Momentum',
  robots: { index: false },
};

export default function GuidesPage() {
  return (
    <PagePlaceholder
      eyebrow="Guides"
      title="Guides, coming soon."
      body="Plain explainers on putting AI to work in a business. The first guides publish soon."
    />
  );
}
