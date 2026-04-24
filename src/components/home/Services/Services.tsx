'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { SERVICES } from './content';
import styles from './Services.module.scss';

type Service = (typeof SERVICES)[number];
type PhaseState = 'collapsed' | 'active' | 'incoming';

const phaseState = (i: number, active: number): PhaseState =>
  i < active ? 'collapsed' : i === active ? 'active' : 'incoming';

export function Services() {
  const rootRef = useRef<HTMLElement | null>(null);
  const monumentRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [bgExtend, setBgExtend] = useState(false);
  const [isDesktopView, setIsDesktopView] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 48rem)');
    const apply = () => setIsDesktopView(mql.matches);
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  const getThreshold = useCallback(() => {
    if (window.matchMedia('(min-width: 48rem)').matches) return window.innerHeight / 2;
    const root = rootRef.current;
    if (root) {
      const v = parseFloat(getComputedStyle(root).getPropertyValue('--services-nav-offset'));
      if (Number.isFinite(v) && v > 0) return v + 8;
    }
    return 96;
  }, []);

  const scrollToPhase = useCallback(
    (index: number) => {
      const monument = monumentRefs.current[index];
      if (!monument) return;
      const y = monument.getBoundingClientRect().top + window.scrollY - getThreshold() + 4;
      window.scrollTo({ top: y, behavior: 'smooth' });
    },
    [getThreshold],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const compute = () => {
      const threshold = getThreshold();
      let idx = 0;
      monumentRefs.current.forEach((monument, i) => {
        if (monument && monument.getBoundingClientRect().top <= threshold) idx = i;
      });
      setActiveIndex((prev) => (prev === idx ? prev : idx));

      // Extend the bg-backtrack only after the active monument has been stuck
      // for at least its own height — otherwise it covers the outgoing
      // monument/content during the handoff. stuckDepth is measured as the
      // gap the sticky monument has opened between its own top and the top
      // of its phase container (grows from 0 once sticky kicks in).
      const active = monumentRefs.current[idx];
      const phase = active?.parentElement ?? null;
      let extend = false;
      if (active && phase) {
        const stuckDepth =
          active.getBoundingClientRect().top - phase.getBoundingClientRect().top;
        extend = stuckDepth > active.offsetHeight;
      }
      setBgExtend((prev) => (prev === extend ? prev : extend));
    };

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: compute,
    });
    compute();

    return () => st.kill();
  }, [getThreshold]);

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
                data-state={state}
                data-service={service.id}
                data-bg-extend={state === 'active' && bgExtend ? 'true' : undefined}
              >
                <button
                  type="button"
                  className={styles.monument}
                  ref={(el) => {
                    monumentRefs.current[i] = el;
                  }}
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
                  aria-hidden={isDesktopView && state !== 'active' ? true : undefined}
                  aria-labelledby={`service-${service.id}`}
                >
                  <span id={`service-${service.id}`} className={styles.srOnly}>
                    {service.label}
                  </span>
                  <ServiceBody service={service} />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function ServiceBody({ service }: { service: Service }) {
  return (
    <div className={styles.contentInner}>
      {service.lede ? <p className={styles.lede}>{service.lede}</p> : null}
      {service.body?.map((p, idx) => (
        <p key={idx} className={styles.body}>
          {p}
        </p>
      ))}
      {service.pop ? <Pop pop={service.pop} /> : null}
    </div>
  );
}

function Pop({ pop }: { pop: NonNullable<Service['pop']> }) {
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
