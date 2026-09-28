import { Body, Container, Head, Hr, Html, Link, Preview, Section, Text } from '@react-email/components';
import { e } from './palette';

/**
 * A new enquiry, sent to Spencer. It names the market so the reply goes out
 * in the visitor's language.
 */

export type ContactNotificationProps = {
  name: string;
  email: string;
  message: string;
  locale?: 'en-AU' | 'de-DE';
};

export default function ContactNotification({ name, email, message, locale = 'en-AU' }: ContactNotificationProps) {
  const german = locale === 'de-DE';
  return (
    <Html lang="en">
      <Head />
      <Preview>New enquiry from {name}</Preview>
      <Body style={e.body}>
        <Container style={e.container}>
          <Text style={e.wordmark}>Digital Knight</Text>
          <Text style={e.title}>New enquiry.</Text>
          <Section style={e.signal} />

          <Section>
            <Text style={e.label}>From</Text>
            <Text style={e.value}>{name}</Text>
            <Text style={e.label}>Email</Text>
            <Text style={e.value}>
              <Link href={`mailto:${email}`} style={e.link}>
                {email}
              </Link>
            </Text>
            <Text style={e.label}>Market</Text>
            <Text style={e.value}>{german ? 'Germany (de-DE). Reply in German.' : 'Australia (en-AU)'}</Text>
          </Section>

          <Hr style={e.rule} />

          <Section>
            <Text style={e.label}>Message</Text>
            <Text style={{ ...e.text, whiteSpace: 'pre-wrap' }}>{message}</Text>
          </Section>

          <Hr style={e.rule} />

          <Text style={e.small}>Reply to this email to answer {name} directly.</Text>
        </Container>
      </Body>
    </Html>
  );
}
