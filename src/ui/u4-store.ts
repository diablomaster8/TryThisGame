/**
 * Where the story UI keeps its small pictures (campaign graphics 4, K30, K31, K47): chapter
 * thumbnails, each ending's last frame and the last chapter photo, as JPEG data URLs in
 * IndexedDB, and the photo offer's state in localStorage. Every call is wrapped like the
 * sculpt cache: private windows, blocked storage or a full disk read as "nothing kept" and
 * the game goes on. Nothing here touches the sim; the simulation save has no UI block, so
 * these live beside it (assumption recorded in PROGRESS.md).
 */
const DB_NAME = 'grove-cg4';
const STORE = 'shots';
const OFFER_KEY = 'grove.cg4.offer';

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

export const thumbKey = (campaign: string, chapter: number): string =>
  `thumb:${campaign}:${chapter}`;
export const endingKey = (campaign: string, ending: string): string =>
  `ending:${campaign}:${ending}`;
export const PHOTO_KEY = 'photo:last';

/** Keep a picture; fire and forget. */
export async function putShot(key: string, dataUrl: string): Promise<void> {
  const db = await open();
  if (!db) return;
  try {
    db.transaction(STORE, 'readwrite').objectStore(STORE).put(dataUrl, key);
  } catch {
    // Nothing kept; nothing lost.
  }
}

/** The pictures filed under `keys`, null where there is none. */
export async function getShots(keys: string[]): Promise<Array<string | null>> {
  const none = keys.map(() => null);
  const db = await open();
  if (!db || keys.length === 0) return none;
  return new Promise((resolve) => {
    setTimeout(() => resolve(none), 1500);
    try {
      const store = db.transaction(STORE, 'readonly').objectStore(STORE);
      const out: Array<string | null> = keys.map(() => null);
      let left = keys.length;
      keys.forEach((k, i) => {
        const req = store.get(k);
        req.onsuccess = () => {
          if (typeof req.result === 'string') out[i] = req.result;
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

/** A canvas as a small JPEG data URL, or null when the browser refuses. */
export function shrink(
  src: HTMLCanvasElement,
  w: number,
  h: number,
  quality: number,
): string | null {
  try {
    const out = document.createElement('canvas');
    out.width = w;
    out.height = h;
    const ctx = out.getContext('2d');
    if (!ctx) return null;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, 0, 0, w, h);
    return out.toDataURL('image/jpeg', quality);
  } catch {
    return null;
  }
}

export interface OfferState {
  chapter: number;
  title: string;
  campaign: string;
  state: 'pending' | 'taken' | 'declined';
}

export function readOffer(): OfferState | null {
  try {
    const raw = localStorage.getItem(OFFER_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as Partial<OfferState>;
    if (
      typeof o.chapter !== 'number' ||
      typeof o.title !== 'string' ||
      typeof o.campaign !== 'string' ||
      (o.state !== 'pending' && o.state !== 'taken' && o.state !== 'declined')
    )
      return null;
    return o as OfferState;
  } catch {
    return null;
  }
}

export function writeOffer(o: OfferState | null): void {
  try {
    if (o) localStorage.setItem(OFFER_KEY, JSON.stringify(o));
    else localStorage.removeItem(OFFER_KEY);
  } catch {
    // Storage blocked: the offer just does not survive a reload.
  }
}

/** A data URL as a drawable canvas. */
export function dataUrlToCanvas(url: string): Promise<HTMLCanvasElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      c.getContext('2d')?.drawImage(img, 0, 0);
      resolve(c);
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}
