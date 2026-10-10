// Frontmatter contract for news, guides and authors (fenlon11/pmOS#681). Validated at build time
// by lib/content/index.ts; any violation fails `next build`. Sourcing rule: every article cites
// at least one primary source over https.
import { z } from 'zod';
import { reviewers } from '../../content/reviewers.ts';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// gray-matter turns an unquoted YAML date into a Date; normalise both forms to YYYY-MM-DD.
const isoDate = z
  .union([z.string(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v))
  .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be a YYYY-MM-DD date'));

export const sourceSchema = z.object({
  title: z.string().min(1),
  url: z.url({ protocol: /^https$/, error: 'must be an https URL' }),
  publisher: z.string().min(1),
});

export const statusLabels = {
  available: 'Available now',
  'rolling-out': 'Rolling out',
  announced: 'Announced, no date',
  research: 'Research only',
} as const;

const reviewerSlugs = reviewers.map((r) => r.slug);

export const frontmatterSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1).max(160),
    type: z.enum(['news', 'guide']),
    publishedAt: isoDate,
    updatedAt: isoDate,
    author: z.string().regex(slugPattern),
    // Elle Evate (AI) can never be the reviewer: only the human allowlist in content/reviewers.ts.
    reviewedBy: z
      .string()
      .refine((s) => reviewerSlugs.includes(s), {
        error: `reviewedBy must be one of content/reviewers.ts (${reviewerSlugs.join(', ')})`,
      })
      .optional(),
    status: z.enum(['draft', 'published']),
    tags: z.array(z.string().regex(slugPattern, 'tags are lowercase-kebab slugs')),
    sources: z.array(sourceSchema).min(1, 'at least one source is required'),
    statusLabel: z.enum(['available', 'rolling-out', 'announced', 'research']).optional(),
    faq: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).optional(),
    heroImage: z.string().min(1).optional(),
  })
  .strict()
  .superRefine((fm, ctx) => {
    if (fm.updatedAt < fm.publishedAt) {
      ctx.addIssue({ code: 'custom', path: ['updatedAt'], message: 'updatedAt is before publishedAt' });
    }
    if (fm.status === 'published' && !fm.reviewedBy) {
      ctx.addIssue({ code: 'custom', path: ['reviewedBy'], message: 'published articles need reviewedBy' });
    }
    if (fm.statusLabel && fm.type !== 'news') {
      ctx.addIssue({ code: 'custom', path: ['statusLabel'], message: 'statusLabel is for news only' });
    }
    if (fm.faq && fm.type !== 'guide') {
      ctx.addIssue({ code: 'custom', path: ['faq'], message: 'faq is for guides only' });
    }
  });

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export const authorSchema = z
  .object({
    name: z.string().min(1),
    kind: z.enum(['person', 'organization', 'ai']),
    title: z.string().min(1).optional(),
    description: z.string().min(1).max(160),
  })
  .strict();

export type Author = z.infer<typeof authorSchema>;

// Drafts render in `next dev` only; a production build gives them no route and no index entry.
export function isVisible(fm: Pick<Frontmatter, 'status'>, nodeEnv = process.env.NODE_ENV) {
  return fm.status === 'published' || nodeEnv !== 'production';
}
