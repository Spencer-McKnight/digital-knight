import type { CaseSlug } from './routes';

/**
 * Case data shared by both markets: names, links, images and stacks. Words
 * that change with the language live in `<locale>/cases.ts`.
 */

export type Picture = {
  src: string;
  width: number;
  height: number;
};

export type CaseKind = 'rebuild' | 'portal' | 'audit' | 'oneDay' | 'tenure';

export type CaseShared = {
  slug: CaseSlug;
  /** Client name as published. */
  client: string;
  kind: CaseKind;
  siteUrl: string;
  lead: Picture;
  /** Plates after the lead, in order. Alt text lives with the locale. */
  plates: ReadonlyArray<Picture & { key: string }>;
  /** Before and after screenshots for the Loupe. */
  loupe?: { before: Picture; after: Picture };
  /** Technology names, as used on the project. Use cases are localised. */
  stack: ReadonlyArray<string>;
  /** Canonical names for the Concordance, one per technology family. */
  terms: ReadonlyArray<string>;
  next: CaseSlug;
};

const img = (src: string, width: number, height: number): Picture => ({ src, width, height });

export const CASES: Record<CaseSlug, CaseShared> = {
  sogif: {
    slug: 'sogif',
    client: 'SOGIF.au',
    kind: 'rebuild',
    siteUrl: 'https://sogif.au',
    lead: img('/images/sogif/sogif-showcase.avif', 1251, 1158),
    plates: [
      { key: 'application', ...img('/images/sogif/sogif-application.avif', 1642, 1458) },
      { key: 'properties', ...img('/images/sogif/sogif-properties.avif', 1678, 1408) },
    ],
    loupe: {
      before: img('/images/sogif/sogif-old.avif', 1182, 936),
      after: img('/images/sogif/sogif-site.avif', 1666, 1632),
    },
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'GraphQL and native fetch',
      'Framer Motion',
      'Recharts',
      'Vitest',
      'Vercel Analytics',
    ],
    terms: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GraphQL', 'DatoCMS', 'Framer Motion', 'Recharts', 'Vitest', 'Vercel'],
    next: 'dyflex',
  },
  dyflex: {
    slug: 'dyflex',
    client: 'DyFlex',
    kind: 'portal',
    siteUrl: 'https://dyflex.com.au',
    lead: img('/images/dyflex/hio-showcase.avif', 1506, 1209),
    plates: [],
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'MUI and Emotion',
      'Redux Toolkit',
      'SAP BTP Cloud Foundry',
      'SAP App Router and XSUAA',
      'SAP OData V4',
      'Jest and React Testing Library',
    ],
    terms: ['Next.js', 'React', 'TypeScript', 'MUI', 'Redux Toolkit', 'SAP BTP', 'OData V4', 'Jest', 'Claude'],
    next: 'propertyinvesting',
  },
  propertyinvesting: {
    slug: 'propertyinvesting',
    client: 'PropertyInvesting.com',
    kind: 'audit',
    siteUrl: 'https://propertyinvesting.com',
    lead: img('/images/propertyinvesting/propertyinvesting-showcase.avif', 1461, 1170),
    plates: [
      { key: 'courses', ...img('/images/propertyinvesting/propertyinvest-mockup-courses.avif', 1167, 1098) },
      { key: 'ctas', ...img('/images/propertyinvesting/propertyinvesting-mockup-ctas.avif', 1507, 1016) },
      { key: 'community', ...img('/images/propertyinvesting/propertyinvesting-mockup-gamified-community.avif', 1340, 1189) },
    ],
    stack: ['Google Analytics', 'WordPress', 'Claude', 'Notion'],
    terms: ['Google Analytics', 'WordPress', 'Claude', 'Notion'],
    next: 'stevemcknight',
  },
  stevemcknight: {
    slug: 'stevemcknight',
    client: 'SteveMcKnight.com',
    kind: 'oneDay',
    siteUrl: 'https://stevemcknight.com',
    lead: img('/images/stevemcknight.com/stevemcknight-showcase.avif', 1406, 1263),
    plates: [
      { key: 'insights', ...img('/images/stevemcknight.com/stevemcknight-insights.avif', 1427, 1080) },
      { key: 'cta', ...img('/images/stevemcknight.com/stevemcknight-cta.avif', 1132, 798) },
    ],
    loupe: {
      before: img('/images/stevemcknight.com/stevemcknight-old-website.avif', 1055, 940),
      after: img('/images/stevemcknight.com/stevemcknight-books.avif', 1412, 1101),
    },
    stack: [
      'HTML',
      'JavaScript',
      'CSS and custom properties',
      'Google Fonts',
      'Google Analytics',
      'Vercel',
      'Markdown',
    ],
    terms: ['HTML', 'JavaScript', 'CSS', 'Google Fonts', 'Google Analytics', 'Vercel'],
    next: 'inlight',
  },
  inlight: {
    slug: 'inlight',
    client: 'Inlight',
    kind: 'tenure',
    siteUrl: 'https://inlight.com.au',
    lead: img('/images/inlight/inlight-showcase.avif', 1412, 1140),
    plates: [],
    stack: [
      'React, Next.js and TypeScript',
      'React Native',
      'AWS',
      'Vercel',
      'PHP',
      'GraphQL',
      'DatoCMS, Craft CMS and Sanity',
      'Auth0 and JWT',
      'Docker',
      'Node.js',
      'GitHub Actions',
    ],
    terms: ['React', 'Next.js', 'TypeScript', 'React Native', 'AWS', 'Vercel', 'GraphQL', 'DatoCMS', 'Sanity', 'Docker', 'Node.js'],
    next: 'sogif',
  },
};

/** Index order, kept from the old work grid. */
export const CASE_ORDER: ReadonlyArray<CaseSlug> = ['sogif', 'dyflex', 'inlight', 'propertyinvesting', 'stevemcknight'];
