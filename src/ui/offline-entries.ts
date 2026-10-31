import { OFFLINE_ENTRY_TEXT } from '../config/strings-r8d-plat';
import { OFFLINE_ENTRIES } from '../config/tuning-r8d-plat';

/**
 * R0520 (TECH-80): offline, the More menu greys out the story worlds whose script chunk
 * this device never downloaded, with a short reason, instead of letting the tap fail. The
 * service worker answers a `has-urls` message (public/sw.js) from its own cache. With no
 * controlling worker (dev, or a first visit) nothing is known, so nothing is greyed.
 */
export interface OfflineEntry {
  button: HTMLButtonElement;
  /** The chunk's file-name stem, e.g. 'atlas-catalogue' for assets/atlas-catalogue-<hash>.js. */
  chunk: string;
}

/** Ask the controlling service worker which of these URLs or stems it holds; null if unknown. */
export function swHas(urls: string[]): Promise<boolean[] | null> {
  const sw = typeof navigator !== 'undefined' ? navigator.serviceWorker?.controller : null;
  if (!sw) return Promise.resolve(null);
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timer = window.setTimeout(() => resolve(null), OFFLINE_ENTRIES.replyMs);
    channel.port1.onmessage = (e: MessageEvent<{ has?: unknown }>) => {
      window.clearTimeout(timer);
      const has = e.data?.has;
      resolve(Array.isArray(has) && has.length === urls.length ? has.map(Boolean) : null);
    };
    try {
      sw.postMessage({ type: 'has-urls', urls }, [channel.port2]);
    } catch {
      window.clearTimeout(timer);
      resolve(null);
    }
  });
}

/** The stem URL the worker matches against any hash of the chunk. */
export function chunkStem(chunk: string, base: string, origin: string): string {
  return new URL(`${base}assets/${chunk}-`, origin).href;
}

function mark(entry: OfflineEntry, needsNet: boolean): void {
  const b = entry.button;
  const note = b.querySelector<HTMLElement>('.offline-need');
  if (!needsNet) {
    note?.remove();
    b.disabled = false;
    b.removeAttribute('title');
    return;
  }
  b.disabled = true;
  b.title = OFFLINE_ENTRY_TEXT.why;
  if (!note) {
    const n = document.createElement('span');
    n.className = 'offline-need';
    n.textContent = OFFLINE_ENTRY_TEXT.needs;
    b.appendChild(n);
  }
}

/** Re-check the entries whenever `menu` opens and whenever the connection changes. */
export function gateOfflineEntries(menu: HTMLElement, entries: OfflineEntry[]): void {
  if (entries.length === 0) return;
  let asked = 0;
  const check = (): void => {
    const ask = ++asked;
    if (navigator.onLine !== false) {
      for (const e of entries) mark(e, false);
      return;
    }
    const stems = entries.map((e) => chunkStem(e.chunk, import.meta.env.BASE_URL, location.origin));
    void swHas(stems).then((has) => {
      // A newer check (the connection came back) wins over a slow answer.
      if (ask !== asked) return;
      entries.forEach((e, i) => mark(e, has !== null && has[i] === false));
    });
  };
  try {
    new MutationObserver(() => {
      if (!menu.hidden) check();
    }).observe(menu, { attributes: true, attributeFilter: ['hidden'] });
    window.addEventListener('online', check);
    window.addEventListener('offline', check);
  } catch {
    // No observer: the entries simply stay as they are.
  }
  check();
}
