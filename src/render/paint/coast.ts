import { hash, hex, Raster, rimObjects, shade } from './raster';
import { RasterAtlas } from './atlas';
import type { SpriteSheet } from '../sprites/atlas';

/**
 * WORLD-35 (R11 lane D, d7): the shore's pieces in the painted pixel style, foot on the bottom
 * row, in their own small atlas built on first use: three dune fills (a wind-bent sea pine, a
 * gorse bush, a marram clump), five beach props (a shell, driftwood, a lobster pot, a bucket and
 * spade, a starfish), the stilt house, the lighthouse, a sandcastle, a rock, the signpost, the
 * stepping stones and a rowing boat. Drawn by `render/region-shore.ts`.
 */

const BARK = hex('#6b4a2e');
const PINE = hex('#2f5a45');
const GORSE = hex('#3f6a32');
const BLOOM = hex('#f2c94a');
const MARRAM = hex('#b8b06a');
const SAND = hex('#e2c98e');
const STONE = hex('#8d8a84');
const PLANK = hex('#9c6e3e');
const ROOF = hex('#4a6f8c');
const WHITE = hex('#f4f1e8');
const RED = hex('#c8463a');
const GLASS = hex('#ffe9a0');

function canvas(w: number, h: number): Raster {
  const r = new Raster(w, h, null);
  r.tracking = true;
  return r;
}

function finish(r: Raster): Raster {
  r.tracking = false;
  rimObjects(r);
  return r;
}

function paintFill(kind: number): Raster {
  if (kind === 0) {
    // A sea pine leaning away from the wind: a crooked trunk, flat crowns.
    const r = canvas(64, 80);
    const b = r.h - 1;
    r.line(30, b, 34, b - 30, BARK);
    r.line(31, b, 35, b - 30, BARK);
    r.line(34, b - 30, 42, b - 52, BARK);
    r.line(35, b - 30, 43, b - 52, shade(BARK, 0.8));
    for (const [x, y, w] of [
      [40, 24, 22],
      [30, 34, 18],
      [46, 14, 14],
    ] as const) {
      r.ellipse(x, y, w, 6, shade(PINE, 0.8));
      r.ellipse(x - 2, y - 2, w - 4, 4, PINE);
      r.ellipse(x - 5, y - 3, w * 0.4, 2, shade(PINE, 1.25));
    }
    return finish(r);
  }
  if (kind === 1) {
    // Gorse: a dark round bush flecked with yellow.
    const r = canvas(44, 32);
    const b = r.h - 1;
    r.ellipse(22, b - 12, 20, 12, shade(GORSE, 0.8));
    r.ellipse(19, b - 15, 15, 9, GORSE);
    for (let i = 0; i < 26; i++)
      r.set(4 + hash(i, 4) * 36, b - 4 - hash(5, i) * 20, i % 3 ? BLOOM : shade(BLOOM, 1.2));
    return finish(r);
  }
  // Marram: pale blades fanning out of the sand.
  const r = canvas(36, 30);
  const b = r.h - 1;
  for (let i = 0; i < 11; i++) {
    const a = Math.PI * (0.18 + (i / 10) * 0.64);
    const len = 18 + hash(i, 9) * 9;
    r.line(
      18,
      b,
      18 - Math.cos(a) * len,
      b - Math.sin(a) * len,
      shade(MARRAM, 0.8 + (i % 3) * 0.15),
    );
  }
  return finish(r);
}

function paintProp(kind: number): Raster {
  const r = canvas(24, 20);
  const b = r.h - 1;
  if (kind === 0) {
    // A scallop shell.
    r.ellipse(12, b - 5, 7, 5, hex('#f1c6a8'));
    for (let i = -2; i <= 2; i++) r.line(12, b, 12 + i * 3, b - 9, hex('#d89a7a'));
  } else if (kind === 1) {
    r.rect(2, b - 4, 20, 4, hex('#b6a58c'));
    r.rect(2, b - 4, 20, 1, hex('#d8cbb4'));
    r.line(16, b - 4, 21, b - 9, hex('#b6a58c'));
  } else if (kind === 2) {
    // A lobster pot: a net dome on a board.
    r.rect(3, b - 2, 18, 2, PLANK);
    r.ellipse(12, b - 7, 8, 6, hex('#5a4a3a'));
    for (let x = 5; x < 20; x += 3) r.line(x, b - 2, 12, b - 12, hex('#c9b894'));
  } else if (kind === 3) {
    r.rect(5, b - 9, 9, 9, RED);
    r.rect(5, b - 9, 9, 2, shade(RED, 1.3));
    r.line(16, b, 20, b - 13, PLANK);
    r.rect(18, b - 3, 4, 3, hex('#5f84b0'));
  } else {
    // A starfish.
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      r.line(12, b - 5, 12 + Math.cos(a) * 7, b - 5 + Math.sin(a) * 4, hex('#e47a4a'));
    }
    r.disc(12, b - 5, 2, hex('#f0a070'));
  }
  return finish(r);
}

