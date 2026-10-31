import { SCENE_PRIO } from '../config/tuning';
import { sceneOwner } from './story-state';
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
  if (!c || c.queue.length < 3) return false;
  const [head, ...rest] = queuedScenes(world);
  const key = (s: QueuedScene) => (s.owner === head!.owner ? -1 : s.prio);
  const sorted = rest
    .map((s, i) => ({ s, i }))
    .sort((a, b) => key(a.s) - key(b.s) || a.i - b.i)
    .map((x) => x.s.id);
  if (sorted.every((id, i) => id === rest[i]!.id)) return false;
  c.queue = [head!.id, ...sorted];
  return true;
}
