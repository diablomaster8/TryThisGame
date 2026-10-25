/**
 * The card for a boot that could not download a part of the game (the story scripts, the
 * Learning Grove band, the 3D scene): offline on a first visit, or a page left over from
 * an older deploy. It says which of the two it looks like and offers "Try again" (the
 * loaders forget a failed fetch, so a retry fetches afresh) and "Reload". Never a blank
 * screen. Shown once at a time; "Try again" takes it down before retrying.
 */
import { UI_TEXT } from '../config/strings';
import { button, el } from './dom';

let card: HTMLElement | null = null;

export function showBootError(err: unknown, retry: () => void): void {
  console.warn('Grove: a part of the game failed to load.', err);
  card?.remove();
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
  const box = el('div', 'update-notice boot-error');
  box.setAttribute('role', 'alert');
  box.appendChild(el('p', undefined, UI_TEXT.bootFailed[offline ? 'offline' : 'online']));
  const row = el('div', 'settings-actions');
  row.append(
    button(
      UI_TEXT.bootFailed.retry,
      () => {
        box.remove();
        card = null;
        retry();
      },
      'btn btn-primary',
    ),
    button(UI_TEXT.bootFailed.reload, () => location.reload()),
  );
  box.appendChild(row);
  document.body.appendChild(box);
  card = box;
}
