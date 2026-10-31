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
  /** TECH-29: the yes button must be held this long (pointer or key), never just clicked. */
  holdMs?: number;
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
    if (opts.holdMs) holdToConfirm(yes, opts.holdMs, () => answer(true));
    row.append(yes, no);
    m.body.appendChild(row);
    m.show();
    no.focus();
  });
}

/**
 * TECH-29: turn a button into press-and-hold. A click alone does nothing; holding the
 * pointer or Enter/Space for `ms` fills the button and then answers. Letting go early, or
 * sliding off, starts over.
 */
function holdToConfirm(b: HTMLButtonElement, ms: number, done: () => void): void {
  let timer = 0;
  b.classList.add('btn-hold');
  b.style.setProperty('--hold-ms', `${ms}ms`);
  const start = (): void => {
    if (timer) return;
    b.classList.add('holding');
    timer = window.setTimeout(() => {
      timer = 0;
      done();
    }, ms);
  };
  const stop = (): void => {
    window.clearTimeout(timer);
    timer = 0;
    b.classList.remove('holding');
  };
  // The click from the shared button() would answer at once; a capturing listener stops it.
  b.addEventListener('click', (e) => e.stopImmediatePropagation(), { capture: true });
  b.addEventListener('pointerdown', (e) => {
    b.setPointerCapture?.(e.pointerId);
    start();
  });
  for (const t of ['pointerup', 'pointercancel', 'lostpointercapture'] as const)
    b.addEventListener(t, stop);
  b.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    if (!e.repeat) start();
  });
  b.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === ' ') stop();
  });
  b.addEventListener('contextmenu', (e) => e.preventDefault());
}
