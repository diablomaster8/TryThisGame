import { EDU_LIMITS } from '../config/tuning-kids';
import type { EduLimits, World } from './types';

/**
 * R0695 (KIDS-27): a grown-up's limits on a Learning Grove: minutes a day, quiet hours by the
 * local clock, and a lock that boots the device straight into this Grove. When the day's
 * minutes are used up, or in quiet hours, the Grove shows its sleeping card until a grown-up
 * unlocks it (for `EDU_LIMITS.unlockMinutes`) or the day turns. These are limits, never streaks:
 * a missed day costs nothing.
 */
export function eduLimits(world: World): EduLimits {
  return (
    world.edu?.limits ?? { dailyMinutes: null, quietFrom: null, quietTo: null, lockToSlot: false }
  );
}

/** True when `hour` (0–23) falls in quiet hours `from`–`to`, which may cross midnight. */
export function inQuietHours(hour: number, from: number | null, to: number | null): boolean {
  if (from === null || to === null || from === to) return false;
  return from < to ? hour >= from && hour < to : hour >= from || hour < to;
}

/** Why the Grove is asleep right now, or null when it may be played. */
export function eduLimitReason(world: World, wallMs: number): 'daily' | 'quiet' | null {
  const e = world.edu;
  if (!e?.limits) return null;
  const l = e.limits;
  if ((l.unlockUntilMs ?? 0) > wallMs) return null;
  if (l.dailyMinutes !== null && e.todayMs >= l.dailyMinutes * 60_000) return 'daily';
  if (inQuietHours(new Date(wallMs).getHours(), l.quietFrom, l.quietTo)) return 'quiet';
  return null;
}

/** A grown-up's settings, each value kept in range. */
export function eduSetLimits(world: World, next: Partial<EduLimits>): void {
  const e = world.edu;
  if (!e) return;
  const cur = eduLimits(world);
  const hour = (h: number | null | undefined, was: number | null) =>
    h === undefined ? was : h === null ? null : Math.max(0, Math.min(23, Math.round(h)));
  const mins = next.dailyMinutes;
  const [lo, hi] = EDU_LIMITS.dailyRange;
  e.limits = {
    dailyMinutes:
      mins === undefined
        ? cur.dailyMinutes
        : mins === null
          ? null
          : Math.max(lo, Math.min(hi, Math.round(mins))),
    quietFrom: hour(next.quietFrom, cur.quietFrom),
    quietTo: hour(next.quietTo, cur.quietTo),
    lockToSlot: next.lockToSlot ?? cur.lockToSlot,
    ...(cur.unlockUntilMs ? { unlockUntilMs: cur.unlockUntilMs } : {}),
  };
}

/** The grown-up's "unlock for now", past the sum gate. */
export function eduUnlockLimits(world: World, wallMs: number): void {
  const e = world.edu;
  if (!e?.limits) return;
  e.limits.unlockUntilMs = wallMs + EDU_LIMITS.unlockMinutes * 60_000;
}
