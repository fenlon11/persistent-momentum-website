import ContentIndex, { indexMetadata, indexPageParams } from '@/components/content/ContentIndex';

type Props = { params: Promise<{ page: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => indexPageParams('guide');

export async function generateMetadata({ params }: Props) {
  return indexMetadata('guide', Number((await params).page));
}

export default async function Page({ params }: Props) {
  return <ContentIndex type="guide" page={Number((await params).page)} />;
}
