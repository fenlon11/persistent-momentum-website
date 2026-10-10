import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { ComponentProps } from 'react';

// Article body styles, mapped per element so no typography plugin or global CSS is needed.
// MDX is compiled at build time; next-mdx-remote v6 blocks JS expressions by default.
const text = { color: 'var(--color-text-dark)' };
const components = {
  h2: (p: ComponentProps<'h2'>) => <h2 className="text-2xl font-bold mt-10 mb-4 leading-snug" style={text} {...p} />,
  h3: (p: ComponentProps<'h3'>) => <h3 className="text-xl font-bold mt-8 mb-3 leading-snug" style={text} {...p} />,
  p: (p: ComponentProps<'p'>) => <p className="text-lg leading-relaxed mb-5" style={text} {...p} />,
  ul: (p: ComponentProps<'ul'>) => <ul className="list-disc pl-6 mb-5 space-y-2 text-lg" style={text} {...p} />,
  ol: (p: ComponentProps<'ol'>) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-lg" style={text} {...p} />,
  blockquote: (p: ComponentProps<'blockquote'>) => (
    <blockquote className="pl-4 my-6 italic" style={{ ...text, borderLeft: '3px solid var(--color-primary)' }} {...p} />
  ),
  code: (p: ComponentProps<'code'>) => (
    <code className="px-1 py-0.5 text-[0.9em]" style={{ background: 'var(--color-bg-light-secondary)', borderRadius: 4 }} {...p} />
  ),
  a: ({ href = '', ...p }: ComponentProps<'a'>) =>
    href.startsWith('/') ? (
      <Link href={href} className="underline underline-offset-2 [overflow-wrap:anywhere]" style={{ color: 'var(--color-primary)' }} {...p} />
    ) : (
      <a href={href} className="underline underline-offset-2 [overflow-wrap:anywhere]" style={{ color: 'var(--color-primary)' }} {...p} />
    ),
};

export default function MdxBody({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
