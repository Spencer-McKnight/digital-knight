/**
 * Content for the four Services monuments.
 *
 * Kept here (not in the markup) so the visual composition below reads as
 * structure, not copy. Copy lives close to the brief; layout lives close to
 * the eye. See `services.md` for the authored source.
 */

export type ServiceContent = {
  /** The monument header. One word. */
  id: 'listen' | 'ideate' | 'create' | 'evolve';
  label: string;
  /** Short lede — the promise of this phase. */
  lede: string;
  /**
   * Body paragraphs. Business-effective concise sentences. Each array entry
   * renders as its own paragraph so rhythm stays intentional.
   */
  body?: string[];
  /**
   * Optional list block with a distinct visual pop — used for "Could my
   * business…" on Ideate, and for the technology chips on Create.
   */
  pop?: {
    kind: 'questions' | 'tags' | 'marks';
    heading?: string;
    items: string[];
    /** Short coda beneath the pop block. */
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
      kind: 'marks',
      items: [
        'Conversations',
        'Project outline',
        'Scope',
        'Case studies',
        'User stories',
        'Customer journeys',
      ],
    },
  },
  {
    id: 'ideate',
    label: 'Ideate',
    lede: 'Analyse what we can create.',
    body: [
      'Websites can be so much more than you imagine. They form an infrastructure core.',
    ],
    pop: {
      kind: 'questions',
      heading: 'Could my business…',
      items: [
        'Benefit from more intelligent AI',
        'Funnel more customers',
        'Get more from what we already have',
        'Centralise documents, communications, strategies',
        'Benefit from reliable automation',
      ],
      coda: 'I\u2019ve got you.',
    },
  },
  {
    id: 'create',
    label: 'Create',
    lede: 'Unlock technology\u2019s true potential.',
    body: [
      'Using the most modern tools available, I create quality ideas with surprising pace.',
      'A progress board gives you real-time visibility into digital optimisation. Weekly demonstrations and refinements. You own all infrastructure.',
    ],
    pop: {
      kind: 'tags',
      heading: 'AI-empowered design and development',
      items: [
        'React / Next',
        'Vue / Nuxt',
        'Vercel',
        'Amazon AWS',
        'Supabase',
        '3D Graphics',
      ],
    },
  },
  {
    id: 'evolve',
    label: 'Evolve',
    lede: 'A continuous relationship for continual improvement.',
    body: [
      'Security, uptime, optimisation \u2014 and building on the core with new features that keep your edge sharp.',
      'You benefit from modern technology without ever re-starting.',
    ],
  },
];
