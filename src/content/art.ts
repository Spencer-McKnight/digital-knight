import type { CoverArt } from '@/blocks/Statement/Statement';
import type { Picture } from './types';

/**
 * Where things sit in each photograph, in image coordinates (0 to 1, origin
 * top left). Nightlight rests its light on the lit sheet and, on touch
 * screens, starts its pass from the knight.
 */
export function coverArt(alt: string): CoverArt {
  return {
    alt,
    wide: {
      src: '/images/studio-night/cover-21x9.avif',
      width: 2880,
      height: 1222,
      rest: [0.58, 0.56],
      knight: [0.775, 0.44],
    },
    tall: {
      src: '/images/studio-night/cover-4x5.avif',
      width: 1600,
      height: 1986,
      rest: [0.56, 0.55],
      knight: [0.755, 0.485],
    },
  };
}

const scene = (name: string, alt: string): Picture => ({
  src: `/images/studio-night/${name}.avif`,
  width: 2752,
  height: 1536,
  alt,
});

/** Studio-night scenes 3 to 6, and where each one's object is pressed. */
export const scenes = {
  orientation: (alt: string) => ({ picture: scene('orientation', alt), at: [0.75, 0.52] as const }),
  proof: (alt: string) => ({ picture: scene('proof', alt), at: [0.33, 0.57] as const }),
  offer: (alt: string) => ({ picture: scene('offer', alt), at: [0.42, 0.66] as const }),
  conversation: (alt: string) => ({ picture: scene('conversation', alt), at: [0.66, 0.5] as const }),
};
