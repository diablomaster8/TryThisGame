/**
 * R0635 (CAMP-43): a quest's own length in minutes. `Quest.minutes` (optional, in data) is the
 * whole quest's rough play time; when set it replaces steps x `minutesPerStep`, scaled to the
 * steps left. These wrap the numbers `questProgress` and `questLength` give, so the rows and
 * chips agree whichever way a quest was measured.
 */
import { sideStory } from './story-scenes';

/** The minutes for `left` of `of` steps: the quest's own figure scaled, or `fallback`. */
export function questMinutes(id: string, left: number, of: number, fallback: number): number {
  const own = sideStory(id)?.minutes;
  if (own === undefined || of <= 0) return fallback;
  return Math.max(1, Math.round((own * left) / of));
}

/** `questProgress`'s result with the quest's own minutes, if it has any. */
export function fitProgress<P extends { step: number; of: number; minutesLeft: number }>(
  id: string,
  p: P | null,
): P | null {
  if (!p) return p;
  return { ...p, minutesLeft: questMinutes(id, p.of - (p.step - 1), p.of, p.minutesLeft) };
}

/** `questLength`'s result with the quest's own minutes, if it has any. */
export function fitLength<L extends { of: number; minutes: number }>(
  id: string,
  len: L | null,
): L | null {
  if (!len) return len;
  return { ...len, minutes: questMinutes(id, len.of, len.of, len.minutes) };
}
