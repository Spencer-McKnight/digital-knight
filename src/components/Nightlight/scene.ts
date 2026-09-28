import {
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  NoColorSpace,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector4,
  WebGLRenderer,
} from 'three';

/** Image coordinates, 0 to 1, origin top left. */
export type Pt = readonly [number, number];

export type NightlightScene = {
  resize: () => void;
  /** Aim the light at a point in the box (0 to 1, origin top left). */
  aim: (box: Pt, lagMs: number) => void;
  rest: (lagMs: number) => void;
  /** An eased pass from one image point to another, for coarse pointers. */
  pass: (from: Pt, to: Pt, durationMs: number) => void;
  /** Loupe: how far the light has travelled across, 0 to 1. */
  setReveal: (amount: number) => void;
  pause: (paused: boolean) => void;
  destroy: () => void;
};

type Options = {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  /** Same CSS object-position the still uses. */
  focal: Pt;
  /** Where the designed key sits, in image coordinates. */
  restAt: Pt;
  /** Hold the light here, room dimmed, for the first frame. */
  startAt?: Pt;
  after?: { image: HTMLImageElement; focal: Pt };
  onFirstFrame: () => void;
  onLost: () => void;
};

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Normals come from the photograph: a Sobel pass on luminance read from a
// blurred mip level. Exposure drops 1.3 stops; a hard point light with a
// Lambert term and inverse-square falloff lifts it back and develops the
// shadow detail already in the file. Grain goes back over the result.
// At rest (uRest = 1) the output is the photograph itself, lit by its own
// key, so the canvas fades in over the still without a visible change.
const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform sampler2D uImage;
  uniform sampler2D uAfter;
  uniform vec4 uCrop;
  uniform vec4 uCropAfter;
  uniform vec2 uTexel;
  uniform vec2 uLight;
  uniform float uAspect;
  uniform float uReveal;
  uniform float uStrength;
  uniform float uRest;

  varying vec2 vUv;

  const float EXPOSURE = 0.406;
  const float BIAS = 2.5;
  const float BUMP = 2.2;
  const float LIGHT_Z = 0.22;
  const float RADIUS = 0.2;
  const float GRAIN = 0.028;

  float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
  float lum(vec2 uv) { return luma(texture2D(uImage, uv, BIAS).rgb); }
  vec3 toLinear(vec3 c) { return pow(c, vec3(2.2)); }
  vec3 toScreen(vec3 c) { return pow(max(c, 0.0), vec3(1.0 / 2.2)); }

  void main() {
    vec2 box = vec2(vUv.x, 1.0 - vUv.y);
    vec2 uv = uCrop.xy + box * uCrop.zw;

    vec2 t = uTexel * 5.0;
    float tl = lum(uv + vec2(-t.x, -t.y));
    float tc = lum(uv + vec2(0.0, -t.y));
    float tr = lum(uv + vec2(t.x, -t.y));
    float ml = lum(uv + vec2(-t.x, 0.0));
    float mr = lum(uv + vec2(t.x, 0.0));
    float bl = lum(uv + vec2(-t.x, t.y));
    float bc = lum(uv + vec2(0.0, t.y));
    float br = lum(uv + vec2(t.x, t.y));
    float gx = (tr + 2.0 * mr + br) - (tl + 2.0 * ml + bl);
    float gy = (bl + 2.0 * bc + br) - (tl + 2.0 * tc + tr);
    vec3 normal = normalize(vec3(-gx * BUMP, -gy * BUMP, 1.0));

    vec3 surface = vec3(uv.x * uAspect, uv.y, 0.0);
    vec3 light = vec3(uLight.x * uAspect, uLight.y, LIGHT_Z);
    vec3 toLight = light - surface;
    float d2 = dot(toLight.xy, toLight.xy);
    float lambert = max(dot(normal, normalize(toLight)), 0.0);
    float falloff = 1.0 / (1.0 + d2 / (RADIUS * RADIUS));
    float pool = clamp(pow(lambert * falloff, 1.35) * 1.7, 0.0, 1.0) * uStrength;

    vec3 before = toLinear(texture2D(uImage, uv).rgb);
    vec3 dark = before * EXPOSURE;
    vec3 lit;

    if (uReveal > 0.5) {
      // Loupe: the room dims as the light comes up, and the pool shows the after.
      vec2 uvAfter = uCropAfter.xy + box * uCropAfter.zw;
      vec3 after = toLinear(texture2D(uAfter, uvAfter).rgb);
      float edge = 1.0 - smoothstep(RADIUS * 0.95, RADIUS * 1.1, sqrt(d2));
      vec3 room = before * mix(1.0, EXPOSURE, uStrength);
      lit = mix(room, after * (0.88 + 0.22 * lambert), edge * uStrength);
    } else {
      vec3 developed = pow(before, vec3(0.62)) * 1.06;
      lit = mix(dark, developed, pool);
    }

    float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
    vec3 held = toScreen(lit) + n * GRAIN;
    gl_FragColor = vec4(mix(held, texture2D(uImage, uv).rgb, uRest), 1.0);
  }
