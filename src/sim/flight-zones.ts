/**
 * R0109 (WORLD-23): flying zones, built on the height field (`height.ts`). With a Fly
 * partner (Fly level `FLIGHT_ZONES.fly` or more) in the party:
 * - an updraft at a cliff's foot lifts the Keeper two terrace levels, up and in onto the
 *   shelf behind it, in 1.2 s;
 * - a glide line from a hill top's lookout carries the Keeper out and down, 8 units for each
 *   level dropped, steering only left and right (a Learning Grove rides the line as a rail).
 * Each zone is data (a hill and an angle), placed from the hill's terraces. Stepping onto a
 * zone's spot sets it off; while it runs it moves the Keeper in place of the walking step.
 * The flight is transient: a reload mid-glide leaves the Keeper where the save caught it,
 * and `updateKeeper` drops it to the ground there.
 */
import { FLIGHT_ZONES } from '../config/tuning-r11d2';
import { JUMP } from '../config/tuning-sim';
import { keeperFooting } from './keeper';
import { terraceAt } from './height';
import { levelOf } from './stats';
import { TERRACES } from './terrain';
import type { Vec2, World } from './types';

export interface FlightZone {
  kind: 'updraft' | 'glide';
  /** Where the Keeper steps to set it off. */
  at: Vec2;
  /** Where it sets the Keeper down (a glide: with no steering). */
  to: Vec2;
  /** The unit heading from `at` toward `to`. */
  dir: Vec2;
}

function place(hill: number, deg: number, r: number): Vec2 {
  const t = TERRACES[hill]!;
  const a = (deg * Math.PI) / 180;
  return { x: t.x + Math.cos(a) * r, z: t.z + Math.sin(a) * r };
}

function unit(a: Vec2, b: Vec2): Vec2 {
  const d = Math.hypot(b.x - a.x, b.z - a.z) || 1;
  return { x: (b.x - a.x) / d, z: (b.z - a.z) / d };
}

/** Every flying zone in the Grove, placed once from the data. */
export const FLIGHT_SPOTS: readonly FlightZone[] = (() => {
  const out: FlightZone[] = [];
  const F = FLIGHT_ZONES;
  for (const u of F.updrafts) {
    const t = TERRACES[u.hill]!;
    const k = Math.min(F.liftLevels, t.tiers.length - 1);
    // The shelf `liftLevels` up: between that tier's rim and the next one in.
    const r = (t.tiers[k - 1]!.r + t.tiers[k]!.r) / 2;
    const at = place(u.hill, u.angleDeg, t.r + 0.9);
    const to = place(u.hill, u.angleDeg, r);
    out.push({ kind: 'updraft', at, to, dir: unit(at, to) });
  }
  for (const g of F.glides) {
    const t = TERRACES[g.hill]!;
    const top = t.tiers[t.tiers.length - 1]!.r;
    const at = place(g.hill, g.angleDeg, top - 0.6);
    const dir = unit(at, place(g.hill, g.angleDeg, top + 1));
    const len = terraceAt('grove', at.x, at.z) * F.perLevel;
    out.push({ kind: 'glide', at, to: { x: at.x + dir.x * len, z: at.z + dir.z * len }, dir });
  }
  return out;
})();

interface Flight {
  zone: FlightZone;
  ms: number;
  /** The whole flight's length (ms). */
  total: number;
  /** A glide's sideways offset so far (units, + to the left of the heading). */
  side: number;
  y0: number;
  y1: number;
}

const flights = new WeakMap<World, Flight>();

/** The flight under way: its kind and how far along it is (0..1), or null. */
export function keeperFlight(world: World): { kind: FlightZone['kind']; t: number } | null {
  const f = flights.get(world);
  return f ? { kind: f.zone.kind, t: Math.min(1, f.ms / f.total) } : null;
}

