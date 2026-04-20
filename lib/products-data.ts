export interface ProductFeature {
  title: string;
  description: string;
}

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  tagline: string;
  description: string;
  status: 'active' | 'building' | 'coming-soon';
  isPrimary?: boolean;
  features: ProductFeature[];
  pricing: PricingTier[];
  gradient: string;
}

export const products: Product[] = [
  {
    id: 'persistent-recruiter',
    slug: 'persistent-recruiter',
    name: 'Persistent Recruiter',
    shortName: 'Recruiter',
    icon: '🎯',
    tagline: 'The recruiting software small teams actually use.',
    description:
      'Candidate pipelines, public-facing forms and pages, Discovery Videos, and automated outreach — all in a single Next.js app on Supabase. Built for solo recruiters and small hiring teams.',
    status: 'building',
    features: [
      { title: 'Candidate Pipelines', description: 'Track candidates from sourcing to offer with stages you configure.' },
      { title: 'Public Forms & Pages', description: 'Publish branded intake forms and candidate-facing pages on your own domain.' },
      { title: 'Discovery Videos', description: 'Record, upload, and share personal videos with candidates and clients.' },
      { title: 'Automated Workflows', description: 'Status-change emails, activity logs, and follow-ups that run on their own.' },
    ],
    gradient: 'from-[#1E5BFF] to-[#A8C5FF]',
    pricing: [
      {
        name: 'Recruiter',
        price: '$49',
        period: '/mo',
        description: 'For solo recruiters.',
        features: ['Unlimited candidates', 'Public forms & pages', 'Discovery Videos', 'Email workflows'],
        cta: 'Get started',
        highlighted: true,
      },
      {
        name: 'Company',
        price: '$149',
        period: '/mo',
        description: 'For small hiring teams.',
        features: ['Everything in Recruiter', 'Multi-seat team', 'Brand settings per seat', 'Priority support'],
        cta: 'Get started',
      },
    ],
  },
  {
    id: 'persistent-marketer',
    slug: 'persistent-marketer',
    name: 'Persistent Marketer',
    shortName: 'Marketer',
    icon: '📣',
    tagline: 'AI-powered content and social automation for your business.',
    description:
      'Automated content planning, rendering, and posting across the channels you care about. Built on Claude and the same pmOS pipeline that runs every other Persistent product.',
    status: 'coming-soon',
    features: [
      { title: 'Content Planning', description: 'AI-drafted content calendars that match your voice and cadence.' },
      { title: 'Rendering Pipeline', description: 'Reels, stories, and posts rendered automatically to your brand.' },
      { title: 'Cross-Platform Posting', description: 'Instagram, TikTok, YouTube Shorts, LinkedIn — scheduled and tracked.' },
      { title: 'Analytics', description: 'See what\'s working across channels in one place.' },
    ],
    gradient: 'from-[#1E5BFF] to-[#A8C5FF]',
    pricing: [
      {
        name: 'Solo',
        price: 'TBA',
        description: 'For individual creators and operators.',
        features: ['Coming soon'],
        cta: 'Notify me',
      },
      {
        name: 'Team',
        price: 'TBA',
        description: 'For brands scaling content.',
        features: ['Coming soon'],
        cta: 'Notify me',
        highlighted: true,
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
