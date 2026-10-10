import { notFound } from 'next/navigation';
import { getArticle, getArticles } from '@/lib/content';
import { articleOgImage, ogImageSize } from '@/lib/seo/og-image';

export const size = ogImageSize;
export const contentType = 'image/png';
export const dynamicParams = false;
export const generateStaticParams = () => getArticles('news').map((a) => ({ slug: a.slug }));

export default async function Image({ params }: { params: { slug: string } }) {
  const article = getArticle('news', params.slug);
  if (!article) notFound();
  return articleOgImage(article);
}
