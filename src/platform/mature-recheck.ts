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

/**
 * R0517 (TECH-75): the other 18+ entry, It's Always Sunny (fun quests Q31 to Q45). Its
 * scenes are ids `q31-…` to `q45-…`, matched here so the script stays out of the bundle.
 */
export function isAdultScene(sceneId: string): boolean {
  const m = /^q(\d+)-/.exec(sceneId);
  const n = m ? Number(m[1]) : 0;
  return n >= MATURE_RECHECK.sunnyFirst && n <= MATURE_RECHECK.sunnyLast;
}

/**
 * Pure: whether a queued scene plays now, asks the grown-up question first, or waits
 * (a "Not now" holds it until `deferredUntil`). Any non-18+ scene simply plays.
 */
export function adultSceneGate(
  sceneId: string,
  last: number | null,
  now: number,
  deferredUntil: number,
): 'play' | 'ask' | 'wait' {
  if (!isAdultScene(sceneId) || !recheckDue(last, now)) return 'play';
  return now < deferredUntil ? 'wait' : 'ask';
}
