import Image from 'next/image';
import { Button } from '@/components/Button';
import { Reveal } from '@/components/Reveal';
import styles from './MeetSpencer.module.scss';

/**
 * MeetSpencer — a content image block (`design.md` §9: Act).
 *
 *   Stone ground, alternates from the preceding Page section. Features a
 *   portrait image with description copy and a CTA. The image enters with
 *   the duotone treatment and resolves to full color per §10.
 *
 *   Accessibility:
 *   - Meaningful alt text on the portrait
 *   - Semantic heading hierarchy (h2 for section)
 *   - 44px+ touch target on CTA
 *   - Focus ring via Button component
 */
export function MeetSpencer() {
  return (
    <section
      id="meet"
      data-ground="stone"
      className={styles.root}
      aria-labelledby="meet-heading"
    >
      <Reveal as="div" className={styles.inner} amount="md" enabled>
        <div className={styles.imageColumn}>
          <figure className={styles.figure}>
            <Image
              src="/images/website-developer.avif"
              alt="Spencer McKnight, founder of Digital Knight"
              width={560}
              height={560}
              className={styles.image}
              priority={false}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </figure>
        </div>

        <div className={styles.contentColumn}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>The founder</p>
            <h2 id="meet-heading" className={styles.heading}>
              Meet <span className={styles.ember}>Spencer</span>
            </h2>
          </header>

          <div className={styles.body}>
            <p className={styles.lede}>
              I have created hundreds of captivating digital experiences that are loved by businesses and developers.
            </p>
            <p className={styles.copy}>
              Intelligently driven by a desire to innovate and think efficiently.
              A loyal and strategic <em className={styles.italic}>Digital Knight</em>, I've lived and witnessed your efforts to evolve your digital capabilities.
            </p>
            <p className={styles.copy}>
              I'm not just a pretty website; I will reduce the mental load in your life with bleeding edge technology, allowing your vision the time it needs to shine.
            </p>
            <p className={styles.copy}>
            Formally qualified with a Bachelor of Business Information Technology (Professional) and years in the industry.
              My knowledge was formed writing code for websites and mobile applications, and naturally grew into a wider understanding of digital success.
            </p>
          </div>

          <div className={styles.actions}>
            <Button href="/contact" variant="secondary" size="md">
              Let's talk
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
