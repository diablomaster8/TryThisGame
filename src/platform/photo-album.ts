/**
 * R0425 (LOOK-57): the photo album, in IndexedDB (`grove-photos` / `shots`). Each photo the
 * player saves is stored with a small thumbnail, who was in it and when; the newest
 * `ALBUM.max` stay and older ones go, unless marked "keep" (at most `ALBUM.keepMax`, each under
 * a size cap). Every call is wrapped: blocked or missing storage answers null and
 * the album hides, and the game runs on.
 */
import { ALBUM } from '../config/tuning-look';

const DB_NAME = 'grove-photos';
const STORE = 'shots';

export interface AlbumPhoto {
  id: number;
  atWallMs: number;
  nubbinIds: string[];
  caption: string;
  thumb: string;
  full: string;
  /** Kept past the newest `ALBUM.max`. */
  kept?: boolean;
}

let opening: Promise<IDBDatabase | null> | null = null;

function open(): Promise<IDBDatabase | null> {
  opening ??= new Promise<IDBDatabase | null>((resolve) => {
    try {
      if (typeof indexedDB === 'undefined') return resolve(null);
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        try {
          req.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
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
}

/** Every photo, newest first; null when storage is unavailable. */
export async function listPhotos(): Promise<AlbumPhoto[] | null> {
  const db = await open();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
      req.onsuccess = () =>
        resolve(((req.result ?? []) as AlbumPhoto[]).sort((a, b) => b.atWallMs - a.atWallMs));
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/** Which photos to drop: past the newest `max`, unless kept. Pure. */
export function prunable(photos: readonly AlbumPhoto[], max: number): number[] {
  const newest = [...photos].sort((a, b) => b.atWallMs - a.atWallMs);
  return newest
    .slice(max)
    .filter((p) => !p.kept)
    .map((p) => p.id);
}

/** Add a photo (thumbnail and who is in it), then trim the album. Never throws. */
export async function addPhoto(p: Omit<AlbumPhoto, 'id'>): Promise<boolean> {
  const db = await open();
  if (!db) return false;
  const ok = await new Promise<boolean>((resolve) => {
    try {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).add(p);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
      tx.onabort = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
  const all = await listPhotos();
  if (all) for (const id of prunable(all, ALBUM.max)) await remove(id);
  return ok;
}

async function remove(id: number): Promise<void> {
  const db = await open();
  if (!db) return;
  try {
    db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id);
  } catch {
    // Left for the next trim.
  }
}

/** Keep (or stop keeping) a photo past the newest few. False when the keep shelf is full. */
export async function setKeep(id: number, on: boolean): Promise<boolean> {
  const db = await open();
  const all = await listPhotos();
  const p = all?.find((x) => x.id === id);
  if (!db || !all || !p) return false;
  if (on) {
    const kept = all.filter((x) => x.kept && x.id !== id);
    if (kept.length >= ALBUM.keepMax || p.full.length > ALBUM.keepBytes) return false;
    p.kept = true;
  } else delete p.kept;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(p);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

/** The newest photo with this Nubbin in it, for its memorial card. */
export async function newestWith(nubbinId: string): Promise<AlbumPhoto | null> {
  const all = await listPhotos();
  return all?.find((p) => p.nubbinIds.includes(nubbinId)) ?? null;
}
