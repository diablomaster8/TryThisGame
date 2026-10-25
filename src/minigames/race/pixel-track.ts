import type { SectionKind } from '../../sim/race';
import { C, color } from '../../render/sprites/palette';

/**
 * The race's painted backdrop and track sections, for the pixel view. Every section used to
 * be one flat palette fill (the fly gap was a blank off-white block, review 2026-10-24): each
 * now has its own art, keyed to world pixels so it scrolls with the camera. Patterns come
 * from a fixed hash of the world column, so a frame is the same every time it is drawn.
 */

/** A small integer hash of a world column, for scattering tufts, stones and ripples. */
const hash = (n: number): number => {
  let h = (n * 2654435761) >>> 0;
  h ^= h >>> 15;
  return (h * 2246822519) >>> 0;
};

export interface TrackFrame {
  ctx: CanvasRenderingContext2D;
  /** Low-res view size. */
  W: number;
  H: number;
  /** Top and bottom of the lane band. */
  bandTop: number;
  bandBottom: number;
  /** Lane baselines, nearest last. */
  laneY: readonly number[];
  camX: number;
  nowMs: number;
  /** Reduced motion: water and clouds hold still. */
  still: boolean;
}

/** Fill horizontal bands from `top` to `bottom` through `stops`, with a one-row dither seam. */
export function skyBands(
  ctx: CanvasRenderingContext2D,
  W: number,
  top: number,
  bottom: number,
  stops: readonly number[],
): void {
  const n = stops.length;
  const h = (bottom - top) / n;
  for (let i = 0; i < n; i++) {
    const y0 = Math.round(top + i * h);
    const y1 = Math.round(top + (i + 1) * h);
    ctx.fillStyle = color(stops[i]!);
    ctx.fillRect(0, y0, W, y1 - y0);
    if (i > 0) {
      // A checker row at the seam, so the bands blend like a painted sky.
      ctx.fillStyle = color(stops[i - 1]!);
      for (let x = (i % 2) * 2; x < W; x += 4) ctx.fillRect(x, y0, 2, 1);
    }
  }
}

/** The sky behind the course: deep at the top, pale toward the horizon. */
export const SKY_STOPS = [C.skyDeep, C.water, C.water, C.shallows, C.shallows, C.skyLight];

/** Paint one section of the band from screen x0 to x1. */
export function paintSection(f: TrackFrame, kind: SectionKind | 'runup', x0: number, x1: number) {
  const a = Math.max(0, x0);
  const b = Math.min(f.W, x1);
  if (b <= a) return;
  switch (kind) {
    case 'swim':
      return paintSwim(f, a, b);
    case 'fly':
      return paintFly(f, a, b, x0, x1);
    case 'climb':
      return paintClimb(f, a, b);
    case 'stretch':
      return paintStretch(f, a, b);
    default:
      return paintRun(f, a, b);
  }
}

/** Lane rows: the band between two baselines, for striping. */
function laneRows(f: TrackFrame): Array<[number, number]> {
  const rows: Array<[number, number]> = [];
  const gap = f.laneY.length > 1 ? f.laneY[1]! - f.laneY[0]! : 14;
  let prev = f.bandTop;
  for (const y of f.laneY) {
    const bottom = Math.round(y + gap / 2);
    rows.push([prev, bottom]);
    prev = bottom;
  }
  rows.push([prev, f.bandBottom]);
  return rows;
}

function paintRun(f: TrackFrame, a: number, b: number): void {
  const { ctx } = f;
  laneRows(f).forEach(([y0, y1], i) => {
    ctx.fillStyle = color(i % 2 === 0 ? C.grass : C.leafLight);
    ctx.fillRect(a, y0, b - a, y1 - y0);
  });
  // Chalk lane lines and grass tufts.
  ctx.fillStyle = color(C.cream);
  for (const y of f.laneY) {
    const ly = Math.round(y + 5);
    for (let x = a - ((a + Math.round(f.camX)) % 8); x < b; x += 8)
      ctx.fillRect(Math.max(a, x), ly, Math.min(4, b - x), 1);
  }
  tufts(f, a, b, C.leaf, C.sprout, 9);
  // The near edge: a darker verge.
  ctx.fillStyle = color(C.leaf);
  ctx.fillRect(a, f.bandBottom - 2, b - a, 2);
}

