import type { OuterArt } from '../../config/outer-ring';
import { Rng } from '../../sim/rng';
import { stamp, stoneStep } from './buildings';
import { fbm, ridged, vnoise } from './noise';
import { bush, LEAF, log, rock, tree } from './props';
import { hex, mix, Raster, rimObjects, shade, type RGB } from './raster';

/**
 * R0072: the outer ring's pieces in the painted pixel style (about 24 texels a world unit,
 * the foot at the bottom row), one frame each. `buildPaintedScenery` adds them to the
 * scenery atlas; their places are in `config/outer-ring.ts`.
 */
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

const WOOD = hex('#8a5a32');
const DARK_WOOD = hex('#4a2e18');
const PALE_WOOD = hex('#d9a76a');
const STRAW = hex('#e6c260');
const DARK_STRAW = hex('#a8822e');
const STONE = hex('#9c9ca8');
const DARK_STONE = hex('#4a4a56');

/** A post of wood grain from `base` up `h` texels, `w` wide. */
function post(r: Raster, x: number, base: number, h: number, w: number, salt: number): void {
  for (let i = 0; i < h; i++)
    stamp(r, x, base - i, w, mix(DARK_WOOD, WOOD, ridged(x / 3, (base - i) / 4, 2, salt) * 0.9));
}

/** A plank from (x0, y) to (x1, y), `t` thick, with grain and a lit top edge. */
function plank(r: Raster, x0: number, x1: number, y: number, t: number, salt: number): void {
  for (let x = x0; x <= x1; x++) {
    const g = ridged(x / 6, y / 2, 2, salt);
    for (let k = 0; k < t; k++)
      r.set(x, y + k, shade(mix(WOOD, PALE_WOOD, g * 0.7), k ? 0.8 : 1.1));
  }
}

/** One mushroom: a stem and a domed cap, spotted when `spots`. */
function mushroom(r: Raster, x: number, base: number, s: number, cap: RGB, spots: boolean): void {
  r.rect(x - s * 0.3, base - s * 1.4, s * 0.6 + 1, s * 1.4, hex('#efe6d2'));
  r.rect(x - s * 0.3, base - s * 1.4, 1, s * 1.4, hex('#c9bfa8'));
  const cy = base - s * 1.4;
  for (let yy = -s; yy <= 0; yy++)
    for (let xx = -s * 1.1; xx <= s * 1.1; xx++) {
      if ((xx / (s * 1.1)) ** 2 + (yy / s) ** 2 > 1) continue;
      r.set(x + xx, cy + yy, shade(cap, 0.75 + (-yy / s) * 0.4 - (xx / s) * 0.1));
    }
  if (spots) {
    r.set(x - s * 0.4, cy - s * 0.5, hex('#fff6e8'));
    r.set(x + s * 0.4, cy - s * 0.3, hex('#fff6e8'));
    r.set(x, cy - s * 0.8, hex('#fff6e8'));
  }
}

function mushroomRing(): Raster {
  const r = canvas(64, 32);
  // The ring's darker, lusher grass, then nine caps round it.
  r.ellipse(32, 20, 23, 7.5, hex('#4f7e32'), 0.45);
  for (let a = 0; a < Math.PI * 2; a += 0.02)
    r.ellipse(32 + Math.cos(a) * 24, 20 + Math.sin(a) * 8, 2.2, 1.3, hex('#3f6e2a'), 0.55);
  const rng = new Rng(611);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + 0.3;
    const x = 32 + Math.cos(a) * 24;
    const base = 21 + Math.sin(a) * 8;
    mushroom(r, x, base, rng.float(2.4, 3.4), hex(i % 3 ? '#d8402e' : '#e8784a'), true);
  }
  return finish(r);
}

function mossLog(): Raster {
  const r = canvas(66, 22);
  log(r, 4, 12, 50, 613);
  for (let x = 6; x < 54; x++)
    for (let y = 5; y < 12; y++)
      if (fbm(x / 4, y / 3, 3, 614) > 0.45)
        r.set(x, y, mix(hex('#4f8a3a'), hex('#8fc25a'), fbm(x / 2, y, 2, 615)));
  for (const [x, y] of [
    [14, 6],
    [30, 5],
    [44, 6],
  ] as const)
    mushroom(r, x, y + 2, 1.6, hex('#c9a26a'), false);
  return finish(r);
}

