/**
 * The grown-up gate: "work out a × b, type it, then hold Enter". The Learning Grove's
 * grown-up area opens behind it, and so do anything that raises Mature content (the
 * Settings radios and a save import that carries 13+ or 18+) and erasing or starting over
 * a Learning Grove slot on the title. A two-digit by one-digit product is beyond most 7–10
 * readers, a wrong answer brings new numbers (so guessing through one sum does not work),
 * and the held Enter stops a mashed key. It is still a gate, not a lock, which is all a
 * parental gate on a static site can be (review C, item 5).
 */
import { GROWN_UP_GATE } from '../config/tuning';
import { EDU_TEXT } from '../config/strings';
import { button, el, modal } from './dom';

/** A new product to ask; `rand` returns [0, 1). Pure, for the tests. */
export function gateProblem(rand: () => number): { a: number; b: number } {
  const pick = ([lo, hi]: readonly [number, number]) => lo + Math.floor(rand() * (hi - lo + 1));
  let a = pick(GROWN_UP_GATE.bigRange);
  // A multiple of ten is mental arithmetic for a reader; step past it.
  if (a % 10 === 0) a += 1;
  return { a, b: pick(GROWN_UP_GATE.smallRange) };
}

/** Whether what was typed is the product: digits only, exactly a × b. Pure, for the tests. */
export function gateAnswerOk(typed: string, a: number, b: number): boolean {
  const t = typed.trim();
  return /^\d+$/.test(t) && Number(t) === a * b;
}

/** Draw the gate into `container` (emptied first); `onPass` runs on the right answer. */
export function renderSumGate(
  container: HTMLElement,
  toast: (text: string) => void,
  onPass: () => void,
): void {
  let { a, b } = gateProblem(Math.random);
  container.innerHTML = '';
  container.appendChild(el('h3', undefined, EDU_TEXT.gateTitle));
  const help = el('p', 'help', EDU_TEXT.gateHelp(a, b));
  container.appendChild(help);
  // Said in the dialog too, where no toast row exists (the title screen). Also carries the
  // "keep holding" hint: a quick tap on Enter used to do nothing at all, which read as a refusal.
  const wrong = el('p', 'help edu-gate-wrong');
  wrong.setAttribute('aria-live', 'polite');
  const hint = (text: string) => {
    toast(text);
    wrong.textContent = text;
  };
  const row = el('div', 'settings-actions');
  const input = el('input');
  input.type = 'number';
  input.inputMode = 'numeric';
  input.className = 'edu-gate-input';
  input.setAttribute('aria-label', EDU_TEXT.gateTitle);
  const enter = button(EDU_TEXT.gateEnter, () => undefined, 'btn btn-primary edu-gate-hold');
  const fill = el('span', 'edu-gate-fill');
  enter.appendChild(fill);

  const check = () => {
    if (gateAnswerOk(input.value, a, b)) {
      onPass();
      return;
    }
    hint(EDU_TEXT.gateWrong);
    ({ a, b } = gateProblem(Math.random));
    help.textContent = EDU_TEXT.gateHelp(a, b);
    input.value = '';
    input.focus();
  };

  // Hold to confirm: pointer or keyboard, with a fill that shows the hold running.
  let timer = 0;
  const start = () => {
    if (timer) return;
    if (input.value.trim() === '') {
      hint(EDU_TEXT.gateTypeFirst);
      return;
    }
    enter.classList.add('holding');
    enter.setAttribute('aria-label', EDU_TEXT.gateHold);
    fill.style.transitionDuration = `${GROWN_UP_GATE.holdMs}ms`;
    timer = window.setTimeout(() => {
      timer = 0;
      cancel();
      check();
    }, GROWN_UP_GATE.holdMs);
  };
  const cancel = () => {
    if (timer) window.clearTimeout(timer);
    timer = 0;
    enter.classList.remove('holding');
    enter.removeAttribute('aria-label');
  };
  // Let go before the bar filled: say so, instead of silently doing nothing.
  const release = () => {
    if (!timer) return;
    cancel();
    hint(EDU_TEXT.gateTooShort);
  };
  enter.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    start();
  });
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel'] as const) {
    enter.addEventListener(ev, release);
  }
  enter.addEventListener('contextmenu', (e) => e.preventDefault());
  for (const target of [input, enter] as HTMLElement[]) {
    target.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && !(target === enter && e.key === ' ')) return;
      e.preventDefault();
      if (!e.repeat) start();
    });
    target.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.key === ' ') release();
    });
  }
  row.append(input, enter);
  container.append(row, wrong);
  setTimeout(() => input.focus(), 50);
}

/** Ask the gate in its own dialog. Resolves true on the right answer, false if closed. */
export function askGrownUp(parent: HTMLElement, toast: (text: string) => void): Promise<boolean> {
  return new Promise((resolve) => {
    const dialog = modal(parent, EDU_TEXT.gateTitle, EDU_TEXT.leave);
    // Above everything, the title screen included (it erases a Learning Grove slot there).
    dialog.root.classList.add('grown-up-modal');
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      dialog.hide();
      dialog.root.remove();
      resolve(ok);
    };
    // The modal's own close button and a tap on the backdrop count as a no.
    const observer = new MutationObserver(() => {
      if (dialog.root.hidden) finish(false);
    });
    renderSumGate(dialog.body, toast, () => finish(true));
    dialog.show();
    observer.observe(dialog.root, { attributes: true, attributeFilter: ['hidden'] });
  });
}
