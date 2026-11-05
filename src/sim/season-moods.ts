/**
 * R0590 (SOUL-73), lane A round 11: the season and the town's festival show in what Nubbins
 * do. Winter: two huddle side by side. Summer (any dry day): a splash party on the pond's
 * rim. Festival days: the cheerful ones dance in a ring. The spring sniff and the autumn leaf
 * pile live in weather-play.ts. The festival reads `TownState` (via `townUnlocks`) and
 * nothing else. Hashed chances, live play only, behaviour and looks only.
 */
import { GROVE } from '../config/tuning';
import { SEASON_MOODS as M } from '../config/tuning-soul-r11h';
import { liveliness, soulLive } from './antics';
import { react } from './behavior';
import { act, awake, dist, h01, idle, stillIn } from './soul-kit';
import { townUnlocks } from './town';
import type { Nubbin, SimEvent, World } from './types';

const ACTS = ['huddle', 'pondParty', 'ringDance'];
const counts = new WeakMap<World, Record<string, number>>();

export const seasonMoodActs = (world: World): Readonly<Record<string, number>> =>
  counts.get(world) ?? {};

function count(world: World, what: string): void {
  const c = counts.get(world) ?? {};
  c[what] = (c[what] ?? 0) + 1;
  counts.set(world, c);
}

/** Whether the town's festival is on today (stands, and it is the first part of a period). */
export function festivalDay(world: World): boolean {
  if (!townUnlocks(world).festival) return false;
  return (world.timeMs % M.festivalPeriodMs) / M.festivalPeriodMs < M.festivalDayShare;
}

function huddle(world: World, n: Nubbin, now: number): boolean {
  const mate = world.nubbins.find((o) => o !== n && idle(o) && dist(o.pos, n.pos) < 8);
  if (!mate) return false;
  const mid = { x: (n.pos.x + mate.pos.x) / 2, z: (n.pos.z + mate.pos.z) / 2 };
  act(n, now, 'huddle', M.huddleMs, { x: mid.x - M.huddleGap / 2, z: mid.z });
  act(mate, now, 'huddle', M.huddleMs, { x: mid.x + M.huddleGap / 2, z: mid.z });
  count(world, 'huddle');
  return true;
}

function pondParty(world: World, n: Nubbin, now: number): boolean {
  const pond = GROVE.pond;
  if (dist(n.pos, pond) > pond.r + M.pondPartyReach) return false;
  const guests = [n, ...world.nubbins.filter((o) => o !== n && idle(o))]
    .filter((o) => dist(o.pos, pond) < pond.r + M.pondPartyReach)
    .slice(0, M.pondPartyMax);
  guests.forEach((g, i) => {
    const a = (i / guests.length) * Math.PI * 2 + h01(`pp:${now}`) * 6;
    const r = pond.r + 0.8;
    act(g, now, 'pondParty', M.pondPartyMs, {
      x: pond.x + Math.cos(a) * r,
      z: pond.z + Math.sin(a) * r,
    });
  });
  count(world, 'pondParty');
  return true;
}

function ringDance(world: World, n: Nubbin, now: number): boolean {
  if (n.personality !== 'cheerful') return false;
  const ring = [
    n,
    ...world.nubbins.filter((o) => o !== n && idle(o) && o.personality === 'cheerful'),
  ]
    .filter((o) => dist(o.pos, n.pos) < 14)
    .slice(0, M.ringMax);
  if (ring.length < M.ringMin) return false;
  const c = { x: n.pos.x, z: n.pos.z };
  ring.forEach((g, i) => {
    const a = (i / ring.length) * Math.PI * 2;
    act(g, now, 'ringDance', M.ringMs, {
      x: c.x + Math.cos(a) * M.ringRadius,
      z: c.z + Math.sin(a) * M.ringRadius,
    });
  });
  count(world, 'ringDance');
  return true;
}

/** Ends of acts: a happy beat when a huddle or a dance finishes in good company. */
function finish(world: World, now: number, events: SimEvent[]): void {
  for (const n of world.nubbins) {
    if (!stillIn(n, ACTS) || n.behavior.untilMs - now > 120 || n.behavior.untilMs < now) continue;
    react(n, 'happy', now, events);
  }
}

export function stepSeasonMoods(
  world: World,
  dtMs: number,
  events: SimEvent[],
  offline: boolean,
): void {
  if (offline || !soulLive() || world.location !== 'grove') return;
  const now = world.timeMs;
  if (Math.floor(now / 1000) === Math.floor((now - dtMs) / 1000)) {
    finish(world, now, events);
    return;
  }
  const lively = liveliness(world);
  const dry = world.weather.kind === 'clear';
  const festival = festivalDay(world);
  for (const n of world.nubbins) {
    if (!awake(n) || !idle(n) || n.behavior.itemId === 'gatherJam') continue;
    if (h01(`sm:${n.id}:${now}`) >= M.perSecond * lively) continue;
    if (festival && ringDance(world, n, now)) continue;
    if (world.season === 'winter' && huddle(world, n, now)) continue;
    if (world.season === 'summer' && dry) pondParty(world, n, now);
  }
}
