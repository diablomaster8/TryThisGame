/**
 * R0693 (KIDS-25): no text toasts over a child's activity. In the sprout band a notice that
 * arrives while a minigame, tracing, a story scene or the break card is open waits, and shows
 * (and is said, by the band toaster underneath) once the activity closes. Festival and price
 * notices are dropped in any Learning Grove: they sell, and a child cannot use them.
 */
import { UI_TEXT } from '../config/strings';
import type { Game } from '../game';

const FESTIVALS = new Set<string>(Object.values(UI_TEXT.festival));

/** Pure: what to do with a notice now. */
export function kidNoticeAction(
  text: string,
  edu: boolean,
  sprout: boolean,
  busy: boolean,
): 'show' | 'hold' | 'drop' {
  if (!edu) return 'show';
  if (FESTIVALS.has(text)) return 'drop';
  if (sprout && busy) return 'hold';
  return 'show';
}

/** Wrap a toaster; call `flush` each frame so held notices go out once the child is free. */
export function kidToaster(
  inner: (text: string, ms?: number) => void,
  game: () => Game | null,
  busy: () => boolean,
): { toast: (text: string, ms?: number) => void; flush: () => void } {
  const held: Array<[string, number | undefined]> = [];
  const state = () => {
    const w = game()?.world;
    return { edu: !!w?.edu, sprout: w?.edu?.band === 'sprout' };
  };
  const toast = (text: string, ms?: number) => {
    const s = state();
    const act = kidNoticeAction(text, s.edu, s.sprout, s.edu && busy());
    if (act === 'show') inner(text, ms);
    else if (act === 'hold' && held.length < 3 && !held.some(([t]) => t === text))
      held.push([text, ms]);
  };
  const flush = () => {
    if (held.length === 0 || busy()) return;
    const next = held.shift();
    if (next) inner(next[0], next[1]);
  };
  return { toast, flush };
}
