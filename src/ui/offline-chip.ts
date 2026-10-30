import { OFFLINE_TEXT } from '../config/strings-tech';

/**
 * TECH-80: a passing line when the game boots offline or the connection drops, so a story
 * world that fails to load is not a surprise; the Grove itself always saves locally. Shown
 * through the HUD's toaster for 4 s.
 */
export function watchOnline(toast: (text: string, ms?: number) => void): void {
  const SHOW_MS = 4000;
  try {
    if (navigator.onLine === false) toast(OFFLINE_TEXT.chip, SHOW_MS);
    window.addEventListener('offline', () => toast(OFFLINE_TEXT.chip, SHOW_MS));
    window.addEventListener('online', () => toast(OFFLINE_TEXT.back, 2000));
  } catch {
    // No connection API: nothing to say.
  }
}
