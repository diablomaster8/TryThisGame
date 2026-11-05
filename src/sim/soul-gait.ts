/**
 * R0570 (SOUL-53): a wander walk per personality. A cheerful one skips along quicker, a shy
 * one takes small careful steps, a mischievous one tiptoes and darts, a lazy one shuffles,
 * a bold one marches, a dreamy one meanders (a sideways sine on its path). The sim scales
 * the wander's speed and adds the meander; the renderers read `gaitOf` for the cycle, bob
 * and roll. Plain wandering only, in live play (`soulLive`); a child leans at half strength.
 */
import { GAIT } from '../config/tuning-soul-r11';
import { OLD_SOUL_TEACH } from '../config/tuning-soul-r11h';
import { soulLive } from './antics';
import { leaningPersonality } from './personality';
import type { Nubbin, Personality } from './types';

export interface SoulGait {
  speed: number;
  cadence: number;
  bob: number;
  waddle: number;
  meander: number;
}

/** R0592: an Eternal's slow, steady, even walk. */
const OLD_GAIT: SoulGait = {
  speed: OLD_SOUL_TEACH.gait,
  cadence: 0.6,
  bob: 0.5,
  waddle: 0.5,
  meander: 0,
};
const PLAIN: SoulGait = { speed: 1, cadence: 1, bob: 1, waddle: 1, meander: 0 };

/** This Nubbin's gait (a child's leaning at half strength; none yet: plain). */
export function gaitOf(
  n: Pick<Nubbin, 'personality' | 'stage' | 'childCare' | 'stageMs'> & { eternal?: unknown },
): SoulGait {
  if (n.eternal) return OLD_GAIT;
  const p: Personality | null =
    n.personality ?? (n.stage === 'child' ? leaningPersonality(n as Nubbin) : null);
  if (!p) return PLAIN;
  const g = GAIT[p];
  if (n.personality) return g;
  const h = (v: number): number => 1 + (v - 1) * 0.5;
  return {
    speed: h(g.speed),
    cadence: h(g.cadence),
    bob: h(g.bob),
    waddle: h(g.waddle),
    meander: g.meander * 0.5,
  };
}

/** Whether this act is a plain wander (no errand, no quirk walk). */
export function plainWander(n: Nubbin): boolean {
  return n.behavior.state === 'wander' && !n.behavior.itemId;
}

/** The wander speed multiplier now (a mischievous one darts now and then). */
export function gaitSpeed(n: Nubbin, now: number): number {
  if (!soulLive() || !plainWander(n)) return 1;
  const g = gaitOf(n);
  if (
    n.personality === 'mischievous' &&
    !n.eternal &&
    (now - n.behavior.sinceMs) % GAIT.dartEveryMs < GAIT.dartMs
  )
    return g.speed * GAIT.dartSpeed;
  return g.speed;
}

/**
 * The meander's sideways step this tick, across the heading to `target` (zero for all but
 * the dreamy). Small: at most `meander` units a second.
 */
export function meanderStep(
  n: Nubbin,
  target: { x: number; z: number },
  now: number,
  dtMs: number,
): { x: number; z: number } {
  if (!soulLive() || !plainWander(n)) return { x: 0, z: 0 };
  const m = gaitOf(n).meander;
  if (m <= 0) return { x: 0, z: 0 };
  const dx = target.x - n.pos.x;
  const dz = target.z - n.pos.z;
  const l = Math.hypot(dx, dz);
  if (l < 0.5) return { x: 0, z: 0 };
  const s =
    Math.sin(((now - n.behavior.sinceMs) / GAIT.meanderMs) * Math.PI * 2) * m * (dtMs / 1000);
  return { x: (-dz / l) * s, z: (dx / l) * s };
}
