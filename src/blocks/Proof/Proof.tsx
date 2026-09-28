import Image from 'next/image';
import Link from 'next/link';
import { BlockHead } from '@/components/BlockHead/BlockHead';
import { Rich } from '@/components/Rich/Rich';
import { Sticker } from '@/components/Sticker/Sticker';
import type { LinkTo, Paragraph, Picture } from '@/content/types';
import styles from './Proof.module.scss';

export type ProofProps = {
  folio: string;
  title: string;
  client: string;
  kind: string;
  built: ReadonlyArray<Paragraph>;
  image: Picture;
  link?: LinkTo;
};

/** One piece of work: what it was, what was built, one link. */
export function Proof({ folio, title, client, kind, built, image, link }: ProofProps) {
  return (
    <section className={styles.root} data-ground="paper">
      <div className={styles.inner}>
        <div className={styles.text}>
          <BlockHead folio={folio} title={title} />
          <p className={styles.client}>{client}</p>
          <div className={styles.body}>
            <Rich paragraphs={built} linkClass={styles.inline} />
          </div>
          {link ? (
            <Link href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ) : null}
        </div>

        <figure className={styles.figure}>
          <div className={styles.frame}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 64rem) 58vw, 100vw"
              className={styles.image}
            />
          </div>
          <Sticker label={kind} tilt={-3} className={styles.sticker} />
        </figure>
      </div>
    </section>
  );
}
