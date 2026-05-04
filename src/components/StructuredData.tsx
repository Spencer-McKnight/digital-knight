const professionalService = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Digital Knight',
  url: 'https://digital-knight.au',
  description:
    'Next-gen websites, AI automation and strategic vision for digital businesses. Design, infrastructure and modern development.',
  founder: {
    '@type': 'Person',
    name: 'Spencer McKnight',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Melbourne',
    addressRegion: 'VIC',
    addressCountry: 'AU',
  },
  email: 'hello@digital-knight.au',
  sameAs: [
    'https://www.linkedin.com/in/spencer-mcknight/',
    'https://github.com/Spencer-McKnight/',
  ],
  serviceType: [
    'Web Design',
    'Web Development',
    'AI Automation',
    'Digital Strategy',
  ],
};

const webSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Digital Knight',
  url: 'https://digital-knight.au',
};

export function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalService) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
    </>
  );
}
