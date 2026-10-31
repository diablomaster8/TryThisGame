/**
 * The "Reload to update" notice. A lazy chunk that fails to load almost always means a
 * new build replaced the old one on the host, so the old page asks for files that are
 * gone; reloading picks up the new build. Shown once, above everything, instead of
 * leaving a blank screen or a loading line that never ends.
 */
import { UI_TEXT } from '../config/strings';
import { OFFLINE_CHUNK_TEXT } from '../config/strings-r9d3';
import { button, el } from './dom';

let shown = false;

export function showUpdateNotice(err?: unknown): void {
  if (err !== undefined) console.warn('Grove: a part of the game failed to load.', err);
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    showOfflineChunkCard();
    return;
  }
  if (shown) return;
  shown = true;
  const box = el('div', 'update-notice');
  box.setAttribute('role', 'alert');
  box.append(
    el('p', undefined, UI_TEXT.updateNotice),
    button(UI_TEXT.updateReload, () => location.reload()),
  );
  document.body.appendChild(box);
}

let offlineCard: HTMLElement | null = null;

/**
 * TECH-58: offline, a lazy part that was never cached (a story world, a minigame) is not a
 * new build, so reloading would not help. Say it needs the internet once and stay in the
 * Grove; the loaders keep nothing, so the next open online fetches it.
 */
function showOfflineChunkCard(): void {
  if (offlineCard?.isConnected) return;
  const box = el('div', 'update-notice offline-chunk');
  box.setAttribute('role', 'alert');
  const keep = button(
    OFFLINE_CHUNK_TEXT.keep,
    () => {
      box.remove();
      offlineCard = null;
    },
    'btn btn-primary',
  );
  box.append(el('p', undefined, OFFLINE_CHUNK_TEXT.body), keep);
  document.body.appendChild(box);
  offlineCard = box;
  keep.focus();
}
