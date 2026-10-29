import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';
import type { CaveBand } from '../render/cave-bands';
import { cellAt, cellCentre, FLOOR, WALL, WATER, type Cell, type Floor } from '../sim/dungeon';
import { CELL, cellHash } from './hollow-ctx';
import { BOX, CONE, CYL, DISC, Kit, OCT, PRISM, ROCK, SPHERE, TORUS } from './hollow-dress-kit';
import { across, cellPoint, cellTop, deckHeight, mainPath, STONE_TOP } from './hollow-dress-path';
import {
  DIRS,
  glow,
  IRON,
  key,
  landmark,
  lantern,
  postLantern,
  ROPE,
  STONE,
  STONE_DK,
  TIMBER,
  TIMBER_DK,
  towardRock,
  WARM,
  type SetOut,
} from './hollow-dress-parts';

export type { GlowSpot, GlyphSpot, SetOut } from './hollow-dress-parts';

/**
 * The set pieces the dressing bakes into its one merged mesh (`hollow-dress.ts`): the great
 * chamber's landmark (item 18), timber arches, mine-cart rails and the parked cart along the
 * main path (23), the stair portals (24), the chest and its cosy nook (33), rope bridges and
 * stepping stones (32), the vista lips and their painted chasm (31), and the mural stones
 * (34). Each writes solid parts into the `Kit` and lists what needs its own instanced mesh:
 * soft glows (beams and pools) and glyphs (which fade in as the Keeper nears).
 */

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
      '#8a9cc8',
      0.35,
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
    glow(out, p, y0, 1.6, P.height, P.down, 0.5, true);
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
        // Version 4 (R0031): the water between stones is a gap to jump, with no stone in it.
        if (f.version >= 4 && cellAt(f, c.x, c.y) === WATER) return;
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
    // Just above the rock's low lip there (agent C's `vistaLip`).
    const y = y0 + GROVE3D.cave.rock.vistaLip + 0.03;
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
