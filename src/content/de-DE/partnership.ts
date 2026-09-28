import type { CredentialProps } from '@/blocks/Credential/Credential';
import type { DialogueProps } from '@/blocks/Dialogue/Dialogue';
import type { LedgerProps } from '@/blocks/Ledger/Ledger';
import type { MethodProps } from '@/blocks/Method/Method';
import type { StatementProps } from '@/blocks/Statement/Statement';
import type { TicketProps } from '@/blocks/Ticket/Ticket';
import { href } from '../routes';
import { credential } from './common';
import { ticket as ticketContent } from './ticket';

const L = 'de-DE' as const;

export const meta = {
  title: 'Website-Betreuung und Weiterentwicklung',
  description:
    'Zuhören, Ideen entwickeln, bauen, weiterentwickeln. Wöchentliche Demos, ein Live-Projektboard und Infrastruktur, die Ihnen gehört.',
};

export const statement: StatementProps = {
  variant: 'page',
  folio: 'Zusammenarbeit',
  title: 'So läuft die Zusammenarbeit.',
  lede: 'Vier Phasen, die sich wiederholen, solange die Arbeit Ihnen nützt. Jeden Schritt können Sie mitverfolgen.',
};

export const method: MethodProps = {
  folio: 'Die Methode',
  title: 'Zuhören, Ideen entwickeln, bauen, weiterentwickeln.',
  phases: [
    {
      name: 'Zuhören',
      lede: 'Ein Unternehmen zu verstehen ist der wichtigste Schritt, um es besser zu machen.',
      body: [['Menschen, Ziele, Zahlen und Marke: was Ihren Erfolg trägt, und was hinter den Erwartungen bleibt.']],
      tags: ['Gespräche', 'Fallstudien', 'User Stories', 'Customer Journeys', 'Recherche', 'Wettbewerbsanalyse', 'Umfang', 'Projektskizze'],
    },
    {
      name: 'Ideen entwickeln',
      lede: 'Die Website ist der Kern, aber sie kann viel mehr tragen.',
      questions: {
        heading: 'Könnte Ihr Unternehmen',
        items: [
          'sich mit einem eigenen Markenerlebnis abheben?',
          'mit KI Kunden bedienen oder Zeit sparen?',
          'Kundenbedürfnisse früher erkennen und beantworten?',
          'wiederkehrende Arbeit der Automatisierung überlassen?',
        ],
      },
    },
    {
      name: 'Bauen',
      lede: 'Zügig bauen, und offen.',
      body: [
        ['Moderne Werkzeuge, KI eingeschlossen, machen es möglich, Ideen schnell zu bauen und zu prüfen.'],
        [
          'Ein Live-Projektboard zeigt, woran gearbeitet wird, was fertig ist und was als Nächstes kommt. Wöchentliche Demos halten die Arbeit auf Kurs. Die gesamte Infrastruktur gehört Ihnen.',
        ],
      ],
      tags: ['React und Next.js', 'APIs', 'Headless-CMS', 'Vercel', 'Datenbanken', 'Sicherheit', 'Authentifizierung', 'Ladezeit', 'Suchmaschinen', 'Datenvisualisierung'],
      proof: { href: href('case', L, 'dyflex'), label: 'Ein Portal-Prototyp in vier Tagen für DyFlex' },
    },
    {
      name: 'Weiterentwickeln',
      lede: 'Weiterentwicklung hält ein Produkt wettbewerbsfähig.',
      body: [
        ['Geplante und kurzfristige Änderungen, die zu Ihrer Arbeitsweise passen, statt nur den Betrieb am Laufen zu halten. Funktionen werden verfeinert, bis sie sitzen.'],
        ['Vor allem eine Partnerschaft, mit der Sie jede neue Technologie nutzen können, ohne neu anzufangen.'],
      ],
      proof: { href: href('case', L, 'sogif'), label: 'Die laufende Partnerschaft mit SOGIF' },
    },
  ],
};

export const terms: LedgerProps = {
  variant: 'terms',
  folio: 'Die Bedingungen',
  title: 'Worauf Sie sich verlassen können.',
  rows: [
    { term: 'Erster Schritt', detail: 'Ein kostenloses Erstgespräch von 30 Minuten, unverbindlich.' },
    { term: 'Vor Arbeitsbeginn', detail: 'Ein klarer Umfang, Erfolgskriterien und eine transparente Schätzung.' },
    { term: 'Während der Arbeit', detail: 'Ein Live-Projektboard und jede Woche eine Demo.' },
    { term: 'Infrastruktur', detail: 'Gehört Ihnen. Vollständig.' },
    { term: 'Ansprechpartner', detail: 'Spencer, von der Strategie bis zum Code, mit vertrauten Spezialisten, wenn ein Projekt sie braucht.' },
    { term: 'Nach dem Launch', detail: 'Die Zusammenarbeit läuft weiter, Monat für Monat, solange sie Ihnen nützt.' },
    { term: 'Zeitverschiebung', detail: 'Gespräche finden in Melbourne am Vormittag statt, in Deutschland also nachts oder früh am Morgen. Alles andere läuft schriftlich und über das Projektboard.' },
  ],
};

