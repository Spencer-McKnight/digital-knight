import type { CallProps } from '@/blocks/Call/Call';
import type { CredentialProps } from '@/blocks/Credential/Credential';
import type { IndexProps } from '@/blocks/Index/Index';
import type { OfferProps } from '@/blocks/Offer/Offer';
import type { ProofProps } from '@/blocks/Proof/Proof';
import type { StatementProps } from '@/blocks/Statement/Statement';
import { coverArt } from '../art';
import { indexRows, proofOf } from '../proof';
import { href } from '../routes';
import { credential, practices } from './common';
import { ticket } from './ticket';

const L = 'en-AU' as const;

export const meta = {
  title: 'Digital Knight | Independent digital studio, Melbourne',
  description:
    'One partner for digital strategy, websites and AI integration. Built in Melbourne and kept evolving, not handed off. Book a free 30-minute call.',
};

export const cover: StatementProps = {
  variant: 'cover',
  folio: 'Independent studio, Melbourne',
  title: 'Digital systems that solve, then evolve.',
  art: coverArt('A sheet of paper under a hard light on a long concrete table, in a dark room.'),
  ticket: { content: ticket, href: href('talk', L), tilt: -2 },
};

export const offer: OfferProps = {
  variant: 'compact',
  folio: 'What I do',
  title: 'Four practices, one partner.',
  lede: 'Strategy, websites, AI and research from the same person, so the plan and the build never drift apart.',
  practices,
  more: { href: href('services', L), label: 'See the four practices in full' },
};

export const proof: ProofProps = proofOf(L, 'sogif', 'Recent work', { href: href('case', L, 'sogif'), label: 'Read the SOGIF fund rebuild' });

export const index: IndexProps = {
  variant: 'compact',
  folio: 'Every case',
  title: 'What was built, and for whom.',
  rows: indexRows(L),
};

export const credentialCompact: CredentialProps = {
  ...credential,
  variant: 'compact',
  link: { href: href('partnership', L), label: 'How working together runs' },
};

export const call: CallProps = {
  lead: 'Not sure where to begin? Start with what is on offer.',
  link: { href: href('services', L), label: 'Start with what I do' },
};
