'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useLoadGate } from '@/hooks/useLoadGate';
import styles from './Nav.module.scss';

type NavLink = { label: string; href: string; section?: string };

const LINKS: ReadonlyArray<NavLink> = [
  { label: 'Talk', href: '/#talk', section: 'talk' },
  { label: 'Services', href: '/#services', section: 'services' },
  { label: 'Tech', href: '/#tech', section: 'tech' },
  { label: 'Method', href: '/method' },
];

type Ground = 'page' | 'stone';

/**
 * Navigation (`design.md` §8).
 *
 *   Top-left wordmark, top-right links in meta type. A translucent glass
 *   surface (split-tinted to the ground beneath) + constant backdrop blur
 *   softens whatever passes beneath so UI elements never clip crisp glyphs.
 *
 *   Pixel-accurate split-inking
 *   ---------------------------
 *   As a Page→Stone (or Stone→Page) boundary sweeps up through the nav, each
 *   glyph's top half and bottom half can be simultaneously over different
 *   grounds. The nav therefore paints every text element with a vertical
 *   linear gradient clipped to the glyph shapes (`background-clip: text`):
 *
 *     above-boundary ink   0 … split
 *     below-boundary ink   split … 100%
 *
 *   The "split" for each text element is the boundary's viewport-Y minus the
 *   element's own top edge, in pixels, set as `--nav-split` inline. Ink
 *   colours on the nav root come from two CSS vars — `--ink-upper` and
 *   `--ink-lower` — which resolve through the design token layer based on
 *   `data-upper-ground` / `data-lower-ground` attributes. Components read
 *   tokens; tokens carry the ground, not the components (`design.md` §15).
 *
 *   When no boundary is in the nav, the split is pushed outside the text box
 *   so the gradient resolves to a single ink — the same machinery handles
 *   both cases without a branch.
 *
 *   Scroll-direction shrink, ground detection and split-Y are computed in a
 *   single rAF-throttled pass. Direct rect reads (rather than
 *   IntersectionObserver with a scan-line rootMargin) are used because we
 *   need the exact boundary Y every frame — observer entries are async and
 *   lag at high scroll velocities.
 */
export function Nav() {
  const loaded = useLoadGate();
  const navRef = useRef<HTMLElement>(null);
  const [shrunk, setShrunk] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const SHRINK_THRESHOLD = 48;
    let lastY = window.scrollY;
    let frame = 0;

    // Cache the list of elements participating in split-ink. They're static
    // across the component's lifetime, so we query once. The nav root itself
    // is included so the glass contrast fill (painted via `::before`) picks
    // up the same split as the text inside it.
    const paintTargets = [
      nav,
      ...Array.from(nav.querySelectorAll<HTMLElement>('[data-ink-split]')),
    ];

    const detect = () => {
      frame = 0;

      // 1) Shrink from scroll direction.
      const y = window.scrollY;
      const goingDown = y > lastY;
      lastY = y;
      if (y < SHRINK_THRESHOLD) setShrunk(false);
      else setShrunk(goingDown);

      // 2) Find a ground boundary that currently sweeps through the nav.
      //    A "boundary" is the top edge of a section that sits in document
      //    order after another section — i.e. the moment one ground hands
      //    off to the next. We walk sections in DOM order and pick the
      //    first whose top falls inside the nav's vertical band.
      const navRect = nav.getBoundingClientRect();
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-ground]'),
      );

      let upperGround: Ground = 'page';
      let lowerGround: Ground = 'page';
      // Default split is pushed below every text box so a single-ground nav
      // resolves the gradient to one colour (ink-upper).
      let splitViewportY = Number.POSITIVE_INFINITY;

      // Sort by current top to be resilient to layout surprises — normally
      // DOM order equals visual order, but we don't assume.
      const ordered = sections
        .map((el) => ({ el, top: el.getBoundingClientRect().top }))
        .sort((a, b) => a.top - b.top);

      for (let i = 0; i < ordered.length; i++) {
        const entry = ordered[i];
        if (!entry) continue;
        const { el, top } = entry;
        if (top > navRect.top - 0.5 && top < navRect.bottom + 0.5) {
          const incoming = groundOf(el);
          const prev = i > 0 ? ordered[i - 1] : undefined;
          const outgoing = prev ? groundOf(prev.el) : incoming;
          upperGround = outgoing;
          lowerGround = incoming;
          splitViewportY = top;
          break;
        }
      }

      if (!Number.isFinite(splitViewportY)) {
        // No boundary threading the nav — one ground owns the whole bar.
        const scanY = navRect.top + navRect.height / 2;
        let single: Ground = 'page';
        for (const { el } of ordered) {
          const r = el.getBoundingClientRect();
          if (r.top <= scanY && r.bottom > scanY) {
            single = groundOf(el);
            break;
          }
        }
        upperGround = single;
        lowerGround = single;
      }

      // 3) Apply upper/lower ground state at the nav root. CSS resolves
      //    these into `--ink-upper` / `--ink-lower` via the token layer.
      if (nav.dataset.upperGround !== upperGround) {
        nav.dataset.upperGround = upperGround;
      }
      if (nav.dataset.lowerGround !== lowerGround) {
        nav.dataset.lowerGround = lowerGround;
      }

      // 4) Write per-element split offsets. The element's local split is
      //    the boundary's viewport-Y minus its own top edge. Values outside
      //    the element's box are fine — the gradient clamps gracefully.
      for (const el of paintTargets) {
        const r = el.getBoundingClientRect();
        const local = Number.isFinite(splitViewportY)
          ? splitViewportY - r.top
          : r.height + 9999;
        el.style.setProperty('--nav-split', `${local}px`);
      }
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(detect);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
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
      ref={navRef}
      className={styles.root}
      data-loaded={loaded}
      data-shrunk={shrunk}
      aria-label="Primary"
    >
      <Link href="/" className={styles.wordmark} aria-label="Digital Knight — home">
        <span className={styles.word} data-ink-split>
          DIGITAL KNIGHT
        </span>
        <span className={styles.mark} data-ink-split aria-hidden>
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
                <span className={styles.linkLabel} data-ink-split>
                  {link.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <span className={styles.hairline} aria-hidden />
    </nav>
  );
}

function groundOf(el: HTMLElement): Ground {
  const g = el.dataset.ground;
  return g === 'stone' ? 'stone' : 'page';
}
