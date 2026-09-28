import type { DocumentProps } from '@/blocks/Document/Document';
import { cityLine, legal } from '../legal';
import { href } from '../routes';

export const privacyMeta = {
  title: 'Datenschutzerklärung',
  description: 'Wie Digital Knight personenbezogene Daten verarbeitet: was, warum, wie lange, und welche Rechte Sie haben.',
};

export const imprintMeta = {
  title: 'Impressum',
  description: 'Angaben gemäß § 5 DDG für Digital Knight.',
};

const r = legal.retention;

export const privacy: DocumentProps = {
  folio: 'Rechtliches',
  title: 'Datenschutzerklärung',
  updated: `Stand: ${legal.updated['de-DE']}`,
  sections: [
    {
      heading: 'Verantwortlicher',
      blocks: [
        { type: 'p', text: ['Verantwortlich für die Verarbeitung Ihrer personenbezogenen Daten ist:'] },
        {
          type: 'lines',
          lines: [
            `${legal.controller}, handelnd als ${legal.tradingName}`,
            legal.address.street,
            cityLine(),
            'Australien',
            legal.email,
          ],
        },
      ],
    },
    {
      heading: 'Was verarbeitet wird, wozu und wie lange',
      blocks: [
        {
          type: 'table',
          head: ['Verarbeitung', 'Daten', 'Zweck', 'Rechtsgrundlage', 'Speicherdauer'],
          rows: [
            ['Hosting und Server-Logs (Vercel)', 'IP-Adresse, Browser, Zeitpunkt, aufgerufene Seite', 'Auslieferung und Sicherheit der Website', 'Art. 6 Abs. 1 lit. f DSGVO, berechtigtes Interesse', r.serverLogs],
            ['Terminbuchung (Supabase, Resend)', 'Name, E-Mail, gewählter Termin, Zeitzone', 'Termin vereinbaren und bestätigen', 'Art. 6 Abs. 1 lit. b DSGVO, vorvertragliche Maßnahmen', r.bookings],
            ['Kontaktanfrage (Resend)', 'Name, E-Mail, Nachricht', 'Ihre Anfrage beantworten', 'Art. 6 Abs. 1 lit. b DSGVO', r.enquiries],
            ['Schutz der Formulare', 'Verweildauer im Formular, ein verstecktes Feld, E-Mail-Domain', 'Spam abwehren', 'Art. 6 Abs. 1 lit. f DSGVO', 'Keine Speicherung über die Anfrage hinaus'],
            ['Vercel Web Analytics', 'Aufgerufene Seiten, Referrer, Gerätetyp, Land. Keine Cookies.', 'Die Website verbessern', 'Art. 6 Abs. 1 lit. f DSGVO', r.analytics],
            ['Google Analytics (nur englische Seiten)', 'Cookie-Kennungen und Nutzungsdaten', 'Nutzung der Website messen', 'Art. 6 Abs. 1 lit. a DSGVO, Einwilligung; § 25 TDDDG', r.googleAnalytics],
          ],
        },
        {
          type: 'p',
          text: ['Buchungen werden in Supabase gespeichert. Nachrichten werden per E-Mail über Resend zugestellt und nicht in einer Datenbank gespeichert.'],
        },
      ],
    },
    {
      heading: 'Empfänger und Übermittlung in Drittländer',
      blocks: [
        {
          type: 'p',
          text: [
            'Vercel (Hosting und Analyse), Supabase (Buchungsdatenbank), Resend (E-Mail) und Google (Analyse auf den englischen Seiten) verarbeiten Daten in meinem Auftrag auf Grundlage von Auftragsverarbeitungsverträgen. Übermittlungen außerhalb der EU erfolgen auf Grundlage des EU-US Data Privacy Framework oder von Standardvertragsklauseln.',
          ],
        },
        {
          type: 'p',
          text: [
            'Der Verantwortliche sitzt in Australien. Für Australien gibt es keinen Angemessenheitsbeschluss der Europäischen Kommission. Daten, die Sie senden, gelangen also in ein Land ohne einen solchen Beschluss.',
          ],
        },
        ...(legal.supabaseRegion
          ? [{ type: 'p' as const, text: [`Die Buchungsdatenbank wird in ${legal.supabaseRegion} betrieben.`] }]
          : []),
      ],
    },
    {
      heading: 'Cookies',
      blocks: [
        {
          type: 'p',
          text: [
            'Die deutschen Seiten setzen keine Cookies. Nur Google Analytics setzt Cookies, und zwar ausschließlich auf den englischen Seiten. Sie können Cookies in Ihrem Browser jederzeit blockieren oder löschen.',
          ],
        },
      ],
    },
    {
      heading: 'Ihre Rechte',
      blocks: [
        {
          type: 'list',
          items: [
            ['Auskunft über die zu Ihnen gespeicherten Daten (Art. 15 DSGVO)'],
            ['Berichtigung unrichtiger Daten (Art. 16 DSGVO)'],
            ['Löschung (Art. 17 DSGVO)'],
            ['Einschränkung der Verarbeitung (Art. 18 DSGVO)'],
            ['Datenübertragbarkeit (Art. 20 DSGVO)'],
            ['Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO)'],
            ['Widerruf einer Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)'],
            ['Beschwerde bei einer Datenschutz-Aufsichtsbehörde (Art. 77 DSGVO)'],
          ],
        },
        {
          type: 'p',
          text: ['Um eines dieser Rechte auszuüben, schreiben Sie an ', { text: legal.email, href: `mailto:${legal.email}` }, '.'],
        },
      ],
    },
    {
      heading: 'Weitere Hinweise',
      blocks: [
        {
          type: 'list',
          items: [
            ['Die Angabe von Daten ist freiwillig. Ohne Name und E-Mail kann jedoch kein Termin gebucht werden.'],
            ['Es findet keine automatisierte Entscheidungsfindung und kein Profiling statt.'],
            ['Schriften werden von dieser Website geladen; es gibt keine Anfrage an Google.'],
            ['Es gibt keine eingebetteten Inhalte Dritter wie Karten oder Videos.'],
          ],
        },
      ],
    },
  ],
};

export const imprint: DocumentProps = {
  folio: 'Rechtliches',
  title: 'Impressum',
  sections: [
    {
      heading: 'Angaben gemäß § 5 DDG',
      blocks: [
        {
          type: 'lines',
          lines: [legal.controller, legal.tradingName, legal.address.street, cityLine(), legal.address.street ? 'Australien' : null],
        },
      ],
    },
    {
      heading: 'Kontakt',
      blocks: [
        {
          type: 'p',
          text: ['E-Mail: ', { text: legal.email, href: `mailto:${legal.email}` }],
        },
        {
          type: 'p',
          text: ['Kontaktformular: ', { text: 'digital-knight.au/de/kontakt', href: href('contact', 'de-DE') }],
        },
        ...(legal.phone ? [{ type: 'p' as const, text: [`Telefon: ${legal.phone}`] }] : []),
      ],
    },
    {
      blocks: legal.abn ? [{ type: 'p', text: [`ABN: ${legal.abn}`] }] : [],
    },
    {
      heading: 'Verbraucherstreitbeilegung',
      blocks: [
        {
          type: 'p',
          text: ['Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'],
        },
      ],
    },
  ],
};