function signpost(): Raster {
  const r = canvas(36, 46);
  post(r, 18, 45, 40, 2, 621);
  // Two arrow boards, one each way, with a green trail blaze.
  const board = (y: number, dir: number) => {
    const x0 = dir > 0 ? 18 : 4;
    plank(r, x0, x0 + 13, y, 5, 622 + y);
    const tip = dir > 0 ? x0 + 14 : x0 - 1;
    for (let k = 0; k < 3; k++) r.rect(tip + dir * k, y + k, 1, 5 - k * 2, WOOD);
  };
  board(8, 1);
  board(17, -1);
  r.rect(25, 9, 3, 3, hex('#3f8a3a'));
  r.rect(8, 18, 3, 3, hex('#3f8a3a'));
  return finish(r);
}

function toadstools(): Raster {
  const r = canvas(32, 26);
  mushroom(r, 10, 25, 4.2, hex('#b07a46'), false);
  mushroom(r, 20, 25, 3, hex('#9a6234'), false);
  mushroom(r, 26, 25, 2.2, hex('#c08a52'), false);
  return finish(r);
}

/** Fern fronds fanning out of one crown. */
function fern(): Raster {
  const r = canvas(38, 28);
  const rng = new Rng(631);
  for (let i = 0; i < 9; i++) {
    const a = Math.PI * (0.12 + (i / 8) * 0.76);
    const len = rng.float(13, 18);
    for (let t = 0; t < len; t++) {
      const x = 19 - Math.cos(a) * t;
      const y = 27 - Math.sin(a) * t * 0.9 + (t / len) ** 2 * 6;
      const c = mix(hex('#2f5e22'), hex('#7ab84a'), t / len);
      r.set(x, y, c);
      if (t % 2 === 0 && t > 2) {
        r.set(x - 1, y - 1, shade(c, 1.1));
        r.set(x + 1, y - 1, shade(c, 0.9));
      }
    }
  }
  return finish(r);
}

function stair(): Raster {
  const r = canvas(64, 44);
  // Five cut steps climbing away up the slope, mossy at the edges.
  for (let i = 0; i < 5; i++) {
    const y = 38 - i * 7;
    const w = 44 - i * 4;
    const x = 32 - w / 2;
    r.rect(x, y, w, 6, mix(DARK_STONE, STONE, 0.5 - i * 0.04));
    stoneStep(r, x, y, w);
    if (fbm(i, 0, 2, 641) > 0.4) r.rect(x - 1, y + 2, 3, 3, hex('#5f8a3a'));
    r.rect(x + w - 2, y + 3, 3, 3, hex('#5f8a3a'));
  }
  return finish(r);
}

function cairn(): Raster {
  const r = canvas(34, 42);
  const stones = [
    [17, 36, 13, 5],
    [16, 27, 10, 4],
    [18, 20, 8, 3.5],
    [16, 14, 6, 3],
    [17, 9, 4, 2.5],
  ] as const;
  stones.forEach(([x, y, rx, ry], i) => rock(r, x, y, rx, ry, 651 + i));
  return finish(r);
}

function telescope(): Raster {
  const r = canvas(36, 46);
  // A wooden tripod, then the brass tube tipped up toward the east.
  for (const [dx, lean] of [
    [-8, -0.3],
    [8, 0.3],
    [0, 0],
  ] as const)
    for (let i = 0; i < 24; i++)
      stamp(
        r,
        18 + dx - lean * i * 0.3 * (dx ? 1 : 0) - (dx * i) / 28,
        45 - i,
        1.4,
        mix(DARK_WOOD, WOOD, i / 30),
      );
  for (let t = 0; t < 22; t++) {
    const x = 8 + t;
    const y = 22 - t * 0.45;
    const rad = 2.4 + t * 0.06;
    for (let k = -rad; k <= rad; k++)
      r.set(
        x,
        y + k,
        mix(
          hex('#7a5418'),
          hex('#f0c860'),
          0.8 - Math.abs(k) / (rad * 1.6) - (k < 0 ? -0.15 : 0.1),
        ),
      );
  }
  r.rect(29, 10, 2, 7, hex('#3a2a10'));
  return finish(r);
}

function scree(): Raster {
  const r = canvas(40, 22);
  rock(r, 12, 14, 7, 4, 661);
  rock(r, 25, 15, 5, 3, 662);
  rock(r, 33, 17, 3, 2, 663);
  rock(r, 19, 9, 3, 2, 664);
  return finish(r);
}

