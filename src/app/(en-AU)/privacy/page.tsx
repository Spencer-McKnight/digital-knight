import type { Metadata } from 'next';
import styles from './privacy.module.scss';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Digital Knight collects, uses, and protects your personal information under Australian privacy law.',
  alternates: { canonical: '/privacy' },
  robots: { index: false, follow: false },
};

const LAST_UPDATED = '28 June 2026';

export default function PrivacyPage() {
  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Legal</p>
          <h1 className={styles.heading}>Privacy Policy</h1>
          <p className={styles.updated}>Last updated {LAST_UPDATED}</p>
        </header>

        <div className={styles.content}>
          <section>
            <h2>Who we are</h2>
            <p>
              Digital Knight operates the website digital-knight.au and provides digital strategy,
              web development, and AI consulting services. In this policy, “we”, “us” and “our”
              refer to Digital Knight.
            </p>
          </section>

          <section>
            <h2>What personal information we collect</h2>
            <p>We may collect the following when you interact with us:</p>
            <ul>
              <li>
                <strong>Contact details</strong> — name, email address, phone number, and any
                message content you provide through our contact or booking forms.
              </li>
              <li>
                <strong>Booking information</strong> — preferred date, time, and meeting details
                when you schedule a consultation.
              </li>
              <li>
                <strong>Usage data</strong> — anonymised analytics such as pages visited, referral
                source, browser type, and device. This data is collected via Google Analytics and
                Vercel Analytics and does not personally identify you.
              </li>
            </ul>
          </section>

          <section>
            <h2>How we collect information</h2>
            <p>We collect personal information when you:</p>
            <ul>
              <li>Submit a contact or booking form on our website.</li>
              <li>Send us an email directly.</li>
              <li>
                Browse our website (anonymised usage data only, via cookies and similar
                technologies).
              </li>
            </ul>
          </section>

          <section>
            <h2>Why we collect it</h2>
            <p>We use your personal information to:</p>
            <ul>
              <li>Respond to your enquiry or confirm a booking.</li>
              <li>Deliver the services you have engaged us for.</li>
              <li>
                Improve our website and understand how visitors use it (via anonymised analytics).
              </li>
              <li>Meet our legal obligations under Australian law.</li>
            </ul>
            <p>
              We will not use your personal information for direct marketing unless you have given
              us explicit consent, and you may withdraw that consent at any time.
            </p>
          </section>

          <section>
            <h2>How we store and protect it</h2>
            <p>
              Your data is stored securely using industry-standard measures. Form submissions are
              processed via Resend (email delivery) and may be stored in Supabase (database). Both
              services use encryption in transit and at rest. We retain your information only for as
              long as necessary to fulfil the purpose for which it was collected, or as required by
              law.
            </p>
          </section>

          <section>
            <h2>Sharing your information</h2>
            <p>
              We do not sell or rent your personal information. We may share it with trusted
              third-party service providers solely to operate our website and deliver our services:
            </p>
            <ul>
              <li>
                <strong>Resend</strong> — transactional email delivery.
              </li>
              <li>
                <strong>Supabase</strong> — database hosting.
              </li>
              <li>
                <strong>Google Analytics</strong> — anonymised website analytics.
              </li>
              <li>
                <strong>Vercel</strong> — website hosting and analytics.
              </li>
            </ul>
            <p>
              Some of these providers may store data outside Australia. Where this occurs, we take
              reasonable steps to ensure your information is treated in accordance with the
              Australian Privacy Principles.
            </p>
          </section>

          <section>
            <h2>Cookies</h2>
            <p>
              Our website uses cookies and similar technologies for analytics purposes. You can
              control or disable cookies through your browser settings. Disabling cookies will not
              affect the core functionality of our website.
            </p>
          </section>

          <section>
            <h2>Your rights</h2>
            <p>
              Under the Privacy Act 1988 (Cth) and the Australian Privacy Principles, you have the
              right to:
            </p>
            <ul>
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate or outdated information.</li>
              <li>
                Request deletion of your personal information, subject to any legal obligations we
                may have to retain it.
              </li>
              <li>Withdraw consent for any processing based on consent.</li>
            </ul>
            <p>To exercise any of these rights, contact us using the details below.</p>
          </section>

          <section>
            <h2>Complaints</h2>
            <p>
              If you believe we have breached the Australian Privacy Principles, please contact us
              first so we can try to resolve the issue. If you are not satisfied with our response,
              you may lodge a complaint with the Office of the Australian Information Commissioner
              (OAIC) at{' '}
              <a href="https://www.oaic.gov.au" target="_blank" rel="noreferrer">
                oaic.gov.au
              </a>
              .
            </p>
          </section>

          <section>
            <h2>Changes to this policy</h2>
            <p>
              We may update this policy from time to time. Any changes will be posted on this page
              with an updated revision date. We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              If you have any questions about this privacy policy or how we handle your personal
              information, please contact us:
            </p>
            <ul>
              <li>
                Email: <a href="mailto:hello@digital-knight.au">hello@digital-knight.au</a>
              </li>
              <li>Location: Melbourne, Australia</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
