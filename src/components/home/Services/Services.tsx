'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { SERVICES } from './content';
import styles from './Services.module.scss';

type PhaseState = 'collapsed' | 'active' | 'incoming';

const phaseState = (i: number, active: number): PhaseState =>
  i < active ? 'collapsed' : i === active ? 'active' : 'incoming';

export function Services() {
  const rootRef = useRef<HTMLElement | null>(null);
  const phaseRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const getThresholdPx = useCallback((): number => {
    const content = phaseRefs.current[0]?.querySelector(
      `.${styles.content}`,
    ) as HTMLElement | null;
    if (content) {
      const v = parseFloat(getComputedStyle(content).top);
      if (Number.isFinite(v) && v > 0) return v;
    }
    return 120;
  }, []);

  const scrollToPhase = useCallback(
    (index: number) => {
      const phase = phaseRefs.current[index];
      if (!phase) return;
      const y = phase.getBoundingClientRect().top + window.scrollY - getThresholdPx() - 4;
      window.scrollTo({ top: y, behavior: 'smooth' });
    },
    [getThresholdPx],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const compute = () => {
      const threshold = getThresholdPx() + 8;
      let idx = 0;
      phaseRefs.current.forEach((phase, i) => {
        if (phase && phase.getBoundingClientRect().top <= threshold) idx = i;
      });
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    };

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: compute,
    });
    compute();

    return () => st.kill();
  }, [getThresholdPx]);

  return (
    <section
      id="services"
      data-ground="page"
      className={styles.root}
      aria-labelledby="services-heading"
      ref={rootRef}
    >
      <div className={styles.inner}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>The partnership</p>
          <h2 id="services-heading" className={styles.heading}>
            Systematic <span className={styles.ember}>Partnership</span>
          </h2>
        </header>

        <ol className={styles.stage} role="list" aria-label="Phases">
          {SERVICES.map((service, i) => {
            const state = phaseState(i, activeIndex);
            return (
              <li
                key={service.id}
                className={styles.phase}
                ref={(el) => {
                  phaseRefs.current[i] = el;
                }}
                data-state={state}
                data-service={service.id}
              >
                <button
                  type="button"
                  className={styles.monument}
                  onClick={() => scrollToPhase(i)}
                  aria-current={state === 'active' ? 'true' : undefined}
                  aria-label={`Open ${service.label}`}
                >
                  <span className={styles.monumentInner} aria-hidden="true">
                    <span className={styles.monumentGhost}>{service.label}</span>
                    <span className={styles.monumentLabel}>{service.label}</span>
                  </span>
                  <span className={styles.srOnly}>{service.label}</span>
                </button>

                <div
                  className={styles.content}
                  aria-hidden={state !== 'active'}
                  aria-labelledby={`service-${service.id}`}
                >
                  <span id={`service-${service.id}`} className={styles.srOnly}>
                    {service.label}
                  </span>
                  <div className={styles.contentInner}>
                    {service.lede ? <p className={styles.lede}>{service.lede}</p> : null}
                    {service.body?.map((p, idx) => (
                      <p key={idx} className={styles.body}>
                        {p}
                      </p>
                    ))}
                    {service.pop ? <Pop pop={service.pop} /> : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Pop({ pop }: { pop: NonNullable<(typeof SERVICES)[number]['pop']> }) {
  if (pop.kind === 'questions') {
    return (
      <div className={styles.popQuestions}>
        {pop.heading ? <p className={styles.popHeading}>{pop.heading}</p> : null}
        <ul className={styles.questionList} role="list">
          {pop.items.map((q) => (
            <li key={q} className={styles.question}>
              {q}
              <span className={styles.questionMark} aria-hidden="true">
                ?
              </span>
            </li>
          ))}
        </ul>
        {pop.coda ? <p className={styles.popCoda}>{pop.coda}</p> : null}
      </div>
    );
  }

  if (pop.kind === 'tags') {
    return (
      <div className={styles.popTags}>
        {pop.heading ? <p className={styles.popHeading}>{pop.heading}</p> : null}
        <ul className={styles.tagList} role="list">
          {pop.items.map((t) => (
            <li key={t} className={styles.tag}>
              {t}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <ul className={styles.marks} role="list">
      {pop.items.map((m) => (
        <li key={m} className={styles.mark}>
          <span className={styles.markDash} aria-hidden="true" />
          <span>{m}</span>
        </li>
      ))}
    </ul>
  );
}
