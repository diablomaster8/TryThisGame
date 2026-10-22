import { C, color } from '../render/sprites/palette';
import { CG2_U } from '../config/tuning-u';

/**
 * The story items as pixel art (M9), on the shared palette. Each is drawn on a small grid
 * with outlines and a highlight, and the card scales it up 3x with nearest-neighbour. The
 * Full 3D view draws its own from the prop kit and falls back to these.
 */
const G = CG2_U.card.grid;

type Draw = (px: (x: number, y: number, w: number, h: number, c: number) => void) => void;

const ART: Record<string, Draw> = {
  letter: (px) => {
    // A folded cream letter with a red seal and a flat stone's shadow.
    px(2, 5, 16, 11, C.darkPlum);
    px(3, 6, 14, 9, C.cream);
    px(3, 6, 14, 1, C.white);
    // Fold lines: a V from the corners.
    for (let i = 0; i < 6; i++) {
      px(3 + i, 6 + i, 1, 1, C.sandDeep);
      px(16 - i, 6 + i, 1, 1, C.sandDeep);
    }
    px(9, 11, 2, 1, C.sandDeep);
    px(8, 10, 4, 4, C.berry);
    px(9, 11, 2, 2, C.rose);
    px(3, 15, 14, 1, C.sandLight);
  },
  notebook: (px) => {
    // A green cloth notebook with a cream page block, a ribbon and a band.
    px(4, 2, 12, 16, C.darkPlum);
    px(5, 3, 10, 14, C.forest);
    px(5, 3, 1, 14, C.deepGreen);
    px(6, 3, 8, 1, C.leaf);
    px(7, 6, 6, 5, C.cream);
    px(8, 7, 4, 1, C.sandDeep);
    px(8, 9, 3, 1, C.sandDeep);
    px(13, 3, 1, 15, C.sunYellow);
    px(15, 12, 1, 6, C.berry);
  },
  'vane-notebook': (px) => {
    // An older, scuffed notebook: brown, a worn corner, an elastic band and loose pages.
    px(3, 2, 14, 16, C.darkPlum);
    px(4, 3, 12, 14, C.bark);
    px(4, 3, 1, 14, C.darkBark);
    px(5, 3, 10, 1, C.wood);
    px(14, 2, 2, 2, C.sandDeep);
    px(4, 14, 12, 1, C.darkPlum);
    px(11, 3, 1, 14, C.ink);
    px(6, 6, 4, 4, C.cream);
    px(7, 7, 2, 1, C.sandDeep);
    px(16, 7, 2, 5, C.cream);
    px(17, 8, 1, 1, C.sandDeep);
  },
  stone: (px) => {
    // The flat stone, lichen on top; a pale blue glint of the stone's own light.
    px(2, 9, 16, 8, C.darkPlum);
    px(3, 8, 14, 8, C.greyLight);
    px(4, 7, 11, 2, C.greyLight);
    px(3, 13, 14, 3, C.greyDeep);
    px(5, 9, 5, 1, C.pale);
    px(11, 10, 2, 1, C.leafLight);
    px(6, 11, 1, 1, C.leafLight);
    px(14, 9, 1, 1, C.leaf);
    px(9, 5, 2, 2, C.skyLight);
    px(9, 4, 2, 1, C.white);
    px(8, 5, 1, 1, C.skyLight);
    px(11, 5, 1, 1, C.skyLight);
  },
  recording: (px) => {
    // A little white player with a round speaker and three sound bars.
    px(3, 4, 14, 13, C.darkPlum);
    px(4, 5, 12, 11, C.pale);
    px(4, 5, 12, 1, C.white);
    px(4, 15, 12, 1, C.lilacGrey);
    px(6, 7, 6, 6, C.dusk);
    px(7, 8, 4, 4, C.nightBlue);
    px(8, 9, 2, 2, C.tealLight);
    px(13, 7, 2, 1, C.lilacGrey);
    px(13, 9, 2, 1, C.lilacGrey);
    px(13, 11, 2, 1, C.lilacGrey);
    px(14, 13, 1, 1, C.tealLight);
    px(17, 8, 1, 4, C.tealLight);
    px(18, 7, 1, 6, C.tealLight);
  },
};

/** The item as a small canvas on its grid, or null for an id with no art. */
export function pixelItem(kind: string): HTMLCanvasElement | null {
  const draw = ART[kind];
  if (!draw) return null;
  const canvas = document.createElement('canvas');
  canvas.width = G;
  canvas.height = G;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  draw((x, y, w, h, c) => {
    ctx.fillStyle = color(c);
    ctx.fillRect(x, y, w, h);
  });
  return canvas;
}
