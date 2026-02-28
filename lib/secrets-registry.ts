// ===== SECRETS REGISTRY =====
// Inventory of all env vars across projects. NO actual values stored here.
// Values live in .env.local on matts-macbook-pro only.

export type KeyStatus = 'set' | 'missing' | 'expired' | 'unknown';

export interface SecretEntry {
  id: string;
  service: string;
  keyName: string;
  project: string;       // Which .env.local file (e.g., "rabbit-golf", "persistent-momentum")
  envFile: string;        // Full path on disk
  purpose: string;
  required: boolean;
  status: KeyStatus;
  lastVerified?: string;  // ISO date
  notes?: string;
  docsUrl?: string;       // Where to get/rotate the key
}

export interface ServiceGroup {
  service: string;
  icon: string;
  keys: SecretEntry[];
}

// Master registry — update this when adding new keys
export const secretsRegistry: SecretEntry[] = [
  // === Supabase ===
  {
    id: 'supa-url',
    service: 'Supabase',
    keyName: 'NEXT_PUBLIC_SUPABASE_URL',
    project: 'persistent-momentum',
    envFile: '~/Projects/persistent-momentum/website/.env.local',
    purpose: 'Supabase project URL for PM dashboard',
    required: true,
    status: 'set',
    docsUrl: 'https://supabase.com/dashboard/project/rocbercxseuoqzjwlucb/settings/api',
  },
  {
    id: 'supa-anon',
    service: 'Supabase',
    keyName: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    project: 'persistent-momentum',
    envFile: '~/Projects/persistent-momentum/website/.env.local',
    purpose: 'Supabase anon key for client-side access',
    required: true,
    status: 'set',
    docsUrl: 'https://supabase.com/dashboard/project/rocbercxseuoqzjwlucb/settings/api',
  },
  {
    id: 'supa-service',
    service: 'Supabase',
    keyName: 'SUPABASE_SERVICE_ROLE_KEY',
    project: 'persistent-momentum',
    envFile: '~/Projects/persistent-momentum/website/.env.local',
    purpose: 'Supabase service role for server-side operations (bypasses RLS)',
    required: true,
    status: 'set',
    docsUrl: 'https://supabase.com/dashboard/project/rocbercxseuoqzjwlucb/settings/api',
  },

  // === Cloudflare ===
  {
    id: 'cf-api-token',
    service: 'Cloudflare',
    keyName: 'CLOUDFLARE_API_TOKEN',
    project: 'persistent-momentum',
    envFile: '~/Projects/persistent-momentum/website/.env.local',
    purpose: 'Cloudflare API token for Worker health checks',
    required: true,
    status: 'set',
    docsUrl: 'https://dash.cloudflare.com/profile/api-tokens',
  },
  {
    id: 'cf-account-id',
    service: 'Cloudflare',
    keyName: 'CLOUDFLARE_ACCOUNT_ID',
    project: 'persistent-momentum',
    envFile: '~/Projects/persistent-momentum/website/.env.local',
    purpose: 'Cloudflare account ID',
    required: true,
    status: 'set',
    docsUrl: 'https://dash.cloudflare.com/',
  },

  // === Meta / Instagram ===
  {
    id: 'meta-access-token',
    service: 'Meta Graph API',
    keyName: 'META_ACCESS_TOKEN',
    project: 'rabbit-golf',
    envFile: '~/Projects/rabbit/.env.local',
    purpose: 'Long-lived page access token for IG automation',
    required: true,
    status: 'set',
    notes: 'Expires ~60 days. Stored in CF Worker secrets too.',
    docsUrl: 'https://developers.facebook.com/tools/explorer/',
  },
  {
    id: 'meta-ig-id',
    service: 'Meta Graph API',
    keyName: 'INSTAGRAM_BUSINESS_ACCOUNT_ID',
    project: 'rabbit-golf',
    envFile: '~/Projects/rabbit/.env.local',
    purpose: 'IG business account ID for posting',
    required: true,
    status: 'set',
    docsUrl: 'https://developers.facebook.com/tools/explorer/',
  },

  // === Vercel ===
  {
    id: 'vercel-token',
    service: 'Vercel',
    keyName: 'VERCEL_TOKEN',
    project: 'global',
    envFile: '~/.env.local',
    purpose: 'Vercel API token for deployments',
    required: false,
    status: 'unknown',
    docsUrl: 'https://vercel.com/account/tokens',
  },

  // === GitHub ===
  {
    id: 'github-token',
    service: 'GitHub',
    keyName: 'GITHUB_TOKEN',
    project: 'global',
    envFile: '~/.env.local',
    purpose: 'GitHub personal access token',
    required: false,
    status: 'unknown',
    docsUrl: 'https://github.com/settings/tokens',
  },

  // === OpenAI ===
  {
    id: 'openai-key',
    service: 'OpenAI',
    keyName: 'OPENAI_API_KEY',
    project: 'global',
    envFile: '~/.env.local',
    purpose: 'OpenAI API key for GPT/DALL-E integrations',
    required: false,
    status: 'unknown',
    docsUrl: 'https://platform.openai.com/api-keys',
  },

  // === Resend ===
  {
    id: 'resend-key',
    service: 'Resend',
    keyName: 'RESEND_API_KEY',
    project: 'persistent-momentum',
    envFile: '~/Projects/persistent-momentum/website/.env.local',
    purpose: 'Transactional email via Resend',
    required: false,
    status: 'set',
    docsUrl: 'https://resend.com/api-keys',
  },

  // === RevenueCat ===
  {
    id: 'rc-api-key',
    service: 'RevenueCat',
    keyName: 'REVENUECAT_API_KEY',
    project: 'rabbit-golf',
    envFile: '~/Projects/rabbit/.env.local',
    purpose: 'RevenueCat public SDK key for in-app purchases',
    required: true,
    status: 'set',
    docsUrl: 'https://app.revenuecat.com/',
  },
  {
    id: 'rc-secret',
    service: 'RevenueCat',
    keyName: 'REVENUECAT_SECRET_KEY',
    project: 'rabbit-golf',
    envFile: '~/Projects/rabbit/.env.local',
    purpose: 'RevenueCat secret key for server-side subscription checks',
    required: true,
    status: 'set',
    docsUrl: 'https://app.revenuecat.com/',
  },

  // === Apple / App Store Connect ===
  {
    id: 'asc-key-id',
    service: 'App Store Connect',
    keyName: 'ASC_KEY_ID',
    project: 'rabbit-golf',
    envFile: '~/Projects/rabbit/.env.local',
    purpose: 'App Store Connect API key ID',
    required: true,
    status: 'set',
    docsUrl: 'https://appstoreconnect.apple.com/access/integrations/api',
  },
  {
    id: 'asc-issuer-id',
    service: 'App Store Connect',
    keyName: 'ASC_ISSUER_ID',
    project: 'rabbit-golf',
    envFile: '~/Projects/rabbit/.env.local',
    purpose: 'App Store Connect issuer ID',
    required: true,
    status: 'set',
    docsUrl: 'https://appstoreconnect.apple.com/access/integrations/api',
  },

  // === Google Cloud ===
  {
    id: 'gcp-service-account',
    service: 'Google Cloud',
    keyName: 'GOOGLE_SERVICE_ACCOUNT_JSON',
    project: 'rabbit-golf',
    envFile: '~/Projects/rabbit/.env.local',
    purpose: 'GCP service account for GSC automation (pending)',
    required: false,
    status: 'missing',
    notes: 'Service account pending setup for Google Search Console automation',
    docsUrl: 'https://console.cloud.google.com/iam-admin/serviceaccounts',
  },

  // === Dashboard ===
  {
    id: 'dashboard-pin',
    service: 'PM Dashboard',
    keyName: 'DASHBOARD_PIN',
    project: 'persistent-momentum',
    envFile: '~/Projects/persistent-momentum/website/.env.local',
    purpose: 'PIN for dashboard authentication',
    required: true,
    status: 'set',
  },
];

