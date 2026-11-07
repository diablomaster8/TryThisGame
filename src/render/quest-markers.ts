import { C12C } from '../config/tuning-more/story-quest-markers';
import { goalTarget } from '../sim/goal-target';
import { giverNpc } from '../sim/offer-approach';
import { boardState, kidFlow } from '../sim/quest-offers';
import { sideStory } from '../sim/story-scenes';
import type { World } from '../sim/types';
import { boardSpot } from './dress-camp10d';

/**
 * R0608 (CAMP-16): the quest markers drawn in the world, the same list for both renderers: a
 * gold `!` over the giver (or the notice board when the giver is not there) for each offer
 * waiting, and a teal diamond over the place of each tracked quest's current step. Pure and
 * read-only: it reads `questBook`, `npcs` and the campaign and writes nothing. At most
 * `markers.max` are returned (nearest first, one of each kind before a second of either), so
 * Full 3D pays at most that many draw calls and the pixel batch nothing extra. Shape as well as
 * colour tells them apart. The off-screen tracked step already has its edge arrow
 * (ui/beacon-arrow.ts, R0100), which follows the same goal.
 */
export interface QuestMarker {
  kind: 'offer' | 'step';
  quest: string;
  x: number;
  z: number;
  /** Height above the ground (units). */
  lift: number;
  /** R0629: a child profile's marker: larger, and it pulses unless reduced motion is on. */
  big?: boolean;
}

export function questMarkers(world: World): QuestMarker[] {
  const c = world.campaign;
  const book = world.questBook;
  if (
    !c ||
    !book ||
    world.location !== 'grove' ||
    (world.edu !== null && !kidFlow(world)) ||
    c.storyline !== null
  )
    return [];
  const M = C12C.markers;
  const k = world.keeper.pos;
  const d = (m: { x: number; z: number }): number => Math.hypot(m.x - k.x, m.z - k.z);
  const big = kidFlow(world);
  const offers: QuestMarker[] = [];
  const steps: QuestMarker[] = [];
  const board = boardSpot(world);
  for (const [id, e] of Object.entries(book.entries)) {
    const quest = sideStory(id);
    if (!quest) continue;
    const st = boardState(world, c, id);
    if (st === 'available' && e.state === 'offered') {
      const npc = giverNpc(world, quest);
      const at = npc
        ? { x: npc.pos.x, z: npc.pos.z, lift: M.overNpc }
        : board
          ? { ...board, lift: M.overBoard }
          : null;
      if (at) offers.push({ kind: 'offer', quest: id, ...at, ...(big ? { big } : {}) });
    }
  }
  for (const id of book.tracked) {
    const entry = c.side[id] ?? c.fun[id];
    if (!entry || entry.status === 'done' || entry.status === 'closed') continue;
    const at = goalTarget(world, `quest:${id}:${entry.step}`);
    if (at)
      steps.push({
        kind: 'step',
        quest: id,
        x: at.x,
        z: at.z,
        lift: M.overPlace,
        ...(big ? { big } : {}),
      });
  }
  const near = (m: QuestMarker): boolean => d(m) <= M.within;
  const byDist = (a: QuestMarker, b: QuestMarker): number => d(a) - d(b);
  const o = offers.filter(near).sort(byDist);
  const s = steps.filter(near).sort(byDist);
  const out: QuestMarker[] = [];
  const seen = new Set<string>();
  const take = (m: QuestMarker | undefined): void => {
    if (!m || out.length >= M.max) return;
    const key = `${m.kind}:${Math.round(m.x * 2)}:${Math.round(m.z * 2)}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(m);
  };
  take(o[0]);
  take(s[0]);
  for (const m of [...o.slice(1), ...s.slice(1)].sort(byDist)) take(m);
  return out;
}
