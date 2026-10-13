import { frameKey } from './animations';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { C } from './palette';
import { PixelCanvas } from './pixel-canvas';

/**
 * Scenery in the 16-bit top-down RPG manner: round layered tree canopies with highlight
 * clusters and dark undersides, bushes, a cottage with a tiled roof, the kindergarten
 * hut, the dojo, a well. Drawn as billboards (they always face the camera), on a 64×64
 * design cell so one atlas holds them all. Feet are on the bottom row.
 */
export const SCENERY_SIZE = 64;

export type SceneryKind =
  | 'tree'
  | 'tree2'
  | 'bush'
  | 'bush2'
  | 'cottage'
  | 'school'
  | 'dojo'
  | 'well'
  | 'log'
  | 'nursery'
  | 'bathhouse'
  | 'workshop';

const S = SCENERY_SIZE;

/** A canopy lobe: dark base, mid tone, light cap with a highlight cluster. */
function lobe(pc: PixelCanvas, cx: number, cy: number, r: number, light = true): void {
  pc.ellipse(cx, cy + r * 0.25, r, r * 0.8, C.leafDeep);
  pc.ellipse(cx, cy, r * 0.95, r * 0.8, C.leaf);
  if (light) {
    pc.ellipse(cx - r * 0.25, cy - r * 0.3, r * 0.55, r * 0.42, C.leafLight);
    pc.dot(cx - r * 0.45, cy - r * 0.55, C.sprout);
    pc.dot(cx - r * 0.2, cy - r * 0.65, C.sprout);
  }
}

function drawTree(variant: 1 | 2): PixelCanvas {
  const pc = new PixelCanvas(S, S);
  const cx = 32;
  const base = 62;
  // Trunk with flared roots and bark grain.
  const trunkW = variant === 1 ? 8 : 6;
  pc.rect(cx - trunkW / 2, base - 20, trunkW, 20, C.bark);
  pc.rect(cx - trunkW / 2 + 1, base - 20, 2, 20, C.wood);
  pc.rect(cx + trunkW / 2 - 2, base - 18, 1, 18, C.darkBark);
  pc.tri(
    cx - trunkW / 2 - 3,
    base,
    cx - trunkW / 2 + 1,
    base - 4,
    cx - trunkW / 2 + 1,
    base,
    C.bark,
  );
  pc.tri(
    cx + trunkW / 2 + 3,
    base,
    cx + trunkW / 2 - 1,
    base - 4,
    cx + trunkW / 2 - 1,
    base,
    C.bark,
  );
  for (let y = base - 17; y < base - 3; y += 4) pc.thinLine(cx - 1, y, cx - 1, y + 2, C.darkBark);
  // Canopy: dark underside first, then rows of lobes, light on top.
  if (variant === 1) {
    pc.ellipse(cx, base - 30, 22, 9, C.leafDeep);
    lobe(pc, cx - 13, base - 30, 9, false);
    lobe(pc, cx + 13, base - 30, 9, false);
    lobe(pc, cx, base - 33, 11, false);
    lobe(pc, cx - 9, base - 41, 9);
    lobe(pc, cx + 9, base - 41, 9);
    lobe(pc, cx, base - 49, 10);
    lobe(pc, cx - 4, base - 55, 6);
    // Fruit.
    for (const [x, y] of [
      [cx - 14, base - 33],
      [cx + 12, base - 29],
      [cx + 3, base - 44],
      [cx - 8, base - 48],
      [cx + 10, base - 50],
    ] as const) {
      pc.disc(x, y, 1.4, C.orange);
      pc.dot(x - 0.5, y - 0.5, C.sunLight);
    }
  } else {
    pc.ellipse(cx, base - 28, 16, 8, C.leafDeep);
    lobe(pc, cx - 8, base - 29, 8, false);
    lobe(pc, cx + 8, base - 29, 8, false);
    lobe(pc, cx - 5, base - 39, 8);
    lobe(pc, cx + 6, base - 38, 8);
    lobe(pc, cx, base - 48, 8);
    lobe(pc, cx + 1, base - 55, 5);
    pc.disc(cx + 9, base - 34, 1.3, C.rose);
    pc.disc(cx - 10, base - 32, 1.3, C.rose);
    pc.disc(cx - 2, base - 45, 1.3, C.rose);
  }
  pc.finish(C.darkPlum, [C.white]);
  return pc;
}

