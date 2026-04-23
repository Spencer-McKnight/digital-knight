import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

/**
 * BookingConfirmation — React Email template.
 *
 *   Intentionally minimal for v1 — brand ink palette, one ember hairline, no
 *   imagery. A later pass will layer structured content (agenda, joining
 *   link, host bio). The contract today is: an unambiguous confirmation that
 *   renders correctly in Apple Mail, Gmail, and Outlook web.
 *
 *   All copy and dates arrive pre-rendered from the server action — the
 *   template itself does no timezone math, so previewing this file in
 *   `react-email dev` gives an exact WYSIWYG of what the visitor receives.
 */

export type BookingConfirmationProps = {
  name: string;
  /** e.g. "Wed 29 Apr 2026 · 10:30 AM" */
  whenVisitor: string;
  /** e.g. "10:30–11:00 Australia/Melbourne" */
  whenBusiness: string;
  /** Visitor's resolved IANA timezone, shown in small print. */
  visitorTimezone: string;
  hostEmail: string;
};

// Inline styles only — React Email has limited CSS support across clients.
// Hex values match the design tokens at compile time.
const INK_PAGE = '#FFEDD7';
const INK_IRON = '#1B1B1A';
const INK_STONE = '#403D39';
const INK_EMBER = '#DD6637';

export default function BookingConfirmation(props: BookingConfirmationProps) {
  const { name, whenVisitor, whenBusiness, visitorTimezone, hostEmail } = props;

  return (
    <Html>
      <Head />
      <Preview>Your Digital Knight strategy call is confirmed.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={eyebrow}>DIGITAL KNIGHT · CONFIRMED</Text>

          <Text style={title}>The call is booked.</Text>
          <Hr style={emberRule} />

          <Text style={lede}>
            Thanks, {name}. Here&apos;s what&apos;s on the calendar.
          </Text>

          <Section style={details}>
            <Text style={detailsLabel}>WHEN (YOUR TIME)</Text>
            <Text style={detailsValue}>{whenVisitor}</Text>

            <Text style={detailsLabel}>BUSINESS HOURS</Text>
            <Text style={detailsValue}>{whenBusiness}</Text>

            <Text style={detailsLabel}>DURATION</Text>
            <Text style={detailsValue}>30 minutes</Text>
          </Section>

          <Hr style={rule} />

          <Text style={body1}>
            A <strong>.ics</strong> file is attached — it&apos;ll add the meeting to
            Apple Calendar, Google Calendar, or Outlook in one tap.
          </Text>

          <Text style={body1}>
            Before the call, have a think about your project goals, any pain
            points, and what you want to ask about digital. That&apos;s all —
            no prep forms.
          </Text>

          <Hr style={rule} />

          <Text style={small}>
            Shown in your time ({visitorTimezone}). Need to change it?{' '}
            Reply to this email, or reach me at{' '}
            <a href={`mailto:${hostEmail}`} style={link}>
              {hostEmail}
            </a>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: INK_STONE,
  color: INK_PAGE,
  fontFamily:
    "'Aeonik', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: '40px 16px',
};

const container: React.CSSProperties = {
  backgroundColor: INK_PAGE,
  color: INK_IRON,
  maxWidth: '560px',
  margin: '0 auto',
  padding: '48px 40px',
};

const eyebrow: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: INK_IRON,
  margin: 0,
  fontWeight: 500,
};

const title: React.CSSProperties = {
  fontSize: '32px',
  lineHeight: 1,
  letterSpacing: '-0.02em',
  color: INK_IRON,
  margin: '20px 0 16px',
  fontWeight: 500,
};

const emberRule: React.CSSProperties = {
  border: 0,
  borderTop: `1px solid ${INK_EMBER}`,
  margin: '0 0 24px',
  width: '64px',
};

const lede: React.CSSProperties = {
  fontSize: '17px',
  lineHeight: 1.5,
  margin: '0 0 32px',
};

const details: React.CSSProperties = {
  padding: '20px 0',
};

const detailsLabel: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: INK_STONE,
  margin: '12px 0 4px',
  fontWeight: 500,
};

const detailsValue: React.CSSProperties = {
  fontSize: '16px',
  color: INK_IRON,
  margin: 0,
  fontWeight: 500,
};

const rule: React.CSSProperties = {
  border: 0,
  borderTop: `1px solid rgba(27,27,26,0.12)`,
  margin: '28px 0',
};

const body1: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: 1.55,
  margin: '0 0 16px',
};

const small: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.5,
  color: INK_STONE,
  margin: 0,
};

const link: React.CSSProperties = {
  color: INK_EMBER,
  textDecoration: 'none',
  fontWeight: 500,
};
