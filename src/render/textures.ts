import type { CanvasTexture } from 'three';
import { C } from './sprites/palette';
import { PixelCanvas } from './sprites/pixel-canvas';

/** 8×8 two-tone grass tile, repeated across the ground. Fixed pattern, no randomness. */
export function makeGrassTexture(tilePx: number, repeat: number): CanvasTexture {
  const pc = new PixelCanvas(tilePx, tilePx);
  pc.rect(0, 0, tilePx, tilePx, C.grass);
  const blades: Array<[number, number]> = [
    [1, 2],
    [5, 1],
    [3, 5],
    [6, 6],
    [0, 7],
  ];
  for (const [x, y] of blades) pc.px(x % tilePx, y % tilePx, C.leaf);
  pc.px(2, 3, C.sprout);
  const texture = pc.toTexture({ repeat: true });
  texture.repeat.set(repeat, repeat);
  return texture;
}

/** Water: blue with pale ripple lines; the scene scrolls it slowly. */
export function makeWaterTexture(tilePx: number, repeat: number): CanvasTexture {
  const pc = new PixelCanvas(tilePx, tilePx);
  pc.rect(0, 0, tilePx, tilePx, C.water);
  pc.line(0, 2, 3, 2, C.shallows);
  pc.line(5, 6, 7, 6, C.shallows);
  pc.px(2, 5, C.deepWater);
  pc.px(6, 1, C.deepWater);
  const texture = pc.toTexture({ repeat: true });
  texture.repeat.set(repeat, repeat);
  return texture;
}

/** Waterfall: vertical streaks that scroll downward. */
export function makeWaterfallTexture(w: number, h: number): CanvasTexture {
  const pc = new PixelCanvas(w, h);
  pc.rect(0, 0, w, h, C.water);
  for (let x = 0; x < w; x += 3) {
    for (let y = 0; y < h; y++) {
      if ((y + x) % 6 < 3) pc.px(x, y, C.shallows);
    }
    pc.px(x + 1, (x * 2) % h, C.white);
  }
  const texture = pc.toTexture({ repeat: true });
  texture.repeat.set(1, 1);
  return texture;
}

/** Hill rock with grass: a slightly different green so hills read as separate shapes. */
export function makeHillTexture(tilePx: number, repeat: number): CanvasTexture {
  const pc = new PixelCanvas(tilePx, tilePx);
  pc.rect(0, 0, tilePx, tilePx, C.leaf);
  pc.px(1, 1, C.grass);
  pc.px(4, 3, C.grass);
  pc.px(6, 6, C.forest);
  pc.px(2, 6, C.grass);
  const texture = pc.toTexture({ repeat: true });
  texture.repeat.set(repeat, repeat);
  return texture;
}
