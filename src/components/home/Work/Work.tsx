import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@/components/Icons';
import { Reveal } from '@/components/Reveal';
import { WORK, type WorkItem } from './content';
import styles from './Work.module.scss';

export function Work() {
  return (
    <section id="work" data-ground="page" className={styles.root} aria-labelledby="work-heading">
      <div className={styles.inner}>
        <h2 id="work-heading" className="sr-only">
          Selected work
        </h2>
        <ul className={styles.grid}>
          {WORK.map((item, i) => {
            const featured = i === 0;
            return (
              <Reveal
                as="li"
                key={item.id}
                className={styles.cell}
                data-feature={featured ? 'true' : undefined}
                amount="md"
                delay={i * 80}
                enabled
              >
                <Card item={item} featured={featured} />
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Card({ item, featured }: { item: WorkItem; featured?: boolean }) {
  const hasScreen = !!item.screen;
  const hasBackdrop = !!item.backdrop;

  return (
    <Link
      className={styles.card}
      href={`/work/${item.id}`}
    >
      <p className={styles.label}>{item.label}</p>
      <h3 className={styles.title}>{item.title}</h3>

      <div className={styles.frame}>
        <div className={styles.backdrop} aria-hidden="true">
          {hasBackdrop && (
            <Image
              src={item.backdrop!.src}
              alt={item.backdrop!.alt}
              width={item.backdrop!.width}
              height={item.backdrop!.height}
              sizes={featured ? '(min-width: 640px) 80vw, 100vw' : '(min-width: 640px) 50vw, 100vw'}
              className={styles.backdropImg}
            />
          )}
        </div>

        {(hasScreen || !hasBackdrop) && (
          <div className={styles.screen} aria-hidden="true">
            {hasScreen && (
              <Image
                src={item.screen!.src}
                alt={item.screen!.alt}
                width={item.screen!.width}
                height={item.screen!.height}
                sizes={featured ? '(min-width: 640px) 56vw, 85vw' : '(min-width: 640px) 33vw, 85vw'}
                className={styles.screenImg}
              />
            )}
          </div>
        )}

        <Icon
          name="arrow-up-right"
          size={28}
          className={styles.arrow}
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
