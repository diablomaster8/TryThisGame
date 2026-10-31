/**
 * R0619 / R0623 (CAMP-27, CAMP-31): the Grove's IndexedDB database (`grove`) for what does
 * not belong in localStorage: chapter `checkpoints` and rolling `backups`. Every call is
 * wrapped and answers a harmless value (null, false, []) when IndexedDB is missing, blocked
 * or slow, so the game keeps running on localStorage alone. Tests swap in `memoryKv()`.
 */

export type GroveStore = 'checkpoints' | 'backups';
const STORES: readonly GroveStore[] = ['checkpoints', 'backups'];
const DB_NAME = 'grove';
/** A read that has not answered in this long reads as nothing. */
const SLOW_MS = 1500;

/** The small key-value surface the backups and checkpoints need. Values are strings. */
export interface KvBackend {
  /** False when there is no database at all (blocked or unsupported). */
  available(): Promise<boolean>;
  get(store: GroveStore, key: string): Promise<string | null>;
  put(store: GroveStore, key: string, value: string): Promise<boolean>;
  del(store: GroveStore, key: string): Promise<boolean>;
  /** Keys in `store` that start with `prefix`. */
  keys(store: GroveStore, prefix: string): Promise<string[]>;
}

/** An in-memory store (tests, or a stand-in); `broken` makes it act like blocked IndexedDB. */
export function memoryKv(broken = false): KvBackend & { data: Map<string, string> } {
  const data = new Map<string, string>();
  const k = (s: GroveStore, key: string): string => `${s}\u0000${key}`;
  return {
    data,
    available: () => Promise.resolve(!broken),
    get: (s, key) => Promise.resolve(broken ? null : (data.get(k(s, key)) ?? null)),
    put: (s, key, v) => {
      if (broken) return Promise.resolve(false);
      data.set(k(s, key), v);
      return Promise.resolve(true);
    },
    del: (s, key) => {
      if (broken) return Promise.resolve(false);
      data.delete(k(s, key));
      return Promise.resolve(true);
    },
    keys: (s, prefix) =>
      Promise.resolve(
        broken
          ? []
          : [...data.keys()]
              .filter((x) => x.startsWith(k(s, prefix)))
              .map((x) => x.slice(s.length + 1)),
      ),
  };
}

function idbKv(): KvBackend {
  let opening: Promise<IDBDatabase | null> | null = null;
  const open = (): Promise<IDBDatabase | null> => {
    opening ??= new Promise<IDBDatabase | null>((resolve) => {
      try {
        if (typeof indexedDB === 'undefined') return resolve(null);
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
          try {
            for (const s of STORES)
              if (!req.result.objectStoreNames.contains(s)) req.result.createObjectStore(s);
          } catch {
            // A failed upgrade aborts the open; onerror answers null.
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
  };
  /** Run one request; `fallback` on any failure or after SLOW_MS. */
  const run = <T>(
    store: GroveStore,
    mode: IDBTransactionMode,
    make: (s: IDBObjectStore) => IDBRequest,
    read: (r: unknown) => T,
    fallback: T,
  ): Promise<T> =>
    open().then(
      (db) =>
        new Promise<T>((resolve) => {
          if (!db) return resolve(fallback);
          const timer = setTimeout(() => resolve(fallback), SLOW_MS);
          try {
            const req = make(db.transaction(store, mode).objectStore(store));
            req.onsuccess = () => {
              clearTimeout(timer);
              try {
                resolve(read(req.result));
              } catch {
                resolve(fallback);
              }
            };
            req.onerror = () => {
              clearTimeout(timer);
              resolve(fallback);
            };
          } catch {
            clearTimeout(timer);
            resolve(fallback);
          }
        }),
    );
  return {
    available: () => open().then((db) => db !== null),
    get: (s, key) =>
      run(
        s,
        'readonly',
        (o) => o.get(key),
        (r) => (typeof r === 'string' ? r : null),
        null,
      ),
    put: (s, key, v) =>
      run(
        s,
        'readwrite',
        (o) => o.put(v, key),
        () => true,
        false,
      ),
    del: (s, key) =>
      run(
        s,
        'readwrite',
        (o) => o.delete(key),
        () => true,
        false,
      ),
    keys: (s, prefix) =>
      run(
        s,
        'readonly',
        (o) => o.getAllKeys(),
        (r) =>
          (r as IDBValidKey[]).filter(
            (x): x is string => typeof x === 'string' && x.startsWith(prefix),
          ),
        [] as string[],
      ),
  };
}

let backend: KvBackend | null = null;

/** The database the game uses (IndexedDB unless a test set another). */
export function kv(): KvBackend {
  backend ??= idbKv();
  return backend;
}

/** Tests: use `b` in place of IndexedDB (null goes back to IndexedDB). */
export function setKvBackend(b: KvBackend | null): void {
  backend = b;
}

/** Remove every key under `prefix` in `store`. Never throws. */
export async function delPrefix(store: GroveStore, prefix: string): Promise<number> {
  try {
    const keys = await kv().keys(store, prefix);
    await Promise.all(keys.map((k) => kv().del(store, k)));
    return keys.length;
  } catch {
    return 0;
  }
}
