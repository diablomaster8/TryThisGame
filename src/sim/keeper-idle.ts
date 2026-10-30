/**
 * R0352 (FUN-63) and R0355 (FUN-66): the Keeper's idle antics and Hazel's rule three.
 * Left alone in the Grove the Keeper checks the letter (`fidgetMs`), pats a pocket, and at
 * `sitMs` sits down on the grass. The nearest free Nubbin then comes and sits beside them,
 * and earns a little affection for every minute it stays: "sit down next to them and wait".
 * Any input, walk, carry or scene ends the sit and the Nubbin goes back to its day.
 *
 * Live play only (stepWorld calls it outside catch-up). The renderers read `idleMs`,
 * `sitWith` and `sitBesideMs` for the poses and the sit-with gags; nothing else does.
 */
import { KEEPER_IDLE } from '../config/tuning-fun-r7';
import { NEEDS } from '../config/tuning';
import { addAffection } from './needs';
import { isFree } from './nubbin';
import { isWary } from './trust';
import type { Nubbin, SimEvent, World } from './types';

/** Behaviour states a Nubbin is never pulled out of to come and sit. */
const BUSY = new Set([
  'nap',
  'eat',
  'findFood',
  'lesson',
  'thrown',
  'held',
  'carried',
  'swim',
  'pet',
]);

/** Whether the Keeper is quietly standing in the Grove: no input, walk, carry or intent. */
function quiet(world: World): boolean {
  const k = world.keeper;
  return (
    world.location === 'grove' &&
    k.grounded &&
    k.input.x === 0 &&
    k.input.z === 0 &&
    !k.moveTarget &&
    !k.intent &&
    !k.carrying &&
    !world.nubbins.some((n) => n.behavior.state === 'held')
  );
}

/** Where the companion sits: at the Keeper's right hand, a little forward. */
function seatOf(world: World): { x: number; z: number } {
  const k = world.keeper;
  const s = KEEPER_IDLE.seat;
  return {
    x: k.pos.x + Math.cos(k.facing) * s.side + Math.sin(k.facing) * s.ahead,
    z: k.pos.z - Math.sin(k.facing) * s.side + Math.cos(k.facing) * s.ahead,
  };
}

function release(world: World): void {
  const k = world.keeper;
  const n = k.sitWith ? world.nubbins.find((x) => x.id === k.sitWith) : undefined;
  // The companion's sit simply runs out; its own behaviour picks the next thing.
  if (n && n.behavior.state === 'sit') n.behavior.untilMs = world.timeMs;
  delete k.sitWith;
  delete k.sitBesideMs;
}

function canJoin(n: Nubbin): boolean {
  return (
    (n.stage === 'child' || n.stage === 'adult') &&
    isFree(n) &&
    !isWary(n) &&
    // A hungry or sleepy Nubbin sees to that first.
    n.needs.hunger > NEEDS.hungryThreshold &&
    n.needs.energy > KEEPER_IDLE.minEnergy &&
    !BUSY.has(n.behavior.state)
  );
}

export function stepKeeperIdle(world: World, dtMs: number, events: SimEvent[]): void {
  const k = world.keeper;
  if (!quiet(world)) {
    if (k.idleMs) delete k.idleMs;
    if (k.sitWith) release(world);
    return;
  }
  const was = k.idleMs ?? 0;
  k.idleMs = was + dtMs;
  if (k.idleMs < KEEPER_IDLE.sitMs) return;
  if (was < KEEPER_IDLE.sitMs) events.push({ kind: 'keeperSat' });
  const now = world.timeMs;
  let n = k.sitWith ? world.nubbins.find((x) => x.id === k.sitWith) : undefined;
  if (n && (!canJoin(n) || n.behavior.state === 'findFood')) {
    release(world);
    n = undefined;
  }
  if (!n && !k.sitWith) {
    let best: Nubbin | undefined;
    let bestD: number = KEEPER_IDLE.joinRadius;
    for (const c of world.nubbins) {
      if (!canJoin(c)) continue;
      const d = Math.hypot(c.pos.x - k.pos.x, c.pos.z - k.pos.z);
      if (d < bestD) {
        best = c;
        bestD = d;
      }
    }
    if (!best) return;
    n = best;
    k.sitWith = n.id;
  }
  if (!n) return;
  const seat = seatOf(world);
  const b = n.behavior;
  if (Math.hypot(n.pos.x - seat.x, n.pos.z - seat.z) < KEEPER_IDLE.arrive) {
    if (b.state !== 'sit') b.sinceMs = now;
    b.state = 'sit';
    b.target = null;
    b.untilMs = now + 1500;
    n.facing = Math.atan2(k.pos.x - n.pos.x, k.pos.z - n.pos.z);
    if (k.sitBesideMs === undefined) {
      k.sitBesideMs = now;
      events.push({ kind: 'sitBeside', nubbinId: n.id });
    }
    // Rule three: sitting together, quietly, is how affection grows.
    addAffection(n, (KEEPER_IDLE.affectionPerMinute * dtMs) / 60_000);
  } else if (b.state !== 'wander' || !b.target) {
    b.state = 'wander';
    b.sinceMs = now;
    b.untilMs = now + 6000;
    b.target = seat;
    b.itemId = null;
  } else {
    b.target = seat;
    b.untilMs = Math.max(b.untilMs, now + 1000);
  }
}

/** The Keeper's idle pose for the renderers: the letter, a pocket pat, or sitting. */
export function keeperIdlePose(world: World): 'letter' | 'pocket' | 'sit' | null {
  const ms = world.keeper.idleMs ?? 0;
  const I = KEEPER_IDLE;
  if (ms >= I.sitMs) return 'sit';
  if (ms >= I.fidgetMs && ms < I.fidgetMs + I.letterMs) return 'letter';
  if (ms >= I.fidgetMs + I.letterMs && ms < I.fidgetMs + I.letterMs + I.pocketMs) return 'pocket';
  return null;
}
