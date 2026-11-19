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
    name: 'Persistent Workforce',
    category: 'Web platforms',
    tagline: 'AI employees that do real work, and never drop the ball.',
    description:
      'AI employees that confirm appointments, answer customer calls and texts, and book meetings with your leads — working every hour of every day, so nothing slips.',
    status: 'live',
    externalUrl: 'https://workforce.persistentmomentum.com/pricing',
    features: [
      'Appointment confirmations',
      'Customer calls and texts answered',
      'Meetings booked with your leads',
      'Working every hour of every day',
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
