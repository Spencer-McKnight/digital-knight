import { Statement } from '@/blocks/Statement/Statement';
import { cover, meta } from '@/content/en-AU/home';
import { pageMetadata } from '@/content/routes';

export const metadata = pageMetadata({ id: 'home', locale: 'en-AU', absoluteTitle: true, ...meta });

export default function Home() {
  return <Statement {...cover} />;
}
