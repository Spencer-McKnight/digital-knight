export type ImageDef = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Figure = ImageDef & {
  variant: 'lead' | 'image';
  caption?: string;
};

export type Stat = {
  value: string;
  label: string;
};

export type StackRow = {
  technology: string;
  useCase: string;
};

export type CaseStudy = {
  slug: string;
  label: string;
  title: string;
  tagline: string;
  lede: string;
  siteUrl?: string;
  stats?: Stat[];
  technologies: string[];
  context: string[];
  criteria: string[];
  outcomes: string[];
  stack: StackRow[];
  figures: Figure[];
  nextSlug: string;
};

export const CASE_STUDIES: ReadonlyArray<CaseStudy> = [
  {
    slug: 'sogif',
    label: 'SOGIF.au',
    title: 'Modernising a world-class fund',
    tagline: 'Creating a beautiful branded website, making it easier to inform investors and stay focused on what matters.',
    lede: 'A strategic digital rebuild for the Strategic Opportunities (Growth & Income) Fund, refreshing an established online presence into a platform that matches the calibre of the fund itself.',
    siteUrl: 'https://sogif.au',
    stats: [
      { value: '90%', label: 'Increase in engagement duration in one month' },
      { value: '3.2x', label: 'Higher ratio of users reaching the application page' },
    ],
    technologies: ['Next.js', 'React 19', 'TypeScript', 'Tailwind CSS', 'GraphQL', 'Framer Motion', 'Vercel'],
    context: [
      'The Strategic Opportunities (Growth & Income) Fund, SOGIF, approached Digital Knight with a goal to modernise the design appeal and architecture of its website.',
      'SOGIF first launched on a practical website template, allowing a convenient and cost-effective start to their digital presence.',
      'As the fund matured, the team wanted the website to better reflect the strength of the brand and its forward-looking investment approach.',
    ],
    criteria: [
      'Create a website experience that evokes the feeling of modern strategy embodied by SOGIF\'s investing practices',
      'High degree of usability, contrast and navigation comprehension for 40+ audiences',
      'Similar content structure to reduce content compliance risk',
    ],
    outcomes: [
      'The entire website was delivered in less than two months, adhering to a tight schedule and completing multiple rounds of change requests that increased scope.',
      'All conversion metrics improved considerably, and clients remain satisfied with their product.',
      'Their Google search profile became much more detailed, showing each page and pulling data into AI agents.',
      'An ongoing retainer is established for digital partnership. Using the new website as a base, new automations are in development for their business processes, and AI integrations are being actively discussed.',
    ],
    stack: [
      { technology: 'Next.js', useCase: 'Full-stack React framework, SSR/SSG, routing' },
      { technology: 'React', useCase: 'UI component library and rendering' },
      { technology: 'TypeScript', useCase: 'Type safety and developer experience' },
      { technology: 'Tailwind CSS', useCase: 'Utility-first CSS styling framework' },
      { technology: 'GraphQL + native fetch', useCase: 'DatoCMS API via Next.js Data Cache' },
      { technology: 'Framer Motion', useCase: 'Interaction animations (parallax, menu)' },
      { technology: 'Recharts', useCase: 'Data visualisation (performance charts)' },
      { technology: 'Vitest', useCase: 'Unit testing framework' },
      { technology: 'Vercel Analytics', useCase: 'Hosting, performance monitoring and Core Web Vitals' },
    ],
    figures: [
      {
        variant: 'lead',
        src: '/images/sogif/sogif-showcase.avif',
        alt: 'SOGIF website showing fund performance charts and property assets',
        width: 1251,
        height: 1158,
      },
      {
        variant: 'image',
        src: '/images/sogif/sogif-old.avif',
        alt: 'The original SOGIF website before the redesign',
        width: 1182,
        height: 936,
        caption: 'Before',
      },
      {
        variant: 'image',
        src: '/images/sogif/sogif-site.avif',
        alt: 'The new SOGIF website with modern design and data visualisation',
        width: 1666,
        height: 1632,
        caption: 'After',
      },
      {
        variant: 'image',
        src: '/images/sogif/sogif-application.avif',
        alt: 'SOGIF investor application page with detailed fund information',
        width: 1642,
        height: 1458,
      },
      {
        variant: 'image',
        src: '/images/sogif/sogif-properties.avif',
        alt: 'SOGIF property portfolio showcase with interactive elements',
        width: 1678,
        height: 1408,
      },
      {
        variant: 'image',
        src: '/images/sogif/sogif-pagespeed-insights.avif',
        alt: 'Google PageSpeed Insights showing high performance scores for SOGIF',
        width: 380,
        height: 94,
        caption: 'PageSpeed Insights',
      },
    ],
    nextSlug: 'dyflex',
  },

  {
    slug: 'dyflex',
    label: 'DyFlex',
    title: 'Seamless SAP React dashboard at scale',
    tagline: 'Building a seamless React, SAP-integrated system for HIO vendors.',
    lede: 'Brought on as Next.js principal developer for a vendor portal integration connecting multiple SAP systems to a responsive, enterprise-grade front-end.',
    siteUrl: 'https://dyflex.com.au',
    technologies: ['Next.js', 'React', 'TypeScript', 'MUI', 'Redux Toolkit', 'SAP BTP', 'OData V4', 'Jest'],
    context: [
      'DyFlex is an SAP implementation solutions company that operates all throughout Australia on high profile clients.',
      'Digital Knight was brought on as a Next.js principal developer for a vendor portal integration. A variety of SAP systems (Cloud Foundry, S4, BTP) were required to integrate with a responsive front-end system for use by their vendors Australia-wide.',
    ],
    criteria: [
      'UI matches proposed design with pixel-perfect accuracy',
      'Business logic definition to retain all intended user stories',
      'High level of external API integration across SAP ecosystems',
      'Performant, scalable, accessible, usable web experience',
    ],
    outcomes: [
      'Digital Knight completed an exceptional UI prototype in 4 working days using a complex FigmaMCP, context and Claude AI development workflow. This was presented to establish client confidence in DyFlex\'s digital development process.',
      'This workflow was then composed into a pathway future Next.js developers can take to build modern Next.js SAP integrations.',
    ],
    stack: [
      { technology: 'Next.js', useCase: 'Full-stack framework with App Router, hybrid SSR/client rendering, standalone deployment' },
      { technology: 'React', useCase: 'Component-based UI with Server Components and client interactivity' },
      { technology: 'TypeScript', useCase: 'Strict type safety across the entire codebase' },
      { technology: 'MUI + Emotion', useCase: 'Enterprise component library with custom design tokens and CSS-in-JS theming' },
      { technology: 'Redux Toolkit', useCase: 'Centralised global state management' },
      { technology: 'SAP BTP Cloud Foundry', useCase: 'Enterprise cloud hosting with multi-target application deployment' },
      { technology: 'SAP App Router + XSUAA', useCase: 'OAuth2 authentication gateway with role-based access control' },
      { technology: 'SAP OData V4', useCase: 'Backend integration with S/4HANA Purchase Order and Service Entry Sheet APIs' },
      { technology: 'Jest + React Testing Library', useCase: 'Unit and component testing with DOM assertions' },
    ],
    figures: [
      {
        variant: 'lead',
        src: '/images/dyflex/hio-showcase.avif',
        alt: 'DyFlex SAP vendor portal interface',
        width: 1506,
        height: 1209,
      },
    ],
    nextSlug: 'propertyinvesting',
  },

  {
    slug: 'propertyinvesting',
    label: 'PropertyInvesting.com',
    title: 'Strategic digital consultation',
    tagline: 'Strategic digital analysis, resetting the trajectory for a dedicated online community.',
    lede: 'A consulting engagement to diagnose hidden problems, chart a path forward, and provide design direction for one of Australia\'s longest-running property investing communities.',
    siteUrl: 'https://propertyinvesting.com',
    stats: [
      { value: '97%', label: 'Of malicious site traffic identified' },
      { value: '90%', label: 'Proposed reduction in ongoing yearly costs' },
      { value: '3', label: 'Mockup designs curated' },
    ],
    technologies: ['Google Analytics', 'WordPress', 'Claude AI', 'Notion'],
    context: [
      'PropertyInvesting.com is a historical pillar of the property investing world. Created by Steve McKnight, it was one of the first idea entrants into the positive cashflow property world in Australia and America.',
      'After 20 years of successful business, their digital space was feeling resistant to change, was getting expensive, and had a problem with fake traffic clogging their servers.',
      'Digital Knight was hired as a consultant to provide advice as to the future path forward for PropertyInvesting.com.',
    ],
    criteria: [
      'Identify the current challenges and growth stagnation vectors',
      'Suggest pathways to improve community growth and administrator experience',
      'Reduce maintenance, server and hosting costs for the website',
      'Provide design guidance for future iterations',
    ],
    outcomes: [
      'Digital Knight identified the cause of extreme traffic. Up to 97% of traffic was direct URL hits by bots. Similarly, these bots were posting significant spam to the forum.',
      'A path forward was suggested that would foster a 90% reduction in ongoing yearly costs.',
      'A set of mockup designs were curated at no additional cost, leveraging intelligent AI prototyping, to guide conversation for future journeys their digital experience could take.',
      'The consultation work and client satisfaction led to the website rebuild for Steve McKnight\'s world-class fund, SOGIF.au.',
    ],
    stack: [
      { technology: 'Google Analytics', useCase: 'Understanding website traffic for strategic direction' },
      { technology: 'WordPress', useCase: 'Analysing legacy WordPress instance for security breaches' },
      { technology: 'Claude AI', useCase: 'Prototype development' },
      { technology: 'Notion', useCase: 'Scoping and estimation documentation' },
    ],
    figures: [
      {
        variant: 'lead',
        src: '/images/propertyinvesting/propertyinvesting-showcase.avif',
        alt: 'PropertyInvesting.com project scope and strategy document',
        width: 1461,
        height: 1170,
      },
      {
        variant: 'image',
        src: '/images/propertyinvesting/propertyinvest-mockup-courses.avif',
        alt: 'Mockup design for a modern courses section',
        width: 1167,
        height: 1098,
        caption: 'Courses',
      },
      {
        variant: 'image',
        src: '/images/propertyinvesting/propertyinvesting-mockup-ctas.avif',
        alt: 'Mockup design for improved call-to-action sections',
        width: 1507,
        height: 1016,
        caption: 'Calls to action',
      },
      {
        variant: 'image',
        src: '/images/propertyinvesting/propertyinvesting-mockup-gamified-community.avif',
        alt: 'Mockup design for a gamified community experience',
        width: 1340,
        height: 1189,
        caption: 'Gamified community',
      },
    ],
    nextSlug: 'stevemcknight',
  },

  {
    slug: 'stevemcknight',
    label: 'SteveMcKnight.com',
    title: 'Live website in one day',
    tagline: 'From idea to finished showcase website in a single day.',
    lede: 'A rapid, identity-driven build that proved a premium web experience does not need a premium timeline or budget.',
    siteUrl: 'https://stevemcknight.com',
    stats: [
      { value: '1 day', label: 'From concept to a complete, functional website' },
      { value: '$0', label: 'Ongoing hosting and maintenance cost, forever' },
    ],
    technologies: ['HTML', 'Vanilla JS', 'CSS', 'Google Fonts', 'Google Analytics', 'Vercel'],
    context: [
      'Steve McKnight approached Digital Knight to revamp his personal website, which was not quite showcasing his true digitally modern identity.',
      'Digital Knight scoped the project and, with a loosely defined preferable outcome, generated our own success criteria. We determined this project would be a fast, effective build and offered services for free to establish a working relationship.',
    ],
    criteria: [
      'Extremely simple technical stack',
      'Branded with Steve\'s story, content language and identity',
      'Directs to books and current ventures',
      'Further reading to understand Steve\'s philosophy and thoughts',
    ],
    outcomes: [
      'A free-forever website architecture was created, simplifying the build process in order to provide a premium journey with unprecedented ease.',
      'Frontier AI was utilised without hallucinations, preserving Steve\'s ideals. The entire old website\'s content and some of his personal thoughts were ingested, a new design language was curated, and an excellent outcome was produced.',
      'The result is linked with analytics, submits to his email, and is fully device responsive. It also has an excellent loading time.',
    ],
    stack: [
      { technology: 'HTML', useCase: 'Hand-authored static page markup' },
      { technology: 'Vanilla JavaScript', useCase: 'Client interactivity with theme toggle and shared behaviour' },
      { technology: 'Plain CSS + custom properties', useCase: 'Styling and design tokens, mobile-first responsive' },
      { technology: 'Google Fonts', useCase: 'Typography (Cormorant Garamond, DM Sans)' },
      { technology: 'Google Analytics', useCase: 'Traffic and visitor tracking' },
      { technology: 'Vercel', useCase: 'Static hosting, CDN and deployment' },
      { technology: 'Markdown', useCase: 'Content source and voice reference' },
    ],
    figures: [
      {
        variant: 'lead',
        src: '/images/stevemcknight.com/stevemcknight-showcase.avif',
        alt: 'SteveMcKnight.com hero section with portrait and statistics',
        width: 1406,
        height: 1263,
      },
      {
        variant: 'image',
        src: '/images/stevemcknight.com/stevemcknight-old-website.avif',
        alt: 'The original Steve McKnight website with dated design',
        width: 1055,
        height: 940,
        caption: 'Before',
      },
      {
        variant: 'image',
        src: '/images/stevemcknight.com/stevemcknight-books.avif',
        alt: 'Steve McKnight books section with clean typography and layout',
        width: 1412,
        height: 1101,
        caption: 'After',
      },
      {
        variant: 'image',
        src: '/images/stevemcknight.com/stevemcknight-insights.avif',
        alt: 'Insights section with featured articles and reading content',
        width: 1427,
        height: 1080,
        caption: 'Insights',
      },
      {
        variant: 'image',
        src: '/images/stevemcknight.com/stevemcknight-cta.avif',
        alt: 'Call-to-action section with email signup and engagement prompts',
        width: 1132,
        height: 798,
        caption: 'Call to action',
      },
      {
        variant: 'image',
        src: '/images/stevemcknight.com/stevemcknight-pagespeed-insights.avif',
        alt: 'Google PageSpeed Insights showing high performance scores',
        width: 523,
        height: 109,
        caption: 'PageSpeed Insights',
      },
    ],
    nextSlug: 'sogif',
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug);
}

export function getAllSlugs(): string[] {
  return CASE_STUDIES.map((cs) => cs.slug);
}
