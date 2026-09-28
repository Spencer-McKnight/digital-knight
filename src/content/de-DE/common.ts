import type { CommitCopy } from '@/blocks/Commit/copy';
import type { CredentialProps } from '@/blocks/Credential/Credential';
import type { EnquiryCopy } from '@/blocks/Enquiry/copy';
import type { HoursCopy } from '@/blocks/Hours/Hours';
import type { Practice } from '@/blocks/Offer/Offer';
import type { caseLabels as enLabels } from '../en-AU/common';
import { href } from '../routes';

const L = 'de-DE' as const;

export const commit: CommitCopy = {
  subtitle:
    'Alle Zeiten in Ihrer Zeitzone ({zone}). Gespräche finden {days} von {start} bis {end} Uhr Melbourner Zeit statt. Das ist in Deutschland früh am Morgen oder in der Nacht.',
  dayRange: '{first} bis {last}',
  gridLabel: 'Freie Termine, Woche vom {range}',
  prevWeek: 'Vorherige Woche',
  nextWeek: 'Nächste Woche',
  free: 'Frei',
  form: {
    dialog: 'Termin bestätigen',
    close: 'Schließen',
    name: 'Name und Unternehmen',
    namePlaceholder: 'Ihr Name und Ihr Unternehmen',
    email: 'E-Mail',
    emailPlaceholder: 'sie@unternehmen.de',
    honeypot: 'Firma (bitte leer lassen)',
    submit: 'Termin buchen',
    submitting: 'Wird gebucht',
    bookingFor: 'Buchung für',
  },
  errors: {
    name: 'Bitte geben Sie Ihren Namen an.',
    email: 'Bitte prüfen Sie die E-Mail-Adresse.',
    expired: 'Dieser Termin ist abgelaufen. Bitte wählen Sie einen anderen.',
    taken: 'Dieser Termin wurde gerade vergeben. Bitte wählen Sie einen anderen.',
    details: 'Bitte prüfen Sie Ihre Angaben und versuchen Sie es erneut.',
    server: 'Die Buchung ist nicht durchgegangen. Bitte versuchen Sie es gleich noch einmal.',
    network: 'Die Verbindung ist abgebrochen. Bitte versuchen Sie es erneut.',
    calendar: 'Der Kalender konnte nicht geladen werden. Bitte versuchen Sie es erneut.',
  },
  confirmed: {
    title: 'Gebucht.',
    lede: 'Eine Bestätigung mit dem Link zum Gespräch und einer Kalenderdatei ist unterwegs in Ihr Postfach.',
    emailFailed:
      'Die Bestätigungs-E-Mail konnte nicht versendet werden. Tragen Sie den Termin unten in Ihren Kalender ein, der Link steht im Termin.',
    add: 'In den Kalender eintragen',
    google: 'Google Kalender',
    outlook: 'Outlook',
    apple: 'Apple Kalender (.ics)',
    when: 'Wann',
    who: 'Wer',
    next: { href: href('work', L), label: 'Bis dahin: die Referenzen' },
  },
  live: { submitting: 'Ihr Termin wird gebucht.', confirmed: 'Gebucht für {when}. Eine Bestätigung ist unterwegs.' },
  noscript: 'Der Kalender benötigt JavaScript. Schreiben Sie an {email}, um einen Termin zu vereinbaren.',
};

export const enquiry: EnquiryCopy = {
  name: 'Name',
  email: 'E-Mail',
  message: 'Woran arbeiten Sie?',
  honeypot: 'Website (bitte leer lassen)',
  submit: 'Nachricht senden',
  submitting: 'Wird gesendet',
  errors: {
    details: 'Bitte prüfen Sie Name, E-Mail und Nachricht und senden Sie erneut.',
    server: 'Die Nachricht wurde nicht gesendet. Bitte versuchen Sie es später erneut oder schreiben Sie an hello@digital-knight.au.',
    retry: 'Die Nachricht wurde nicht gesendet. Bitte versuchen Sie es erneut.',
  },
  success: {
    title: 'Nachricht gesendet.',
    body: 'Sie bekommen eine Antwort per E-Mail.',
    offer: 'Lieber gleich sprechen? Name und E-Mail werden übernommen.',
    book: 'Jetzt Erstgespräch buchen',
    loading: 'Kalender wird geladen',
    back: 'Zurück',
    bookingAs: 'Buchung als',
    calendarError: 'Der Kalender konnte nicht geladen werden. Bitte versuchen Sie es erneut.',
  },
};

