import { env } from '@/lib/env';
import { ContactSection } from '@/components/contact/ContactSection/ContactSection';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch to discuss your next project.',
};

export default function ContactPage() {
  return (
    <main>
      <ContactSection hostEmail={env.BOOKING_HOST_EMAIL} />
    </main>
  );
}
