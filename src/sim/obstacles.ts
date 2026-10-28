import { decorCollider, GROVE_COLLIDERS, NUBBIN_HOP } from '../config/grove-layout';
import type { Collider } from '../config/grove-layout';
import { JUMP } from '../config/tuning-sim';
import { levelOf } from './stats';
import { groveHeight } from './terrain';
import { townUnlocks } from './town';
import type { Nubbin, Vec2, World } from './types';

/**
 * Solid things in the Grove, from the one collider table in `config/grove-layout.ts`:
 * hills, trees, buildings (fixed and placed), rocks, stalls, wild props and decor. Walkers
 * are pushed out of them so nobody strolls through a hill. Colliders are circles, oriented
 * boxes or segments (MOVE-02); a 4 u grid keeps the lookup cheap as the table grows. The
 * pond is handled separately (the shoreline, unless the Keeper wades).
 */
export type { Collider } from '../config/grove-layout';

/**
 * Who is walking, which decides what blocks: the Keeper is stopped by tree trunks and by
 * fences and logs (until it can jump, MOVE-10); a Nubbin walks under a canopy; a `hopper`
 * Nubbin (Run or Fly high enough) also hops fences and logs. Soft pieces (bushes, beds)
 * never hard-stop anyone: the Keeper is slowed by them in `softAt` instead.
 */
export type Walker = 'keeper' | 'nubbin' | 'hopper';

/** Whether a Nubbin is spry enough to hop fences and logs. */
export function nubbinWalker(n: Nubbin): Walker {
  const spry = Math.max(levelOf(n.stats.run.points), levelOf(n.stats.fly.points));
  return spry >= NUBBIN_HOP.stat ? 'hopper' : 'nubbin';
}

// Where each collider's top sits in the world: its `top` over the ground at its centre.
const topCache = new WeakMap<Collider, number>();

/** The absolute height of a collider's top (MOVE-10). */
export function colliderTopY(c: Collider): number {
  let y = topCache.get(c);
  if (y === undefined) {
    y = groveHeight(c.x, c.z) + c.top;
    topCache.set(c, y);
  }
  return y;
}

/**
 * Whether a collider stops a walker whose feet are at `feetY` (undefined: on the ground,
 * where everything that blocks does). Only hop and standable pieces can be cleared from
 * above: a jumping Keeper passes over a fence or lands on a bench once its feet are within
 * a step of the top. Walls, trunks and rails stop it at any height.
 */
function blocks(c: Collider, who: Walker, feetY?: number): boolean {
  const f = c.flags;
  if (f.includes('soft')) return false;
  if (
    feetY !== undefined &&
    (f.includes('hop') || f.includes('standable')) &&
    colliderTopY(c) <= feetY + JUMP.stepUp
  )
    return false;
  if (who === 'keeper') return !f.includes('nubbinOnly');
  if (f.includes('keeperOnly')) return false;
  return !(who === 'hopper' && f.includes('hop'));
}

/** How far a collider reaches from its centre (the grid, the placement check). */
export function colliderReach(c: Collider): number {
  const s = c.shape;
  if (s.type === 'circle') return s.r;
  if (s.type === 'box') return Math.hypot(s.hw, s.hd);
  return s.len / 2 + s.r;
}

// The grid covers the field and a margin; each collider sits in every cell it might touch
// for a walker up to `PAD` wide. Wider queries scan the whole list.
const CELL = 4;
const HALF = 56;
const SIDE = (HALF * 2) / CELL;
const PAD = 1.5;

interface Table {
  list: readonly Collider[];
  cells: Collider[][];
}

function buildTable(list: readonly Collider[]): Table {
  const cells: Collider[][] = Array.from({ length: SIDE * SIDE }, () => []);
  for (const c of list) {
    const r = colliderReach(c) + PAD;
    const x0 = cellOf(c.x - r);
    const x1 = cellOf(c.x + r);
    const z0 = cellOf(c.z - r);
    const z1 = cellOf(c.z + r);
    for (let iz = z0; iz <= z1; iz++)
      for (let ix = x0; ix <= x1; ix++) cells[iz * SIDE + ix]!.push(c);
  }
  return { list, cells };
}

function cellOf(v: number): number {
  return Math.max(0, Math.min(SIDE - 1, Math.floor((v + HALF) / CELL)));
}

// The fixed table never changes; stalls and placed decor are added per world and cached
// until something is placed or the village grows. This runs for every walker on every sim
// step, so the cached path must not allocate.
const FIXED = buildTable(GROVE_COLLIDERS.filter((c) => !c.when));
let cachedPlaced: World['placed'] | null = null;
let cachedKey = '';
let cached: Table = FIXED;

function table(world: World | null): Table {
  if (!world) return FIXED;
  const u = townUnlocks(world);
  const key = `${world.placed.length}|${+u.stall}${+u.attendant}${+u.festival}`;
  if (world.placed === cachedPlaced && key === cachedKey) return cached;
  const list: Collider[] = GROVE_COLLIDERS.filter((c) => !c.when || u[c.when]);
  for (const d of world.placed) {
    const c = decorCollider(d.id, d.kind, d.pos.x, d.pos.z, d.yaw ?? 0);
    if (c) list.push(c);
  }
  cachedPlaced = world.placed;
  cachedKey = key;
  cached = list.length === FIXED.list.length ? FIXED : buildTable(list);
  return cached;
}

