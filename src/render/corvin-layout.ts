import { CG_C } from '../config/tuning-c';

/**
 * Where Corvin's penned grey Nubbins stand (campaign graphics H15), in the order the pixel
 * and 3D views both draw them (`render/world-view.ts` drawAmbient, `render3d/crowd.ts`
 * ambient): thirty in three rows of ten, front row last. The number painted on each one is
 * its place in that order, so a Nubbin keeps its number in either view.
 */
export interface Penned {
  n: number;
  x: number;
  z: number;
  /** Which pen (0 = back row) it stands in. */
  pen: number;
}

export const PEN_Z0: readonly number[] = [-7.5, -4.5, -1.5];
export const PEN_DEPTH = 3;

export function pennedSpots(): Penned[] {
  const out: Penned[] = [];
  for (let i = 0; i < 30; i++)
    out.push({
      n: CG_C.corvin.numbers.first + i,
      x: -9 + (i % 10) * 2,
      z: -6 + Math.floor(i / 10) * 3,
      pen: Math.floor(i / 10),
    });
  return out;
}

/** The hinge of pen `p`'s gate leaf on its east wall: a hand in from the corner post. */
export function leafHinge(p: number): { x: number; z: number } {
  return { x: CG_C.corvin.leaf.x, z: (PEN_Z0[p] ?? 0) + 0.12 };
}
