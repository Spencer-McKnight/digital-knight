import { Button } from '@/components/Button';
import { Reveal } from '@/components/Reveal';
import { ForgeSealLazy } from './ForgeSealLazy';
import styles from './Hero.module.scss';

export function Hero() {
  return (
    <section
      id="top"
      data-ground="page"
      className={styles.root}
      aria-labelledby="hero-title"
    >
      <div className={styles.ground}>
        <ForgeSealLazy />
      </div>

      <Reveal as="div" className={styles.grid} enabled fadeOnly>
        <h1 id="hero-title" className={styles.title}>
          Digital Knight
        </h1>

        <p className={styles.lede}>
          Champion your business goals
          <br />
          Secure your digital future
          <br />
          Win customers with your website
        </p>

        <div className={styles.actions}>
          <Button href="/#talk" variant="secondary" size="md">
            Free Strategy Consult
          </Button>
        </div>
      </Reveal>

    </section>
  );
}
