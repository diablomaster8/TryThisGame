import { BATTLE } from '../../config/tuning-battle';
import { colliderReach, contact, obstacles, stops, type Collider } from '../obstacles';
import type { Vec2, World } from '../types';

/**
 * The battle stage in the open Grove (recs MOVE-62): an arena circle around the bout's centre
 * that holds the same colliders the Keeper and the Nubbins walk round. Lunges stop at a
 * collider or the arena's edge, knockback slides along colliders instead of passing through,
 * and a thrown move bounces off them. Pure geometry: the views ask where a body may go and
 * never move one through a house.
 */
export interface Arena {
  centre: Vec2;
  r: number;
  colliders: readonly Collider[];
}

const A = BATTLE.arena;

/** The arena around `centre`: every Nubbin-stopping collider that reaches into the circle. */
export function arenaAt(world: World | null, centre: Vec2, r: number = A.radius): Arena {
  const colliders = obstacles(world).filter(
    (c) => stops(c, 'nubbin') && Math.hypot(c.x - centre.x, c.z - centre.z) <= r + colliderReach(c),
  );
  return { centre: { ...centre }, r, colliders };
}

/** Whether a body of `radius` at `p` overlaps a collider or leaves the circle. */
export function arenaBlocked(a: Arena, p: Vec2, radius: number = A.body): boolean {
  if (Math.hypot(p.x - a.centre.x, p.z - a.centre.z) > a.r - radius) return true;
  return a.colliders.some((c) => contact(c, p.x, p.z, radius) !== null);
}

/** How far a lunge from `from` toward `to` gets: the last free point before anything solid. */
export function lunge(a: Arena, from: Vec2, to: Vec2, radius: number = A.body): Vec2 {
  const dist = Math.hypot(to.x - from.x, to.z - from.z);
  const steps = Math.max(1, Math.ceil(dist / A.step));
  let last = { ...from };
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const p = { x: from.x + (to.x - from.x) * t, z: from.z + (to.z - from.z) * t };
    if (arenaBlocked(a, p, radius)) break;
    last = p;
  }
  return last;
}

/** Pushes `p` out of any collider it overlaps and back inside the circle. */
function pushOut(a: Arena, p: Vec2, radius: number): void {
  for (let pass = 0; pass < 3; pass++) {
    let moved = false;
    for (const c of a.colliders) {
      const hit = contact(c, p.x, p.z, radius);
      if (!hit) continue;
      p.x += hit.nx * (hit.depth + 1e-4);
      p.z += hit.nz * (hit.depth + 1e-4);
      moved = true;
    }
    if (!moved) break;
  }
  const dx = p.x - a.centre.x;
  const dz = p.z - a.centre.z;
  const d = Math.hypot(dx, dz);
  const max = a.r - radius;
  if (d > max) {
    p.x = a.centre.x + (dx / d) * max;
    p.z = a.centre.z + (dz / d) * max;
  }
}

/** Knockback: `dist` along `dir`, sliding along whatever it meets. */
export function knockback(
  a: Arena,
  p: Vec2,
  dir: Vec2,
  dist: number,
  radius: number = A.body,
): Vec2 {
  const len = Math.hypot(dir.x, dir.z) || 1;
  const steps = Math.max(1, Math.ceil(dist / A.step));
  const out = { ...p };
  for (let i = 0; i < steps; i++) {
    out.x += (dir.x / len) * (dist / steps);
    out.z += (dir.z / len) * (dist / steps);
    pushOut(a, out, radius);
  }
  return out;
}

/** A thrown move's flight: `time` seconds at `vel`, bouncing off colliders and the edge. */
export function bounce(
  a: Arena,
  p: Vec2,
  vel: Vec2,
  time: number,
  radius: number = A.thrown,
): { at: Vec2; vel: Vec2; bounces: number } {
  const at = { ...p };
  const v = { ...vel };
  let bounces = 0;
  const speed = Math.hypot(v.x, v.z);
  const steps = Math.max(1, Math.ceil((speed * time) / A.step));
  const dt = time / steps;
  for (let i = 0; i < steps; i++) {
    const next = { x: at.x + v.x * dt, z: at.z + v.z * dt };
    let n: Vec2 | null = null;
    for (const c of a.colliders) {
      const hit = contact(c, next.x, next.z, radius);
      if (hit) n = { x: hit.nx, z: hit.nz };
    }
    const dx = next.x - a.centre.x;
    const dz = next.z - a.centre.z;
    const d = Math.hypot(dx, dz);
    if (!n && d > a.r - radius) n = { x: -dx / d, z: -dz / d };
    if (n) {
      // Reflect off the surface and stay where we were this step.
      const dot = v.x * n.x + v.z * n.z;
      if (dot < 0) {
        v.x -= 2 * dot * n.x;
        v.z -= 2 * dot * n.z;
        bounces += 1;
      }
      continue;
    }
    at.x = next.x;
    at.z = next.z;
  }
  return { at, vel: v, bounces };
}
