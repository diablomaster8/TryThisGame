/**
 * R0293 (FUN-04), the travelling half: the three personality gags that move a Nubbin or a
 * thing, which the in-place gags (render/gag-play.ts) could not do.
 *
 * - Lazy: rolls instead of walking now and then (a wander walk drawn as a tumble), and lies
 *   in the stream and lets it carry it about a tile downstream.
 * - Mischievous: when it bats the ball near the pond, it aims for the water; a ball that
 *   goes in gives a splash and a grin, then bobs back to the bank.
 *
 * A child plays its leaning's gags at half the rate. Which walk rolls is a hash of the
 * Nubbin and the walk's start, so the world's dice are untouched and both renderers read
 * the same answer (`rollWalk`). Gags never change stats.
 */
import { GROVE } from '../config/tuning';
import { TRAVEL_GAGS } from '../config/tuning-fun-r10';
import { leaningPersonality } from './personality';
import { hashSeed } from './rng';
import { riverDistance } from './terrain';
import type { Nubbin, SimEvent, Vec2, World } from './types';

function rate(n: Nubbin, perMille: number): number {
  return n.stage === 'child' ? perMille / 2 : perMille;
}

/** Whether this wander walk is one the lazy Nubbin rolls instead of walking. */
export function rollWalk(n: Nubbin): boolean {
  const b = n.behavior;
  if (b.state !== 'wander' || n.stage === 'egg' || n.y > 0.05) return false;
  if (leaningPersonality(n) !== 'lazy') return false;
  const roll = (hashSeed(`${n.id}:roll:${b.sinceMs}`) >>> 0) % 1000;
  return roll < rate(n, TRAVEL_GAGS.rollPerMille);
}

/** Whether a lazy Nubbin is lying in the stream (on a wander, in the channel). */
export function streamFloating(n: Nubbin, location: World['location'] = 'grove'): boolean {
  if (location !== 'grove' || n.behavior.state !== 'wander' || n.stage === 'egg') return false;
  if (leaningPersonality(n) !== 'lazy') return false;
  return riverDistance(n.pos.x, n.pos.z) < TRAVEL_GAGS.streamHalfWidth;
}

/** The stream's downhill direction near `p`: along the nearest leg, inflow to pond to out. */
function flowAt(p: Vec2): Vec2 | null {
  let best: { d: number; dir: Vec2 } | null = null;
  for (const line of [GROVE.river.inflow, GROVE.river.outflow]) {
    for (let i = 0; i + 1 < line.length; i++) {
      const a = line[i]!;
      const b = line[i + 1]!;
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const len2 = dx * dx + dz * dz || 1;
      const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / len2));
      const d = Math.hypot(a.x + dx * t - p.x, a.z + dz * t - p.z);
      if (!best || d < best.d) {
        const len = Math.sqrt(len2);
        best = { d, dir: { x: dx / len, z: dz / len } };
      }
    }
  }
  return best?.dir ?? null;
}

const carried = new WeakMap<Nubbin, { since: number; left: number }>();

/**
 * Each wander step: a lazy Nubbin in the stream drifts downstream, up to about a tile per
 * walk, at the stream's pace. Returns true while it is being carried (the caller skips the
 * walk for that step).
 */
export function stepStreamFloat(n: Nubbin, world: World, dtMs: number): boolean {
  if (!streamFloating(n, world.location)) return false;
  const b = n.behavior;
  let m = carried.get(n);
  if (!m || m.since !== b.sinceMs) {
    const roll = (hashSeed(`${n.id}:float:${b.sinceMs}`) >>> 0) % 1000;
    m = {
      since: b.sinceMs,
      left: roll < rate(n, TRAVEL_GAGS.floatPerMille) ? TRAVEL_GAGS.floatTiles : 0,
    };
    carried.set(n, m);
  }
  if (m.left <= 0) return false;
  const dir = flowAt(n.pos);
  if (!dir) return false;
  const step = Math.min(m.left, (TRAVEL_GAGS.floatSpeed * dtMs) / 1000);
  n.pos.x += dir.x * step;
  n.pos.z += dir.z * step;
  m.left -= step;
  return true;
}

/**
 * The angle a mischievous Nubbin bats the ball at, when the pond is near enough to aim
 * for: straight at the water. Null otherwise (the caller keeps its random angle).
 */
export function ballPushAngle(n: Nubbin, ball: Vec2): number | null {
  if (leaningPersonality(n) !== 'mischievous') return null;
  const dx = GROVE.pond.x - ball.x;
  const dz = GROVE.pond.z - ball.z;
  if (Math.hypot(dx, dz) > GROVE.pond.r + TRAVEL_GAGS.ballPondReach) return null;
  const roll = (hashSeed(`${n.id}:ball:${n.behavior.sinceMs}`) >>> 0) % 1000;
  if (roll >= rate(n, TRAVEL_GAGS.ballPerMille)) return null;
  return Math.atan2(dz, dx);
}

/**
 * After a bat: a ball that went into the pond splashes (the Nubbin grins), then bobs back
 * to the bank on the far side of where it went in, so it can be played with again.
 */
export function ballSplash(n: Nubbin, ball: Vec2, events: SimEvent[]): boolean {
  const dx = ball.x - GROVE.pond.x;
  const dz = ball.z - GROVE.pond.z;
  const d = Math.hypot(dx, dz);
  if (d >= GROVE.pond.r - 0.3) return false;
  const k = d > 0.01 ? 1 / d : 0;
  const ux = d > 0.01 ? dx * k : 1;
  const uz = d > 0.01 ? dz * k : 0;
  ball.x = GROVE.pond.x - ux * (GROVE.pond.r + 0.4);
  ball.z = GROVE.pond.z - uz * (GROVE.pond.r + 0.4);
  events.push({ kind: 'ballSplash', nubbinId: n.id });
  return true;
}
