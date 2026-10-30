/**
 * LOOK-50: how a Nubbin takes being held, read from its affection: one that loves the Keeper
 * hugs the arm (happy eyes, a heart), a lukewarm one dangles with its legs swinging, and one
 * that hardly knows the Keeper flails with a swirl over its head. A Moon adult held by a Sun
 * Keeper squirms a little: it dangles where it would hug. Both renderers read this; the sim
 * never does.
 */
import { HELD_REACT } from '../config/tuning';
import type { KeeperAlignment, Nubbin } from '../sim/types';

export type HeldMood = 'hug' | 'dangle' | 'flail';

export function heldMood(
  n: Pick<Nubbin, 'needs' | 'stage' | 'form'>,
  keeper?: KeeperAlignment,
): HeldMood {
  if (n.needs.affection < HELD_REACT.flail) return 'flail';
  if (n.needs.affection < HELD_REACT.hug) return 'dangle';
  const squirm = keeper === 'sun' && n.stage === 'adult' && n.form?.band === 'moon';
  return squirm ? 'dangle' : 'hug';
}

/** Whether the sim has the Nubbin in the Keeper's hands. */
export const isHeld = (n: Pick<Nubbin, 'behavior'>): boolean =>
  n.behavior.state === 'held' || n.behavior.state === 'carried';

/** The emote a held Nubbin shows over its usual one: a heart for a hug, a swirl for a flail. */
export function heldEmote(
  n: Pick<Nubbin, 'needs' | 'stage' | 'form' | 'behavior'>,
  keeper?: KeeperAlignment,
): 'heart' | 'spiral' | null {
  if (!isHeld(n)) return null;
  const mood = heldMood(n, keeper);
  return mood === 'hug' ? 'heart' : mood === 'flail' ? 'spiral' : null;
}
