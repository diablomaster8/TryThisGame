/**
 * R0623 (CAMP-31): room in localStorage. The copies of saves that failed to load
 * (`*.unreadable.N`) are also kept in IndexedDB's `unreadable` store, so when a live write
 * hits the quota those localStorage copies can be freed without losing them: only a copy
 * IndexedDB has confirmed (same text) is ever removed. A write that still does not fit is
 * reported as `full`, and the HUD offers a backup file. A big write logs a debug warning.
 */
import { SAVE_LAYOUT } from '../config/tuning-camp11-save';
import { kv } from './idb';

export type SaveProblem = 'full' | 'blocked' | null;

let problem: SaveProblem = null;
/** localStorage key → the text IndexedDB holds for it. */
const archived = new Map<string, string>();

/** Why the last live write failed, or null after a good one. */
export function lastSaveProblem(): SaveProblem {
  return problem;
}

export function noteSaveProblem(p: SaveProblem): void {
  problem = p;
}

/** Pure: a browser's "no room" error, under any of its names. */
export function isQuotaError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { name?: unknown; code?: unknown };
  return (
    e.name === 'QuotaExceededError' ||
    e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    e.code === 22 ||
    e.code === 1014
  );
}

/** A debug warning for a live save near the size where it should move (R0623). */
export function warnIfBig(key: string, json: string): boolean {
  const bytes = json.length * 2;
  if (bytes <= SAVE_LAYOUT.slotWarnBytes) return false;
  try {
    console.debug(`[grove] ${key} is ${Math.round(bytes / 1024)} KB`);
  } catch {
    // No console: nothing to say.
  }
  return true;
}

function unreadableKeys(): string[] {
  const out: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && /\.unreadable\.\d+$/.test(k)) out.push(k);
    }
  } catch {
    // No listing: nothing to free.
  }
  return out;
}

/** Copy one unreadable copy into IndexedDB; it becomes freeable once confirmed. */
export async function archiveUnreadable(key: string, json: string): Promise<boolean> {
  try {
    const ok = await kv().put('unreadable', key, json);
    if (ok) archived.set(key, json);
    return ok;
  } catch {
    return false;
  }
}

/** At boot: every unreadable copy in localStorage goes into IndexedDB too. */
export async function archiveAllUnreadable(): Promise<number> {
  let n = 0;
  for (const key of unreadableKeys()) {
    let json: string | null;
    try {
      json = localStorage.getItem(key);
    } catch {
      json = null;
    }
    if (json !== null && (await archiveUnreadable(key, json))) n += 1;
  }
  return n;
}

/** Remove the unreadable copies IndexedDB already holds. Answers how many went. */
export function freeArchivedUnreadable(): number {
  let freed = 0;
  for (const key of unreadableKeys()) {
    try {
      const held = archived.get(key);
      if (held !== undefined && localStorage.getItem(key) === held) {
        localStorage.removeItem(key);
        freed += 1;
      }
    } catch {
      // Left in place.
    }
  }
  return freed;
}

/**
 * Write with one retry after freeing room. Never throws; false when nothing was written,
 * with `lastSaveProblem()` saying whether storage is full or blocked.
 */
export function putWithRoom(write: () => void): boolean {
  try {
    write();
    problem = null;
    return true;
  } catch (err) {
    if (!isQuotaError(err)) {
      problem = 'blocked';
      return false;
    }
  }
  if (freeArchivedUnreadable() > 0) {
    try {
      write();
      problem = null;
      return true;
    } catch {
      // Still full.
    }
  }
  problem = 'full';
  return false;
}

/** Tests: forget what was archived. */
export function resetSaveRoom(): void {
  archived.clear();
  problem = null;
}
