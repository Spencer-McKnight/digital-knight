import Image from 'next/image';
import { BlockHead } from '@/components/BlockHead/BlockHead';
import type { Picture } from '@/content/types';
import styles from './Plates.module.scss';

export type Plate = Picture & { caption?: string };

export type PlatesProps = {
  folio: string;
  title: string;
  plates: ReadonlyArray<Plate>;
};

/** The work itself, set as plates on carbon with captions. */
export function Plates({ folio, title, plates }: PlatesProps) {
  if (!plates.length) return null;
  return (
    <section className={styles.root} data-ground="carbon">
      <div className={styles.inner}>
        <BlockHead folio={folio} title={title} className={styles.head} />
        <div className={styles.plates}>
          {plates.map((plate, i) => (
            <figure key={plate.src} className={styles.plate} data-wide={i === 0 || undefined}>
              <Image
                src={plate.src}
                alt={plate.alt}
                width={plate.width}
                height={plate.height}
                sizes={i === 0 ? '(min-width: 64rem) 80vw, 100vw' : '(min-width: 48rem) 45vw, 100vw'}
                className={styles.image}
              />
              {plate.caption ? <figcaption className={styles.caption}>{plate.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
