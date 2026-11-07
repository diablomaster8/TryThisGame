/**
 * R0497 (TECH-56): "Storage used: 312 kB of about 5 MB" in Settings > Saves. The first number
 * is every Grove key on this device (key and value, counted as the browser does, two bytes a
 * character); the second is the usual 5 MB of localStorage. `navigator.storage.estimate()` is not
 * used for it: that quota is the origin's disk share (gigabytes), not what localStorage may hold. Storage that is blocked just shows nothing.
 */
import { el } from './dom';

const FALLBACK_BYTES = 5 * 1024 * 1024;

/** Bytes the Grove keys take in localStorage; null when storage cannot be read. */
export function groveStorageBytes(): number | null {
  try {
    let chars = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key === null || !key.startsWith('grove')) continue;
      chars += key.length + (localStorage.getItem(key)?.length ?? 0);
    }
    return chars * 2;
  } catch {
    return null;
  }
}

export function storageLine(usedBytes: number, quotaBytes: number): string {
  const kb = Math.max(1, Math.round(usedBytes / 1024));
  const quota =
    quotaBytes >= 1024 * 1024
      ? `${Math.round(quotaBytes / 1048576)} MB`
      : `${Math.round(quotaBytes / 1024)} kB`;
  return `Storage used: ${kb} kB of about ${quota}`;
}

/** The row, filled in now and again when the browser's estimate arrives. */
export function mountStorageUsed(parent: HTMLElement): () => void {
  const row = el('p', 'help');
  parent.appendChild(row);
  const refresh = (): void => {
    const used = groveStorageBytes();
    if (used === null) {
      row.hidden = true;
      return;
    }
    row.hidden = false;
    row.textContent = storageLine(used, FALLBACK_BYTES);
  };
  refresh();
  return refresh;
}