function tufts(f: TrackFrame, a: number, b: number, dark: number, light: number, every: number) {
  const { ctx } = f;
  const cam = Math.round(f.camX);
  for (let x = a; x < b; x++) {
    const wx = x + cam;
    const h = hash(wx);
    if (h % every !== 0) continue;
    const y = f.bandTop + 2 + ((h >>> 8) % Math.max(1, f.bandBottom - f.bandTop - 5));
    ctx.fillStyle = color((h >>> 4) % 2 ? dark : light);
    ctx.fillRect(x, y, 1, 2);
    if (x + 1 < b) ctx.fillRect(x + 1, y - 1, 1, 2);
  }
}

function paintSwim(f: TrackFrame, a: number, b: number): void {
  const { ctx } = f;
  // Deeper water toward the near side.
  skyBandsX(ctx, a, b, f.bandTop, f.bandBottom, [C.shallows, C.water, C.water, C.deepWater]);
  // Moving ripples.
  const t = f.still ? 0 : Math.floor(f.nowMs / 140);
  const cam = Math.round(f.camX);
  for (let x = a; x < b; x++) {
    const wx = x + cam;
    const h = hash(Math.floor((wx + t) / 3));
    if (h % 7 !== 0) continue;
    const y = f.bandTop + 3 + ((h >>> 9) % Math.max(1, f.bandBottom - f.bandTop - 6));
    ctx.fillStyle = color((h >>> 3) % 3 === 0 ? C.white : C.skyLight);
    ctx.fillRect(x, y, 3, 1);
  }
  // Lane ropes: floats in sun yellow and white.
  for (const y of f.laneY) {
    const ly = Math.round(y + 5);
    for (let x = a - ((a + cam) % 6); x < b; x += 6) {
      if (x < a) continue;
      ctx.fillStyle = color(((x + cam) / 6) % 2 === 0 ? C.sunYellow : C.white);
      ctx.fillRect(x, ly, 2, 2);
    }
  }
  // The far bank's lip.
  ctx.fillStyle = color(C.skyLight);
  ctx.fillRect(a, f.bandTop, b - a, 1);
}

/** Horizontal colour bands over a span of x only. */
function skyBandsX(
  ctx: CanvasRenderingContext2D,
  a: number,
  b: number,
  top: number,
  bottom: number,
  stops: readonly number[],
): void {
  const h = (bottom - top) / stops.length;
  stops.forEach((s, i) => {
    const y0 = Math.round(top + i * h);
    ctx.fillStyle = color(s);
    ctx.fillRect(a, y0, b - a, Math.round(top + (i + 1) * h) - y0);
  });
}

/**
 * The fly section: open sky through the band, cloud wisps at the racers' height and a deep
 * gap below, walled by the two cliff edges the runners leap from and land on.
 */
