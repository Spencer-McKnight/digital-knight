const professionalService = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Digital Knight',
  url: 'https://digital-knight.au',
  description:
    'An independent studio for long-term digital partnerships. Strategy, design, development and AI for businesses that intend to prevail.',
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
