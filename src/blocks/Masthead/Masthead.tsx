'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { HereMark } from '@/components/HereMark/HereMark';
import { NextMark } from '@/components/NextMark/NextMark';
import { getChrome } from '@/content/chrome';
import { FUNNEL, href, pairedHref, resolvePath, stageOf, type Locale } from '@/content/routes';
import styles from './Masthead.module.scss';

type Panel = 'trail' | 'drawer';

/**
 * The publication's name and its parts. The funnel is its own entry, "Start
 * here", which opens the four stops. The market pin opens this page in the
 * other market. Panels close on navigation because they are keyed to the
 * pathname they opened on.
 */
export function Masthead({ locale }: { locale: Locale }) {
  const t = getChrome(locale);
  const pathname = usePathname() ?? '/';
  const here = resolvePath(pathname);
  const stage = here ? stageOf(here.id) : null;
  const currentStop = stage ? FUNNEL[stage - 1] : null;
  // From the cover the next move is stop 1; on a stage it is the stop after.
  const nextIndex = stage ?? (here?.id === 'home' ? 0 : -1);

  const [open, setOpen] = useState<{ panel: Panel; at: string } | null>(null);
  const panel = open && open.at === pathname ? open.panel : null;

  const trailId = useId();
  const drawerId = useId();
  const trailToggle = useRef<HTMLButtonElement>(null);
  const drawerToggle = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);

  const close = useCallback(() => {
    const toggle = panel === 'drawer' ? drawerToggle.current : trailToggle.current;
    setOpen(null);
    toggle?.focus();
  }, [panel]);

  const toggle = (next: Panel) =>
    setOpen((prev) => (prev && prev.at === pathname && prev.panel === next ? null : { panel: next, at: pathname }));

  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [panel, close]);

  // The drawer covers the page: lock scroll and take the page out of the
  // tab order while it is open.
  useEffect(() => {
    if (panel !== 'drawer') return;
    const main = document.getElementById('main');
    const footer = document.querySelector('footer');
    document.body.style.overflow = 'hidden';
    main?.setAttribute('inert', '');
    footer?.setAttribute('inert', '');
    drawerRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    return () => {
      document.body.style.overflow = '';
      main?.removeAttribute('inert');
      footer?.removeAttribute('inert');
    };
  }, [panel]);

  const pinHref = pairedHref(pathname);
  const isTalk = here?.id === 'talk';

  const stops = (
    <ol className={styles.stops}>
      {t.trail.map((stop, i) => {
        const isCurrent = stop.id === currentStop;
        const isNext = i === nextIndex;
        return (
          <li key={stop.id} className={styles.stop} data-state={isCurrent ? 'current' : isNext ? 'next' : undefined}>
            <Link href={href(stop.id, locale)} className={styles.stopLink} aria-current={isCurrent ? 'step' : undefined}>
              <span className={styles.stopLabel}>
                {isCurrent ? <HereMark className={styles.stopMark} /> : null}
                {isNext ? <NextMark className={styles.stopMark} /> : null}
                {stop.label}
              </span>
              <span className={styles.stopPromise}>{stop.promise}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );

  return (
    <header ref={rootRef} className={styles.root} data-ground="carbon" data-open={panel ?? undefined}>
      <a href="#main" className={styles.skip}>
        {t.skip}
      </a>

      <div className={styles.band}>
        <Link href={href('home', locale)} className={styles.wordmark} aria-label={t.homeLabel}>
          <span aria-hidden="true">Digital Knight</span>
          <NextMark className={styles.wordmarkMark} />
        </Link>

        {stage ? (
          <p className={styles.runningHead}>
            <HereMark />
            {t.trail[stage - 1]?.label}
          </p>
        ) : null}

        <nav className={styles.nav} aria-label={t.nav.primary}>
          <button
            ref={trailToggle}
            type="button"
            className={styles.navItem}
            aria-expanded={panel === 'trail'}
            aria-controls={trailId}
            onClick={() => toggle('trail')}
          >
            {t.nav.start}
            <span className={styles.caret} aria-hidden="true" />
          </button>
          <Link
            href={href('work', locale)}
            className={styles.navItem}
            aria-current={here?.id === 'work' ? 'page' : undefined}
          >
            {t.nav.work}
          </Link>
          <Link
            href={href('contact', locale)}
            className={styles.navItem}
            aria-current={here?.id === 'contact' ? 'page' : undefined}
          >
            {t.nav.contact}
          </Link>
        </nav>

        <Link
          href={href('talk', locale)}
          className={styles.book}
          aria-current={isTalk ? 'page' : undefined}
        >
          {t.nav.book}
        </Link>

        <a href={pinHref} className={styles.pin} hrefLang={t.pin.hrefLang} lang={t.pin.lang} aria-label={t.pin.label}>
          <span className={styles.pinFace} aria-hidden="true">
            {t.pin.text}
          </span>
        </a>

        <button
          ref={drawerToggle}
          type="button"
          className={styles.menuToggle}
          aria-expanded={panel === 'drawer'}
          aria-controls={drawerId}
          onClick={() => toggle('drawer')}
        >
          {panel === 'drawer' ? t.nav.close : t.nav.menu}
        </button>
      </div>

      <div id={trailId} className={styles.trailPanel} hidden={panel !== 'trail'}>
        <p className={styles.panelLabel}>{t.trailLabel}</p>
        {stops}
      </div>

      <div id={drawerId} ref={drawerRef} className={styles.drawer} hidden={panel !== 'drawer'}>
        <p className={styles.panelLabel}>{t.nav.start}</p>
        {stops}
        <ul className={styles.drawerLinks}>
          <li>
            <Link href={href('work', locale)} className={styles.drawerLink}>
              {t.nav.work}
            </Link>
          </li>
          <li>
            <Link href={href('contact', locale)} className={styles.drawerLink}>
              {t.nav.contact}
            </Link>
          </li>
        </ul>
        <Link href={href('talk', locale)} className={styles.drawerBook}>
          {t.nav.book}
          <NextMark />
        </Link>
        <a href={pinHref} className={styles.drawerMarket} hrefLang={t.pin.hrefLang} lang={t.pin.lang}>
          {t.marketLine}
        </a>
      </div>

      {t.hint ? <MarketHint text={t.hint.text} dismiss={t.hint.dismiss} target={pinHref} /> : null}
    </header>
  );
}

// ── Market hint ──────────────────────────────────────────────────────────────
// English pages only. One dismissible line for browsers that prefer German.
// Fixed to the viewport so it never pushes the page. It never redirects.

const HINT_KEY = 'dk:hint-de';
const noop = () => () => {};

function prefersGerman(): boolean {
  try {
    if (localStorage.getItem(HINT_KEY)) return false;
  } catch {
    // Storage blocked: still offer the hint.
  }
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  return langs[0]?.toLowerCase().startsWith('de') ?? false;
}

function MarketHint({ text, dismiss, target }: { text: string; dismiss: string; target: string }) {
  const wanted = useSyncExternalStore(noop, prefersGerman, () => false);
  const [dismissed, setDismissed] = useState(false);
  if (!wanted || dismissed) return null;

  const onDismiss = () => {
    try {
      localStorage.setItem(HINT_KEY, '1');
    } catch {
      // Nothing to persist to; hiding for this view is enough.
    }
    setDismissed(true);
  };

  return (
    <div className={styles.hint} lang="de" role="note">
      <a href={target} hrefLang="de-DE" className={styles.hintLink}>
        {text}
      </a>
      <button type="button" className={styles.hintClose} onClick={onDismiss} aria-label={dismiss}>
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
