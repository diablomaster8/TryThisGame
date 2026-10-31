/**
 * TECH-45: the Keeper's local calendar and clock, worked out from the wall time and the time
 * zone offset the UI sends (`world.tzOffsetMin`, minutes east of UTC) with plain arithmetic:
 * no `Date`, so the sim gives the same answer for the same save on any device and in any
 * test runner's time zone. The date part is Howard Hinnant's days-to-civil algorithm.
 */
import type { World } from './types';

const MINUTE = 60_000;
const DAY = 86_400_000;

export interface LocalParts {
  year: number;
  /** 0–11, as `Date.getMonth`. */
  month: number;
  /** 1–31. */
  day: number;
  /** 0 = Sunday, as `Date.getDay`. */
  weekday: number;
  /** 0–23. */
  hour: number;
}

/** The offset the sim reads: the one the UI last sent, else UTC. */
export function tzOf(world: Pick<World, 'tzOffsetMin'>): number {
  const tz = world.tzOffsetMin;
  return typeof tz === 'number' && Number.isFinite(tz) ? tz : 0;
}

/** Whole days since 1970-01-01 in the local zone. */
export function localDayNumber(wallMs: number, tzMin: number): number {
  return Math.floor((wallMs + tzMin * MINUTE) / DAY);
}

export function localParts(wallMs: number, tzMin: number): LocalParts {
  const local = wallMs + tzMin * MINUTE;
  const days = Math.floor(local / DAY);
  const hour = Math.floor((local - days * DAY) / 3_600_000);
  // Days to civil (proleptic Gregorian), eras of 400 years from 0000-03-01.
  const z = days + 719_468;
  const era = Math.floor(z / 146_097);
  const doe = z - era * 146_097;
  const yoe = Math.floor(
    (doe - Math.floor(doe / 1460) + Math.floor(doe / 36_524) - Math.floor(doe / 146_096)) / 365,
  );
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const day = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp < 10 ? mp + 3 : mp - 9;
  const year = yoe + era * 400 + (m <= 2 ? 1 : 0);
  // 1970-01-01 was a Thursday.
  const weekday = (((days + 4) % 7) + 7) % 7;
  return { year, month: m - 1, day, weekday, hour };
}

/** Local `YYYY-MM-DD`. */
export function localDayKey(wallMs: number, tzMin: number): string {
  const p = localParts(wallMs, tzMin);
  const two = (n: number) => String(n).padStart(2, '0');
  return `${p.year}-${two(p.month + 1)}-${two(p.day)}`;
}

/** Local hour, 0–23. */
export function localHourOf(wallMs: number, tzMin: number): number {
  return localParts(wallMs, tzMin).hour;
}