function drawBush(variant: 1 | 2): PixelCanvas {
  const pc = new PixelCanvas(S, S);
  const cx = 32;
  const base = 62;
  pc.ellipse(cx, base - 5, 12, 5, C.leafDeep);
  lobe(pc, cx - 6, base - 8, 7, false);
  lobe(pc, cx + 6, base - 8, 7, false);
  lobe(pc, cx, base - 12, 8);
  if (variant === 2) {
    for (const [x, y] of [
      [cx - 7, base - 10],
      [cx + 5, base - 13],
      [cx + 1, base - 7],
    ] as const) {
      pc.disc(x, y, 1.2, C.berry);
      pc.dot(x - 0.5, y - 0.5, C.rose);
    }
  }
  pc.finish(C.darkPlum, [C.white]);
  return pc;
}

/** Plaster walls with beams, a tiled roof with rows, a door and windows. */
function house(
  pc: PixelCanvas,
  x0: number,
  y0: number,
  w: number,
  h: number,
  roof: number,
  roofShade: number,
  wall: number,
  beam: number,
  roofH: number,
): void {
  // Walls.
  pc.rect(x0, y0 + roofH, w, h - roofH, wall);
  pc.rect(x0, y0 + roofH, 1, h - roofH, beam);
  pc.rect(x0 + w - 1, y0 + roofH, 1, h - roofH, beam);
  pc.rect(x0, y0 + h - 1, w, 1, beam);
  for (let x = x0 + 6; x < x0 + w - 4; x += 8) pc.thinLine(x, y0 + roofH, x, y0 + h - 1, beam);
  pc.rect(x0, y0 + roofH, w, 1, beam);
  // Roof: a wide trapezoid with tile rows, lighter on the lit side.
  pc.tri(x0 - 3, y0 + roofH, x0 + w + 3, y0 + roofH, x0 + w / 2, y0 - 2, roof);
  pc.rect(x0 - 3, y0 + roofH - 2, w + 6, 3, roofShade);
  for (let y = y0 + 2; y < y0 + roofH; y += 3) {
    const inset = ((y0 + roofH - y) / (roofH + 2)) * (w / 2 + 3);
    pc.thinLine(x0 + w / 2 - inset + 1, y, x0 + w / 2 + inset - 1, y, roofShade);
    for (let x = x0 + w / 2 - inset + 2 + ((y / 3) % 2) * 2; x < x0 + w / 2 + inset - 1; x += 4) {
      pc.dot(x, y + 1.5, roofShade);
    }
  }
  pc.thinLine(x0 - 2, y0 + roofH - 2, x0 + w / 2, y0 - 1, C.sandLight);
}

function drawCottage(): PixelCanvas {
  const pc = new PixelCanvas(S, S);
  house(pc, 8, 10, 48, 50, C.ember, C.roseDeep, C.cream, C.bark, 22);
  // Chimney.
  pc.rect(44, 6, 6, 10, C.greyDeep);
  pc.rect(43, 5, 8, 2, C.greyLight);
  pc.dot(47, 3, C.pale);
  // Door with a round top and a window beside it.
  pc.rect(28, 42, 10, 17, C.darkBark);
  pc.ellipse(33, 42, 5, 4, C.darkBark);
  pc.rect(29, 44, 8, 14, C.bark);
  pc.dot(35, 51, C.sunYellow);
  for (const wx of [14, 44]) {
    pc.rect(wx, 38, 8, 8, C.bark);
    pc.rect(wx + 1, 39, 6, 6, C.skyLight);
    pc.thinLine(wx + 4, 39, wx + 4, 45, C.bark);
    pc.thinLine(wx + 1, 42, wx + 7, 42, C.bark);
    // Flower box.
    pc.rect(wx - 1, 46, 10, 2, C.wood);
    pc.disc(wx + 1, 45, 1, C.rose);
    pc.disc(wx + 4, 45, 1, C.sunYellow);
    pc.disc(wx + 7, 45, 1, C.blush);
  }
  // Step.
  pc.rect(26, 59, 14, 2, C.greyLight);
  pc.finish(C.darkPlum, [C.white]);
  return pc;
}

