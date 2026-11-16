'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/Button';
import type { CaseStudy } from './content';
import { getCaseStudy } from './content';
import styles from './CaseStudyPage.module.scss';

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const lead = study.figures.find((f) => f.variant === 'lead');
  const images = study.figures.filter((f) => f.variant !== 'lead');
  const nextStudy = getCaseStudy(study.nextSlug);

  return (
    <main className={styles.root}>
      {/* Split layout: left rail + right canvas */}
      <div className={styles.split}>
        <div className={styles.splitInner}>
          {/* Left rail */}
          <aside className={styles.rail} aria-label="Project overview">
            <div className={styles.railSticky}>
              <Reveal enabled immediate fadeOnly>
                <h1 className={styles.title}>
                  {study.label}, {study.title}
                </h1>
                <p className={styles.lede}>{study.tagline}</p>
              </Reveal>

              {study.siteUrl && (
                <a
                  href={study.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.visitLink}
                >
                  Visit website <span aria-hidden>&#8599;</span>
                </a>
              )}

              {study.stats && study.stats.length > 0 && (
                <>
                  <span className={styles.railRule} aria-hidden />
                  <Reveal enabled immediate amount="sm" delay={180}>
                    <p className={styles.railHeading}>At a glance</p>
                    <dl className={styles.statsList}>
                      {study.stats.map((stat) => (
                        <div key={stat.label} className={styles.statItem}>
                          <dd className={styles.statValue}>{stat.value}</dd>
                          <dt className={styles.statLabel}>{stat.label}</dt>
                        </div>
                      ))}
                    </dl>
                  </Reveal>
                </>
              )}
            </div>
          </aside>

          {/* Right canvas */}
          <div className={styles.canvas}>
            {/* Lead figure inside the canvas */}
            {lead && (
              <Reveal enabled immediate amount="md" delay={100} className={styles.leadFigure}>
                <div className={styles.leadFrame}>
                  <Image
                    src={lead.src}
                    alt={lead.alt}
                    width={lead.width}
                    height={lead.height}
                    sizes="(min-width: 1024px) 55vw, 90vw"
                    className={styles.leadImg}
                    priority
                  />
                </div>
              </Reveal>
            )}

            {/* Context */}
            <Reveal as="section" enabled amount="md" className={styles.beat} aria-label="Context">
              <h2 className={styles.beatHeading}>Context</h2>
              {study.context.map((para, i) => (
                <p key={i} className={styles.prose}>
                  {para}
                </p>
              ))}
            </Reveal>

            {/* Success criteria */}
            <Reveal
              as="section"
              enabled
              amount="md"
              className={styles.beat}
              aria-label="Success criteria"
            >
              <h2 className={styles.beatHeading}>Success criteria</h2>
              <ul className={styles.criteriaList}>
                {study.criteria.map((item, i) => (
                  <li key={i} className={styles.criteriaItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            {study.highlights?.map((item) => (
              <Reveal
                key={item.heading}
                as="section"
                enabled
                amount="md"
                className={styles.beat}
                aria-label={item.heading}
              >
                <h2 className={styles.beatHeading}>{item.heading}</h2>
                {item.body.map((para, i) => (
                  <p key={i} className={styles.prose}>
                    {para}
                  </p>
                ))}
                {item.figure && (
                  <Image
                    src={item.figure.src}
                    alt={item.figure.alt}
                    width={item.figure.width}
                    height={item.figure.height}
                    sizes="(min-width: 1024px) 55vw, 90vw"
                    className={styles.beatImg}
                    loading="lazy"
                  />
                )}
              </Reveal>
            ))}

            {/* Outcomes */}
            <Reveal as="section" enabled amount="md" className={styles.beat} aria-label="Outcomes">
              <h2 className={styles.beatHeading}>Outcomes</h2>
              {study.outcomes.map((para, i) => (
                <p key={i} className={styles.prose}>
                  {para}
                </p>
              ))}
            </Reveal>

            {images.map((img) => (
              <Reveal key={img.src} as="figure" enabled amount="md" className={styles.imageBlock}>
                {img.caption && (
                  <figcaption className={styles.imageCaption}>{img.caption}</figcaption>
                )}
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 1024px) 55vw, 90vw"
                  className={styles.imageImg}
                  loading="lazy"
                />
              </Reveal>
            ))}

            {/* Stack table */}
            <Reveal
              as="section"
              enabled
              amount="md"
              className={styles.beat}
              aria-label="Technology stack"
            >
              <h2 className={styles.beatHeading}>Stack</h2>
              <div className={styles.stackTable} role="table" aria-label="Technology stack">
                <div className={styles.stackHeader} role="row">
                  <span className={styles.stackHeaderCell} role="columnheader">
                    Technology
                  </span>
                  <span className={styles.stackHeaderCell} role="columnheader">
                    Use Case
                  </span>
                </div>
                {study.stack.map((row) => (
                  <div key={row.technology} className={styles.stackRow} role="row">
                    <span className={styles.stackTech} role="cell">
                      {row.technology}
                    </span>
                    <span className={styles.stackUse} role="cell">
                      {row.useCase}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Next case + CTA */}
            <div className={styles.endBlock}>
              {nextStudy && (
                <Reveal enabled amount="sm" className={styles.nextCase}>
                  <p className={styles.nextLabel}>Next case</p>
                  <Link href={`/work/${nextStudy.slug}`} className={styles.nextLink}>
                    <span className={styles.nextTitle}>{nextStudy.title}</span>
                    <span className={styles.nextArrow} aria-hidden>
                      &#8594;
                    </span>
                  </Link>
                </Reveal>
              )}
              <Reveal enabled amount="sm" delay={80} className={styles.cta}>
                <Button href="/contact" variant="secondary" size="md">
                  Start a project
                </Button>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
