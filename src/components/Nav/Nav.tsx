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
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollingToRef = useRef<string | null>(null);
  const scrollSettleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const SHRINK_THRESHOLD = 48;
    let lastY = window.scrollY;
    let frame = 0;
    let currentShrunk = false;

    // Paint targets are static across the component's lifetime.
    const paintTargets = [
      nav,
      ...Array.from(nav.querySelectorAll<HTMLElement>('[data-ink-split]')),
    ];

    // ── Section cache ──────────────────────────────────────────────────
    // Ground sections are few (~5) and their document-flow positions only
    // change on resize or DOM mutation — not on scroll. Cache their
    // document-relative offsets so the per-frame handler never calls
    // querySelectorAll or getBoundingClientRect on sections.
    type SectionEntry = { ground: Ground; docTop: number; docBottom: number };
    let sectionCache: SectionEntry[] = [];

    // Scroll-spy targets (section wrappers referenced by LINKS).
    type SpyEntry = { id: string; docTop: number };
    let spyCache: SpyEntry[] = [];

    // Track whether the previous frame had a boundary in the nav so we
    // can skip the paint-target loop entirely on consecutive no-boundary
    // frames (the common case during most of a scroll).
    let hadBoundary = false;

    const refreshCaches = () => {
      const scrollY = window.scrollY;

      const els = document.querySelectorAll<HTMLElement>('[data-ground]');
      sectionCache = Array.from(els)
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            ground: groundOf(el),
            docTop: rect.top + scrollY,
            docBottom: rect.bottom + scrollY,
          };
        })
        .sort((a, b) => a.docTop - b.docTop);

      spyCache = [];
      for (const link of LINKS) {
        const id = sectionIdFromHref(link.href) ?? link.section ?? null;
        if (!id) continue;
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        spyCache.push({ id, docTop: rect.top + scrollY });
      }
    };
    refreshCaches();

    // Re-cache when sections mount/unmount or resize changes layout.
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleRefresh = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        refreshTimer = null;
        refreshCaches();
      }, 100);
    };

    const mo = new MutationObserver(scheduleRefresh);
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributeFilter: ['data-ground'],
    });

    const detect = () => {
      frame = 0;
      const y = window.scrollY;

      // Scroll-settle: clear programmatic scroll lock after pause.
      if (scrollingToRef.current) {
        if (scrollSettleTimer.current) clearTimeout(scrollSettleTimer.current);
        scrollSettleTimer.current = setTimeout(() => {
          scrollingToRef.current = null;
        }, SCROLL_SETTLE_DELAY);
      }

      // 1) Shrink — direct DOM write, no React state.
      const goingDown = y > lastY;
      lastY = y;
      const shouldShrink = y >= SHRINK_THRESHOLD && goingDown;
      if (shouldShrink !== currentShrunk) {
        currentShrunk = shouldShrink;
        nav.dataset.shrunk = String(currentShrunk);
      }

      // 2) Ground boundary: cached doc offsets → viewport via scrollY.
      //    No per-section getBoundingClientRect.
      const navRect = nav.getBoundingClientRect();

      let upperGround: Ground = 'page';
      let lowerGround: Ground = 'page';
      let splitViewportY = Infinity;

      for (let i = 0; i < sectionCache.length; i++) {
        const entry = sectionCache[i]!;
        const viewportTop = entry.docTop - y;
        if (viewportTop > navRect.top - 0.5 && viewportTop < navRect.bottom + 0.5) {
          lowerGround = entry.ground;
          upperGround = i > 0 ? sectionCache[i - 1]!.ground : entry.ground;
          splitViewportY = viewportTop;
          break;
        }
      }

      if (!Number.isFinite(splitViewportY)) {
        const scanDocY = y + navRect.top + navRect.height / 2;
        let single: Ground = 'page';
        for (const entry of sectionCache) {
          if (entry.docTop <= scanDocY && entry.docBottom > scanDocY) {
            single = entry.ground;
            break;
          }
        }
        upperGround = single;
        lowerGround = single;
      }

      // 3) Ground attributes.
      if (nav.dataset.upperGround !== upperGround)
        nav.dataset.upperGround = upperGround;
      if (nav.dataset.lowerGround !== lowerGround)
        nav.dataset.lowerGround = lowerGround;

      // 4) Split offsets — only read paint-target rects when a boundary is
      //    actually threading the nav. On consecutive no-boundary frames
      //    (the majority of scroll), skip entirely.
      const hasBoundary = Number.isFinite(splitViewportY);
      if (hasBoundary) {
        for (const el of paintTargets) {
          el.style.setProperty(
            '--nav-split',
            `${splitViewportY - el.getBoundingClientRect().top}px`,
          );
        }
      } else if (hadBoundary) {
        for (const el of paintTargets) {
          el.style.setProperty('--nav-split', '9999px');
        }
      }
      hadBoundary = hasBoundary;

      // 5) Scroll spy: cached doc offsets → viewport comparison.
      if (!scrollingToRef.current) {
        const line = navRect.bottom + 6;
        let navActiveId: string | null = null;
        for (const { id, docTop } of spyCache) {
          if (docTop - y <= line) navActiveId = id;
        }
        setActive((prev) => (prev === navActiveId ? prev : navActiveId));
      }
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(detect);
    };

    const onResize = () => {
      refreshCaches();
      schedule();
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      if (frame) cancelAnimationFrame(frame);
      if (refreshTimer) clearTimeout(refreshTimer);
      if (scrollSettleTimer.current) clearTimeout(scrollSettleTimer.current);
      mo.disconnect();
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
