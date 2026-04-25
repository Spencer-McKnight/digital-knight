/** Copy for Services — source: `services.md`. */

export type ServiceContent = {
  id: 'listen' | 'ideate' | 'create' | 'evolve';
  label: string;
  lede: string;
  body?: string[];
  pop?: {
    kind: 'questions' | 'tags' | 'marks';
    heading?: string;
    items: string[];
    coda?: string;
  };
};

export const SERVICES: ReadonlyArray<ServiceContent> = [
  {
    id: 'listen',
    label: 'Listen',
    lede: 'Understanding your business is the most important part of improving it.',
    body: [
      'People, dreams, goals, statistics, branding. What drives your success — and what continues to fall short of expectations.',
    ],
    pop: {
      kind: 'tags',
      items: [
        'Conversations',
        'Case studies',
        'User stories',
        'Customer journeys',
        'Scope',
        'Project outline',
        'Deep research',
        'Competitor analysis',
      ],
    },
  },
  {
    id: 'ideate',
    label: 'Ideate',
    lede: 'Imagine what is possible.',
    pop: {
      kind: 'questions',
      heading: 'Could your business…',
      items: [
        'Benefit from a brand experience that stands out',
        'Use AI to service customers or boost productivity',
        'Dynamically understand and satisfy customer preferences',
        'Enjoy reliable automation',
      ],
      coda: 'Yes. It can',
    },
  },
  {
    id: 'create',
    label: 'Create',
    lede: 'Unlock technology\u2019s true potential.',
    body: [
      'Using the most development modern tools available, I create quality ideas with surprising pace.',
      'My progress board gives you real-time visibility into work progress. Weekly demonstrations and refinements. You own all infrastructure.',
    ],
    pop: {
      kind: 'tags',
      heading: 'AI-empowered design and development',
      items: [
        'Headless CMS',
        'Security',
        'Email',
        'Authentication',
        'Page Speed',
        'SEO',
        'React / Next',
        'Vercel',
        'Databases',
        '3D Graphics',
      ],
    },
  },
  {
    id: 'evolve',
    label: 'Evolve',
    lede: 'Evolution is what keeps your product competitive.',
    body: [
      'I mean real, planned or reactive changes to better suit your use cases. Not paying just to keep the lights on. Improving features until they feel just right.',
      'Most importantly, forming a loyal partnership to benefit from new eras in technology withour restarting.'
    ],
  },
];
