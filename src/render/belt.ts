/**
 * LOOK-69 (R0437): a Nubbin that has won Dojo Ladder belts wears the latest one round its
 * middle, in the Grove and everywhere else, unless the Keeper took it off in the Wardrobe
 * (`hideBelt`). Both renderers read the belt from here, so the colours match.
 */
import { ladderBelt } from '../sim/battle/ladder';
import type { Nubbin } from '../sim/types';
import { C } from './sprites/palette';

/** White, yellow, green, brown, black, by belt 1–5; each with its shade for the knot. */
export const BELT_COLOURS: readonly (readonly [number, number])[] = [
  [C.white, C.lilacGrey],
  [C.sunYellow, C.sunDeep],
  [C.leaf, C.leafDeep],
  [C.bark, C.darkBark],
  [C.ink, C.darkPlum],
];

/** The belt worn now, 1–5, or 0 for none (an egg, a cocoon, no belt yet, or taken off). */
export function beltOf(n: Nubbin): number {
  if (n.stage === 'egg' || n.stage === 'cocoon' || n.hideBelt) return 0;
  return ladderBelt(n);
}
