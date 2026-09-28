import type { AgendaProps } from '@/blocks/Agenda/Agenda';
import type { CallProps } from '@/blocks/Call/Call';
import type { StatementProps } from '@/blocks/Statement/Statement';
import { href } from '../routes';

const L = 'de-DE' as const;

export const meta = {
  title: 'Kostenloses Erstgespräch: 30 Minuten Digitalstrategie',
  description: 'Termin wählen, Name und E-Mail eintragen, fertig. Unverbindlich. Alle Zeiten erscheinen in Ihrer Zeitzone.',
};

export const statement: StatementProps = {
  variant: 'page',
  folio: 'Erstgespräch',
  title: 'Kostenloses Erstgespräch. 30 Minuten.',
  lede: 'Termin wählen, Name und E-Mail eintragen, fertig. Unverbindlich. Alle Zeiten erscheinen in Ihrer Zeitzone.',
  ground: 'carbon',
};

export const agenda: AgendaProps = {
  folio: 'Das Gespräch',
  title: 'Was die halbe Stunde bringt.',
  length: '30 Minuten',
  parts: [
    { title: 'Ihr Unternehmen', detail: 'Ihre Ziele, was im Weg steht, und Ihre Fragen zum Digitalen.' },
    { title: 'Empfehlungen und Pläne', detail: 'Ideen, wie Website und Werkzeuge zu Ihrer Strategie passen.' },
    { title: 'Mögliche nächste Schritte', detail: 'Wo eine Zusammenarbeit beginnen könnte, wenn sie sinnvoll ist. Unverbindlich.' },
  ],
};

export const hoursHead = { folio: 'Wann', title: 'Wann Gespräche stattfinden, in Ihrer Zeit.' };

export const commitHead = { folio: 'Buchen', title: 'Wählen Sie einen Termin.' };

export const call: CallProps = {
  variant: 'quiet',
  lead: 'Lieber zuerst schreiben? Die Termine liegen in Deutschland nachts oder früh am Morgen.',
  link: { href: href('contact', L), label: 'Stattdessen eine Nachricht senden' },
  ground: 'carbon',
};
