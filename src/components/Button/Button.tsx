import Link from 'next/link';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import { SmoothLink } from '@/components/SmoothLink';
import styles from './Button.module.scss';

const DEFAULT_SCROLL_OFFSET = 0;

type Variant = 'primary' | 'secondary' | 'ghost' | 'ember';
type Size = 'md' | 'lg';

type SharedProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  /** Trailing glyph — defaults to an arrow on the ghost variant. */
  trailing?: ReactNode;
};

type AnchorProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string;
    external?: boolean;
  };

type ButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type Props = AnchorProps | ButtonProps;

/**
 * Button — the single locked interactive primitive.
 *
 * Spec — `design.md` §8:
 *   Square corners, 1px stroke, no rounding, no shadow. Inverts cleanly on
 *   Stone. Hover is felt, not loud. Ghost is label + arrow. Ember matches
 *   secondary’s outline treatment with ember stroke and fill sweep.
 *
 * Accepts either an `href` (renders `Link` / `<a>`) or button props. Size
 * and variant data-attributes drive every visual branch from `.module.scss`.
 */
export function Button(props: Props) {
  const {
    variant = 'primary',
    size = 'md',
    children,
    trailing,
    className,
    ...rest
  } = props;

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {(trailing ?? (variant === 'ghost' ? <Arrow /> : null)) ? (
        <span className={styles.trailing} aria-hidden>
          {trailing ?? (variant === 'ghost' ? <Arrow /> : null)}
        </span>
      ) : null}
    </>
  );

  const rootClass = [styles.root, className].filter(Boolean).join(' ');

  if ('href' in props && props.href !== undefined) {
    const { href, external, ...anchorRest } = rest as Omit<AnchorProps, keyof SharedProps>;
    const externalProps = external
      ? { target: '_blank', rel: 'noreferrer' }
      : {};
    const isInternalHashLink = !external && href.includes('#');
    const LinkComponent = isInternalHashLink ? SmoothLink : Link;
    return (
      <LinkComponent
        href={href}
        className={rootClass}
        data-variant={variant}
        data-size={size}
        {...externalProps}
        {...(isInternalHashLink ? { offset: DEFAULT_SCROLL_OFFSET } : {})}
        {...anchorRest}
      >
        {content}
      </LinkComponent>
    );
  }

  return (
    <button
      type="button"
      className={rootClass}
      data-variant={variant}
      data-size={size}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="10"
      viewBox="0 0 14 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
    >
      <path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
