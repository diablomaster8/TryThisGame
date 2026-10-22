import { GROVE } from '../../config/tuning';
import { Rng } from '../../sim/rng';
import { frameKey } from '../sprites/animations';
import type { SpriteSheet } from '../sprites/atlas';
import { RasterAtlas } from './atlas';
import {
  cone,
  eaveShadow,
  flowerBox,
  plankDoor,
  plankWall,
  plasterWall,
  roofDome,
  roofShingles,
  roofSlate,
  roofThatch,
  roofTiles,
  stoneStep,
  stoneWall,
  timber,
  windowPane,
} from './buildings';
import { fbm, ridged, vnoise } from './noise';
import { stamp } from './buildings';
import { bush, fencePost, lanternPost, LEAF, log, rock, tree, well } from './props';
import { hex, mix, Raster, rimObjects, shade, type RGB } from './raster';

/** Texels per world unit for painted scenery. */
export const PAINT_PPU = 24;

/** Every painted scenery frame, by key; sizes are in texels. */
export type PaintedKind =
  | 'tree-1'
  | 'tree-2'
  | 'tree-3'
  | 'tree-4'
  | 'tree-5'
  | 'tree-6'
  | 'wild-1'
  | 'wild-2'
  | 'wild-3'
  | 'wild-4'
  | 'bush-1'
  | 'bush-2'
  | 'bush-3'
  | 'log'
  | 'rock-1'
  | 'rock-2'
  | 'cottage'
  | 'school'
  | 'dojo'
  | 'well'
  | 'windmill'
  | 'nursery'
  | 'bathhouse'
  | 'workshop'
  | 'lanternPost'
  | 'fencePost'
  | 'stall'
  | 'cottage-lit'
  | 'school-lit'
  | 'dojo-lit'
  | 'windmill-lit'
  | 'nursery-lit'
  | 'lanternPost-lit'
  | 'caveMouth';

function finish(r: Raster): Raster {
  r.tracking = false;
  rimObjects(r);
  return r;
}

function paintTree(seed: number, size: number, tones: RGB[] = LEAF): Raster {
  const w = Math.round(190 * size);
  const h = Math.round(200 * size);
  const r = new Raster(w, h, null);
  r.tracking = true;
  tree(r, new Rng(seed), w / 2, h - 4, size, tones);
  return finish(r);
}

/** The outer wood's trees: a darker, bluer canopy than the fruit trees. */
const WILD_LEAF: RGB[] = [
  '#142f24',
  '#1d4a33',
  '#276440',
  '#357f4e',
  '#4a9a5c',
  '#6cb574',
  '#93cf8e',
].map(hex);

function paintBush(seed: number): Raster {
  const r = new Raster(64, 40, null);
  r.tracking = true;
  bush(r, new Rng(seed), 32, 36, 1);
  return finish(r);
}

function paintRock(salt: number, rx: number, ry: number): Raster {
  const r = new Raster(rx * 2 + 10, ry * 2 + 10, null);
  r.tracking = true;
  rock(r, rx + 5, ry + 5, rx, ry, salt);
  return finish(r);
}

function paintLog(): Raster {
  const r = new Raster(60, 18, null);
  r.tracking = true;
  log(r, 4, 9, 46, 81);
  return finish(r);
}

function paintWell(): Raster {
  const r = new Raster(60, 56, null);
  r.tracking = true;
  well(r, 30, 46);
  return finish(r);
}

function paintLantern(lit = false): Raster {
  const r = new Raster(20, 48, null);
  r.tracking = true;
  lanternPost(r, 9, 46, lit);
  return finish(r);
}

function paintFencePost(): Raster {
  const r = new Raster(18, 26, null);
  r.tracking = true;
  fencePost(r, new Rng(5), 9, 24);
  return finish(r);
}