export const credentialFull: CredentialProps = {
  ...credential,
  variant: 'full',
  link: { href: href('case', L, 'inlight'), label: 'Wo das Handwerk entstand: Inlight' },
};

export const dialogue: DialogueProps = {
  folio: 'Fragen',
  title: 'Was vor einem Gespräch gefragt wird.',
  exchanges: [
    {
      question: 'Wie wird KI eingesetzt, und was bleibt Handarbeit?',
      answer: [
        [
          'KI übernimmt die Schwerarbeit in Recherche, Prototyping und Entwicklung: Markt- und Wettbewerbsrecherche verdichten, schnelle visuelle Entwürfe zum Testen vor der ersten Zeile Code, und ',
          { text: 'Claude Code', href: 'https://claude.ai/code' },
          ' als wichtigste Entwicklungsumgebung.',
        ],
        ['Die Entscheidungen trifft ein Mensch. Strategie, kreative Richtung, Architektur und Code-Standards lege ich selbst fest, nachdem ich die Ergebnisse der Recherche abgewogen habe.'],
      ],
    },
    {
      question: 'Was ist der Unterschied zwischen KI und Automatisierung?',
      answer: [
        ['Automatisierung folgt festen Regeln: Geht eine Anfrage ein, landet sie im richtigen Postfach, wird im CRM angelegt und bekommt eine Bestätigung.'],
        [
          'KI arbeitet dort, wo die Regeln nicht feststehen. Ein Chat-Assistent versteht, was ein Besucher fragt, und antwortet aus Ihrer Wissensbasis. Am stärksten sind beide zusammen: KI qualifiziert eine Anfrage, Automatisierung leitet sie weiter und plant den nächsten Schritt.',
        ],
      ],
    },
    {
      question: 'Mit wem arbeite ich zusammen?',
      answer: [
        [
          'Mit mir, Spencer McKnight, vom ersten Gespräch bis zum Code. Vor dem Studio war ich zwei Jahre Full-Stack-Entwickler bei ',
          { text: 'Inlight', href: href('case', L, 'inlight') },
          ', einer Produktagentur in Melbourne.',
        ],
        ['Braucht ein Projekt Spezialisten, etwa für Design, Text oder Fachwissen, hole ich sie aus einem Netzwerk, dem ich vertraue.'],
      ],
    },
    {
      question: 'Welche Technologien setzen Sie bevorzugt ein?',
      answer: [
        [
          'React und Next.js auf Vercel als Grundlage, DatoCMS für Inhalte, Supabase für Daten und Resend für E-Mail. Für Unternehmenssysteme habe ich produktiv mit SAP BTP (',
          { text: 'das Portal für DyFlex', href: href('case', L, 'dyflex') },
          '), Salesforce, HubSpot und Microsoft 365 gearbeitet.',
        ],
        ['Andere Stacks sind möglich, wenn ein Projekt sie verlangt. Die Technologie dient dem Ergebnis.'],
      ],
    },
    {
      question: 'Wie fangen wir an?',
      answer: [
        [
          { text: 'Buchen Sie ein kostenloses Erstgespräch', href: href('talk', L) },
          '. Es ist ein ehrlicher Blick darauf, wo Ihr digitaler Auftritt steht und ob ich der Richtige dafür bin. Aus manchen Gesprächen wurde ein kompletter Relaunch; die ',
          { text: 'Analyse für PropertyInvesting.com', href: href('case', L, 'propertyinvesting') },
          ' führte zur Website von SOGIF.',
        ],
        ['Wenn wir zusammenarbeiten, bekommen Sie Umfang, Erfolgskriterien und Schätzung, bevor die Arbeit beginnt.'],
      ],
    },
  ],
};

export const ticket: TicketProps = {
  folio: 'Nächster Schritt',
  title: 'Beginnen Sie mit einem kostenlosen Erstgespräch.',
  lede: 'Dreißig Minuten über Ihr Unternehmen, mit Ideen, die Sie in jedem Fall nutzen können.',
  ticket: { content: ticketContent, href: href('talk', L), tilt: 2 },
};
