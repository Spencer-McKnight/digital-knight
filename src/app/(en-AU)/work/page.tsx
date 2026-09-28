import type { Metadata } from 'next';
import Link from 'next/link';
import { Work } from '@/components/home/Work';
import { CASE_STUDIES } from './[slug]/content';

const BASE = 'https://digital-knight.au';
const PAGE_URL = `${BASE}/work`;

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Explore Digital Knight case studies covering website strategy, modern development, and AI-enabled digital delivery.',
  alternates: { canonical: '/work' },
  openGraph: {
    type: 'website',
    url: '/work',
    title: 'Work · Digital Knight',
    description:
      'Case studies from Digital Knight across strategy, modern web development, and digital delivery.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

const workGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${PAGE_URL}#collection`,
      url: PAGE_URL,
      name: 'Work case studies',
      description:
        'A collection of Digital Knight case studies across strategy, websites, and modern digital systems.',
      isPartOf: { '@id': `${BASE}/#website` },
      mainEntity: { '@id': `${PAGE_URL}#list` },
    },
    {
      '@type': 'ItemList',
      '@id': `${PAGE_URL}#list`,
      itemListElement: CASE_STUDIES.map((study, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${study.label} — ${study.title}`,
        url: `${PAGE_URL}/${study.slug}`,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Work', item: PAGE_URL },
      ],
    },
  ],
};

export default function WorkIndexPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workGraph) }}
      />
      <h1 className="sr-only">Digital Knight Work Case Studies</h1>
      <Work />
      <nav aria-label="Case study links" className="sr-only">
        <ul>
          {CASE_STUDIES.map((study) => (
            <li key={study.slug}>
              <Link href={`/work/${study.slug}`}>{study.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
