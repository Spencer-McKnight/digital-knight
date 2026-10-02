import type { CallProps } from '@/blocks/Call/Call';
import type { FitProps } from '@/blocks/Fit/Fit';
import type { OfferProps } from '@/blocks/Offer/Offer';
import type { StatementProps } from '@/blocks/Statement/Statement';
import { scenes } from '../art';
import { href } from '../routes';
import { practices } from './common';

const L = 'en-AU' as const;

export const meta = {
  title: 'Strategy, websites and AI integration',
  description:
    'Advisory, website design and development, AI and automation, and market research. One accountable person in Melbourne, from strategy to code.',
};

export const statement: StatementProps = {
  variant: 'page',
  folio: 'What I do',
  title: 'Strategy, websites and AI. One partner.',
  lede: 'Four practices, all from one accountable person in Melbourne, from the first plan to the code that runs it.',
  art: (() => {
    const s = scenes.orientation('Four sheets of paper on black glass, one of them under a hard light.');
    return { picture: s.picture, object: { kind: 'pin', label: 'Start here', at: s.at } };
  })(),
};

export const offer: OfferProps = {
  variant: 'full',
  folio: 'The practices',
  title: 'What you can buy.',
  practices,
  proofLabel: 'See it in',
};

export const fit: FitProps = {
  folio: 'Is this for you',
  title: 'Check before you read on.',
  fits: {
    label: 'This fits if',
    items: [
      'Your website should do more than a brochure',
      'You want one accountable person from strategy to code',
      'You want AI and automation without starting over',
      'You want a partner for years, not a handoff',
    ],
  },
  wont: {
    label: "It won't fit if",
    items: ['You need a one-off build and an invoice', 'You need a large in-house team on site'],
  },
  tally: '{n} of {total} apply to you.',
  link: { href: href('work', L), label: 'See the work' },
};

export const call: CallProps = {
  lead: 'Next: what was built for others, and why.',
  link: { href: href('work', L), label: 'See the work' },
};
