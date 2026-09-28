import { OG_SIZE, ogCard } from '@/og/card';
import { getAllSlugs, getCaseStudy } from './content';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Digital Knight case study';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  return ogCard({ kicker: study?.label ?? 'Work', title: study?.title ?? 'Selected work' });
}
