import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';
import type { CaveBand } from '../render/cave-bands';
import { cellAt, cellCentre, FLOOR, WALL, type Cell, type Floor } from '../sim/dungeon';
import { CELL, cellHash } from './hollow-ctx';
import {
  BALL,
  BOX,
  CONE,
  CYL,
  DISC,
  Kit,
  OCT,
  PRISM,
  ROCK,
  SPHERE,
  TORUS,
} from './hollow-dress-kit';
import { across, cellPoint, cellTop, deckHeight, mainPath, STONE_TOP } from './hollow-dress-path';

/**
 * The set pieces the dressing bakes into its one merged mesh (`hollow-dress.ts`): the great
 * chamber's landmark (item 18), timber arches, mine-cart rails and the parked cart along the
 * main path (23), the stair portals (24), the chest and its cosy nook (33), rope bridges and
 * stepping stones (32), the vista lips and their painted chasm (31), and the mural stones
 * (34). Each writes solid parts into the `Kit` and lists what needs its own instanced mesh:
 * soft glows (beams and pools) and glyphs (which fade in as the Keeper nears).
 */

export interface GlowSpot {
  x: number;
  y: number;
  z: number;
  /** Pool radius and beam height, world units. */
  r: number;
  h: number;
  color: THREE.Color;
  /** Swells gently (never under reduced motion). */
  breathe: boolean;
}

export interface GlyphSpot {
  x: number;
  y: number;
  z: number;
  ry: number;
  tile: number;
  size: number;
}

export interface SetOut {
  glows: GlowSpot[];
  glyphs: GlyphSpot[];
  /** The chest lid's hinge (world) and the way the chest faces, for the loot kit's lid. */
  lid: { x: number; y: number; z: number; ry: number } | null;
  /** The vista chasm quads, one geometry. */
  chasm: THREE.BufferGeometry | null;
  /** A waterfall's falling sheet, if the landmark is a waterfall pool. */
  fall: THREE.BufferGeometry | null;
  /** Cells something stands on (no decals, roots or stones there). */
  busy: Set<string>;
}

const TIMBER = '#7a5232';
const TIMBER_DK = '#5a3a22';
const STONE = '#8e8798';
const STONE_DK = '#6c6676';
const ROPE = '#c9a978';
const IRON = '#7c7c8a';
const WARM = '#ffc27a';

const key = (c: Cell) => `${c.x},${c.y}`;
const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

function glow(
  out: SetOut,
  p: { x: number; z: number },
  y: number,
  r: number,
  h: number,
  color: THREE.ColorRepresentation,
  gain = 1,
  breathe = false,
): void {
  out.glows.push({
    x: p.x,
    y,
    z: p.z,
    r,
    h,
    color: new THREE.Color(color).multiplyScalar(gain),
    breathe,
  });
}

/** A small hanging or standing lantern: a frame, a glowing core, a cap. */
function lantern(kit: Kit, x: number, y: number, z: number, s = 1, light: string = WARM): void {
  kit.part(BOX(), x, y, z, 0.2 * s, 0.26 * s, 0.2 * s, light, 1.6);
  kit.part(BOX(), x, y - 0.15 * s, z, 0.26 * s, 0.05 * s, 0.26 * s, TIMBER_DK);
  kit.part(CONE(4), x, y + 0.2 * s, z, 0.32 * s, 0.14 * s, 0.32 * s, TIMBER_DK, 0, Math.PI / 4);
}

/** A lantern on a post, standing on the ground at (x, y0, z). */
function postLantern(kit: Kit, x: number, y0: number, z: number, light: string = WARM): void {
  kit.part(CYL(0.4, 6), x, y0 + 0.45, z, 0.1, 0.9, 0.1, TIMBER);
  kit.part(BOX(), x, y0 + 0.92, z, 0.3, 0.04, 0.06, TIMBER_DK);
  lantern(kit, x, y0 + 1.06, z, 0.9, light);
}

/** The direction (dx, dy) from a cell to its nearest rock, among the four. */
function towardRock(f: Floor, c: Cell): readonly [number, number] {
  let best: readonly [number, number] = [0, -1];
  let bestD = 99;
  for (const d of DIRS)
    for (let k = 1; k < 6; k++)
      if (cellAt(f, c.x + d[0] * k, c.y + d[1] * k) === WALL) {
        if (k < bestD) {
          bestD = k;
          best = d;
        }
        break;
      }
  return best;
}

// ---------------------------------------------------------------- item 18: landmarks

