import Link from 'next/link';
import { MarketLink } from '@/components/MarketLink/MarketLink';
import { NextMark } from '@/components/NextMark/NextMark';
import { CASE_ORDER, CASES } from '@/content/cases';
import { getChrome } from '@/content/chrome';
import { href, type Locale } from '@/content/routes';
import styles from './Colophon.module.scss';

const EMAIL = 'hello@digital-knight.au';

/** Sign-off, every page in the market, legal and location, the other market. */
export function Colophon({ locale }: { locale: Locale }) {
  const t = getChrome(locale);
  const c = t.colophon;
  const year = new Date().getFullYear();

  return (
    <footer className={styles.root} data-ground="carbon">
      <div className={styles.inner}>
        <p className={styles.sign}>{c.sign}</p>

        <nav className={styles.columns} aria-label={c.start}>
          <div className={styles.column}>
            <h2 className={styles.heading}>{c.start}</h2>
            <ol className={styles.list}>
              {t.trail.map((stop) => (
                <li key={stop.id}>
                  <Link href={href(stop.id, locale)} className={styles.link}>
                    {stop.label}
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.column}>
            <h2 className={styles.heading}>{c.work}</h2>
            <ul className={styles.list}>
              {CASE_ORDER.map((slug) => (
                <li key={slug}>
                  <Link href={href('case', locale, slug)} className={styles.link}>
                    {CASES[slug].client}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h2 className={styles.heading}>{c.studio}</h2>
            <ul className={styles.list}>
              <li>
                <Link href={href('home', locale)} className={styles.link}>
                  {c.home}
                </Link>
              </li>
              <li>
                <Link href={href('contact', locale)} className={styles.link}>
                  {c.contact}
                </Link>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className={styles.link}>
                  {EMAIL}
                </a>
              </li>
              <li className={styles.plain}>{c.location}</li>
            </ul>
          </div>

          <div className={styles.column}>
            <h2 className={styles.heading}>{c.legal}</h2>
            <ul className={styles.list}>
              <li>
                <Link href={href('privacy', locale)} className={styles.link}>
                  {c.privacy}
                </Link>
              </li>
              {c.imprint ? (
                <li>
                  <Link href={href('imprint', locale)} className={styles.link}>
                    {c.imprint}
                  </Link>
                </li>
              ) : null}
              <li>
                <MarketLink lang={t.pin.lang} hrefLang={t.pin.hrefLang} className={styles.link}>
                  {t.marketLine}
                </MarketLink>
              </li>
            </ul>
          </div>
        </nav>

        <div className={styles.base}>
          <span className={styles.wordmark} aria-hidden="true">
            Digital Knight
            <NextMark />
          </span>
          <p className={styles.rights}>
            © {year} {c.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