`;

/** The `object-fit: cover` window of an image inside a box, as x, y, width, height in image space. */
export function coverCrop(boxW: number, boxH: number, imgW: number, imgH: number, focal: Pt): Vector4 {
  const boxA = boxW / boxH;
  const imgA = imgW / imgH;
  if (boxA > imgA) {
    const h = imgA / boxA;
    return new Vector4(0, (1 - h) * focal[1], 1, h);
  }
  const w = boxA / imgA;
  return new Vector4((1 - w) * focal[0], 0, w, 1);
}

function texture(image: HTMLImageElement): Texture {
  const tex = new Texture(image);
  tex.flipY = false;
  tex.colorSpace = NoColorSpace;
  tex.generateMipmaps = true;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.magFilter = LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

const houseCurve = (x: number) => {
  // cubic-bezier(0.16, 1, 0.3, 1), solved for y by bisection on x.
  const bez = (t: number, a: number, b: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2;
    if (bez(mid, 0.16, 0.3) < x) lo = mid;
    else hi = mid;
  }
  return bez((lo + hi) / 2, 1, 1);
};

export function createNightlight(opts: Options): NightlightScene {
  const { canvas, image, focal, restAt, startAt, after } = opts;

  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  const imageTex = texture(image);
  const afterTex = after ? texture(after.image) : imageTex;

  const material = new ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uImage: { value: imageTex },
      uAfter: { value: afterTex },
      uCrop: { value: new Vector4(0, 0, 1, 1) },
      uCropAfter: { value: new Vector4(0, 0, 1, 1) },
      uTexel: { value: new Vector2(1 / image.naturalWidth, 1 / image.naturalHeight) },
      uLight: { value: new Vector2((startAt ?? restAt)[0], (startAt ?? restAt)[1]) },
      uAspect: { value: image.naturalWidth / image.naturalHeight },
      uReveal: { value: after ? 1 : 0 },
      uStrength: { value: after ? 0 : 1 },
      uRest: { value: after ? 0 : 1 },
    },
  });

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new PlaneGeometry(2, 2);
  scene.add(new Mesh(geometry, material));

  const u = material.uniforms as {
    uCrop: { value: Vector4 };
    uCropAfter: { value: Vector4 };
    uLight: { value: Vector2 };
    uStrength: { value: number };
    uRest: { value: number };
  };

  const origin = startAt ?? restAt;
  let current: [number, number] = [origin[0], origin[1]];
  let target: [number, number] = [origin[0], origin[1]];
  let rest = after || startAt ? 0 : 1;
  let restTarget = rest;
  let lag = 220;
  let tween: { from: Pt; to: Pt; start: number; duration: number } | null = null;
  let frame = 0;
  let last = 0;
  let paused = false;
  let first = true;
  let destroyed = false;

  const boxToImage = (p: Pt): [number, number] => {
    const c = u.uCrop.value;
    return [c.x + p[0] * c.z, c.y + p[1] * c.w];
  };

  const draw = () => {
    u.uLight.value.set(current[0], current[1]);
    u.uRest.value = rest;
    renderer.render(scene, camera);
    if (first) {
      first = false;
      opts.onFirstFrame();
    }
  };

  const step = (now: number) => {
    frame = 0;
    if (paused || destroyed) return;
    const dt = last ? now - last : 16;
    last = now;
    let moving = false;

    if (tween) {
      const k = Math.min((now - tween.start) / tween.duration, 1);
      const e = houseCurve(k);
      current = [tween.from[0] + (tween.to[0] - tween.from[0]) * e, tween.from[1] + (tween.to[1] - tween.from[1]) * e];
      if (!after) rest = e * e;
      if (k < 1) moving = true;
      else tween = null;
    } else {
      const a = 1 - Math.exp(-dt / Math.max(lag / 3, 1));
      current = [current[0] + (target[0] - current[0]) * a, current[1] + (target[1] - current[1]) * a];
      rest += (restTarget - rest) * a;
      moving = Math.abs(target[0] - current[0]) + Math.abs(target[1] - current[1]) + Math.abs(restTarget - rest) > 0.0004;
    }

    draw();
    if (moving) schedule();
    else last = 0;
  };

  const schedule = () => {
    if (!frame && !paused && !destroyed) frame = requestAnimationFrame(step);
  };

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    u.uCrop.value.copy(coverCrop(w, h, image.naturalWidth, image.naturalHeight, focal));
    if (after) u.uCropAfter.value.copy(coverCrop(w, h, after.image.naturalWidth, after.image.naturalHeight, after.focal));
    if (!paused) draw();
  };

  const onLost = (e: Event) => {
    e.preventDefault();
    opts.onLost();
  };
  canvas.addEventListener('webglcontextlost', onLost);

  resize();

  return {
    resize,
    aim(box, lagMs) {
      tween = null;
      target = boxToImage(box);
      if (!after) restTarget = 0;
      lag = lagMs;
      schedule();
    },
    rest(lagMs) {
      tween = null;
      target = [restAt[0], restAt[1]];
      if (!after) restTarget = 1;
      lag = lagMs;
      schedule();
    },
    pass(from, to, durationMs) {
      current = [from[0], from[1]];
      target = [to[0], to[1]];
      rest = 0;
      restTarget = after ? 0 : 1;
      tween = { from, to, start: performance.now(), duration: durationMs };
      schedule();
    },
    setReveal(amount) {
      u.uStrength.value = Math.max(0, Math.min(1, amount));
      if (!paused) draw();
    },
    pause(next) {
      paused = next;
      if (paused && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      if (!paused) {
        last = 0;
        draw();
        schedule();
      }
    },
    destroy() {
      destroyed = true;
      if (frame) cancelAnimationFrame(frame);
      canvas.removeEventListener('webglcontextlost', onLost);
      geometry.dispose();
      material.dispose();
      imageTex.dispose();
      if (afterTex !== imageTex) afterTex.dispose();
      renderer.dispose();
    },
  };
}
