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
  pc.finish(C.darkPlum, [C.white]);
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
  pc.finish(C.darkPlum, [C.white]);
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
  pc.finish(C.darkPlum, [C.white]);
  return pc;
}

/** A soft round shadow, drawn flat under every sprite. */
function drawShadow(): PixelCanvas {
  const pc = new PixelCanvas(PROP_SIZE, PROP_SIZE);
  pc.ellipse(8, 8, 7, 7, C.ink);
  return pc;
}

export function buildShadowSheet(): SpriteSheet {
  const atlas = new AtlasBuilder(PROP_SIZE, PROP_SIZE, 1);
  atlas.add(frameKey('shadow', 'front', 0), drawShadow());
  return atlas.build();
}

/** Ground dressing: tufts, flowers, pebbles, mushrooms, a stump and the signpost. */
function drawDecor(kind: string): PixelCanvas {
  const pc = new PixelCanvas(PROP_SIZE, PROP_SIZE);
  switch (kind) {
    case 'tuft':
      pc.line(5, 14, 4, 9, C.leaf);
      pc.line(7, 14, 7, 8, C.leaf);
      pc.line(9, 14, 10, 9, C.leaf);
      pc.line(11, 14, 12, 11, C.sprout);
      pc.line(3, 14, 2, 11, C.sprout);
      pc.px(7, 7, C.sprout);
      break;
    case 'daisy':
      pc.line(8, 14, 8, 9, C.forest);
      pc.px(6, 12, C.leaf);
      for (const [dx, dy] of [
        [0, -2],
        [2, 0],
        [0, 2],
        [-2, 0],
      ] as const) {
        pc.disc(8 + dx, 7 + dy, 1.2, C.white);
      }
      pc.px(8, 7, C.sunYellow);
      break;
    case 'bluebell':
      pc.line(8, 14, 7, 8, C.forest);
      pc.px(9, 12, C.leaf);
      pc.ellipse(6, 8, 1.4, 1.8, C.skyDeep);
      pc.ellipse(9, 10, 1.4, 1.8, C.skyLight);
      pc.px(6, 7, C.skyLight);
      break;
    case 'pebble':
      pc.ellipse(7, 12, 3, 2, C.greyDeep);
      pc.ellipse(6.5, 11.5, 2.2, 1.3, C.greyLight);
      pc.ellipse(11, 13, 1.6, 1.1, C.greyLight);
      break;
    case 'mushroom':
      pc.rect(7, 10, 3, 4, C.cream);
      pc.ellipse(8, 9, 4, 2.6, C.ember);
      pc.px(6, 8, C.white);
      pc.px(9, 9, C.white);
      pc.px(10, 7, C.white);
      break;
    case 'stump':
      pc.rect(4, 8, 8, 6, C.bark);
      pc.ellipse(8, 8, 4.5, 2.2, C.wood);
      pc.ellipse(8, 8, 2.5, 1.2, C.sand);
      pc.px(8, 8, C.bark);
      pc.px(5, 12, C.darkBark);
      break;
    case 'sign':
      pc.rect(7, 7, 2, 8, C.bark);
      pc.rect(2, 2, 12, 6, C.wood);
      pc.rect(3, 3, 10, 4, C.sand);
      pc.line(4, 4, 7, 4, C.bark);
      pc.line(4, 6, 9, 6, C.bark);
      pc.px(11, 4, C.ember);
      break;
  }
  pc.finish(C.darkPlum, [C.white]);
  return pc;
}

export const DECOR_FRAMES = [
  'tuft',
  'daisy',
  'bluebell',
  'pebble',
  'mushroom',
  'stump',
  'sign',
] as const;

export function buildPropSheet(): SpriteSheet {
  const atlas = new AtlasBuilder(PROP_SIZE, PROP_SIZE, 4);
  atlas.add(frameKey('fruit', 'front', 0), drawFruit());
  atlas.add(frameKey('flower', 'front', 0), drawFlower());
  atlas.add(frameKey('toy', 'front', 0), drawToy());
  for (const d of DECOR_FRAMES) atlas.add(frameKey(d, 'front', 0), drawDecor(d));
  return atlas.build();
}
