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
  { label: 'Services', href: '/#services', section: 'services' },
  { label: 'About', href: '/#meet', section: 'meet' },
];

function sectionIdFromHref(href: string): string | null {
  const i = href.indexOf('#');
  if (i < 0) return null;
  const id = href.slice(i + 1).trim();
  return id.length > 0 ? id : null;
}

/**
 * Navigation — light glass bar with constant blur and 90% transparency.
 * No scroll-direction shrink, no split-ink colour effects.
 */
export function Nav() {
  const loaded = useLoadGate();
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollingToRef = useRef<string | null>(null);
  const scrollSettleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll-spy: track which section is currently in view.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let frame = 0;

    type SpyEntry = { id: string; docTop: number };
    let spyCache: SpyEntry[] = [];

    const refreshCache = () => {
      const scrollY = window.scrollY;
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
    refreshCache();

    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleRefresh = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        refreshTimer = null;
        refreshCache();
      }, 200);
    };

    const mo = new MutationObserver(scheduleRefresh);
    mo.observe(document.body, { childList: true, subtree: true });

    const detect = () => {
      frame = 0;
      const y = window.scrollY;

      setScrolled((prev) => {
        const next = y > 0;
        return prev === next ? prev : next;
      });

      if (scrollingToRef.current) {
        if (scrollSettleTimer.current) clearTimeout(scrollSettleTimer.current);
        scrollSettleTimer.current = setTimeout(() => {
          scrollingToRef.current = null;
        }, SCROLL_SETTLE_DELAY);
      }

      if (!scrollingToRef.current) {
        const navRect = nav.getBoundingClientRect();
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
      refreshCache();
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

  const handleNavClick = useCallback((section: string | undefined) => {
    if (!section) return;
    scrollingToRef.current = section;
    setActive(section);
    if (scrollSettleTimer.current) {
      clearTimeout(scrollSettleTimer.current);
      scrollSettleTimer.current = null;
    }
  }, []);

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
      data-scrolled={scrolled || undefined}
      data-menu-open={menuOpen || undefined}
      aria-label="Primary"
    >
      <SmoothLink href="/" className={styles.wordmark} aria-label="Digital Knight — home">
        <span className={styles.logo} aria-hidden="true" />
        <span className={styles.word}>DIGITAL KNIGHT</span>
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
                {link.label}
              </LinkComponent>
            </li>
          );
        })}
      </ul>

      <Button href="/contact" variant="secondary" className={styles.contactButton}>
        Contact
      </Button>

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
          <span className={styles.burgerBar} />
          <span className={styles.burgerBar} />
          <span className={styles.burgerBar} />
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
// MobileMenu — portalled overlay
// =============================================================================
type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  active: string | null;
  onNavClick: (section: string | undefined) => void;
};

function MobileMenu({ open, onClose, active, onNavClick }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
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
          <Button href="/contact" variant="primary" size="md" onClick={onClose}>
            Start a Project
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
