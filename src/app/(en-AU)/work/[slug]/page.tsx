import { notFound } from 'next/navigation';
import { Call } from '@/blocks/Call/Call';
import { Ledger } from '@/blocks/Ledger/Ledger';
import { Loupe } from '@/blocks/Loupe/Loupe';
import { Narrative } from '@/blocks/Narrative/Narrative';
import { Plates } from '@/blocks/Plates/Plates';
import { Proof } from '@/blocks/Proof/Proof';
import { Statement } from '@/blocks/Statement/Statement';
import { Trail } from '@/blocks/Trail/Trail';
import { JsonLd } from '@/components/StructuredData';
import { caseCopy, caseGraph, casePage } from '@/content/case-page';
import { CASE_SLUGS, isCaseSlug, pageMetadata } from '@/content/routes';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!isCaseSlug(slug)) return {};
  return pageMetadata({ id: 'case', locale: 'en-AU', slug, ...caseCopy('en-AU', slug).meta });
}

export default async function Case({ params }: Props) {
  const { slug } = await params;
  if (!isCaseSlug(slug)) notFound();
  const c = casePage('en-AU', slug);

  return (
    <>
      <JsonLd data={caseGraph('en-AU', slug)} />
      <Trail locale="en-AU" current="work" />
      <Statement {...c.statement} />
      <Proof {...c.proof} />
      {c.loupe ? <Loupe {...c.loupe} /> : null}
      <Narrative {...c.context} />
      <Narrative {...c.criteria} />
      {c.engagements ? <Narrative {...c.engagements} /> : null}
      <Narrative {...c.outcomes} />
      <Plates {...c.plates} />
      <Ledger {...c.stack} />
      <Call {...c.nextCase} />
      <Call {...c.call} />
    </>
  );
}
