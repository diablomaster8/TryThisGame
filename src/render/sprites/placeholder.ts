import type { CanvasTexture } from 'three';
import { C } from './palette';
import { PixelCanvas } from './pixel-canvas';

/**
 * M0 placeholder sprite: a round green sprout with big eyes and a leaf. It stands in
 * for the real Nubbin generator (M1) so the billboard path can be exercised now.
 */
export function makePlaceholderSpriteTexture(size: number): CanvasTexture {
  const pc = new PixelCanvas(size, size);
  const cx = size / 2;
  const bodyR = size * 0.32;
  const bodyCy = size * 0.62;

  // Shadow-ish darker rim, then body.
  pc.disc(cx, bodyCy + 1, bodyR, C.forest);
  pc.disc(cx, bodyCy, bodyR - 1, C.grass);
  // Belly highlight.
  pc.disc(cx, bodyCy + bodyR * 0.3, bodyR * 0.5, C.sprout);

  // Stubby feet.
  pc.rect(Math.round(cx - bodyR * 0.8), Math.round(bodyCy + bodyR - 1), 4, 2, C.forest);
  pc.rect(Math.round(cx + bodyR * 0.8 - 4), Math.round(bodyCy + bodyR - 1), 4, 2, C.forest);

  // Eyes: two tall dark pixels with a white glint.
  const eyeY = Math.round(bodyCy - bodyR * 0.25);
  const eyeDx = Math.round(bodyR * 0.45);
  for (const ex of [cx - eyeDx, cx + eyeDx]) {
    const x = Math.round(ex) - 1;
    pc.rect(x, eyeY, 2, 3, C.ink);
    pc.px(x, eyeY, C.white);
  }
  // Blush.
  pc.px(Math.round(cx - eyeDx - 3), eyeY + 3, C.blush);
  pc.px(Math.round(cx + eyeDx + 2), eyeY + 3, C.blush);

  // Stem and leaf on top.
  const stemTop = Math.round(bodyCy - bodyR - 4);
  pc.rect(Math.round(cx) - 1, stemTop, 1, 5, C.forest);
  pc.rect(Math.round(cx), stemTop - 3, 4, 2, C.leaf);
  pc.rect(Math.round(cx) + 1, stemTop - 4, 3, 1, C.leaf);
  pc.px(Math.round(cx) + 2, stemTop - 3, C.sprout);

  return pc.toTexture();
}

/** 8×8 two-tone grass tile, repeated across the ground. */
export function makeGrassTexture(tilePx: number, repeat: number): CanvasTexture {
  const pc = new PixelCanvas(tilePx, tilePx);
  pc.rect(0, 0, tilePx, tilePx, C.grass);
  // Sparse darker blades in a fixed pattern (no randomness outside sim/).
  const blades: Array<[number, number]> = [
    [1, 2],
    [5, 1],
    [3, 5],
    [6, 6],
    [0, 7],
  ];
  for (const [x, y] of blades) {
    pc.px(x % tilePx, y % tilePx, C.leaf);
  }
  pc.px(2, 3, C.sprout);
  const texture = pc.toTexture({ repeat: true });
  texture.repeat.set(repeat, repeat);
  return texture;
}
