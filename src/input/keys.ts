/**
 * Which key presses belong to the game. A key typed into a field (a name, a sum gate, a
 * share code) or pressed with Ctrl, Alt or Cmd is the player's or the browser's, never a
 * camera turn or a shortcut; and Space or Enter on a focused button presses that button.
 */

/** A text field, select or editable element has the key. */
export function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

/** A focused control that Space and Enter activate by themselves. */
export function isControlTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    isTypingTarget(target) ||
    target instanceof HTMLButtonElement ||
    target instanceof HTMLAnchorElement ||
    target.getAttribute('role') === 'button'
  );
}

/** A plain key meant for the game: not typed into a field, not a browser shortcut. */
export function isGameKey(e: KeyboardEvent): boolean {
  return !isTypingTarget(e.target) && !e.metaKey && !e.ctrlKey && !e.altKey;
}

/**
 * TECH-72: the care keys on the focused canvas once Tab has picked a Nubbin. Arrows (and WASD)
 * still walk the Keeper, and a held Nubbin walks with them.
 */
export type CareKey = 'pet' | 'feed' | 'lift';

export function careKey(e: KeyboardEvent): CareKey | null {
  if (!isGameKey(e) || e.repeat) return null;
  if (e.key === 'p' || e.key === 'P') return 'pet';
  if (e.key === 'f' || e.key === 'F') return 'feed';
  if (e.key === ' ') return 'lift';
  return null;
}
