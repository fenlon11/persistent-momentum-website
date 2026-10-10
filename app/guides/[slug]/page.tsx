import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticlePage from '@/components/content/ArticlePage';
import { getArticle, getArticles } from '@/lib/content';
import { articleMetadata } from '@/lib/seo/metadata';

type Props = { params: Promise<{ slug: string }> };

// Only visible articles get a route; in production a draft has none.
export const dynamicParams = false;
export const generateStaticParams = () => getArticles('guide').map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle('guide', (await params).slug);
  return article ? articleMetadata(article) : {};
}

export default async function Page({ params }: Props) {
  const article = getArticle('guide', (await params).slug);
  if (!article) notFound();
  return <ArticlePage article={article} />;
}
