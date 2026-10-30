/**
 * R0553 (SOUL-36): the debug panel's behaviour histogram: what the selected Nubbin has been
 * doing over the last five sim minutes, sampled each time the panel refreshes (so it only
 * counts while the panel is open). Debug only; it reads the world and never changes it.
 */
import type { Nubbin, World } from '../sim/types';

const WINDOW_MS = 5 * 60_000;
const samples = new Map<string, Array<{ t: number; state: string }>>();

/** Forget every sample (a new save, or a fresh look). */
export function resetBehaviourHistogram(): void {
  samples.clear();
}

/** One line: each state's share of the recent samples, biggest first. */
export function behaviourHistogram(world: World, n: Nubbin): string {
  let list = samples.get(n.id);
  if (!list) samples.set(n.id, (list = []));
  const now = world.timeMs;
  if (list.length && list[list.length - 1]!.t > now) list.length = 0;
  list.push({ t: now, state: n.behavior.state });
  while (list.length && now - list[0]!.t > WINDOW_MS) list.shift();
  const counts = new Map<string, number>();
  for (const s of list) counts.set(s.state, (counts.get(s.state) ?? 0) + 1);
  const parts = [...counts]
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} ${Math.round((v / list.length) * 100)}%`);
  return `last 5 min (${list.length}) ${parts.join('  ')}`;
}