/** Low clumps of flowers in `petal` on green. */
function flowers(w: number, h: number, petal: RGB, salt: number, n: number): Raster {
  const r = canvas(w, h);
  const rng = new Rng(salt);
  bush(r, rng, w / 2, h - 1, 0.45, LEAF);
  for (let i = 0; i < n; i++) {
    const x = rng.float(4, w - 4);
    const y = rng.float(h * 0.35, h - 3);
    r.disc(x, y, 1.6, petal);
    r.set(x - 0.6, y - 0.6, shade(petal, 1.35));
    r.set(x, y + 0.5, hex('#2a2a10'));
  }
  return finish(r);
}

/** Tall stalks; `heads` gives each a brown cattail head instead of a pale tip. */
function stalks(w: number, h: number, salt: number, heads: boolean): Raster {
  const r = canvas(w, h);
  const rng = new Rng(salt);
  for (let i = 0; i < 16; i++) {
    const x0 = rng.float(4, w - 4);
    const len = rng.float(h * 0.55, h - 2);
    const bend = rng.float(-4, 4);
    for (let t = 0; t < len; t++) {
      const x = x0 + bend * (t / len) ** 2;
      r.set(x, h - 1 - t, mix(hex('#3f6e2a'), hex(heads ? '#7aa04a' : '#c8d88a'), t / len));
    }
    if (heads && i % 2 === 0) {
      const x = x0 + bend;
      r.rect(x - 1, h - len - 1, 3, 6, hex('#6a4022'));
      r.rect(x - 1, h - len - 1, 1, 6, hex('#8a5a32'));
    }
  }
  return finish(r);
}

function lily(): Raster {
  const r = canvas(30, 16);
  const pad = (x: number, y: number, s: number) => {
    for (let yy = -s * 0.5; yy <= s * 0.5; yy++)
      for (let xx = -s; xx <= s; xx++) {
        if ((xx / s) ** 2 + (yy / (s * 0.5)) ** 2 > 1) continue;
        if (xx > 0 && Math.abs(yy) < (xx / s) * 1.5) continue; // the notch
        r.set(x + xx, y + yy, mix(hex('#2f6a2a'), hex('#6aaa48'), 0.5 - yy / s));
      }
  };
  pad(9, 10, 7);
  pad(22, 12, 5);
  // A pink flower on one pad, and a small frog on the other.
  r.disc(8, 8, 2, hex('#f0a0c0'));
  r.set(8, 7, hex('#fff0f6'));
  r.ellipse(22, 9, 3, 2, hex('#5aa040'));
  r.set(20, 8, hex('#f6f2c0'));
  r.set(24, 8, hex('#f6f2c0'));
  r.set(20, 7, hex('#101010'));
  r.set(24, 7, hex('#101010'));
  return finish(r);
}

function boardwalk(): Raster {
  const r = canvas(92, 30);
  // Posts under the deck, then the planks seen from above at an angle.
  for (const x of [8, 30, 52, 74, 86]) post(r, x, 29, 10, 2, 671 + x);
  for (let i = 0; i < 10; i++) plank(r, 2 + i, 90 - (9 - i), 9 + i, 1, 672 + (i >> 1));
  for (let x = 6; x < 90; x += 9) r.rect(x, 9, 1, 10, DARK_WOOD);
  return finish(r);
}

function laneGate(): Raster {
  const r = canvas(72, 66);
  post(r, 8, 65, 54, 3, 681);
  post(r, 64, 65, 54, 3, 682);
  // A crossbeam with a little roof of shingles, a hanging sign and a lantern.
  plank(r, 2, 70, 10, 4, 683);
  for (let x = 4; x < 68; x++)
    for (let y = 2; y < 9; y++)
      if (y > 8 - Math.min(x - 4, 68 - x) * 0.5)
        r.set(x, y, mix(hex('#5a4a5a'), hex('#9a8a9a'), ((x >> 2) + y) % 2 ? 0.3 : 0.6));
  r.rect(26, 15, 1, 5, DARK_WOOD);
  r.rect(46, 15, 1, 5, DARK_WOOD);
  plank(r, 22, 50, 20, 8, 684);
  for (let x = 26; x < 47; x += 4) r.rect(x, 23, 2, 2, hex('#3a6a8a'));
  r.rect(62, 22, 6, 7, hex('#3a3a44'));
  r.rect(63, 23, 4, 5, hex('#ffd25a'));
  return finish(r);
}

