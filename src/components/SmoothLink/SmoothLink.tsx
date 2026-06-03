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
      const isHomeLink = typeof href === 'string' && href === '/';

      if (hasHash) {
        e.preventDefault();

        if (isCurrentPage) {
          const target = document.getElementById(hash);
          if (target) scrollToElement(target, 'smooth');
          window.history.replaceState(null, '', `${targetPath}#${hash}`);
        } else {
          const hrefStr = typeof href === 'string' ? href : `${targetPath}#${hash}`;
          router.push(hrefStr, { scroll: false });
        }
      } else if (isCurrentPage && isHomeLink) {
        e.preventDefault();
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
