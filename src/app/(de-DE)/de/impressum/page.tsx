import { Document } from '@/blocks/Document/Document';
import { imprint, imprintMeta } from '@/content/de-DE/legal';
import { warnMissingLegal } from '@/content/legal';
import { pageMetadata } from '@/content/routes';

export const metadata = pageMetadata({ id: 'imprint', locale: 'de-DE', ...imprintMeta });

warnMissingLegal();

export default function Impressum() {
  return <Document {...imprint} />;
}
