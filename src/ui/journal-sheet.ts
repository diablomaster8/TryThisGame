import { JOURNAL } from '../config/tuning-journal';

/**
 * Lane C round 9 (agent J): the journal as a phone sheet and as a keyboard tablist.
 * - R0660: a swipe down on the sheet's title closes it. The card follows the finger unless
 *   reduced motion is on (system or in-game), when it simply closes past the threshold.
 * - R0662: arrow keys, Home and End move between the journal's tabs (roving tabindex).
 */

function reducedMotion(): boolean {
  return (
    document.documentElement.classList.contains('reduce-motion') ||
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

/** Swipe down on the modal's heading to close it. */
export function phoneSheet(root: HTMLElement, close: () => void): void {
  const card = root.querySelector<HTMLElement>('.modal-card');
  const head = card?.querySelector<HTMLElement>('h2');
  if (!card || !head) return;
  head.classList.add('sheet-grip');
  let start: { id: number; y: number } | null = null;
  const reset = (): void => {
    start = null;
    card.style.transform = '';
  };
  head.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' || card.scrollTop > 0) return;
    start = { id: e.pointerId, y: e.clientY };
    try {
      head.setPointerCapture(e.pointerId);
    } catch {
      // Capture is a nicety; the swipe still works without it.
    }
  });
  head.addEventListener('pointermove', (e) => {
    if (!start || e.pointerId !== start.id) return;
    const dy = Math.max(0, e.clientY - start.y);
    if (!reducedMotion()) card.style.transform = `translateY(${dy}px)`;
  });
  const end = (e: PointerEvent): void => {
    if (!start || e.pointerId !== start.id) return;
    const dy = e.clientY - start.y;
    reset();
    if (e.type === 'pointerup' && dy >= JOURNAL.swipeClosePx) close();
  };
  head.addEventListener('pointerup', end);
  head.addEventListener('pointercancel', end);
}

/** Roving focus over a tablist's tabs: arrows move and open, Home and End jump. */
export function tabKeys(list: HTMLElement): void {
  list.addEventListener('keydown', (e) => {
    const tabs = [...list.querySelectorAll<HTMLElement>('[role="tab"]')];
    const at = tabs.indexOf(document.activeElement as HTMLElement);
    if (at < 0) return;
    const to =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? (at + 1) % tabs.length
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? (at - 1 + tabs.length) % tabs.length
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? tabs.length - 1
              : -1;
    if (to < 0) return;
    e.preventDefault();
    e.stopPropagation();
    tabs[to]!.click();
  });
}