export const hours: HoursCopy = {
  window: 'Gespräche finden {days} von {start} bis {end} Uhr in {city} statt.',
  yours: 'Das ist {start} bis {end} Uhr bei Ihnen ({zone}).',
  nextFree: 'Nächster freier Termin: {visitor} Uhr Ihre Zeit ({business} Uhr in {city})',
  none: 'In den nächsten acht Wochen ist kein Termin frei. Schreiben Sie mir, dann finden wir einen.',
  dayRange: '{first} bis {last}',
  city: 'Melbourne',
  now: 'Jetzt',
  strip: '{day}, Ihre Zeit',
};

export const caseLabels: typeof enLabels = {
  folio: 'Referenz',
  proof: 'Was gebaut wurde',
  loupe: 'Vorher und nachher',
  loupeFolio: 'Was sich geändert hat',
  loupeLede: 'Halten Sie das Licht über die alte Website, um die neue zu sehen.',
  before: 'Vorher',
  after: 'Nachher',
  range: 'Licht bewegen',
  context: 'Ausgangslage',
  criteria: 'Woran Erfolg gemessen wurde',
  engagements: 'Kundenprojekte',
  outcomes: 'Was umgesetzt wurde',
  plates: 'Die Arbeit',
  stack: 'Technologie',
  next: 'Nächste Referenz',
  call: 'So läuft die Zusammenarbeit',
  callLead: 'Jedes Projekt beginnt gleich und geht nach dem Launch weiter.',
};

export const credential: Omit<CredentialProps, 'variant' | 'link'> = {
  folio: 'Wer die Arbeit macht',
  title: 'Spencer McKnight',
  line: 'Ich verantworte die Strategie und schreibe den Code. Dazwischen geht nichts verloren.',
  facts: [
    'Bachelor of Business Information Technology (Professional)',
    'Zwei Jahre als Full-Stack-Entwickler bei Inlight',
    'Inlight Rising Star Award',
    'Hunderte ausgelieferte digitale Projekte für Web und Mobilgeräte',
  ],
  portrait: {
    src: '/images/credential/spencer.avif',
    width: 800,
    height: 1067,
    alt: 'Gezeichnetes Porträt von Spencer McKnight, Gründer von Digital Knight',
  },
};

export const practices: ReadonlyArray<Practice> = [
  {
    name: 'Beratung',
    summary: 'Wohin Digitales Ihr Unternehmen bringen kann, und was zuerst gebaut werden sollte.',
    items: ['KI- und Innovationsstrategie', 'Moderne Architektur', 'Produktanalyse', 'Klare Erfolgskriterien'],
    proof: [{ href: href('case', L, 'propertyinvesting'), label: 'Analyse für PropertyInvesting.com' }],
  },
  {
    name: 'Website',
    summary: 'Design und Entwicklung, danach die Weiterentwicklung und Betreuung, damit die Website ihren Platz behält.',
    items: ['Entwicklung', 'Design und Marke', 'Suchmaschinen', 'Conversion und Marketing', 'Qualitätssicherung', 'Weiterentwicklung', 'Technischer Support'],
    proof: [
      { href: href('case', L, 'sogif'), label: 'Relaunch für den SOGIF-Fonds' },
      { href: href('case', L, 'stevemcknight'), label: 'Website für SteveMcKnight.com' },
    ],
  },
  {
    name: 'KI und Automatisierung',
    summary:
      'Eine Website kann auch das Backoffice tragen: Steuer- und Compliance-Daten, Lohnabrechnung, Bestellungen und Versand, Kundenservice und Reporting, gespeist aus den Systemen, die Sie schon nutzen.',
    items: ['KI-Workflows', 'Prozesslandkarten', 'Anbindung von Drittsystemen', 'Admin-Dashboards', 'Weniger Handarbeit'],
    proof: [{ href: href('case', L, 'dyflex'), label: 'SAP-Portal und Prototyping-Workflow für DyFlex' }],
  },
  {
    name: 'Marktanalyse',
    summary: 'Den Markt kennen, bevor Sie entscheiden: wer Ihre Kunden sind, was der Wettbewerb tut, was sich lohnt.',
    items: ['Marktforschung', 'Wettbewerbsanalyse', 'User Stories', 'Customer Journeys', 'Datenanalyse', 'Umfang und Projektskizze'],
    proof: [{ href: href('case', L, 'propertyinvesting'), label: 'Analyse für PropertyInvesting.com' }],
  },
];
