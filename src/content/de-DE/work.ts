import type { CallProps } from '@/blocks/Call/Call';
import type { ConcordanceProps } from '@/blocks/Concordance/Concordance';
import type { IndexProps } from '@/blocks/Index/Index';
import type { ProofProps } from '@/blocks/Proof/Proof';
import type { StatementProps } from '@/blocks/Statement/Statement';
import { concordanceData, indexRows, proofOf } from '../proof';
import { href } from '../routes';

const L = 'de-DE' as const;

export const meta = {
  title: 'Referenzen: Websites, Portale und Analysen',
  description:
    'SOGIF, DyFlex, PropertyInvesting.com und SteveMcKnight.com. Was jeder Kunde brauchte und was dafür gebaut wurde.',
};

export const statement: StatementProps = {
  variant: 'page',
  folio: 'Referenzen',
  title: 'Was gebaut wurde, und warum.',
  lede: 'Vier Kunden aus Australien und eine Anstellung davor. Jede Referenz zeigt, was gebraucht wurde, was entstand und wie es weiterging.',
};

export const proof: ProofProps = proofOf(L, 'sogif', 'Leitprojekt', {
  href: href('case', L, 'sogif'),
  label: 'Zum Relaunch für den SOGIF-Fonds',
});

export const index: IndexProps = { variant: 'full', folio: 'Alle Referenzen', title: 'Die vollständige Liste.', rows: indexRows(L) };

export const concordance: ConcordanceProps = {
  folio: 'Nach Technologie',
  title: 'Nach Technologie stöbern.',
  lede: 'Wählen Sie eine Technologie, um die Projekte zu sehen, in denen sie eingesetzt wurde.',
  announce: '{term}: eingesetzt bei {cases}.',
  ...concordanceData(L),
};

export const call: CallProps = {
  lead: 'Als Nächstes: was Sie bekommen, wie es läuft und wer es macht.',
  link: { href: href('partnership', L), label: 'So läuft die Zusammenarbeit' },
};