function landmark(f: Floor, kit: Kit, band: CaveBand, out: SetOut): void {
  const lm = f.landmark;
  if (!lm) return;
  const p = cellCentre(f, lm.cell);
  const y0 = cellTop(f, lm.cell);
  const h = (k: number) => cellHash(lm.cell.x, lm.cell.y, k);
  const face = Math.atan2(cellCentre(f, f.stairsUp).x - p.x, cellCentre(f, f.stairsUp).z - p.z);
  const crystal = band.crystal;
  const moss = band.moss;
  switch (lm.kind) {
    case 'crystalTree': {
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2 + h(i);
        kit.part(
          ROCK(),
          p.x + Math.cos(a) * 0.62,
          y0 + 0.12,
          p.z + Math.sin(a) * 0.62,
          0.55,
          0.34,
          0.5,
          i % 2 ? STONE : moss,
          0,
          a,
        );
      }
      // The trunk: three tall crystals leaning together.
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        const b = new THREE.Vector3(p.x + Math.cos(a) * 0.18, y0, p.z + Math.sin(a) * 0.18);
        const t = new THREE.Vector3(
          p.x + Math.cos(a + 1) * 0.08,
          y0 + 2.3 + i * 0.15,
          p.z + Math.sin(a + 1) * 0.08,
        );
        kit.rod(b, t, 0.2, crystal, 0.9, OCT());
      }
      // The branches, and smaller crystals at their tips like leaves.
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + h(10 + i) * 0.5;
        const from = new THREE.Vector3(p.x, y0 + 1.25 + (i % 3) * 0.3, p.z);
        const len = 0.9 + h(20 + i) * 0.5;
        const up = 0.45 + h(30 + i) * 0.4;
        const to = new THREE.Vector3(
          p.x + Math.cos(a) * len,
          from.y + up * len,
          p.z + Math.sin(a) * len,
        );
        kit.rod(from, to, 0.09, crystal, 1, OCT());
        kit.part(OCT(), to.x, to.y + 0.08, to.z, 0.2, 0.42, 0.2, '#e8fbff', 1.4, a, 0.3);
      }
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + h(40 + i);
        const r = 1.5 + h(50 + i) * 0.7;
        const s = 0.12 + h(60 + i) * 0.14;
        kit.part(
          OCT(),
          p.x + Math.cos(a) * r,
          y0 + s,
          p.z + Math.sin(a) * r,
          s,
          s * 2.6,
          s,
          crystal,
          1.1,
          a,
          (h(70 + i) - 0.5) * 0.6,
        );
      }
      glow(out, p, y0, 4.2, 0.01, crystal, 0.35);
      break;
    }
    case 'waterfallPool': {
      // A mossy rock shelf on the pool's far side, the water spilling down its face.
      const back = new THREE.Vector3(-Math.sin(face), 0, -Math.cos(face));
      const side = new THREE.Vector3(back.z, 0, -back.x);
      const R = DRESS_POOL * CELL;
      const foot = new THREE.Vector3(p.x + back.x * R * 0.7, y0, p.z + back.z * R * 0.7);
      for (let i = 0; i < 9; i++) {
        const lx = (i % 3) - 1;
        const ly = Math.floor(i / 3);
        const s = 1.1 - ly * 0.22;
        kit.part(
          ROCK(),
          foot.x + side.x * lx * 0.85 + back.x * (0.5 + ly * 0.15),
          y0 + 0.35 + ly * 0.72,
          foot.z + side.z * lx * 0.85 + back.z * (0.5 + ly * 0.15),
          s,
          0.9,
          s * 0.9,
          ly === 2 ? moss : i % 2 ? STONE : STONE_DK,
          0,
          h(i) * 3,
        );
      }
      const lipY = y0 + 2.1;
      kit.part(
        ROCK(),
        foot.x + back.x * 0.2,
        lipY,
        foot.z + back.z * 0.2,
        1.1,
        0.35,
        0.8,
        moss,
        0,
        face,
      );
      // The falling sheet: lip to pool, a hand out from the rock.
      const fall: number[] = [];
      const uv: number[] = [];
      const idx: number[] = [];
      const ROWS = 8;
      for (let j = 0; j <= ROWS; j++) {
        const t = j / ROWS;
        const out_ = 0.15 + Math.sin(t * Math.PI * 0.5) * 0.35;
        const cx = foot.x - back.x * out_;
        const cz = foot.z - back.z * out_;
        const y = lipY - t * (lipY - (y0 - 0.25));
        const w = 0.8 + t * 0.35;
        for (const u of [0, 1]) {
          fall.push(cx + side.x * (u - 0.5) * w, y, cz + side.z * (u - 0.5) * w);
          uv.push(u, (1 - t) * 2);
        }
      }
      for (let j = 0; j < ROWS; j++) {
        const a = j * 2;
        idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(fall, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      out.fall = g;
      // Churned foam where it lands, and glowing reeds round the pool.
      kit.part(
        DISC(),
        foot.x - back.x * 0.55,
        y0 - 0.26,
        foot.z - back.z * 0.55,
        1.5,
        1,
        1.1,
        '#e8f6ff',
        0.6,
      );
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2 + h(80 + i) * 0.3;
        const r = R + 0.25 + h(90 + i) * 0.35;
        const x = p.x + Math.cos(a) * r;
        const z = p.z + Math.sin(a) * r;
        const tall = 0.4 + h(100 + i) * 0.5;
        kit.part(CYL(0.3, 4), x, y0 + tall / 2, z, 0.04, tall, 0.04, '#5a8a4a');
        kit.part(SPHERE(), x, y0 + tall + 0.04, z, 0.08, 0.14, 0.08, band.glow, 1.4);
      }
      glow(out, p, y0 - 0.25, R * 2.2, 0.01, '#7ad8ff', 0.45);
      break;
    }
    case 'mushroomRing': {
      const R = Math.min(2.4, (lm.radius - 0.8) * CELL);
      const caps = [band.glow, '#9ef0ff', '#ffc8f0'];
      for (let i = 0; i < 11; i++) {
        const a = (i / 11) * Math.PI * 2 + h(i) * 0.2;
        const x = p.x + Math.cos(a) * R;
        const z = p.z + Math.sin(a) * R;
        const s = 0.5 + h(10 + i) * 0.6;
        mushroom(kit, x, y0, z, s, caps[i % 3]!, h(20 + i));
        if (i % 3 === 0)
          mushroom(
            kit,
            x + Math.cos(a + 1) * 0.35,
            y0,
            z + Math.sin(a + 1) * 0.35,
            s * 0.45,
            caps[(i + 1) % 3]!,
            h(30 + i),
          );
      }
      // A mossy stump in the middle, with a few tiny ones on it.
      kit.part(CYL(0.45, 9), p.x, y0 + 0.16, p.z, 0.8, 0.32, 0.8, TIMBER);
      kit.part(CYL(0.5, 9), p.x, y0 + 0.33, p.z, 0.74, 0.03, 0.74, moss);
      for (let i = 0; i < 3; i++)
        mushroom(
          kit,
          p.x + Math.cos(i * 2.1) * 0.2,
          y0 + 0.34,
          p.z + Math.sin(i * 2.1) * 0.2,
          0.22,
          caps[i]!,
          h(40 + i),
        );
      glow(out, p, y0, R * 2.6, 0.01, band.glow, 0.35);
      break;
    }
    case 'shrine': {
      // A friendly standing stone with a Nubbin carved on it, lanterns either side.
      const fx = Math.sin(face);
      const fz = Math.cos(face);
      const sx = fz;
      const sz = -fx;
      kit.part(BOX(), p.x, y0 + 0.12, p.z, 1.5, 0.24, 0.9, STONE_DK, 0, face);
      kit.part(
        BOX(),
        p.x - fx * 0.05,
        y0 + 0.24 + 0.6,
        p.z - fz * 0.05,
        0.95,
        1.2,
        0.32,
        STONE,
        0,
        face,
      );
      kit.part(
        CYL(0.5, 14),
        p.x - fx * 0.05,
        y0 + 1.44,
        p.z - fz * 0.05,
        0.95,
        0.32,
        0.95,
        STONE,
        0,
        face,
        0,
        Math.PI / 2,
      );
      kit.part(BOX(), p.x - fx * 0.05, y0 + 1.36, p.z - fz * 0.05, 0.98, 0.06, 0.34, moss, 0, face);
      out.glyphs.push({
        x: p.x + fx * 0.115,
        y: y0 + 0.86,
        z: p.z + fz * 0.115,
        ry: face,
        tile: 1,
        size: 0.8,
      });
      for (const k of [-1, 1]) {
        const lx = p.x + sx * k * 1.15 + fx * 0.15;
        const lz = p.z + sz * k * 1.15 + fz * 0.15;
        kit.part(CYL(0.45, 6), lx, y0 + 0.35, lz, 0.2, 0.7, 0.2, STONE);
        kit.part(BOX(), lx, y0 + 0.82, lz, 0.32, 0.26, 0.32, WARM, 1.5, face);
        kit.part(CONE(4), lx, y0 + 1.05, lz, 0.46, 0.22, 0.46, STONE_DK, 0, face + Math.PI / 4);
        glow(out, { x: lx, z: lz }, y0, 1.4, 0.01, WARM, 0.5);
      }
      // A little bowl of berries and some flowers, left by someone who visits.
      kit.part(SPHERE(), p.x + fx * 0.55, y0 + 0.26, p.z + fz * 0.55, 0.32, 0.12, 0.32, TIMBER);
      for (let i = 0; i < 3; i++)
        kit.part(
          SPHERE(),
          p.x + fx * 0.55 + Math.cos(i * 2.1) * 0.07,
          y0 + 0.33,
          p.z + fz * 0.55 + Math.sin(i * 2.1) * 0.07,
          0.08,
          0.08,
          0.08,
          GROVE3D.cave.dress.berry,
          1.2,
        );
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const r = 1.25 + h(i) * 0.4;
        flower(kit, p.x + Math.cos(a) * r, y0, p.z + Math.sin(a) * r, i);
      }
      glow(out, p, y0, 2.6, 0.01, band.glow, 0.3);
      break;
    }
    case 'rootPillar': {
      // Roots of the Grove's great tree, come all the way down, splaying where they land.
      const H = 4.4;
      kit.part(CYL(0.42, 10), p.x, y0 + H * 0.5 + 0.9, p.z, 0.8, H - 1.6, 0.8, TIMBER_DK);
      for (let i = 0; i < 7; i++) {
        const a0 = (i / 7) * Math.PI * 2 + h(i) * 0.4;
        const rFoot = 0.95 + h(10 + i) * 0.6;
        let prev: THREE.Vector3 | null = null;
        for (let j = 0; j <= 6; j++) {
          const t = j / 6;
          const r = 0.28 + (rFoot - 0.28) * Math.pow(t, 2.2);
          const a = a0 + t * 0.5;
          const pt = new THREE.Vector3(
            p.x + Math.cos(a) * r,
            y0 + H * (1 - t) + (t > 0.95 ? -0.05 : 0),
            p.z + Math.sin(a) * r,
          );
          if (prev) kit.rod(prev, pt, 0.16 - t * 0.08, i % 2 ? TIMBER : '#6e4a30');
          prev = pt;
        }
        // A berry cluster on every other root, and moss where it meets the floor.
        if (i % 2 === 0) {
          const t = 0.45;
          const r = 0.28 + (rFoot - 0.28) * Math.pow(t, 2.2) + 0.12;
          for (let b = 0; b < 3; b++)
            kit.part(
              SPHERE(),
              p.x + Math.cos(a0 + 0.25) * r,
              y0 + H * (1 - t) - b * 0.12,
              p.z + Math.sin(a0 + 0.25) * r,
              0.1,
              0.1,
              0.1,
              GROVE3D.cave.dress.berry,
              1.3,
            );
        }
        kit.part(
          SPHERE(),
          p.x + Math.cos(a0 + 0.5) * rFoot,
          y0 + 0.02,
          p.z + Math.sin(a0 + 0.5) * rFoot,
          0.34,
          0.05,
          0.28,
          moss,
        );
      }
      glow(out, p, y0, 3.0, 0.01, GROVE3D.cave.dress.berry, 0.18);
      break;
    }
  }
}

