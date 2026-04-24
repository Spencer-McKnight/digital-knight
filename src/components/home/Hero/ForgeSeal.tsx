'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Group, Mesh, RectAreaLight } from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { useUiStore } from '@/store/ui';
import styles from './ForgeSeal.module.scss';

// RectAreaLight needs its uniforms primed once before any area light can
// shade correctly on MeshStandardMaterial. Safe to call on every import;
// the lib guards itself internally and the client-only canvas wrapper
// ensures this only ever runs in the browser.
if (typeof window !== 'undefined') {
  RectAreaLightUniformsLib.init();
}

/**
 * ForgeSeal — the Hero's single 3D element (`design.md` §10).
 *
 *   "Forged" matte metal. Soft lights. One ember edge. No glass, no confetti.
 *   A slowly rotating faceted seal, with a lone ember ring orbiting it at
 *   an angle — the single chromatic voice in the viewport.
 *
 * The geometry is an icosahedron at detail `0` — 20 triangular facets. The
 * faceting is the point: normals are flat, and a static five-angle rig
 * paints them the way hammered metal catches a workshop's fixed lamps —
 * the play on the surface comes from the seal turning past the lights,
 * not the lights moving past the seal.
 *
 * Interactions (the seal is a subject, but one you can nudge):
 *   · Pointer parallax — the group eases toward the cursor when idle.
 *   · Click + drag — direct manipulation: every pixel of drag rotates the
 *     seal 1:1 so the facet under the cursor travels with the cursor. Drag
 *     right and the front of the seal moves right; drag down and it pitches
 *     down. On release, the last sampled velocity becomes momentum that
 *     decays via frame-rate-independent friction.
 *   · Wheel over the seal — adds a decaying Y-axis gyro boost on top of
 *     page scroll.
 *   · Double-click / double-tap — a "forge strike": random burst velocity
 *     plus a brief scale pulse.
 *   · Idle return — after ~1.2s without input, base auto-rotation fades
 *     back in. Parallax only runs while not dragging.
 */
export function ForgeSeal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  // Optimistically true for SSR / first paint — we'd rather render one frame
  // and then suspend than pop in when the observer catches up.
  const [inView, setInView] = useState(true);
  // Flipped on the very first rendered frame (see `Seal` → `onReady`). Drives
  // the `.loaded` class that fades the canvas in, hiding the blank frame
  // between the Canvas mounting and WebGL actually drawing something.
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Pause the WebGL loop when the hero is off-screen. This is the single
  // biggest win — scrolling past kills the render cost entirely instead of
  // burning 60fps of GPU in the background. A 120px rootMargin resumes the
  // loop just before the seal re-enters view so there's no catch-up frame.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setInView(entry.isIntersecting);
      },
      { rootMargin: '120px 0px 120px 0px', threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const active = inView && !reduced;

  const rootClass = loaded ? `${styles.root} ${styles.loaded}` : styles.root;

  return (
    <div ref={rootRef} className={rootClass} aria-hidden>
      <Canvas
        // Capping DPR at 1.75 costs almost nothing perceptually on retina
        // screens while cutting roughly a quarter of the fragments shaded.
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 4.6], fov: 38 }}
        frameloop={active ? 'always' : 'demand'}
      >
        <Lighting />
        <Environment preset="warehouse" environmentIntensity={0.22} />

        <Float
          speed={reduced ? 0 : 0.6}
          rotationIntensity={reduced ? 0 : 0.25}
          floatIntensity={reduced ? 0 : 0.35}
        >
          <Seal reduced={reduced} active={active} onReady={() => setLoaded(true)} />
        </Float>
      </Canvas>
    </div>
  );
}

/**
 * Lighting — a studio softbox rig built from area lights.
 */
