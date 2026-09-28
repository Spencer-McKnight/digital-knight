import { Statement } from '@/blocks/Statement/Statement';
import { cover, meta } from '@/content/de-DE/home';
import { pageMetadata } from '@/content/routes';

export const metadata = pageMetadata({ id: 'home', locale: 'de-DE', absoluteTitle: true, ...meta });

export default function Startseite() {
  return <Statement {...cover} />;
}
