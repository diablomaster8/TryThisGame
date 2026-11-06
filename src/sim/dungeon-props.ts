/**
 * Solid set pieces on a Hollow floor (R0032, MOVE-32). The sim used to know only walls, so
 * the Keeper walked straight through the great chamber's landmark. Each prop here is a
 * circle on the floor, made from the floor data both renderers draw from;
 * `resolveDungeon` pushes bodies out of them and the nav mask closes the landmark's cells.
 *
 * The timber arches and the parked cart are placed here from the main path (`setPieces`),
 * and the 3D dressing draws them from the same list, so what is drawn is what is solid
 * (R0032, round 11).
 *
 * Pure sim: no DOM.
 */
import { DUNGEON, HOLLOW } from '../config/tuning';
import { JUMP } from '../config/tuning-sim';
import { cellAt, cellCentre, FLOOR, type Cell, type Floor } from './dungeon';
import { setPieces } from './dungeon-set-pieces';
import type { Vec2 } from './types';

export interface PropCollider {
  kind: 'landmark' | 'post' | 'cart' | 'crystal';
  /** A soft-nav prop (a post at the rock, a cart on a path) leaves its cell open for routes. */
  softNav?: boolean;
  x: number;
  z: number;
  /** World units. */
  r: number;
  /** A prop with a flat top the Keeper can jump onto and stand on (R0032): its height. */
  top?: number;
}

const cache = new WeakMap<Floor, PropCollider[]>();

/** Whether a crystal's cell is a dead end or has open ground all round it. */
function crystalMaySolid(f: Floor, c: Cell): boolean {
  const open = (x: number, y: number) => {
    const v = cellAt(f, x, y);
    return v === FLOOR;
  };
  let orth = 0;
  for (const [dx, dy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as const)
    if (open(c.x + dx, c.y + dy)) orth++;
  if (orth === 1) return true;
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) if (!open(c.x + dx, c.y + dy)) return dx === 0 && dy === 0;
  return true;
}

/** The floor's solid props, made once per floor. */
export function floorProps(f: Floor): PropCollider[] {
  const hit = cache.get(f);
  if (hit) return hit;
  const P = HOLLOW.props;
  const out: PropCollider[] = [];
  const cell = DUNGEON.cell;
  if (f.landmark && f.landmark.kind !== 'waterfallPool') {
    const p = cellCentre(f, f.landmark.cell);
    out.push({ kind: 'landmark', x: p.x, z: p.z, r: f.landmark.radius * P.landmarkShare * cell });
  }
  const sp = setPieces(f);
  for (const a of sp.arches)
    for (const sgn of [-1, 1])
      out.push({
        kind: 'post',
        softNav: true,
        x: a.cx + a.px * a.half * sgn,
        z: a.cz + a.pz * a.half * sgn,
        r: P.postRadius,
      });
  if (sp.cart)
    // A box 0.62 x 0.95 as two circles along its axis, so the Keeper walks round it.
    for (const k of [-0.2, 0.2])
      out.push({
        kind: 'cart',
        softNav: true,
        x: sp.cart.x + Math.sin(sp.cart.axis) * k,
        z: sp.cart.z + Math.cos(sp.cart.axis) * k,
        r: P.cartRadius,
        top: P.cartTop,
      });
  // Crystals (R0032, round 12): solid only where a walker is never walled out, a dead end's
  // last cell or open ground with all eight neighbours free. In a corridor or at a junction
  // a collider would close the way, so there the crystal stays a soft, chiming thing.
  for (const c of f.crystals) {
    if (!crystalMaySolid(f, c)) continue;
    const p = cellCentre(f, c);
    out.push({ kind: 'crystal', softNav: true, x: p.x, z: p.z, r: P.crystalRadius });
  }
  cache.set(f, out);
  return out;
}

/** Feet at or above a prop's top pass over it (R0032: the Keeper jumped onto the cart). */
function overTop(c: PropCollider, feetY: number): boolean {
  return c.top !== undefined && feetY >= c.top - HOLLOW.props.topSlack;
}

/**
 * The height of the prop top the Keeper stands over (0 when none): feet must have cleared
 * the top less `JUMP.stepUp`, and the body centre be within the prop's footprint.
 */
export function propStandAt(f: Floor, p: Vec2, feetY: number): number {
  let best = 0;
  for (const c of floorProps(f)) {
    if (c.top === undefined || c.top <= best) continue;
    if (feetY < c.top - JUMP.stepUp) continue;
    if (Math.hypot(p.x - c.x, p.z - c.z) < c.r + HOLLOW.props.topEdge) best = c.top;
  }
  return best;
}

