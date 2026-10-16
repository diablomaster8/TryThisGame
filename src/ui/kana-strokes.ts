/**
 * Stroke guides for the kana the courses trace (CV3), in school stroke order, on a 0-100
 * board (x right, y down). Drawn by hand from the standard order as guides for a finger,
 * not as font outlines: the glyph itself shows underneath in Klee One. Stroke counts:
 * か 3, き 4, く 1, け 3, こ 2, は 3, な 4.
 */
import type { Pt } from './trace-check';

const P = (...xy: number[]): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i + 1 < xy.length; i += 2) out.push({ x: xy[i]!, y: xy[i + 1]! });
  return out;
};

export const KANA_STROKES: Readonly<Record<string, Pt[][]>> = {
  か: [
    P(18, 40, 40, 37, 62, 34, 66, 46, 62, 66, 56, 80, 48, 74),
    P(44, 16, 40, 40, 33, 56, 25, 70),
    P(72, 34, 80, 46, 88, 60),
  ],
  き: [
    P(26, 28, 48, 26, 72, 22),
    P(24, 46, 50, 44, 76, 40),
    P(40, 10, 50, 34, 60, 54, 68, 66),
    P(42, 64, 32, 72, 40, 82, 56, 84, 72, 86),
  ],
  く: [P(64, 12, 46, 32, 32, 50, 46, 68, 64, 88)],
  け: [
    P(30, 18, 28, 40, 29, 62, 33, 80),
    P(46, 40, 66, 39, 86, 38),
    P(68, 14, 70, 40, 68, 66, 60, 82, 52, 90),
  ],
  こ: [P(28, 30, 48, 29, 70, 28, 64, 38), P(26, 66, 34, 76, 52, 78, 76, 74)],
  は: [
    P(22, 16, 20, 40, 20, 62, 26, 84),
    P(44, 38, 64, 37, 84, 36),
    P(64, 14, 64, 42, 64, 70, 56, 82, 46, 78, 54, 68, 70, 72, 86, 84),
  ],
  な: [
    P(18, 30, 36, 28, 52, 26),
    P(38, 12, 34, 34, 26, 58),
    P(64, 30, 72, 36, 80, 44),
    P(60, 44, 60, 60, 60, 74, 52, 84, 44, 78, 54, 70, 68, 74, 80, 82),
  ],
};
