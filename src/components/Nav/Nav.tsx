'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLoadGate } from '@/hooks/useLoadGate';
import { Button } from '@/components/Button';
import { SmoothLink } from '@/components/SmoothLink';
import styles from './Nav.module.scss';

const NAV_SCROLL_OFFSET = 0;
const SCROLL_SETTLE_DELAY = 150;

type NavLink = { label: string; href: string; section?: string };

const LINKS: ReadonlyArray<NavLink> = [
  { label: 'Talk', href: '/#talk', section: 'talk' },
  { label: 'Services', href: '/#services', section: 'services' },
  { label: 'About', href: '/#meet', section: 'meet' },
];

/** Hash fragment from a nav `href` — must match the target section `id` in the DOM. */
function sectionIdFromHref(href: string): string | null {
  const i = href.indexOf('#');
  if (i < 0) return null;
  const id = href.slice(i + 1).trim();
  return id.length > 0 ? id : null;
}

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
 *
 *   Mobile drawer
 *   -------------
 *   Below `sm`, the link row is replaced by a burger trigger that opens a
 *   full-viewport panel. The panel itself is rendered via `MobileMenu` —
 *   a sibling component that portals into `document.body`, escaping the
 *   nav's fixed/backdrop-filter stacking context so the overlay can occupy
 *   the entire viewport without clipping. The panel is always stone-themed
 *   (charcoal grey) regardless of the ground beneath the nav bar, so it
 *   reads consistently as an overlay surface rather than a continuation of
 *   the page.
 */
export function Nav() {
  const loaded = useLoadGate();
  const navRef = useRef<HTMLElement>(null);
  const [shrunk, setShrunk] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Track programmatic scroll to prevent observer flickering
  const scrollingToRef = useRef<string | null>(null);
  const scrollSettleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

      // 5) Scroll spy: which in-page block owns the band just under the nav.
      //    Re-query `getElementById` every frame so streamed sections (e.g.
      //    LetsTalk) are picked up as soon as they mount — unlike a one-shot
      //    IntersectionObserver list. `LINKS` order follows DOM order on `/`.
      if (!scrollingToRef.current) {
        const line = navRect.bottom + 6;
        let navActiveId: string | null = null;
        for (const link of LINKS) {
          const id = sectionIdFromHref(link.href) ?? link.section ?? null;
          if (!id) continue;
          const el = document.getElementById(id);
          if (!el) continue;
          const r = el.getBoundingClientRect();
          if (r.top <= line) navActiveId = id;
        }
        setActive((prev) => (prev === navActiveId ? prev : navActiveId));
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

  // Detect scroll end to clear the programmatic scroll lock
  useEffect(() => {
    const onScroll = () => {
      if (!scrollingToRef.current) return;
      
      if (scrollSettleTimer.current) {
        clearTimeout(scrollSettleTimer.current);
      }
      scrollSettleTimer.current = setTimeout(() => {
        scrollingToRef.current = null;
      }, SCROLL_SETTLE_DELAY);
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollSettleTimer.current) clearTimeout(scrollSettleTimer.current);
    };
  }, []);
  
  // Handle nav link clicks — immediately set active and lock observer
  const handleNavClick = useCallback((section: string | undefined) => {
    if (!section) return;
    scrollingToRef.current = section;
    setActive(section);
    // Clear any existing settle timer so we wait for new scroll to settle
    if (scrollSettleTimer.current) {
      clearTimeout(scrollSettleTimer.current);
      scrollSettleTimer.current = null;
    }
  }, []);

  // ── Mobile drawer lifecycle ────────────────────────────────────────────────
  // Lock body scroll while open, close on Escape, and close if the viewport
  // widens past `sm` so desktop layout never shows a dangling open state.
  useEffect(() => {
    if (!menuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 640) setMenuOpen(false);
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      ref={navRef}
      className={styles.root}
      data-loaded={loaded}
      data-shrunk={shrunk}
      data-menu-open={menuOpen || undefined}
      aria-label="Primary"
    >
      <SmoothLink href="/" className={styles.wordmark} aria-label="Digital Knight — home">
        <span className={styles.word} data-ink-split>
          DIGITAL KNIGHT
        </span>
      </SmoothLink>

      <ul className={styles.links}>
        {LINKS.map((link) => {
          const isActive = link.section ? active === link.section : false;
          const isHashLink = link.href.includes('#');
          const LinkComponent = isHashLink ? SmoothLink : Link;
          return (
            <li key={link.href}>
              <LinkComponent
                href={link.href}
                className={styles.link}
                data-active={isActive || undefined}
                onClick={() => handleNavClick(link.section)}
                {...(isHashLink ? { offset: NAV_SCROLL_OFFSET } : {})}
              >
                <span className={styles.linkLabel} data-ink-split>
                  {link.label}
                </span>
              </LinkComponent>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className={styles.burger}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        data-open={menuOpen || undefined}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span className={styles.burgerInner} aria-hidden>
          <span className={styles.burgerBar} data-ink-split />
          <span className={styles.burgerBar} data-ink-split />
          <span className={styles.burgerBar} data-ink-split />
        </span>
      </button>

      <span className={styles.hairline} aria-hidden />

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        active={active}
        onNavClick={handleNavClick}
      />
    </nav>
  );
}

// =============================================================================
// MobileMenu — portalled, top-level overlay
// -----------------------------------------------------------------------------
// Rendered into `document.body` via React portal. Keeping this OUTSIDE the
// `<nav>` element matters: the nav is `position: fixed` with its own
// stacking/backdrop-filter context, which clipped and reordered any descendant
// trying to occupy the full viewport. As a body-level sibling the drawer
// behaves as a true overlay — predictable z-index, no inherited filter,
// nothing fighting the cascade.
// =============================================================================
type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  active: string | null;
  onNavClick: (section: string | undefined) => void;
};

function MobileMenu({ open, onClose, active, onNavClick }: MobileMenuProps) {
  // Portal target is window/DOM-only — gate render on a mounted flag so SSR
  // and the first client render agree (no hydration mismatch).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  const overlay = (
    <div
      id="mobile-menu"
      className={styles.drawer}
      data-open={open || undefined}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div className={styles.drawerScrim} onClick={onClose} aria-hidden />
      <div className={styles.drawerPanel}>
        <ul className={styles.drawerLinks}>
          {LINKS.map((link, i) => {
            const isActive = link.section ? active === link.section : false;
            const isHashLink = link.href.includes('#');
            const LinkComponent = isHashLink ? SmoothLink : Link;
            const handleClick = () => {
              onNavClick(link.section);
              onClose();
            };
            return (
              <li
                key={link.href}
                className={styles.drawerItem}
                style={{ '--i': i } as React.CSSProperties}
              >
                <LinkComponent
                  href={link.href}
                  className={styles.drawerLink}
                  data-active={isActive || undefined}
                  onClick={handleClick}
                  {...(isHashLink ? { offset: NAV_SCROLL_OFFSET } : {})}
                >
                  {link.label}
                </LinkComponent>
              </li>
            );
          })}
        </ul>

        <span className={styles.drawerDivider} aria-hidden />

        <div
          className={styles.drawerCta}
          style={{ '--i': LINKS.length + 1 } as React.CSSProperties}
        >
          <Button href="/#talk" variant="primary" size="md" onClick={onClose}>
            Free Strategy Consult
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}

function groundOf(el: HTMLElement): Ground {
  const g = el.dataset.ground;
  return g === 'stone' ? 'stone' : 'page';
}
