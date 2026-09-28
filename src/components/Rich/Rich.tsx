import Link from 'next/link';
import type { Inline, Paragraph } from '@/content/types';

function Run({ part, linkClass }: { part: Inline; linkClass?: string }) {
  if (typeof part === 'string') return <>{part}</>;
  const external = /^https?:/.test(part.href);
  return external ? (
    <a href={part.href} className={linkClass} target="_blank" rel="noopener noreferrer">
      {part.text}
    </a>
  ) : (
    <Link href={part.href} className={linkClass}>
      {part.text}
    </Link>
  );
}

/** Paragraphs of plain text and inline links. */
export function Rich({
  paragraphs,
  className,
  linkClass,
}: {
  paragraphs: ReadonlyArray<Paragraph>;
  className?: string;
  linkClass?: string;
}) {
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className={className}>
          {p.map((part, j) => (
            <Run key={j} part={part} linkClass={linkClass} />
          ))}
        </p>
      ))}
    </>
  );
}
