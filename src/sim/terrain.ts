/**
 * The Grove's ground as the sim sees it: how high it is and what it is made of at any
 * point. The height model used to live only in the renderers (cosine bumps in the 3D
 * terrain, flat terraces in Pixel), so the sim could not tell a ledge from a wall. It now
 * lives here, with no three.js and no DOM, and both renderers build from it:
 * `render3d/terrain-shape.ts` re-exports these samplers, and the Pixel hill terraces take
 * their tier numbers from `pixelTiers`. The noise is a copy of `render/paint/noise.ts`
 * (whose `raster.ts` imports three), kept bit-identical so the 3D mesh does not move.
 */
import { GROVE, GROVE3D } from '../config/tuning';
import { BRIDGE_DECK, BRIDGE_YAW, JUMP, KEEPER_WADE, TERRACE } from '../config/tuning-sim';
import type { World } from './types';

export type GroundSurface = 'grass' | 'path' | 'water' | 'deck' | 'stone';

export interface Ground {
  /** Height the feet rest at: the water surface where the bed dips below it. */
  y: number;
  surface: GroundSurface;
}

/** Height the water surface sits at: the pond and stream share one level. */
export const WATER_LEVEL = -0.32;

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/** Hermite step from 0 at `lo` to 1 at `hi`, as three's MathUtils.smoothstep computes it. */
function smoothstep(v: number, lo: number, hi: number): number {
  if (v <= lo) return 0;
  if (v >= hi) return 1;
  const t = (v - lo) / (hi - lo);
  return t * t * (3 - 2 * t);
}