/** The waterfall pool's radius in cells (matches the sim's `landmark.poolRadius`). */
const DRESS_POOL = 1.8;

function mushroom(
  kit: Kit,
  x: number,
  y0: number,
  z: number,
  s: number,
  cap: string,
  k: number,
): void {
  const lean = (k - 0.5) * 0.3;
  kit.part(
    CYL(0.4, 7),
    x,
    y0 + 0.28 * s,
    z,
    0.16 * s,
    0.56 * s,
    0.16 * s,
    '#f0e6d0',
    0,
    k * 6,
    lean,
  );
  kit.part(
    SPHERE(),
    x - lean * 0.3 * s,
    y0 + 0.6 * s,
    z,
    0.62 * s,
    0.32 * s,
    0.62 * s,
    cap,
    1.1,
    k * 6,
  );
  for (let i = 0; i < 3; i++) {
    const a = k * 9 + i * 2.1;
    kit.part(
      SPHERE(),
      x - lean * 0.3 * s + Math.cos(a) * 0.17 * s,
      y0 + 0.7 * s,
      z + Math.sin(a) * 0.17 * s,
      0.08 * s,
      0.05 * s,
      0.08 * s,
      '#ffffff',
      0.9,
    );
  }
}

function flower(kit: Kit, x: number, y0: number, z: number, i: number): void {
  const tones = ['#ffd0f0', '#fff2a0', '#c8e8ff'];
  kit.part(CYL(0.5, 4), x, y0 + 0.1, z, 0.02, 0.2, 0.02, '#5a8a4a');
  kit.part(BALL(), x, y0 + 0.22, z, 0.1, 0.06, 0.1, tones[i % 3]!, 0.8);
}

