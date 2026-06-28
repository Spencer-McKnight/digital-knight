import { Reveal } from '@/components/Reveal';
import { ContactForm } from '../ContactForm/ContactForm';
import styles from './ContactSection.module.scss';

type ContactSectionProps = {
  hostEmail: string;
};

export function ContactSection({ hostEmail }: ContactSectionProps) {
  return (
    <section className={styles.root} data-ground="page" aria-label="Contact">
      <Reveal as="div" className={styles.inner} enabled immediate fadeOnly>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Contact</span>

          <h1 className={styles.headline}>
            Introduce yourself for a{` `}
            <em className={styles.ember}>free digital consult.</em>
            {` `}
          </h1>

          <p className={styles.lede}>
            The first step to digital evolution is to talk to an expert. You provide context, we
            explore fresh ideas.
          </p>
        </div>

        <div className={styles.form}>
          <ContactForm hostEmail={hostEmail} />
        </div>
      </Reveal>
    </section>
  );
}
