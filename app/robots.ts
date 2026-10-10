import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

// robots.txt (fenlon11/pmOS#685, playbook §1.6). Search and answer crawlers are named explicitly
// so the file states who is welcome. A named group replaces `*` for that bot, so every group
// repeats the private disallows.
const disallow = ['/dashboard', '/api/'];

const searchAndAnswerBots = [
  'Googlebot',
  'bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'Claude-SearchBot',
  'Claude-User',
];

const trainingBots = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot'];

// Training crawlers: allowed. Decided by Matt 2026-10-10 ("Yes, I want this"), fenlon11/pmOS#685.
// Set to false to block all four; search and answer crawlers are unaffected either way.
const ALLOW_TRAINING_CRAWLERS = true;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      { userAgent: searchAndAnswerBots, allow: '/', disallow },
      ALLOW_TRAINING_CRAWLERS
        ? { userAgent: trainingBots, allow: '/', disallow }
        : { userAgent: trainingBots, disallow: '/' },
    ],
    sitemap: [absoluteUrl('/sitemap.xml'), absoluteUrl('/news-sitemap.xml')],
  };
}
