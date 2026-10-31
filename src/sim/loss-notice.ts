/**
 * Lane E round 10 (R0694 KIDS-26): a grown-up's heads-up before the stories about loss. In
 * a Learning Grove a tagged chapter (`SENSITIVE_CHAPTERS`) or side story with a departure
 * (`SENSITIVE_SIDE_STORIES`) can wait before its first scene queues, until a grown-up, behind
 * the gate, says "we're together now". The choice is kept per story in `edu.lossHolds`, keyed
 * by chapter number ("10") or side story id ("s27"); unset, ages 3 and 4 wait and older
 * children play on.
 */
import {
  LOSS_TOGETHER_MAX_AGE,
  SENSITIVE_CHAPTERS,
  SENSITIVE_SIDE_STORIES,
} from '../config/tuning-access-r10';
import type { LossHold, World } from './types';

/** A tagged story: a chapter number or a side story id. */
export type LossKey = number | string;

function tagOf(key: LossKey): string | undefined {
  return typeof key === 'number' ? SENSITIVE_CHAPTERS[key] : SENSITIVE_SIDE_STORIES[key];
}

/** The tagged chapters, in story order. */
export function sensitiveChapters(): number[] {
  return Object.keys(SENSITIVE_CHAPTERS)
    .map(Number)
    .sort((a, b) => a - b);
}

/** The hold in force for a story (its default when the grown-up has not chosen). */
export function lossHoldOf(world: Pick<World, 'edu'>, key: LossKey): LossHold | null {
  const e = world.edu;
  if (!e || !tagOf(key)) return null;
  return e.lossHolds?.[String(key)] ?? (e.age <= LOSS_TOGETHER_MAX_AGE ? 'together' : 'play');
}

/** True while this story's first scene must wait for a grown-up. */
export function lossHeld(world: Pick<World, 'edu'>, key: LossKey): boolean {
  return lossHoldOf(world, key) === 'together';
}

/**
 * The story waiting now, if any: the campaign at a held chapter's start, or a held side
 * story open at its first step and not yet begun.
 */
export function lossWaiting(world: Pick<World, 'edu' | 'campaign'>): LossKey | null {
  const c = world.campaign;
  if (!c || !world.edu) return null;
  // Step 0 is "opening not yet played"; the hold keeps it from queueing (campaign.ts).
  if (c.step === 0 && lossHeld(world, c.chapter)) return c.chapter;
  for (const id of Object.keys(SENSITIVE_SIDE_STORIES)) {
    const st = c.side[id];
    if (st?.status === 'open' && st.step === 0 && st.stage === 'wait' && lossHeld(world, id))
      return id;
  }
  return null;
}

/** The tagged stories not yet reached or still waiting, for the grown-up area. */
export function upcomingLossChapters(world: Pick<World, 'edu' | 'campaign'>): number[] {
  const c = world.campaign;
  const at = c ? c.chapter : 0;
  return sensitiveChapters().filter((n) => n > at || (n === at && (c?.step ?? 0) === 0));
}

/** Side stories with a departure that have not started their first scene yet. */
export function upcomingLossSideStories(world: Pick<World, 'edu' | 'campaign'>): string[] {
  const side = world.campaign?.side ?? {};
  return Object.keys(SENSITIVE_SIDE_STORIES).filter((id) => {
    const st = side[id];
    return !st || (st.status === 'open' && st.step === 0 && st.stage === 'wait');
  });
}

export function setLossHold(world: World, key: LossKey, hold: LossHold): void {
  const e = world.edu;
  if (!e || !tagOf(key)) return;
  if (hold !== 'together' && hold !== 'play' && hold !== 'released') return;
  e.lossHolds = { ...(e.lossHolds ?? {}), [String(key)]: hold };
}
