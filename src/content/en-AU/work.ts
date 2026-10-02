import type { CallProps } from '@/blocks/Call/Call';
import type { ConcordanceProps } from '@/blocks/Concordance/Concordance';
import type { IndexProps } from '@/blocks/Index/Index';
import type { ProofProps } from '@/blocks/Proof/Proof';
import type { StatementProps } from '@/blocks/Statement/Statement';
import { concordanceData, indexRows, proofOf } from '../proof';
import { scenes } from '../art';
import { href } from '../routes';

const L = 'en-AU' as const;

export const meta = {
  title: 'Web development case studies',
  description:
    'SOGIF, DyFlex, PropertyInvesting.com and SteveMcKnight.com. What each client needed, and what was built for them.',
};

export const statement: StatementProps = {
  variant: 'page',
  folio: 'Work',
  title: 'What was built, and why.',
  lede: 'Four clients and one tenure. Each case says what the client needed, what was built and what happened next.',
  art: (() => {
    const s = scenes.proof('A stack of printed proofs on concrete, the top sheet under a hard light.');
    return { picture: s.picture, object: { kind: 'sticker', label: 'Rebuild', at: s.at } };
  })(),
};

export const proof: ProofProps = proofOf(L, 'sogif', 'Lead case', { href: href('case', L, 'sogif'), label: 'Read the SOGIF fund rebuild' });

export const index: IndexProps = { variant: 'full', folio: 'Every case', title: 'The full list.', rows: indexRows(L) };

export const concordance: ConcordanceProps = {
  folio: 'By technology',
  title: 'Browse by what it was built with.',
  lede: 'Point at a technology to see the cases that used it.',
  announce: '{term}: used in {cases}.',
  ...concordanceData(L),
};

export const call: CallProps = {
  lead: 'Next: what you get, how it runs, and who does it.',
  link: { href: href('partnership', L), label: 'See how the partnership runs' },
};
