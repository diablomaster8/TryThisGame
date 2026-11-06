/**
 * R0450 (TECH-08): a `levelUp` event when a Nubbin's stat crosses into a new level. Stat
 * points are added in many places (training, fruit, critters, plants, battles), so this
 * watches the result instead of hooking each one. The last-seen levels live outside the World
 * (a WeakMap), so saves and the step hash never see them; the first look at a Nubbin only
 * records its levels, and catch-up records without announcing.
 */
import { levelOf } from './stats';
import type { SimEvent, StatKey, World } from './types';

const STAT_KEYS: readonly StatKey[] = ['swim', 'fly', 'run', 'power', 'stamina'];
const seen = new WeakMap<World, Map<string, number[]>>();

export function stepLevelWatch(world: World, events: SimEvent[], offline: boolean): void {
  let map = seen.get(world);
  if (!map) seen.set(world, (map = new Map()));
  for (const n of world.nubbins) {
    if (n.stage === 'egg' || n.stage === 'cocoon') continue;
    const now = STAT_KEYS.map((k) => levelOf(n.stats[k].points));
    const before = map.get(n.id);
    map.set(n.id, now);
    if (!before || offline) continue;
    for (let i = 0; i < STAT_KEYS.length; i++) {
      if (now[i]! > before[i]!)
        events.push({ kind: 'levelUp', nubbinId: n.id, stat: STAT_KEYS[i]!, level: now[i]! });
    }
  }
}
