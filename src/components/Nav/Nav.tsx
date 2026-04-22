'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useLoadGate } from '@/hooks/useLoadGate';
import styles from './Nav.module.scss';

type NavLink = { label: string; href: string; section?: string };

const LINKS: ReadonlyArray<NavLink> = [
  { label: 'Services', href: '/#services', section: 'services' },
  { label: 'Tech', href: '/#tech', section: 'tech' },
  { label: 'Method', href: '/method' },
  { label: 'Talk', href: '/#talk', section: 'talk' },
];

/**
 * Navigation (`design.md` §8).
 *
 *   Top-left wordmark, top-right links in meta type. Transparent over Page;
 *   hairline over Stone. Shrinks on scroll-down, restores on scroll-up. An
 *   ember hairline marks the active section.
 *
 *  • Appears when `loadingComplete` flips — the perceived handoff from the
 *    centred loader wordmark to the top-left nav position.
 *  • Scroll direction drives `data-shrunk`. The threshold is intentionally
 *    forgiving so tiny taps on a trackpad don't flicker the bar.
 *  • Active section is inferred from IntersectionObserver on home anchors;
 *    interior pages simply route.
 */
export function Nav() {
  const loaded = useLoadGate();
  const [shrunk, setShrunk] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const lastY = useRef(0);

  useEffect(() => {
    const SHRINK_THRESHOLD = 48;

    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;
      lastY.current = y;
      if (y < SHRINK_THRESHOLD) setShrunk(false);
      else if (goingDown) setShrunk(true);
      else setShrunk(false);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((l) => l.section).filter(Boolean) as string[];
    const targets = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most-visible entry that's also above the midline.
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0.25, 0.5, 0.75] },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={styles.root}
      data-loaded={loaded}
      data-shrunk={shrunk}
      aria-label="Primary"
    >
      <Link href="/" className={styles.wordmark} aria-label="Digital Knight — home">
        <span className={styles.word}>DIGITAL KNIGHT</span>
        <span className={styles.mark} aria-hidden>
          DK
        </span>
      </Link>

      <ul className={styles.links}>
        {LINKS.map((link) => {
          const isActive = link.section ? active === link.section : false;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={styles.link}
                data-active={isActive || undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <span className={styles.hairline} aria-hidden />
    </nav>
  );
}
