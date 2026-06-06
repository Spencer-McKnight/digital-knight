'use client';

import { useEffect, useRef, useState, type RefCallback } from 'react';
import { Icon, type IconName } from '@/components/Icons';
import { Reveal } from '@/components/Reveal';
import styles from './ServiceCards.module.scss';

type Service = {
  icon: IconName;
  title: string;
  items: ReadonlyArray<string>;
};

const SERVICES: ReadonlyArray<Service> = [
  {
    icon: 'lightbulb',
    title: 'Strategic Advisory',
    items: [
      'AI & Innovation Strategy',
      'Modern Architecture',
      'Digital Product Analysis',
      'Success Definitions',
      'Market Research',
    ],
  },
  {
    icon: 'monitor',
    title: 'Website',
    items: [
      'Development',
      'Design & Branding',
      'Quality Assurance',
      'Search Curation (SEO)',
      'Conversion & Marketing',
    ],
  },
  {
    icon: 'dataflow',
    title: 'Automation Tools',
    items: [
      'Business Process Maps',
      'AI Workflows',
      '3rd Party Integrations',
      'Admin Dashboards',
      'Reducing Manual Load',
    ],
  },
  {
    icon: 'infinity',
    title: 'Evolution',
    items: [
      'Platform Evolution',
      'Data Analytics',
      'Technical Support',
      'Feature Enhancement',
      'Change Management',
    ],
  },
];

const COARSE_QUERY = '(pointer: coarse)';

export function ServiceCards() {
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const armed = useRef(false);

  const setCardRef =
    (i: number): RefCallback<HTMLElement> =>
    (el) => {
      cardRefs.current[i] = el;
    };

  useEffect(() => {
    if (!window.matchMedia(COARSE_QUERY).matches) return;

    const root = cardRefs.current[0]?.closest('section');
    if (!root) return;

    // Don't arm until the section has been scrolled into view once,
    // so passive page-load position doesn't highlight anything.
    const armObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          armed.current = true;
          armObserver.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    armObserver.observe(root);

    // Track which card is closest to the top of the viewport.
    // The "first fully in view" heuristic: whichever card's top is
    // closest to (but not above) 30% of viewport height wins.
    const pickActive = () => {
      if (!armed.current) return;
      const zone = window.innerHeight * 0.35;
      let best = -1;
      let bestDist = Infinity;

      for (let i = 0; i < cardRefs.current.length; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        const { top, bottom } = card.getBoundingClientRect();
        if (bottom < 0 || top > window.innerHeight) continue;
        const dist = Math.abs(top - zone);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }

      setActiveIndex((prev) => (prev === best ? prev : best));
    };

    const onScroll = () => requestAnimationFrame(pickActive);
    window.addEventListener('scroll', onScroll, { passive: true });
    pickActive();

    return () => {
      armObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section
      id="services"
      data-ground="page"
      className={styles.root}
      aria-labelledby="servicecards-heading"
    >
      <h2 id="servicecards-heading" className="sr-only">
        What I do
      </h2>
      <ul className={styles.grid}>
        {SERVICES.map((service, i) => (
          <Reveal
            as="li"
            key={service.title}
            className={styles.cell}
            amount="md"
            delay={i * 80}
            enabled
          >
            <article
              className={`${styles.card}${activeIndex === i ? ` ${styles.active}` : ''}`}
              tabIndex={0}
              ref={setCardRef(i)}
            >
              <Icon name={service.icon} size={28} className={styles.icon} aria-hidden="true" />
              <h3 className={styles.title}>{service.title}</h3>
              <ul className={styles.items} role="list">
                {service.items.map((item) => (
                  <li key={item} className={styles.item}>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
