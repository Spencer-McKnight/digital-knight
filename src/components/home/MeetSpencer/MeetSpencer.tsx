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
      <Reveal as="div" className={styles.inner}>
        <div className={styles.imageColumn}>
          <figure className={styles.figure}>
            <Image
              src="/images/me-smiling-graphic.avif"
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
            <p className={styles.eyebrow}>The builder</p>
            <h2 id="meet-heading" className={styles.heading}>
              Meet <span className={styles.ember}>Spencer</span>
            </h2>
          </header>

          <div className={styles.body}>
            <p className={styles.lede}>
              I have created hundreds of captivating user experiences that are loved by clients and developers alike.
            </p>
            <p className={styles.copy}>
              After graduating with a Bachelor of Business Information Technology (Computer Science), I upskilled for five years in Australian digital agencies as a full stack developer.
              At Inlight, I helped create award winning work for clients like AHM, Nando's, Chadstone, UrbanRest and more.
            </p>
            <p className={styles.copy}>
              My skills expanded holistically; now I'm able to personally deliver comprehensive projects like the{' '}
              <a href="https://sogif.au" className={styles.link} target="_blank" rel="noreferrer">
                sogif.au
              </a>{' '}
              website.
              I'm bringing my personality, experience and intelligence to the digital space, to see what mark I can make.
            </p>
          </div>

          <div className={styles.actions}>
            <Button href="/#talk" variant="secondary" size="md">
              Let's talk
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
