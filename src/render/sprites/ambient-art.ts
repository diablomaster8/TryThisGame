/**
 * R0547 (SOUL-29), lane A round 11: the little animals Nubbins chase, drawn on a 16-pixel
 * grid into one small sheet: butterflies in three colours (wings open and shut), a firefly
 * (dim and lit), a frog (sitting and mid-hop) and a dragonfly (wings out and blurred). The
 * Pixel view draws them as sprites; the Full 3D view maps the same texture onto its quads.
 */
import { frameKey } from './animations';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { C } from './palette';
import { PixelCanvas } from './pixel-canvas';
import type { AmbientKind } from '../../sim/ambient';

export const AMBIENT_CELL = 16;
export const BUTTERFLY_COLOURS = 3;

type Ink = (typeof C)[keyof typeof C];

function butterfly(colour: number, open: boolean): PixelCanvas {
  const pc = new PixelCanvas(AMBIENT_CELL, AMBIENT_CELL);
  const [a, b]: [Ink, Ink] =
    colour === 0
      ? [C.orange, C.sunYellow]
      : colour === 1
        ? [C.violet, C.lavender]
        : [C.skyDeep, C.white];
  if (open) {
    pc.disc(5, 6, 3.4, a);
    pc.disc(11, 6, 3.4, a);
    pc.disc(5.5, 10, 2.2, b);
    pc.disc(10.5, 10, 2.2, b);
    pc.px(4, 5, C.ink);
    pc.px(11, 5, C.ink);
  } else {
    pc.ellipse(7, 8, 1.8, 4, a);
    pc.ellipse(9, 8, 1.8, 4, b);
  }
  pc.rect(7, 4, 2, 9, C.ink);
  pc.px(6, 3, C.ink);
  pc.px(9, 3, C.ink);
  return pc;
}

function firefly(lit: boolean): PixelCanvas {
  const pc = new PixelCanvas(AMBIENT_CELL, AMBIENT_CELL);
  if (lit) {
    pc.disc(8, 9, 4.5, C.sunLight);
    pc.disc(8, 9, 2.6, C.sunYellow);
  }
  pc.rect(7, 7, 2, 4, C.ink);
  pc.px(6, 6, C.white);
  pc.px(9, 6, C.white);
  pc.disc(8, 11, 1.2, lit ? C.white : C.sunDeep);
  return pc;
}

function frog(hop: boolean): PixelCanvas {
  const pc = new PixelCanvas(AMBIENT_CELL, AMBIENT_CELL);
  const y = hop ? 7 : 10;
  pc.ellipse(8, y + 1, 5, 3, C.leaf);
  pc.disc(5, y - 2, 1.8, C.leaf);
  pc.disc(11, y - 2, 1.8, C.leaf);
  pc.px(5, y - 2, C.ink);
  pc.px(11, y - 2, C.ink);
  pc.ellipse(8, y + 2, 3, 1.6, C.cream);
  if (hop) {
    pc.line(3, y + 3, 1, y + 6, C.leaf);
    pc.line(13, y + 3, 15, y + 6, C.leaf);
  } else {
    pc.rect(2, y + 3, 3, 1, C.leaf);
    pc.rect(11, y + 3, 3, 1, C.leaf);
  }
  return pc;
}

function dragonfly(blur: boolean): PixelCanvas {
  const pc = new PixelCanvas(AMBIENT_CELL, AMBIENT_CELL);
  pc.rect(3, 8, 10, 1, C.teal);
  pc.disc(13, 8, 1.4, C.skyDeep);
  const wing = blur ? C.white : C.lavender;
  pc.ellipse(8, 5, 4, 1.2, wing);
  pc.ellipse(8, 11, 4, 1.2, wing);
  return pc;
}

/** The frame key for a critter: `colour` 0-2 for butterflies, `frame` 0 or 1. */
export type DecalKind = AmbientKind | 'snowman' | 'puddle';

export const ambientKey = (kind: DecalKind, frame: number, colour = 0): string =>
  frameKey(kind === 'butterfly' ? `amb-butterfly${colour}` : `amb-${kind}`, 'front', frame);

function snowman(): PixelCanvas {
  const pc = new PixelCanvas(AMBIENT_CELL, AMBIENT_CELL);
  pc.disc(8, 12, 3.6, C.white);
  pc.disc(8, 7.5, 2.8, C.white);
  pc.disc(8, 4, 2, C.white);
  pc.px(7, 3, C.ink);
  pc.px(9, 3, C.ink);
  pc.px(8, 4, C.orange);
  pc.px(8, 7, C.ink);
  pc.px(8, 9, C.ink);
  pc.line(4, 7, 2, 5, C.wood);
  pc.line(12, 7, 14, 5, C.wood);
  return pc;
}

function puddle(): PixelCanvas {
  const pc = new PixelCanvas(AMBIENT_CELL, AMBIENT_CELL);
  pc.ellipse(8, 8, 6.5, 4, C.water);
  pc.ellipse(7, 7, 3, 1.5, C.skyDeep);
  pc.px(10, 8, C.white);
  return pc;
}

export function buildAmbientSheet(): SpriteSheet {
  const atlas = new AtlasBuilder(AMBIENT_CELL, AMBIENT_CELL, 8);
  for (let c = 0; c < BUTTERFLY_COLOURS; c++)
    for (const f of [0, 1]) atlas.add(ambientKey('butterfly', f, c), butterfly(c, f === 0));
  for (const f of [0, 1]) {
    atlas.add(ambientKey('firefly', f), firefly(f === 1));
    atlas.add(ambientKey('frog', f), frog(f === 1));
    atlas.add(ambientKey('dragonfly', f), dragonfly(f === 1));
  }
  atlas.add(ambientKey('snowman', 0), snowman());
  atlas.add(ambientKey('puddle', 0), puddle());
  return atlas.build();
}
