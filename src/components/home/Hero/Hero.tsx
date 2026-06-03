import { Button } from '@/components/Button';
import { Reveal } from '@/components/Reveal';
import styles from './Hero.module.scss';

export function Hero() {
  return (
    <section
      id="top"
      data-ground="page"
      className={styles.root}
      aria-labelledby="hero-title"
    >
      <Reveal as="div" className={styles.inner} enabled fadeOnly>
        <p className={styles.eyebrow}>Digital Knight</p>

        <h1 id="hero-title" className={styles.title}>
          Create tactical digital systems
          <br />
          that solve and evolve.
        </h1>

        <p className={styles.lede}>
          Modernise your greatest successes.
          <br />
          I guarantee to deliver innovation.
        </p>

        <div className={styles.actions}>
          <Button href="/contact" variant="secondary" size="md">
            Start a project
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
