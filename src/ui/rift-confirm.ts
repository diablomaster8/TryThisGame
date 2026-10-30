/**
 * The one-time age confirmation shown before the Multiverse rift first opens. Confirming
 * turns Mature content to 18+ and is remembered; "Not now" leaves the rift closed and
 * the setting alone. The rift's shelf (hud.ts) asks this before it opens.
 */
import { UI_TEXT } from '../config/strings';
import type { Game } from '../game';
import { riftNeedsConfirmation } from '../sim/audience';
import { button, el, modal } from './dom';
import { lastAdultEntry, noteAdultEntry, recheckDue } from '../platform/mature-recheck';

/** Resolves true when the rift may open: already confirmed, or confirmed just now. */
export function askRift(parent: HTMLElement, game: Game): Promise<boolean> {
  // TECH-75: a confirmed rift asks again after a long spell without an 18+ entry.
  const again = recheckDue(lastAdultEntry(), Date.now());
  if (!riftNeedsConfirmation(game.world.settings) && !again) {
    noteAdultEntry();
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    const dialog = modal(parent, UI_TEXT.riftTitle, UI_TEXT.riftCancel);
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      dialog.hide();
      dialog.root.remove();
      resolve(ok);
    };
    dialog.body.appendChild(el('p', undefined, UI_TEXT.riftText));
    const actions = el('div', 'settings-actions');
    actions.append(
      button(UI_TEXT.riftConfirm, () => {
        game.send({ kind: 'confirmRift' });
        noteAdultEntry();
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
