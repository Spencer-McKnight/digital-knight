import { Call } from '@/blocks/Call/Call';
import { Credential } from '@/blocks/Credential/Credential';
import { Index } from '@/blocks/Index/Index';
import { Offer } from '@/blocks/Offer/Offer';
import { Proof } from '@/blocks/Proof/Proof';
import { Statement } from '@/blocks/Statement/Statement';
import { call, cover, credentialCompact, index, meta, offer, proof } from '@/content/de-DE/home';
import { pageMetadata } from '@/content/routes';

export const metadata = pageMetadata({ id: 'home', locale: 'de-DE', absoluteTitle: true, ...meta });

export default function Startseite() {
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
