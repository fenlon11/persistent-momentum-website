// Site identity shared by metadata, JSON-LD, sitemaps and the feed (fenlon11/pmOS#685).
// No personal name, address or phone here or anywhere public (Matt, 2026-10-10).
export const SITE_URL = 'https://persistentmomentum.com';
export const SITE_NAME = 'Persistent Momentum';
export const SITE_LEGAL_NAME = 'Persistent Momentum, LLC';
export const SITE_EMAIL = 'info@persistentmomentum.com';
export const SITE_DESCRIPTION =
  'Stay up to date on the AI news that matters: what the big AI companies ship and what it means for your business. Plus business and AI systems consulting.';

// Spread into `alternates.types` wherever a page sets its own `alternates`: Next replaces the
// parent's object, so the feed link would otherwise drop off that page.
export const FEED_TYPES = { 'application/rss+xml': [{ url: '/feed.xml', title: SITE_NAME }] };

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