/** The cottage: plaster and timber, a stone footing, stepped thatch, a chimney. */
function paintCottage(lit = false): Raster {
  const r = new Raster(176, 150, null);
  const rng = new Rng(77);
  r.tracking = true;
  const h = { x: 28, y: 18, w: 120, h: 116, roofH: 46 };
  const wallTop = h.y + h.roofH;
  plasterWall(r, h.x, wallTop, h.w, h.h - h.roofH, 32);
  timber(r, h.x + 2, wallTop, h.x + 2, h.y + h.h, 1.4, 1);
  timber(r, h.x + h.w - 3, wallTop, h.x + h.w - 3, h.y + h.h, 1.4, 2);
  timber(r, h.x + h.w / 3, wallTop, h.x + h.w / 3 - 2, h.y + h.h, 1.2, 3);
  timber(r, h.x + (2 * h.w) / 3, wallTop, h.x + (2 * h.w) / 3 + 2, h.y + h.h, 1.2, 4);
  timber(r, h.x, wallTop + 2, h.x + h.w, wallTop + 1, 1.3, 5);
  timber(r, h.x + 6, h.y + h.h - 10, h.x + h.w / 3 - 4, wallTop + 10, 1, 6);
  timber(r, h.x + h.w - 8, h.y + h.h - 10, h.x + (2 * h.w) / 3 + 6, wallTop + 10, 1, 7);
  stoneWall(r, h.x - 2, h.y + h.h - 9, h.w + 4, 11, 36);
  roofThatch(
    r,
    rng,
    {
      x0: h.x - 22,
      x1: h.x + h.w + 22,
      eaveY: wallTop + 6,
      rx0: h.x + h.w / 2 - 14,
      rx1: h.x + h.w / 2 + 14,
      ridgeY: h.y + 2,
    },
    38,
  );
  eaveShadow(r, h.x, wallTop + 8, h.w, 10);
  stoneWall(r, h.x + h.w - 36, h.y - 14, 14, 28, 45, false, true);
  r.rect(h.x + h.w - 38, h.y - 16, 18, 3, hex('#45454f'));
  plankDoor(r, h.x + h.w / 2 - 12, h.y + h.h - 36, 24, 36, 46);
  stoneStep(r, h.x + h.w / 2 - 16, h.y + h.h, 32);
  for (const wx of [h.x + 14, h.x + h.w - 38]) {
    windowPane(r, wx, wallTop + 16, 24, 22, 48, lit);
    flowerBox(r, rng, wx - 2, wallTop + 38, 26);
  }
  return finish(r);
}

/** The school: a round stone hut with a slate cone and a bell gable. */
function paintSchool(lit = false): Raster {
  const r = new Raster(150, 150, null);
  const rng = new Rng(300);
  r.tracking = true;
  const cx = 75;
  const base = 140;
  for (let y = base - 56; y <= base; y++) {
    for (let x = cx - 50; x <= cx + 50; x++) {
      const dx = (x - cx) / 50;
      const curve = Math.sqrt(Math.max(0, 1 - dx * dx));
      if (curve < 0.08) continue;
      const row = Math.floor((y - (base - 56)) / 7);
      const col = Math.floor((x * curve + (row % 2) * 5) / 10);
      const edge = ridged(x / 3, y / 3, 2, 11) > 0.84;
      let c = mix(
        hex('#8f8f9a'),
        hex('#c6c6d0'),
        vnoise(col * 1.7, row * 1.3, 12) * 0.8 + fbm(x / 4, y / 4, 2, 13) * 0.3,
      );
      c = shade(c, 0.55 + curve * 0.5 - dx * 0.15);
      if (edge) c = shade(c, 0.5);
      if (fbm(x / 5, y / 5, 2, 14) > 0.66 && y > base - 14) c = mix(c, hex('#5f8a3a'), 0.4);
      r.set(x, y, c);
    }
  }
  roofSlate(r, cone(cx, base - 110, base - 52, 62, 4), 15);
  eaveShadow(r, cx - 48, base - 50, 96, 8);
  r.rect(cx - 7, base - 122, 14, 14, hex('#3a2a18'));
  r.tri(cx - 10, base - 122, cx + 10, base - 122, cx, base - 132, hex('#2d3448'));
  r.rect(cx - 5, base - 120, 10, 10, hex('#1a1624'));
  r.ellipse(cx, base - 114, 3, 3.5, hex('#e0b84a'));
  plankDoor(r, cx - 10, base - 30, 20, 30, 16);
  stoneStep(r, cx - 12, base, 24);
  windowPane(r, cx + 18, base - 40, 16, 14, 17, lit);
  windowPane(r, cx - 34, base - 40, 16, 14, 18, lit);
  flowerBox(r, rng, cx + 17, base - 24, 18);
  flowerBox(r, rng, cx - 35, base - 24, 18);
  r.rect(cx - 54, base - 36, 2, 36, hex('#4a3018'));
  r.rect(cx - 70, base - 46, 34, 14, hex('#d9a85a'));
  r.rect(cx - 69, base - 45, 32, 12, hex('#f3d088'));
  r.rect(cx - 71, base - 47, 36, 1, hex('#4a3018'));
  r.rect(cx - 71, base - 32, 36, 1, hex('#4a3018'));
  r.rect(cx - 71, base - 47, 1, 16, hex('#4a3018'));
  r.rect(cx - 36, base - 47, 1, 16, hex('#4a3018'));
  for (let i = 0; i < 4; i++) {
    r.rect(
      cx - 66 + i * 8,
      base - 41,
      5,
      4,
      [hex('#e04a6a'), hex('#3a6ea8'), hex('#f2d34c'), hex('#3f9a3c')][i]!,
    );
  }
  return finish(r);
}

