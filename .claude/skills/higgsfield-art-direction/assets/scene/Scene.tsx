'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { getImageProps } from 'next/image';
import { ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motion';
import type { PlateSpec, SceneManifest, SequenceSpec, SlotSpec, StageName, Window } from './types';
import styles from './Scene.module.scss';

/**
 * Scene: image plates, frame sequences and live DOM slots composed on one
 * canvas and driven by a single progress value.
 *
 *   The driver writes `--p` (0 to 1), `--px`/`--py` (pointer) and
 *   `data-stage` on the root. Layers read those in CSS, so scrolling never
 *   re-renders React. JS that needs progress subscribes with
 *   `useSceneProgress`.
 */

type Listener = (p: number) => void;

type SceneContext = {
  manifest: SceneManifest;
  subscribe: (fn: Listener) => () => void;
};

const Context = createContext<SceneContext | null>(null);

const MOBILE_QUERY = '(max-width: 47.99rem)';

function useScene() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('Scene parts must render inside <Scene>.');
  return ctx;
}

/** Runs `fn` on every progress update without re-rendering. */
export function useSceneProgress(fn: Listener) {
  const { subscribe } = useScene();
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  });
  useEffect(() => subscribe((p) => ref.current(p)), [subscribe]);
}

/** Progress span covered by a set of stages, before blending. */
export function stageSpan(manifest: SceneManifest, stages?: readonly StageName[]): [number, number] {
  const n = manifest.stages.length;
  if (!stages?.length) return [0, 1];
  const first = manifest.stages.indexOf(stages[0] ?? '');
  const last = manifest.stages.indexOf(stages.at(-1) ?? '');
  return [Math.max(0, first) / n, (last < 0 ? n : last + 1) / n];
}

// Enter and exit ramps are centred on stage boundaries. Open ends sit outside
// 0..1 so a layer never fades at the edges of the scene itself.
function windowStyle(manifest: SceneManifest, w: Window): CSSProperties {
  const [start, end] = stageSpan(manifest, w.stages);
  const f = w.enter === 'none' ? 0.0001 : (manifest.blend ?? 0.5) / manifest.stages.length;
  return {
    zIndex: w.z,
    '--depth': w.depth ?? 0,
    '--f': f,
    '--a': start <= 0 ? -1 : start - f / 2,
    '--b': end >= 1 ? 2 : end + f / 2,
  } as CSSProperties;
}

type SceneProps = {
  manifest: SceneManifest;
  children?: ReactNode;
  className?: string;
  /** For scenes that hold the LCP image. */
  priority?: boolean;
};

export function Scene({ manifest, children, className, priority = false }: SceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const listeners = useRef(new Set<Listener>());

  const subscribe = useCallback((fn: Listener) => {
    listeners.current.add(fn);
    return () => {
      listeners.current.delete(fn);
    };
  }, []);

  const ctx = useMemo(() => ({ manifest, subscribe }), [manifest, subscribe]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { stages, driver, rest = 1 } = manifest;

    const update = (p: number) => {
      root.style.setProperty('--p', p.toFixed(4));
      root.dataset.stage = stages[Math.min(stages.length - 1, Math.floor(p * stages.length))];
      listeners.current.forEach((fn) => fn(p));
    };

    if (driver.progress === 'static' || prefersReducedMotion()) {
      update(rest);
      return;
    }

    const scrub = driver.progress === 'scrub';
    const st = ScrollTrigger.create({
      trigger: root,
      start: scrub ? 'top top' : 'top bottom',
      end: scrub ? 'bottom bottom' : 'bottom top',
      onUpdate: (self) => update(self.progress),
    });
    update(st.progress);
    return () => st.kill();
  }, [manifest]);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage || !manifest.driver.pointer) return;
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;

    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      root.style.setProperty('--px', x.toFixed(4));
      root.style.setProperty('--py', y.toFixed(4));
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const aim = (nx: number, ny: number) => {
      tx = nx;
      ty = ny;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      aim(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const onLeave = () => aim(0, 0);

    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [manifest.driver.pointer]);

  const { ratio, mobileRatio, driver, stages, rest = 1 } = manifest;
  const style = {
    '--ratio': ratio,
    '--ratio-mobile': mobileRatio ?? ratio,
    '--length': driver.length ?? stages.length,
    ...(manifest.travel ? { '--travel': manifest.travel } : {}),
    ...(driver.progress === 'static' ? { '--p': rest } : {}),
  } as CSSProperties;

  return (
    <Context.Provider value={ctx}>
      <div
        ref={rootRef}
        className={[styles.root, className].filter(Boolean).join(' ')}
        style={style}
        data-scene={manifest.id}
        data-driver={driver.progress}
        data-stage={stages[0]}
      >
        <div ref={stageRef} className={styles.stage}>
          <div className={styles.canvas}>
            {manifest.plates.map((plate) => (
              <Plate key={plate.id} plate={plate} priority={priority} />
            ))}
            {manifest.sequences?.map((spec) => (
              <Sequence key={spec.id} spec={spec} />
            ))}
            {children}
          </div>
        </div>
      </div>
    </Context.Provider>
  );
}

