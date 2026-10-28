/**
 * A second copy of every slot's save in IndexedDB (`grove-saves` / `slots`, key
 * `mode:index`), so a browser that clears script-written localStorage after a week away
 * (Safari's tracking prevention) does not take the Grove with it. Writes are
 * fire-and-forget; a blocked or missing IndexedDB reads as "no mirror" and the game runs
 * on localStorage alone. Loading stays synchronous: `restoreFromMirror` runs once at boot
 * and puts back any copy that is newer than (or missing from) localStorage.
 */

const DB_NAME = 'grove-saves';
const STORE = 'slots';

interface MirrorRecord {
  json: string;
  savedAtWallMs: number;
}

/** Pure: the save's `savedAtWallMs`, or 0 when absent or unreadable. */
export function savedAtOf(json: string | null): number {
  if (json === null) return 0;
  try {
    const at = (JSON.parse(json) as { savedAtWallMs?: unknown }).savedAtWallMs;
    return typeof at === 'number' && Number.isFinite(at) ? at : 0;
  } catch {
    return 0;
  }
}

/**
 * Pure: which copy to keep. A missing local copy always loses to a mirror; otherwise the
 * newer `savedAtWallMs` wins and a tie keeps localStorage.
 */
export function newerCopy(local: string | null, mirror: string | null): 'local' | 'mirror' {
  if (mirror === null) return 'local';
  if (local === null) return 'mirror';
  return savedAtOf(mirror) > savedAtOf(local) ? 'mirror' : 'local';
}

let opening: Promise<IDBDatabase | null> | null = null;

function open(): Promise<IDBDatabase | null> {
  opening ??= new Promise<IDBDatabase | null>((resolve) => {
    try {
      if (typeof indexedDB === 'undefined') return resolve(null);
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        try {
          req.result.createObjectStore(STORE);
        } catch {
          // A failed upgrade aborts the open; onerror below answers null.
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return opening;
}

/** Mirror one slot's save. Never throws, never waits. */
export function mirrorWrite(key: string, json: string): void {
  void open().then((db) => {
    if (!db) return;
    try {
      const record: MirrorRecord = { json, savedAtWallMs: savedAtOf(json) };
      db.transaction(STORE, 'readwrite').objectStore(STORE).put(record, key);
    } catch {
      // Mirror only: the localStorage copy is the one the game uses.
    }
  });
}

/** Drop a slot's mirror (the player cleared it, so it must not come back). */
export function mirrorDelete(key: string): void {
  void open().then((db) => {
    if (!db) return;
    try {
      db.transaction(STORE, 'readwrite').objectStore(STORE).delete(key);
    } catch {
      // As above.
    }
  });
}

/** Every mirrored save, or [] when IndexedDB is unavailable or slow (1 s cap). */
export function mirrorReadAll(): Promise<Array<{ key: string; json: string }>> {
  return open().then(
    (db) =>
      new Promise((resolve) => {
        if (!db) return resolve([]);
        setTimeout(() => resolve([]), 1000);
        try {
          const store = db.transaction(STORE, 'readonly').objectStore(STORE);
          const keys = store.getAllKeys();
          const values = store.getAll();
          values.onsuccess = () => {
            try {
              const out: Array<{ key: string; json: string }> = [];
              (values.result as unknown[]).forEach((v, i) => {
                const rec = v as Partial<MirrorRecord> | null;
                const key = (keys.result as IDBValidKey[])[i];
                if (typeof key === 'string' && rec && typeof rec.json === 'string') {
                  out.push({ key, json: rec.json });
                }
              });
              resolve(out);
            } catch {
              resolve([]);
            }
          };
          values.onerror = () => resolve([]);
        } catch {
          resolve([]);
        }
      }),
  );
}
