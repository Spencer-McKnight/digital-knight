import { caseCopy } from '@/content/case-page';
import { CASES } from '@/content/cases';
import { CASE_SLUGS, isCaseSlug } from '@/content/routes';
import { OG_SIZE, ogCard } from '@/og/card';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Digital Knight case study';
export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_SLUGS.map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isCaseSlug(slug)) return ogCard({ kicker: 'Work', title: 'Digital Knight' });
  return ogCard({ kicker: CASES[slug].client, title: caseCopy('de-DE', slug).h1.split(': ')[1] ?? caseCopy('de-DE', slug).h1 });
}
