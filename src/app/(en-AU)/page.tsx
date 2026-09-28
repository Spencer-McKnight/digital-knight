import { Call } from '@/blocks/Call/Call';
import { Credential } from '@/blocks/Credential/Credential';
import { Index } from '@/blocks/Index/Index';
import { Offer } from '@/blocks/Offer/Offer';
import { Proof } from '@/blocks/Proof/Proof';
import { Statement } from '@/blocks/Statement/Statement';
import { call, cover, credentialCompact, index, meta, offer, proof } from '@/content/en-AU/home';
import { pageMetadata } from '@/content/routes';

export const metadata = pageMetadata({ id: 'home', locale: 'en-AU', absoluteTitle: true, ...meta });

export default function Home() {
  return (
    <>
      <Statement {...cover} />
      <Offer {...offer} />
      <Proof {...proof} />
      <Index {...index} />
      <Credential {...credentialCompact} />
      <Call {...call} />
    </>
  );
}
