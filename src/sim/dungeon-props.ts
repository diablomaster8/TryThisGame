/**
 * Solid set pieces on a Hollow floor (R0032, MOVE-32). The sim used to know only walls, so
 * the Keeper walked straight through the great chamber's landmark. Each prop here is a
 * circle on the floor, made from the floor data both renderers draw from;
 * `resolveDungeon` pushes bodies out of them and the nav mask closes the landmark's cells.
 *
 * The parked cart and the timber arch posts are placed by the 3D dressing from the main
 * path (`render3d/hollow-dress-set.ts`); moving that placement into the sim is still to do.
 *
 * Pure sim: no DOM.
 */
import { DUNGEON, HOLLOW } from '../config/tuning';
import { cellCentre, type Floor } from './dungeon';
import type { Vec2 } from './types';

export interface PropCollider {
  kind: 'landmark';
  x: number;
  z: number;
  /** World units. */
  r: number;
}

const cache = new WeakMap<Floor, PropCollider[]>();

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
  // Crystals stay soft: each sits at the back of a one-cell nook and chimes when brushed
  // (item 44); a collider there walled walkers out of the nook (R0032 assumption).
  cache.set(f, out);
  return out;
}

/** Pushes a body of `radius` out of every prop it overlaps; true when it moved. */
export function resolveProps(p: Vec2, f: Floor, radius: number): boolean {
  let moved = false;
  for (const c of floorProps(f)) {
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
export function escapeProps(p: Vec2, f: Floor, radius: number, walls: (q: Vec2) => boolean): void {
  for (const c of floorProps(f)) {
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