function Plate({ plate, priority }: { plate: PlateSpec; priority: boolean }) {
  const { manifest } = useScene();
  const alt = plate.alt ?? '';
  const common = { alt, sizes: '100vw', fetchPriority: priority ? ('high' as const) : undefined };
  const {
    props: { srcSet: desktop, ...img },
  } = getImageProps({ ...common, ...plate.art });
  const mobile = plate.mobile ? getImageProps({ ...common, ...plate.mobile }).props : null;

  return (
    <picture
      className={styles.layer}
      style={windowStyle(manifest, plate)}
      data-plate={plate.id}
      data-enter={plate.enter ?? 'fade'}
    >
      {mobile && <source media={MOBILE_QUERY} srcSet={mobile.srcSet} sizes={mobile.sizes} />}
      <img {...img} srcSet={desktop} alt={alt} className={styles.img} />
    </picture>
  );
}

function Sequence({ spec }: { spec: SequenceSpec }) {
  const { manifest } = useScene();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLImageElement[]>([]);
  const progress = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const [start, end] = stageSpan(manifest, spec.stages);
    const local = Math.min(1, Math.max(0, (progress.current - start) / (end - start)));
    let i = Math.round(local * (spec.count - 1));
    while (i > 0 && !frames.current[i]?.naturalWidth) i--;
    const img = frames.current[i];
    if (!img?.naturalWidth) return;

    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  }, [manifest, spec]);

  useSceneProgress((p) => {
    progress.current = p;
    draw();
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pad = spec.pad ?? 3;

    // Coarse frames first so scrubbing works before the full set arrives.
    const load = () => {
      const slots: HTMLImageElement[] = new Array(spec.count);
      for (let step = 16; step >= 1; step /= 2) {
        for (let i = 0; i < spec.count; i += step) {
          if (slots[i]) continue;
          const img = new Image();
          img.decoding = 'async';
          img.onload = draw;
          img.src = spec.pattern.replace('{i}', String(i + 1).padStart(pad, '0'));
          slots[i] = img;
        }
      }
      frames.current = slots;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        load();
        io.disconnect();
      },
      { rootMargin: '100% 0px' },
    );
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw();
    });
    io.observe(canvas);
    ro.observe(canvas);
    return () => {
      io.disconnect();
      ro.disconnect();
      frames.current = [];
    };
  }, [spec, draw]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.layer}
      style={windowStyle(manifest, spec)}
      data-sequence={spec.id}
      data-enter={spec.enter ?? 'fade'}
      aria-hidden
    />
  );
}

type SceneSlotProps = {
  slot: SlotSpec;
  children: ReactNode;
  className?: string;
};

/** Real UI placed in canvas space. Inert while outside its stages. */
export function SceneSlot({ slot, children, className }: SceneSlotProps) {
  const { manifest } = useScene();
  const ref = useRef<HTMLDivElement>(null);
  const [x, y] = slot.at;
  const [mx, my] = slot.mobileAt ?? slot.at;
  const [ox, oy] = slot.origin ?? [0.5, 0.5];

  useSceneProgress((p) => {
    const el = ref.current;
    if (!el || !slot.stages?.length) return;
    const [start, end] = stageSpan(manifest, slot.stages);
    const active = p >= start && (p < end || end >= 1);
    if (el.inert === active) el.inert = !active;
  });

  const style = {
    ...windowStyle(manifest, slot),
    '--x': x,
    '--y': y,
    '--mx': mx,
    '--my': my,
    '--ox': ox,
    '--oy': oy,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={[styles.slot, className].filter(Boolean).join(' ')}
      style={style}
      data-slot={slot.id}
      data-enter={slot.enter ?? 'fade'}
    >
      {children}
    </div>
  );
}
