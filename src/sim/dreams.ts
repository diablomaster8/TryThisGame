/**
 * R0586 (lane A round 11): what a napping Nubbin dreams about. A thought bubble cycles its
 * favourite fruit, its best friend and the Keeper while it naps; lazy and dreamy ones dream
 * twice as often. Pure and read-only: a function of the Nubbin and the sim clock, so both
 * renderers (and the HUD) agree without a stored field.
 */
import { DREAMS } from '../config/tuning-more/soul-wider-kindergarten';
import { bestFriend } from './friendships';
import { likesOf } from './likes';
import { basePersonality } from './personality';
import type { Nubbin, World } from './types';

export type DreamKind = 'fruit' | 'friend' | 'keeper';
export interface Dream {
  kind: DreamKind;
  /** The friend's name for the friend dream. */
  who?: string;
  /** The favourite fruit's flavour for the fruit dream. */
  taste?: string;
}

/** How long between dreams for this Nubbin, in ms. */
export function dreamEveryMs(n: Nubbin): number {
  const p = n.personality ? basePersonality(n.personality) : null;
  return p === 'lazy' || n.personality === 'dreamy' ? DREAMS.everyMs / 2 : DREAMS.everyMs;
}

/** The dream showing now (the first bubble comes a few seconds into the nap), or null. */
export function dreamNow(world: World, n: Nubbin): Dream | null {
  if (n.behavior.state !== 'nap') return null;
  const t = world.timeMs - n.behavior.sinceMs - DREAMS.firstMs;
  if (t < 0) return null;
  const every = dreamEveryMs(n);
  if (t % every >= DREAMS.holdMs) return null;
  const k = Math.floor(t / every);
  const friend = bestFriend(world, n);
  const choices: Dream[] = [{ kind: 'fruit', taste: likesOf(n).fruit }];
  if (friend) choices.push({ kind: 'friend', who: friend.name });
  choices.push({ kind: 'keeper' });
  return choices[k % choices.length]!;
}
