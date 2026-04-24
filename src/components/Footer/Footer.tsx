import Link from 'next/link';
import styles from './Footer.module.scss';

/**
 * Footer — the Landing beat (`design.md` §9 beat 5).
 *
 *   Stone ground (via `ground-invert` mixin). An ember hairline crowns it,
 *   echoing the nav. A quiet sign-off, a sitemap, a colophon and a local
 *   time stamp — the restraint ends on a considered note, not a fade.
 *
 *   This ships continuous with the Call beat. The ground doesn't change,
 *   so neither does the rhythm — the footer IS the landing.
 */
const SITEMAP = [
  {
    heading: 'Pages', links: [
      { label: 'Home', href: '/' },
      { label: 'Talk', href: '/#talk' },
      { label: 'Services', href: '/#services' },
      { label: 'Tech', href: '/#tech' },
    ]
  },
  {
    heading: 'Contact', links: [
      { label: 'hello@digital-knight.au', href: 'mailto:hello@digital-knight.au' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/', external: true },
      { label: 'GitHub', href: 'https://github.com/', external: true },
    ]
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.root} data-ground="stone" aria-labelledby="footer-sign">
      {/* Cinematic sign-off — the last monumental moment. */}
      <div className={styles.signBlock}>
        <h2 id="footer-sign" className={styles.sign}>
          Digital Knight.
          <br />
          <span className={styles.signEmber}>For those who intend to prevail.</span>
        </h2>
      </div>

      <div className={styles.body}>
        <div className={styles.colophon}>
          <p className={styles.colophonTitle}>Studio</p>
          <p className={styles.colophonLine}>
            A one-desk independent studio for long-term digital partnerships.
            Operated by Spencer McKnight. Melbourne-based, working globally.
          </p>
        </div>

        <nav className={styles.sitemap} aria-label="Footer">
          {SITEMAP.map((col) => (
            <div key={col.heading} className={styles.column}>
              <p className={styles.columnHeading}>{col.heading}</p>
              <ul className={styles.columnList}>
                {col.links.map((link) => {
                  const isExternal = 'external' in link && link.external;
                  return (
                    <li key={link.href}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          className={styles.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.label}
                          <span className={styles.linkMark} aria-hidden>↗</span>
                        </a>
                      ) : (
                        <Link href={link.href} className={styles.link}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.rule} aria-hidden />

      <div className={styles.meta}>
        <p className={styles.metaItem}>
          <span className={styles.metaLabel}>©</span>
          <span className={styles.metaValue}>{year} · Digital Knight</span>
        </p>
        <p className={styles.metaItem}>
          <span className={styles.metaLabel}>Location</span>
          <span className={styles.metaValue}>Working from Melbourne · Australia/Melbourne</span>
        </p>
        <p className={styles.metaItem}>
          <span className={styles.metaLabel}>Colophon</span>
          <span className={styles.metaValue}>
            Aeonik · Next 16 · React 19 · GSAP · R3F · Supabase
          </span>
        </p>
      </div>
    </footer>
  );
}