function Lighting() {
  // Aim every panel at the origin the moment it mounts.
  const aim = (l: RectAreaLight | null) => {
    if (l) l.lookAt(0, 0, 0);
  };

  // Shared across every panel — only position and intensity vary.
  const color = '#FFEDD7';
  const w = 2.2;
  const h = 2.2;

  // Nine softboxes around the subject. Front hemisphere carries the most
  // weight; the rear panels exist only to keep the silhouette off black.
  const panels: Array<{ p: [number, number, number]; i: number }> = [
    // Front bank — the viewer's hemisphere. Four panels fan around the
    // front so every camera-facing facet has a panel aligned with its
    // normal.
    { p: [0, 2.0, 3.4], i: 6.0 },
    { p: [0, -1.8, 3.4], i: 5.2 },
    { p: [2.6, 0.4, 3.2], i: 5.6 },
    { p: [-2.6, 0.4, 3.2], i: 5.6 },
    // Shoulders — rim/fill on the sides.
    { p: [3.4, 0.6, 0.4], i: 4.0 },
    { p: [-3.4, 0.6, 0.4], i: 4.0 },
    // Rear — kept low. Enough to stop the silhouette going black.
    { p: [0, 2.0, -3.2], i: 2.6 },
    { p: [0, -2.0, -3.2], i: 2.6 },
  ];

  return (
    <>
      {panels.map(({ p, i }, idx) => (
        <rectAreaLight
          key={idx}
          ref={aim}
          color={color}
          width={w}
          height={h}
          position={p}
          intensity={i}
        />
      ))}

      {/* On-axis key — a smaller panel between camera (z = 4.6) and the
          seal, centred on the view axis. Carries the head-on read.
          Intensity is higher to compensate for the smaller surface
          area. */}
      <rectAreaLight
        ref={aim}
        color={color}
        width={1.6}
        height={1.6}
        position={[0, 0, 4.0]}
        intensity={9.0}
      />
    </>
  );
}

