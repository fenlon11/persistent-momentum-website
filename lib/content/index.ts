// Build-time content loader (fenlon11/pmOS#681). Reads content/{news,guides,authors}/*.mdx, validates
// frontmatter against lib/content/schema.ts and throws on any violation, so a bad file fails
// `next build`. Every route that uses it is statically generated; nothing reads the disk at runtime.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { authorSchema, frontmatterSchema, isVisible, type Author, type Frontmatter } from './schema';

export type ContentType = 'news' | 'guide';

export type Article = Frontmatter & {
  slug: string;
  href: string;
  body: string;
};

export type AuthorEntry = Author & { slug: string; href: string; body: string };

const root = path.join(process.cwd(), 'content');
const dirs: Record<ContentType, string> = { news: 'news', guide: 'guides' };
const newsFile = /^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.mdx$/;
const guideFile = /^([a-z0-9]+(?:-[a-z0-9]+)*)\.mdx$/;

function mdxFiles(dir: string) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter((f) => f.endsWith('.mdx')).map((f) => path.join(full, f));
}

function fail(file: string, message: string): never {
  throw new Error(`content: ${path.relative(process.cwd(), file)}: ${message}`);
}

let authorCache: AuthorEntry[] | undefined;

export function getAuthors(): AuthorEntry[] {
  authorCache ??= mdxFiles('authors').map((file) => {
    const { data, content } = matter(fs.readFileSync(file, 'utf8'));
    const parsed = authorSchema.safeParse(data);
    if (!parsed.success) fail(file, parsed.error.message);
    const slug = path.basename(file, '.mdx');
    return { ...parsed.data, slug, href: `/authors/${slug}`, body: content };
  });
  return authorCache;
}

export function getAuthor(slug: string) {
  return getAuthors().find((a) => a.slug === slug);
}

const articleCache: Partial<Record<ContentType, Article[]>> = {};

function loadType(type: ContentType): Article[] {
  const authors = new Set(getAuthors().map((a) => a.slug));
  const seen = new Set<string>();
  return mdxFiles(dirs[type]).map((file) => {
    const name = path.basename(file);
    const match = (type === 'news' ? newsFile : guideFile).exec(name);
    if (!match) fail(file, `filename must be ${type === 'news' ? '<yyyy-mm-dd>-<slug>.mdx' : '<slug>.mdx'}`);
    const slug = type === 'news' ? match[2] : match[1];
    if (seen.has(slug)) fail(file, `duplicate slug "${slug}"`);
    seen.add(slug);

    const { data, content } = matter(fs.readFileSync(file, 'utf8'));
    const parsed = frontmatterSchema.safeParse(data);
    if (!parsed.success) fail(file, parsed.error.message);
    const fm = parsed.data;
    if (fm.type !== type) fail(file, `type "${fm.type}" does not match its folder (${dirs[type]})`);
    if (!authors.has(fm.author)) fail(file, `author "${fm.author}" has no file in content/authors/`);
    if (type === 'news' && match[1] !== fm.publishedAt) {
      fail(file, `filename date ${match[1]} differs from publishedAt ${fm.publishedAt}`);
    }
    return { ...fm, slug, href: `/${dirs[type]}/${slug}`, body: content };
  });
}

const newestFirst = (a: Article, b: Article) =>
  b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title);

// Visible articles of one type (or both), newest first. Validates every file, drafts included.
export function getArticles(type?: ContentType): Article[] {
  const types: ContentType[] = type ? [type] : ['news', 'guide'];
  return types
    .flatMap((t) => (articleCache[t] ??= loadType(t)))
    .filter((a) => isVisible(a))
    .sort(newestFirst);
}

export function getArticle(type: ContentType, slug: string) {
  return getArticles(type).find((a) => a.slug === slug);
}

export function getTags(): string[] {
  return [...new Set(getArticles().flatMap((a) => a.tags))].sort();
}

// Other visible articles sharing a tag, most shared tags first, then newest.
export function getRelated(article: Article, limit = 3): Article[] {
  return getArticles()
    .filter((a) => a.href !== article.href)
    .map((a) => ({ a, shared: a.tags.filter((t) => article.tags.includes(t)).length }))
    .filter((x) => x.shared > 0)
    .sort((x, y) => y.shared - x.shared || newestFirst(x.a, y.a))
    .slice(0, limit)
    .map((x) => x.a);
}

export const PAGE_SIZE = 20;

export function pageCount(total: number) {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

export function paginate<T>(items: T[], page: number): T[] {
  return items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
}
