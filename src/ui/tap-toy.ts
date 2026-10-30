/**
 * R0322 (FUN-33): tapping a Nubbin is a funny-noise toy. In the sprout band, or when the
 * Nubbin was already selected, each tap within 1.5 s of the last squeaks two semitones
 * higher; the fifth gives three hiccups and the eighth a sneeze with a spinning crown (the
 * sim shows a surprised, then a dizzy face; no stats change). Sounds only after the first
 * tap has unlocked audio, as always.
 */
import { TAP_TOY } from '../config/tuning';
import type { Game } from '../game';
import { playSound, playSqueakStep } from '../platform/audio';
import { toastBand } from './fun-toasts';

const run = { id: '', taps: 0, at: -Infinity };

/** A tap selected Nubbin `id`; `wasSelected` is the sheet's Nubbin before the tap. */
export function tapToy(g: Game, id: string, wasSelected: string | null, nowMs: number): number {
  const sprout = toastBand(g.world) === 'sprout';
  if (!sprout && wasSelected !== id) {
    run.id = '';
    return 0;
  }
  if (run.id !== id || nowMs - run.at > TAP_TOY.gapMs) run.taps = 0;
  run.id = id;
  run.at = nowMs;
  run.taps += 1;
  const taps = run.taps;
  playSqueakStep((taps - 1) * TAP_TOY.semitones);
  if (taps === TAP_TOY.hiccupAt) {
    for (let i = 0; i < 3; i++) window.setTimeout(() => playSound('hiccup'), 220 + i * 260);
    g.send({ kind: 'tapToy', nubbinId: id, beat: 'hiccup' });
  } else if (taps >= TAP_TOY.sneezeAt) {
    window.setTimeout(() => playSound('sneeze'), 200);
    g.send({ kind: 'tapToy', nubbinId: id, beat: 'sneeze' });
    run.taps = 0;
  }
  return taps;
}
