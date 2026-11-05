import { LANE_GATES, LANE_MAILBOX } from '../config/region-lane';
import { trainerOf } from '../sim/trainers';
import { RasterAtlas } from './paint/atlas';
import { hash, hex, Raster, rimObjects, shade, type RGB } from './paint/raster';
import type { GroundLook, GroundPaint } from './region-ground';
import { kitModule, type KitPiece } from './region-kit-px';
import { color } from './sprites/palette';
import type { SpriteSheet } from './sprites/atlas';

/**
 * WORLD-33 (R12 lane D): the neighbourhood lane in the pixel view, on the region kit. A sandy
 * lane between hedgerows and round orchard trees; at each trainer's garden a picket gate in
 * the hedge, a mailbox in that trainer's colour and a pennant in their hat colour, so a garden
 * is found by its colours, with the trainer's initial on the box as a second signal.
 */

export const LANE_GROUND: GroundLook = {
  floor: '#4f7d3a',
  floorDark: '#3f6a30',
  open: '#78a85a',
  track: '#d8c48e',
  water: '#4a7fa8',
  waterLight: '#a8d8ee',
};

/** Ruts and pebbles down the lane. */
export const paintLane: GroundPaint = (g, px, pz, ppu) => {
  g.fillStyle = 'rgba(120, 96, 60, 0.35)';
  for (const x of [-1.2, 1.2]) g.fillRect(px(x) - 1, pz(-60), 2, 120 * ppu);
  g.fillStyle = 'rgba(240, 232, 210, 0.6)';
  for (let i = 0; i < 260; i++) {
    const x = (hash(i, 3) - 0.5) * 4;
    const z = (hash(7, i) - 0.5) * 118;
    g.fillRect(px(x), pz(z), 2, 1);
  }
};

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

const LEAF = hex('#4f8a3a');
const BARK = hex('#6b4a2e');
const WOOD = hex('#efe6d0');
const POST = hex('#8a6a46');

function fill(kind: number): Raster {
  if (kind === 1) {
    // A hedgerow bush.
    const r = canvas(40, 28);
    r.ellipse(20, 18, 19, 10, shade(LEAF, 0.8));
    r.ellipse(18, 14, 14, 8, LEAF);
    r.ellipse(14, 11, 5, 3, shade(LEAF, 1.25));
    return finish(r);
  }
  // An orchard tree, round (0) or tall (2), with a few apples.
  const tall = kind === 2;
  const r = canvas(48, tall ? 80 : 64);
  const b = r.h - 1;
  r.rect(22, b - 26, 5, 26, BARK);
  const cy = tall ? 30 : 24;
  r.ellipse(24, cy, 22, tall ? 26 : 20, shade(LEAF, 0.78));
  r.ellipse(21, cy - 4, 17, tall ? 20 : 15, LEAF);
  r.ellipse(16, cy - 9, 6, 4, shade(LEAF, 1.25));
  for (let i = 0; i < 5; i++)
    r.disc(10 + hash(i, kind) * 28, cy - 8 + hash(kind, i) * 18, 1.6, hex('#d8463a'));
  return finish(r);
}

function prop(kind: number): Raster {
  const r = canvas(20, 18);
  const c = [hex('#e8d24a'), hex('#e88aa8'), hex('#a8c8f0'), hex('#f3efe4'), hex('#c8a060')][kind]!;
  if (kind === 4) {
    // A milk churn.
    r.rect(6, 4, 8, 13, shade(c, 0.9));
    r.rect(5, 3, 10, 2, c);
    return finish(r);
  }
  // A clump of verge flowers.
  for (let i = 0; i < 6; i++) {
    const x = 3 + hash(i, kind) * 14;
    r.rect(x, 8, 1, 9, shade(LEAF, 0.9));
    r.disc(x, 7, 1.8, c);
  }
  return finish(r);
}

/** A garden's picket gate, two posts and white palings. */
function gate(): Raster {
  const r = canvas(48, 34);
  const b = r.h - 1;
  r.rect(2, b - 30, 5, 30, POST);
  r.rect(41, b - 30, 5, 30, POST);
  for (let x = 9; x < 40; x += 5) {
    r.rect(x, b - 22, 3, 22, WOOD);
    r.tri(x, b - 22, x + 3, b - 22, x + 1.5, b - 25, WOOD);
  }
  r.rect(8, b - 18, 33, 2, shade(WOOD, 0.85));
  r.rect(8, b - 7, 33, 2, shade(WOOD, 0.85));
  return finish(r);
}

