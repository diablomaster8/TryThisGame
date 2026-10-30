/**
 * Lane A round 8 (SOUL): idle acts that come before the everyday weighted pick in
 * `chooseIdle` (behavior.ts). Each returns an act for behavior.ts to start, or null, and
 * draws from the rng only when its case applies, so a Grove without moody Nubbins, by day
 * and in dry weather plays exactly as before.
 *
 * - R0532 (SOUL-14): Grumpy harrumphs (sits with its back to the Keeper) and greets less;
 *   Sleepy yawns, nods off where it stands and naps longer. Thirty minutes of contentment
 *   clears either look for good (`stepMoody`).
 * - R0535 (SOUL-17): the sim's own time of day (`world.phase`, set by the curfew's wall
 *   clock) with a dawn stretch, a dusk firefly chase and night stargazing.
 * - R0534 (SOUL-16): rain by personality: the bold stomp puddles, the cheeky catch drops,
 *   the rest shelter by the tree nearest the Keeper, and never more than half at once.
 */
import { GROVE, MOODY, PHASE_HOURS, PHASE_QUIRKS, RAIN_SOUL } from '../config/tuning';
import { addHappiness } from './needs';
import { leaningPersonality } from './personality';
import type { Rng } from './rng';
import type { BehaviorState, Nubbin, SimEvent, Vec2, World } from './types';

export type DayPhase = 'dawn' | 'day' | 'dusk' | 'night';

/** What behavior.ts should start. */
export interface IdleAct {
  state: BehaviorState;
  ms: number;
  itemId?: string;
  target?: Vec2;
  facing?: number;
}

/** R0535: the phase for a wall-clock hour; the same hours as the renderer's daylight. */
export function dayPhase(hour: number): DayPhase {
  const h = ((hour % 24) + 24) % 24;
  if (h >= PHASE_HOURS.dawnFrom && h < PHASE_HOURS.dayFrom) return 'dawn';
  if (h >= PHASE_HOURS.dayFrom && h < PHASE_HOURS.duskFrom) return 'day';
  if (h >= PHASE_HOURS.duskFrom && h < PHASE_HOURS.nightFrom) return 'dusk';
  return 'night';
}

/** R0532: a grumpy Nubbin's greeting odds. */
export function moodyGreet(n: Nubbin): number {
  return n.moody === 'grumpy' ? MOODY.grumpyGreet : 1;
}

/** R0532: how much longer a nap runs for this Nubbin. */
export function napScale(n: Nubbin): number {
  return n.moody === 'sleepy' ? MOODY.sleepyNap : 1;
}

/** R0532: a moody Nubbin's own idle acts, or null. */
export function moodyAct(n: Nubbin, world: World, rng: Rng): IdleAct | null {
  if (n.moody === 'grumpy') {
    if (!rng.chance(MOODY.harrumphChance)) return null;
    // Its back to the Keeper: facing straight away.
    const k = world.keeper.pos;
    const facing = Math.atan2(n.pos.x - k.x, n.pos.z - k.z);
    return { state: 'sit', ms: rng.float(...MOODY.harrumphMs), itemId: 'harrumph', facing };
  }
  if (n.moody === 'sleepy') {
    const r = rng.next();
    if (r < MOODY.nodOffChance) return { state: 'nap', ms: MOODY.nodOffMs, itemId: 'nodOff' };
    if (r < MOODY.nodOffChance + MOODY.yawnChance)
      return { state: 'sit', ms: MOODY.yawnMs, itemId: 'yawn' };
  }
  return null;
}

/**
 * R0532: care softens a moody look: `MOODY.calmMs` of happiness above `calmAbove` clears it,
 * and the time resets whenever happiness drops. Live play only (the catch-up's coarse steps
 * never call it).
 */
