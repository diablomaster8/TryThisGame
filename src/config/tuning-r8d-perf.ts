/**
 * Lane D round 8 (perf/TECH): the per-tier performance budget (TECH-09), the tier's 3D start
 * settings (TECH-52), the Pixel governor (TECH-53), the high-speed step budget (TECH-54) and
 * the frame log's window (TECH-31). Re-exported from tuning.ts; `docs/perf-budget.md` is the
 * readable version and `tests/render/perf-budget.test.ts` keeps the two honest.
 */

/** Device tiers, cheapest first. */
export const PERF_TIERS = ['low', 'mid', 'high'] as const;
export type PerfTier = (typeof PERF_TIERS)[number];

/**
 * TECH-09: how the tier is read (`platform/device-tier.ts`). Any low signal wins; `high` needs
 * a desktop GPU on a non-phone screen and, where the browser says, 8 GB or more.
 */
export const TIER_DETECT = {
  /** `navigator.deviceMemory` at or under this is low (Chrome rounds to 0.25…8). */
  lowMemGB: 4,
  /** And at or over this may be high. */
  highMemGB: 8,
  /** WebGL renderer strings of phone GPUs that cannot hold 60 fps here (Mali-G5x, Adreno 60x/61x). */
  lowGpu: 'mali-g5\\d|adreno[^0-9]*6[01]\\d',
  /** Renderer strings of desktop GPUs. */
  desktopGpu: 'nvidia|geforce|quadro|radeon|amd |intel|iris|apple m\\d',
} as const;

/**
 * TECH-09: the budget per tier. `fps` is the target, `p95Ms` (and `p99Ms` where set) the frame
 * time it must hold, `heapMB` the JS heap, `calls` the draw calls a frame may make.
 * `pixelHeight` is the Pixel renderer's frame height; `three` is what Full 3D starts at
 * (TECH-52): `offered` false means the title screen does not suggest it, `ratio` caps the
 * render scale, `shadows` is the sun shadow filter (`off` builds no shadow map at all).
 */
export const TIER_BUDGET = {
  low: {
    fps: 30,
    p95Ms: 33,
    p99Ms: null,
    heapMB: 120,
    calls: 150,
    pixelHeight: 540,
    three: {
      offered: false,
      ratio: 0.75,
      shadows: 'off',
      bloom: false,
      smaa: false,
      particles: 'light',
    },
  },
  mid: {
    fps: 60,
    p95Ms: 20,
    p99Ms: null,
    heapMB: 160,
    calls: 250,
    pixelHeight: 540,
    three: {
      offered: true,
      ratio: 1,
      shadows: 'basic',
      bloom: true,
      smaa: false,
      particles: 'full',
    },
  },
  high: {
    fps: 60,
    p95Ms: 20,
    p99Ms: 20,
    heapMB: 600,
    calls: 400,
    pixelHeight: 540,
    three: {
      offered: true,
      ratio: 1.5,
      shadows: 'pcf',
      bloom: true,
      smaa: true,
      particles: 'full',
    },
  },
} as const satisfies Record<
  PerfTier,
  {
    fps: number;
    p95Ms: number;
    p99Ms: number | null;
    heapMB: number;
    calls: number;
    pixelHeight: number;
    three: {
      offered: boolean;
      ratio: number;
      shadows: 'off' | 'basic' | 'pcf';
      bloom: boolean;
      smaa: boolean;
      particles: 'light' | 'full';
    };
  }
>;

/** TECH-09: the budgets every tier shares. */
export const PERF_GLOBAL = {
  /** Script the first page load needs, gzip (the bundle harness's baseline is 845 today). */
  eagerJsKbGz: 450,
  /** First playable frame on Fast 4G. */
  firstFrameMs: 3000,
  /** A 7-day `indefinite` catch-up (CLAUDE.md; `tests/sim/offline.test.ts`). */
  catchUp7dMs: 3000,
  /** One autosave: serialise and write. */
  autosaveMs: 2,
} as const;

/**
 * TECH-52: what the Grove sheds above ground before the render scale, cheapest to lose first
 * (`render3d/grove-shed.ts`). The steps judge against the governor's own targets, so a device
 * that already holds 30 fps keeps everything.
 */
export const GROVE_SHED = {
  order: ['particles', 'smaa', 'bloom', 'shadows'] as const,
} as const;

/** TECH-52/53: where each renderer keeps its settled governor level, one per device. */
export const GOV_MEMORY = {
  key3d: 'grove.gov3d',
  keyPx: 'grove.govpx',
  /** Write at most this often while the level moves. */
  everyMs: 5000,
} as const;

/**
 * TECH-53: the Pixel governor. It sheds, in order, full particles to light, the wind's sway,
 * the weather overlay, then the frame height 540 → `smallHeight`. Shed while the smoothed frame
 * is over `slowMs` for `downFrames` frames; given back, latest first, after `upFrames` under
 * `fastMs`.
 */
export const PIXEL_GOV = {
  order: ['particles', 'wind', 'weather', 'height'] as const,
  slowMs: 30,
  fastMs: 21,
  smallHeight: 432,
} as const;

/**
 * TECH-54: above ×10 the frame's sim steps stop once they have used `budgetMs` (the rest stay
 * in the clock's backlog for the next frame, still fine live steps), and the HUD's feedback hears
 * each kind+subject event once per frame. Toasts with the same text inside `toastDedupeMs` show
 * once at any speed above ×1.
 */
export const FAST_TIME = {
  fromScale: 10,
  budgetMs: 8,
  /** Steps always run in a frame, however slow they are, so the clock always moves. */
  minSteps: 1,
  toastDedupeMs: 5000,
} as const;

/** TECH-31: the debug panel's frame-time window and what counts as a long frame. */
export const FRAME_LOG = {
  windowMs: 10_000,
  longMs: 34,
  /** Sprite sheets baked at most per frame once the first frame is drawn. */
  bakesPerFrame: 1,
} as const;

/**
 * Lane D round 8, phone budget headroom: static small scenery casters are folded into one
 * shadow-only mesh (`render3d/shadow-merge.ts`), so the sun's shadow pass draws them in one
 * call instead of one each (farOrchard had ~40 such casters). Per `WORLD_TIER` device tier.
 */
export const SHADOW_MERGE = {
  tiers: { desktop: false, phone: true, slow: true },
  /** Meshes over this many triangles keep their own shadow draw (terrain, far trees). */
  maxTris: 6000,
  /** How often new casters are looked for and members checked for movement. */
  sweepMs: 1000,
  /** At most one rebuild of the merged mesh this often (it is a CPU merge, not free). */
  rebuildMs: 4000,
  /** Added to each member's bounding sphere when testing it against the shadow box (u). */
  boxMargin: 1,
  /** A mesh that has moved this many times casts its own shadow for good. */
  moves: 3,
} as const;
