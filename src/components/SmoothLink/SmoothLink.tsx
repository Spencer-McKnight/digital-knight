'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ComponentProps, useCallback } from 'react';

type LinkProps = ComponentProps<typeof Link>;

interface SmoothLinkProps extends LinkProps {
  /** Scroll offset from top in pixels (useful for fixed headers) */
  offset?: number;
  /** Scroll duration hint — actual duration controlled by CSS scroll-behavior */
  onClick?: LinkProps['onClick'];
}

/**
 * A Link component that always smooth-scrolls to hash targets, even when
 * already at the same URL. Also handles `/` by scrolling to page top.
 *
 * This solves the browser's native behavior where clicking a link to the
 * current URL does nothing — we intercept and scroll manually.
 */
export function SmoothLink({
  href,
  offset = 0,
  onClick,
  children,
  ...rest
}: SmoothLinkProps) {
  const pathname = usePathname();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const hrefStr = typeof href === 'string' ? href : href.pathname ?? '';
      const isHashLink = hrefStr.includes('#');
      const isHomeLink = hrefStr === '/';
      const [hrefPath, hash] = hrefStr.split('#');

      // Normalize paths for comparison
      const targetPath = hrefPath === '' || hrefPath === '/' ? '/' : hrefPath;
      const currentPath = pathname === '' ? '/' : pathname;
      const isCurrentPage = targetPath === currentPath;

      // Only intercept if we're on the same page and it's a hash or home link
      if (isCurrentPage && (isHashLink || isHomeLink)) {
        e.preventDefault();

        if (isHomeLink && !hash) {
          // Home link without hash — scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (hash) {
          // Hash link — scroll to the target element
          const target = document.getElementById(hash);
          if (target) {
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      }

      // Call original onClick if provided
      onClick?.(e);
    },
    [href, pathname, offset, onClick],
  );

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