/** Every collider standing in this world's Grove now. */
export function obstacles(world: World | null): readonly Collider[] {
  return table(world).list;
}

function near(world: World | null, p: Vec2, radius: number): readonly Collider[] {
  const t = table(world);
  if (radius > PAD) return t.list;
  if (Math.abs(p.x) >= HALF || Math.abs(p.z) >= HALF) return t.list;
  return t.cells[cellOf(p.z) * SIDE + cellOf(p.x)]!;
}

/** The result of `contact`: the outward normal and how deep the walker is in. */
export interface Contact {
  nx: number;
  nz: number;
  depth: number;
}

const scratch: Contact = { nx: 0, nz: 0, depth: 0 };

/**
 * How far a walker of `radius` at (px, pz) overlaps the collider, and which way is out.
 * Fills `out` and returns it, or returns null when there is no overlap. Allocation-free.
 */
export function contact(
  c: Collider,
  px: number,
  pz: number,
  radius: number,
  out: Contact = scratch,
): Contact | null {
  const s = c.shape;
  const dx = px - c.x;
  const dz = pz - c.z;
  if (s.type === 'circle') return round(dx, dz, s.r + radius, out);
  // Into the collider's own frame (the inverse of a three.js rotation.y by yaw).
  const cos = Math.cos(c.yaw);
  const sin = Math.sin(c.yaw);
  const lx = dx * cos - dz * sin;
  const lz = dx * sin + dz * cos;
  if (s.type === 'segment') {
    const h = s.len / 2;
    const qx = Math.max(-h, Math.min(h, lx));
    if (!round(lx - qx, lz, s.r + radius, out)) return null;
    return toWorld(out, cos, sin);
  }
  const qx = Math.max(-s.hw, Math.min(s.hw, lx));
  const qz = Math.max(-s.hd, Math.min(s.hd, lz));
  if (qx !== lx || qz !== lz) {
    if (!round(lx - qx, lz - qz, radius, out)) return null;
    return toWorld(out, cos, sin);
  }
  // The centre is inside the box: out through the nearest face.
  const fx = s.hw - Math.abs(lx);
  const fz = s.hd - Math.abs(lz);
  if (fx < fz) {
    out.nx = lx >= 0 ? 1 : -1;
    out.nz = 0;
    out.depth = fx + radius;
  } else {
    out.nx = 0;
    out.nz = lz >= 0 ? 1 : -1;
    out.depth = fz + radius;
  }
  return toWorld(out, cos, sin);
}

function round(dx: number, dz: number, min: number, out: Contact): Contact | null {
  // Squared compare first: this runs for every walker every step, mostly far away.
  const d2 = dx * dx + dz * dz;
  if (d2 >= min * min) return null;
  const d = Math.sqrt(d2);
  if (d < 1e-6) {
    out.nx = 1;
    out.nz = 0;
  } else {
    out.nx = dx / d;
    out.nz = dz / d;
  }
  out.depth = min - d;
  return out;
}

function toWorld(out: Contact, cos: number, sin: number): Contact {
  const nx = out.nx * cos + out.nz * sin;
  const nz = -out.nx * sin + out.nz * cos;
  out.nx = nx;
  out.nz = nz;
  return out;
}

/** True when a walker of `radius` at the point overlaps anything that stops it. */
export function blocked(
  p: Vec2,
  world: World | null,
  radius = 0,
  who: Walker = 'keeper',
  feetY?: number,
): boolean {
  for (const c of near(world, p, radius))
    if (blocks(c, who, feetY) && contact(c, p.x, p.z, radius)) return true;
  return false;
}

/**
 * Push a walker out of every collider it overlaps, sliding along the edge. Returns true
 * if it was moved.
 */
export function resolve(
  p: Vec2,
  world: World | null,
  radius = 0.35,
  who: Walker = 'keeper',
  feetY?: number,
): boolean {
  let moved = false;
  for (const c of near(world, p, radius)) {
    if (!blocks(c, who, feetY)) continue;
    const hit = contact(c, p.x, p.z, radius);
    if (!hit) continue;
    p.x += hit.nx * hit.depth;
    p.z += hit.nz * hit.depth;
    moved = true;
  }
  return moved;
}

/** The soft piece (a bush, a bed, a thicket) the Keeper is pushing through, if any. */
export function softAt(p: Vec2, world: World | null, radius = 0.35): Collider | null {
  for (const c of near(world, p, radius))
    if (c.flags.includes('soft') && contact(c, p.x, p.z, radius)) return c;
  return null;
}

/**
 * The highest standable top (a bench, a log, a flat stone) under the point, or -Infinity
 * (MOVE-10). `footing` takes it only when the feet are within a step of it.
 */
export function standTopAt(world: World | null, x: number, z: number): number {
  let best = -Infinity;
  for (const c of near(world, { x, z }, 0))
    if (c.flags.includes('standable') && contact(c, x, z, 0))
      best = Math.max(best, colliderTopY(c));
  return best;
}
