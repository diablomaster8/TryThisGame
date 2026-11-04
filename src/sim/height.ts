/**
 * R0086 (WORLD-20): the height field as one region-aware sim API. The Grove's ground,
 * terraces and ramps live in `terrain.ts` (MOVE-09, shared by both renderers); this module
 * names what the rest of the sim asks of them: how high the ground is (`heightAt`), which
 * terrace level a point is on (`terraceAt`, 0 on the plain up to 4 on the tallest hill's
 * top), whether a point is on a ramp (`onRamp`), and whether a walker may step from one point
 * to the next (`canStep`): flat or down any amount, up only by a step (a ramp rises in
 * steps), and up one whole level only for a flutter (a Fly adult). Other regions are flat
 * for now: they answer 0 and allow every step, so a new region adds its heights here.
 */
import { JUMP, TERRACE } from '../config/tuning-sim';
import { groveHeight, hillHeight, ledgeY, TERRACES, type Terrace } from './terrain';
import { regionGround, regionLevel } from './region-walk';
import type { Location, Vec2 } from './types';

/** The regions with a height field today. */
function hasHeights(region: Location): boolean {
  return region === 'grove';
}

/** The drawn ground's height at (x, z) in a region (0 where the region is flat). */
export function heightAt(region: Location, x: number, z: number): number {
  // R11 d7 (WORLD-36): a drawn region's terraces (`regionGround`; flat regions answer 0).
  if (region.startsWith('region:')) return regionGround(region)(x, z);
  return hasHeights(region) ? groveHeight(x, z) : 0;
}

/** The hill whose reach covers (x, z), or null. */
export function hillAt(x: number, z: number): Terrace | null {
  for (const t of TERRACES) {
    const dx = x - t.x;
    const dz = z - t.z;
    if (dx * dx + dz * dz < t.reach * t.reach) return t;
  }
  return null;
}

/**
 * The terrace level under (x, z): how many of the hill's tiers the hard shelf there clears
 * (0 on the plain or a ramp's foot, the tier count on the top). A point part way up a ramp
 * counts the level it has fully reached.
 */
export function terraceAt(region: Location, x: number, z: number): number {
  if (region.startsWith('region:')) return regionLevel(region, z);
  if (!hasHeights(region)) return 0;
  const t = hillAt(x, z);
  if (!t) return 0;
  const hard = hillHeight(x, z, false);
  let level = 0;
  for (const tier of t.tiers) if (tier.top <= hard + 0.01) level++;
  return Math.min(4, level);
}

/** The rise of one terrace level on the hill under (x, z) (the step a flutter clears). */
export function levelRise(x: number, z: number): number {
  const t = hillAt(x, z);
  return t ? t.h / t.tiers.length : TERRACE.maxStep;
}

/** Whether (x, z) is on a hill's ramp band (where the ground rises between levels). */
export function onRamp(region: Location, x: number, z: number): boolean {
  if (!hasHeights(region)) return false;
  const t = hillAt(x, z);
  if (!t) return false;
  const d = Math.hypot(x - t.x, z - t.z);
  const a = Math.atan2(z - t.z, x - t.x);
  for (const leg of t.ramp) {
    if (d < leg.rIn || d > leg.rOut) continue;
    const u = (((a - leg.a0) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    if (u <= leg.a1 - leg.a0) return true;
  }
  return false;
}

/**
 * Whether a walker may step from `from` to `to` (WORLD-20's movement rule): the hard
 * ground there (upright cliffs) no more than a step above where it stands, so terraces are
 * climbed by their ramps; dropping down is always allowed. `flutter` (a Fly adult) also
 * clears one whole level up a cliff face.
 */
export function canStep(region: Location, from: Vec2, to: Vec2, flutter = false): boolean {
  if (!hasHeights(region)) return true;
  const up = ledgeY(to.x, to.z) - ledgeY(from.x, from.z);
  return up <= JUMP.stepUp + (flutter ? levelRise(to.x, to.z) : 0);
}

/**
 * The walking line up a hill, as world points from the ramp's foot to the middle of the top:
 * along each ramp leg's centre line, then in across the shelf to the next. With `flutter`
 * the line starts beside the first cliff a little into the second leg, rises onto the first
 * shelf there (one level), and carries on up the ramp from that point.
 */
export function hillRoute(t: Terrace, flutter = false, step = 0.6): Vec2[] {
  const out: Vec2[] = [];
  const at = (a: number, r: number): Vec2 => ({
    x: t.x + Math.cos(a) * r,
    z: t.z + Math.sin(a) * r,
  });
  const legs = t.ramp;
  const first = legs[0]!;
  let from = 0;
  let skip = 0;
  if (flutter && legs.length > 1) {
    const leg = legs[1]!;
    const rc = (leg.rIn + leg.rOut) / 2;
    skip = Math.min(0.3, (leg.a1 - leg.a0) / 3);
    const a = leg.a0 + skip;
    out.push(at(a, t.tiers[0]!.r + 0.9), at(a, rc));
    from = 1;
  } else {
    // The foot: just outside the first leg's start.
    out.push(at(first.a0 - 0.05, (first.rIn + first.rOut) / 2 + 0.4));
  }
  for (let k = from; k < legs.length; k++) {
    const leg = legs[k]!;
    const rc = (leg.rIn + leg.rOut) / 2;
    const a0 = leg.a0 + (k === from ? skip : 0);
    const n = Math.max(2, Math.ceil(((leg.a1 - a0) * rc) / step));
    for (let i = k === from && flutter ? 1 : 0; i <= n; i++)
      out.push(at(a0 + ((leg.a1 - a0) * i) / n, rc));
  }
  const last = legs[legs.length - 1]!;
  out.push(at(last.a1, t.tiers[t.tiers.length - 1]!.r * 0.4));
  return out;
}
