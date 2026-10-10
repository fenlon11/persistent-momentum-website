import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleList from '@/components/content/ArticleList';
import { AuthorAvatar, AiBadge } from '@/components/content/Byline';
import MdxBody from '@/components/content/MdxBody';
import PageShell from '@/components/content/PageShell';
import JsonLd from '@/components/JsonLd';
import { getArticles, getAuthor, getAuthors } from '@/lib/content';
import { profilePageJsonLd } from '@/lib/seo/jsonld';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => getAuthors().map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = getAuthor((await params).slug);
  if (!author) return {};
  return { title: `${author.name} — Persistent Momentum`, description: author.description };
}

export default async function Page({ params }: Props) {
  const author = getAuthor((await params).slug);
  if (!author) notFound();
  const articles = getArticles().filter((a) => a.author === author.slug);
  // Organization authors only; an AI author (Elle Evate) gets no profile markup.
  const profile = profilePageJsonLd(author);

  return (
    <>
      {profile && <JsonLd data={profile} />}
      <PageShell
        eyebrow="Author"
        title={author.name}
        intro={
          <div className="flex items-start gap-4">
            <AuthorAvatar author={author} />
            <div>
              {author.title && (
                <p className="font-semibold mb-3" style={{ color: 'var(--color-text-dark)' }}>
                  {author.title} {author.kind === 'ai' && <AiBadge />}
                </p>
              )}
              <MdxBody source={author.body} />
            </div>
          </div>
        }
      >
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-dark)', letterSpacing: '-0.02em' }}>
          Articles
        </h2>
        <ArticleList articles={articles} empty="Nothing published yet." />
      </PageShell>
    </>
  );
}
