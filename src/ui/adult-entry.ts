/**
 * R0517 (TECH-75): before an 18+ fun quest scene (It's Always Sunny) plays after a long
 * spell without any 18+ entry, ask the grown-up question again, as the Multiverse rift
 * does (rift-confirm.ts). The Mature content setting stays as it is; "Not now" only holds
 * the scene back for a while.
 */
import { ADULT_SCENE_TEXT } from '../config/strings-r8d';
import { button, el, modal } from './dom';

/** Resolves true on "I am 18 or older", false on "Not now", the close button or the backdrop. */
export function askAdultScene(parent: HTMLElement): Promise<boolean> {
  return new Promise((resolve) => {
    const dialog = modal(parent, ADULT_SCENE_TEXT.title, ADULT_SCENE_TEXT.cancel);
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      dialog.hide();
      dialog.root.remove();
      resolve(ok);
    };
    dialog.body.appendChild(el('p', undefined, ADULT_SCENE_TEXT.text));
    const actions = el('div', 'settings-actions');
    actions.append(
      button(ADULT_SCENE_TEXT.confirm, () => finish(true)),
      button(ADULT_SCENE_TEXT.cancel, () => finish(false), 'btn'),
    );
    dialog.body.appendChild(actions);
    const observer = new MutationObserver(() => {
      if (dialog.root.hidden) finish(false);
    });
    observer.observe(dialog.root, { attributes: true, attributeFilter: ['hidden'] });
    dialog.show();
  });
}
