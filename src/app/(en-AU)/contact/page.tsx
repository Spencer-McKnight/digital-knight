import { Enquiry } from '@/blocks/Enquiry/Enquiry';
import { Hours } from '@/blocks/Hours/Hours';
import { Statement } from '@/blocks/Statement/Statement';
import { JsonLd } from '@/components/StructuredData';
import { commit, enquiry, hours } from '@/content/en-AU/common';
import { meta, statement } from '@/content/en-AU/contact';
import { contactGraph, pageMetadata } from '@/content/routes';

export const metadata = pageMetadata({ id: 'contact', locale: 'en-AU', ...meta });

export default function Contact() {
  return (
    <>
      <JsonLd data={contactGraph('en-AU', meta)} />
      <Statement {...statement} />
      <Enquiry locale="en-AU" copy={enquiry} commit={commit} />
      <Hours variant="compact" locale="en-AU" copy={hours} />
    </>
  );
}
