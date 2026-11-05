/**
 * R0592 (SOUL-75), lane A round 11: Eternals (and Moss, who is one) are unmistakably old
 * souls. They walk slowly (soul-gait.ts reads `oldGait`), show only the deepest calm emote
 * (a star: reaction events from an Eternal carry `calm`, which the renderers draw as a star),
 * and teach: a child nearby sometimes comes and sits in front of one to watch it, the
 * Eternal sitting still and the child learning a little by watching. Live play only,
 * behaviour and looks only.
 */
import { OLD_SOUL_TEACH } from '../config/tuning-soul-r11h';
import { soulLive } from './antics';
import { react } from './behavior';
import { act, dist, h01, idle, stillIn } from './soul-kit';
import type { Nubbin, SimEvent, World } from './types';

export const isOldSoul = (n: Pick<Nubbin, 'eternal'>): boolean => n.eternal !== null;

const ACTS = ['teach', 'learnWatch'];
const taught = new WeakMap<World, number>();
/** Lessons begun in this world (tests and the debug panel). */
export const lessonsWatched = (world: World): number => taught.get(world) ?? 0;

/** Marks every reaction an Eternal shows as calm: the renderers draw a star. */
export function calmEternalReactions(world: World, events: SimEvent[]): void {
  for (const e of events) {
    if (e.kind !== 'reaction' || e.calm) continue;
    const n = world.nubbins.find((x) => x.id === e.nubbinId);
    if (n && isOldSoul(n)) e.calm = true;
  }
}

/** The emote shape for a reaction event: a calm one is always a star. */
export function eventShape<S extends string>(e: { calm?: boolean }, normal: S): S | 'star' {
  return e.calm ? 'star' : normal;
}

export function stepOldSouls(
  world: World,
  dtMs: number,
  events: SimEvent[],
  offline: boolean,
): void {
  if (offline || !soulLive() || world.location !== 'grove') return;
  const now = world.timeMs;
  const second = Math.floor(now / 1000) !== Math.floor((now - dtMs) / 1000);
  if (!second) return;
  for (const n of world.nubbins) {
    if (stillIn(n, ['learnWatch']) && n.behavior.untilMs - now < 1000 && n.behavior.untilMs >= now)
      react(n, 'happy', now, events);
    if (!isOldSoul(n) || !idle(n)) continue;
    const kid = world.nubbins.find(
      (o) => o.stage === 'child' && idle(o) && dist(o.pos, n.pos) < OLD_SOUL_TEACH.teachRadius,
    );
    if (!kid || h01(`teach:${n.id}:${now}`) >= OLD_SOUL_TEACH.teachPerSecond) continue;
    act(n, now, 'teach', OLD_SOUL_TEACH.teachActMs);
    const sit = {
      x: n.pos.x + Math.sin(n.facing) * 1.3,
      z: n.pos.z + Math.cos(n.facing) * 1.3,
    };
    act(kid, now, 'learnWatch', OLD_SOUL_TEACH.teachMs, sit);
    kid.facing = Math.atan2(n.pos.x - sit.x, n.pos.z - sit.z);
    taught.set(world, lessonsWatched(world) + 1);
  }
}

export { ACTS as OLD_SOUL_ACTS };
