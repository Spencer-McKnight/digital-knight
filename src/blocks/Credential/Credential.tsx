import Image from 'next/image';
import Link from 'next/link';
import { BlockHead } from '@/components/BlockHead/BlockHead';
import type { LinkTo, Picture } from '@/content/types';
import styles from './Credential.module.scss';

export type CredentialProps = {
  variant: 'compact' | 'full';
  folio: string;
  title: string;
  /** One line in the first person. */
  line: string;
  facts: ReadonlyArray<string>;
  portrait: Picture;
  link: LinkTo;
};

/** The person doing the work, and four facts anyone can check. */
export function Credential({ variant, folio, title, line, facts, portrait, link }: CredentialProps) {
  return (
    <section className={styles.root} data-variant={variant} data-ground="paper">
      <div className={styles.inner}>
        <figure className={styles.portrait}>
          <Image
            src={portrait.src}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            sizes="(min-width: 64rem) 30vw, 70vw"
            className={styles.image}
          />
        </figure>
        <div className={styles.text}>
          <BlockHead folio={folio} title={title} />
          <p className={styles.line}>{line}</p>
          {variant === 'full' ? (
            <ul className={styles.facts}>
              {facts.map((fact) => (
                <li key={fact} className={styles.fact}>
                  {fact}
                </li>
              ))}
            </ul>
          ) : null}
          <Link href={link.href} className={styles.link}>
            {link.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
