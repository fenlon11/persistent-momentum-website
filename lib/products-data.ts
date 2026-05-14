// Canonical product list for the corporate site.
// PM is a portfolio operator — customers meet each product on its OWN site/brand.
// This file only powers the "products we make" overview; it carries no pricing.
// Source of truth for positioning: projects/persistent-momentum/BUSINESS-PLAN.md
// Rule (BRAND.md): Rabbit Golf never appears on a PM customer-facing surface.

export type ProductStatus = 'live' | 'building' | 'in-design';

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
      'Candidate pipelines, branded public forms and pages, Discovery Videos, and automated outreach — one Next.js app on Supabase. Built for solo recruiters and small hiring teams. v1 shipped; v2 in build.',
    status: 'live',
    externalUrl: 'https://recruiter.persistentmomentum.com',
    features: [
      'Candidate pipelines',
      'Branded public forms & pages',
      'Discovery Videos',
      'Automated outreach workflows',
    ],
  },
  {
    id: 'persistent-marketer',
    name: 'Persistent Marketer',
    category: 'AI-powered automation',
    tagline: 'AI-powered content and social automation for your business.',
    description:
      'Automated content planning, rendering, and posting across the channels you care about. Built on Claude and the same pmOS pipeline that ships every Persistent product.',
    status: 'in-design',
    externalUrl: null,
    features: [
      'AI content planning',
      'Automated rendering pipeline',
      'Cross-platform posting',
      'Performance analytics',
    ],
  },
];

export const statusMeta: Record<ProductStatus, { label: string; dot: string }> = {
  live: { label: 'Live', dot: 'bg-emerald-400' },
  building: { label: 'In build', dot: 'bg-amber-400' },
  'in-design': { label: 'In design', dot: 'bg-mid' },
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
