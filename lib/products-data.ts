// Canonical product list for the corporate site.
// PM is a portfolio operator — customers meet each product on its OWN site/brand.
// Source of truth for positioning: projects/persistent-momentum/BUSINESS-PLAN.md
// Rule (BRAND.md): Rabbit Golf never appears on a PM customer-facing surface.

export type ProductStatus = 'live' | 'building' | 'in-design' | 'coming-soon';

export interface Product {
  id: string;
  name: string;
  category: 'Mobile apps' | 'Web platforms' | 'AI-powered automation';
  tagline: string;
  description: string;
  status: ProductStatus;
  /** The product's own site. Null until it has one. */
  externalUrl: string | null;
  features: string[];
}

export const products: Product[] = [
  {
    id: 'persistent-recruiter',
    name: 'Persistent Recruiter',
    category: 'Web platforms',
    tagline: 'The recruiting software small teams actually use.',
    description:
      'Candidate pipelines, branded public forms and pages, Discovery Videos, and automated outreach — one app on Next.js + Supabase. Built for solo recruiters and small hiring teams.',
    status: 'live',
    externalUrl: 'https://recruiter.persistentmomentum.com',
    features: [
      'Candidate pipelines',
      'Branded public forms & pages',
      'Discovery Videos',
      'Automated outreach',
    ],
  },
  {
    id: 'persistent-sales',
    name: 'Persistent Sales',
    category: 'Web platforms',
    tagline: 'A modern sales workflow for small teams.',
    description:
      'Pipeline tracking, automated outreach, and AI-assisted follow-up — built on the same foundation as Persistent Recruiter. Coming soon.',
    status: 'coming-soon',
    externalUrl: 'https://sales.persistentmomentum.com',
    features: [
      'Pipeline tracking',
      'Automated sequences',
      'AI-assisted follow-up',
      'Revenue analytics',
    ],
  },
];

export const statusMeta: Record<ProductStatus, { label: string; dot: string }> = {
  live: { label: 'Live', dot: 'bg-emerald-500' },
  building: { label: 'In build', dot: 'bg-amber-500' },
  'in-design': { label: 'In design', dot: 'bg-slate-400' },
  'coming-soon': { label: 'Coming soon', dot: 'bg-sky-500' },
};

export const categories = [
  {
    name: 'Mobile apps',
    description: 'Native iOS and Android products for business use — Expo, Supabase, RevenueCat.',
  },
  {
    name: 'Web platforms',
    description: 'Next.js SaaS — dashboards, tools, CRMs, workflow apps on Supabase, Stripe, Vercel.',
  },
  {
    name: 'AI-powered automation',
    description: 'Workflow, content, and ops automation built on the Claude API and Supabase.',
  },
];
