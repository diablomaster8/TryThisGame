/**
 * R0035 (lane A r10): the Pixel tap marker's two variants, a grey ✕ for a tap nothing reaches
 * and a ⤒ for a ledge only a jump gets up to. One small sheet, built once.
 */
import { frameKey } from './animations';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { C } from './palette';
import { PixelCanvas } from './pixel-canvas';

const SIZE = 16;

function drawCant(): PixelCanvas {
  const pc = new PixelCanvas(SIZE, SIZE);
  for (const o of [0, 1]) {
    pc.line(3 + o, 3, 12 + o, 12, C.greyLight);
    pc.line(12 + o, 3, 3 + o, 12, C.greyLight);
  }
  pc.outline(C.greyDeep);
  return pc;
}

function drawJump(): PixelCanvas {
  const pc = new PixelCanvas(SIZE, SIZE);
  pc.rect(3, 1, 10, 2, C.sunYellow);
  pc.tri(8, 4, 3, 9, 13, 9, C.sunYellow);
  pc.rect(7, 9, 3, 6, C.sunYellow);
  pc.px(8, 5, C.white);
  pc.outline(C.darkPlum);
  return pc;
}

export function buildTapFlagSheet(): SpriteSheet {
  const atlas = new AtlasBuilder(SIZE, SIZE, 2);
  atlas.add(frameKey('tapCant', 'front', 0), drawCant());
  atlas.add(frameKey('tapJump', 'front', 0), drawJump());
  return atlas.build();
}