function paintFly(f: TrackFrame, a: number, b: number, x0: number, x1: number): void {
  const { ctx } = f;
  const gapTop = Math.round(f.bandTop + (f.bandBottom - f.bandTop) * 0.45);
  skyBandsX(ctx, a, b, f.bandTop, gapTop, [C.shallows, C.skyLight]);
  // The gap: open air falling away to a far canyon wall and a river at the bottom.
  skyBandsX(ctx, a, b, gapTop, f.bandBottom, [C.skyLight, C.shallows, C.water]);
  const cam = Math.round(f.camX);
  const wallTop = Math.round(gapTop + (f.bandBottom - gapTop) * 0.3);
  for (let x = a; x < b; x++) {
    // The far wall, with a jagged rim and rock strata, drifting slower than the lanes.
    const wx = x + Math.round(cam * 0.6);
    const rim = wallTop + (hash(Math.floor(wx / 3)) % 6);
    ctx.fillStyle = color(C.lilacGrey);
    ctx.fillRect(x, rim, 1, f.bandBottom - rim);
    ctx.fillStyle = color(C.dusk);
    for (let y = rim + 3 + (hash(Math.floor(wx / 9)) % 2); y < f.bandBottom - 4; y += 5)
      ctx.fillRect(x, y, 1, 2);
    ctx.fillStyle = color(C.greyDeep);
    ctx.fillRect(x, f.bandBottom - 7, 1, 3);
    // The river far below, with glints.
    ctx.fillStyle = color(hash(x + cam) % 6 === 0 ? C.white : C.deepWater);
    ctx.fillRect(x, f.bandBottom - 4, 1, 4);
  }
  // A bank of cloud along the top of the gap: the drop is below the runners.
  for (let x = a; x < b; x++) {
    const h = hash(Math.floor((x + cam) / 5));
    const puff = 2 + (h % 4);
    ctx.fillStyle = color(C.white);
    ctx.fillRect(x, gapTop - puff + 2, 1, puff);
    ctx.fillStyle = color(C.skyLight);
    ctx.fillRect(x, gapTop + 2, 1, 2);
  }
  // Wisps of cloud drifting through the lanes.
  const drift = f.still ? 0 : f.nowMs / 400;
  for (let i = 0; i < 6; i++) {
    const wx = Math.round((i * 53 + drift) % Math.max(40, x1 - x0)) + x0;
    const y = f.bandTop + 6 + ((i * 17) % Math.max(8, gapTop - f.bandTop - 8));
    if (wx + 14 < a || wx > b) continue;
    ctx.fillStyle = color(C.white);
    ctx.fillRect(Math.max(a, wx), y, Math.max(0, Math.min(12, b - wx)), 2);
    ctx.fillRect(Math.max(a, wx + 3), y - 1, Math.max(0, Math.min(6, b - wx - 3)), 1);
  }
  // Faint dotted flight lines, one per lane, so each runner keeps its row in the air.
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  for (const y of f.laneY) {
    const ly = Math.round(y - 13);
    for (let x = a - ((a + cam) % 6); x < b; x += 6) if (x >= a) ctx.fillRect(x, ly, 2, 1);
  }
  // The cliff edges at both ends of the gap.
  cliff(f, x0, 1);
  cliff(f, x1, -1);
}

/** A grassy cliff lip at screen x `edge`, its face falling away into the gap on side `dir`. */
function cliff(f: TrackFrame, edge: number, dir: 1 | -1): void {
  const { ctx } = f;
  const w = 7;
  const x = dir === 1 ? edge : edge - w;
  if (x + w < 0 || x > f.W) return;
  ctx.fillStyle = color(C.bark);
  ctx.fillRect(x, f.bandTop, w, f.bandBottom - f.bandTop);
  ctx.fillStyle = color(C.darkBark);
  for (let y = f.bandTop + 4; y < f.bandBottom; y += 5)
    ctx.fillRect(dir === 1 ? x + w - 2 - ((y >> 2) % 3) : x + ((y >> 2) % 3), y, 2, 2);
  ctx.fillStyle = color(dir === 1 ? C.wood : C.sandDeep);
  ctx.fillRect(dir === 1 ? x : x + w - 1, f.bandTop, 1, f.bandBottom - f.bandTop);
  ctx.fillStyle = color(C.grass);
  ctx.fillRect(x - 1, f.bandTop - 1, w + 2, 3);
  ctx.fillStyle = color(C.sprout);
  ctx.fillRect(x - 1, f.bandTop - 1, w + 2, 1);
}

