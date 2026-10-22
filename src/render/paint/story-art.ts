import { Rng } from '../../sim/rng';
import { frameKey } from '../sprites/animations';
import type { SpriteSheet } from '../sprites/atlas';
import { RasterAtlas } from './atlas';
import {
  eaveShadow,
  plankDoor,
  plasterWall,
  roofSlate,
  stoneStep,
  stoneWall,
  windowPane,
} from './buildings';
import { fbm, ridged } from './noise';
import { rock, tree } from './props';
import { hash, hex, mix, Raster, rimObjects, shade, type RGB } from './raster';

/**
 * Painted sprites for the story places (campaign graphics C8, H5, H7), in the pixel
 * view's own style: frosted trees, the low hills, Corvin's grey house with its one lit
 * window and his gate, the pen gate leaves, the cold fire ring, a bowl, the ledge behind
 * the falls, the crest hawthorn, Briar's ring of stones, and a dithered blue halo. One
 * sheet, built once (a few hundred milliseconds), drawn through the sprite batch. Frames
 * are keyed with `frameKey(name, 'front', 0)` as the scenery sheet's are, and painted at
 * 32 texels to the world unit.
 */
const FROST_LEAF: RGB[] = ['#40586a', '#587288', '#7e97ab', '#a9bfd0', '#d2e1ec', '#f2f8fd'].map(
  hex,
);

function begin(w: number, h: number): Raster {
  const r = new Raster(w, h, null);
  r.tracking = true;
  return r;
}

function finish(r: Raster): Raster {
  r.tracking = false;
  rimObjects(r);
  return r;
}

function frostTree(seed: number, size: number): Raster {
  const w = Math.round(150 * size);
  const h = Math.round(170 * size);
  const r = begin(w, h);
  tree(r, new Rng(seed), w / 2, h - 4, size * 0.8, FROST_LEAF);
  // Snow lying along the ground at the foot.
  for (let x = -14; x <= 14; x++)
    r.set(w / 2 + x, h - 3 - (Math.abs(x) > 9 ? 1 : 0), hex('#eef5fb'));
  return finish(r);
}

/** A strip of low hills: a ridge of noise, snow on top, slate and spruce below. */
function hillCard(): Raster {
  const w = 384;
  const h = 96;
  const r = begin(w, h);
  for (let x = 0; x < w; x++) {
    // Both ends taper to nothing, so the card reads as a mound and not a wall.
    const win = Math.pow(Math.sin((Math.PI * (x + 0.5)) / w), 0.7);
    const top = h - 6 - (6 + (fbm(x / 60, 0, 3, 7) * 56 + Math.sin(x / 33) * 6 + 14)) * win;
    for (let y = Math.max(0, Math.floor(top)); y < h; y++) {
      // A broken foot: the lowest rows thin out into the snow they stand in.
      if (y > h - 7 && hash(x, y, 8) < (y - (h - 7)) / 7) continue;
      const depth = y - top;
      const snow = depth < 9 + fbm(x / 8, y / 8, 2, 9) * 8;
      let c = snow
        ? mix(hex('#e8f1f9'), hex('#c6d8e6'), depth / 18)
        : mix(hex('#5e7689'), hex('#3a4d5e'), (y - top) / 60);
      if (!snow && ridged(x / 9, y / 9, 2, 3) > 0.8) c = shade(c, 0.85);
      r.set(x, y, c);
    }
  }
  return finish(r);
}

/** Corvin's house: grey plaster, a slate roof under snow, a plank door, one lit window. */
function corvinHouse(): Raster {
  const r = begin(220, 160);
  const rng = new Rng(61);
  const x0 = 32;
  const w = 156;
  const wallTop = 70;
  const base = 142;
  plasterWall(r, x0, wallTop, w, base - wallTop, 71, hex('#a6abb8'));
  stoneWall(r, x0 - 2, base - 9, w + 4, 11, 72);
  roofSlate(
    r,
    {
      x0: x0 - 16,
      x1: x0 + w + 16,
      eaveY: wallTop + 6,
      rx0: x0 + w / 2 - 12,
      rx1: x0 + w / 2 + 12,
      ridgeY: 22,
    },
    73,
  );
  eaveShadow(r, x0, wallTop + 8, w, 10);
  // Snow along the ridge and the eave: pale bands that break up with noise.
  for (let y = 18; y < wallTop + 12; y++)
    for (let x = x0 - 18; x < x0 + w + 18; x++) {
      const [l, rt] = [
        x0 -
          16 +
          ((x0 + w / 2 - 12 - (x0 - 16)) * (wallTop + 6 - Math.min(y, wallTop + 6))) /
            (wallTop - 16),
        x0 +
          w +
          16 -
          ((x0 + w + 16 - (x0 + w / 2 + 12)) * (wallTop + 6 - Math.min(y, wallTop + 6))) /
            (wallTop - 16),
      ];
      if (x < l || x > rt) continue;
      const lay = y < 30 || y > wallTop - 2 || fbm(x / 7, y / 7, 2, 74) > 0.66;
      if (lay && fbm(x / 5, y / 5, 2, 75) > 0.3) r.set(x, y, hex('#f1f7fc'));
    }
  r.rect(x0 + w - 44, 6, 16, 30, hex('#454b5c'));
  r.rect(x0 + w - 46, 4, 20, 5, hex('#eef5fb'));
  plankDoor(r, x0 + w / 2 - 14, base - 40, 28, 40, 76);
  stoneStep(r, x0 + w / 2 - 18, base, 36);
  // The one lit window, warm in a cold house.
  windowPane(r, x0 + 20, wallTop + 22, 28, 24, 77, true);
  windowPane(r, x0 + w - 48, wallTop + 22, 28, 24, 78, false);
  void rng;
  return finish(r);
}

