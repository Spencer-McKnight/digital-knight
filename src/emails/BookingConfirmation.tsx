import { Body, Container, Head, Hr, Html, Link, Preview, Section, Text } from '@react-email/components';
import {
  MEETING_DIAL_IN_COUNTRY,
  MEETING_DIAL_IN_NUMBER,
  MEETING_LOCATION_LABEL,
  MEETING_LOCATION_URL,
  MEETING_PIN,
} from '@/lib/booking/config';
import { e } from './palette';

/**
 * The booking confirmation, in the visitor's market language. Times arrive
 * pre-formatted from the server action; the template does no time-zone maths,
 * so the preview is exactly what the visitor receives.
 */

export type BookingConfirmationProps = {
  locale?: 'en-AU' | 'de-DE';
  name: string;
  /** In the visitor's zone. */
  whenVisitor: string;
  /** In Melbourne time. */
  whenBusiness: string;
  visitorTimezone: string;
  hostEmail: string;
};

const COPY = {
  'en-AU': {
    preview: 'Your call with Digital Knight is booked.',
    title: 'The call is booked.',
    lede: (name: string) => `Thanks, ${name}. The details are below, and the attached calendar file carries the link.`,
    whenYours: 'When, your time',
    whenMelbourne: 'Melbourne time',
    length: 'Length',
    lengthValue: '30 minutes',
    join: 'Join on Google Meet',
    dialIn: `Dial in (${MEETING_DIAL_IN_COUNTRY})`,
    pin: 'PIN',
    ics: 'The attached .ics file adds the call to Apple Calendar, Google Calendar or Outlook, with the link and dial-in.',
    prepare: 'If you want to prepare, three things are worth a thought:',
    points: [
      'What your website does for the business today, and what you wish it did.',
      'Anything you or your team do by hand that feels like it should be automatic.',
      'Where you want the business to be in a year.',
    ],
    noObligation: 'There is no obligation either way.',
    footer: (tz: string) => `Times shown in your zone (${tz}). To move the call, reply to this email or write to`,
  },
  'de-DE': {
    preview: 'Ihr Erstgespräch mit Digital Knight ist gebucht.',
    title: 'Das Gespräch ist gebucht.',
    lede: (name: string) => `Vielen Dank, ${name}. Die Details stehen unten, die angehängte Kalenderdatei enthält den Link.`,
    whenYours: 'Wann, Ihre Zeit',
    whenMelbourne: 'Zeit in Melbourne',
    length: 'Dauer',
    lengthValue: '30 Minuten',
    join: 'Über Google Meet teilnehmen',
    dialIn: `Einwahl (${MEETING_DIAL_IN_COUNTRY})`,
    pin: 'PIN',
    ics: 'Die angehängte .ics-Datei trägt das Gespräch mit Link und Einwahl in Apple Kalender, Google Kalender oder Outlook ein.',
    prepare: 'Wenn Sie sich vorbereiten möchten, lohnen sich drei Fragen:',
    points: [
      'Was Ihre Website heute für das Unternehmen leistet, und was sie leisten sollte.',
      'Was Sie oder Ihr Team von Hand erledigen, obwohl es automatisch laufen könnte.',
      'Wo Ihr Unternehmen in einem Jahr stehen soll.',
    ],
    noObligation: 'Das Gespräch ist unverbindlich.',
    footer: (tz: string) => `Zeiten in Ihrer Zeitzone (${tz}). Um den Termin zu verschieben, antworten Sie auf diese E-Mail oder schreiben Sie an`,
  },
} as const;

export default function BookingConfirmation({
  locale = 'en-AU',
  name,
  whenVisitor,
  whenBusiness,
  visitorTimezone,
  hostEmail,
}: BookingConfirmationProps) {
  const t = COPY[locale];
  return (
    <Html lang={locale}>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={e.body}>
        <Container style={e.container}>
          <Text style={e.wordmark}>Digital Knight</Text>
          <Text style={e.title}>{t.title}</Text>
          <Section style={e.signal} />
          <Text style={e.lede}>{t.lede(name)}</Text>

          <Section>
            <Text style={e.label}>{t.whenYours}</Text>
            <Text style={e.value}>{whenVisitor}</Text>
            <Text style={e.label}>{t.whenMelbourne}</Text>
            <Text style={e.value}>{whenBusiness}</Text>
            <Text style={e.label}>{t.length}</Text>
            <Text style={e.value}>{t.lengthValue}</Text>
          </Section>

          <Hr style={e.rule} />

          <Section>
            <Text style={e.label}>{t.join}</Text>
            <Text style={e.value}>
              <Link href={MEETING_LOCATION_URL} style={e.link}>
                {MEETING_LOCATION_LABEL}
              </Link>
            </Text>
            <Text style={e.label}>{t.dialIn}</Text>
            <Text style={e.value}>{MEETING_DIAL_IN_NUMBER}</Text>
            <Text style={e.label}>{t.pin}</Text>
            <Text style={e.value}>{MEETING_PIN}</Text>
          </Section>

          <Hr style={e.rule} />

          <Text style={e.text}>{t.ics}</Text>
          <Text style={e.text}>{t.prepare}</Text>
          {t.points.map((p) => (
            <Text key={p} style={{ ...e.text, margin: '0 0 6px', paddingLeft: '14px' }}>
              {p}
            </Text>
          ))}
          <Text style={{ ...e.text, marginTop: '14px' }}>{t.noObligation}</Text>

          <Hr style={e.rule} />

          <Text style={e.small}>
            {t.footer(visitorTimezone)}{' '}
            <Link href={`mailto:${hostEmail}`} style={e.link}>
              {hostEmail}
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
