/**
 * R0583: the real start-line sprite frame for a personality (wave, peek behind the hands,
 * tongue out, yawn), when the sheet has it. Looks only: nothing here is read by the sim.
 */
import { START_CLIP, startFrameIndex, type StartKind } from '../sim/race-persona';
import { frameKey } from './sprites/animations';
import type { PoseName } from '../samples/species';
import type { SpriteSheet } from './sprites/atlas';

type Rect = NonNullable<ReturnType<SpriteSheet['frames']['get']>>;

/** The side-view frame for the start pose at `timeMs`, or null when the sheet lacks the clip. */
export function startRect(
  sheet: SpriteSheet,
  kind: StartKind,
  timeMs: number,
  reduce: boolean,
): Rect | null {
  const c = START_CLIP[kind];
  return sheet.frames.get(frameKey(c.clip, 'side', startFrameIndex(kind, timeMs, reduce))) ?? null;
}

/**
 * The Full 3D rig pose for each start-line kind: a real arm-raise wave and a stretching,
 * wide-mouthed yawn (R0583); the shy hide and the tongue still borrow the surprised and love
 * poses (arms up, a blush). Poses the rigs already know, so every species has them.
 */
export const START_POSE_3D = {
  wave: 'wave',
  hide: 'surprised',
  tongue: 'love',
  yawn: 'yawn',
} as const satisfies Record<StartKind, PoseName>;
