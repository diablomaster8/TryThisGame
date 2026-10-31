/**
 * Lane E round 9: the Learning Grove's session flow, from hello to goodbye.
 *
 * - R0696 (KIDS-28): the child's animal icon and colour tag, so siblings can tell their
 *   Groves apart on the title and in the `?kids` picker.
 * - R0704 (KIDS-36): the session's phase, read from `playedMs` alone so a reload keeps it.
 *   The phase only shapes what the entry prompt suggests; it never forces anything.
 * - R0724 (KIDS-56): in the wind-down an idle Nubbin yawns (the same `sit`/`yawn` act the
 *   moody look uses, so both renderers already draw it).
 */
import { EDU } from '../config/edu';
import { EDU_ARC, EDU_TAG, EDU_YAWN } from '../config/tuning';
import { eduBreakActive, eduBreakDue } from './edu';
import type { Rng } from './rng';
import type { IdleAct } from './soul-idle';
import type { EduState, Nubbin, World } from './types';

/** Set or clear the child's icon and colour tag; anything not on the lists is ignored. */
export function eduSetTag(world: World, icon: string | null, colour: string | null): void {
  const e = world.edu;
  if (!e) return;
  if (icon === null) delete e.icon;
  else if (EDU_TAG.icons.includes(icon)) e.icon = icon;
  if (colour === null) delete e.tagColour;
  else if (colour in EDU_TAG.colours) e.tagColour = colour;
}

export type EduPhase = 'hello' | 'main' | 'care' | 'second' | 'windDown' | 'goodnight';

/**
 * Pure: where a session stands. Hello for the first minute, the main activity, a care beat
 * around the middle, a second activity, the wind-down in the last `EDU.breakWarnMinutes`,
 * and goodnight once the break is due or running.
 */
export function eduPhase(
  e: Pick<EduState, 'playedMs' | 'sessionMinutes'>,
  breakRunning = false,
): EduPhase {
  const total = e.sessionMinutes * 60_000;
  const t = e.playedMs;
  if (breakRunning || t >= total) return 'goodnight';
  if (total - t <= EDU.breakWarnMinutes * 60_000) return 'windDown';
  if (t < EDU_ARC.helloMs) return 'hello';
  const f = t / total;
  if (f < EDU_ARC.careFrom) return 'main';
  if (f < EDU_ARC.careTo) return 'care';
  return 'second';
}

/** The phase of a world's Learning Grove, or null outside it. */
export function eduSessionPhase(world: World, nowWallMs: number): EduPhase | null {
  const e = world.edu;
  if (!e) return null;
  return eduPhase(e, eduBreakActive(world, nowWallMs) || eduBreakDue(world));
}

/**
 * R0724: a wind-down yawn for an idle Nubbin, or null. Draws from the rng only in the
 * wind-down, so the rest of a session (and every other Grove) plays exactly as before.
 */
export function eduYawnAct(n: Nubbin, world: World, rng: Rng): IdleAct | null {
  const e = world.edu;
  if (!e || n.stage === 'egg') return null;
  if (eduPhase(e) !== 'windDown') return null;
  if (!rng.chance(EDU_YAWN.chance)) return null;
  return { state: 'sit', ms: EDU_YAWN.ms, itemId: 'yawn' };
}
