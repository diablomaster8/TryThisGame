/**
 * R0568 (SOUL-51), lane A round 12: the favourite Keeper's other perks. A Nubbin whose
 * favourite is the Keeper on duty trots over to stand beside it now and then (not only for
 * fruit), and when the player switches to that Keeper, favourites nearby run over at once
 * and greet it with a heart. Hashed chances, no rng, live play only; behaviour only.
 */
import { FOND_FOLLOW } from '../config/tuning-more/soul-hum-fond';
import { soulLive } from './antics';
import { react } from './behavior';
import { favouriteKeeper } from './keeper-fondness';
import { act, awake, dist, h01, idle } from './soul-kit';
import type { KeeperAlignment, Nubbin, SimEvent, World } from './types';

const ID = 'fondFollow';
const lastTrip = new WeakMap<Nubbin, number>();
const greeted = new WeakSet<Nubbin>();
const sides = new WeakMap<World, { side: KeeperAlignment; sinceMs: number }>();

export function stepFondFollow(
  world: World,
  dtMs: number,
  events: SimEvent[],
  offline: boolean,
): void {
  if (offline || !soulLive() || world.location !== 'grove') return;
  const now = world.timeMs;
  const side = world.keeper.alignment;
  let mark = sides.get(world);
  if (!mark) sides.set(world, (mark = { side, sinceMs: -Infinity }));
  else if (mark.side !== side) {
    mark.side = side;
    mark.sinceMs = now;
  }
  const justSwitched = now - mark.sinceMs < FOND_FOLLOW.switchWindowMs;
  const second = Math.floor(now / 1000) !== Math.floor((now - dtMs) / 1000);
  const k = world.keeper.pos;
  for (const n of world.nubbins) {
    const b = n.behavior;
    // Arrived beside the Keeper: one heart.
    if (b.state === 'perform' && b.itemId === ID && !b.target && !greeted.has(n)) {
      greeted.add(n);
      react(n, 'love', now, events);
      continue;
    }
    if (!awake(n) || !idle(n) || favouriteKeeper(n) !== side) continue;
    const d = dist(n.pos, k);
    const eager = justSwitched && d < FOND_FOLLOW.switchRadius && d > 2;
    if (!eager) {
      if (!second || d < FOND_FOLLOW.minDist || d > FOND_FOLLOW.maxDist) continue;
      if (now - (lastTrip.get(n) ?? -Infinity) < FOND_FOLLOW.cooldownMs) continue;
      if (h01(`fond:${n.seed}:${Math.floor(now / 1000)}`) >= FOND_FOLLOW.perSecond) continue;
    } else if (now - (lastTrip.get(n) ?? -Infinity) < FOND_FOLLOW.switchWindowMs) continue;
    lastTrip.set(n, now);
    greeted.delete(n);
    const away = Math.atan2(n.pos.x - k.x, n.pos.z - k.z);
    act(n, now, ID, FOND_FOLLOW.stayMs, {
      x: k.x + Math.sin(away) * FOND_FOLLOW.sideOffset,
      z: k.z + Math.cos(away) * FOND_FOLLOW.sideOffset,
    });
  }
}