/** The dojo: a timber hall on a raised floor, shoji panels, a noren, two tiers of tiles. */
function paintDojo(lit = false): Raster {
  const r = new Raster(220, 160, null);
  r.tracking = true;
  const x0 = 24;
  const w = 172;
  const base = 150;
  r.rect(x0 + 6, base - 10, w - 12, 10, hex('#3a2616'));
  for (let x = x0 + 10; x < x0 + w - 6; x += 14) r.rect(x, base - 10, 3, 10, hex('#241608'));
  r.rect(x0 + 2, base - 12, w - 4, 3, hex('#6e4525'));
  plasterWall(r, x0 + 4, base - 62, w - 8, 50, 21, hex('#f4ecd8'));
  for (let x = x0 + 4; x < x0 + w - 4; x += 1) {
    for (let y = base - 62; y < base - 12; y++) {
      if ((x - x0 - 4) % 9 === 0 || (y - (base - 62)) % 11 === 0) r.set(x, y, hex('#5a3a1f'), 0.75);
    }
  }
  for (const px of [x0 + 4, x0 + w / 3, x0 + (2 * w) / 3, x0 + w - 7])
    timber(r, px, base - 64, px, base - 12, 2, 22);
  timber(r, x0, base - 62, x0 + w, base - 62, 1.6, 23);
  const ex = x0 + w / 2 - 16;
  r.rect(ex, base - 50, 32, 38, hex('#1a1208'));
  for (let i = 0; i < 3; i++) {
    const cx2 = ex + 2 + i * 10;
    for (let y = base - 50; y < base - 30; y++) {
      r.rect(
        cx2,
        y + (vnoise(y / 6, i, 24) - 0.5) * 2,
        8,
        1,
        mix(hex('#1f3a6e'), hex('#2f5a9e'), vnoise(cx2, y / 5, 25)),
      );
    }
  }
  r.rect(ex, base - 51, 32, 2, hex('#6e4525'));
  for (let i = 0; i < 3; i++) {
    const sw = 30 + i * 6;
    const sy = base - 9 + i * 3;
    r.rect(ex + 16 - sw / 2, sy, sw, 3, mix(hex('#b4b4bf'), hex('#7a7a88'), i / 2));
    r.rect(ex + 16 - sw / 2, sy + 2, sw, 1, hex('#45454f'));
  }
  for (const lx of [ex - 10, ex + 42]) {
    r.rect(lx - 4, base - 44, 8, 11, hex('#e04a3a'));
    r.rect(lx - 3, base - 43, 6, 9, hex('#ff8a5a'));
    r.rect(lx - 2, base - 41, 4, 2, hex('#ffd0a0'));
    r.rect(lx - 1, base - 48, 2, 4, hex('#3a2616'));
  }
  roofTiles(
    r,
    {
      x0: x0 - 10,
      x1: x0 + w + 10,
      eaveY: base - 66,
      rx0: x0 + 10,
      rx1: x0 + w - 10,
      ridgeY: base - 84,
    },
    26,
  );
  eaveShadow(r, x0 + 4, base - 64, w - 8, 9);
  plasterWall(r, x0 + 28, base - 110, w - 56, 26, 27, hex('#f4ecd8'));
  for (const px of [x0 + 28, x0 + w / 2, x0 + w - 31])
    timber(r, px, base - 110, px, base - 84, 1.6, 28);
  windowPane(r, x0 + w / 2 - 8, base - 104, 16, 12, 29, lit);
  roofTiles(
    r,
    {
      x0: x0 + 12,
      x1: x0 + w - 12,
      eaveY: base - 112,
      rx0: x0 + 60,
      rx1: x0 + w - 60,
      ridgeY: base - 134,
    },
    30,
  );
  eaveShadow(r, x0 + 28, base - 110, w - 56, 7);
  return finish(r);
}

