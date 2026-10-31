/**
 * Personality underground (R0167, DUNG-27, lane B round 9): each party Nubbin's personality
 * colours how it follows and idles in the Hollow. It changes behaviour only, never stats.
 * - Cheerful: a happy hop on every find.
 * - Shy: tucks in behind the Keeper while a pack gives chase, and follows close.
 * - Mischievous: once a level, scampers after a stray carrying Shells and "borrows" one back.
 * - Lazy: trails behind; once a level, when the Keeper stands still a while, it finds the
 *   comfiest spot for a doze, and a full doze rests the whole party a little (a small picnic).
 * The level's moments live in `run.moods` and start afresh on each level.
 *
 * Pure sim: no DOM.
 */
import { HOLLOW_R9C } from '../config/dungeon-r9-c';
import { DUNGEON, NEEDS } from '../config/tuning';
import { levelIdOf } from './dungeon-levels';
import type { DungeonRun, HollowMoods, Nubbin, SimEvent, Vec2, World } from './types';

const M = HOLLOW_R9C.moods;

function dist(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

/** This level's moments, fresh when the level changed. */
export function levelMoods(run: DungeonRun): HollowMoods {
  const level = levelIdOf(run);
  if (run.moods?.level !== level) run.moods = { level };
  return run.moods;
}

/** How far behind the Keeper this Nubbin is happy to trail. */
export function followDistanceOf(n: Nubbin): number {
  return DUNGEON.followDistance * (M.follow[n.personality ?? ''] ?? 1);
}

function react(world: World, n: Nubbin, reaction: 'happy' | 'surprised', ms: number): void {
  n.behavior.state = 'react';
  n.behavior.reaction = reaction;
  n.behavior.target = null;
  n.behavior.sinceMs = world.timeMs;
  n.behavior.untilMs = world.timeMs + ms;
}

/** The nearest pack chasing the party within reach, if any. */
function chaser(world: World, run: DungeonRun): { id: string; pos: Vec2 } | null {
  let best: { id: string; pos: Vec2 } | null = null;
  let bestD: number = M.hideReach;
  for (const p of run.packs ?? []) {
    if (p.state !== 'chase') continue;
    const d = dist(p.pos, world.keeper.pos);
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return best;
}

/**
 * Where a party Nubbin with no loot to fetch goes instead of simply following: 'hold' keeps
 * it where it is (a hop under way), a point overrides the follow, null follows as usual.
 */
export function moodTarget(
  world: World,
  run: DungeonRun,
  n: Nubbin,
  events: SimEvent[],
): Vec2 | 'hold' | null {
  if (n.behavior.state === 'react' && world.timeMs < n.behavior.untilMs) return 'hold';
  // Only Shy and Mischievous Nubbins change how they follow; the rest pay nothing here.
  if (n.personality !== 'shy' && n.personality !== 'mischievous') return null;
  const moods = levelMoods(run);
  const k = world.keeper.pos;
  if (n.personality === 'shy') {
    const p = chaser(world, run);
    if (!p) return null;
    if (!moods.hid?.includes(p.id)) {
      (moods.hid ??= []).push(p.id);
      events.push({ kind: 'hollowR9', what: 'hide', id: n.id });
    }
    const d = Math.max(1e-6, dist(p.pos, k));
    return {
      x: k.x - ((p.pos.x - k.x) / d) * M.hideBehind,
      z: k.z - ((p.pos.z - k.z) / d) * M.hideBehind,
    };
  }
  if (n.personality === 'mischievous' && !moods.borrowed) {
    const s = run.strays.find(
      (x) => !x.shooed && (x.carrying ?? 0) > 0 && dist(x.pos, n.pos) <= M.borrowReach,
    );
    if (!s) return null;
    if (dist(s.pos, n.pos) > M.borrowTouch) return { x: s.pos.x, z: s.pos.z };
    s.carrying = (s.carrying ?? 1) - 1;
    world.inventory.shells += 1;
    run.haul.shells += 1;
    moods.borrowed = true;
    react(world, n, 'happy', M.hopMs);
    events.push({ kind: 'hollowR9', what: 'borrow', id: n.id, n: 1 });
    return 'hold';
  }
  return null;
}

/**
 * Once a step, after the party moved: Cheerful hops on this step's finds, and the Lazy doze
 * starts when the Keeper has stood still, ends when the Keeper walks on, and rests the party
 * when it ran its full length.
 */
export function stepMoods(
  world: World,
  run: DungeonRun,
  party: readonly Nubbin[],
  dtMs: number,
  events: readonly SimEvent[],
  out: SimEvent[],
): void {
  // Only Cheerful and Lazy Nubbins act here (and a doze already under way).
  if (
    !run.moods?.nap &&
    !party.some((n) => n.personality === 'cheerful' || n.personality === 'lazy')
  )
    return;
  const moods = levelMoods(run);
  if (events.some((e) => e.kind === 'dungeonFound'))
    for (const n of party)
      if (n.personality === 'cheerful' && !run.fetch[n.id] && n.behavior.state !== 'nap') {
        react(world, n, 'happy', M.hopMs);
        out.push({ kind: 'hollowR9', what: 'hop', id: n.id });
      }
  // The Keeper's stillness, from where it stood last step.
  const k = world.keeper.pos;
  const moved = !moods.last || dist(moods.last, k) > 0.02;
  moods.last = { x: k.x, z: k.z };
  moods.stillMs = moved ? 0 : (moods.stillMs ?? 0) + dtMs;
  const nap = moods.nap;
  if (nap) {
    const n = party.find((x) => x.id === nap.id);
    const long = world.timeMs - nap.atMs >= M.napRestMs;
    if (!n || moved || long || chaser(world, run)) {
      delete moods.nap;
      if (n && n.behavior.state === 'nap') {
        n.behavior.state = 'wander';
        n.behavior.sinceMs = world.timeMs;
      }
      if (long) {
        for (const m of party) {
          m.needs.energy = Math.min(1, m.needs.energy + M.napEnergy);
          m.needs.happiness = Math.min(NEEDS.happinessMax, m.needs.happiness + M.napHappy);
        }
        out.push({ kind: 'hollowR9', what: 'napRest', id: nap.id });
      }
    }
    return;
  }
  if (moods.napped || (moods.stillMs ?? 0) < M.napAfterMs || chaser(world, run)) return;
  const lazy = party.find(
    (n) => n.personality === 'lazy' && !run.fetch[n.id] && n.behavior.state === 'sit',
  );
  if (!lazy) return;
  moods.napped = true;
  moods.nap = { id: lazy.id, atMs: world.timeMs };
  lazy.behavior.state = 'nap';
  lazy.behavior.sinceMs = world.timeMs;
  lazy.behavior.target = null;
  out.push({ kind: 'hollowR9', what: 'nap', id: lazy.id });
}
