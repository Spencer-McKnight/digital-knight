/**
 * Central GSAP bootstrap.
 *
 * Registers plugins once and exposes a configured `gsap` for the rest of the
 * app. Import from here, never from the raw `gsap` entry — that keeps plugin
 * registration colocated with defaults and prevents tree-shake surprises.
 *
 *   import { gsap, ScrollTrigger } from '@/lib/gsap';
 *
 * SSR note: plugin registration is side-effect safe on the server for GSAP 3
 * as long as we don't touch `window`. `ScrollTrigger.refresh` must only be
 * called in effects.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// SplitText is a GSAP Club plugin — wire when the license is added to the
// repo. Registration stays commented to keep CI green without the asset:
//   import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  // gsap.registerPlugin(SplitText);

  gsap.defaults({
    ease: 'power3.out',
    duration: 0.5,
  });
}

export { gsap, ScrollTrigger };
