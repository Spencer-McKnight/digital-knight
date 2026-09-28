import type { StatementProps } from '@/blocks/Statement/Statement';
import { coverArt } from '../art';
import { href } from '../routes';
import { ticket } from './ticket';

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
  ticket: { content: ticket, href: href('talk', 'de-DE'), tilt: -2 },
};
