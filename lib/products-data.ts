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
    id: 'persistent-sales',
    slug: 'persistent-sales',
    name: 'Persistent Sales',
    shortName: 'Sales',
    icon: '💼',
    tagline: 'Your CRM, supercharged with AI agents',
    description:
      'The primary platform. Manage contacts, deals, pipelines, and automate follow-ups. All other Persistent products plug in as add-ons or run standalone.',
    status: 'coming-soon',
    isPrimary: true,
    gradient: 'from-blue-500 to-cyan-500',
    features: [
      { title: 'Smart Pipelines', description: 'AI-prioritized deal stages that adapt to your sales process' },
      { title: 'Contact Intelligence', description: 'Unified contact profiles with activity history and engagement scoring' },
      { title: 'Automated Follow-ups', description: 'Never miss a touchpoint — agents handle outreach sequences' },
      { title: 'Add-on Hub', description: 'Plug in Marketing, Operations, and Recruiter modules seamlessly' },
    ],
    pricing: [
      {
        name: 'Starter',
        price: '$49',
        period: '/mo',
        description: 'For solo operators getting started',
        features: ['Up to 500 contacts', '1 pipeline', 'Basic automation', 'Email integration'],
        cta: 'Coming Soon',
      },
      {
        name: 'Pro',
        price: '$99',
        period: '/mo',
        description: 'For growing teams that need power',
        features: ['Unlimited contacts', 'Unlimited pipelines', 'AI agents included', 'All integrations', 'Priority support'],
        cta: 'Coming Soon',
        highlighted: true,
      },
      {
        name: 'Platform',
        price: '$199',
        period: '/mo',
        description: 'Full suite with all add-ons',
        features: ['Everything in Pro', 'Marketing add-on', 'Operations add-on', 'Recruiter add-on', 'Custom agents', 'API access'],
        cta: 'Coming Soon',
      },
    ],
  },
  {
    id: 'persistent-marketing',
    slug: 'persistent-marketing',
    name: 'Persistent Marketing',
    shortName: 'Marketing',
    icon: '📣',
    tagline: 'Automated content and campaigns that never stop',
    description:
      'Content scheduling, social media automation, SEO pipelines, and analytics — all in one place. Runs standalone or plugs into Persistent Sales.',
    status: 'coming-soon',
    gradient: 'from-purple-500 to-pink-500',
    features: [
      { title: 'Content Pipeline', description: 'Plan, create, and schedule content across all channels' },
      { title: 'Social Automation', description: 'Auto-post to Meta, X, LinkedIn, and more on your schedule' },
      { title: 'SEO Engine', description: 'Automated indexing, keyword tracking, and content optimization' },
      { title: 'Campaign Analytics', description: 'Track performance across channels with unified dashboards' },
    ],
    pricing: [
      {
        name: 'Solo',
        price: '$39',
        period: '/mo',
        description: 'For individual creators',
        features: ['3 social accounts', 'Content calendar', 'Basic analytics', 'SEO monitoring'],
        cta: 'Coming Soon',
      },
      {
        name: 'Growth',
        price: '$79',
        period: '/mo',
        description: 'For brands scaling content',
        features: ['10 social accounts', 'AI content generation', 'Advanced analytics', 'Campaign automation', 'SEO agent'],
        cta: 'Coming Soon',
        highlighted: true,
      },
      {
        name: 'Add-on',
        price: '+$49',
        period: '/mo',
        description: 'Add to Persistent Sales',
        features: ['Everything in Growth', 'CRM integration', 'Lead scoring from content', 'Unified contact view'],
        cta: 'Coming Soon',
      },
    ],
  },
  {
    id: 'persistent-operations',
    slug: 'persistent-operations',
    name: 'Persistent Operations',
    shortName: 'Operations',
    icon: '⚙️',
    tagline: 'Streamline everything behind the scenes',
    description:
      'Task management, workflow automation, team coordination, and system monitoring. Runs standalone or plugs into Persistent Sales.',
    status: 'coming-soon',
    gradient: 'from-amber-500 to-orange-500',
    features: [
      { title: 'Workflow Builder', description: 'Visual automation builder for repeatable business processes' },
      { title: 'System Health', description: 'Monitor uptime, performance, and agent activity across your stack' },
      { title: 'Task Orchestration', description: 'Assign, track, and automate tasks across your team or agents' },
      { title: 'Integration Hub', description: 'Connect to Slack, Notion, Stripe, and 50+ tools' },
    ],
    pricing: [
      {
        name: 'Essentials',
        price: '$29',
        period: '/mo',
        description: 'For small teams',
        features: ['5 workflows', 'Basic monitoring', 'Task management', 'Slack integration'],
        cta: 'Coming Soon',
      },
      {
        name: 'Business',
        price: '$69',
        period: '/mo',
        description: 'For scaling operations',
        features: ['Unlimited workflows', 'Full monitoring suite', 'Agent orchestration', 'All integrations', 'Custom alerts'],
        cta: 'Coming Soon',
        highlighted: true,
      },
      {
        name: 'Add-on',
        price: '+$39',
        period: '/mo',
        description: 'Add to Persistent Sales',
        features: ['Everything in Business', 'CRM workflow triggers', 'Deal-based automation', 'Unified dashboard'],
        cta: 'Coming Soon',
      },
    ],
  },
  {
    id: 'persistent-recruiter',
    slug: 'persistent-recruiter',
    name: 'Persistent Recruiter',
    shortName: 'Recruiter',
    icon: '🎯',
    tagline: 'Hire faster with AI-powered recruiting',
    description:
      'Candidate pipeline management, automated outreach, interview scheduling, and talent analytics. Runs standalone or plugs into Persistent Sales.',
    status: 'building',
    gradient: 'from-emerald-500 to-teal-500',
    features: [
      { title: 'Smart Pipelines', description: 'Track candidates from sourcing to offer with AI-ranked stages' },
      { title: 'Automated Outreach', description: 'Personalized candidate messages that feel human, sent on autopilot' },
      { title: 'Interview Scheduling', description: 'Self-service booking that syncs with your calendar' },
      { title: 'Talent Analytics', description: 'Time-to-hire, source quality, and pipeline health at a glance' },
    ],
    pricing: [
      {
        name: 'Solo Recruiter',
        price: '$59',
        period: '/mo',
        description: 'For independent recruiters',
        features: ['Up to 100 active candidates', '1 pipeline', 'Email outreach', 'Basic analytics'],
        cta: 'Coming Soon',
      },
      {
        name: 'Team',
        price: '$119',
        period: '/mo',
        description: 'For recruiting teams',
        features: ['Unlimited candidates', 'Unlimited pipelines', 'AI sourcing agent', 'Interview scheduling', 'Advanced analytics'],
        cta: 'Coming Soon',
        highlighted: true,
      },
      {
        name: 'Add-on',
        price: '+$59',
        period: '/mo',
        description: 'Add to Persistent Sales',
        features: ['Everything in Team', 'CRM integration', 'Client-candidate linking', 'Revenue tracking per placement'],
        cta: 'Coming Soon',
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