/** The workshop: a plank barn with an open front, a shingle roof and a stone chimney. */
function paintWorkshop(): Raster {
  const r = new Raster(200, 150, null);
  r.tracking = true;
  const x0 = 30;
  const w = 140;
  const base = 144;
  plankWall(r, x0, base - 70, w, 70, 31);
  const bx = x0 + 18;
  r.rect(bx, base - 58, 74, 58, hex('#1e1308'));
  for (let y = base - 58; y < base; y++) {
    for (let x = bx; x < bx + 74; x++)
      r.set(x, y, hex('#3a2616'), fbm(x / 12, y / 12, 2, 32) * 0.5);
  }
  r.rect(bx + 4, base - 24, 62, 5, hex('#8a5a32'));
  r.rect(bx + 4, base - 19, 62, 2, hex('#4a2e18'));
  r.rect(bx + 6, base - 19, 3, 19, hex('#4a2e18'));
  r.rect(bx + 61, base - 19, 3, 19, hex('#4a2e18'));
  r.rect(bx + 10, base - 48, 54, 2, hex('#6e4525'));
  for (let i = 0; i < 5; i++) {
    r.rect(
      bx + 14 + i * 10,
      base - 54,
      5,
      6,
      [hex('#9a9aa6'), hex('#c98d4f'), hex('#5f5f6a'), hex('#e0b84a'), hex('#9a9aa6')][i]!,
    );
  }
  r.rect(bx + 20, base - 44, 3, 18, hex('#9a9aa6'));
  r.rect(bx + 18, base - 44, 7, 4, hex('#c6c6d0'));
  r.rect(bx + 40, base - 36, 10, 10, hex('#6e4525'));
  r.rect(bx + 40, base - 36, 10, 2, hex('#9a6a3c'));
  r.ellipse(bx + 50, base - 29, 2.5, 2.5, hex('#5f5f6a'));
  plankDoor(r, bx - 12, base - 58, 12, 58, 33, false);
  plankDoor(r, bx + 74, base - 58, 12, 58, 34, false);
  for (let y = base - 18; y < base; y++) {
    const half = 7 + Math.sin(((y - (base - 18)) / 18) * Math.PI) * 1.5;
    r.rect(
      x0 + w - 24 - half,
      y,
      half * 2,
      1,
      mix(hex('#5a3a1f'), hex('#9a6a3c'), ridged((x0 + w - 24) / 3, y / 3, 2, 35)),
    );
  }
  r.rect(x0 + w - 32, base - 14, 16, 2, hex('#3a3a46'));
  r.rect(x0 + w - 32, base - 6, 16, 2, hex('#3a3a46'));
  roofShingles(
    r,
    {
      x0: x0 - 10,
      x1: x0 + w + 10,
      eaveY: base - 72,
      rx0: x0 + w / 2 - 8,
      rx1: x0 + w / 2 + 8,
      ridgeY: base - 112,
    },
    36,
  );
  eaveShadow(r, x0, base - 70, w, 9);
  stoneWall(r, x0 + w - 42, base - 124, 14, 36, 37, false, true);
  r.rect(x0 + w - 44, base - 126, 18, 3, hex('#45454f'));
  return finish(r);
}