/** A house on stilts: plank walls, a slate-blue roof, a lit window. */
function paintHouse(seed: number): Raster {
  const r = canvas(70, 86);
  const b = r.h - 1;
  for (const x of [10, 26, 44, 60]) r.rect(x, b - 26, 3, 26, shade(PLANK, 0.6));
  r.rect(4, b - 28, 62, 4, PLANK);
  const wall = shade(PLANK, 1.05 + (seed % 3) * 0.06);
  r.rect(8, b - 58, 54, 30, wall);
  for (let y = b - 56; y < b - 28; y += 4) r.rect(8, y, 54, 1, shade(wall, 0.8));
  r.tri(2, b - 58, 68, b - 58, 35, b - 82, ROOF);
  r.tri(2, b - 58, 35, b - 82, 35, b - 58, shade(ROOF, 1.2));
  r.rect(30, b - 46, 10, 18, shade(PLANK, 0.5));
  r.rect(14, b - 50, 10, 8, GLASS);
  r.rect(48, b - 50, 10, 8, GLASS);
  // A net hung on the rail.
  for (let x = 6; x < 30; x += 4) r.line(x, b - 24, x + 2, b - 16, hex('#c9b894'));
  return finish(r);
}

function paintLighthouse(): Raster {
  const r = canvas(60, 170);
  const b = r.h - 1;
  r.ellipse(30, b - 4, 26, 6, STONE);
  for (let y = 30; y < b - 6; y++) {
    const t = (y - 30) / (b - 36);
    const w = 11 + t * 9;
    const band = Math.floor((y - 30) / 22) % 2 === 0;
    const c = band ? RED : WHITE;
    r.rect(30 - w, y, w * 2, 1, c);
    r.rect(30 - w, y, 3, 1, shade(c, 1.15));
    r.rect(30 + w - 3, y, 3, 1, shade(c, 0.75));
  }
  r.rect(16, 24, 28, 6, hex('#3a3a44'));
  r.rect(19, 10, 22, 14, GLASS);
  r.rect(19, 10, 22, 2, shade(GLASS, 1.1));
  r.tri(16, 10, 44, 10, 30, 0, hex('#3a3a44'));
  r.rect(26, b - 30, 8, 24, shade(PLANK, 0.5));
  return finish(r);
}

function paintCastle(): Raster {
  const r = canvas(40, 32);
  const b = r.h - 1;
  r.ellipse(20, b - 2, 18, 4, shade(SAND, 0.85));
  r.rect(6, b - 14, 28, 12, SAND);
  for (const x of [6, 16, 26]) {
    r.rect(x, b - 22, 8, 8, shade(SAND, 1.05));
    r.rect(x, b - 24, 2, 2, SAND);
    r.rect(x + 6, b - 24, 2, 2, SAND);
  }
  r.rect(17, b - 9, 6, 7, shade(SAND, 0.6));
  r.line(20, b - 22, 20, b - 30, PLANK);
  r.tri(20, b - 30, 27, b - 28, 20, b - 26, RED);
  return finish(r);
}

function paintRock(): Raster {
  const r = canvas(44, 30);
  const b = r.h - 1;
  r.ellipse(22, b - 9, 20, 10, shade(STONE, 0.75));
  r.ellipse(19, b - 12, 14, 7, STONE);
  r.ellipse(15, b - 15, 6, 3, shade(STONE, 1.25));
  // Weed and a limpet at the waterline.
  r.rect(4, b - 3, 36, 2, hex('#4a6a3a'));
  r.disc(30, b - 7, 2, hex('#d9cbb0'));
  return finish(r);
}

function paintSign(): Raster {
  const r = canvas(30, 40);
  const b = r.h - 1;
  r.rect(14, b - 34, 3, 34, PLANK);
  r.rect(3, b - 34, 24, 8, shade(PLANK, 1.2));
  r.tri(27, b - 34, 27, b - 26, 30, b - 30, shade(PLANK, 1.2));
  r.rect(4, b - 24, 20, 7, shade(PLANK, 1.1));
  r.tri(4, b - 24, 4, b - 17, 1, b - 21, shade(PLANK, 1.1));
  r.rect(6, b - 31, 16, 1, shade(PLANK, 0.6));
  r.rect(7, b - 21, 14, 1, shade(PLANK, 0.6));
  return finish(r);
}

function paintStones(): Raster {
  const r = canvas(48, 14);
  const b = r.h - 1;
  for (const x of [6, 18, 30, 42]) {
    r.ellipse(x, b - 4, 5, 3, shade(STONE, 0.8));
    r.ellipse(x - 1, b - 5, 3, 2, shade(STONE, 1.15));
  }
  return finish(r);
}

function paintBoat(): Raster {
  const r = canvas(60, 24);
  const b = r.h - 1;
  r.tri(2, b - 12, 58, b - 12, 50, b, hex('#3f6f8f'));
  r.tri(2, b - 12, 50, b, 10, b, hex('#3f6f8f'));
  r.rect(4, b - 12, 54, 2, WHITE);
  r.rect(22, b - 16, 3, 4, PLANK);
  r.line(10, b - 14, 44, b - 18, PLANK);
  return finish(r);
}

let sheet: SpriteSheet | null = null;

export function coastSheet(): SpriteSheet {
  if (sheet) return sheet;
  const atlas = new RasterAtlas(1024);
  for (const k of [0, 1, 2]) atlas.add(`tree-${k}`, paintFill(k));
  for (const k of [0, 1, 2, 3, 4]) atlas.add(`prop-${k}`, paintProp(k));
  for (const k of [0, 1, 2]) atlas.add(`house-${k}`, paintHouse(k));
  atlas.add('light', paintLighthouse());
  atlas.add('castle', paintCastle());
  atlas.add('rock', paintRock());
  atlas.add('sign', paintSign());
  atlas.add('stones', paintStones());
  atlas.add('boat', paintBoat());
  sheet = atlas.build();
  return sheet;
}
