import type { CaseCopyMap } from '../case-copy';

export const cases: CaseCopyMap = {
  sogif: {
    meta: {
      title: 'SOGIF: Investment fund website rebuild',
      description:
        "A rebuild of the SOGIF fund's website: new design, new architecture, the same content structure for compliance, and a partnership that continues.",
    },
    h1: 'SOGIF.au: modernising a world-class fund',
    headline: 'An investment fund, rebuilt.',
    line: 'A new design and architecture for an investment fund, on the content structure its compliance already knew.',
    tagline:
      'A new design and a new architecture for the Strategic Opportunities (Growth and Income) Fund, keeping the content structure its compliance process already relied on.',
    siteLabel: 'Visit sogif.au',
    built: [
      [
        'The fund had launched on a practical template. It needed a site that matched the strength of the brand and could carry more of the business over time.',
      ],
      [
        'I rebuilt it in Next.js with a headless CMS: a new visual language, charts of fund performance, a property portfolio and a clear path to the investor application. The page structure stayed close to the original, so every page did not need to go back through compliance review.',
      ],
    ],
    context: [
      [
        'The Strategic Opportunities (Growth and Income) Fund, SOGIF, asked for a more modern design and a sounder architecture for its website.',
      ],
      [
        'SOGIF first launched on a practical website template, a quick and economical start. As the fund matured, the team wanted the site to reflect the strength of the brand and its forward-looking approach to investing.',
      ],
    ],
    criteria: [
      "A site that carries the sense of modern strategy in SOGIF's investing",
      'Strong contrast, usability and plain navigation for an audience over 40',
      'A content structure close to the original, to keep compliance risk low',
    ],
    outcomes: [
      [
        'The whole site was delivered in under two months, including several rounds of change requests that widened the scope.',
      ],
      [
        'Every page carries structured data and full metadata, so search engines and AI assistants can read what the fund offers.',
      ],
      [
        'The partnership continues on a retainer. Automations for the fund’s business processes are being built on the new site, and AI integration is under discussion.',
      ],
    ],
    alt: {
      lead: 'The SOGIF website showing fund performance charts and property assets',
      before: 'The original SOGIF website, before the rebuild',
      after: 'The rebuilt SOGIF website with its new design and data visualisation',
      application: 'The SOGIF investor application page with fund details',
      properties: 'The SOGIF property portfolio',
    },
    captions: { application: 'Investor application', properties: 'Property portfolio' },
    stackUse: [
      'Full-stack React framework, static and server rendering, routing',
      'Interface components and rendering',
      'Type safety across the codebase',
      'Utility-first styling',
      'DatoCMS content through the Next.js data cache',
      'Interaction animation',
      'Fund performance charts',
      'Unit tests',
      'Hosting, performance monitoring and Core Web Vitals',
    ],
  },

  dyflex: {
    meta: {
      title: 'DyFlex: SAP vendor portal in Next.js',
      description:
        'A Next.js front end for an SAP vendor portal across BTP, S/4HANA and OData V4, with an AI-assisted prototype workflow the team can reuse.',
    },
    h1: 'DyFlex: an SAP vendor portal in React',
    headline: 'An SAP portal, prototyped in four days.',
    line: 'A Next.js front end for vendors, connected across SAP systems, with a prototype workflow the team can reuse.',
    tagline: 'A responsive Next.js front end connecting several SAP systems, for vendors across Australia.',
    siteLabel: 'Visit dyflex.com.au',
    built: [
      [
        'DyFlex implements SAP for clients around Australia. I joined as principal Next.js developer on a vendor portal that connects several SAP systems to one responsive front end.',
      ],
      [
        'I built a working prototype of the interface in four working days, with a workflow that moves from the Figma designs to code through Claude, and wrote that workflow up as a path other developers can follow for SAP integrations in Next.js.',
      ],
    ],
    context: [
      ['DyFlex is an SAP implementation company working with clients across Australia.'],
      [
        'The portal had to bring several SAP systems (Cloud Foundry, S/4HANA and BTP) together behind one responsive front end, for vendors to use Australia-wide.',
      ],
    ],
    criteria: [
      'An interface that matches the proposed design exactly',
      'Business logic that keeps every intended user story',
      'Integration with external APIs across the SAP landscape',
      'A fast, scalable, accessible portal',
    ],
    outcomes: [
      [
        'A prototype of the full interface in four working days, built from the Figma designs with an AI-assisted workflow.',
      ],
      ['That workflow is written up as a path future Next.js developers can take to build SAP integrations.'],
    ],
    alt: { lead: 'The DyFlex SAP vendor portal interface' },
    stackUse: [
      'App Router, hybrid server and client rendering, standalone deployment',
      'Server Components with client interactivity',
      'Strict type safety across the codebase',
      'Enterprise components with custom design tokens',
      'Global state',
      'Cloud hosting with multi-target application deployment',
      'OAuth2 gateway with role-based access',
      'Purchase order and service entry sheet APIs on S/4HANA',
      'Unit and component tests',
    ],
  },

  propertyinvesting: {
    meta: {
      title: 'PropertyInvesting.com: Bot traffic and cost audit',
      description:
        'Tracing heavy bot traffic to its source, charting a cheaper path forward, and three design directions for a long-running property community.',
    },
    h1: "PropertyInvesting.com: resetting a community's trajectory",
    headline: 'Where the traffic came from.',
    line: 'Finding where heavy bot traffic came from, a cheaper way forward, and three design directions.',
    tagline:
      "An audit for one of Australia's longest-running property investing communities: where its traffic came from, what it cost, and where it could go next.",
    siteLabel: 'Visit propertyinvesting.com',
    built: [
      [
        'After twenty years online, the community’s site had become expensive to run and hard to change, and its servers were busy with traffic that was not people.',
      ],
      [
        'I traced that traffic to automated requests hitting URLs directly and posting spam to the forum, set out a cheaper path for hosting and maintenance, and prototyped three design directions to start the conversation about what comes next.',
      ],
    ],
    context: [
      [
        'PropertyInvesting.com was created by Steve McKnight and was one of the first voices on positive cash-flow property in Australia and America.',
      ],
      [
        'After twenty years in business, the site was resisting change, costing more each year, and carrying fake traffic that clogged its servers. I was brought in as a consultant to advise on the way forward.',
      ],
    ],
    criteria: [
      'Find what was holding the community back',
      'Suggest ways to grow the community and ease the work of running it',
      'Lower the cost of servers, hosting and maintenance',
      'Give design direction for what comes next',
    ],
    outcomes: [
      ['Identified the source of the bot traffic: automated requests hitting URLs directly, and spam posted to the forum.'],
      ['Set out a path forward with lower ongoing hosting and maintenance costs.'],
      ['Prototyped three design directions with AI tools, at no extra cost, to guide the next conversation.'],
      [
        'The work led to the next engagement: the rebuild of ',
        { text: 'the SOGIF fund website', href: '/work/sogif' },
        '.',
      ],
    ],
    alt: {
      lead: 'The PropertyInvesting.com scope and strategy document',
      courses: 'Design direction for a courses section',
      ctas: 'Design direction for calls to action',
      community: 'Design direction for a gamified community',
    },
    captions: { courses: 'Courses', ctas: 'Calls to action', community: 'Community' },
    stackUse: [
      'Reading the traffic to set direction',
      'Reviewing the legacy WordPress install for security problems',
      'Prototyping the design directions',
      'Scoping and estimates',
    ],
  },

  stevemcknight: {
    meta: {
      title: 'SteveMcKnight.com: A personal website, idea to launch',
      description:
        'A personal website taken from idea to launch at speed, on a static stack that is simple to keep running.',
    },
    h1: 'SteveMcKnight.com: from idea to launch',
    headline: 'Idea to launch in a day.',
    line: 'A personal website from idea to launch in a day, on a static stack that is simple to keep running.',
    tagline: 'A personal website for an author and investor, taken from idea to launch in a single day.',
    siteLabel: 'Visit stevemcknight.com',
    built: [
      [
        'Steve McKnight wanted his personal site to show who he is now. I scoped it, set its success criteria, and built it on plain HTML, CSS and JavaScript on static hosting, so there is almost nothing to maintain.',
      ],
      [
        'To keep his voice, the whole of the old site and some of his own notes went into the drafting, and the new design language grew from them.',
      ],
    ],
    context: [
      [
        'Steve McKnight asked for a new personal website. The old one no longer showed who he is or what he is working on.',
      ],
      [
        'With a loose brief, I scoped the project and wrote its success criteria. It was a fast build, offered at no cost to start the working relationship.',
      ],
    ],
    criteria: [
      'A very simple technical stack',
      "Steve's story, language and identity throughout",
      'Clear routes to his books and current ventures',
      'Further reading on his philosophy and thinking',
    ],
    outcomes: [
      ['The site went from idea to launch in one day, on static hosting that is simple to keep running.'],
      [
        "The old site's content and some of Steve's own notes were read into the drafting, so the new copy kept his voice.",
      ],
      ['It connects to analytics, sends enquiries to his inbox and works on every screen size.'],
    ],
    alt: {
      lead: 'The SteveMcKnight.com home page with portrait',
      before: 'The original Steve McKnight website',
      after: 'The new books section with clean typography',
      insights: 'The insights section with featured articles',
      cta: 'The call to action with email signup',
    },
    captions: { insights: 'Insights', cta: 'Call to action' },
    stackUse: [
      'Hand-written page markup',
      'Theme toggle and shared behaviour',
      'Styles and design tokens, mobile first',
      'Typography',
      'Visitor analytics',
      'Static hosting, CDN and deployment',
      'Content source and voice reference',
    ],
  },

  inlight: {
    meta: {
      title: 'Inlight: Learning the craft in a product agency',
      description:
        "Full stack work for Chadstone, Nando's, Urban Rest and AHM, and the Inlight Rising Star Award. Where the studio's craft was learned.",
    },
    h1: 'Inlight: where the craft was learned',
    headline: 'Two years in a product agency.',
    line: 'Two years of full stack work in a Melbourne product agency, before the studio.',
    tagline: 'Two years as a full stack developer at a Melbourne digital product agency, before the studio began.',
    siteLabel: 'Visit inlight.com.au',
    indexKind: 'Before the studio',
    built: [
      [
        'Inlight builds digital products for clients in retail, food, health, travel and government. I spent two years there as a full stack developer before starting Digital Knight.',
      ],
      [
        'It is where I learned how real delivery runs: shipping for large clients to deadlines, across web and mobile, alongside strategy, design and testing.',
      ],
    ],
    context: [
      [
        'Inlight is a Melbourne digital product agency built around composable architecture and products that keep improving. Its clients span retail, automotive, food and beverage, health, government, travel and logistics.',
      ],
      [
        "My technical footing was built there. I spent two years as a full stack developer, learning the rhythm of agency delivery, picking up new stacks and seeing products ship to large numbers of people.",
      ],
    ],
    criteria: [
      'Polished work for well-known clients, to firm deadlines',
      'Close work across design, strategy, delivery and engineering',
      'Building across the whole stack of several products',
      'Performance and security work for large applications',
    ],
    engagements: [
      {
        name: "Vicinity's Chadstone app",
        description: 'React Native components for the Chadstone shopping app.',
      },
      {
        name: "Nando's Australia and New Zealand",
        description:
          'Web and React Native feature releases, with blue-green deployments and careful testing so releases could go out safely.',
      },
      {
        name: 'Urban Rest',
        description:
          'The check-in flow from end to end, with a client-ready prototype in two weeks, then a small-team AI workshop to build a recommendation engine for matching accommodation.',
      },
      {
        name: 'AHM',
        description:
          'A migration of a custom Sanity v2 CMS to Sanity v3, with an upgrade from Node 14 to 20 and full package modernisation, planned around the risks.',
      },
    ],
    outcomes: [
      ['Delivered work across strategy, design, leadership and testing on several client engagements.'],
      ['Built a typed, secure layer between back-end APIs and the front end, so interfaces could consume complex services cleanly.'],
      ['Presented work and demonstrations to clients, and shared knowledge inside the agency.'],
      ['Received the Inlight Rising Star Award.'],
    ],
    alt: { lead: "Inlight's agency website" },
    stackUse: [
      'Web applications and server rendering',
      'Cross-platform mobile apps',
      'Cloud infrastructure, staging environments and databases',
      'Web deployment and hosting',
      'Legacy and CMS-driven back-end work',
      'Queries for content and data layers',
      'Headless and structured content management',
      'Authentication and secure tokens',
      'Containerised development and deployment',
      'Server-side scripting and API mediation',
      'CI/CD automation',
    ],
  },
};
