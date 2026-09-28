import { Document } from '@/blocks/Document/Document';
import { privacy, privacyMeta } from '@/content/de-DE/legal';
import { warnMissingLegal } from '@/content/legal';
import { pageMetadata } from '@/content/routes';

export const metadata = pageMetadata({ id: 'privacy', locale: 'de-DE', ...privacyMeta });

warnMissingLegal();

export default function Datenschutz() {
  return <Document {...privacy} />;
}
