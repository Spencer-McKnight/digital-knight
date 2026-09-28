import { Call } from '@/blocks/Call/Call';
import { Fit } from '@/blocks/Fit/Fit';
import { Offer } from '@/blocks/Offer/Offer';
import { Statement } from '@/blocks/Statement/Statement';
import { Trail } from '@/blocks/Trail/Trail';
import { call, fit, meta, offer, statement } from '@/content/de-DE/services';
import { pageMetadata } from '@/content/routes';

export const metadata = pageMetadata({ id: 'services', locale: 'de-DE', ...meta });

export default function Leistungen() {
  return (
    <>
      <Trail locale="de-DE" current="services" />
      <Statement {...statement} />
      <Offer {...offer} />
      <Fit {...fit} />
      <Call {...call} />
    </>
  );
}
