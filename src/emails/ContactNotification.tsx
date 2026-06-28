import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
export type ContactNotificationProps = {
  name: string;
  email: string;
  message: string;
};

const INK_PAGE = '#FFEDD7';
const INK_IRON = '#1B1B1A';
const INK_STONE = '#403D39';
const INK_EMBER = '#DD6637';

const SERIF_STACK = "'Reforma 1969', Georgia, 'Times New Roman', serif";
const SANS_STACK =
  "'Plus Jakarta Sans', system-ui, 'Helvetica Neue', Arial, sans-serif";

export default function ContactNotification(props: ContactNotificationProps) {
  const { name, email, message } = props;

  return (
    <Html>
      <Head />
      <Preview>New enquiry from {name}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={eyebrow}>DIGITAL KNIGHT · ENQUIRY</Text>

          <Text style={title}>New message received.</Text>
          <Hr style={emberRule} />

          <Section style={details}>
            <Text style={detailsLabel}>FROM</Text>
            <Text style={detailsValue}>{name}</Text>

            <Text style={detailsLabel}>EMAIL</Text>
            <Text style={detailsValue}>
              <Link href={`mailto:${email}`} style={link}>
                {email}
              </Link>
            </Text>

          </Section>

          <Hr style={rule} />

          <Section style={details}>
            <Text style={detailsLabel}>MESSAGE</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={rule} />

          <Text style={small}>
            Reply directly to this email to respond to {name}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: INK_STONE,
  color: INK_PAGE,
  fontFamily: SANS_STACK,
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
  fontFamily: SERIF_STACK,
};

const emberRule: React.CSSProperties = {
  border: 0,
  borderTop: `1px solid ${INK_EMBER}`,
  margin: '0 0 24px',
  width: '64px',
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
  borderTop: '1px solid rgba(27,27,26,0.12)',
  margin: '28px 0',
};

const messageText: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: 1.55,
  margin: '0 0 16px',
  whiteSpace: 'pre-wrap',
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
