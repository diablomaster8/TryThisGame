/**
 * R0668 (CAMP-76): big live saves in IndexedDB. Synchronous localStorage writes of a big
 * save stall a phone, so once a save passes `SAVE_LAYOUT.idbMoveBytes` (and only while the
 * `idbLiveSaves` flag is on) its JSON goes to the `live` store and localStorage keeps a small
 * pointer, `{"idb":key,"savedAtWallMs":…,"bytes":…}`.
 *
 * Losing nothing is the rule, so the order is careful: the full JSON is cached in memory at
 * once (every read in this page sees it), the IndexedDB write goes next, and the pointer
 * replaces the localStorage copy only after IndexedDB has confirmed the write. Until then the
 * older localStorage value stays, and a tab killed mid-write reloads the last good copy.
 * Loading stays synchronous: `preloadLive` fills the cache at boot, before any slot is read.
 * A pointer whose data cannot be found reads back as the pointer itself, which no save loader
 * accepts, so the game takes its unreadable path and the IndexedDB copy is never overwritten.
 */
import { SAVE_LAYOUT } from '../config/tuning-camp11-save';
import { kv } from './idb';

export interface LiveStub {
  idb: string;
  savedAtWallMs: number;
  bytes: number;
}

/** Full JSON of every pointed-at save this page knows, by localStorage key. */
const cache = new Map<string, string>();
let forced: boolean | null = null;

/** Tests: turn the flag on or off (null goes back to tuning). */
export function setLiveSavesOn(on: boolean | null): void {
  forced = on;
}

export function liveSavesOn(): boolean {
  return forced ?? SAVE_LAYOUT.idbLiveSaves;
}

/** Pure: the pointer a localStorage value holds, or null for an ordinary save. */
export function parseStub(raw: string | null): LiveStub | null {
  if (raw === null || !raw.startsWith('{"idb":')) return null;
  try {
    const s = JSON.parse(raw) as Partial<LiveStub>;
    return typeof s.idb === 'string' && typeof s.savedAtWallMs === 'number'
      ? { idb: s.idb, savedAtWallMs: s.savedAtWallMs, bytes: Number(s.bytes) || 0 }
      : null;
  } catch {
    return null;
  }
}

function savedAtOf(json: string): number {
  const m = /"savedAtWallMs":(\d+)/.exec(json);
  return m ? Number(m[1]) : 0;
}

/** Pure: does a save this big belong in IndexedDB. */
export function belongsInIdb(json: string): boolean {
  return liveSavesOn() && json.length * 2 > SAVE_LAYOUT.idbMoveBytes;
}

/** What a localStorage value really holds: the save itself, or the save its pointer names. */
export function resolveLive(key: string, raw: string | null): string | null {
  // A big write this page made (or fetched at boot) is the newest copy, pointer or not yet.
  const held = cache.get(key);
  if (held !== undefined) return held;
  const stub = parseStub(raw);
  return stub ? (cache.get(stub.idb) ?? raw) : raw;
}

/** Is `json` still the newest big write to `key` in this page. */
export function liveLatest(key: string, json: string): boolean {
  return cache.get(key) === json;
}

/** An ordinary write to `key` replaces any big copy: a late IndexedDB answer must not win. */
export function forgetLive(key: string): void {
  cache.delete(key);
}

/**
 * Write a big save. `putStub` writes the pointer into localStorage (it may throw; a failure
 * leaves the older full copy, which still loads). Resolves true once IndexedDB holds it.
 */
export function writeLive(
  key: string,
  json: string,
  putStub: (stub: string) => void,
): Promise<boolean> {
  cache.set(key, json);
  return kv()
    .put('live', key, json)
    .then((ok) => {
      // A newer write (big or small) since this one: it owns the slot now.
      if (!ok || cache.get(key) !== json) return ok;
      try {
        putStub(
          JSON.stringify({ idb: key, savedAtWallMs: savedAtOf(json), bytes: json.length * 2 }),
        );
      } catch {
        // The full copy stays in localStorage; it still loads.
      }
      return true;
    })
    .catch(() => false);
}

/** Once at boot: fetch every pointed-at save into the cache. Answers how many it found. */
export async function preloadLive(
  entries: Array<{ key: string; raw: string | null }>,
): Promise<number> {
  let found = 0;
  for (const { key, raw } of entries) {
    const stub = parseStub(raw);
    if (!stub) continue;
    try {
      const json = await kv().get('live', stub.idb);
      if (json !== null) {
        cache.set(key, json);
        found += 1;
      }
    } catch {
      // Unfound: the pointer reads as unreadable, and IndexedDB keeps the data.
    }
  }
  return found;
}

/** A cleared slot's big copy goes too. */
export function dropLive(key: string): void {
  cache.delete(key);
  void kv()
    .del('live', key)
    .catch(() => false);
}
