const ORG_ID = 'https://digital-knight.au/#organization';
const PERSON_ID = 'https://digital-knight.au/#spencer';
const WEBSITE_ID = 'https://digital-knight.au/#website';

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
        'https://www.linkedin.com/in/spencer-mcknight/',
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
      url: 'https://digital-knight.au',
      name: 'Digital Knight',
      publisher: { '@id': ORG_ID },
      inLanguage: 'en-AU',
    },
  ],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
