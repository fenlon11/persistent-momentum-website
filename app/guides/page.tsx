import ContentIndex, { indexMetadata } from '@/components/content/ContentIndex';

export const generateMetadata = () => indexMetadata('guide');

export default function Page() {
  return <ContentIndex type="guide" />;
}