function drawSchool(): PixelCanvas {
  const pc = new PixelCanvas(S, S);
  house(pc, 6, 14, 52, 46, C.teal, C.tealDeep, C.sandLight, C.bark, 18);
  // Bell gable.
  pc.rect(28, 4, 8, 10, C.wood);
  pc.tri(26, 5, 38, 5, 32, 0, C.tealDeep);
  pc.disc(32, 9, 2, C.sunYellow);
  pc.dot(32, 11, C.sunDeep);
  // Double door and tall windows.
  pc.rect(25, 40, 14, 19, C.bark);
  pc.thinLine(32, 40, 32, 58, C.darkBark);
  pc.dot(30, 50, C.sunYellow);
  pc.dot(34, 50, C.sunYellow);
  for (const wx of [11, 45]) {
    pc.rect(wx, 36, 8, 12, C.bark);
    pc.rect(wx + 1, 37, 6, 10, C.skyLight);
    pc.thinLine(wx + 1, 42, wx + 7, 42, C.bark);
  }
  // Sign board with scribbles.
  pc.rect(42, 50, 12, 8, C.wood);
  pc.thinLine(44, 53, 52, 53, C.darkBark);
  pc.thinLine(44, 55, 50, 55, C.darkBark);
  pc.finish(C.darkPlum, [C.white]);
  return pc;
}

function drawDojo(): PixelCanvas {
  const pc = new PixelCanvas(S, S);
  house(pc, 6, 12, 52, 48, C.plum, C.darkPlum, C.darkBark, C.ink, 20);
  // A second, smaller roof tier.
  pc.tri(16, 12, 48, 12, 32, 3, C.plum);
  pc.rect(16, 10, 32, 3, C.darkPlum);
  // Round window and a wide entrance with noren curtains.
  pc.disc(32, 26, 4, C.cream);
  pc.thinLine(28, 26, 36, 26, C.darkBark);
  pc.thinLine(32, 22, 32, 30, C.darkBark);
  pc.rect(22, 42, 20, 17, C.ink);
  pc.rect(23, 42, 8, 9, C.ember);
  pc.rect(33, 42, 8, 9, C.ember);
  pc.dot(27, 46, C.cream);
  pc.dot(37, 46, C.cream);
  pc.rect(20, 59, 24, 2, C.greyLight);
  pc.finish(C.darkPlum, [C.white]);
  return pc;
}

function drawWell(): PixelCanvas {
  const pc = new PixelCanvas(S, S);
  const cx = 32;
  const base = 62;
  // Stone ring.
  pc.ellipse(cx, base - 8, 12, 6, C.greyDeep);
  pc.ellipse(cx, base - 10, 12, 6, C.greyLight);
  pc.ellipse(cx, base - 10, 8, 3.5, C.deepWater);
  pc.ellipse(cx - 1, base - 10.5, 6, 2.2, C.water);
  for (let x = cx - 10; x <= cx + 10; x += 4) pc.dot(x, base - 6, C.greyDeep);
  // Posts and a little roof with a bucket.
  pc.rect(cx - 11, base - 30, 2, 22, C.bark);
  pc.rect(cx + 9, base - 30, 2, 22, C.bark);
  pc.tri(cx - 15, base - 28, cx + 15, base - 28, cx, base - 38, C.ember);
  pc.rect(cx - 15, base - 29, 30, 2, C.roseDeep);
  pc.thinLine(cx, base - 28, cx, base - 18, C.sand);
  pc.rect(cx - 2, base - 18, 4, 4, C.wood);
  pc.finish(C.darkPlum, [C.white]);
  return pc;
}

function drawLog(): PixelCanvas {
  const pc = new PixelCanvas(S, S);
  const base = 62;
  pc.rect(16, base - 10, 30, 8, C.bark);
  pc.rect(16, base - 10, 30, 2, C.wood);
  pc.ellipse(46, base - 6, 3, 4, C.wood);
  pc.ellipse(46, base - 6, 1.6, 2, C.sand);
  for (let x = 20; x < 44; x += 5) pc.thinLine(x, base - 7, x + 3, base - 7, C.darkBark);
  pc.finish(C.darkPlum, [C.white]);
  return pc;
}

/** The nursery: a round-roofed hut with an egg on the sign. */
function drawNursery(): PixelCanvas {
  const pc = new PixelCanvas(S, S);
  house(pc, 10, 16, 44, 44, C.roseLight, C.roseDeep, C.cream, C.bark, 16);
  pc.ellipse(32, 14, 22, 6, C.roseLight);
  pc.ellipse(32, 12, 20, 4, C.rose);
  pc.rect(26, 42, 12, 17, C.bark);
  pc.ellipse(32, 42, 6, 4, C.bark);
  pc.rect(27, 44, 10, 14, C.wood);
  // Egg sign.
  pc.rect(44, 30, 10, 10, C.wood);
  pc.ellipse(49, 35, 2.5, 3.2, C.skyLight);
  pc.dot(48, 33.5, C.white);
  pc.disc(16, 36, 3, C.skyLight);
  pc.thinLine(14, 36, 18, 36, C.bark);
  pc.finish(C.darkPlum, [C.white]);
  return pc;
}

