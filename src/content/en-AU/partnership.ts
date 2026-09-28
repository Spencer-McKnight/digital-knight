import type { CredentialProps } from '@/blocks/Credential/Credential';
import type { DialogueProps } from '@/blocks/Dialogue/Dialogue';
import type { LedgerProps } from '@/blocks/Ledger/Ledger';
import type { MethodProps } from '@/blocks/Method/Method';
import type { StatementProps } from '@/blocks/Statement/Statement';
import type { TicketProps } from '@/blocks/Ticket/Ticket';
import { href } from '../routes';
import { credential } from './common';
import { ticket as ticketContent } from './ticket';

const L = 'en-AU' as const;

export const meta = {
  title: 'Ongoing website development partner',
  description:
    'Listen, ideate, create, evolve. Weekly demos, a live progress board and infrastructure you own. How a long-term partnership runs.',
};

export const statement: StatementProps = {
  variant: 'page',
  folio: 'Partnership',
  title: 'How the partnership runs.',
  lede: 'Four phases that repeat for as long as the work is useful, with you able to see every step.',
};

export const method: MethodProps = {
  folio: 'The method',
  title: 'Listen, ideate, create, evolve.',
  phases: [
    {
      name: 'Listen',
      lede: 'Understanding the business is the most important part of improving it.',
      body: [['People, goals, numbers and brand: what drives your success, and what keeps falling short.']],
      tags: ['Conversations', 'Case studies', 'User stories', 'Customer journeys', 'Deep research', 'Competitor analysis', 'Scope', 'Project outline'],
    },
    {
      name: 'Ideate',
      lede: 'The website is the core, but it can carry much more.',
      questions: {
        heading: 'Could your business',
        items: [
          'Stand out with a brand experience of its own?',
          'Use AI to serve customers or save time?',
          'Notice and answer customers sooner?',
          'Hand repetitive work to automation?',
        ],
      },
    },
    {
      name: 'Create',
      lede: 'Build at pace, in the open.',
      body: [
        ['Modern tools, AI among them, let me build and test ideas quickly.'],
        [
          'A live progress board shows what is being worked on, what is done and what comes next. Weekly demonstrations keep the work on course. You own all infrastructure.',
        ],
      ],
      tags: ['React and Next.js', 'APIs', 'Headless CMS', 'Vercel', 'Databases', 'Security', 'Authentication', 'Page speed', 'Search', 'Data visualisation'],
      proof: { href: href('case', L, 'dyflex'), label: 'A portal prototype in four days, for DyFlex' },
    },
    {
      name: 'Evolve',
      lede: 'Evolution is what keeps a product competitive.',
      body: [
        ['Planned and responsive changes that suit how you work, rather than paying to keep the lights on. Features are refined until they feel right.'],
        ['Above all, a partnership that lets you use each new wave of technology without starting over.'],
      ],
      proof: { href: href('case', L, 'sogif'), label: 'The SOGIF partnership, still running' },
    },
  ],
};

export const terms: LedgerProps = {
  variant: 'terms',
  folio: 'The terms',
  title: 'What you can count on.',
  rows: [
    { term: 'First step', detail: 'A free 30-minute call, with no obligation.' },
    { term: 'Before work begins', detail: 'A scope, clear success criteria and transparent estimates.' },
    { term: 'While it runs', detail: 'A live progress board and a demonstration every week.' },
    { term: 'Infrastructure', detail: 'Yours. You own all of it.' },
    { term: 'Who does the work', detail: 'Spencer, from strategy to code, with trusted specialists when a project needs them.' },
    { term: 'After launch', detail: 'The partnership continues, month to month, for as long as it is useful.' },
  ],
};

export const credentialFull: CredentialProps = {
  ...credential,
  variant: 'full',
  link: { href: href('case', L, 'inlight'), label: 'Where the craft was learned: Inlight' },
};

export const dialogue: DialogueProps = {
  folio: 'Questions',
  title: 'What people ask before a call.',
  exchanges: [
    {
      question: 'How is AI used, and what stays manual?',
      answer: [
        [
          'AI does the heavy lifting in research, prototyping and development: synthesising market and competitor research, producing quick visual concepts to test before any code, and ',
          { text: 'Claude Code', href: 'https://claude.ai/code' },
          ' as the main coding environment.',
        ],
        [
          'The decisions stay with a person. Strategy, creative direction, architecture and code standards are set by hand, after weighing what the research found.',
        ],
      ],
    },
    {
      question: 'What is the difference between AI and automation?',
      answer: [
        [
          'Automation follows fixed rules: when an enquiry arrives, send it to the right inbox, create a record in your CRM and send a confirmation.',
        ],
        [
          'AI works where the rules are not fixed. A conversational agent understands what a visitor is asking and answers from your knowledge base. The two are strongest together: AI qualifies a lead, automation routes it and books the follow-up.',
        ],
      ],
    },
    {
      question: 'Who will I work with?',
      answer: [
        [
          'Me, Spencer McKnight, from the first call to the code. Before the studio I spent two years as a full stack developer at ',
          { text: 'Inlight', href: href('case', L, 'inlight') },
          ', a Melbourne product agency.',
        ],
        ['When a project needs a specialist, such as a designer, a copywriter or a domain expert, I bring one in from a network I trust.'],
      ],
    },
    {
      question: 'Which technologies do you prefer?',
      answer: [
        [
          'React and Next.js on Vercel as the foundation, DatoCMS for content, Supabase for data and Resend for email. For business systems I have delivered production work with SAP BTP (',
          { text: 'the DyFlex portal', href: href('case', L, 'dyflex') },
          '), Salesforce, HubSpot and Microsoft 365.',
        ],
        ['Other stacks are on the table when a project calls for them. The technology serves the outcome.'],
      ],
    },
    {
      question: 'How do we start?',
      answer: [
        [
          { text: 'Book a free 30-minute call', href: href('talk', L) },
          '. It is an honest look at where your digital presence stands and whether I am the right fit. Some calls have led to a full rebuild; the ',
          { text: 'PropertyInvesting.com audit', href: href('case', L, 'propertyinvesting') },
          ' led to the SOGIF site.',
        ],
        ['If we go ahead, you get a scope, success criteria and estimates before any work begins.'],
      ],
    },
  ],
};

export const ticket: TicketProps = {
  folio: 'Next step',
  title: 'Start with a free call.',
  lede: 'Thirty minutes about your business, with ideas you can use either way.',
  ticket: { content: ticketContent, href: href('talk', L), tilt: 2 },
};
