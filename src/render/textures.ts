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
  // Wave crests: short lit arcs with a darker trough under each.
  pc.thinLine(0, 2, 3, 2, C.shallows);
  pc.dot(3.5, 1.5, C.skyLight);
  pc.thinLine(0.5, 3, 3, 3, C.deepWater);
  pc.thinLine(4.5, 6, 7.5, 6, C.shallows);
  pc.dot(7.5, 5.5, C.skyLight);
  pc.thinLine(5, 7, 7.5, 7, C.deepWater);
  pc.dot(2, 5.5, C.deepWater);
  pc.dot(6, 1, C.deepWater);
  pc.dot(1, 7, C.shallows);
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

/** Cliff face: horizontal strata in greys and browns with cracks, repeated around a hill. */
export function makeCliffTexture(): CanvasTexture {
  const pc = new PixelCanvas(16, 16);
  pc.rect(0, 0, 16, 16, C.greyDeep);
  for (let y = 0; y < 16; y += 4) {
    pc.rect(0, y, 16, 2, C.greyLight);
    pc.rect(0, y + 2, 16, 1, C.bark);
    for (let x = (y / 4) % 2 === 0 ? 2 : 6; x < 16; x += 8) pc.dot(x, y + 1.5, C.greyDeep);
  }
  pc.thinLine(3, 0, 5, 7, C.darkBark);
  pc.thinLine(11, 6, 10, 15, C.darkBark);
  pc.dot(8, 2, C.pale);
  pc.dot(13, 10, C.pale);
  // Grass lip along the top.
  pc.rect(0, 0, 16, 1, C.leaf);
  for (let x = 1; x < 16; x += 3) pc.dot(x, 1, C.leafDeep);
  const texture = pc.toTexture({ repeat: true });
  texture.repeat.set(4, 1);
  return texture;
}