function hay(): Raster {
  const r = canvas(40, 28);
  // A round bale lying on its side: a straw drum with a spiral end facing us.
  for (let y = 4; y < 27; y++)
    for (let x = 4; x < 36; x++) {
      const ex = (x - 12) / 9;
      const ey = (y - 15.5) / 11.5;
      const end = ex * ex + ey * ey < 1;
      const body =
        x >= 12 &&
        x < 32 &&
        Math.abs(y - 15.5) <
          11.5 * Math.sqrt(Math.max(0, 1 - ((x - 32) / 4) ** 2 * (x > 31 ? 1 : 0)));
      if (!end && !body) continue;
      let c = mix(
        DARK_STRAW,
        STRAW,
        0.5 + (vnoise(x / 2, y / 1.2, 691) - 0.5) * 0.9 - (y - 15) / 40,
      );
      if (end) {
        const d = Math.hypot(ex, ey);
        c = mix(DARK_STRAW, STRAW, 0.6 + Math.sin(d * 14 + Math.atan2(ey, ex)) * 0.25);
      }
      r.set(x, y, c);
    }
  r.rect(22, 4, 1, 23, hex('#7a5a22'));
  return finish(r);
}

function scarecrow(): Raster {
  const r = canvas(48, 66);
  post(r, 24, 65, 52, 2, 701);
  plank(r, 6, 42, 24, 2, 702);
  // A patched shirt, straw at the cuffs, a sack head and an old felt hat.
  for (let y = 20; y < 44; y++)
    for (let x = 14; x < 35; x++)
      if (Math.abs(x - 24.5) < 6 + (y - 20) * 0.18)
        r.set(x, y, mix(hex('#3a5a8a'), hex('#5a7aaa'), fbm(x / 4, y / 4, 2, 703)));
  r.rect(18, 30, 5, 5, hex('#c0563a'));
  for (const x of [5, 42])
    for (let k = 0; k < 4; k++) r.rect(x + (x < 20 ? -k : k), 23 + k, 1, 3, STRAW);
  r.disc(24.5, 14, 6.5, hex('#d8c08a'));
  r.set(22, 13, hex('#2a2010'));
  r.set(27, 13, hex('#2a2010'));
  r.rect(22, 17, 6, 1, hex('#7a5a3a'));
  r.rect(14, 6, 21, 3, hex('#5a4030'));
  r.rect(18, 0, 13, 7, hex('#6a4a36'));
  return finish(r);
}

function hayCart(): Raster {
  const r = canvas(58, 42);
  // The heap of hay, the cart's sides, then two spoked wheels.
  bush(r, new Rng(711), 29, 22, 0.75, [DARK_STRAW, hex('#c8a040'), STRAW, hex('#f2d88a')]);
  for (let y = 20; y < 31; y++) plank(r, 6, 52, y, 1, 712 + (y >> 2));
  r.rect(52, 24, 6, 2, WOOD);
  for (const cx of [15, 43]) {
    for (let a = 0; a < Math.PI * 2; a += 0.05)
      r.set(cx + Math.cos(a) * 8, 32 + Math.sin(a) * 8, DARK_WOOD);
    for (let a = 0; a < Math.PI; a += Math.PI / 4)
      r.line(
        cx - Math.cos(a) * 7,
        32 - Math.sin(a) * 7,
        cx + Math.cos(a) * 7,
        32 + Math.sin(a) * 7,
        WOOD,
      );
    r.disc(cx, 32, 1.5, PALE_WOOD);
  }
  return finish(r);
}

function orchardTree(): Raster {
  const size = 0.95;
  const w = Math.round(190 * size);
  const h = Math.round(200 * size);
  const r = new Raster(w, h, null);
  r.tracking = true;
  const rng = new Rng(721);
  tree(r, rng, w / 2, h - 4, size, LEAF);
  for (let i = 0; i < 14; i++) {
    const x = w / 2 + rng.float(-55, 55) * size;
    const y = h * 0.42 + rng.float(-38, 22) * size;
    r.disc(x, y, 3, hex('#d8402e'));
    r.set(x - 1, y - 1, hex('#ff9a7a'));
  }
  return finish(r);
}

