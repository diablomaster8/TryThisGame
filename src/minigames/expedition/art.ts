import { C } from '../../render/sprites/palette';
import { PixelCanvas } from '../../render/sprites/pixel-canvas';
import type { NubbinType } from '../../sim/types';

/** Small pixel props for the Expedition, drawn once and cached as canvases. */
export interface ExpeditionArt {
  shell: HTMLCanvasElement[];
  essence: Record<NubbinType, HTMLCanvasElement>;
  bubble: HTMLCanvasElement[];
  rock: HTMLCanvasElement;
  log: HTMLCanvasElement;
  bush: HTMLCanvasElement;
  cloud: HTMLCanvasElement;
  hill: HTMLCanvasElement;
  groundTile: HTMLCanvasElement;
}

function shell(frame: number): PixelCanvas {
  const pc = new PixelCanvas(10, 10);
  const squeeze = frame === 1 ? 1 : 0;
  pc.ellipse(5, 5, 4 - squeeze, 4, C.sunYellow);
  pc.ellipse(5.5, 5.5, 3 - squeeze, 3, C.orange);
  pc.ellipse(4.5, 4.5, 2.5 - squeeze, 2.5, C.sunYellow);
  pc.line(5, 2, 5, 8, C.cream);
  pc.px(3, 4, C.cream);
  pc.px(7, 4, C.cream);
  pc.outline(C.darkPlum);
  return pc;
}

const ESSENCE_COLORS: Record<NubbinType, [number, number]> = {
  swim: [C.water, C.shallows],
  fly: [C.violet, C.lavender],
  run: [C.leaf, C.sprout],
  power: [C.ember, C.orange],
  normal: [C.sunYellow, C.cream],
};

function essence(type: NubbinType): PixelCanvas {
  const pc = new PixelCanvas(12, 14);
  const [main, light] = ESSENCE_COLORS[type];
  pc.tri(6, 0, 11, 6, 1, 6, main);
  pc.tri(1, 6, 11, 6, 6, 13, main);
  pc.line(6, 1, 3, 6, light);
  pc.px(5, 3, C.white);
  pc.outline(C.darkPlum);
  return pc;
}

function bubble(frame: number): PixelCanvas {
  const pc = new PixelCanvas(18, 18);
  const r = frame === 1 ? 8 : 8.5;
  pc.disc(9, 9, r, C.shallows);
  pc.disc(9, 9, r - 1.5, C.white);
  // A tiny critter silhouette inside.
  pc.disc(9, 10, 3.5, C.bark);
  pc.disc(7, 8, 1.3, C.bark);
  pc.disc(11, 8, 1.3, C.bark);
  pc.px(8, 10, C.ink);
  pc.px(10, 10, C.ink);
  pc.px(4, 5, C.white);
  pc.px(5, 4, C.white);
  pc.outline(C.water);
  return pc;
}

function rock(): PixelCanvas {
  const pc = new PixelCanvas(18, 14);
  pc.ellipse(9, 9, 8, 5, C.dusk);
  pc.ellipse(8, 7, 6, 4, C.lilacGrey);
  pc.px(5, 5, C.pale);
  pc.px(11, 10, C.plum);
  pc.outline(C.darkPlum);
  return pc;
}

function log(): PixelCanvas {
  const pc = new PixelCanvas(34, 14);
  pc.rect(2, 3, 30, 9, C.bark);
  pc.rect(2, 3, 30, 2, C.wood);
  pc.disc(3, 7, 4, C.sand);
  pc.disc(3, 7, 2, C.wood);
  pc.line(10, 8, 26, 8, C.darkBark);
  pc.outline(C.darkPlum);
  return pc;
}

function bush(): PixelCanvas {
  const pc = new PixelCanvas(18, 18);
  pc.disc(9, 11, 7, C.forest);
  pc.disc(6, 9, 4, C.leaf);
  pc.disc(12, 8, 4, C.leaf);
  for (const [x, y] of [
    [3, 4],
    [9, 1],
    [15, 4],
    [1, 11],
    [17, 12],
  ] as const) {
    pc.line(x, y, x + (x < 9 ? 2 : -2), y + 3, C.ink);
  }
  pc.outline(C.darkPlum);
  return pc;
}

function cloud(): PixelCanvas {
  const pc = new PixelCanvas(36, 14);
  pc.ellipse(12, 9, 10, 4.5, C.white);
  pc.ellipse(22, 8, 10, 5, C.white);
  pc.ellipse(17, 5, 7, 4.5, C.white);
  pc.ellipse(26, 10, 7, 3, C.pale);
  return pc;
}

function hill(): PixelCanvas {
  const pc = new PixelCanvas(120, 40);
  pc.ellipse(60, 40, 60, 36, C.forest);
  pc.ellipse(58, 38, 54, 30, C.leaf);
  for (let x = 6; x < 114; x += 11) pc.px(x, 30 - (x % 7), C.sprout);
  return pc;
}

function groundTile(): PixelCanvas {
  const pc = new PixelCanvas(16, 16);
  pc.rect(0, 0, 16, 2, C.sprout);
  pc.rect(0, 2, 16, 3, C.grass);
  pc.rect(0, 5, 16, 11, C.bark);
  pc.px(3, 8, C.darkBark);
  pc.px(11, 12, C.darkBark);
  pc.px(7, 3, C.leaf);
  pc.px(13, 1, C.leaf);
  return pc;
}

export function buildExpeditionArt(): ExpeditionArt {
  const essences = {} as Record<NubbinType, HTMLCanvasElement>;
  for (const t of ['swim', 'fly', 'run', 'power', 'normal'] as const)
    essences[t] = essence(t).toCanvas();
  return {
    shell: [shell(0).toCanvas(), shell(1).toCanvas()],
    essence: essences,
    bubble: [bubble(0).toCanvas(), bubble(1).toCanvas()],
    rock: rock().toCanvas(),
    log: log().toCanvas(),
    bush: bush().toCanvas(),
    cloud: cloud().toCanvas(),
    hill: hill().toCanvas(),
    groundTile: groundTile().toCanvas(),
  };
}
