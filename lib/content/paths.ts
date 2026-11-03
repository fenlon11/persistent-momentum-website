// Filename → public path, shared by the content loader (lib/content/index.ts) and the news scripts
// (scripts/news/merge-approved.mjs, fenlon11/pmOS#2210). No imports, so plain Node can load it.
export const newsFile = /^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.mdx$/;
export const guideFile = /^([a-z0-9]+(?:-[a-z0-9]+)*)\.mdx$/;

// `content/news/2026-10-20-x.mdx` → `/news/x`; `content/guides/y.mdx` → `/guides/y`; anything else → null.
export function contentHref(file: string): string | null {
  const m = /^content\/(news|guides)\/([^/]+)$/.exec(file);
  if (!m) return null;
  const name = (m[1] === 'news' ? newsFile : guideFile).exec(m[2]);
  if (!name) return null;
  return `/${m[1]}/${m[1] === 'news' ? name[2] : name[1]}`;
}
