import { serializeJsonLd } from '@/lib/seo/jsonld';

// Server-rendered JSON-LD, so crawlers read it in the initial HTML.
export default function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
