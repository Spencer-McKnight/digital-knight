import Image from 'next/image';
import { Button } from '@/components/Button';
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
      <div className={styles.inner}>
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
              I'm an independent strategist, designer, and engineer building
              long-term digital partnerships from Melbourne.
            </p>
            <p className={styles.copy}>
              With a decade of experience across startups, scale-ups, and
              enterprise, I've learned that the best work comes from genuine
              collaboration — not handoffs. That's why Digital Knight is a
              one-desk studio: you work directly with me from first sketch to
              final deploy.
            </p>
            <p className={styles.copy}>
              I believe in clarity over complexity, restraint over feature-creep,
              and building things that last. If you're looking for a partner who
              cares as much about your business as you do, let's talk.
            </p>
          </div>

          <div className={styles.actions}>
            <Button href="/#talk" variant="secondary" size="md">
              Let's talk
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