// ---------------------------------------------------------------- item 23: arches, rails, cart

function pathDir(path: Cell[], i: number): readonly [number, number] {
  const a = path[Math.max(0, i - 2)]!;
  const b = path[Math.min(path.length - 1, i + 2)]!;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.abs(dx) >= Math.abs(dy) ? [Math.sign(dx) || 1, 0] : [0, Math.sign(dy) || 1];
}

function arches(f: Floor, kit: Kit, out: SetOut): void {
  const A = GROVE3D.cave.dress.arch;
  const path = mainPath(f);
  let last = -99;
  let wasNarrow = false;
  let gap = A.spacing[0];
  for (let i = 2; i < path.length - 2; i++) {
    const c = path[i]!;
    const [dx, dy] = pathDir(path, i);
    const { left, right } = across(f, c, dx, dy);
    const narrow = left < 4 && right < 4 && left + right + 1 <= A.maxWidth;
    const mouth = narrow && !wasNarrow;
    wasNarrow = narrow;
    if (!narrow || out.busy.has(key(c)) || cellAt(f, c.x, c.y) !== FLOOR) continue;
    if (!(mouth ? i - last >= 3 : i - last >= gap)) continue;
    last = i;
    gap = A.spacing[0] + Math.round(cellHash(c.x, c.y, 3) * (A.spacing[1] - A.spacing[0]));
    const p = cellCentre(f, c);
    const y0 = cellTop(f, c);
    const px = -dy;
    const pz = dx;
    const mid = (right - left) / 2;
    const half = ((left + right + 1) / 2) * CELL - 0.16;
    const cx = p.x + px * mid * CELL;
    const cz = p.z + pz * mid * CELL;
    const ry = Math.atan2(px, pz);
    const H = A.height;
    for (const s of [-1, 1]) {
      const x = cx + px * half * s;
      const z = cz + pz * half * s;
      kit.part(BOX(), x, y0 + H / 2, z, 0.2, H, 0.2, TIMBER, 0, ry);
      // A brace from post to beam.
      const a = new THREE.Vector3(x, y0 + H - 0.55, z);
      const b = new THREE.Vector3(x - px * s * 0.5, y0 + H - 0.05, z - pz * s * 0.5);
      kit.rod(a, b, 0.05, TIMBER_DK);
    }
    kit.part(BOX(), cx, y0 + H + 0.06, cz, 0.24, 0.2, half * 2 + 0.5, TIMBER_DK, 0, ry);
    if (cellHash(c.x, c.y, 5) < A.lanternShare) {
      kit.rod(
        new THREE.Vector3(cx, y0 + H - 0.04, cz),
        new THREE.Vector3(cx, y0 + H - 0.3, cz),
        0.015,
        IRON,
      );
      lantern(kit, cx, y0 + H - 0.45, cz, 0.8);
      glow(out, { x: cx, z: cz }, y0, 1.6, 0.01, WARM, 0.45);
    }
    out.busy.add(key(c));
  }
}