function paintClimb(f: TrackFrame, a: number, b: number): void {
  const { ctx } = f;
  ctx.fillStyle = color(C.dusk);
  ctx.fillRect(a, f.bandTop, b - a, f.bandBottom - f.bandTop);
  // Stone blocks: mortar rows, each course offset by half a block.
  const cam = Math.round(f.camX);
  ctx.fillStyle = color(C.greyDeep);
  let row = 0;
  for (let y = f.bandTop + 5; y < f.bandBottom; y += 6, row++) {
    ctx.fillRect(a, y, b - a, 1);
    const off = row % 2 === 0 ? 0 : 6;
    for (let x = a - ((a + cam + off) % 12); x < b; x += 12)
      if (x >= a) ctx.fillRect(x, y - 5, 1, 5);
  }
  // Lit block tops and a scatter of moss.
  ctx.fillStyle = color(C.lilacGrey);
  for (let x = a; x < b; x++) {
    const h = hash(x + cam);
    if (h % 11 === 0) ctx.fillRect(x, f.bandTop + 6 + 6 * ((h >>> 7) % 8), 2, 1);
  }
  ctx.fillStyle = color(C.leaf);
  for (let x = a; x < b; x++) {
    const h = hash((x + cam) * 7 + 3);
    if (h % 23 === 0)
      ctx.fillRect(x, f.bandTop + 2 + ((h >>> 6) % (f.bandBottom - f.bandTop - 4)), 2, 2);
  }
  // A ledge under each lane, the hand-holds they scramble along.
  for (const y of f.laneY) {
    const ly = Math.round(y + 4);
    ctx.fillStyle = color(C.pale);
    ctx.fillRect(a, ly, b - a, 1);
    ctx.fillStyle = color(C.plum);
    ctx.fillRect(a, ly + 1, b - a, 1);
  }
}

function paintStretch(f: TrackFrame, a: number, b: number): void {
  const { ctx } = f;
  laneRows(f).forEach(([y0, y1], i) => {
    ctx.fillStyle = color(i % 2 === 0 ? C.sand : C.sandLight);
    ctx.fillRect(a, y0, b - a, y1 - y0);
  });
  const cam = Math.round(f.camX);
  // Footprint ruts along each lane and small pebbles.
  ctx.fillStyle = color(C.sandDeep);
  for (const y of f.laneY) {
    const ly = Math.round(y + 2);
    for (let x = a - ((a + cam) % 10); x < b; x += 10) if (x >= a) ctx.fillRect(x, ly, 2, 1);
  }
  tufts(f, a, b, C.wood, C.cream, 13);
  // Distance posts every 44 px of course: the long haul, counted off.
  for (let x = a - ((a + cam) % 44); x < b; x += 44) {
    if (x < a) continue;
    ctx.fillStyle = color(C.bark);
    ctx.fillRect(x, f.bandTop - 6, 2, 8);
    ctx.fillStyle = color(C.ember);
    ctx.fillRect(x - 1, f.bandTop - 7, 4, 2);
  }
}

/** The ground in front of the band, down to the bottom of the view. */
export function paintForeground(f: TrackFrame): void {
  const { ctx } = f;
  if (f.bandBottom >= f.H) return;
  ctx.fillStyle = color(C.forest);
  ctx.fillRect(0, f.bandBottom, f.W, f.H - f.bandBottom);
  ctx.fillStyle = color(C.leafDeep);
  ctx.fillRect(0, f.bandBottom, f.W, 2);
  const cam = Math.round(f.camX * 1.2);
  ctx.fillStyle = color(C.leaf);
  for (let x = 0; x < f.W; x++) {
    const h = hash(x + cam);
    if (h % 6 === 0)
      ctx.fillRect(x, f.bandBottom + 3 + ((h >>> 5) % Math.max(1, f.H - f.bandBottom - 4)), 1, 2);
  }
}
