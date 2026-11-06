/**
 * LOOK-59 (R0427): the kid-safe rainbow dye. It cycles through a ring of palette colours at
 * 0.05 Hz (one lap every 20 s) in both renderers, so a dyed wing tip, crown tip, hat or scarf
 * drifts slowly from rose through the spectrum and back. Under reduced motion it stops on a
 * fixed step, and since every step pairs its main colour with a second ring colour, the still
 * dye is multi-colour too. Both renderers read the same ring, so they match.
 */
import { C, shadeOf } from './palette';
import { reducedMotion } from '../../platform/motion';

/** Cycle speed in laps per second (0.05 Hz = 20 s a lap). */
export const RAINBOW_HZ = 0.05;
/** The ring, in order: a lap visits each colour for a twentieth of a minute and a bit. */
export const RAINBOW_RING: readonly number[] = [
  C.rose,
  C.orange,
  C.sunYellow,
  C.mint,
  C.teal,
  C.water,
  C.violet,
  C.blush,
];
const SHADE_OFFSET = 3;

/** Which ring step is showing at `nowMs`; always step 0 when motion is reduced. */
export function rainbowStep(nowMs: number = Date.now(), still: boolean = reducedMotion()): number {
  if (still) return 0;
  const n = RAINBOW_RING.length;
  return Math.floor((nowMs / 1000) * RAINBOW_HZ * n) % n;
}

/** The token a render key carries for a dye: `rainbow.<step>` for the rainbow, else the dye. */
export function dyeToken(dye: string | null | undefined, step: number): string | null {
  if (!dye) return null;
  return dye === 'rainbow' ? `rainbow.${step}` : dye;
}

/**
 * A dye's main colour and its second colour, as palette indexes. `plain` gives a flat dye's
 * colour and its shade; a rainbow token (or `rainbow` with `step`) gives two ring colours.
 */
export function dyePair(
  dye: string,
  plain: (d: string) => number | undefined,
  step = 0,
): [number, number] {
  if (dye === 'rainbow' || dye.startsWith('rainbow.')) {
    const at = dye.startsWith('rainbow.') ? Number(dye.slice(8)) : step;
    const n = RAINBOW_RING.length;
    const i = ((Number.isFinite(at) ? at : 0) % n + n) % n;
    return [RAINBOW_RING[i]!, RAINBOW_RING[(i + SHADE_OFFSET) % n]!];
  }
  const m = plain(dye) ?? C.rose;
  return [m, shadeOf(m)];
}