/** The bathhouse: rounded stones, a cornice, a copper dome gone green, a round window. */
function paintBathhouse(): Raster {
  const r = new Raster(190, 140, null);
  r.tracking = true;
  const x0 = 20;
  const w = 140;
  const base = 136;
  stoneWall(r, x0, base - 62, w, 62, 41, true);
  r.rect(x0 - 4, base - 66, w + 8, 5, hex('#6a6a76'));
  r.rect(x0 - 4, base - 66, w + 8, 1, hex('#b4b4bf'));
  stoneWall(r, x0 + 18, base - 80, w - 36, 14, 42, true);
  roofDome(r, x0 + w / 2, base - 80, w / 2 - 12, 34, 43);
  eaveShadow(r, x0, base - 61, w, 7);
  for (let y = -11; y <= 11; y++) {
    for (let x = -11; x <= 11; x++) {
      const d = Math.hypot(x, y);
      if (d > 11) continue;
      const wx = x0 + w / 2 + x;
      const wy = base - 40 + y;
      if (d > 9) r.set(wx, wy, hex('#4a3018'));
      else r.set(wx, wy, mix(hex('#9ad0ff'), hex('#dff2ff'), vnoise(x / 4 + 3, y / 3, 44)));
      if ((Math.abs(x) < 1 || Math.abs(y) < 1) && d < 9) r.set(wx, wy, hex('#4a3018'));
    }
  }
  plankDoor(r, x0 + 14, base - 32, 18, 32, 45, false);
  r.rect(x0 + 12, base - 35, 22, 3, hex('#6a6a76'));
  stoneStep(r, x0 + 12, base, 22);
  windowPane(r, x0 + w - 36, base - 44, 18, 12, 46, true);
  const tx = x0 + w + 2;
  for (let y = base - 16; y < base; y++) {
    const half = 11 + Math.sin(((y - (base - 16)) / 16) * Math.PI) * 1;
    r.rect(
      tx - half,
      y,
      half * 2,
      1,
      mix(hex('#5a3a1f'), hex('#9a6a3c'), ridged(tx / 3, y / 3, 2, 47)),
    );
  }
  r.ellipse(tx, base - 16, 11, 3.5, hex('#4a3018'));
  r.ellipse(tx, base - 16, 9, 2.5, hex('#8ad0f0'));
  return finish(r);
}

/** The nursery: a small plaster house with a rounded slate roof and an egg on the sign. */
function paintNursery(lit = false): Raster {
  const r = new Raster(150, 130, null);
  const rng = new Rng(500);
  r.tracking = true;
  const x0 = 30;
  const w = 90;
  const base = 124;
  plasterWall(r, x0, base - 50, w, 50, 61, hex('#f6e4e6'));
  timber(r, x0 + 2, base - 50, x0 + 2, base, 1.3, 62);
  timber(r, x0 + w - 3, base - 50, x0 + w - 3, base, 1.3, 63);
  timber(r, x0, base - 48, x0 + w, base - 49, 1.2, 64);
  stoneWall(r, x0 - 2, base - 8, w + 4, 10, 65);
  roofSlate(
    r,
    {
      x0: x0 - 14,
      x1: x0 + w + 14,
      eaveY: base - 52,
      rx0: x0 + w / 2 - 8,
      rx1: x0 + w / 2 + 8,
      ridgeY: base - 90,
    },
    66,
  );
  eaveShadow(r, x0, base - 50, w, 8);
  plankDoor(r, x0 + w / 2 - 9, base - 28, 18, 28, 67);
  stoneStep(r, x0 + w / 2 - 12, base, 24);
  windowPane(r, x0 + 8, base - 36, 16, 14, 68, lit);
  flowerBox(r, rng, x0 + 7, base - 20, 18);
  // Egg sign.
  r.rect(x0 + w - 28, base - 40, 20, 16, hex('#d9a85a'));
  r.rect(x0 + w - 29, base - 41, 22, 1, hex('#4a3018'));
  r.rect(x0 + w - 29, base - 24, 22, 1, hex('#4a3018'));
  r.rect(x0 + w - 29, base - 41, 1, 18, hex('#4a3018'));
  r.rect(x0 + w - 8, base - 41, 1, 18, hex('#4a3018'));
  r.ellipse(x0 + w - 18, base - 32, 5, 6.5, hex('#bfe0ff'));
  r.set(x0 + w - 20, base - 35, hex('#ffffff'));
  return finish(r);
}

