import { Reveal } from '@/components/Reveal';
import { ContactForm } from '../ContactForm/ContactForm';
import styles from './ContactSection.module.scss';

type ContactSectionProps = {
  hostEmail: string;
};

export function ContactSection({ hostEmail }: ContactSectionProps) {
  return (
    <section className={styles.root} data-ground="page" aria-label="Contact">
      <Reveal as="div" className={styles.inner} fadeOnly enabled>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Contact</span>

          <h1 className={styles.headline}>
            Let&rsquo;s Build Something That{' '}
            <em className={styles.ember}>Matters</em>
          </h1>

          <p className={styles.lede}>
            You have important work to do. Let&rsquo;s create the
            digital experience that helps you do it better.
          </p>
        </div>

        <div className={styles.form}>
          <ContactForm hostEmail={hostEmail} />
        </div>
      </Reveal>
    </section>
  );
}