function rails(f: Floor, kit: Kit, out: SetOut): void {
  const R = GROVE3D.cave.dress.rails;
  const path = mainPath(f);
  // The longest run of dry, narrow, free path cells.
  let best: [number, number] = [0, 0];
  let start = -1;
  for (let i = 0; i <= path.length; i++) {
    const c = path[i];
    let ok = false;
    if (c && i > 0 && i < path.length - 1) {
      const [dx, dy] = pathDir(path, i);
      const { left, right } = across(f, c, dx, dy);
      ok = cellAt(f, c.x, c.y) === FLOOR && left + right <= 2 && !out.busy.has(key(c));
      ok &&= ![f.stairsUp, f.stairsDown, f.chest].some((s) => s && s.x === c.x && s.y === c.y);
    }
    if (ok && start < 0) start = i;
    if (!ok && start >= 0) {
      if (i - start > best[1] - best[0]) best = [start, i];
      start = -1;
    }
  }
  if (best[1] - best[0] < R.minLen) return;
  const run = path.slice(best[0], Math.min(best[1], best[0] + R.maxLen));
  // Smoothed centre line, two points a cell, at the ground's height.
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < run.length; i++) {
    const a = run[Math.max(0, i - 1)]!;
    const b = run[i]!;
    const c = run[Math.min(run.length - 1, i + 1)]!;
    const pa = cellCentre(f, a);
    const pb = cellCentre(f, b);
    const pc = cellCentre(f, c);
    pts.push(
      new THREE.Vector3((pa.x + pb.x * 2 + pc.x) / 4, cellTop(f, b), (pa.z + pb.z * 2 + pc.z) / 4),
    );
  }
  const tan = new THREE.Vector3();
  const side = (i: number) => {
    tan
      .subVectors(pts[Math.min(pts.length - 1, i + 1)]!, pts[Math.max(0, i - 1)]!)
      .setY(0)
      .normalize();
    return new THREE.Vector3(-tan.z, 0, tan.x);
  };
  const g = R.gauge / 2;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]!;
    const s = side(i);
    kit.part(
      BOX(),
      p.x,
      p.y + 0.03,
      p.z,
      R.gauge + 0.36,
      0.06,
      0.2,
      TIMBER_DK,
      0,
      Math.atan2(s.x, s.z) + Math.PI / 2,
    );
    if (i === 0) continue;
    const q = pts[i - 1]!;
    const sq = side(i - 1);
    for (const k of [-1, 1])
      kit.rod(
        new THREE.Vector3(q.x + sq.x * g * k, q.y + 0.09, q.z + sq.z * g * k),
        new THREE.Vector3(p.x + s.x * g * k, p.y + 0.09, p.z + s.z * g * k),
        0.03,
        IRON,
      );
  }
  for (const c of run) out.busy.add(key(c));
  // The cart, parked at the far end: a nod to the Beetle Run, a beetle on its side.
  const end = pts[pts.length - 2] ?? pts[pts.length - 1]!;
  const s = side(pts.length - 2);
  const ry = Math.atan2(s.x, s.z) + Math.PI / 2;
  const fx = Math.sin(ry);
  const fz = Math.cos(ry);
  const y = end.y + 0.12;
  kit.part(BOX(), end.x, y + 0.36, end.z, 0.62, 0.46, 0.95, '#8a5a32', 0, ry);
  kit.part(BOX(), end.x, y + 0.6, end.z, 0.68, 0.06, 1.0, TIMBER_DK, 0, ry);
  for (const k of [-0.28, 0.28])
    kit.part(BOX(), end.x + fx * k, y + 0.36, end.z + fz * k, 0.64, 0.48, 0.06, IRON, 0, ry);
  for (const a of [-1, 1])
    for (const b of [-1, 1])
      kit.part(
        CYL(0.5, 10),
        end.x + s.x * a * 0.31 + fx * b * 0.3,
        y + 0.05,
        end.z + s.z * a * 0.31 + fz * b * 0.3,
        0.26,
        0.06,
        0.26,
        '#3a3440',
        0,
        ry,
        0,
        Math.PI / 2,
      );
  // The beetle on each side: a round green shell with two dots.
  for (const a of [-1, 1]) {
    const bx = end.x + s.x * a * 0.32;
    const bz = end.z + s.z * a * 0.32;
    kit.part(SPHERE(), bx, y + 0.38, bz, 0.06, 0.24, 0.3, '#3f8a5a', 0.2, ry);
    kit.part(
      SPHERE(),
      bx + s.x * a * 0.02,
      y + 0.42,
      bz + s.z * a * 0.02 + 0,
      0.04,
      0.05,
      0.05,
      '#f0f0e0',
      0.4,
      ry,
    );
  }
  // A load of glowing ore.
  for (let i = 0; i < 6; i++) {
    const ox = (cellHash(i, 1, 2) - 0.5) * 0.4;
    const oz = (cellHash(i, 3, 4) - 0.5) * 0.7;
    kit.part(
      OCT(),
      end.x + s.x * ox + fx * oz,
      y + 0.66,
      end.z + s.z * ox + fz * oz,
      0.16,
      0.3,
      0.16,
      i % 2 ? '#9ae8ff' : '#ffd36a',
      1.2,
      i,
    );
  }
}

// ---------------------------------------------------------------- item 24: stair portals