/** The windmill: a tapering stone tower, a shingled cap and four cloth sails. */
function paintWindmill(lit = false): Raster {
  const r = new Raster(170, 200, null);
  const rng = new Rng(600);
  r.tracking = true;
  const cx = 88;
  const base = 192;
  for (let y = base - 96; y <= base; y++) {
    const t = (y - (base - 96)) / 96;
    const half = 18 + t * 14;
    for (let x = cx - half; x <= cx + half; x++) {
      const dx = (x - cx) / half;
      const curve = Math.sqrt(Math.max(0.1, 1 - dx * dx));
      const row = Math.floor((y - (base - 96)) / 6);
      const col = Math.floor((x * curve + (row % 2) * 4) / 8);
      const edge = ridged(x / 3, y / 3, 2, 51) > 0.84;
      let c = mix(
        hex('#8c8c96'),
        hex('#d0d0d8'),
        vnoise(col * 1.9, row * 1.1, 52) * 0.8 + fbm(x / 4, y / 4, 2, 53) * 0.3,
      );
      c = shade(c, 0.5 + curve * 0.55 - dx * 0.15);
      if (edge) c = shade(c, 0.5);
      if (fbm(x / 5, y / 5, 2, 54) > 0.66 && y > base - 16) c = mix(c, hex('#5f8a3a'), 0.4);
      r.set(x, y, c);
    }
  }
  plankWall(r, cx - 20, base - 112, 40, 16, 55, hex('#7a5230'));
  roofShingles(r, cone(cx, base - 140, base - 112, 24, 3), 56);
  eaveShadow(r, cx - 19, base - 111, 38, 6);
  const hx = cx + 2;
  const hy = base - 104;
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 + 0.35;
    const px = -Math.sin(a);
    const py = Math.cos(a);
    for (let s = 8; s <= 52; s += 1) {
      for (let t = 0; t <= 12; t += 1) {
        const sx = hx + Math.cos(a) * s + px * t;
        const sy = hy + Math.sin(a) * s + py * t;
        const edge = t === 0 || t === 12 || s === 8 || s === 52;
        const bar = s % 11 === 0 || t === 6;
        const cloth = mix(hex('#d8d0c4'), hex('#f4efe6'), vnoise(s / 4, t / 3, 60 + k));
        r.set(sx, sy, edge ? hex('#2a1a0e') : bar ? hex('#6e4525') : cloth);
      }
    }
  }
  r.disc(hx, hy, 3.5, hex('#3a2616'));
  r.disc(hx, hy, 1.5, hex('#e0b84a'));
  plankDoor(r, cx - 8, base - 26, 16, 26, 57);
  stoneStep(r, cx - 10, base, 20);
  windowPane(r, cx - 6, base - 60, 12, 10, 58, lit);
  flowerBox(r, rng, cx - 40, base - 2, 24);
  return finish(r);
}

