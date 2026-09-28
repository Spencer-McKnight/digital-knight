'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import type { NightlightScene, Pt } from './scene';
import styles from './Nightlight.module.scss';

export type { Pt } from './scene';

/** Where the light rests and where the knight hides, per rendition of the art. */
export type NightlightArt = {
  aspect: number;
  rest: Pt;
  knight?: Pt;
};

/** The still's `object-position`, so the canvas crops exactly as CSS does. */
function focalOf(img: HTMLImageElement): Pt {
  const parts = getComputedStyle(img).objectPosition.split(' ');
  const pct = (v: string | undefined) => (v && v.endsWith('%') ? parseFloat(v) / 100 : 0.5);
  return [pct(parts[0]), pct(parts[1])];
}

type Props = {
  /** The element whose pointer moves the light. */
  host: RefObject<HTMLElement | null>;
  /** The still the canvas sits over. Its current source is the texture. */
  image: RefObject<HTMLImageElement | null>;
  arts: ReadonlyArray<NightlightArt>;
  /** Loupe: the second picture the pool of light shows. */
  after?: RefObject<HTMLImageElement | null>;
  /** Lets a block drive the light itself (Loupe). */
  onScene?: (scene: NightlightScene | null) => void;
  /** When false the block handles the pointer; the scene only renders. */
  follow?: boolean;
  className?: string;
};

const LAG = { element: 220, scene: 560, epic: 1400 };

const loaded = (img: HTMLImageElement | null): img is HTMLImageElement => !!img && img.complete && img.naturalWidth > 0;

/**
 * A plain copy of the still's current source, decoded. An <img> picked from a
 * srcset reports a density-corrected size, which would not match the bitmap
 * WebGL uploads. The copy comes from cache, so nothing downloads twice.
 */
async function bitmapOf(img: HTMLImageElement): Promise<HTMLImageElement> {
  const copy = new Image();
  copy.decoding = 'async';
  copy.src = img.currentSrc || img.src;
  await copy.decode();
  return copy;
}

function whenLoaded(img: HTMLImageElement, done: () => void): () => void {
  if (img.complete && img.naturalWidth > 0) {
    done();
    return () => {};
  }
  img.addEventListener('load', done, { once: true });
  return () => img.removeEventListener('load', done);
}

/**
 * The one 3D scene. Loaded after first paint, only where a block asks for it,
 * over a still of the same photograph in the same box. It fades in after its
 * first frame and removes itself if anything fails, so the still is always
 * what a visitor falls back to. Reduced motion never mounts it.
 */
export function Nightlight({ host, image, arts, after, onScene, follow = true, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [source, setSource] = useState('');
  const onSceneRef = useRef(onScene);
  useEffect(() => {
    onSceneRef.current = onScene;
  }, [onScene]);

  // Arm once the still has painted and the browser is idle.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;
    const img = image.current;
    if (!img) return;

    let idle = 0;
    const arm = () => {
      const run = () => {
        setSource(img.currentSrc);
        setArmed(true);
      };
      idle = typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(run, { timeout: 1200 }) : window.setTimeout(run, 200);
    };
    const stopWaiting = whenLoaded(img, arm);

    // The picture swaps sources when the viewport crosses the art-direction
    // breakpoint; the scene rebuilds with the new texture.
    const onSwap = () => setSource(img.currentSrc);
    img.addEventListener('load', onSwap);

    const onReduce = () => reduce.matches && setFailed(true);
    reduce.addEventListener('change', onReduce);

    return () => {
      stopWaiting();
      img.removeEventListener('load', onSwap);
      reduce.removeEventListener('change', onReduce);
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
    };
  }, [image]);

  useEffect(() => {
    if (!armed || failed || !source) return;
    const canvas = canvasRef.current;
    const img = image.current;
    const hostEl = host.current;
    if (!canvas || !loaded(img) || !hostEl) return;

    let scene: NightlightScene | null = null;
    let cancelled = false;
    const cleanups: Array<() => void> = [];
    const aspect = img.naturalWidth / img.naturalHeight;
    const art = arts.reduce((best, a) => (Math.abs(a.aspect - aspect) < Math.abs(best.aspect - aspect) ? a : best));
    const fine = window.matchMedia('(pointer: fine)').matches;
    const knight = fine ? undefined : art.knight;

    const start = async () => {
      const afterImg = after?.current ?? null;
      if (after && !loaded(afterImg)) {
        await new Promise<void>((resolve) => (afterImg ? whenLoaded(afterImg, resolve) : resolve()));
      }
      const [{ createNightlight }, texture, afterTexture] = await Promise.all([
        import('./scene'),
        bitmapOf(img),
        after && loaded(afterImg) ? bitmapOf(afterImg) : Promise.resolve(null),
      ]);
      if (cancelled) return;

      scene = createNightlight({
        canvas,
        image: texture,
        focal: focalOf(img),
        restAt: art.rest,
        startAt: knight,
        after: afterImg && afterTexture ? { image: afterTexture, focal: focalOf(afterImg) } : undefined,
        onFirstFrame: () => setReady(true),
        onLost: () => setFailed(true),
      });
      const s = scene;
      onSceneRef.current?.(s);

      const box = (e: PointerEvent): Pt => {
        const r = canvas.getBoundingClientRect();
        return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
      };

      if (!follow) {
        // The block drives the light.
      } else if (fine) {
        const move = (e: PointerEvent) => e.pointerType === 'mouse' && s.aim(box(e), LAG.element);
        const leave = () => s.rest(LAG.scene);
        hostEl.addEventListener('pointermove', move);
        hostEl.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          hostEl.removeEventListener('pointermove', move);
          hostEl.removeEventListener('pointerleave', leave);
        });
      } else if (knight) {
        // The canvas fades in with the light on the knight, then makes one
        // slow pass to rest and stays still.
        const t = window.setTimeout(() => s.pass(knight, art.rest, LAG.epic), LAG.epic);
        cleanups.push(() => window.clearTimeout(t));
      }

      const ro = new ResizeObserver(() => s.resize());
      ro.observe(canvas);
      let onscreen = true;
      const io = new IntersectionObserver(([entry]) => {
        onscreen = !!entry?.isIntersecting;
        s.pause(!onscreen || document.hidden);
      });
      io.observe(canvas);
      const vis = () => s.pause(!onscreen || document.hidden);
      document.addEventListener('visibilitychange', vis);
      cleanups.push(() => {
        ro.disconnect();
        io.disconnect();
        document.removeEventListener('visibilitychange', vis);
      });
    };

    start().catch(() => setFailed(true));

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      onSceneRef.current?.(null);
      scene?.destroy();
      setReady(false);
    };
  }, [armed, failed, source, arts, after, host, image, follow]);

  if (!armed || failed) return null;

  return (
    <canvas
      key={source}
      ref={canvasRef}
      className={className ? `${styles.root} ${className}` : styles.root}
      data-ready={ready || undefined}
      aria-hidden="true"
    />
  );
}
