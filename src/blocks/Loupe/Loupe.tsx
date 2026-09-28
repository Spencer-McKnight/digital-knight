'use client';

import Image from 'next/image';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { BlockHead } from '@/components/BlockHead/BlockHead';
import { Nightlight, type NightlightArt } from '@/components/Nightlight/Nightlight';
import type { NightlightScene } from '@/components/Nightlight/scene';
import type { Picture } from '@/content/types';
import styles from './Loupe.module.scss';

export type LoupeProps = {
  folio: string;
  title: string;
  lede?: string;
  before: Picture;
  after: Picture;
  beforeLabel: string;
  afterLabel: string;
  /** Label for the range input that sets the light by hand. */
  rangeLabel: string;
};

const LAG = 220;

/**
 * What changed, under the light. The before screenshot fills the frame; the
 * pool of light shows the after. A range input sets it by hand (and is the
 * whole interaction when the light cannot run). On touch screens scrolling
 * carries the light across once.
 */
export function Loupe({ folio, title, lede, before, after, beforeLabel, afterLabel, rangeLabel }: LoupeProps) {
  const host = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLImageElement>(null);
  const afterRef = useRef<HTMLImageElement>(null);
  const sceneRef = useRef<NightlightScene | null>(null);
  const [scene, setScene] = useState<NightlightScene | null>(null);
  const [value, setValue] = useState(50);
  const rangeId = useId();

  const arts = useMemo<NightlightArt[]>(() => [{ aspect: before.width / before.height, rest: [0.5, 0.5] }], [before]);

  const onScene = useCallback((s: NightlightScene | null) => {
    sceneRef.current = s;
    setScene(s);
  }, []);

  const light = useCallback((x: number, y = 0.5, lag = LAG) => {
    const s = sceneRef.current;
    if (!s) return;
    s.setReveal(1);
    s.aim([x, y], lag);
  }, []);

  // The loupe's first pass: once, at epic speed, when it first comes into view.
  useEffect(() => {
    const el = host.current;
    if (!el || !scene) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        scene.setReveal(1);
        scene.pass([0.12, 0.42], [0.5, 0.5], 1400);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [scene]);

  // Fine pointers hold the light directly.
  useEffect(() => {
    const el = host.current;
    if (!el || !scene || !window.matchMedia('(pointer: fine)').matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      light((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    };
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  }, [scene, light]);

  // Touch: scrolling carries the light across once, reading real scroll.
  useEffect(() => {
    const el = host.current;
    if (!el || !scene || window.matchMedia('(pointer: fine)').matches) return;
    let done = false;
    const onScroll = () => {
      if (done) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(Math.max((vh * 0.85 - r.top) / (vh * 0.7), 0), 1);
      if (p <= 0) return;
      setValue(Math.round(p * 100));
      light(p, 0.5, 0);
      if (p >= 1) done = true;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scene, light]);

  const onRange = (v: number) => {
    setValue(v);
    light(v / 100);
  };

  return (
    <section className={styles.root} data-ground="carbon">
      <div className={styles.inner}>
        <BlockHead folio={folio} title={title} lede={lede} className={styles.head} />

        <div
          ref={host}
          className={styles.stage}
          data-lit={scene ? '' : undefined}
          style={{ aspectRatio: `${before.width} / ${before.height}` }}
        >
          <Image
            ref={beforeRef}
            src={before.src}
            alt={before.alt}
            fill
            sizes="(min-width: 90rem) 86rem, 100vw"
            className={styles.before}
          />
          <div className={styles.afterLayer} style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
            <Image
              ref={afterRef}
              src={after.src}
              alt={after.alt}
              fill
              sizes="(min-width: 90rem) 86rem, 100vw"
              className={styles.after}
            />
          </div>
          <Nightlight host={host} image={beforeRef} arts={arts} after={afterRef} onScene={onScene} follow={false} />
          <span className={styles.tagBefore}>{beforeLabel}</span>
          <span className={styles.tagAfter}>{afterLabel}</span>
        </div>

        <div className={styles.control}>
          <label htmlFor={rangeId} className={styles.rangeLabel}>
            {rangeLabel}
          </label>
          <input
            id={rangeId}
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => onRange(Number(e.target.value))}
            className={styles.range}
          />
        </div>
      </div>
    </section>
  );
}
