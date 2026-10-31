/**
 * Lane E round 10 (R0718 KIDS-50, R0745 KIDS-77): what the grown-up report reads that the
 * Learning Grove did not keep before. Minutes played per local day (the last two weeks), and
 * per game: how often it was opened, finished and left mid-round, and the seconds spent.
 * Everything stays in the save on this device; nothing is sent anywhere.
 */
import type { EduGameId } from '../config/edu';
import { localDayKey, tzOf } from './local-time';
import type { EduAttention, EduState, World } from './types';

/** Days of minutes kept. */
const DAYS_KEPT = 14;
const DAY_MS = 86_400_000;

/** Called from `stepEdu` after the day's count moves: today's whole minutes. */
export function noteDaily(e: EduState): void {
  if (!e.todayKey) return;
  const mins = Math.floor(e.todayMs / 60_000);
  const daily = (e.daily ??= {});
  if (daily[e.todayKey] === mins) return;
  if (!(e.todayKey in daily)) {
    const keys = Object.keys(daily).sort();
    for (const k of keys.slice(0, Math.max(0, keys.length - (DAYS_KEPT - 1)))) delete daily[k];
  }
  daily[e.todayKey] = mins;
}

/** The last seven local days, oldest first, with their minutes (0 for a day not played). */
export function weekMinutes(
  world: Pick<World, 'edu' | 'tzOffsetMin'>,
  wallMs: number,
): { day: string; minutes: number }[] {
  const tz = tzOf(world);
  const daily = world.edu?.daily ?? {};
  const out: { day: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = localDayKey(wallMs - i * DAY_MS, tz);
    out.push({ day, minutes: daily[day] ?? 0 });
  }
  return out;
}

export type EduActivityKind = 'open' | 'complete' | 'quit';

/** KIDS-77: one game opened, finished, or left before its results (with the ms it took). */
export function noteActivity(world: World, game: EduGameId, what: EduActivityKind, ms = 0): void {
  const e = world.edu;
  if (!e) return;
  const a: EduAttention = e.attention?.[game] ?? { opens: 0, completes: 0, quits: 0, ms: 0 };
  if (what === 'open') a.opens++;
  else {
    if (what === 'complete') a.completes++;
    else a.quits++;
    // A tab left open for hours is not attention: one sitting counts at most 30 minutes.
    a.ms += Math.max(0, Math.min(30 * 60_000, Number.isFinite(ms) ? ms : 0));
  }
  e.attention = { ...(e.attention ?? {}), [game]: a };
}

/** Average seconds per sitting (finished or left), or null before any. */
export function averageSeconds(a: EduAttention | undefined): number | null {
  if (!a) return null;
  const n = a.completes + a.quits;
  return n > 0 ? Math.round(a.ms / n / 1000) : null;
}
