import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCaseStudy, getAllSlugs, type CaseStudy } from './content';
import { CaseStudyPage } from './CaseStudyPage';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return {
    title: `${study.label} — ${study.title}`,
    description: study.tagline,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      type: 'article',
      url: `/work/${slug}`,
      title: `${study.title} — ${study.label} · Digital Knight`,
      description: study.tagline,
    },
  };
}

const BASE = 'https://digital-knight.au';

function caseStudyGraph(study: CaseStudy) {
  const url = `${BASE}/work/${study.slug}`;
  const lead = study.figures.find((f) => f.variant === 'lead');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${url}#work`,
        name: `${study.label} — ${study.title}`,
        headline: study.title,
        abstract: study.tagline,
        description: study.lede,
        url,
        ...(lead ? { image: `${BASE}${lead.src}` } : {}),
        keywords: study.technologies.join(', '),
        inLanguage: 'en-AU',
        creator: { '@id': `${BASE}/#organization` },
        about: study.technologies.map((t) => ({ '@type': 'Thing', name: t })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Work', item: `${BASE}/#work` },
          { '@type': 'ListItem', position: 3, name: study.label, item: url },
        ],
      },
    ],
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyGraph(study)) }}
      />
      <CaseStudyPage study={study} />
    </>
  );
}