/** Pushes a body of `radius` out of every prop it overlaps; true when it moved. */
export function resolveProps(p: Vec2, f: Floor, radius: number, feetY = 0): boolean {
  let moved = false;
  for (const c of floorProps(f)) {
    if (overTop(c, feetY)) continue;
    const dx = p.x - c.x;
    const dz = p.z - c.z;
    const d = Math.hypot(dx, dz);
    const min = c.r + radius;
    if (d >= min) continue;
    moved = true;
    // Dead centre: out along +x, a fixed choice so the sim stays repeatable.
    const ux = d < 1e-6 ? 1 : dx / d;
    const uz = d < 1e-6 ? 0 : dz / d;
    p.x = c.x + ux * min;
    p.z = c.z + uz * min;
  }
  return moved;
}

/**
 * A body squeezed between a prop and rock (a rock cell inside the landmark's circle): step it
 * to the nearest free spot just clear of the prop, trying 16 directions closest-first.
 * `walls` says whether a spot is blocked by rock alone.
 */
export function escapeProps(
  p: Vec2,
  f: Floor,
  radius: number,
  walls: (q: Vec2) => boolean,
  feetY = 0,
): void {
  for (const c of floorProps(f)) {
    if (overTop(c, feetY)) continue;
    if (Math.hypot(p.x - c.x, p.z - c.z) >= c.r + radius - 1e-6) continue;
    const a0 = Math.atan2(p.z - c.z, p.x - c.x);
    const d = c.r + radius + 0.02;
    const tries: Vec2[] = [];
    for (let k = 0; k < 16; k++) {
      // 0, +1, -1, +2, -2 … steps of 22.5° away from where the body already leans.
      const step = Math.ceil(k / 2) * (k % 2 ? 1 : -1);
      const a = a0 + (step * Math.PI) / 8;
      tries.push({ x: c.x + Math.cos(a) * d, z: c.z + Math.sin(a) * d });
    }
    const ok = tries.find((q) => !walls(q) && !propBlocked(q, f, radius));
    if (ok) {
      p.x = ok.x;
      p.z = ok.z;
    }
  }
}

/**
 * Whether walking straight from a to b brings a body of `radius` into a prop. A body already
 * touching one may still walk away from it: only the stretch that comes closer counts.
 */
export function propOnLine(f: Floor, a: Vec2, b: Vec2, radius: number): boolean {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const len2 = dx * dx + dz * dz;
  return floorProps(f).some((c) => {
    const t =
      len2 < 1e-9 ? 0 : Math.max(0, Math.min(1, ((c.x - a.x) * dx + (c.z - a.z) * dz) / len2));
    const d = Math.hypot(a.x + dx * t - c.x, a.z + dz * t - c.z);
    const start = Math.hypot(a.x - c.x, a.z - c.z);
    return d < Math.min(c.r + radius, start) - 1e-3;
  });
}

/** Whether a body of `radius` at `p` overlaps a prop. */
export function propBlocked(p: Vec2, f: Floor, radius: number): boolean {
  return floorProps(f).some((c) => Math.hypot(p.x - c.x, p.z - c.z) < c.r + radius);
}

/**
 * Cells a walker can't stand at the centre of: within a prop plus the body's clearance
 * (`HOLLOW.props.navClearance`), so a route never aims at a spot the collider pushes it off.
 */
export function propCells(f: Floor): number[] {
  const out: number[] = [];
  const pad = HOLLOW.props.navClearance;
  for (const c of floorProps(f)) {
    if (c.softNav) continue;
    const span = Math.ceil((c.r + pad) / DUNGEON.cell) + 1;
    const mid = {
      x: Math.floor(c.x / DUNGEON.cell + f.cols / 2),
      y: Math.floor(c.z / DUNGEON.cell + f.rows / 2),
    };
    for (let y = Math.max(0, mid.y - span); y <= Math.min(f.rows - 1, mid.y + span); y++)
      for (let x = Math.max(0, mid.x - span); x <= Math.min(f.cols - 1, mid.x + span); x++) {
        const q = cellCentre(f, { x, y });
        if (Math.hypot(q.x - c.x, q.z - c.z) < c.r + pad) out.push(y * f.cols + x);
      }
  }
  return out;
}
