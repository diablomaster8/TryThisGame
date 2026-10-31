import { SCENE_PRIO } from '../config/tuning';
import { sceneOwner } from './story-state';
import { sceneWaitsForRegion } from './story-regions';
import type { World } from './types';

/**
 * Lane C round 9 (R0597, CAMP-04; R0631, CAMP-39): the one scene queue with explicit owners and
 * priorities. Every queued scene id gets an owner (its id's first part) and a priority: 0 the
 * spine (a chapter scene, a trigger, an ending, an expansion), 1 a questline's scene, 2 a side
 * story's step, 3 a caper. The dialogue box always plays the head, so the head never moves; a
 * chain already playing (the head's owner) finishes first, and the rest wait by priority,
 * earlier queued first within one priority. Hazel's Grove therefore never waits behind a line.
 */

export type ScenePrio = 0 | 1 | 2 | 3;

export interface QueuedScene {
  id: string;
  owner: string;
  prio: ScenePrio;
}

/** The priority of scene `id` in this world (a line's scene is the one a line handed over). */
export function scenePrio(world: World, id: string): ScenePrio {
  for (const l of Object.values(world.lines ?? {}))
    if (l.queue.includes(id)) return SCENE_PRIO.line;
  const owner = sceneOwner(id);
  if (/^(c\d+|e\d+|t|end)$/.test(owner)) return SCENE_PRIO.spine;
  if (/^q\d+$/.test(owner)) return SCENE_PRIO.caper;
  return SCENE_PRIO.side;
}

/** The spine's queue as owners and priorities, in play order. */
export function queuedScenes(world: World): QueuedScene[] {
  return (world.campaign?.queue ?? []).map((id) => ({
    id,
    owner: sceneOwner(id),
    prio: scenePrio(world, id),
  }));
}

/**
 * Put the queue behind its head in play order: the head's own chain first, then by priority,
 * keeping the order scenes were queued in within one priority. Returns whether it changed.
 */
export function orderSceneQueue(world: World): boolean {
  const c = world.campaign;
  if (!c || c.queue.length < 2) return false;
  // Lane C r10 agent A (R0597, R0605): a line's scene waits until the Keeper is in its region.
  // A waiting head has not begun (the dialogue box holds it), so a ready scene may go first.
  const all = queuedScenes(world);
  const waits = (s: QueuedScene) => sceneWaitsForRegion(world, s.id);
  if (waits(all[0]!)) {
    const ready = all.findIndex((s) => !waits(s));
    if (ready > 0) {
      const [s] = all.splice(ready, 1);
      all.unshift(s!);
    }
  }
  if (all.length < 3 && all.every((s, i) => s.id === c.queue[i])) return false;
  const [head, ...rest] = all;
  const key = (s: QueuedScene) =>
    waits(s) ? SCENE_PRIO.caper + 1 : s.owner === head!.owner ? -1 : s.prio;
  const sorted = rest
    .map((s, i) => ({ s, i }))
    .sort((a, b) => key(a.s) - key(b.s) || a.i - b.i)
    .map((x) => x.s.id);
  const next = [head!.id, ...sorted];
  if (next.every((id, i) => id === c.queue[i])) return false;
  c.queue = next;
  return true;
}
