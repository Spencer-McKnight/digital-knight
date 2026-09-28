import { Enquiry } from '@/blocks/Enquiry/Enquiry';
import { Hours } from '@/blocks/Hours/Hours';
import { Statement } from '@/blocks/Statement/Statement';
import { JsonLd } from '@/components/StructuredData';
import { commit, enquiry, hours } from '@/content/de-DE/common';
import { meta, statement } from '@/content/de-DE/contact';
import { contactGraph, pageMetadata } from '@/content/routes';

export const metadata = pageMetadata({ id: 'contact', locale: 'de-DE', ...meta });

export default function Kontakt() {
  return (
    <>
      <JsonLd data={contactGraph('de-DE', meta)} />
      <Statement {...statement} />
      <Enquiry locale="de-DE" copy={enquiry} commit={commit} />
      <Hours variant="compact" locale="de-DE" copy={hours} />
    </>
  );
}