function ciderPress(): Raster {
  const r = canvas(44, 48);
  // A slatted tub on a low trestle, the frame over it, and the big screw down the middle.
  for (let y = 26; y < 44; y++)
    for (let x = 8; x < 36; x++)
      r.set(
        x,
        y,
        shade(mix(WOOD, PALE_WOOD, ridged(x / 2, y / 8, 2, 731) * 0.6), x % 5 === 0 ? 0.7 : 1),
      );
  r.rect(8, 30, 28, 2, hex('#3a3a44'));
  r.rect(8, 40, 28, 2, hex('#3a3a44'));
  post(r, 6, 47, 44, 3, 732);
  post(r, 38, 47, 44, 3, 733);
  plank(r, 3, 41, 3, 4, 734);
  for (let y = 7; y < 26; y++) r.rect(21, y, 2, 1, (y >> 1) % 2 ? hex('#6a6a74') : hex('#a8a8b4'));
  r.rect(13, 12, 18, 2, DARK_WOOD);
  r.disc(22, 35, 2, hex('#d8402e'));
  return finish(r);
}

function beehive(): Raster {
  const r = canvas(30, 38);
  post(r, 15, 37, 10, 3, 741);
  plank(r, 5, 25, 26, 3, 742);
  // A straw skep: coiled rings, wider at the bottom, with its dark doorway.
  for (let i = 0; i < 6; i++) {
    const y = 23 - i * 3.4;
    const half = 10 - i * 1.4 - (i > 4 ? 2 : 0);
    for (let x = -half; x <= half; x++)
      for (let k = 0; k < 3; k++)
        r.set(
          15 + x,
          y + k,
          shade(
            mix(DARK_STRAW, STRAW, 0.7 - Math.abs(x) / (half * 2.2)),
            k === 0 ? 1.15 : k === 2 ? 0.8 : 1,
          ),
        );
  }
  r.ellipse(15, 24, 2.5, 1.5, hex('#2a1a0a'));
  for (const [x, y] of [
    [4, 6],
    [26, 10],
    [23, 3],
  ] as const) {
    r.set(x, y, hex('#f0c020'));
    r.set(x + 1, y, hex('#201a10'));
  }
  return finish(r);
}

function appleCrate(): Raster {
  const r = canvas(30, 24);
  for (let i = 0; i < 9; i++) {
    const rng = new Rng(751 + i);
    r.disc(
      7 + (i % 5) * 4 + rng.float(-1, 1),
      9 + (i > 4 ? 2 : 0),
      2.4,
      hex(i % 3 ? '#d8402e' : '#e8b030'),
    );
  }
  for (let y = 10; y < 23; y++) plank(r, 3, 27, y, 1, 752 + (y >> 2));
  for (const y of [13, 18]) r.rect(3, y, 25, 1, DARK_WOOD);
  return finish(r);
}

function ladder(): Raster {
  const r = canvas(26, 58);
  // Two rails leaning right, rungs between them.
  for (let t = 0; t < 54; t++) {
    const lean = t * 0.18;
    stamp(r, 4 + lean, 57 - t, 1.6, mix(DARK_WOOD, WOOD, t / 60));
    stamp(r, 13 + lean, 57 - t, 1.6, mix(DARK_WOOD, WOOD, t / 60));
    if (t % 8 === 4) for (let x = 5; x < 13; x++) r.set(x + lean, 57 - t, PALE_WOOD);
  }
  return finish(r);
}

/** Every outer-ring frame, by art key. */
export const OUTER_PAINTERS: Record<OuterArt, () => Raster> = {
  'mushroom-ring': mushroomRing,
  'moss-log': mossLog,
  signpost,
  toadstools,
  fern,
  stair,
  cairn,
  telescope,
  scree,
  gentians: () => flowers(34, 20, hex('#3a6ae0'), 761, 9),
  reeds: () => stalks(40, 44, 771, false),
  lily,
  boardwalk,
  'lane-gate': laneGate,
  cattails: () => stalks(32, 40, 781, true),
  hay,
  scarecrow,
  poppies: () => flowers(36, 22, hex('#e0302a'), 791, 10),
  'hay-cart': hayCart,
  'orchard-tree': orchardTree,
  'cider-press': ciderPress,
  beehive,
  'apple-crate': appleCrate,
  ladder,
};