/** Corvin's gate: two posts, a lintel with snow on it, two braced leaves swung half open. */
function greyGate(): Raster {
  const r = begin(130, 96);
  const wood = (x: number, y: number): RGB =>
    mix(hex('#6c7282'), hex('#a3a9b8'), fbm(x / 4, y / 6, 2, 81));
  const post = (x: number): void => {
    for (let y = 14; y < 92; y++)
      for (let dx = 0; dx < 10; dx++)
        r.set(x + dx, y, shade(wood(x + dx, y), dx < 3 ? 1.1 : dx > 7 ? 0.8 : 1));
  };
  post(10);
  post(110);
  for (let x = 4; x < 126; x++) for (let y = 8; y < 18; y++) r.set(x, y, wood(x, y));
  for (let x = 3; x < 127; x++) for (let y = 4; y < 8; y++) r.set(x, y, hex('#f0f6fb'));
  // The leaves, seen in perspective as narrowed panels with a brace.
  for (const side of [-1, 1]) {
    const hx = side < 0 ? 20 : 110;
    const wdt = 28;
    for (let i = 0; i < wdt; i++) {
      const x = hx + side * i;
      const lean = Math.round(i * 0.18);
      for (const y of [40, 74]) for (let t = 0; t < 4; t++) r.set(x, y + lean + t, wood(x, y + t));
      const diag = 40 + Math.round((i / wdt) * 34);
      for (let t = 0; t < 3; t++) r.set(x, diag + lean + t, shade(wood(x, diag), 0.85));
    }
    for (let y = 40; y < 78; y++)
      for (let t = 0; t < 4; t++) r.set(hx + side * (wdt - 1) - side * t, y + 5, wood(hx, y));
  }
  // A hook for a lantern, unlit.
  r.rect(100, 18, 2, 10, hex('#3a3e4c'));
  return finish(r);
}

/** A pen's gate leaf: swung out (a panel with two rails) or shut (an end-on stile). */
function leaf(open: boolean): Raster {
  const w = open ? 90 : 14;
  const h = 32;
  const r = begin(w, h);
  const c = (x: number, y: number): RGB =>
    mix(hex('#6c6688'), hex('#a39dbb'), fbm(x / 5, y / 3, 2, 85));
  if (open) {
    for (let x = 0; x < w; x++)
      for (const y of [8, 22]) for (let t = 0; t < 4; t++) r.set(x, y + t, c(x, y));
    for (let y = 2; y < h - 2; y++) for (let t = 0; t < 5; t++) r.set(t, y, c(t, y));
    for (let y = 2; y < h - 2; y++) for (let t = 0; t < 5; t++) r.set(w - 1 - t, y, c(t, y));
  } else {
    for (let y = 2; y < h - 1; y++) for (let t = 0; t < 5; t++) r.set(4 + t, y, c(t, y));
    for (const y of [8, 22]) for (let x = 0; x < w; x++) r.set(x, y, c(x, y));
  }
  return finish(r);
}

function bowl(): Raster {
  const r = begin(22, 14);
  r.ellipse(11, 8, 9, 4.5, hex('#5d4f43'));
  r.ellipse(11, 6, 8, 3.6, hex('#8c7b69'));
  r.ellipse(11, 6, 6, 2.4, hex('#3d352f'));
  return finish(r);
}

/** The cold fire ring seen from above: stones round grey ash. Square, lying flat. */
function fireRing(): Raster {
  const r = begin(64, 64);
  r.disc(32, 32, 20, hex('#52545f'));
  for (let i = 0; i < 70; i++) {
    const a = hash(i, 1, 90) * 6.28;
    const d = hash(i, 2, 90) * 17;
    r.set(
      32 + Math.cos(a) * d,
      32 + Math.sin(a) * d,
      mix(hex('#6a6c78'), hex('#3d3f49'), hash(i, 3, 90)),
    );
  }
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    rock(r, Math.round(32 + Math.cos(a) * 23), Math.round(32 + Math.sin(a) * 23), 6, 5, 91 + i);
  }
  return finish(r);
}

