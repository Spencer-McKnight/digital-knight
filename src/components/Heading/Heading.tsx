'use client';

import { useEffect, useRef, useState, type ElementType } from 'react';
import styles from './Heading.module.scss';

type Level = 'h1' | 'h2' | 'h3';

/**
 * A heading with the house type move: on first entry its width opens from
 * 75% to the role's set width. The move runs on an aria-hidden overlay whose
 * lines are measured from the real heading, so layout never shifts. Headings
 * already in view when the page hydrates render in place and never move.
 */
export function Heading({
  as = 'h2',
  text,
  id,
  className,
}: {
  as?: Level;
  text: string;
  id?: string;
  className?: string;
}) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLHeadingElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const measured = measureLines(el);
        if (measured.length) setLines(measured);
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      className={className ? `${styles.root} ${className}` : styles.root}
      data-moving={lines ? '' : undefined}
    >
      <span className={styles.text}>{text}</span>
      {lines ? (
        <span className={styles.move} aria-hidden="true" onAnimationEnd={() => setLines(null)}>
          {lines.map((line, i) => (
            <span key={i} className={styles.line}>
              {line}
            </span>
          ))}
        </span>
      ) : null}
    </Tag>
  );
}

/** Group the heading's words by the line they sit on. */
function measureLines(el: HTMLElement): string[] {
  const node = el.querySelector(`.${styles.text}`)?.firstChild;
  if (!node || node.nodeType !== Node.TEXT_NODE) return [];
  const text = node.textContent ?? '';
  const range = document.createRange();
  const lines: string[] = [];
  let current = '';
  let top: number | null = null;
  const re = /\S+\s*/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text))) {
    range.setStart(node, match.index);
    range.setEnd(node, match.index + match[0].trimEnd().length);
    const rect = range.getClientRects()[0];
    if (!rect) continue;
    if (top !== null && rect.top - top > rect.height / 2) {
      lines.push(current.trimEnd());
      current = '';
    }
    if (current === '') top = rect.top;
    current += match[0];
  }
  if (current) lines.push(current.trimEnd());
  return lines;
}
