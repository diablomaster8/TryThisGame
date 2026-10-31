/**
 * The Hollow's requests on the board (R0165, DUNG-25, lane B round 9): three one-time asks
 * that appear once the Keeper has been down the Hollow. Beat Act I's boss, find a secret room,
 * wear a full set. Like every request they are asked once, ever, and never come back
 * (no daily chores, no streaks). Their progress is read straight from the Hollow's state each
 * step, so a goal met in a fight's command or on the way home still counts.
 *
 * Pure sim: no DOM.
 */
import { SETS } from '../config/dungeon-items-r8';
import { setCounts } from './dungeon-sets';
import type { SimEvent, World } from './types';

export const HOLLOW_REQUESTS = ['hollowBoss', 'hollowSecret', 'hollowSet'] as const;

/** The Hollow's requests are offered once the Keeper has been down at least once. */
export function hollowVisited(world: World): boolean {
  return world.hollow.runs > 0 || world.hollow.best > 0;
}

function progressOf(world: World, template: string): number {
  switch (template) {
    case 'hollowBoss':
      return world.hollow.acts[0]?.bossDefeated ? 1 : 0;
    case 'hollowSecret':
      return world.hollow.secrets?.length ?? 0;
    case 'hollowSet': {
      const counts = setCounts(world);
      return SETS.some((s) => (counts[s.id] ?? 0) >= s.pieces.length) ? 1 : 0;
    }
    default:
      return 0;
  }
}

/** Once a step: the open Hollow requests catch up with the Hollow's state. */
export function syncHollowRequests(world: World, events: SimEvent[]): void {
  for (const q of world.quests) {
    if (q.claimed || q.progress >= q.target) continue;
    if (!(HOLLOW_REQUESTS as readonly string[]).includes(q.template)) continue;
    const p = Math.min(q.target, progressOf(world, q.template));
    if (p <= q.progress) continue;
    q.progress = p;
    if (p >= q.target) events.push({ kind: 'questDone', id: q.id });
  }
}