/** The bathhouse: a low stone house with a steaming tub out front. */
function drawBathhouse(): PixelCanvas {
  const pc = new PixelCanvas(S, S);
  house(pc, 8, 18, 48, 40, C.teal, C.tealDeep, C.greyLight, C.greyDeep, 16);
  pc.rect(26, 42, 12, 15, C.darkBark);
  pc.rect(27, 44, 10, 12, C.deepWater);
  pc.thinLine(29, 46, 35, 46, C.shallows);
  // Tub and steam.
  pc.ellipse(14, 56, 7, 3.5, C.wood);
  pc.ellipse(14, 55, 5.5, 2.2, C.shallows);
  pc.dot(12, 54, C.white);
  for (const [x, y] of [
    [11, 49],
    [14, 46],
    [17, 50],
    [13, 43],
  ] as const) {
    pc.ellipse(x, y, 1.6, 1, C.pale);
  }
  pc.finish(C.darkPlum, [C.white]);
  return pc;
}

/** The workshop: open front, a bench, tools on the wall, a chimney with smoke. */
function drawWorkshop(): PixelCanvas {
  const pc = new PixelCanvas(S, S);
  house(pc, 8, 16, 48, 44, C.darkBark, C.ink, C.sand, C.bark, 18);
  pc.rect(42, 8, 6, 12, C.greyDeep);
  pc.ellipse(45, 5, 2.2, 1.6, C.greyLight);
  pc.ellipse(48, 2, 1.6, 1.2, C.pale);
  // Open front with a bench and tools.
  pc.rect(16, 36, 32, 23, C.darkBark);
  pc.rect(18, 50, 28, 4, C.wood);
  pc.rect(19, 54, 2, 5, C.bark);
  pc.rect(43, 54, 2, 5, C.bark);
  pc.rect(22, 38, 3, 8, C.greyLight);
  pc.rect(22, 44, 3, 3, C.bark);
  pc.thinLine(30, 38, 30, 47, C.bark);
  pc.rect(28, 38, 5, 3, C.greyLight);
  pc.disc(40, 42, 3, C.greyDeep);
  pc.disc(40, 42, 1.4, C.darkBark);
  pc.finish(C.darkPlum, [C.white]);
  return pc;
}

export function buildScenerySheet(): SpriteSheet {
  const atlas = new AtlasBuilder(S, S, 5);
  atlas.add(frameKey('nursery', 'front', 0), drawNursery());
  atlas.add(frameKey('bathhouse', 'front', 0), drawBathhouse());
  atlas.add(frameKey('workshop', 'front', 0), drawWorkshop());
  atlas.add(frameKey('tree', 'front', 0), drawTree(1));
  atlas.add(frameKey('tree2', 'front', 0), drawTree(2));
  atlas.add(frameKey('bush', 'front', 0), drawBush(1));
  atlas.add(frameKey('bush2', 'front', 0), drawBush(2));
  atlas.add(frameKey('cottage', 'front', 0), drawCottage());
  atlas.add(frameKey('school', 'front', 0), drawSchool());
  atlas.add(frameKey('dojo', 'front', 0), drawDojo());
  atlas.add(frameKey('well', 'front', 0), drawWell());
  atlas.add(frameKey('log', 'front', 0), drawLog());
  return atlas.build();
}

/** For previews: draw one piece directly. */
export function drawScenery(kind: SceneryKind): PixelCanvas {
  switch (kind) {
    case 'tree':
      return drawTree(1);
    case 'tree2':
      return drawTree(2);
    case 'bush':
      return drawBush(1);
    case 'bush2':
      return drawBush(2);
    case 'cottage':
      return drawCottage();
    case 'school':
      return drawSchool();
    case 'dojo':
      return drawDojo();
    case 'well':
      return drawWell();
    case 'log':
      return drawLog();
    case 'nursery':
      return drawNursery();
    case 'bathhouse':
      return drawBathhouse();
    case 'workshop':
      return drawWorkshop();
  }
}