function portals(f: Floor, kit: Kit, out: SetOut): void {
  const P = GROVE3D.cave.dress.portal;
  {
    const c = f.stairsUp;
    const p = cellCentre(f, c);
    const y0 = cellTop(f, c);
    const [dx, dy] = towardRock(f, c);
    const ry = Math.atan2(dx, dy);
    // Carved steps climbing toward the rock.
    for (let i = 0; i < 4; i++) {
      const d = -CELL * 0.3 + i * CELL * 0.2;
      kit.part(
        BOX(),
        p.x + dx * d,
        y0 + 0.09 * (i + 1),
        p.z + dy * d,
        CELL * 0.82,
        0.18 * (i + 1),
        CELL * 0.22,
        i % 2 ? STONE : '#a8a2b8',
        0.05,
        ry,
      );
    }
    // A timber frame over the top step, a lantern on each side.
    const fx = p.x + dx * CELL * 0.42;
    const fz = p.z + dy * CELL * 0.42;
    const sx = -dy;
    const sz = dx;
    for (const k of [-1, 1]) {
      kit.part(
        BOX(),
        fx + sx * k * 0.66,
        y0 + 1.25,
        fz + sz * k * 0.66,
        0.18,
        2.5,
        0.18,
        TIMBER,
        0,
        ry,
      );
      postLantern(
        kit,
        p.x + sx * k * 0.95 - dx * 0.4,
        y0,
        p.z + sz * k * 0.95 - dy * 0.4,
        P.lantern,
      );
    }
    kit.part(BOX(), fx, y0 + 2.52, fz, 1.7, 0.2, 0.24, TIMBER_DK, 0, ry);
    glow(out, { x: fx - dx * 0.4, z: fz - dy * 0.4 }, y0, 2.0, P.height, P.up, 0.8, true);
    out.busy.add(key(c));
  }
  if (f.stairsDown) {
    const c = f.stairsDown;
    const p = cellCentre(f, c);
    const y0 = cellTop(f, c);
    // The well: a deep indigo throat (never black), cool light from its depths, a stone rim.
    kit.part(DISC(), p.x, y0 + 0.03, p.z, CELL * 0.76, 1, CELL * 0.76, '#1c1a3a');
    kit.part(DISC(), p.x, y0 + 0.035, p.z, CELL * 0.4, 1, CELL * 0.4, P.down, 0.6);
    kit.part(
      TORUS(),
      p.x,
      y0 + 0.07,
      p.z,
      CELL * 0.82,
      CELL * 0.82,
      1.2,
      '#b8c8e8',
      0.8,
      0,
      Math.PI / 2,
    );
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const r = CELL * 0.58;
      kit.part(
        ROCK(),
        p.x + Math.cos(a) * r,
        y0 + 0.2,
        p.z + Math.sin(a) * r,
        0.36,
        0.5,
        0.36,
        STONE,
        0,
        a,
      );
    }
    for (const k of [-1, 1]) postLantern(kit, p.x + k * 1.0, y0, p.z - 0.55, P.down);
    glow(out, p, y0, 2.0, P.height, P.down, 0.8, true);
    out.busy.add(key(c));
  }
}

// ---------------------------------------------------------------- the chest and item 33

function chestAndNook(f: Floor, kit: Kit, out: SetOut): void {
  const c = f.chest;
  const p = cellCentre(f, c);
  const y0 = cellTop(f, c);
  const [dx, dy] = towardRock(f, c);
  // The chest faces away from the rock it stands against.
  const ry = Math.atan2(-dx, -dy);
  kit.part(BOX(), p.x, y0 + 0.2, p.z, 0.7, 0.4, 0.45, '#8a5a2a', 0.25, ry);
  kit.part(BOX(), p.x, y0 + 0.21, p.z, 0.1, 0.42, 0.47, '#e0c060', 0.6, ry);
  // The lid's hinge is on the back edge (toward the rock).
  out.lid = { x: p.x + dx * 0.235, y: y0 + 0.4, z: p.z + dy * 0.235, ry };
  glow(out, p, y0, 1.6, 1.3, GROVE3D.cave.dress.portal.chest, 0.9);
  out.busy.add(key(c));
  const n = f.nook;
  if (!n) return;
  if (n.rug.length) {
    const xs = n.rug.map((r) => r.x);
    const ys = n.rug.map((r) => r.y);
    const a = cellCentre(f, { x: Math.min(...xs), y: Math.min(...ys) });
    const b = cellCentre(f, { x: Math.max(...xs), y: Math.max(...ys) });
    const w = b.x - a.x + CELL * 0.9;
    const d = b.z - a.z + CELL * 0.9;
    const cx = (a.x + b.x) / 2;
    const cz = (a.z + b.z) / 2;
    const ry0 = cellTop(f, n.rug[0]!);
    kit.part(BOX(), cx, ry0 + 0.015, cz, w, 0.03, d, '#e0b050');
    kit.part(BOX(), cx, ry0 + 0.03, cz, w - 0.24, 0.02, d - 0.24, '#b8483a');
    for (const k of [-0.25, 0, 0.25])
      kit.part(BOX(), cx, ry0 + 0.042, cz + k * d, w - 0.4, 0.01, 0.08, '#f0d8a0');
    for (const r of n.rug) out.busy.add(key(r));
  }
  for (const l of n.lanterns) {
    const lp = cellCentre(f, l);
    postLantern(kit, lp.x, cellTop(f, l), lp.z);
    glow(out, lp, cellTop(f, l), 1.8, 0.01, WARM, 0.6);
    out.busy.add(key(l));
  }
  if (n.tent) {
    const tp = cellCentre(f, n.tent);
    const ty = cellTop(f, n.tent);
    // The tent opens toward the rug.
    const toward = Math.atan2(cellCentre(f, c).x - tp.x, cellCentre(f, c).z + CELL * 1.5 - tp.z);
    kit.part(PRISM(), tp.x, ty, tp.z, 1.3, 1.05, 1.3, '#c9a46e', 0, toward);
    const fx = Math.sin(toward);
    const fz = Math.cos(toward);
    kit.part(
      PRISM(),
      tp.x + fx * 0.66,
      ty,
      tp.z + fz * 0.66,
      0.6,
      0.62,
      0.02,
      '#4a3a5a',
      0,
      toward,
    );
    kit.part(CYL(0.5, 5), tp.x, ty + 1.12, tp.z, 0.04, 0.2, 0.04, TIMBER_DK);
    kit.part(
      CONE(3),
      tp.x + 0.08,
      ty + 1.2,
      tp.z,
      0.06,
      0.18,
      0.18,
      '#ff8a6a',
      0.3,
      toward,
      0,
      Math.PI / 2,
    );
    // A bedroll in front.
    kit.part(
      CYL(0.5, 10),
      tp.x + fx * 1.0,
      ty + 0.1,
      tp.z + fz * 1.0,
      0.2,
      0.7,
      0.2,
      '#6a8acb',
      0,
      toward + Math.PI / 2,
      0,
      Math.PI / 2,
    );
    out.busy.add(key(n.tent));
  }
}

