'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { useMemo, useRef, useState, useEffect } from 'react';
import type { Group, Mesh } from 'three';
import styles from './ForgeSeal.module.scss';

/**
 * ForgeSeal — the Hero's single 3D element (`design.md` §10).
 *
 *   "Forged" matte metal. Soft lights. One ember edge. No glass, no confetti.
 *   A slowly rotating faceted seal, with a lone ember ring orbiting it at
 *   an angle — the single chromatic voice in the viewport.
 *
 * The geometry is an icosahedron at detail `0` — 20 triangular facets. The
 * faceting is the point: normals are flat, catching the single directional
 * light the way hammered metal does.
 *
 * Interaction: a gentle mouse-parallax on the group transform. No drag, no
 * orbit controls — the seal is a subject, not a toy.
 */
export function ForgeSeal() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <div className={styles.root} aria-hidden>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 4.6], fov: 38 }}
        frameloop={reduced ? 'demand' : 'always'}
      >
        <ambientLight intensity={0.25} color="#FFEDD7" />
        <directionalLight
          position={[3.5, 4, 2.5]}
          intensity={1.35}
          color="#FFEDD7"
        />
        <directionalLight
          position={[-2.5, -1, 2]}
          intensity={0.35}
          color="#DD6637"
        />
        <Environment preset="warehouse" environmentIntensity={0.18} />

        <Float
          speed={reduced ? 0 : 0.6}
          rotationIntensity={reduced ? 0 : 0.25}
          floatIntensity={reduced ? 0 : 0.35}
        >
          <Seal reduced={reduced} />
        </Float>
      </Canvas>
    </div>
  );
}

function Seal({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<Group>(null);
  const sealRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const { viewport } = useThree();

  // Parallax target updated from pointer position.
  const pointer = useMemo(() => ({ x: 0, y: 0 }), []);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [pointer]);

  useFrame((_, delta) => {
    if (reduced) return;
    const g = groupRef.current;
    const s = sealRef.current;
    const r = ringRef.current;
    if (!g || !s || !r) return;

    // Core slow rotation — the seal's heartbeat.
    s.rotation.y += delta * 0.25;
    s.rotation.x += delta * 0.08;

    // Ember ring orbits on a fixed tilt, slower than the body.
    r.rotation.z += delta * 0.35;

    // Group parallax — eased lerp toward the pointer.
    const targetY = pointer.x * 0.25;
    const targetX = pointer.y * -0.18;
    g.rotation.y += (targetY - g.rotation.y) * Math.min(1, delta * 3);
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, delta * 3);
  });

  // Size the seal to the available viewport — shrinks on narrow canvases,
  // never disappears on wide ones.
  const scale = Math.min(1.6, Math.max(0.85, viewport.width * 0.18));

  return (
    <group ref={groupRef} scale={scale}>
      <mesh ref={sealRef}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#1B1B1A"
          metalness={0.92}
          roughness={0.42}
          flatShading
        />
      </mesh>

      {/* Orbiting ember ring — the one chromatic voice. */}
      <mesh ref={ringRef} rotation={[0.6, 0.3, 0]}>
        <torusGeometry args={[1.55, 0.012, 16, 220]} />
        <meshBasicMaterial color="#DD6637" />
      </mesh>

      {/* A second, tighter iron ring at a counter angle for depth. */}
      <mesh rotation={[-0.35, 1.1, 0.2]}>
        <torusGeometry args={[1.28, 0.004, 12, 180]} />
        <meshBasicMaterial color="#FFEDD7" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}
