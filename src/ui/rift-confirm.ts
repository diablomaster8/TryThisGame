/**
 * The one-time age confirmation shown before the Multiverse rift first opens. Confirming
 * turns Mature content to 18+ and is remembered; "Not now" leaves the rift closed and
 * the setting alone. Nothing opens the rift yet (the Multiverse lands with its own
 * milestone), so callers are added there: `if (await askRift(parent, game)) openRift()`.
 */
import { UI_TEXT } from '../config/strings';
import type { Game } from '../game';
import { riftNeedsConfirmation } from '../sim/audience';
import { button, el, modal } from './dom';

/** Resolves true when the rift may open: already confirmed, or confirmed just now. */
export function askRift(parent: HTMLElement, game: Game): Promise<boolean> {
  if (!riftNeedsConfirmation(game.world.settings)) return Promise.resolve(true);
  return new Promise((resolve) => {
    const dialog = modal(parent, UI_TEXT.riftTitle, UI_TEXT.riftCancel);
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      dialog.root.remove();
      resolve(ok);
    };
    dialog.body.appendChild(el('p', undefined, UI_TEXT.riftText));
    const actions = el('div', 'settings-actions');
    actions.append(
      button(UI_TEXT.riftConfirm, () => {
        game.send({ kind: 'confirmRift' });
        finish(true);
      }),
      button(UI_TEXT.riftCancel, () => finish(false), 'btn'),
    );
    dialog.body.appendChild(actions);
    // The modal's own close button and a tap on the backdrop count as "Not now".
    const observer = new MutationObserver(() => {
      if (dialog.root.hidden) finish(false);
    });
    observer.observe(dialog.root, { attributes: true, attributeFilter: ['hidden'] });
    dialog.show();
  });
}