function Seal({
  reduced,
  active,
  onReady,
}: {
  reduced: boolean;
  active: boolean;
  onReady: () => void;
}) {
  const groupRef = useRef<Group>(null);
  const sealRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const innerRingRef = useRef<Mesh>(null);
  const { viewport, gl } = useThree();

  // Intro reveal — the scene can't draw anything until WebGL has compiled the
  // programs and uploaded the environment map, which leaves a visible gap
  // between mount and first paint. Instead of popping in at full size we grow
  // the seal from 0 → baseScale with a gentle Y spin and a tenth as much on
  // X for depth. The eases are cubic Hermites chosen so that at t=1 each
  // axis's angular velocity already matches the steady-state cruise rate —
  // the intro merges into the resting rotation without the "stop + restart"
  // you get with a symmetric ease that lands at zero velocity. Timed from
  // the first frame useFrame actually runs.
  const CRUISE_Y = 0.175; // rad/s — must mirror the steady-state values below
  const CRUISE_X = 0.056;
  const durationMs = reduced ? 0 : 1800;
  const spinTurnsY = reduced ? 0 : 0.75;
  const spinTurnsX = reduced ? 0 : 0.075;
  // Terminal slope of the normalized ease. `ease(t) ∈ [0,1]` maps to angle
  // `spinTurns * 2π * ease(t)`, so its time-derivative at t=1 is
  // `spinTurns * 2π * ease'(1) / durationSec`, which we want to equal CRUISE.
  const durSec = Math.max(0.001, durationMs / 1000);
  const termSlopeY = spinTurnsY > 0 ? (CRUISE_Y * durSec) / (spinTurnsY * 2 * Math.PI) : 0;
  const termSlopeX = spinTurnsX > 0 ? (CRUISE_X * durSec) / (spinTurnsX * 2 * Math.PI) : 0;
  const intro = useRef({
    startMs: 0,
    durationMs,
    spinTurnsY,
    spinTurnsX,
    termSlopeY,
    termSlopeX,
    lastSpinY: 0, // delta-accumulated so the total equals spinTurnsY * 2π
    lastSpinX: 0, // delta-accumulated so the total equals spinTurnsX * 2π
    done: reduced,
    notified: false,
  }).current;

  // Hover flag — true only when R3F's raycaster reports a hit on the seal
  // group (the icosahedron or either ring). Drives both the cursor state
  // and whether pointerdown is allowed to start a drag. Empty canvas area
  // stays a plain arrow and accepts no gesture input.
  const hovered = useRef(false);

  // Eased parallax target. useRef rather than useMemo — these are mutable
  // values that never feed React's diffing, so useRef is the canonical
  // container and makes intent obvious at a glance.
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    // No parallax when off-screen or reduced-motion. Skipping attachment
    // entirely is cheaper than paying for a no-op listener on every mouse
    // move the user makes elsewhere on the page.
    if (!active) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [active]);

  // Interaction state lives outside the render graph so it can be mutated
  // cheaply every frame without re-rendering the component.
  const motion = useRef({
    vx: 0, // angular velocity x (drag-driven)
    vy: 0, // angular velocity y (drag-driven)
    vz: 0, // angular velocity z (burst-driven)
    wheelBoost: 0, // decaying wheel-driven spin
    dragging: false,
    moved: 0, // total pixel displacement in the current gesture
    lastX: 0,
    lastY: 0,
    lastT: 0,
    pulse: 0, // scale pulse envelope (0..1, decays)
    idleTime: 1.5, // seconds since last user interaction
    pointerId: -1,
  }).current;

  // Single source of truth for the cursor treatment over the seal. The
  // native `cursor` property is a no-op here — `_base.scss` globally
  // suppresses the system cursor and the custom `<Cursor>` component
  // paints every variant itself. That component resolves its variant
  // from (a) `data-cursor="grab"` on an ancestor of the event target
  // and (b) the pressed state, so we need to keep both that attribute
  // and the zustand-backed variant in lockstep with hover + drag:
  //
  //   grabbing   · a drag is in progress (even if the cursor has left
  //                the gem — the user is still holding it)
  //   grab       · hovering the gem, no drag yet
  //   default    · empty canvas, no interaction affordance
  //
  // The `data-cursor` attribute only lives on the canvas while we
  // actually want that treatment — otherwise the seal's canvas would
  // broadcast "grab" across its entire bounding box, which is larger
  // than the gem itself.
  const syncCursor = () => {
    const el = gl.domElement as HTMLCanvasElement | undefined;
    if (!el) return;
    const wantsGrab = motion.dragging || hovered.current;
    if (wantsGrab) el.setAttribute('data-cursor', 'grab');
    else el.removeAttribute('data-cursor');
    const { setCursorVariant } = useUiStore.getState();
    if (motion.dragging) setCursorVariant('grabbing');
    else if (hovered.current) setCursorVariant('grab');
    else setCursorVariant('default');
  };

  // Drag / wheel / double-tap handlers attached to the canvas element.
  useEffect(() => {
    const el = gl.domElement as HTMLCanvasElement;
    if (!el) return;

    let lastTapT = 0;

    // Defensively release any capture we still hold before starting a new
    // gesture — guards against rare cases where pointerup/cancel went missing
    // and the previous capture "leaked", which would otherwise stop the next
    // pointerdown from re-grabbing cleanly.
    const releaseIfHeld = () => {
      if (motion.pointerId >= 0) {
        try {
          el.releasePointerCapture(motion.pointerId);
        } catch {
          // no-op
        }
        motion.pointerId = -1;
      }
    };

    const onDown = (e: PointerEvent) => {
      // Pointerdown on empty canvas is a no-op — the seal is only
      // grabbable when the cursor is actually over it (as determined by
      // R3F's raycaster via the group-level pointer events below).
      if (!hovered.current) return;
      releaseIfHeld();
      motion.dragging = true;
      motion.moved = 0;
      motion.lastX = e.clientX;
      motion.lastY = e.clientY;
      motion.lastT = performance.now();
      motion.idleTime = 0;
      motion.pointerId = e.pointerId;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // Older browsers without capture support — interactions still work.
      }
      syncCursor();
    };

    const onMove = (e: PointerEvent) => {
      if (!motion.dragging) return;
      const s = sealRef.current;
      if (!s) return;
      const now = performance.now();
      const dt = Math.max(4, now - motion.lastT) / 1000; // seconds, floored to avoid spikes
      const dx = e.clientX - motion.lastX;
      const dy = e.clientY - motion.lastY;
      motion.moved += Math.hypot(dx, dy);

      // Direct manipulation — the facet under the cursor travels with the
      // cursor. Drag right and the front of the seal moves right; drag
      // down and it pitches down. The pixel-to-radian mapping is applied
      // straight to the mesh on every move so the rotation tracks the
      // cursor 1:1, with no velocity integration or friction drift between
      // frames.
      const k = 0.008;
      s.rotation.y += dx * k;
      s.rotation.x += dy * k;

      // Sample instantaneous velocity only to seed momentum on release —
      // same sign as the direct rotation above so the fling continues the
      // motion the user just initiated.
      motion.vy = (dx * k) / dt;
      motion.vx = (dy * k) / dt;
      motion.lastX = e.clientX;
      motion.lastY = e.clientY;
      motion.lastT = now;
      motion.idleTime = 0;
    };

    const endGesture = (e: PointerEvent, fired: 'up' | 'cancel') => {
      if (!motion.dragging && motion.pointerId !== e.pointerId) return;
      motion.dragging = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        // no-op
      }
      motion.pointerId = -1;

      // Stale-velocity guard: if the user paused before lifting, the last
      // sampled velocity is no longer representative of their intent. Zero
      // it out so we don't accidentally fling the seal when they just
      // wanted to let go.
      if (performance.now() - motion.lastT > 90) {
        motion.vx = 0;
        motion.vy = 0;
      }

      // Only "up" counts as a tap — cancels (OS gestures, context menus) don't.
      if (fired === 'up' && motion.moved < 6) {
        const now = performance.now();
        if (now - lastTapT < 320) {
          motion.vx += (Math.random() - 0.5) * 5.5;
          motion.vy += (Math.random() - 0.5) * 6.5;
          motion.vz += (Math.random() - 0.5) * 4;
          motion.pulse = 1;
          lastTapT = 0;
        } else {
          lastTapT = now;
        }
      }
      syncCursor();
    };

    const onUp = (e: PointerEvent) => endGesture(e, 'up');
    const onCancel = (e: PointerEvent) => endGesture(e, 'cancel');

    const onWheel = (e: WheelEvent) => {
      // Over-seal wheel adds a decaying Z-axis gyro boost on top of page scroll.
      motion.wheelBoost += Math.sign(e.deltaY) * 0.12;
      motion.idleTime = 0;
    };

    // If focus leaves the tab mid-drag (Alt-Tab, OS gesture), drop the gesture
    // so the next pointerdown starts fresh — prevents the cursor ever "losing"
    // its grabbing/grab affordance.
    const onWindowBlur = () => {
      motion.dragging = false;
      releaseIfHeld();
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onCancel);
    el.addEventListener('lostpointercapture', onCancel);
    el.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('blur', onWindowBlur);
    el.style.touchAction = 'pan-y';

    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onCancel);
      el.removeEventListener('lostpointercapture', onCancel);
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('blur', onWindowBlur);
      releaseIfHeld();
      // Make sure we don't leave a stale grab/grabbing treatment behind on
      // unmount or when the component re-effects — strip the attribute the
      // custom cursor resolves from and reset the store-backed variant.
      el.removeAttribute('data-cursor');
      hovered.current = false;
      motion.dragging = false;
      useUiStore.getState().setCursorVariant('default');
    };
  }, [gl, motion]);

  // Viewport-dependent base scale — shrinks on narrow canvases, never vanishes.
  const baseScale = useMemo(
    () => Math.min(1.6, Math.max(0.85, viewport.width * 0.18)),
    [viewport.width],
  );

  useFrame((_, delta) => {
    const g = groupRef.current;
    const s = sealRef.current;
    const r = ringRef.current;
    const ir = innerRingRef.current;
    if (!g || !s || !r || !ir) return;

    // First frame to actually execute is our "WebGL has drawn something"
    // signal — kick off the intro and let the parent fade the canvas in.
    if (!intro.notified) {
      intro.notified = true;
      intro.startMs = performance.now();
      onReady();
    }

    // Intro reveal: 0 → baseScale with a smooth easeInOutCubic, layered with
    // quintic Hermite spins on Y and X. The quintic is chosen so that
    // ease(1)=1, ease'(1) equals each axis's steady-state cruise rate
    // (normalized) — hand-off has matching velocity — and ease''(1)=0, so
    // there's no deceleration kink at the handoff either. With the terminal
    // acceleration pinned to zero, the curve's tail glides into steady
    // state rather than ramping down sharply over the last few frames.
    if (!intro.done) {
      const t = Math.min(1, (performance.now() - intro.startMs) / Math.max(1, intro.durationMs));
      // Scale is still a symmetric easeInOutCubic — it terminates at 1 and
      // stays at 1 in steady state, so zero terminal slope is correct here.
      const scaleEase = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      g.scale.setScalar(baseScale * scaleEase);

      // Quintic Hermite with h(0)=0, h(1)=1, h'(0)=m0, h'(1)=m1, h''(0)=h''(1)=0:
      //   h(t) = (10t³ - 15t⁴ + 6t⁵)
      //        + m0·(t - 6t³ + 8t⁴ - 3t⁵)
      //        + m1·(-4t³ + 7t⁴ - 3t⁵).
      // M0 is the initial slope — keep it modest so the peak velocity stays
      // low; m1 is per-axis so both axes land on their cruise rate together.
      const t2 = t * t;
      const t3 = t2 * t;
      const t4 = t3 * t;
      const t5 = t4 * t;
      const base = 10 * t3 - 15 * t4 + 6 * t5;
      const coefM0 = t - 6 * t3 + 8 * t4 - 3 * t5;
      const coefM1 = -4 * t3 + 7 * t4 - 3 * t5;
      const hermite = (m0: number, m1: number) => base + m0 * coefM0 + m1 * coefM1;
      const M0 = 0.55; // gentler start — lower peak, motion spreads further into the tail
      const easeY = hermite(M0, intro.termSlopeY);
      const easeX = hermite(M0, intro.termSlopeX);

      const targetY = intro.spinTurnsY * 2 * Math.PI * easeY;
      const targetX = intro.spinTurnsX * 2 * Math.PI * easeX;
      s.rotation.y += targetY - intro.lastSpinY;
      s.rotation.x += targetX - intro.lastSpinX;
      intro.lastSpinY = targetY;
      intro.lastSpinX = targetX;

      if (t >= 1) {
        intro.done = true;
        // Park idleTime at the plateau so the steady-state base rotation
        // immediately runs at full cruise — the ramp would otherwise
        // accelerate from 0 and produce the "stop → restart" stutter.
        motion.idleTime = 1.2;
      } else {
        // While the intro is running, skip the rest of the frame logic —
        // no drag, no parallax, no pulse. Rings keep spinning though, so
        // the scene feels alive from the very first frame.
        r.rotation.z += delta * 0.245;
        r.rotation.y += delta * 0.028;
        ir.rotation.y -= delta * 0.028;
        ir.rotation.z -= delta * 0.035;
        return;
      }
    }

    if (reduced) {
      g.scale.setScalar(baseScale);
      return;
    }

    // Ember ring — original behaviour: a quiet, constant Z-orbit, independent
    // of what the user is doing to the seal itself. Plus a very subtle Y
    // drift so the ring's tilt breathes over time.
    r.rotation.z += delta * 0.245;
    r.rotation.y += delta * 0.028;

    // Inner iron ring — complementary counter-drift. Equally subtle, opposite
    // sign, so the two rings quietly circle past each other.
    ir.rotation.y -= delta * 0.028;
    ir.rotation.z -= delta * 0.035;

    // Hoist the per-frame exponent once. Math.pow isn't expensive but this
    // is the cheapest the arithmetic can be and reads more clearly.
    const dt60 = delta * 60;
    motion.wheelBoost *= Math.pow(0.9, dt60);

    if (motion.dragging) {
      // While the user is dragging, the seal's rotation is written directly
      // in onMove. Don't touch it here — no base rotation, no velocity
      // integration, no parallax — so the seal tracks the cursor exactly.
      // Wheel boost still composes so invented gestures keep working.
      if (motion.wheelBoost) s.rotation.y += motion.wheelBoost * delta * 0.9;
      g.scale.setScalar(baseScale);
      return;
    }

    // Frame-rate-independent friction. ~0.93 per 60fps frame ≈ 0.2s half-life.
    const friction = Math.pow(0.93, dt60);
    motion.vx *= friction;
    motion.vy *= friction;
    motion.vz *= friction;

    // Idle-saturation short-circuit. Once all user-driven signals have
    // decayed below a hair and the base-rotation ramp is already at its
    // plateau, skip the full mixing path — only the steady auto-rotation
    // and the cheap parallax lerp need to run. This keeps the steady-state
    // frame cost minimal while still feeling alive.
    const EPS = 1e-4;
    motion.idleTime += delta;
    const stillIdle =
      motion.idleTime > 1.2 &&
      motion.pulse === 0 &&
      Math.abs(motion.vx) < EPS &&
      Math.abs(motion.vy) < EPS &&
      Math.abs(motion.vz) < EPS &&
      Math.abs(motion.wheelBoost) < EPS;

    if (stillIdle) {
      s.rotation.y += 0.175 * delta;
      s.rotation.x += 0.056 * delta;
    } else {
      const idleMix = Math.min(1, motion.idleTime / 1.2);
      const baseX = 0.056 * idleMix;
      const baseY = 0.175 * idleMix;
      s.rotation.y += (baseY + motion.vy) * delta + motion.wheelBoost * delta * 0.9;
      s.rotation.x += (baseX + motion.vx) * delta;
      s.rotation.z += motion.vz * delta;
    }

    // Pointer parallax on the group runs when the user isn't driving it.
    const lerp = Math.min(1, delta * 2.4);
    const targetY = pointer.current.x * 0.22;
    const targetX = pointer.current.y * -0.16;
    g.rotation.y += (targetY - g.rotation.y) * lerp;
    g.rotation.x += (targetX - g.rotation.x) * lerp;

    // Forge-strike pulse — sin envelope over the decaying pulse value.
    if (motion.pulse > 0) {
      motion.pulse = Math.max(0, motion.pulse - delta * 2.4);
      const k = 1 + Math.sin(motion.pulse * Math.PI) * 0.065;
      g.scale.setScalar(baseScale * k);
    } else {
      g.scale.setScalar(baseScale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* The central gem is the only part of the scene that can be grabbed.
          R3F raycasts against just this mesh (the rings below opt out with
          raycast={() => null}), so hover / grab / drag all fire only when
          the pointer is truly over the faceted body. */}
      <mesh
        ref={sealRef}
        onPointerOver={() => {
          hovered.current = true;
          syncCursor();
        }}
        onPointerOut={() => {
          hovered.current = false;
          syncCursor();
        }}
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#1B1B1A"
          metalness={0.92}
          roughness={0.42}
          flatShading
        />
      </mesh>

      {/* Orbiting ember ring — the one chromatic voice. Opted out of
          raycasting so it doesn't block hover detection on the gem behind
          it or independently trigger the grab cursor itself. */}
      <mesh ref={ringRef} rotation={[0.6, 0.3, 0]} raycast={() => null}>
        <torusGeometry args={[1.4, 0.012, 16, 220]} />
        <meshBasicMaterial color="#DD6637" />
      </mesh>

      {/* A second, tighter iron ring at a counter angle for depth. */}
      <mesh ref={innerRingRef} rotation={[-0.35, 1.1, 0.2]} raycast={() => null}>
        <torusGeometry args={[1.28, 0.01, 12, 180]} />
        <meshBasicMaterial color="#FFEDD7" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}
