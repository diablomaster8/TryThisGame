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
    case 'reed':
      pc.thinLine(5, 15, 4, 4, C.forest);
      pc.thinLine(8, 15, 8, 2, C.leaf);
      pc.thinLine(11, 15, 12, 5, C.forest);
      pc.ellipse(8, 3, 0.9, 2, C.bark);
      pc.ellipse(4, 5, 0.7, 1.4, C.darkBark);
      break;
    case 'tallgrass':
      for (const [x0, top, c] of [
        [2, 6, C.forest],
        [4, 3, C.leaf],
        [7, 2, C.leafLight],
        [9, 4, C.leaf],
        [12, 5, C.forest],
        [14, 8, C.leaf],
      ] as const) {
        pc.thinLine(x0, 15, x0 + 1, top, c);
      }
      break;
    case 'lily': {
      pc.ellipse(8, 8, 5.5, 3.5, C.leaf);
      pc.ellipse(7, 7.5, 3.5, 2, C.leafLight);
      // The wedge: erase a slice so the pad reads as a lily pad.
      for (let y = 5; y <= 10; y++)
        for (let x = 9; x <= 14; x++)
          if (y - 8 < (x - 8) * 0.45 && 8 - y < (x - 8) * 0.45) pc.erase(x, y);
      pc.disc(5, 5, 1.3, C.blush);
      pc.px(5, 5, C.sunYellow);
      break;
    }
    // Placeable garden pieces (sim/decorate.ts) and story items.
    case 'fence':
      pc.rect(2, 6, 1.5, 9, C.wood);
      pc.rect(12.5, 6, 1.5, 9, C.wood);
      pc.rect(1, 8, 14, 1.5, C.sand);
      pc.rect(1, 12, 14, 1.5, C.sand);
      pc.tri(1.5, 6, 4, 6, 2.75, 4, C.wood);
      pc.tri(12, 6, 14.5, 6, 13.25, 4, C.wood);
      break;
    case 'flowerbed':
      pc.ellipse(8, 12, 7, 3, C.darkBark);
      pc.ellipse(8, 11.5, 6, 2.2, C.bark);
      for (const [x, y, c] of [
        [4, 8, C.rose],
        [7, 7, C.sunYellow],
        [10, 8, C.blush],
        [12, 9, C.skyLight],
        [5.5, 10, C.white],
      ] as const) {
        pc.thinLine(x, 11, x, y + 1, C.forest);
        pc.disc(x, y, 1.1, c);
      }
      break;
    case 'bench':
      pc.rect(2, 7, 12, 2, C.wood);
      pc.rect(2, 4, 12, 2, C.wood);
      pc.rect(3, 9, 1.5, 5, C.bark);
      pc.rect(11.5, 9, 1.5, 5, C.bark);
      pc.rect(3, 5, 1.5, 2.5, C.bark);
      pc.rect(11.5, 5, 1.5, 2.5, C.bark);
      pc.thinLine(2, 7.5, 14, 7.5, C.sand);
      break;
    case 'statue':
      pc.rect(4, 12, 8, 3, C.greyDeep);
      pc.rect(5, 11, 6, 1, C.greyLight);
      pc.ellipse(8, 8, 3, 2.4, C.greyLight);
      pc.ellipse(8, 4, 2.6, 2.4, C.greyLight);
      pc.tri(7, 2, 9, 2, 8, 0, C.pale);
      pc.ellipse(7, 4, 0.5, 0.8, C.greyDeep);
      pc.ellipse(9, 4, 0.5, 0.8, C.greyDeep);
      pc.tri(4.5, 8, 6, 5, 6, 9, C.pale);
      pc.tri(11.5, 8, 10, 5, 10, 9, C.pale);
      break;
    case 'pathTile':
      pc.ellipse(8, 8, 7, 4.5, C.sandDeep);
      pc.ellipse(7.5, 7.5, 5.5, 3.2, C.sand);
      pc.px(5, 7, C.greyLight);
      pc.px(10, 9, C.greyLight);
      break;
    case 'lanternSmall':
      pc.rect(7, 9, 2, 6, C.darkBark);
      pc.rect(5, 3, 6, 6, C.sunYellow);
      pc.rect(6, 4, 4, 4, C.sunLight);
      pc.rect(4, 2, 8, 1, C.darkBark);
      pc.rect(4, 9, 8, 1, C.darkBark);
      pc.px(7, 1, C.darkBark);
      break;
    case 'notebook':
      pc.rect(3, 4, 10, 9, C.bark);
      pc.rect(4, 5, 8, 7, C.cream);
      pc.thinLine(5, 7, 11, 7, C.lilacGrey);
      pc.thinLine(5, 9, 10, 9, C.lilacGrey);
      pc.rect(3, 4, 1.5, 9, C.darkBark);
      break;
  }
  if (kind === 'lily') pc.outlineColored(C.deepWater);
  else if (kind === 'pathTile') pc.outlineColored(C.leafDeep);
  else pc.finish(C.darkPlum, [C.white]);
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
  'reed',
  'tallgrass',
  'lily',
  'fence',
  'flowerbed',
  'bench',
  'statue',
  'pathTile',
  'lanternSmall',
  'notebook',
] as const;

export function buildPropSheet(): SpriteSheet {
  const atlas = new AtlasBuilder(PROP_SIZE, PROP_SIZE, 4);
  atlas.add(frameKey('fruit', 'front', 0), drawFruit());
  atlas.add(frameKey('flower', 'front', 0), drawFlower());
  atlas.add(frameKey('toy', 'front', 0), drawToy());
  for (const d of DECOR_FRAMES) atlas.add(frameKey(d, 'front', 0), drawDecor(d));
  return atlas.build();
}
