import { SLIDE_FX } from '../config/tuning-r16d1';
import { isSoundEnabled, sfxOut } from './audio';
import { renderRecipe } from './edu-synth';

/** R0118: a soft swish when a snow slide starts. Silent until sound is unlocked and on. */
export function playSlideSwish(): void {
  if (!isSoundEnabled()) return;
  const out = sfxOut();
  if (!out) return;
  try {
    const { band, dur, gain } = SLIDE_FX.swish;
    renderRecipe(out, [{ t: 0, dur, kind: 'noise', band, gain }]);
  } catch {
    // Audio problems must never break the game.
  }
}
