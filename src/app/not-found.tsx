import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './not-found.module.scss';

export const metadata: Metadata = {
  title: 'Lost ground',
  description: 'The page you were looking for does not exist. Find your way back to Digital Knight.',
};

export default function NotFound() {
  return (
    <main className={styles.root}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>404</p>
        <h1 className={styles.heading}>Page Not Found</h1>
        <p className={styles.body}>
          Let's get you back on course.
        </p>
        <nav className={styles.links} aria-label="Recovery">
          <Link href="/" className={styles.link}>
            Home
          </Link>
          <Link href="/#services" className={styles.link}>
            Services
          </Link>
          <Link href="/#talk" className={styles.link}>
            Start a conversation
          </Link>
        </nav>
      </div>
    </main>
  );
}
