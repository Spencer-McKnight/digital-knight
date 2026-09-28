import { Call } from '@/blocks/Call/Call';
import { Fit } from '@/blocks/Fit/Fit';
import { Offer } from '@/blocks/Offer/Offer';
import { Statement } from '@/blocks/Statement/Statement';
import { Trail } from '@/blocks/Trail/Trail';
import { call, fit, meta, offer, statement } from '@/content/en-AU/services';
import { pageMetadata } from '@/content/routes';

export const metadata = pageMetadata({ id: 'services', locale: 'en-AU', ...meta });

export default function Services() {
  return (
    <>
      <Trail locale="en-AU" current="services" />
      <Statement {...statement} />
      <Offer {...offer} />
      <Fit {...fit} />
      <Call {...call} />
    </>
  );
}