// Group by service for display
export function groupByService(entries: SecretEntry[]): ServiceGroup[] {
  const serviceIcons: Record<string, string> = {
    'Supabase': '⚡',
    'Cloudflare': '☁️',
    'Meta Graph API': '📱',
    'Vercel': '▲',
    'GitHub': '📦',
    'OpenAI': '🤖',
    'Resend': '✉️',
    'RevenueCat': '💳',
    'App Store Connect': '🍎',
    'Google Cloud': '🌐',
    'PM Dashboard': '🔒',
  };

  const grouped = new Map<string, SecretEntry[]>();
  for (const entry of entries) {
    const existing = grouped.get(entry.service) || [];
    existing.push(entry);
    grouped.set(entry.service, existing);
  }

  return Array.from(grouped.entries()).map(([service, keys]) => ({
    service,
    icon: serviceIcons[service] || '🔑',
    keys,
  }));
}

// Stats
export function getRegistryStats(entries: SecretEntry[]) {
  const total = entries.length;
  const set = entries.filter(e => e.status === 'set').length;
  const missing = entries.filter(e => e.status === 'missing').length;
  const unknown = entries.filter(e => e.status === 'unknown').length;
  const expired = entries.filter(e => e.status === 'expired').length;
  const projects = [...new Set(entries.map(e => e.project))].length;
  const services = [...new Set(entries.map(e => e.service))].length;
  return { total, set, missing, unknown, expired, projects, services };
}
