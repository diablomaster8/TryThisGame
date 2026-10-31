/**
 * Lane E r10, R0679 (KIDS-11): the sprout HUD's grown-ups corner. A small tab on the screen's
 * edge, shown only in the sprout band (`body.edu-sprout`), that opens the grown-up area (which
 * asks its sum first) only after it is held down for a moment, so a child brushing it opens
 * nothing. A quick tap just says "hold" on the tab. Keyboard users (a grown-up at a desk) open
 * it with Enter or Space. The hold timing is pure so the tests can drive it without a DOM.
 */
import '../kids-r10.css';
import { KIDS_R10_TEXT } from '../config/strings-kids-r10';
import { KIDS_R10_TUNING } from '../config/tuning-kids-r10';
import { el } from './dom';

/** Pure: a press that started at `downMs` has been held long enough at `nowMs`. */
export function holdDone(downMs: number | null, nowMs: number, holdMs: number): boolean {
  return downMs !== null && nowMs - downMs >= holdMs;
}

export function grownUpCorner(parent: HTMLElement, open: () => void): HTMLButtonElement {
  const tab = el('button', 'kids-corner');
  tab.type = 'button';
  tab.textContent = '🧑‍🏫';
  tab.setAttribute('aria-label', KIDS_R10_TEXT.cornerLabel);
  tab.title = KIDS_R10_TEXT.cornerHint;
  const holdMs = KIDS_R10_TUNING.grownUpHoldMs;
  tab.style.setProperty('--hold', `${holdMs}ms`);
  let downAt: number | null = null;
  let timer = 0;
  const reset = (): void => {
    downAt = null;
    window.clearTimeout(timer);
    tab.classList.remove('kids-corner-holding');
  };
  tab.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    downAt = performance.now();
    tab.classList.add('kids-corner-holding');
    try {
      tab.setPointerCapture(e.pointerId);
    } catch {
      // Capture is a nicety; the hold still times out below.
    }
    timer = window.setTimeout(() => {
      if (!holdDone(downAt, performance.now(), holdMs)) return;
      reset();
      open();
    }, holdMs);
  });
  for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture'] as const)
    tab.addEventListener(ev, () => {
      if (downAt !== null) {
        // Let go too soon: say how it opens, nothing else.
        tab.classList.add('kids-corner-said');
        window.setTimeout(() => tab.classList.remove('kids-corner-said'), 1600);
      }
      reset();
    });
  tab.addEventListener('contextmenu', (e) => e.preventDefault());
  // A click with no pointer behind it (`detail` 0) is the keyboard's Enter or Space.
  tab.addEventListener('click', (e) => {
    if (e.detail === 0) open();
  });
  tab.dataset.hint = KIDS_R10_TEXT.cornerHold;
  parent.appendChild(tab);
  return tab;
}
