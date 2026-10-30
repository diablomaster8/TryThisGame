/**
 * R0560 (SOUL-43): petting one Nubbin is noticed by the others nearby. Each free one within
 * `JEALOUSY.radius` that isn't wary may react by personality: a cheerful one (or any with
 * high affection) trots up beside the Keeper and asks to be picked up; a mischievous one
 * nudges the petted one aside; a shy or lazy one just watches, a little put out. Cosmetic:
 * nobody loses anything. Chances are hashed from the Nubbin and the second (no world rng),
 * and petting only happens in live play.
 */
import { JEALOUSY } from '../config/tuning';
import { roll } from './traits';
import { isWary } from './trust';
import type { Nubbin, SimEvent, World } from './types';

const dist = (a: { x: number; z: number }, b: { x: number; z: number }): number =>
  Math.hypot(a.x - b.x, a.z - b.z);

const CALM = new Set(['wander', 'sit', 'greet', 'play']);

/** The others' reactions to `petted` being petted now. */
export function noticePet(world: World, petted: Nubbin, events: SimEvent[]): void {
  const now = world.timeMs;
  const k = world.keeper.pos;
  for (const o of world.nubbins) {
    if (o.id === petted.id || o.stage === 'egg' || o.stage === 'cocoon') continue;
    if (!CALM.has(o.behavior.state) || isWary(o)) continue;
    if (dist(o.pos, petted.pos) > JEALOUSY.radius) continue;
    const p = o.personality ?? 'cheerful';
    if (roll(o, `jealous:${petted.id}`, now) >= JEALOUSY.chance[p]) continue;
    const b = o.behavior;
    b.sinceMs = now;
    b.reaction = null;
    if (p === 'mischievous') {
      b.state = 'perform';
      b.itemId = `nudge:${petted.id}`;
      b.untilMs = now + JEALOUSY.nudgeMs;
      b.target = { x: petted.pos.x + 0.6, z: petted.pos.z };
    } else if (p === 'cheerful' || o.needs.affection >= JEALOUSY.fondAffection) {
      // Up beside the Keeper, on the side away from the petted one.
      const a = Math.atan2(k.x - petted.pos.x, k.z - petted.pos.z);
      b.state = 'perform';
      b.itemId = 'askUp';
      b.untilMs = now + JEALOUSY.askMs;
      b.target = { x: k.x + Math.sin(a) * 1.1, z: k.z + Math.cos(a) * 1.1 };
    } else {
      b.state = 'sit';
      b.itemId = 'watchJealous';
      b.untilMs = now + JEALOUSY.watchMs;
      b.target = null;
      o.facing = Math.atan2(petted.pos.x - o.pos.x, petted.pos.z - o.pos.z);
    }
    events.push({ kind: 'jealous', nubbinId: o.id, of: petted.id });
  }
}

/**
 * A nudge arriving: the petted one is shoved a little aside (it looks surprised). True
 * when the arrival was a nudge's.
 */
export function nudgeArrive(
  n: Nubbin,
  world: World,
  react: (who: Nubbin, r: 'surprised') => void,
): boolean {
  const id = n.behavior.itemId ?? '';
  if (!id.startsWith('nudge:')) return false;
  const mark = world.nubbins.find((o) => o.id === id.slice(6));
  if (mark && dist(mark.pos, n.pos) < 1.5 && mark.behavior.state !== 'held') {
    const d = dist(mark.pos, n.pos) || 1;
    mark.pos.x += ((mark.pos.x - n.pos.x) / d) * JEALOUSY.shove;
    mark.pos.z += ((mark.pos.z - n.pos.z) / d) * JEALOUSY.shove;
    if (mark.behavior.state !== 'pet') react(mark, 'surprised');
    n.facing = Math.atan2(world.keeper.pos.x - n.pos.x, world.keeper.pos.z - n.pos.z);
  }
  return true;
}
