/**
 * Lane E round 10 (R0709 KIDS-41, R0710 KIDS-42): the reading and touch access options, read
 * with their defaults, and the "Simple touch" tap-to-care rule. No DOM: `ui/access-r10.ts`
 * turns the resolved options into body classes.
 */
import { EGG, EGG_ANTICS } from '../config/tuning';
import type { AccessSettings, SimEvent, World } from './types';

export interface ResolvedAccess {
  font: 'default' | 'readable';
  contrast: 'normal' | 'high';
  simpleTouch: boolean;
}

/** The options in force: unset ones fall back (simple touch is on for the sprout band). */
export function accessOf(world: Pick<World, 'settings' | 'edu'>): ResolvedAccess {
  const a: AccessSettings = world.settings.access ?? {};
  return {
    font: a.font ?? 'default',
    contrast: a.contrast ?? 'normal',
    simpleTouch: a.simpleTouch ?? world.edu?.band === 'sprout',
  };
}

/**
 * KIDS-42: with Simple touch a single tap does the care a drag or hold would: a tap on an
 * egg shakes it where it lies (the same cooldown and bonus as a held shake), and a tap on a
 * hatched Nubbin sends the Keeper over to pet it. Returns what it did, for the tests.
 */
export function tapCare(
  world: World,
  nubbinId: string,
  events: SimEvent[],
): 'shake' | 'pet' | 'none' {
  if (!accessOf(world).simpleTouch) return 'none';
  const n = world.nubbins.find((x) => x.id === nubbinId);
  if (!n) return 'none';
  const now = world.timeMs;
  if (n.stage === 'egg') {
    if (now - n.lastShakeMs < EGG.shakeCooldownMs) return 'none';
    n.lastShakeMs = now;
    n.hatchRemainingMs = Math.max(0, n.hatchRemainingMs - EGG.shakeBonusMs);
    n.eggShakes = (n.eggShakes ?? 0) + 1;
    const foot = n.eggShakes % EGG_ANTICS.footEvery === 0;
    events.push({ kind: 'eggShaken', nubbinId: n.id, ...(foot ? { foot: true as const } : {}) });
    return 'shake';
  }
  if (n.behavior.state === 'held' || n.behavior.state === 'thrown') return 'none';
  world.keeper.intent = { kind: 'pet', nubbinId: n.id };
  world.keeper.moveTarget = null;
  return 'pet';
}
