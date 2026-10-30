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
import { ALIGN_SOUL, GROVE, MOODY, PHASE_HOURS, PHASE_QUIRKS, RAIN_SOUL } from '../config/tuning';
import { liveliness } from './antics';
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
  const scale = (p ? PHASE_QUIRKS.by[p][phase] : 1) * liveliness(world);
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

/**
 * R0542 (SOUL-24): which band a Nubbin acts as and how strongly: an adult's form band in
 * full, a child with a strong hint at half, and ×1.5 in its own coloured Grove.
 */
function bandStrength(n: Nubbin, world: World): { band: 'sun' | 'moon'; s: number } | null {
  let band: 'sun' | 'moon' | null = null;
  let s = 1;
  if (n.stage === 'adult' && n.form && n.form.band !== 'neutral') band = n.form.band;
  else if (n.stage === 'child' && Math.abs(n.alignment) > ALIGN_SOUL.childHint) {
    band = n.alignment > 0 ? 'sun' : 'moon';
    s = ALIGN_SOUL.childStrength;
  }
  if (!band) return null;
  if (world.grove === band) s *= ALIGN_SOUL.ownGrove;
  return { band, s };
}

const sad = (o: Nubbin): boolean =>
  o.behavior.state === 'cry' || o.needs.happiness < ALIGN_SOUL.sadBelow;

/** The nearest other free Nubbin within `r` that passes `ok`. */
function nearestOther(n: Nubbin, world: World, r: number, ok: (o: Nubbin) => boolean) {
  let best: Nubbin | null = null;
  let bestD = r;
  for (const o of world.nubbins) {
    if (o.id === n.id || o.stage === 'egg' || o.stage === 'cocoon' || !ok(o)) continue;
    if (o.behavior.state === 'held' || o.behavior.state === 'carried') continue;
    const d = Math.hypot(o.pos.x - n.pos.x, o.pos.z - n.pos.z);
    if (d < bestD) {
      bestD = d;
      best = o;
    }
  }
  return best;
}

/**
 * R0542: a Sun Nubbin goes to pat a crying or sad one; a Moon one sneaks up on another and
 * says "boo". No rng is drawn unless the case applies.
 */
export function alignAct(n: Nubbin, world: World, rng: Rng): IdleAct | null {
  const b = bandStrength(n, world);
  if (!b) return null;
  const a = ALIGN_SOUL;
  if (b.band === 'sun') {
    const mark = nearestOther(n, world, a.comfortRadius, sad);
    if (!mark || !rng.chance(Math.min(1, a.comfortChance * b.s))) return null;
    const target = { x: mark.pos.x + 0.8, z: mark.pos.z };
    return { state: 'perform', ms: a.comfortMs, itemId: `comfort:${mark.id}`, target };
  }
  const mark = nearestOther(n, world, a.prankRadius, (o) => !sad(o));
  if (!mark || !rng.chance(Math.min(1, a.prankChance * b.s * liveliness(world)))) return null;
  // From behind: the side away from the way it faces.
  const target = {
    x: mark.pos.x - Math.sin(mark.facing) * 0.9,
    z: mark.pos.z - Math.cos(mark.facing) * 0.9,
  };
  return { state: 'perform', ms: a.prankMs, itemId: `prank:${mark.id}`, target };
}

/**
 * R0542: an act that does something on arrival: the comforter pats (both cheer up, the
 * sad one stops crying with a heart), the prankster boos (the mark jumps; no harm done).
 */
export function arriveAct(
  n: Nubbin,
  world: World,
  events: SimEvent[],
): { mark: Nubbin; reaction: 'love' | 'surprised' } | null {
  const id = n.behavior.itemId ?? '';
  const sep = id.indexOf(':');
  if (sep < 0) return null;
  const kind = id.slice(0, sep);
  if (kind !== 'comfort' && kind !== 'prank') return null;
  const mark = world.nubbins.find((o) => o.id === id.slice(sep + 1));
  if (!mark || Math.hypot(mark.pos.x - n.pos.x, mark.pos.z - n.pos.z) > 2.5) return null;
  n.facing = Math.atan2(mark.pos.x - n.pos.x, mark.pos.z - n.pos.z);
  if (kind === 'comfort') {
    addHappiness(mark, ALIGN_SOUL.comfortGives);
    addHappiness(n, ALIGN_SOUL.comfortSelf);
    events.push({ kind: 'comforted', nubbinId: n.id, markId: mark.id });
    return { mark, reaction: 'love' };
  }
  events.push({ kind: 'pranked', nubbinId: n.id, markId: mark.id });
  return { mark, reaction: 'surprised' };
}
