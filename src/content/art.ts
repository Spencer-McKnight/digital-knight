import type { CoverArt } from '@/blocks/Statement/Statement';

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
