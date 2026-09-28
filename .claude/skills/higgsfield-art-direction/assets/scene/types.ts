/**
 * Scene manifest. One object describes both the generation plan (which plates
 * and stages to render, where slots need a surface) and the runtime scene.
 * Coordinates are fractions of the canvas, 0 to 1 from the top left.
 */

export type StageName = string;

export type Point = readonly [x: number, y: number];

export type Art = {
  src: string;
  width: number;
  height: number;
};

/** How a layer arrives when its first stage begins. Exit is always a fade. */
export type Enter = 'fade' | 'wipe' | 'iris' | 'none';

export type Window = {
  /** Contiguous stages the layer is visible in. Omit to show it throughout. */
  stages?: readonly StageName[];
  enter?: Enter;
  z: number;
  /** Parallax weight. 0 is still, 1 travels `travel` over the scene, negative moves against it. */
  depth?: number;
};

/** A full-canvas image layer. */
export type PlateSpec = Window & {
  id: string;
  art: Art;
  mobile?: Art;
  /** Empty for decorative plates, which is almost all of them. */
  alt?: string;
};

/** A full-canvas frame sequence scrubbed by progress through its stages. */
export type SequenceSpec = Window & {
  id: string;
  /** `{i}` is replaced by the 1-based frame number, zero padded to `pad`. */
  pattern: string;
  count: number;
  pad?: number;
};

/** A DOM anchor positioned in canvas space. Children are real UI. */
export type SlotSpec = Window & {
  id: string;
  at: Point;
  mobileAt?: Point;
  /** Which point of the slot box sits on `at`. Default centre. */
  origin?: Point;
};

export type Driver = {
  /**
   * scrub:  the section is `length` viewports tall and the canvas sticks while
   *         progress runs 0 to 1. Use for morphs and sequences.
   * pass:   progress runs 0 to 1 as the section crosses the viewport. Use for
   *         parallax and overlap that plays out in normal flow.
   * static: progress stays at `rest`.
   */
  progress: 'scrub' | 'pass' | 'static';
  length?: number;
  /** Adds --px and --py in [-1, 1] on fine pointers. */
  pointer?: boolean;
};

export type SceneManifest = {
  id: string;
  /** Canvas width / height. Art for the canvas must be rendered at this ratio. */
  ratio: number;
  mobileRatio?: number;
  stages: readonly StageName[];
  driver: Driver;
  /** Progress shown under reduced motion and for static scenes. Default 1. */
  rest?: number;
  /** Crossfade width as a fraction of one stage. Default 0.5. */
  blend?: number;
  /** Parallax travel at depth 1. Default 12svh. */
  travel?: string;
  plates: readonly PlateSpec[];
  sequences?: readonly SequenceSpec[];
  slots?: Readonly<Record<string, SlotSpec>>;
};
