import { CanvasTexture, NearestFilter, SRGBColorSpace } from 'three';
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

/** Leaves: a dense two-tone cluster pattern so canopies read as foliage, not plastic. */
export function makeLeafTexture(tilePx: number, repeat: number): CanvasTexture {
  const pc = new PixelCanvas(tilePx, tilePx);
  pc.rect(0, 0, tilePx, tilePx, C.leafLight);
  const clusters: Array<[number, number, number]> = [
    [2, 2, C.sprout],
    [3, 2, C.sprout],
    [2, 3, C.leaf],
    [6, 5, C.leaf],
    [7, 5, C.sprout],
    [5, 1, C.forest],
    [1, 6, C.forest],
    [4, 6, C.forest],
    [7, 2, C.leafDeep],
    [0, 4, C.leafDeep],
    [5, 7, C.leafDeep],
  ];
  for (const [x, y, c] of clusters) pc.px(x % tilePx, y % tilePx, c);
  const texture = pc.toTexture({ repeat: true });
  texture.repeat.set(repeat, repeat);
  return texture;
}

/** Bark: vertical grain in two browns. */
export function makeBarkTexture(w: number, h: number): CanvasTexture {
  const pc = new PixelCanvas(w, h);
  pc.rect(0, 0, w, h, C.bark);
  for (let x = 0; x < w; x += 2) {
    for (let y = 0; y < h; y++) {
      if ((x + y * 3) % 7 < 2) pc.px(x, y, C.darkBark);
      if ((x * 5 + y) % 11 === 0) pc.px(x + 1, y, C.wood);
    }
  }
  const texture = pc.toTexture({ repeat: true });
  texture.repeat.set(2, 1);
  return texture;
}

/** Stone: grey with a few darker flecks and a lighter top. */
export function makeStoneTexture(): CanvasTexture {
  const pc = new PixelCanvas(8, 8);
  pc.rect(0, 0, 8, 8, C.greyLight);
  pc.px(1, 5, C.greyDeep);
  pc.px(5, 2, C.greyDeep);
  pc.px(6, 6, C.greyDeep);
  pc.px(3, 3, C.lilacGrey);
  pc.px(2, 0, C.pale);
  pc.px(6, 1, C.pale);
  const texture = pc.toTexture({ repeat: true });
  texture.repeat.set(2, 2);
  return texture;
}

/** A vertical sky gradient with a few pixel clouds, used as the scene background. */
export function makeSkyTexture(top: string, bottom: string, clouds: boolean): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas context unavailable');
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, top);
  grad.addColorStop(1, bottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (clouds) {
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    for (const [x, y, w] of [
      [4, 18, 14],
      [30, 10, 18],
      [48, 26, 12],
      [18, 34, 10],
    ] as const) {
      ctx.fillRect(x, y, w, 3);
      ctx.fillRect(x + 3, y - 2, w - 6, 2);
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
