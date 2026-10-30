/**
 * TECH-75: the Multiverse rift (18+) asks its grown-up question again when no 18+ entry has
 * happened for `MATURE_RECHECK.days`. The Mature content setting stays as it is; only the
 * entry is re-gated. The last entry is kept per device in `grove.adultEntry`.
 */
import { MATURE_RECHECK } from '../config/tuning-tech';

const KEY = 'grove.adultEntry';
const DAY = 24 * 60 * 60 * 1000;

/** Pure: whether an entry at `now` must ask again, given the last one (null: never). */
export function recheckDue(last: number | null, now: number): boolean {
  return last !== null && now - last >= MATURE_RECHECK.days * DAY;
}

export function lastAdultEntry(): number | null {
  try {
    const v = Number(localStorage.getItem(KEY));
    return Number.isFinite(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
}

export function noteAdultEntry(now = Date.now()): void {
  try {
    localStorage.setItem(KEY, String(now));
  } catch {
    // Unrecorded: the next entry simply does not ask again.
  }
}
