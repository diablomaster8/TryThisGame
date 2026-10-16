/**
 * Baked creature surfaces kept in IndexedDB between visits, so a second load skips the
 * marching altogether. Records are filed by look, surface index and resolution
 * (`sculptCacheKey`) and carry a version made from the spec hash and the sculpt code; a
 * record with another version is stale and simply gets overwritten when the surface is
 * rebuilt. Every call is wrapped: private windows, blocked storage, a full disk or a
 * browser without IndexedDB all read as "not cached" and the game builds instead.
 */
import type { SurfaceArrays } from '../samples/sculpt-spec';

interface CacheRecord {
  version: string;
  surface: SurfaceArrays;
}

const DB_NAME = 'grove-sculpt';
const STORE = 'surfaces';

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

/**
 * Many surfaces in one read transaction. Each answer is the stored attributes when the
 * record exists and carries `version`, else null.
 */
export async function readSurfaces(
  wanted: Array<{ key: string; version: string }>,
): Promise<Array<SurfaceArrays | null>> {
  const none = wanted.map(() => null);
  const db = await open();
  if (!db || !wanted.length) return none;
  return new Promise((resolve) => {
    // A store that never answers must not hold the build up: give up after a second.
    setTimeout(() => resolve(none), 1000);
    try {
      const store = db.transaction(STORE, 'readonly').objectStore(STORE);
      const out: Array<SurfaceArrays | null> = wanted.map(() => null);
      let left = wanted.length;
      wanted.forEach((w, i) => {
        const req = store.get(w.key);
        req.onsuccess = () => {
          const rec = req.result as CacheRecord | undefined;
          if (rec && rec.version === w.version && rec.surface) out[i] = rec.surface;
          if (--left === 0) resolve(out);
        };
        req.onerror = () => {
          if (--left === 0) resolve(out);
        };
      });
    } catch {
      resolve(none);
    }
  });
}

/**
 * Store surfaces in one transaction. Fire and forget: a failed write only means a rebuild
 * next time. Relaxed durability, and one writer: a write transaction makes every read of
 * the store wait for its commit, so the page writes in a batch once loading is over.
 */
export async function writeSurfaces(
  batch: Array<{ key: string; version: string; surface: SurfaceArrays }>,
): Promise<void> {
  const db = await open();
  if (!db || !batch.length) return;
  try {
    const tx = db.transaction(STORE, 'readwrite', { durability: 'relaxed' });
    const store = tx.objectStore(STORE);
    for (const b of batch) {
      const rec: CacheRecord = { version: b.version, surface: b.surface };
      store.put(rec, b.key);
    }
    tx.onerror = (e) => e.preventDefault();
  } catch {
    // Quota or a closed database: nothing to do.
  }
}
