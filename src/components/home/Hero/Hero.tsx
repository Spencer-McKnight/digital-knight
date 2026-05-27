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
        <p className={styles.eyebrow}>New-generation digital</p>

        <h1 id="hero-title" className={styles.title}>
          Evolution for Websites
        </h1>

        <p className={styles.lede}>
          Technology accelerates weekly. Digital Knight builds  from the bleeding-edge with AI-boosted design prototypes and custom automation toolkits.
        </p>

        <div className={styles.actions}>
          <Button href="/contact" variant="secondary" size="md">
            Start a project
          </Button>
        </div>
        <div className={styles.portfolio} aria-label="Featured projects">
          {/* Portfolio cards — future addition */}
        </div>
      </Reveal>


    </section>
  );
}
