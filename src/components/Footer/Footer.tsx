import Link from 'next/link';
import { Button } from '@/components/Button';
import { SmoothLink } from '@/components/SmoothLink';
import styles from './Footer.module.scss';

const SCROLL_OFFSET = 0;

const SITEMAP = [
  {
    heading: 'Pages', links: [
      { label: 'Home', href: '/' },
      { label: 'Talk', href: '/#talk' },
      { label: 'Services', href: '/#services' },
    ]
  },
  {
    heading: 'Contact', links: [
      { label: 'hello@digital-knight.au', href: 'mailto:hello@digital-knight.au' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/spencer-mcknight/', external: true },
      { label: 'GitHub', href: 'https://github.com/Spencer-McKnight/', external: true },
    ]
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.root} data-ground="stone" aria-labelledby="footer-sign">
      <div className={styles.inner}>
        <div className={styles.signRow}>
          <div className={styles.signBlock}>
            <h2 id="footer-sign" className={styles.sign}>
              Digital Knight.
              <br />
              <span className={styles.signEmber}>Accelerate online business</span>
            </h2>
          </div>
          <div className={styles.signCta}>
            <Button href="/#talk" variant="ember" size="md">
              Let&apos;s talk
            </Button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.colophon}>
            <p className={styles.colophonTitle}>Studio</p>
            <p className={styles.colophonLine}>
              A one-desk independent studio for long-term digital partnerships.
              Operated by Spencer McKnight.
            </p>
          </div>

          <nav className={styles.sitemap} aria-label="Footer">
            {SITEMAP.map((col) => (
              <div key={col.heading} className={styles.column}>
                <p className={styles.columnHeading}>{col.heading}</p>
                <ul className={styles.columnList}>
                  {col.links.map((link) => {
                    const isExternal = 'external' in link && link.external;
                    const isHashOrHome = link.href === '/' || link.href.includes('#');
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
                        ) : isHashOrHome ? (
                          <SmoothLink href={link.href} className={styles.link} offset={SCROLL_OFFSET}>
                            {link.label}
                          </SmoothLink>
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
            <span className={styles.metaValue}>Working from Melbourne, Australia</span>
          </p>
          <p className={styles.metaItem}>
            <span className={styles.metaLabel}>Built with</span>
            <span className={styles.metaValue}>
              Next · React · GSAP · R3F · Supabase · Resend
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
