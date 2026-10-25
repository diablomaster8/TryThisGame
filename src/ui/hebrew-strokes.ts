/**
 * Stroke guides for the Hebrew letters the course teaches (CV3), on the same 0-100 board as
 * the kana (x right, y down). Simple block print, the way a first alef-bet book shows it:
 * each letter begins on its right side or its top, and words run right to left. These are
 * guides for a finger, not font outlines; the letter itself shows underneath in Noto Sans
 * Hebrew. Stroke counts: א 3, ב 2, ג 2, ד 2, ה 2, ו 1, י 1, ל 1, מ 2, ם 2, ר 1, ש 3.
 */
import type { Pt } from './trace-check';

const P = (...xy: number[]): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i + 1 < xy.length; i += 2) out.push({ x: xy[i]!, y: xy[i + 1]! });
  return out;
};

export const HEBREW_STROKES: Readonly<Record<string, Pt[][]>> = {
  // Alef: the small right arm, the long slant, then the left foot.
  א: [P(76, 14, 74, 30, 66, 46), P(24, 14, 52, 50, 80, 86), P(40, 54, 34, 70, 26, 86)],
  // Bet: roof and right side, then the base, drawn right to left past the corner.
  ב: [P(22, 22, 48, 22, 72, 22, 72, 50, 72, 78), P(86, 78, 50, 78, 14, 78)],
  // Gimel: the body down from the top, then the foot out to the left.
  ג: [P(48, 14, 56, 40, 60, 62, 68, 86), P(60, 60, 48, 72, 36, 86)],
  // Dalet: the roof, then the leg down from just inside its right end.
  ד: [P(16, 22, 50, 22, 84, 22), P(72, 22, 72, 54, 72, 86)],
  // Hey: roof and right leg in one, then the short left leg that does not touch the roof.
  ה: [P(18, 22, 48, 22, 78, 22, 78, 54, 78, 86), P(28, 46, 28, 66, 28, 86)],
  // Vav: a small hook, then straight down.
  ו: [P(42, 18, 56, 20, 58, 40, 58, 64, 58, 86)],
  // Yod: the smallest letter, a hook that hangs from the top line.
  י: [P(40, 22, 56, 24, 56, 38, 52, 50)],
  // Lamed: the tall mast, across, then down and in.
  ל: [P(26, 8, 26, 24, 26, 40, 50, 40, 76, 40, 74, 56, 64, 72, 52, 86)],
  // Mem: the left post with its little spur, then roof, right side and an open base.
  מ: [P(16, 26, 30, 20, 34, 50, 30, 86), P(34, 20, 58, 20, 78, 22, 80, 54, 80, 86, 62, 86, 46, 86)],
  // Final mem: roof, right side and base, then the left side closes the box.
  ם: [P(20, 20, 50, 20, 80, 20, 80, 52, 80, 84, 50, 84, 20, 84), P(20, 20, 20, 52, 20, 84)],
  // Resh: across, round the corner, down. No foot (that would be dalet).
  ר: [P(16, 22, 46, 22, 70, 22, 80, 34, 80, 60, 80, 86)],
  // Shin: the right arm first, curving into the base, then the middle arm, then the left.
  ש: [
    P(82, 14, 82, 40, 78, 64, 66, 84),
    P(52, 16, 54, 38, 58, 60),
    P(18, 16, 24, 48, 34, 76, 50, 84, 66, 84),
  ],
};
