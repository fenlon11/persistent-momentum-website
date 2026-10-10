import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleList from '@/components/content/ArticleList';
import PageShell from '@/components/content/PageShell';
import { getArticles, getTags } from '@/lib/content';

type Props = { params: Promise<{ tag: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => getTags().map((tag) => ({ tag }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${tag} — Persistent Momentum` };
}

export default async function Page({ params }: Props) {
  const { tag } = await params;
  const articles = getArticles().filter((a) => a.tags.includes(tag));
  if (articles.length === 0) notFound();
  return (
    <PageShell eyebrow="Tag" title={`#${tag}`}>
      <ArticleList articles={articles} empty="" />
    </PageShell>
  );
}
