import { Document } from '@/blocks/Document/Document';
import { meta, privacy } from '@/content/en-AU/privacy';
import { warnMissingLegal } from '@/content/legal';
import { pageMetadata } from '@/content/routes';

export const metadata = pageMetadata({ id: 'privacy', locale: 'en-AU', ...meta });

warnMissingLegal();

export default function Privacy() {
  return <Document {...privacy} />;
}
