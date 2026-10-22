import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';
import type { CaveBand } from '../render/cave-bands';
import { cellAt, cellCentre, WALL, type Cell, type Floor } from '../sim/dungeon';
import { CELL, cellHash } from './hollow-ctx';
import { BALL, BOX, CONE, CYL, DISC, Kit, OCT, ROCK, SPHERE } from './hollow-dress-kit';
import { cellTop } from './hollow-dress-path';

/**
 * What the dressing's set pieces share (`hollow-dress-set.ts` builds them): the lists a
 * set piece hands back beside its solid parts (soft glows, glyphs, the chest lid, the chasm
 * and waterfall sheets), the palette, little lanterns, and the great chamber's landmark
 * (item 18): a crystal tree, a waterfall pool, a glowing mushroom ring, a friendly shrine
 * or a root pillar, one per `Floor.landmark.kind`. All of it is visual: the sim never blocks
 * on a landmark, so the parts stay near its middle and the chamber stays walkable.
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

export const TIMBER = '#7a5232';
export const TIMBER_DK = '#5a3a22';
export const STONE = '#8e8798';
export const STONE_DK = '#6c6676';
export const ROPE = '#c9a978';
export const IRON = '#7c7c8a';
export const WARM = '#ffc27a';

export const key = (c: Cell) => `${c.x},${c.y}`;
export const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

export function glow(
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
export function lantern(
  kit: Kit,
  x: number,
  y: number,
  z: number,
  s = 1,
  light: string = WARM,
): void {
  kit.part(BOX(), x, y, z, 0.2 * s, 0.26 * s, 0.2 * s, light, 1.6);
  kit.part(BOX(), x, y - 0.15 * s, z, 0.26 * s, 0.05 * s, 0.26 * s, TIMBER_DK);
  kit.part(CONE(4), x, y + 0.2 * s, z, 0.32 * s, 0.14 * s, 0.32 * s, TIMBER_DK, 0, Math.PI / 4);
}

/** A lantern on a post, standing on the ground at (x, y0, z). */
export function postLantern(
  kit: Kit,
  x: number,
  y0: number,
  z: number,
  light: string = WARM,
): void {
  kit.part(CYL(0.4, 6), x, y0 + 0.45, z, 0.1, 0.9, 0.1, TIMBER);
  kit.part(BOX(), x, y0 + 0.92, z, 0.3, 0.04, 0.06, TIMBER_DK);
  lantern(kit, x, y0 + 1.06, z, 0.9, light);
}

/** The direction (dx, dy) from a cell to its nearest rock, among the four. */
export function towardRock(f: Floor, c: Cell): readonly [number, number] {
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

export function landmark(f: Floor, kit: Kit, band: CaveBand, out: SetOut): void {
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
      const caps = [band.glow, '#4fd0ff', '#ff6fb4'];
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
      glow(out, p, y0, R * 1.3, 0.01, band.glow, 0.25);
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
    0.55,
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
