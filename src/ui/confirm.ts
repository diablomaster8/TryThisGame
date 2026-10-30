import { CAMP_TEXT } from '../config/strings';
import { button, el, modal } from './dom';

/**
 * Lane C round 7 (R0647): the game's own yes-or-no card in place of the browser's
 * `confirm()`, which breaks the look and reads as a system alert on an installed iPhone.
 * The destructive button sits on the left, says what it does and is marked by a ⚠ as well
 * as its colour; Escape, the backdrop and the close button all answer no. Focus moves to the
 * safe answer first, and the shared dialog focus handling keeps Tab inside the card.
 */
export interface ConfirmOptions {
  title: string;
  body: string;
  confirm: string;
  cancel?: string;
  danger?: boolean;
}

export function confirmModal(
  opts: ConfirmOptions,
  parent: HTMLElement = document.body,
): Promise<boolean> {
  return new Promise((resolve) => {
    const m = modal(parent, opts.title, CAMP_TEXT.confirmClose);
    m.root.classList.add('confirm-modal');
    m.root.setAttribute('role', 'alertdialog');
    let answered = false;
    const answer = (ok: boolean): void => {
      if (answered) return;
      answered = true;
      m.hide();
      m.root.remove();
      resolve(ok);
    };
    // The modal's own close (button, backdrop, Escape) hides it: that is a no.
    new MutationObserver((_, obs) => {
      if (!m.root.hidden) return;
      obs.disconnect();
      answer(false);
    }).observe(m.root, { attributes: true, attributeFilter: ['hidden'] });
    m.body.appendChild(el('p', undefined, opts.body));
    const row = el('div', 'confirm-row');
    const yes = button(
      opts.danger ? `⚠ ${opts.confirm}` : opts.confirm,
      () => answer(true),
      opts.danger ? 'btn btn-danger' : 'btn btn-primary',
    );
    const no = button(opts.cancel ?? CAMP_TEXT.confirmCancel, () => answer(false), 'btn');
    row.append(yes, no);
    m.body.appendChild(row);
    m.show();
    no.focus();
  });
}