// ---------------------------------------------------------------- item 32: crossings

function crossings(f: Floor, kit: Kit, out: SetOut): void {
  for (const cr of f.crossings) {
    const a = cellPoint(f, cr.from);
    const b = cellPoint(f, cr.to);
    if (cr.kind === 'stones') {
      cr.cells.forEach((c, i) => {
        const p = cellCentre(f, c);
        const top = cellTop(f, c) + STONE_TOP;
        const s = 0.62 + cellHash(c.x, c.y, 7) * 0.18;
        kit.part(
          CYL(0.46, 9),
          p.x,
          top - 0.12,
          p.z,
          s,
          0.24,
          s * 0.9,
          i % 2 ? STONE : '#9a94a6',
          0,
          cellHash(c.x, c.y, 8) * 3,
        );
        kit.part(
          CYL(0.5, 9),
          p.x,
          top + 0.005,
          p.z,
          s * 0.7,
          0.01,
          s * 0.6,
          GROVE3D.cave.bands[0].moss,
          0,
          cellHash(c.x, c.y, 8) * 3,
        );
      });
      continue;
    }
    const dir = new THREE.Vector3().subVectors(b, a).setY(0);
    const len = dir.length();
    dir.divideScalar(len || 1);
    const side = new THREE.Vector3(-dir.z, 0, dir.x);
    const ry = Math.atan2(side.x, side.z);
    const water = cellTop(f, cr.cells[0]!);
    const n = Math.max(2, Math.round(len / 0.3));
    const deck = (t: number) => {
      // The deck runs flat from bank to bank, sagging between (as `deckHeight` does).
      const ends = t * (cr.cells.length + 1);
      const k = Math.min(1, Math.max(0, (ends - 0.5) / cr.cells.length));
      return deckHeight('bridge', a.y, b.y, k, water);
    };
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = a.x + dir.x * len * t;
      const z = a.z + dir.z * len * t;
      kit.part(
        BOX(),
        x,
        deck(t),
        z,
        1.0,
        0.06,
        0.22,
        i % 3 ? TIMBER : '#8a6040',
        0,
        ry + (cellHash(i, 1) - 0.5) * 0.08,
      );
    }
    for (const k of [-1, 1]) {
      for (const p of [a, b]) {
        const x = p.x + side.x * k * 0.55;
        const z = p.z + side.z * k * 0.55;
        kit.part(CYL(0.4, 6), x, p.y + 0.4, z, 0.12, 0.8, 0.12, TIMBER_DK);
      }
      let prev: THREE.Vector3 | null = null;
      for (let i = 0; i <= 8; i++) {
        const t = i / 8;
        const pt = new THREE.Vector3(
          a.x + dir.x * len * t + side.x * k * 0.55,
          deck(t) + 0.62 - Math.sin(t * Math.PI) * 0.06,
          a.z + dir.z * len * t + side.z * k * 0.55,
        );
        if (prev) kit.rod(prev, pt, 0.025, ROPE);
        if (i > 0 && i < 8 && i % 2 === 0)
          kit.rod(pt, new THREE.Vector3(pt.x, deck(t) + 0.03, pt.z), 0.012, ROPE);
        prev = pt;
      }
    }
    for (const c of cr.cells) out.busy.add(key(c));
  }
}

// ---------------------------------------------------------------- item 31: vistas

const VDIR = { n: [0, -1], s: [0, 1], w: [-1, 0], e: [1, 0] } as const;

