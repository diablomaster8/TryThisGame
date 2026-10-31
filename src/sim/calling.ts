/**
 * R0559 (SOUL-42): a slip on its way shows on screen as a call for attention, the way a
 * Digimon pet calls. Once a slip timer (`sim/slips.ts`) is past half its mark:
 *
 * - lonely: the child walks over to the Keeper and sits facing them, tugging (a raised hand)
 *   with a "?" bubble;
 * - hungry: it goes and stands under the nearest tree, looking up for fruit;
 * - sleepy: it sits and rubs its eyes.
 *
 * Answering is the ordinary care that ends the slip (a pet or a hug, a fruit, a nap), so
 * there is nothing new to do and no penalty beyond the slips that already exist. No rng is
 * drawn: the act follows from the timers alone.
 */
import { CALLING, SLIPS } from '../config/tuning';
import type { IdleAct } from './soul-idle';
import type { Nubbin, World } from './types';

export type Call = 'lonely' | 'hungry' | 'sleepy';

const ORDER: readonly Call[] = ['lonely', 'hungry', 'sleepy'];

const dist = (a: { x: number; z: number }, b: { x: number; z: number }): number =>
  Math.hypot(a.x - b.x, a.z - b.z);

/** The call it is making now, or null: the first timer past `CALLING.from` of its mark. */
export function callingFor(n: Nubbin): Call | null {
  const t = n.slipTimers;
  if (!t || n.stage === 'egg' || n.stage === 'cocoon') return null;
  for (const k of ORDER) if ((t[k] ?? 0) >= SLIPS.afterMs * CALLING.from) return k;
  return null;
}

/** The act for this idle choice while calling, or null. */
export function callAct(n: Nubbin, world: World): IdleAct | null {
  const call = callingFor(n);
  if (!call) return null;
  const k = world.keeper.pos;
  if (call === 'lonely') {
    const d = dist(n.pos, k);
    const facing = Math.atan2(k.x - n.pos.x, k.z - n.pos.z);
    if (d > CALLING.nearKeeper) {
      const s = CALLING.stopShort / (d || 1);
      return {
        state: 'wander',
        ms: CALLING.walkMs,
        itemId: 'callKeeper',
        target: { x: k.x + (n.pos.x - k.x) * s, z: k.z + (n.pos.z - k.z) * s },
      };
    }
    return { state: 'sit', ms: CALLING.tugMs, itemId: 'tug', facing };
  }
  if (call === 'hungry') {
    let tree: { x: number; z: number } | null = null;
    for (const t of world.trees) if (!tree || dist(t.pos, n.pos) < dist(tree, n.pos)) tree = t.pos;
    if (!tree) return { state: 'sit', ms: CALLING.tugMs, itemId: 'callFruit' };
    const spot = { x: tree.x + 1.1, z: tree.z + 0.8 };
    if (dist(spot, n.pos) > 1)
      return { state: 'wander', ms: CALLING.walkMs, itemId: 'callFruit', target: spot };
    return {
      state: 'sit',
      ms: CALLING.tugMs,
      itemId: 'callFruit',
      facing: Math.atan2(tree.x - n.pos.x, tree.z - n.pos.z),
    };
  }
  return { state: 'sit', ms: CALLING.rubMs, itemId: 'rubEyes' };
}
