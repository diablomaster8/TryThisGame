/**
 * R0355 (FUN-66): the comic beats of rule three, for both renderers. While the Keeper sits
 * and a Nubbin sits beside them (`sim/keeper-idle.ts`), the Nubbin leans in, then nods off
 * on the Keeper's foot ("asleep on your foot, which is a problem"), then snores a bubble
 * that swells and pops. Pure flavour: it reads the sim and never changes it, and the sit
 * lasts as long as it would have without them.
 */
import { SIT_WITH } from '../config/tuning-fun-r7';
import type { Nubbin, World } from '../sim/types';

export interface SitWithBeat {
  /** 0..1: how far it leans toward the Keeper. */
  lean: number;
  /** Asleep on the Keeper's foot. */
  doze: boolean;
  /** 0..1 while the snore bubble swells; 0 between bubbles. */
  bubble: number;
  /** Which bubble this is, so a renderer pops each one once. */
  bubbleN: number;
}

/** The beat for this Nubbin now, or null when it is not sitting with the Keeper. */
export function sitWithBeat(world: World, n: Nubbin, simMs: number): SitWithBeat | null {
  const k = world.keeper;
  if (k.sitWith !== n.id || k.sitBesideMs === undefined || n.behavior.state !== 'sit') return null;
  const t = simMs - k.sitBesideMs;
  const S = SIT_WITH;
  const lean = Math.min(1, Math.max(0, (t - S.leanMs) / 1500));
  const doze = t >= S.dozeMs;
  let bubble = 0;
  let bubbleN = 0;
  if (t >= S.snoreMs) {
    const u = t - S.snoreMs;
    bubbleN = Math.floor(u / S.bubbleMs) + 1;
    const p = (u % S.bubbleMs) / S.bubbleMs;
    // Swells for most of the cycle, then a gap after the pop.
    bubble = p < 0.8 ? p / 0.8 : 0;
  }
  return { lean, doze, bubble, bubbleN };
}

/** The direction from the Nubbin to the Keeper, for the lean. */
export function towardKeeper(world: World, n: Nubbin): { x: number; z: number } {
  const dx = world.keeper.pos.x - n.pos.x;
  const dz = world.keeper.pos.z - n.pos.z;
  const d = Math.hypot(dx, dz) || 1;
  return { x: dx / d, z: dz / d };
}
