import { frameKey } from './animations';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { C } from './palette';
import { PixelCanvas } from './pixel-canvas';

export const PROP_SIZE = 16;

/** Round fruit with a leaf, the Chao-garden staple. */
function drawFruit(): PixelCanvas {
  const pc = new PixelCanvas(PROP_SIZE, PROP_SIZE);
  pc.ellipse(8, 10, 5, 4.5, C.orange);
  pc.ellipse(9.5, 11, 3.5, 3, C.ember);
  pc.ellipse(7.5, 10, 4, 3.5, C.orange);
  pc.px(6, 8, C.sunYellow);
  pc.px(5, 9, C.sunYellow);
  pc.line(8, 6, 8, 4, C.bark);
  pc.tri(8, 4, 13, 2, 10, 6, C.leaf);
  pc.px(10, 4, C.sprout);
  pc.outline(C.darkPlum);
  return pc;
}

/** A small flower for memorials (M3) and garden dressing. */
function drawFlower(): PixelCanvas {
  const pc = new PixelCanvas(PROP_SIZE, PROP_SIZE);
  pc.line(8, 14, 8, 8, C.forest);
  pc.px(6, 11, C.leaf);
  pc.px(7, 11, C.leaf);
  for (const [dx, dy] of [
    [0, -3],
    [3, 0],
    [0, 3],
    [-3, 0],
  ] as const) {
    pc.disc(8 + dx, 6 + dy, 1.6, C.blush);
  }
  pc.disc(8, 6, 1.6, C.sunYellow);
  pc.outline(C.darkPlum);
  return pc;
}

/** A striped ball: the toy from the shop. */
function drawToy(): PixelCanvas {
  const pc = new PixelCanvas(PROP_SIZE, PROP_SIZE);
  pc.disc(8, 9, 5.5, C.rose);
  pc.ellipse(8, 9, 5.5, 2.2, C.cream);
  pc.disc(8, 9, 1.6, C.water);
  pc.px(5, 6, C.white);
  pc.px(6, 5, C.white);
  pc.outline(C.darkPlum);
  return pc;
}

export function buildPropSheet(): SpriteSheet {
  const atlas = new AtlasBuilder(PROP_SIZE, PROP_SIZE, 4);
  atlas.add(frameKey('fruit', 'front', 0), drawFruit());
  atlas.add(frameKey('flower', 'front', 0), drawFlower());
  atlas.add(frameKey('toy', 'front', 0), drawToy());
  return atlas.build();
}
