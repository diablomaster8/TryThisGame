import { JUMP_TOYS } from '../config/tuning-move';
import { AtlasBuilder, type SpriteSheet } from './sprites/atlas';
import { C } from './sprites/palette';
import { PixelCanvas } from './sprites/pixel-canvas';

/**
 * MOVE-57: the jump toys' pixel look (the spring mushroom and the hay bale), kept in a small
 * sheet of their own so the shared props sheet is untouched, plus the mushroom's squash,
 * which both renderers read. The squash runs on the page clock from the moment a renderer
 * first sees a new bounce, so it stays smooth between the sim's 10 Hz steps.
 */

const CELL = 32;
let sheet: SpriteSheet | null = null;

/** The toys' sheet, painted on first use. */
export function jumpToySheet(): SpriteSheet {
  if (sheet) return sheet;
  const atlas = new AtlasBuilder(CELL, CELL, 2);
  const shroom = new PixelCanvas(CELL, CELL);
  // A squat white stem under a wide red cap with cream spots: a mushroom that boings.
  shroom.rect(12, 18, 8, 12, C.cream);
  shroom.rect(12, 18, 2, 12, C.white);
  shroom.ellipse(16, 15, 13, 8, C.berry);
  shroom.ellipse(16, 13, 11, 5, C.rose);
  shroom.disc(9, 13, 2, C.cream);
  shroom.disc(18, 10, 2, C.cream);
  shroom.disc(23, 15, 2, C.cream);
  shroom.px(14, 25, C.ink);
  shroom.px(17, 25, C.ink);
  shroom.finish(C.ink, [C.cream, C.white]);
  atlas.add('springShroom', shroom);
  const hay = new PixelCanvas(CELL, CELL);
  // A straw block with two twine bands, lit from the top.
  hay.rect(3, 12, 26, 18, C.sunDeep);
  hay.rect(3, 12, 26, 4, C.sunYellow);
  for (let x = 5; x < 28; x += 3) hay.px(x, 20 + (x % 2), C.sandDeep);
  hay.rect(9, 12, 2, 18, C.bark);
  hay.rect(21, 12, 2, 18, C.bark);
  hay.finish(C.ink, [C.sunYellow]);
  atlas.add('hayBale', hay);
  sheet = atlas.build();
  return sheet;
}

/** World size of each toy's sprite (width and height; the cell is square). */
export const JUMP_TOY_SIZE = { springShroom: 1.0, hayBale: 1.15 } as const;

// Per mushroom: the sim time of the last bounce seen, and the page time it was first seen.
const seen = new Map<string, { sim: number; page: number }>();

/**
 * How squashed a mushroom is now, 0..1: 1 just as someone lands, easing back to 0 over
 * `JUMP_TOYS.squashMs`. `bouncedAt` is the sim's `springBouncedAt`; 0 under reduced motion.
 */
export function shroomSquash(
  id: string,
  bouncedAt: number,
  pageMs: number,
  still: boolean,
): number {
  if (still || bouncedAt === -Infinity) return 0;
  let s = seen.get(id);
  if (!s || s.sim !== bouncedAt) {
    s = { sim: bouncedAt, page: pageMs };
    seen.set(id, s);
  }
  const t = (pageMs - s.page) / JUMP_TOYS.squashMs;
  return t >= 1 ? 0 : 1 - t;
}
