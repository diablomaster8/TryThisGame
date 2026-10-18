/**
 * The "Reload to update" notice. A lazy chunk that fails to load almost always means a
 * new build replaced the old one on the host, so the old page asks for files that are
 * gone; reloading picks up the new build. Shown once, above everything, instead of
 * leaving a blank screen or a loading line that never ends.
 */
import { UI_TEXT } from '../config/strings';
import { button, el } from './dom';

let shown = false;

export function showUpdateNotice(err?: unknown): void {
  if (err !== undefined) console.warn('Grove: a part of the game failed to load.', err);
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