export function stepMoody(world: World, dtMs: number, events: SimEvent[]): void {
  for (const n of world.nubbins) {
    if (!n.moody) continue;
    if (n.needs.happiness <= MOODY.calmAbove) {
      if (n.moodyCalmMs) n.moodyCalmMs = 0;
      continue;
    }
    n.moodyCalmMs = (n.moodyCalmMs ?? 0) + dtMs;
    if (n.moodyCalmMs >= MOODY.calmMs) {
      const was = n.moody;
      n.moody = null;
      delete n.moodyCalmMs;
      events.push({ kind: 'moodyCleared', nubbinId: n.id, was });
    }
  }
}

/** R0535: the phase's quirk for this Nubbin, or null (always null by day). */
export function phaseAct(n: Nubbin, world: World, rng: Rng): IdleAct | null {
  const phase = world.phase ?? 'day';
  if (phase === 'day' || n.stage === 'egg') return null;
  const p = n.personality ?? leaningPersonality(n);
  const scale = p ? PHASE_QUIRKS.by[p][phase] : 1;
  const q = PHASE_QUIRKS;
  if (phase === 'dawn') {
    if (!rng.chance(q.dawnStretch * scale)) return null;
    return { state: 'sit', ms: q.stretchMs, itemId: 'stretch' };
  }
  if (phase === 'dusk') {
    if (!rng.chance(q.duskFireflies * scale)) return null;
    const a = rng.float(0, Math.PI * 2);
    const r = rng.float(1.5, 3);
    const target = { x: n.pos.x + Math.cos(a) * r, z: n.pos.z + Math.sin(a) * r };
    return { state: 'wander', ms: rng.float(...q.fireflyMs), itemId: 'fireflies', target };
  }
  if (!rng.chance(q.nightStargaze * scale)) return null;
  return { state: 'sit', ms: rng.float(...q.stargazeMs), itemId: 'stargaze' };
}

/** The tree spot nearest a point (the shelter spot beside its trunk). */
function treeSpotNear(p: Vec2): { spot: Vec2; d: number } {
  let best: Vec2 = GROVE.trees[0]!;
  let bestD = Infinity;
  for (const t of GROVE.trees) {
    const d = Math.hypot(t.x - p.x, t.z - p.z);
    if (d < bestD) {
      bestD = d;
      best = t;
    }
  }
  return { spot: { x: best.x + 1.2, z: best.z + 1.0 }, d: bestD };
}

/**
 * R0534: a non-swimmer's rain act: its rain game near the Keeper (cheerful stomps, the
 * mischievous catch drops; the others mostly shelter), or a shelter under the tree nearest
 * the Keeper when one is close, else its own nearest. Sheltering stops at half the Grove;
 * the rest carry on as on any day (null), so the view never empties.
 */
export function rainAct(
  n: Nubbin,
  world: World,
  rng: Rng,
  near: (around: Vec2, r: number) => Vec2,
): IdleAct | null {
  const p = n.personality ?? leaningPersonality(n);
  const k = world.keeper.pos;
  if (rng.chance(p ? RAIN_SOUL.play[p] : 0.3)) {
    const game = p === 'mischievous' ? 'raindrop' : 'stomp';
    if (game === 'stomp') addHappiness(n, RAIN_SOUL.stompHappiness);
    return {
      state: 'perform',
      ms: rng.float(...RAIN_SOUL.playMs),
      itemId: game,
      target: near(k, RAIN_SOUL.playRadius),
    };
  }
  const others = world.nubbins.filter((o) => o.stage !== 'egg' && o.stage !== 'cocoon');
  const sheltering = others.filter((o) => o.behavior.state === 'shelter').length;
  if (sheltering + 1 > Math.max(1, Math.floor(others.length * RAIN_SOUL.shelterCap))) return null;
  if (!rng.chance(0.8)) return null;
  const byKeeper = treeSpotNear(k);
  const spot = byKeeper.d <= RAIN_SOUL.nearKeeper ? byKeeper.spot : treeSpotNear(n.pos).spot;
  return { state: 'shelter', ms: 60_000, target: spot };
}
