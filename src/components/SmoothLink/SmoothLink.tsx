'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ComponentProps, useCallback } from 'react';
import { scrollToElement } from '@/lib/scroll';

type LinkProps = ComponentProps<typeof Link>;

interface SmoothLinkProps extends LinkProps {
  /** @deprecated — offset is now derived from the nav height automatically */
  offset?: number;
  onClick?: LinkProps['onClick'];
}

function parseHref(href: string | LinkProps['href']) {
  const str = typeof href === 'string' ? href : href.pathname ?? '';
  const i = str.indexOf('#');
  if (i < 0) return { path: str || '/', hash: '', hasHash: false };
  return { path: str.slice(0, i) || '/', hash: str.slice(i + 1), hasHash: true };
}

export function SmoothLink({
  href,
  offset: _offset,
  onClick,
  children,
  ...rest
}: SmoothLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { path: targetPath, hash, hasHash } = parseHref(href);
  const currentPath = pathname || '/';
  const isCurrentPage = targetPath === currentPath;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Respect new-tab / modified clicks and anything already handled.
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        onClick?.(e);
        return;
      }

      const isHomeLink = typeof href === 'string' && href === '/';

      if (hasHash && hash) {
        e.preventDefault();

        // Always build a clean, single-hash destination from the static href.
        const cleanHref = `${targetPath}#${hash}`;

        if (isCurrentPage) {
          const target = document.getElementById(hash);
          if (target) scrollToElement(target, 'smooth');
          window.history.replaceState(null, '', cleanHref);
        } else {
          // Strip any existing fragment first so the router can't stack hashes
          // (e.g. "/#services" + push("/#work") -> "/#services#work").
          if (window.location.hash) {
            window.history.replaceState(
              null,
              '',
              window.location.pathname + window.location.search,
            );
          }
          router.push(cleanHref, { scroll: false });
        }
      } else if (isCurrentPage && isHomeLink) {
        e.preventDefault();
        // Drop any stale fragment so the bar URL stays clean at the top.
        if (window.location.hash) {
          window.history.replaceState(
            null,
            '',
            window.location.pathname + window.location.search,
          );
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      onClick?.(e);
    },
    [href, isCurrentPage, hasHash, hash, targetPath, onClick, router],
  );

  return (
    <Link href={href} onClick={handleClick} scroll={hasHash ? false : undefined} {...rest}>
      {children}
    </Link>
  );
}
