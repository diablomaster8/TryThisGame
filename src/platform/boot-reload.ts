/**
 * The one automatic reload when the game cannot boot because a chunk would not load.
 * Online, that almost always means a deploy replaced the build under an open (or cached)
 * page, which asks for hashed files that are gone; a reload picks up the new build. The
 * reload happens at most once a minute (the time is kept in sessionStorage), so a chunk
 * that really is broken, or a host that is down, ends on the boot card, never a loop.
 * Offline, or with session storage blocked (no way to stop a loop), it never reloads.
 */
const KEY = 'grove.bootReloadAt';
const WINDOW_MS = 60_000;

/** Reload now if that is safe; true when a reload has been asked for. */
export function reloadOnceForUpdate(): boolean {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return false;
  try {
    const last = Number(sessionStorage.getItem(KEY) ?? 0);
    const now = Date.now();
    if (now - last < WINDOW_MS) return false;
    sessionStorage.setItem(KEY, String(now));
  } catch {
    return false;
  }
  location.reload();
  return true;
}