function vistas(f: Floor, kit: Kit, out: SetOut): void {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (const v of f.vistas) {
    const [dx, dy] = VDIR[v.dir];
    const ax = dy === 0 ? 0 : 1;
    const ay = dy === 0 ? 1 : 0;
    const first = cellCentre(f, v.cell);
    const last = cellCentre(f, {
      x: v.cell.x + ax * (v.width - 1),
      y: v.cell.y + ay * (v.width - 1),
    });
    const y0 = cellTop(f, v.cell);
    // The lip: a run of low mossy stones along the edge, with a little rope rail on posts.
    const n = Math.max(2, v.width * 3);
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x =
        THREE.MathUtils.lerp(first.x - ax * CELL * 0.5, last.x + ax * CELL * 0.5, t) +
        dx * CELL * 0.5;
      const z =
        THREE.MathUtils.lerp(first.z - ay * CELL * 0.5, last.z + ay * CELL * 0.5, t) +
        dy * CELL * 0.5;
      const s = 0.4 + cellHash(i, v.cell.x, v.cell.y) * 0.2;
      kit.part(
        ROCK(),
        x,
        y0 + 0.14,
        z,
        s,
        0.36,
        s,
        i % 3 ? STONE : GROVE3D.cave.bands[0].moss,
        0,
        i,
      );
    }
    const ends = [
      new THREE.Vector3(
        first.x - ax * CELL * 0.45 + dx * CELL * 0.35,
        y0,
        first.z - ay * CELL * 0.45 + dy * CELL * 0.35,
      ),
      new THREE.Vector3(
        last.x + ax * CELL * 0.45 + dx * CELL * 0.35,
        y0,
        last.z + ay * CELL * 0.45 + dy * CELL * 0.35,
      ),
    ];
    for (const e of ends) kit.part(CYL(0.4, 6), e.x, y0 + 0.4, e.z, 0.1, 0.8, 0.1, TIMBER_DK);
    kit.rod(ends[0]!.clone().setY(y0 + 0.72), ends[1]!.clone().setY(y0 + 0.72), 0.025, ROPE);
    // The painted chasm, from just past the lip out to the grid's edge, at lip height.
    const base = pos.length / 3;
    const near = CELL * 0.62;
    const far = (v.depth + 0.5) * CELL;
    const y = y0 + 0.3;
    const corners = [
      [first.x - ax * CELL * 0.5, first.z - ay * CELL * 0.5],
      [last.x + ax * CELL * 0.5, last.z + ay * CELL * 0.5],
    ] as const;
    for (const [d, vv] of [
      [near, 0],
      [far, 1],
    ] as const)
      corners.forEach(([cx, cz], i) => {
        pos.push(cx + dx * d, y, cz + dy * d);
        uv.push(i * v.width * 0.5, vv);
      });
    // Drawn double-sided, so the winding does not matter whichever way it opens.
    idx.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    for (let k = 0; k < v.width; k++)
      out.busy.add(key({ x: v.cell.x + ax * k, y: v.cell.y + ay * k }));
  }
  if (!idx.length) return;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  out.chasm = g;
}

// ---------------------------------------------------------------- item 34: murals

function murals(f: Floor, kit: Kit, out: SetOut): void {
  const M = GROVE3D.cave.dress.mural;
  const inRoom = (x: number, y: number) =>
    f.rooms.some((r) => x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h);
  const cands: Array<{ c: Cell; d: readonly [number, number]; h: number }> = [];
  for (let y = 1; y < f.rows - 1; y++)
    for (let x = 1; x < f.cols - 1; x++) {
      if (cellAt(f, x, y) !== FLOOR || !inRoom(x, y) || out.busy.has(`${x},${y}`)) continue;
      for (const d of DIRS)
        if (cellAt(f, x + d[0], y + d[1]) === WALL && cellAt(f, x - d[0], y - d[1]) === FLOOR)
          cands.push({ c: { x, y }, d, h: cellHash(x, y, 61 + d[0] * 2 + d[1]) });
    }
  cands.sort((a, b) => a.h - b.h);
  const want =
    M.count[0] + Math.floor(cellHash(f.cols, f.rows, 63) * (M.count[1] - M.count[0] + 1));
  const chosen: Cell[] = [];
  for (const k of cands) {
    if (chosen.length >= want) break;
    if (chosen.some((c) => Math.hypot(c.x - k.c.x, c.y - k.c.y) < M.spacing)) continue;
    chosen.push(k.c);
    const p = cellCentre(f, k.c);
    const y0 = cellTop(f, k.c);
    const [dx, dy] = k.d;
    const x = p.x + dx * (CELL * 0.5 - 0.36);
    const z = p.z + dy * (CELL * 0.5 - 0.36);
    const ry = Math.atan2(-dx, -dy);
    kit.part(BOX(), x, y0 + 0.1, z, 1.15, 0.2, 0.5, STONE_DK, 0, ry);
    kit.part(BOX(), x, y0 + 0.2 + 0.5, z, 0.95, 1.0, 0.24, STONE, 0, ry);
    kit.part(CYL(0.5, 12), x, y0 + 1.2, z, 0.95, 0.24, 0.95, STONE, 0, ry, 0, Math.PI / 2);
    kit.part(
      SPHERE(),
      x + dy * 0.3,
      y0 + 1.32,
      z - dx * 0.3,
      0.3,
      0.1,
      0.22,
      GROVE3D.cave.bands[0].moss,
      0,
      ry,
    );
    const tile = Math.floor(cellHash(k.c.x, k.c.y, 65) * 4) % 4;
    out.glyphs.push({ x: x - dx * 0.125, y: y0 + 0.78, z: z - dy * 0.125, ry, tile, size: 0.8 });
    out.busy.add(key(k.c));
  }
}

/** Build every set piece of a floor into `kit`. */
export function buildSet(f: Floor, kit: Kit, band: CaveBand, busy: Set<string>): SetOut {
  const out: SetOut = { glows: [], glyphs: [], lid: null, chasm: null, fall: null, busy };
  portals(f, kit, out);
  chestAndNook(f, kit, out);
  landmark(f, kit, band, out);
  if (f.landmark) {
    const r = Math.ceil(f.landmark.radius * 0.7);
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++)
        busy.add(key({ x: f.landmark.cell.x + dx, y: f.landmark.cell.y + dy }));
  }
  crossings(f, kit, out);
  vistas(f, kit, out);
  arches(f, kit, out);
  rails(f, kit, out);
  murals(f, kit, out);
  return out;
}