/** A market stall for the square: a plank counter, posts, a striped awning, goods. */
function paintStall(): Raster {
  const r = new Raster(72, 60, null);
  const rng = new Rng(700);
  r.tracking = true;
  for (const px of [10, 62]) {
    for (let i = 0; i < 40; i++) {
      stamp(
        r,
        px + (vnoise(i / 9, px, 71) - 0.5) * 1.2,
        56 - i,
        1.4,
        mix(hex('#4a2e18'), hex('#8a5a32'), ridged(px, i / 3, 2, 72)),
      );
    }
  }
  plankWall(r, 8, 36, 56, 20, 73);
  r.rect(6, 34, 60, 3, hex('#d9a76a'));
  for (let y = 10; y < 24; y++) {
    const half = 30 + ((y - 10) / 14) * 6;
    for (let x = 36 - half; x <= 36 + half; x++) {
      const stripe = Math.floor((x + y * 0.3) / 6) % 2 === 0;
      r.set(x, y + Math.sin((x / 72) * Math.PI) * 1.5, stripe ? hex('#e04a6a') : hex('#f4efe6'));
    }
  }
  for (let x = 6; x <= 66; x += 6)
    r.tri(x - 3, 24, x + 3, 24, x, 29, (x / 6) % 2 === 0 ? hex('#e04a6a') : hex('#f4efe6'));
  for (let i = 0; i < 6; i++) {
    r.disc(
      14 + i * 9 + rng.float(-1, 1),
      32,
      2.6,
      [hex('#ff9a3a'), hex('#8fd262'), hex('#f2d34c'), hex('#e04a6a')][i % 4]!,
    );
  }
  r.tracking = false;
  rimObjects(r);
  return r;
}

/** Build the whole painted scenery sheet (a few hundred milliseconds, once). */
export function buildPaintedScenery(): SpriteSheet {
  const atlas = new RasterAtlas(2048);
  const add = (kind: PaintedKind, raster: Raster) => atlas.add(frameKey(kind, 'front', 0), raster);
  GROVE.trees.forEach((_, i) =>
    add(`tree-${i + 1}` as PaintedKind, paintTree(101 + i * 7, 1 + (i % 2) * 0.12)),
  );
  for (let i = 0; i < 4; i++)
    add(`wild-${i + 1}` as PaintedKind, paintTree(301 + i * 13, 0.95 + (i % 3) * 0.1, WILD_LEAF));
  add('bush-1', paintBush(11));
  add('bush-2', paintBush(12));
  add('bush-3', paintBush(13));
  add('log', paintLog());
  add('rock-1', paintRock(80, 14, 8));
  add('rock-2', paintRock(81, 8, 5));
  add('cottage', paintCottage());
  add('school', paintSchool());
  add('dojo', paintDojo());
  add('well', paintWell());
  add('windmill', paintWindmill());
  add('nursery', paintNursery());
  add('bathhouse', paintBathhouse());
  add('workshop', paintWorkshop());
  add('lanternPost', paintLantern());
  // Dusk variants: the same buildings with their windows lit.
  add('cottage-lit', paintCottage(true));
  add('school-lit', paintSchool(true));
  add('dojo-lit', paintDojo(true));
  add('windmill-lit', paintWindmill(true));
  add('nursery-lit', paintNursery(true));
  add('lanternPost-lit', paintLantern(true));
  add('fencePost', paintFencePost());
  add('stall', paintStall());
  add('caveMouth', paintCaveMouth());
  return atlas.build();
}