/** A partner strong enough to fly the Keeper: in the party, hatched, Fly high enough. */
export function flyPartner(world: World): boolean {
  for (const id of world.partners) {
    if (!id) continue;
    const n = world.nubbins.find((m) => m.id === id);
    if (n && n.stage !== 'egg' && levelOf(n.stats.fly.points) >= FLIGHT_ZONES.fly) return true;
  }
  return false;
}

/** Where a glide sets down with sideways offset `side` (the planned spot at 0). */
export function glideLanding(zone: FlightZone, side = 0): Vec2 {
  return { x: zone.to.x - zone.dir.z * side, z: zone.to.z + zone.dir.x * side };
}

/**
 * After the Keeper's walking step from (fx, fz): a step inside a zone's spot heading its
 * way (out over the edge for a glide, in toward the cliff for an updraft), on or just over
 * the ground, with a Fly partner, starts its flight. Any step inside counts, not only the
 * first: a lip under the feet can leave the Keeper a hair airborne on that one.
 */
export function flightTrigger(world: World, fx: number, fz: number): void {
  const k = world.keeper;
  if (world.location !== 'grove' || flights.has(world) || k.carrying || world.ride) return;
  const R = FLIGHT_ZONES.reach;
  for (const z of FLIGHT_SPOTS) {
    if (Math.hypot(k.pos.x - z.at.x, k.pos.z - z.at.z) > R) continue;
    if ((k.pos.x - fx) * z.dir.x + (k.pos.z - fz) * z.dir.z <= 0) continue;
    if (k.y - keeperFooting(world, k.pos.x, k.pos.z, k.y).y > JUMP.stepUp) continue;
    if (!flyPartner(world)) return;
    const len = Math.hypot(z.to.x - z.at.x, z.to.z - z.at.z);
    flights.set(world, {
      zone: z,
      ms: 0,
      total: z.kind === 'updraft' ? FLIGHT_ZONES.liftMs : (len / FLIGHT_ZONES.glideSpeed) * 1000,
      side: 0,
      y0: k.y,
      y1: keeperFooting(world, z.to.x, z.to.z).y,
    });
    k.pos = { ...z.at };
    k.moveTarget = null;
    return;
  }
}

/**
 * One step of a flight under way, in place of the Keeper's walking step: true while it
 * runs (and on its last step). A glide reads the stick's sideways part to steer, never in a
 * Learning Grove (the rail).
 */
export function flightStep(world: World, dtMs: number): boolean {
  const f = flights.get(world);
  if (!f) return false;
  const k = world.keeper;
  const z = f.zone;
  const F = FLIGHT_ZONES;
  f.ms = Math.min(f.total, f.ms + dtMs);
  const t = f.ms / f.total;
  const glide = z.kind === 'glide';
  if (glide && !world.edu) {
    const across = -k.input.x * z.dir.z + k.input.z * z.dir.x;
    f.side = Math.max(-F.steerMax, Math.min(F.steerMax, f.side + across * F.steer * (dtMs / 1000)));
  }
  // A glide goes out along the line, the sideways offset as it stands; a lift rises over the
  // first 60 % and steps in over the cliff in the rest.
  const along = glide ? t : Math.max(0, (t - 0.6) / 0.4);
  k.pos.x = z.at.x + (z.to.x - z.at.x) * along - (glide ? z.dir.z * f.side : 0);
  k.pos.z = z.at.z + (z.to.z - z.at.z) * along + (glide ? z.dir.x * f.side : 0);
  const rise = f.y1 - f.y0;
  const y = glide
    ? f.y0 + rise * t
    : f.y0 + (rise + 0.3) * Math.sin(Math.min(1, t / 0.6) * Math.PI * 0.5);
  const ground = keeperFooting(world, k.pos.x, k.pos.z).y;
  k.vy = 0;
  if (t >= 1) {
    flights.delete(world);
    k.y = ground;
    k.grounded = true;
    return true;
  }
  k.y = Math.max(ground, y);
  k.grounded = false;
  return true;
}
