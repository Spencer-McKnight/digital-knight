import { Icon, type IconName } from '@/components/Icons';
import { Reveal } from '@/components/Reveal';
import styles from './ServiceCards.module.scss';

/**
 * ServiceCards — four-up service grid that sits at the foot of the Hero fold.
 *
 *   Outline-only surface in the language of the secondary Button. General
 *   interaction states on hover/focus:
 *     · Card lifts and the shadow deepens.
 *     · Border picks up ember.
 *     · Icon takes ember; list items resolve from 0.74 → full opacity.
 *
 *   Layout: 1 col (mobile) → 2×2 (`sm`) → 4×1 (`lg`).
 */

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
      'Market Research',
      'Digital Product Analysis',
      'AI & Innovation Strategy',
      'Success Definitions',
      'Modern Architecture',
    ],
  },
  {
    icon: 'monitor',
    title: 'Website Ecosystem',
    items: [
      'Website Design',
      'Brand Guidance',
      'Search Curation (SEO)',
      'Conversion & Marketing',
      'Quality Assurance',
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

export function ServiceCards() {
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
          <Reveal as="li" key={service.title} className={styles.cell} amount="md" delay={i * 80} enabled>
            <article className={styles.card} tabIndex={0}>
              <Icon
                name={service.icon}
                size={28}
                className={styles.icon}
                aria-hidden="true"
              />
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
