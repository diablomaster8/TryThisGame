/**
 * R0448 (TECH-06): the guided first loop, pure over the world. Hatch (the egg's own chip),
 * then a pat, a first fruit (TECH-01's cue), and a name. The steps read the private diary's
 * "firsts" (sim/grove-diary.ts), so nothing new is saved beyond two diary fields, and an old
 * save whose Nubbin is past the window never sees it. "I know how to play" ends it.
 */
import { FIRST_LOOP } from '../config/tuning-r11d4';
import type { Nubbin, World } from './types';

export type FirstLoopStep = 'pat' | 'name';

/** The Nubbin the loop is about: a never-reborn child still inside the window. */
function loopChild(world: World): Nubbin | undefined {
  const c = world.campaign;
  return world.nubbins.find(
    (n) =>
      n.stage === 'child' &&
      n.rebirths === 0 &&
      n.stageMs < FIRST_LOOP.windowMs &&
      n.id !== c?.mossId &&
      n.id !== c?.sableId,
  );
}

/** The next step after the hatch that the chip should name, or null (feed has its own cue). */
export function firstLoopStep(world: World): { step: FirstLoopStep; nubbin: Nubbin } | null {
  const d = world.diary;
  if (!d || d.loopSkipped) return null;
  const n = loopChild(world);
  if (!n) return null;
  if (d.firstPetMs === null) return { step: 'pat', nubbin: n };
  if (d.firstFeedMs !== null && (d.firstNameMs ?? null) === null)
    return { step: 'name', nubbin: n };
  return null;
}
