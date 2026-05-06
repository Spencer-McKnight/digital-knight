import { ContactForm } from '../ContactForm/ContactForm';
import styles from './ContactSection.module.scss';

export function ContactSection() {
  return (
    <section className={styles.root} data-ground="page" aria-label="Contact">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Contact</span>

          <h1 className={styles.headline}>
            Let&rsquo;s Build Something That{' '}
            <em className={styles.ember}>Matters</em>
          </h1>

          <p className={styles.lede}>
            You have important work to do. Let&rsquo;s create the
            website that helps you do it better.
          </p>
        </div>

        <div className={styles.form}>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