// Value noise and fbm, copied from render/paint/noise.ts and raster.ts's `hash` so the
// sim needs no render import. Change both or neither: the 3D ground mesh samples this.
function hash(x: number, y: number, salt: number): number {
  let h = (x * 374761393 + y * 668265263 + salt * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function vnoise(x: number, y: number, salt: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const tx = fx * fx * (3 - 2 * fx);
  const ty = fy * fy * (3 - 2 * fy);
  const a = hash(x0, y0, salt);
  const b = hash(x0 + 1, y0, salt);
  const c = hash(x0, y0 + 1, salt);
  const d = hash(x0 + 1, y0 + 1, salt);
  return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
}

function fbm(x: number, y: number, octaves: number, salt: number): number {
  let sum = 0;
  let amp = 1;
  let norm = 0;
  let fx = x;
  let fy = y;
  for (let i = 0; i < octaves; i++) {
    sum += vnoise(fx, fy, salt + i * 17) * amp;
    norm += amp;
    amp *= 0.5;
    fx *= 2;
    fy *= 2;
  }
  return sum / norm;
}

const RIVER: Array<Array<{ x: number; z: number }>> = [
  [...GROVE.river.inflow],
  [...GROVE.river.outflow],
];

function segmentDistance(
  x: number,
  z: number,
  ax: number,
  az: number,
  bx: number,
  bz: number,
): number {
  const dx = bx - ax;
  const dz = bz - az;
  const len2 = dx * dx + dz * dz || 1;
  const t = clamp(((x - ax) * dx + (z - az) * dz) / len2, 0, 1);
  return Math.hypot(x - (ax + dx * t), z - (az + dz * t));
}

function polylineDistance(
  x: number,
  z: number,
  line: ReadonlyArray<{ x: number; z: number } | readonly [number, number]>,
): number {
  let best = Infinity;
  for (let i = 0; i + 1 < line.length; i++) {
    const a = line[i]!;
    const b = line[i + 1]!;
    const [ax, az] = Array.isArray(a) ? a : [(a as { x: number }).x, (a as { z: number }).z];
    const [bx, bz] = Array.isArray(b) ? b : [(b as { x: number }).x, (b as { z: number }).z];
    best = Math.min(best, segmentDistance(x, z, ax, az, bx, bz));
  }
  return best;
}

/** Distance to the nearest stream centre line. */
export function riverDistance(x: number, z: number): number {
  let best = Infinity;
  for (const line of RIVER) best = Math.min(best, polylineDistance(x, z, line));
  return best;
}

/** Distance to the nearest dirt path centre line. */
export function pathDistance(x: number, z: number): number {
  let best = Infinity;
  for (const line of GROVE3D.paths) best = Math.min(best, polylineDistance(x, z, line));
  return best;
}

/** One tier of a terraced hill: its rim's radius and its top's height above the plain. */
export interface Tier {
  r: number;
  top: number;
}

/**
 * One leg of a hill's ramp: a band from `rIn` (the foot of the tier it climbs to) out to
 * `rOut`, running counter-clockwise from angle `a0` to `a1` (radians, atan2(dz, dx)) and
 * rising from `y0` to `y1`, level over the last `landing` radians.
 */
export interface RampLeg {
  a0: number;
  a1: number;
  rIn: number;
  rOut: number;
  y0: number;
  y1: number;
  landing: number;
  /** The rim of the shelf the leg stands on: its bank stops there, at that shelf's own cliff. */
  rim: number;
}

/** A terraced hill (MOVE-09): its tiers, outermost first, and its ramp legs. */
export interface Terrace {
  x: number;
  z: number;
  r: number;
  h: number;
  tiers: Tier[];
  ramp: RampLeg[];
  /** Nothing of the hill reaches further than this from its centre. */
  reach: number;
}

/**
 * Build a hill's terraces: `ceil(h / maxStep)` tiers, so one jump clears a step and a
 * double jump two, shrinking evenly to `topFactor` of the radius; and a ramp that climbs
 * along the foot of each next tier in turn, so a walker reaches the top without jumping.
 */
export function hillTerrace(h: {
  x: number;
  z: number;
  r: number;
  h: number;
  ramp: { from: number; to: number };
}): Terrace {
  const T = TERRACE;
  const n = Math.max(2, Math.ceil(h.h / T.maxStep - 1e-9));
  const tiers: Tier[] = [];
  for (let k = 0; k < n; k++)
    tiers.push({ r: h.r * (1 - ((1 - T.topFactor) * k) / (n - 1)), top: (h.h * (k + 1)) / n });
  const from = (h.ramp.from * Math.PI) / 180;
  const span = ((h.ramp.to - h.ramp.from) * Math.PI) / 180 / n;
  const ramp: RampLeg[] = tiers.map((t, k) => {
    const rIn = t.r;
    const rOut = rIn + T.rampWidth;
    return {
      a0: from + k * span,
      a1: from + (k + 1) * span,
      rIn,
      rOut,
      y0: k === 0 ? 0 : tiers[k - 1]!.top,
      y1: t.top,
      landing: Math.min(span * 0.4, T.landing / ((rIn + rOut) / 2)),
      rim: k === 0 ? Infinity : tiers[k - 1]!.r,
    };
  });
  return {
    x: h.x,
    z: h.z,
    r: h.r,
    h: h.h,
    tiers,
    ramp,
    reach: h.r + T.rampWidth + T.rampBank + 0.05,
  };
}

/** Every Grove hill as terraces, built once. */
export const TERRACES: readonly Terrace[] = GROVE.hills.map(hillTerrace);

/** Angle `a` past `a0`, counter-clockwise, in [0, 2π). */
function anglePast(a: number, a0: number): number {
  const t = (a - a0) % (Math.PI * 2);
  return t < 0 ? t + Math.PI * 2 : t;
}

/**
 * A hill's height above the plain at (dx, dz) from its centre. `soft` gives the drawn
 * ground, each cliff eased over `edge` units inside its rim; hard gives the shelves with
 * upright cliffs, which is what decides whether a walker can step up (`ledgeY`).
 */
export function terraceHeight(t: Terrace, dx: number, dz: number, soft: boolean): number {
  const d = Math.hypot(dx, dz);
  if (d >= t.reach) return 0;
  const E = TERRACE.edge;
  const B = TERRACE.rampBank;
  let y = 0;
  let below = 0;
  for (const tier of t.tiers) {
    const step = tier.top - below;
    below = tier.top;
    if (soft) y += step * (1 - smoothstep(d, tier.r - E, tier.r));
    else if (d < tier.r) y = tier.top;
  }
  const a = Math.atan2(dz, dx);
  const shelf = y;
  for (const leg of t.ramp) {
    const bankEnd = Math.min(leg.rOut + B, leg.rim);
    if (d >= bankEnd || d < leg.rIn - E) continue;
    const span = leg.a1 - leg.a0;
    const fade = B / ((leg.rIn + leg.rOut) / 2);
    const u = anglePast(a, leg.a0);
    if (u > span + fade) continue;
    const rise = leg.y0 + (leg.y1 - leg.y0) * Math.min(1, u / (span - leg.landing));
    // The outer side and the far end are banks sloping down to the shelf below them (in the
    // same model, so a bank over a cliff's eased edge eases with it): walkable, while the
    // next tier's own face on the inner side, and any cliff the bank overhangs, stay cliffs.
    const rad = bankEnd > leg.rOut ? 1 - smoothstep(d, leg.rOut, bankEnd) : 1;
    const end = 1 - smoothstep(u, span, span + fade);
    const base = Math.min(shelf, leg.y0);
    const ry = base + (rise - base) * rad * end;
    if (ry > y) y = ry;
  }
  return y;
}

/** Whether (x, z) is within reach of any hill (its cached ground may smear a cliff). */
function nearHill(x: number, z: number): boolean {
  for (const t of TERRACES)
    if (Math.abs(x - t.x) < t.reach + 0.5 && Math.abs(z - t.z) < t.reach + 0.5) return true;
  return false;
}

/** The hills' height above the plain at (x, z): soft (drawn) or hard (stepped). */
export function hillHeight(x: number, z: number, soft = true): number {
  let y = 0;
  for (const t of TERRACES) {
    const dx = x - t.x;
    const dz = z - t.z;
    if (Math.abs(dx) >= t.reach || Math.abs(dz) >= t.reach) continue;
    y = Math.max(y, terraceHeight(t, dx, dz, soft));
  }
  return y;
}

/**
 * The ground with upright cliffs: the drawn ground, but with each terrace's hard shelf
 * in place of its eased edge. A walker may step to a point only when this is within
 * `stepUp` of its feet (or of where it stands), so terraces are climbed by the ramp or
 * jumped, never walked up their faces (MOVE-09).
 */
export function ledgeY(x: number, z: number): number {
  const soft = hillHeight(x, z, true);
  const hard = hillHeight(x, z, false);
  // Off the hills the cached ground is exact enough; on them the sum is taken in full, since
  // the cache's quarter-unit blend smears a cliff over the very spot this has to judge.
  if (soft === 0 && hard === 0 && !nearHill(x, z)) return groveHeight(x, z);
  return exactHeight(x, z) + hard - soft;
}

/** Ground height before water cuts: hills, rim and roll. */
function landHeight(x: number, z: number): number {
  let y = hillHeight(x, z, true);
  const edge = Math.max(Math.abs(x), Math.abs(z));
  const rim = smoothstep(edge, GROVE3D.rimStart, GROVE.size / 2 + 6);
  y += rim * rim * GROVE3D.rimHeight * (0.8 + fbm(x / 6, z / 6, 2, 71) * 0.4);
  y += fbm(x / 11, z / 11, 3, 72) * 0.5 - 0.22;
  return y;
}

/** The full sum, for the terrain mesh itself and for the height tiles. */
export function exactHeight(x: number, z: number): number {
  let y = landHeight(x, z);
  const pond = GROVE.pond;
  const pd = Math.hypot(x - pond.x, z - pond.z) / (pond.r + 0.6);
  if (pd < 1) y -= GROVE3D.pondDepth * (1 - smoothstep(pd, 0.55, 1));
  const rd = riverDistance(x, z) / (GROVE.river.width * 0.5 + 0.5);
  if (rd < 1) y -= GROVE3D.riverDepth * (1 - smoothstep(rd, 0.5, 1));
  return y;
}

/**
 * Heights as a grid of tiles, filled the first time anything stands on them. Every walking
 * creature, the camera, the grass pushers and the props ask for the ground each frame, and
 * the full sum (hills, rim, two noise rolls, the stream polylines) for points that move was
 * a fifth of a throttled phone frame; an exact-point cache missed for anything in motion. A
 * lookup is now four reads and a blend. The cells are a quarter unit, half the terrain
 * mesh's own, so a foot sits on the drawn ground at least as well as the exact sum did.
 */
const CELL = 0.25;
const TILE = 32;
const SIDE = TILE + 1;
const tiles = new Map<number, Float32Array>();

function tileAt(tx: number, tz: number): Float32Array {
  const key = (tx + 1024) * 2048 + (tz + 1024);
  let t = tiles.get(key);
  if (t) return t;
  t = new Float32Array(SIDE * SIDE);
  const x0 = tx * TILE * CELL;
  const z0 = tz * TILE * CELL;
  for (let j = 0; j < SIDE; j++)
    for (let i = 0; i < SIDE; i++) t[j * SIDE + i] = exactHeight(x0 + i * CELL, z0 + j * CELL);
  tiles.set(key, t);
  return t;
}

/** The height of the ground at a point in the Grove; the water lies below it in dips. */
export function groveHeight(x: number, z: number): number {
  const gx = x / CELL;
  const gz = z / CELL;
  const ix = Math.floor(gx);
  const iz = Math.floor(gz);
  const tx = Math.floor(ix / TILE);
  const tz = Math.floor(iz / TILE);
  const t = tileAt(tx, tz);
  const i = ix - tx * TILE;
  const j = iz - tz * TILE;
  const fx = gx - ix;
  const fz = gz - iz;
  const a = t[j * SIDE + i]!;
  const b = t[j * SIDE + i + 1]!;
  const c = t[(j + 1) * SIDE + i]!;
  const d = t[(j + 1) * SIDE + i + 1]!;
  return (a + (b - a) * fx) * (1 - fz) + (c + (d - c) * fx) * fz;
}

/** Walkable ground: never below the water, so creatures wade rather than sink. */
export function standHeight(x: number, z: number): number {
  return Math.max(groveHeight(x, z), WATER_LEVEL + 0.02);
}

/** Slope (1 − normal.y) above which the 3D terrain paints rock; the mesh blends 0.2–0.5. */
const STONE_SLOPE = 0.35;
/** Height above which the rim reads as rock, the midpoint of the mesh's 5–10 blend. */
const STONE_HEIGHT = 7.5;

/**
 * The ground under (x, z): its height and what it is made of. Water is the pond and the
 * stream wherever the bed dips below WATER_LEVEL, and `y` is then the water surface.
 * Stone and path follow the 3D terrain's own rock and dirt blends at their midpoints.
 */
export function groundAt(world: World | null, x: number, z: number): Ground {
  // The world is not read yet; the tops of standable colliders come in through `keeperFooting`.
  void world;
  const deck = deckY(x, z);
  if (deck !== null) return { y: deck, surface: 'deck' };
  return terrainAt(x, z);
}

/** The terrain alone, with no deck: its height and what it is made of. */
function terrainAt(x: number, z: number): Ground {
  const bed = groveHeight(x, z);
  if (bed < WATER_LEVEL) return { y: WATER_LEVEL, surface: 'water' };
  const e = 0.25;
  const gx = (groveHeight(x + e, z) - groveHeight(x - e, z)) / (2 * e);
  const gz = (groveHeight(x, z + e) - groveHeight(x, z - e)) / (2 * e);
  const slope = 1 - 1 / Math.sqrt(1 + gx * gx + gz * gz);
  if (slope > STONE_SLOPE || bed > STONE_HEIGHT) return { y: bed, surface: 'stone' };
  if (pathDistance(x, z) < (GROVE3D.pathWidth + 1.9) / 2) return { y: bed, surface: 'path' };
  return { y: bed, surface: 'grass' };
}

/** Where the 3D planks sit: `lift` above the stream bed under the bridge's centre. */
export function bridgeDeckTop(): number {
  return groveHeight(GROVE.bridge.x, GROVE.bridge.z) + BRIDGE_DECK.lift;
}

/**
 * The plank top under (x, z), or null off the bridge (MOVE-12). The deck is a box at the
 * bridge's yaw; over its last `ramp` units at each end it slopes to the bank, so a walker
 * steps on and off without a lip.
 */
export function deckY(x: number, z: number): number | null {
  const b = GROVE.bridge;
  const dx = x - b.x;
  const dz = z - b.z;
  const c = Math.cos(BRIDGE_YAW);
  const s = Math.sin(BRIDGE_YAW);
  const lx = dx * c - dz * s;
  const lz = dx * s + dz * c;
  const D = BRIDGE_DECK;
  if (Math.abs(lx) > D.hw || Math.abs(lz) > D.hd) return null;
  const top = bridgeDeckTop();
  const t = (D.hd - Math.abs(lz)) / D.ramp;
  if (t >= 1) return top;
  // The bank at this end, straight out along the deck's line.
  const end = Math.sign(lz) * D.hd;
  const bank = groveHeight(b.x + lx * c + end * s, b.z - lx * s + end * c);
  return bank + (top - bank) * t;
}

/**
 * Where the Keeper's feet rest at (x, z), reached from feet at `fromY`: the highest surface
 * no more than a step above them (the deck, the terrain, or what `extra` adds: the tops of
 * standable things). In water the feet sink to the bed, at most `maxSink` under the surface
 * (MOVE-13); `sink` says how far, so the renderers can draw the water line.
 */
export function footing(
  x: number,
  z: number,
  fromY = Infinity,
  extra: (x: number, z: number) => number = () => -Infinity,
): Footing {
  const bed = groveHeight(x, z);
  let y = bed;
  let on: Footing['on'] = 'land';
  let sink = 0;
  if (bed < WATER_LEVEL) {
    y = Math.max(bed, WATER_LEVEL - KEEPER_WADE.maxSink);
    // The stream's drawn bed is only a hand deep, so a wader there read ankle-deep: in the
    // channel the feet go on down to knee depth at the centre line (the bed hides them).
    const rd = riverDistance(x, z) / (GROVE.river.width * 0.5);
    if (rd < 1) y = Math.min(y, WATER_LEVEL - KEEPER_WADE.maxSink * (1 - smoothstep(rd, 0.6, 1)));
    on = 'water';
    sink = WATER_LEVEL - y;
  }
  const deck = deckY(x, z);
  if (deck !== null && deck <= fromY + JUMP.stepUp && deck > y) {
    y = deck;
    on = 'deck';
    sink = 0;
  }
  const top = extra(x, z);
  if (top <= fromY + JUMP.stepUp && top > y) {
    y = top;
    on = 'deck';
    sink = 0;
  }
  return { y, on, sink };
}

/** What `footing` finds: the height, whether it is land, water or something built, and how deep in water. */
export interface Footing {
  y: number;
  on: 'land' | 'water' | 'deck';
  sink: number;
}

/**
 * The Pixel hill terraces: the sim's tiers as stacked cylinders, [radius, height, base],
 * outermost first. Pixel draws them with upright cliffs, so it stands figures on `hillHeight(x, z, false)`.
 */
export function pixelTiers(
  h: Parameters<typeof hillTerrace>[0],
): Array<[radius: number, height: number, base: number]> {
  let base = 0;
  return hillTerrace(h).tiers.map((t) => {
    const row: [number, number, number] = [t.r, t.top - base, base];
    base = t.top;
    return row;
  });
}

/** The top of the hill under (x, z) as Pixel draws it (upright cliffs, the ramp), or 0 off every hill. */
export function pixelTierHeight(x: number, z: number): number {
  return hillHeight(x, z, false);
}

/**
 * The middle line of a hill's ramp as [dx, dz] from its centre (MOVE-09): along each leg
 * every `step` units of arc, then in across the shelf to the next, ending toward the top's
 * middle. The painted worn path follows it in both renderers.
 */
export function rampPath(t: Terrace, step = 0.8): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (const leg of t.ramp) {
    const rc = (leg.rIn + leg.rOut) / 2;
    const n = Math.max(2, Math.ceil(((leg.a1 - leg.a0) * rc) / step));
    for (let i = 0; i <= n; i++) {
      const a = leg.a0 + ((leg.a1 - leg.a0) * i) / n;
      out.push([Math.cos(a) * rc, Math.sin(a) * rc]);
    }
  }
  const last = t.ramp[t.ramp.length - 1]!;
  const inner = t.tiers[t.tiers.length - 1]!.r * 0.4;
  out.push([Math.cos(last.a1) * inner, Math.sin(last.a1) * inner]);
  return out;
}
