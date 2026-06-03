import Link from 'next/link';
import { SmoothLink } from '@/components/SmoothLink';
import { Reveal } from '@/components/Reveal';
import { CASE_STUDIES } from '@/app/work/[slug]/content';
import styles from './Footer.module.scss';
import { Button } from '../Button';

const SCROLL_OFFSET = 0;

const SITEMAP = [
  {
    heading: 'Pages', links: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/#services' },
      { label: 'Work', href: '/#work' },
      { label: 'Contact', href: '/contact' },
    ]
  },
  {
    heading: 'Work', links: CASE_STUDIES.map((cs) => ({
      label: cs.label,
      href: `/work/${cs.slug}`,
    })),
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
      <div className={styles.topHairline} aria-hidden />
      <div className={styles.inner}>
        <Reveal as="div" className={styles.signBlock} amount="md" enabled>
          <div className={styles.signColumn}>
            <h2 id="footer-sign" className={styles.sign}>
              Digital Knight.
              <br />
              <span className={styles.signEmber}>Solve and evolve</span>
            </h2>
          </div>
          <div className={styles.signButton}>
            <Button href="/contact" variant="secondary" size="md">Start with a conversation</Button>
          </div>
        </Reveal>

        <div className={styles.body}>
          <div className={styles.colophon}>
            <p className={styles.colophonTitle}>Studio</p>
            <p className={styles.colophonLine}>
              An ambitious digital agency for strategic partnerships and web projects.
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
          <address className={styles.metaItem}>
            <span className={styles.metaLabel}>Location</span>
            <span className={styles.metaValue}>Melbourne, Australia</span>
          </address>
          <p className={styles.metaItem}>
            <span className={styles.metaLabel}>Site Stack</span>
            <span className={styles.metaValue}>
              Next · React · GSAP · R3F · Supabase · Resend
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