/** The Hollow Below's mouth: a dark arch in the rock with a worn step and a lantern. */
function paintCaveMouth(): Raster {
  const r = new Raster(96, 70, null);
  r.tracking = true;
  for (let y = 0; y < 70; y++) {
    for (let x = 0; x < 96; x++) {
      const dx = (x - 48) / 46;
      const dy = (y - 50) / 50;
      const edge = fbm(x / 9, y / 9, 3, 91) - 0.5;
      // A rough rock lump around the arch.
      if (dx * dx + dy * dy + edge * 0.45 > 1 || y < 4) continue;
      const rockN = ridged(x / 11, y / 11, 4, 92);
      let c = mix(hex('#4a4150'), hex('#a89cb4'), rockN * 0.6 + fbm(x / 20, y / 20, 2, 93) * 0.4);
      if (ridged(x / 6, y / 9, 3, 94) > 0.82) c = shade(c, 0.55);
      if (y > 56 && fbm(x / 7, y / 7, 2, 95) > 0.5) c = mix(c, hex('#4f8a3a'), 0.7);
      // The opening: an arch that goes black inside.
      const ax = (x - 48) / 22;
      const ay = (y - 60) / 34;
      const arch = ax * ax + ay * ay + (vnoise(x / 6, y / 6, 96) - 0.5) * 0.12;
      if (y >= 26 && arch < 1) {
        const depth = 1 - arch;
        c = mix(hex('#2a2238'), hex('#07050a'), Math.min(1, depth * 1.8));
        if (arch > 0.82) c = mix(c, hex('#8a7a9a'), (arch - 0.82) * 3); // the lit rim
      }
      r.set(x, y, c);
    }
  }
  // A worn step at the threshold and a small lantern hung by the opening.
  r.rect(30, 64, 36, 4, hex('#8a8290'));
  r.rect(30, 64, 36, 1, hex('#c4bcc6'));
  r.rect(70, 30, 2, 8, hex('#3a3a44'));
  r.rect(67, 38, 8, 9, hex('#3a3a44'));
  r.rect(68, 39, 6, 7, hex('#ffd25a'));
  r.rect(69, 40, 4, 5, hex('#fff6d0'));
  r.tracking = false;
  rimObjects(r);
  return r;
}

/** A painted frame's pixels, as `getImageData` gives them. */
export interface CrownSource {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

const SNOW = { top: '#f7fbff', body: '#e6eff8', shade: '#a9bfdc' } as const;

/**
 * H8: a snow crown cut to a painted tree or bush frame. Snow lies where the canopy's own
 * pixels face the sky (a green pixel with air above it), `depth` painted pixels thick and a
 * little uneven, so it follows every lobe's top edge instead of capping the whole crown with
 * one blob. The lowest row is a 1 px blue shade, so the white sits on the leaves. Everything
 * else in the frame is transparent: it is drawn over the stock sprite, same size and place.
 */
export function paintSnowCrown(src: CrownSource, depth: number, seed = 0): Raster {
  const { width: w, height: h } = src;
  const r = new Raster(w, h, null);
  r.tracking = true;
  const top = hex(SNOW.top);
  const body = hex(SNOW.body);
  const edge = hex(SNOW.shade);
  const leafy = (x: number, y: number): boolean => {
    if (x < 0 || y < 0 || x >= w || y >= h) return false;
    const i = (y * w + x) * 4;
    if (src.data[i + 3]! < 128) return false;
    const R = src.data[i]!;
    const G = src.data[i + 1]!;
    const B = src.data[i + 2]!;
    return G >= R * 0.92 && G >= B * 0.8;
  };
  const solid = (x: number, y: number): boolean =>
    x >= 0 && y >= 0 && x < w && y < h && src.data[(y * w + x) * 4 + 3]! >= 128;
  const limit = Math.round(h * 0.78);
  for (let x = 0; x < w; x++) {
    let air = 2;
    for (let y = 0; y < limit; y++) {
      if (!solid(x, y)) {
        air = Math.min(2, air + 1);
        continue;
      }
      if (!leafy(x, y) || air < 1) {
        air = 0;
        continue;
      }
      // A run of snow from here down; the depth wanders along the crown.
      const d = Math.max(
        2,
        Math.round(depth * (0.55 + 0.9 * vnoise(x / 4.5 + seed, y / 9, 71 + seed))),
      );
      let n = 0;
      for (let k = 0; k < d && leafy(x, y + k); k++) n++;
      for (let k = 0; k < n; k++)
        r.set(x, y + k, k === n - 1 && n >= 3 ? edge : k < 2 ? top : body);
      air = 0;
      y += n;
    }
  }
  r.tracking = false;
  return r;
}
