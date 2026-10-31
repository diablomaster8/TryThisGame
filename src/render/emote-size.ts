/**
 * R0549 (SOUL-31): how big to draw an emote ball, shared by both renderers. At the far zoom
 * (or with Settings → Big mood bubbles, on by default in the Learning Grove) balls are 1.5×,
 * so a phone can read them; a fresh reaction bubble pops to 2× and settles over 300 ms
 * (not under reduced motion).
 */
import { EMOTE_READ } from '../config/tuning';
import type { World } from '../sim/types';

/** Big mood bubbles: the setting, else on in the Learning Grove. */
export function bigBubbles(world: World): boolean {
  return world.settings.bigBubbles ?? !!world.edu;
}

export function emoteScale(big: boolean, bubbleAgeMs: number | null, calm: boolean): number {
  const base = big ? EMOTE_READ.big : 1;
  if (calm || bubbleAgeMs === null || bubbleAgeMs < 0 || bubbleAgeMs >= EMOTE_READ.popMs)
    return base;
  const settle = bubbleAgeMs / EMOTE_READ.popMs;
  return base * (EMOTE_READ.pop - (EMOTE_READ.pop - 1) * settle);
}

/**
 * R0549 (lane A r9): the Nubbin whose stats sheet is open has its bubble drawn big too, so
 * its mood reads beside the sheet. Set by the game each frame; render-only.
 */
let focusId: string | null = null;

export function setEmoteFocus(id: string | null): void {
  focusId = id;
}

export function emoteFocused(id: string): boolean {
  return focusId === id;
}
