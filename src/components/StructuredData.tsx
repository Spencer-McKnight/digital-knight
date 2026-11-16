import { isValidElement, type ReactNode } from 'react';
import { FAQS } from '@/components/home/FAQ/content';

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toHtml(node: ReactNode): string {
  if (typeof node === 'string') return escapeHtml(node);
  if (typeof node === 'number') return String(node);
  if (!node || typeof node === 'boolean') return '';
  if (Array.isArray(node)) return node.map(toHtml).join('');
  if (isValidElement(node)) {
    const props = node.props as Record<string, unknown>;
    const inner = toHtml(props.children as ReactNode);
    if (typeof node.type === 'string') {
      if (node.type === 'a' && props.href)
        return `<a href="${escapeHtml(String(props.href))}">${inner}</a>`;
      return `<${node.type}>${inner}</${node.type}>`;
    }
    if (props.href) return `<a href="${escapeHtml(String(props.href))}">${inner}</a>`;
    return inner;
  }
  return '';
}

const BASE = 'https://digital-knight.au';
const ORG_ID = `${BASE}/#organization`;
const PERSON_ID = `${BASE}/#spencer`;
const WEBSITE_ID = `${BASE}/#website`;

const siteNavLinks: Array<{ name: string; url: string }> = [
  { name: 'Services', url: `${BASE}/#services` },
  { name: 'Work', url: `${BASE}/work` },
  { name: 'About', url: `${BASE}/#meet` },
  { name: 'Contact', url: `${BASE}/contact` },
  { name: 'SOGIF Case Study', url: `${BASE}/work/sogif` },
  { name: 'DyFlex Case Study', url: `${BASE}/work/dyflex` },
  { name: 'PropertyInvesting Case Study', url: `${BASE}/work/propertyinvesting` },
  { name: 'SteveMcKnight Case Study', url: `${BASE}/work/stevemcknight` },
];

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['ProfessionalService', 'Organization'],
      '@id': ORG_ID,
      name: 'Digital Knight',
      url: 'https://digital-knight.au',
      slogan: 'Tactical digital systems that solve and evolve.',
      description:
        'Melbourne digital agency building next-gen websites, AI automation and strategic digital systems. Design, infrastructure and modern development.',
      logo: 'https://digital-knight.au/images/svg-logo.svg',
      image: 'https://digital-knight.au/opengraph-image',
      email: 'hello@digital-knight.au',
      founder: { '@id': PERSON_ID },
      areaServed: [
        { '@type': 'City', name: 'Melbourne' },
        { '@type': 'Country', name: 'Australia' },
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Melbourne',
        addressRegion: 'VIC',
        addressCountry: 'AU',
      },
      knowsAbout: [
        'Web Design',
        'Web Development',
        'Next.js',
        'React',
        'AI Automation',
        'Digital Strategy',
        'SEO',
        'Headless CMS',
      ],
      sameAs: [
        'https://www.linkedin.com/in/digital-knight-au/',
        'https://github.com/Spencer-McKnight/',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Strategic Advisory',
              description:
                'Market research, digital product analysis, AI and innovation strategy, success definitions and modern architecture.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Website Ecosystem',
              description:
                'Website design, brand guidance, search curation (SEO), conversion and marketing, quality assurance.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Automation Tools',
              description:
                'Business process maps, AI workflows, third-party integrations, admin dashboards and reduced manual load.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Evolution',
              description:
                'Platform evolution, data analytics, technical support, feature enhancement and change management.',
            },
          },
        ],
      },
    },
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Spencer McKnight',
      jobTitle: 'Founder & Digital Developer',
      worksFor: { '@id': ORG_ID },
      alumniOf: 'Bachelor of Business Information Technology (Professional)',
      sameAs: [
        'https://www.linkedin.com/in/spencer-mcknight/',
        'https://github.com/Spencer-McKnight/',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: BASE,
      name: 'Digital Knight',
      publisher: { '@id': ORG_ID },
      inLanguage: 'en-AU',
    },
    {
      '@type': 'SiteNavigationElement',
      '@id': `${BASE}/#navigation`,
      name: 'Main Navigation',
      hasPart: siteNavLinks.map((link) => ({
        '@type': 'WebPage',
        name: link.name,
        url: link.url,
      })),
    },
  ],
};

export function StructuredData() {
  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${BASE}/#faq`,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: toHtml(faq.body),
      },
    })),
  };

  const fullGraph = {
    '@context': 'https://schema.org',
    '@graph': [...graph['@graph'], faqPage],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(fullGraph) }}
    />
  );
}
