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

const L = 'de-DE' as const;

export const meta = {
  title: 'Digital Knight | Digitalstudio für Strategie, Web und KI',
  description:
    'Ein Ansprechpartner für Digitalstrategie, Website und KI-Integration. Gebaut, um weiterzuwachsen, nicht um übergeben zu werden. Kostenloses Erstgespräch.',
};

export const cover: StatementProps = {
  variant: 'cover',
  folio: 'Unabhängiges Studio, Melbourne',
  title: 'Digitale Systeme, die Probleme lösen und mit Ihnen wachsen.',
  art: coverArt('Ein Blatt Papier unter hartem Licht auf einem langen Betontisch in einem dunklen Raum.'),
  ticket: { content: ticket, href: href('talk', L), tilt: -2 },
};

export const offer: OfferProps = {
  variant: 'compact',
  folio: 'Leistungen',
  title: 'Vier Disziplinen, ein Ansprechpartner.',
  lede: 'Strategie, Website, KI und Marktanalyse aus einer Hand. Plan und Umsetzung laufen nie auseinander.',
  practices,
  more: { href: href('services', L), label: 'Alle Leistungen im Detail' },
};

export const proof: ProofProps = proofOf(L, 'sogif', 'Aktuelle Arbeit', {
  href: href('case', L, 'sogif'),
  label: 'Zum Relaunch für den SOGIF-Fonds',
});

export const index: IndexProps = {
  variant: 'compact',
  folio: 'Alle Referenzen',
  title: 'Was gebaut wurde, und für wen.',
  rows: indexRows(L),
};

export const credentialCompact: CredentialProps = {
  ...credential,
  variant: 'compact',
  link: { href: href('partnership', L), label: 'So läuft die Zusammenarbeit' },
};

export const call: CallProps = {
  lead: 'Wo anfangen? Am besten beim Angebot.',
  link: { href: href('services', L), label: 'Zu den Leistungen' },
};
