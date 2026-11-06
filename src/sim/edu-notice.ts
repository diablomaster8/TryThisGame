/**
 * R0723: a Grove noticing moment in a sprout's Learning Grove (fruit counted, an egg's colour,
 * a tree's shakes) logs one `edu.items` hit, with no right or wrong: it only says the child
 * has met the thing. UI sends `eduNotice`; this is the only place the sim records it.
 */
import type { World } from './types';

export function eduNotice(world: World, item: string): void {
  const e = world.edu;
  if (!e || !/^[a-z]+:[a-z0-9-]+$/.test(item)) return;
  const items = (e.items ??= {});
  const it = (items[item] ??= { seen: 0, firstTry: 0, lastMs: 0 });
  it.seen += 1;
  it.firstTry += 1;
  it.lastMs = world.timeMs;
}
