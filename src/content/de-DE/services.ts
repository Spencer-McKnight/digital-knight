import type { CallProps } from '@/blocks/Call/Call';
import type { FitProps } from '@/blocks/Fit/Fit';
import type { OfferProps } from '@/blocks/Offer/Offer';
import type { StatementProps } from '@/blocks/Statement/Statement';
import { href } from '../routes';
import { practices } from './common';

const L = 'de-DE' as const;

export const meta = {
  title: 'Digitalstrategie, Website und KI-Integration',
  description:
    'Beratung, Webdesign und Entwicklung, KI und Automatisierung, Marktanalyse. Eine Person verantwortet alles, von der Strategie bis zum Code.',
};

export const statement: StatementProps = {
  variant: 'page',
  folio: 'Leistungen',
  title: 'Strategie, Website, KI. Ein Ansprechpartner.',
  lede: 'Vier Disziplinen, verantwortet von einer Person in Melbourne, vom ersten Plan bis zum Code, der ihn umsetzt.',
};

export const offer: OfferProps = {
  variant: 'full',
  folio: 'Die Disziplinen',
  title: 'Was Sie beauftragen können.',
  practices,
  proofLabel: 'Zu sehen bei',
};

export const fit: FitProps = {
  folio: 'Passt das zu Ihnen',
  title: 'Prüfen Sie, bevor Sie weiterlesen.',
  fits: {
    label: 'Das passt, wenn',
    items: [
      'Ihre Website mehr leisten soll als eine Broschüre',
      'Sie einen verantwortlichen Ansprechpartner von der Strategie bis zum Code wollen',
      'Sie KI und Automatisierung einführen wollen, ohne neu anzufangen',
      'Sie einen Partner für Jahre suchen, keine Übergabe',
    ],
  },
  wont: {
    label: 'Das passt nicht, wenn',
    items: ['Sie ein einmaliges Projekt mit Rechnung brauchen', 'Sie ein großes Team vor Ort brauchen'],
  },
  tally: '{n} von {total} treffen auf Sie zu.',
  link: { href: href('work', L), label: 'Zu den Referenzen' },
};

export const call: CallProps = {
  lead: 'Als Nächstes: was für andere gebaut wurde, und warum.',
  link: { href: href('work', L), label: 'Zu den Referenzen' },
};
