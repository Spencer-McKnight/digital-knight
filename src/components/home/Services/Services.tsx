'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { SERVICES } from './content';
import styles from './Services.module.scss';

type PhaseState = 'collapsed' | 'active' | 'incoming';

const phaseState = (i: number, active: number): PhaseState =>
  i < active ? 'collapsed' : i === active ? 'active' : 'incoming';

type Zones = {
  starts: number[];
  total: number;
};

export function Services() {
  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const phaseRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const zonesRef = useRef<Zones | null>(null);
  const lastIdxRef = useRef(-1);

  const measureAndLayout = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const vh = window.innerHeight;

    const heights = phaseRefs.current.map((phase) => {
      const inner = phase?.querySelector(`.${styles.contentInner}`) as HTMLElement | null;
      // offsetHeight reports natural layout height even when clipped by an
      // overflow:hidden ancestor.
      return Math.max(inner?.offsetHeight ?? 0, 1);
    });

    // Each phase's scroll zone matches its measured content height, so dwell
    // scales naturally with how much there is to read.
    const starts: number[] = [];
    let acc = 0;
    heights.forEach((l) => {
      starts.push(acc);
      acc += l;
    });

    zonesRef.current = { starts, total: acc };
    track.style.height = `${acc + vh}px`;
    ScrollTrigger.refresh();
  }, []);

  useEffect(() => {
    measureAndLayout();

    const observer = new ResizeObserver(() => measureAndLayout());
    phaseRefs.current.forEach((phase) => {
      const inner = phase?.querySelector(`.${styles.contentInner}`);
      if (inner) observer.observe(inner);
    });

    window.addEventListener('resize', measureAndLayout);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measureAndLayout);
    };
  }, [measureAndLayout]);

  const scrollToPhase = useCallback((index: number) => {
    const track = trackRef.current;
    const zones = zonesRef.current;
    if (!track || !zones) return;
    const rect = track.getBoundingClientRect();
    const trackTop = rect.top + window.scrollY;
    const start = zones.starts[index] ?? 0;
    window.scrollTo({
      top: trackTop + start + 4,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const zones = zonesRef.current;
        if (!zones) return;
        const scrollable = track.offsetHeight - window.innerHeight;
        const scrolled = self.progress * scrollable;

        let idx = 0;
        for (let i = zones.starts.length - 1; i >= 0; i--) {
          const s = zones.starts[i];
          if (s !== undefined && scrolled >= s) {
            idx = i;
            break;
          }
        }

        if (idx !== lastIdxRef.current) {
          lastIdxRef.current = idx;
          setActiveIndex(idx);
        }
      },
    });

    return () => st.kill();
  }, []);

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

        <div ref={trackRef} className={styles.track}>
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
