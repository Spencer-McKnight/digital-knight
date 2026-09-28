import { getChrome } from '@/content/chrome';
import { getSite } from '@/content/site';
import { FUNNEL, SITE_URL, absoluteUrl, href, type Locale } from '@/content/routes';

const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#spencer`;

export function websiteId(locale: Locale): string {
  return `${absoluteUrl(href('home', locale))}#website`;
}

/** Organization, Person and WebSite, once per locale. No FAQPage. */
export function StructuredData({ locale }: { locale: Locale }) {
  const site = getSite(locale);
  const t = getChrome(locale);

  const navigation = [
    ...FUNNEL.map((id, i) => ({ name: t.trail[i]!.label, url: absoluteUrl(href(id, locale)) })),
    { name: t.nav.contact, url: absoluteUrl(href('contact', locale)) },
  ];

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['ProfessionalService', 'Organization'],
        '@id': ORG_ID,
        name: 'Digital Knight',
        url: SITE_URL,
        slogan: site.slogan,
        description: site.description,
        logo: `${SITE_URL}/icon-512.png`,
        email: 'hello@digital-knight.au',
        founder: { '@id': PERSON_ID },
        areaServed: ['AU', 'DE'],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Melbourne',
          addressRegion: 'VIC',
          addressCountry: 'AU',
        },
        knowsAbout: ['Digital strategy', 'Web development', 'Next.js', 'React', 'AI integration', 'Automation', 'SEO'],
        sameAs: ['https://www.linkedin.com/in/digital-knight-au/', 'https://github.com/Spencer-McKnight/'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: t.nav.start,
          itemListElement: site.practices.map((p) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: p.name, description: p.description },
          })),
        },
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: 'Spencer McKnight',
        jobTitle: site.jobTitle,
        worksFor: { '@id': ORG_ID },
        alumniOf: 'Bachelor of Business Information Technology (Professional)',
        sameAs: ['https://www.linkedin.com/in/spencer-mcknight/', 'https://github.com/Spencer-McKnight/'],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId(locale),
        url: absoluteUrl(href('home', locale)),
        name: 'Digital Knight',
        publisher: { '@id': ORG_ID },
        inLanguage: locale,
      },
      {
        '@type': 'SiteNavigationElement',
        '@id': `${absoluteUrl(href('home', locale))}#navigation`,
        name: site.navName,
        inLanguage: locale,
        hasPart: navigation.map((n) => ({ '@type': 'WebPage', name: n.name, url: n.url })),
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />;
}

/** One JSON-LD graph, rendered where a page needs it. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