/** A mailbox on its post in the trainer's colour, the trainer's initial on its side. */
function mailbox(c: RGB, initial: number): Raster {
  const r = canvas(18, 30);
  const b = r.h - 1;
  r.rect(8, b - 16, 3, 16, POST);
  r.rect(2, b - 26, 14, 10, c);
  r.rect(2, b - 27, 14, 2, shade(c, 1.2));
  r.rect(13, b - 30, 2, 6, hex('#d8463a'));
  // The initial as a little pale block letter (a mark, so the colour is never the only cue).
  const glyph = LETTERS[initial] ?? LETTERS[0]!;
  glyph.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === '#') r.set(5 + x, b - 25 + y, hex('#fff8e8'));
    }),
  );
  return finish(r);
}

/** 3×5 block letters for the trainers' initials (F M S C P L E B D N). */
const LETTERS: string[][] = [
  ['###', '#..', '##.', '#..', '#..'],
  ['#.#', '###', '#.#', '#.#', '#.#'],
  ['.##', '#..', '.#.', '..#', '##.'],
  ['.##', '#..', '#..', '#..', '.##'],
  ['##.', '#.#', '##.', '#..', '#..'],
  ['#..', '#..', '#..', '#..', '###'],
  ['###', '#..', '##.', '#..', '###'],
  ['##.', '#.#', '##.', '#.#', '##.'],
  ['##.', '#.#', '#.#', '#.#', '##.'],
  ['#.#', '###', '###', '#.#', '#.#'],
];

/** A pennant on a pole in the trainer's hat colour. */
function flag(c: RGB): Raster {
  const r = canvas(20, 44);
  const b = r.h - 1;
  r.rect(2, b - 42, 2, 42, POST);
  r.tri(4, b - 42, 4, b - 30, 18, b - 36, c);
  r.tri(4, b - 42, 4, b - 36, 12, b - 39, shade(c, 1.2));
  return finish(r);
}

/** The signpost at the lane's ends. */
function signpost(): Raster {
  const r = canvas(30, 40);
  const b = r.h - 1;
  r.rect(13, b - 34, 4, 34, POST);
  r.rect(3, b - 34, 24, 7, WOOD);
  r.rect(5, b - 25, 20, 6, shade(WOOD, 0.9));
  return finish(r);
}

const rgb = (index: number): RGB => hex(color(index));

let sheet: SpriteSheet | null = null;

export function laneSheet(): SpriteSheet {
  if (sheet) return sheet;
  const atlas = new RasterAtlas(512);
  for (const k of [0, 1, 2]) atlas.add(`tree-${k}`, fill(k));
  for (const k of [0, 1, 2, 3, 4]) atlas.add(`prop-${k}`, prop(k));
  atlas.add('gate', gate());
  atlas.add('signpost', signpost());
  LANE_GATES.forEach((g, i) => {
    const look = trainerOf(g.id).look;
    atlas.add(`mailbox-${g.id}`, mailbox(hex(LANE_MAILBOX[g.id]), i));
    atlas.add(`flag-${g.id}`, flag(rgb(look.hat)));
  });
  sheet = atlas.build();
  return sheet;
}

export function lanePieces(): KitPiece[] {
  const out: KitPiece[] = [];
  for (const g of LANE_GATES) {
    out.push({ key: 'gate', x: g.x, z: g.z + 0.1, w: 3.2 });
    out.push({ key: `mailbox-${g.id}`, x: g.x - g.side * 2.6, z: g.z - 1.8, w: 0.9 });
    out.push({ key: `flag-${g.id}`, x: g.x + g.side * 0.4, z: g.z - 2.2, w: 1 });
  }
  return out;
}

const mod = kitModule({
  name: 'lane',
  look: LANE_GROUND,
  sheet: laneSheet,
  treeW: [3.4, 2.6, 3.2],
  propW: 0.9,
  pieces: lanePieces,
  paint: paintLane,
  arch: { key: 'signpost', w: 1.6 },
});

export const createRegionPx = mod.createRegionPx;
export const drawEntrance = mod.drawEntrance;
export const drawDynamic = mod.drawDynamic;
