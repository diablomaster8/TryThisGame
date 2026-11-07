import { EDU_PATTERN_TEXT, EDU_PATTERNS_KEY } from '../config/edu-things';
import { button } from './dom';

/** R0732: whether colours show their pattern (default on). Blocked storage reads as on. */
export function patternsOn(): boolean {
  try {
    return localStorage.getItem(EDU_PATTERNS_KEY) !== 'off';
  } catch {
    return true;
  }
}

function setPatterns(on: boolean): void {
  try {
    localStorage.setItem(EDU_PATTERNS_KEY, on ? 'on' : 'off');
  } catch {
    // Blocked storage: the choice lasts until the round ends, which is harmless.
  }
}

/** The pattern class for a swatch plate; the `edu-nopat` class on the card hides it again. */
export function patternClass(id: string | undefined): string {
  return ` edu-pat-${id ?? 'chequer'}`;
}

/**
 * A 44px toggle for "Show patterns on colours". It flips the setting and the options already
 * on screen (`root`), with no new round.
 */
export function patternToggle(root: HTMLElement): HTMLElement {
  const b = button(
    '',
    () => {
      setPatterns(!patternsOn());
      root.classList.toggle('edu-nopat', !patternsOn());
      sync();
    },
    'btn btn-small edu-pat-toggle',
  );
  const sync = (): void => {
    const on = patternsOn();
    b.textContent = on ? EDU_PATTERN_TEXT.on : EDU_PATTERN_TEXT.off;
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', EDU_PATTERN_TEXT.label);
  };
  root.classList.toggle('edu-nopat', !patternsOn());
  sync();
  return b;
}
