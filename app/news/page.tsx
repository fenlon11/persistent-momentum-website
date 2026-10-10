import ContentIndex, { indexMetadata } from '@/components/content/ContentIndex';

export const generateMetadata = () => indexMetadata('news');

export default function Page() {
  return <ContentIndex type="news" />;
}