/** The rock shelf behind the falls, with a flat stone lying on it. */
function ledge(): Raster {
  const r = begin(120, 56);
  for (let i = 0; i < 4; i++) rock(r, 18 + i * 28, 38, 20, 12, 100 + i);
  r.rect(8, 22, 104, 14, hex('#7f8190'));
  for (let x = 8; x < 112; x++)
    for (let y = 22; y < 36; y++) {
      const t = (y - 22) / 14;
      r.set(
        x,
        y,
        mix(
          mix(hex('#a8abb8'), hex('#6e7080'), t),
          hex('#8f92a0'),
          fbm(x / 6, y / 6, 2, 110) * 0.4,
        ),
      );
    }
  // The flat stone.
  for (let x = 40; x < 80; x++)
    for (let y = 14; y < 26; y++) {
      const edge = y < 17 ? 1.12 : y > 23 ? 0.74 : 0.95;
      r.set(x, y, shade(mix(hex('#bfc3cf'), hex('#8e92a2'), fbm(x / 5, y / 4, 2, 111)), edge));
    }
  return finish(r);
}

/** A wind-bent hawthorn: a leaning trunk and a crown swept to leeward. */
function hawthorn(): Raster {
  const w = 130;
  const h = 120;
  const r = begin(w, h);
  const rng = new Rng(121);
  let x = 30;
  let y = h - 4;
  for (let i = 0; i < 46; i++) {
    const t = i / 46;
    x += 0.5 + t * 0.9;
    y -= 1.9;
    const wd = 4.4 - t * 2.2;
    for (let dx = -wd; dx <= wd; dx++)
      r.set(
        x + dx,
        y,
        shade(
          mix(hex('#4b3a2c'), hex('#8a6a4a'), fbm(x / 4, y / 5, 2, 122)),
          dx < -wd / 3 ? 1.12 : 0.9,
        ),
      );
  }
  for (const [cx, cy, rad] of [
    [64, 36, 22],
    [88, 44, 17],
    [46, 40, 15],
    [106, 56, 12],
    [74, 24, 13],
  ] as const) {
    for (let i = 0; i < rad * rad * 1.6; i++) {
      const a = rng.float(0, 6.28);
      const d = Math.sqrt(rng.float(0, 1)) * rad;
      const px = cx + Math.cos(a) * d * 1.2;
      const py = cy + Math.sin(a) * d * 0.8;
      const lit = 0.3 + (1 - (py - 10) / 60) * 0.5 + (fbm(px / 5, py / 5, 2, 123) - 0.5);
      const tone = ['#2f4a36', '#3f5f43', '#55794f', '#7a9a62', '#a8bf80'][
        Math.max(0, Math.min(4, Math.floor(lit * 5)))
      ]!;
      r.ellipse(px, py, 1.6, 1.2, hex(tone));
      if (rng.chance(0.04)) r.set(px, py, hex('#f4f0ec'));
    }
  }
  return finish(r);
}

/** Briar's ring of stones, seen from above. Square, lying flat. */
function stoneRing(): Raster {
  const r = begin(48, 48);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    rock(r, Math.round(24 + Math.cos(a) * 17), Math.round(24 + Math.sin(a) * 17), 5, 4, 130 + i);
  }
  return finish(r);
}

/** A dithered blue halo: rings thinning outward, drawn with some opacity. */
function halo(): Raster {
  const r = begin(112, 112);
  const rings: Array<[number, RGB]> = [
    [52, hex('#7fc6ff')],
    [40, hex('#a6dcff')],
    [27, hex('#d2eeff')],
    [15, hex('#ffffff')],
  ];
  for (let y = 0; y < 112; y++)
    for (let x = 0; x < 112; x++) {
      const d = Math.hypot(x - 56, y - 56);
      for (const [rad, c] of rings)
        if (d < rad && ((x + y) % 2 === 0 || d < rad - 5)) {
          r.set(x, y, c);
          break;
        }
    }
  r.tracking = false;
  return r;
}

/** A dab of worn earth for the hill path, lying flat: an uneven blob, trodden pale in the middle. */
function pathDab(): Raster {
  const r = begin(40, 32);
  for (let y = 0; y < 32; y++)
    for (let x = 0; x < 40; x++) {
      const d = Math.hypot((x - 20) / 19, (y - 16) / 14) + (fbm(x / 6, y / 6, 2, 140) - 0.5) * 0.5;
      if (d > 1) continue;
      r.set(
        x,
        y,
        mix(hex('#b79d78'), hex('#8e7656'), Math.min(1, d + fbm(x / 3, y / 3, 2, 141) * 0.3)),
      );
    }
  r.tracking = false;
  return r;
}

/** One sheet of the story places' painted sprites. */
export function buildStoryArt(): SpriteSheet {
  const atlas = new RasterAtlas(2048);
  const add = (name: string, raster: Raster): void => atlas.add(frameKey(name, 'front', 0), raster);
  for (let i = 0; i < 3; i++) add(`frostTree-${i}`, frostTree(201 + i * 11, 0.95 + i * 0.1));
  add('hills', hillCard());
  add('house', corvinHouse());
  add('gate', greyGate());
  add('leafOpen', leaf(true));
  add('leafShut', leaf(false));
  add('bowl', bowl());
  add('fireRing', fireRing());
  add('ledge', ledge());
  add('hawthorn', hawthorn());
  add('ring', stoneRing());
  add('halo', halo());
  add('pathDab', pathDab());
  return atlas.build();
}
