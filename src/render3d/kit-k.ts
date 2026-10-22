import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PLAQUE_OUTLINES, type PlaqueCreature } from '../config/tuning-k';

/**
 * Campaign graphics 2, package k, Full 3D models: small kits merged by vertex colour so each
 * is one draw call. A `Pack` gathers geometry with a colour per piece and flushes to a single
 * mesh; the pieces here are the Fold's rubble and mending (M2), tally strokes and wreaths
 * (N5), the Beetle Road's banners, milestones, road and cart (M4, H3), Dawn & Dusk's carved
 * plaques and sundial (M5, H3). Nothing here reads the world.
 */
const PI = Math.PI;

export function lcg(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

let shared: THREE.MeshStandardMaterial | null = null;
/** One flat-shaded vertex-coloured material for every kit here. */
export function packMaterial(): THREE.MeshStandardMaterial {
  shared ??= new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.92,
    metalness: 0,
    flatShading: true,
    side: THREE.DoubleSide,
  });
  return shared;
}

/** Geometry gathered with a colour per piece, merged to one mesh on `build`. */
export class Pack {
  private readonly geos: THREE.BufferGeometry[] = [];
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly e = new THREE.Euler();

  /**
   * Add `geo` at `p`, turned by `rot` (x, y, z radians) and scaled by `s`, painted `colour`.
   * `ao` darkens a vertex by its position in the piece's own space (baked ambient occlusion).
   */
  add(
    geo: THREE.BufferGeometry,
    colour: string | THREE.Color,
    p: { x: number; y: number; z: number },
    rot: readonly [number, number, number] = [0, 0, 0],
    s: number | readonly [number, number, number] = 1,
    ao?: (x: number, y: number, z: number) => number,
  ): void {
    const sc = typeof s === 'number' ? ([s, s, s] as const) : s;
    this.q.setFromEuler(this.e.set(rot[0], rot[1], rot[2], 'YXZ'));
    this.m.compose(
      new THREE.Vector3(p.x, p.y, p.z),
      this.q,
      new THREE.Vector3(sc[0], sc[1], sc[2]),
    );
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    for (const k of Object.keys(g.attributes)) if (k !== 'position') g.deleteAttribute(k);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const base = new THREE.Color(colour);
    const col = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const k = ao ? ao(pos.getX(i), pos.getY(i), pos.getZ(i)) : 1;
      col[i * 3] = base.r * k;
      col[i * 3 + 1] = base.g * k;
      col[i * 3 + 2] = base.b * k;
    }
    g.applyMatrix4(this.m);
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.computeVertexNormals();
    this.geos.push(g);
    geo.dispose();
  }

  get size(): number {
    return this.geos.length;
  }

  build(name: string): THREE.Mesh | null {
    if (!this.geos.length) return null;
    const geo = mergeGeometries(this.geos, false);
    for (const g of this.geos) g.dispose();
    this.geos.length = 0;
    if (!geo) return null;
    const mesh = new THREE.Mesh(geo, packMaterial());
    mesh.name = name;
    mesh.castShadow = mesh.receiveShadow = true;
    return mesh;
  }
}

const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);

// ---------------------------------------------------------------- the Fold: rubble and mending

export interface HouseBox {
  /** Centre of the house's foot, world. */
  x: number;
  y: number;
  z: number;
  yaw: number;
  w: number;
  d: number;
  h: number;
  pitch: number;
  overhang: number;
}

/** Rotate a house-local offset by the house's yaw into the world (door side +z). */
function local(b: HouseBox, lx: number, lz: number): { x: number; z: number } {
  const c = Math.cos(b.yaw);
  const s = Math.sin(b.yaw);
  return { x: b.x + lx * c + lz * s, z: b.z - lx * s + lz * c };
}

const TILE = '#b8553a';
const STONE = '#8c8a86';
const BEAM = '#5a3c28';
const FRESH = '#d9a76a';
const NEWTILE = '#d9703a';

/**
 * Rubble round a ruined house (M2): fallen roof tiles, wall stones and a beam. `level` 3
 * (roofless) heaps the most, 1 the least; the heaps sit at the front corners and the back,
 * where the roof fell. `ground(x, z)` is the terrain height.
 */
export function addRubble(
  pack: Pack,
  b: HouseBox,
  level: number,
  seed: number,
  ground: (x: number, z: number) => number,
): void {
  const r = lcg(seed * 977 + 13);
  const n = [0, 8, 15, 26][Math.max(0, Math.min(3, level))]!;
  const spots: Array<[number, number]> = [
    [b.w / 2 + 0.55, b.d / 2 - 0.2],
    [-b.w / 2 - 0.5, -b.d / 2 + 0.6],
    [b.w / 2 + 0.4, -b.d / 2 + 0.2],
    [-b.w / 2 - 0.5, b.d / 2 - 0.5],
  ];
  for (let i = 0; i < n; i++) {
    const [sx, sz] = spots[i % spots.length]!;
    const lx = sx + (r() - 0.5) * 1.2;
    const lz = sz + (r() - 0.5) * 1.2;
    const w = local(b, lx, lz);
    const y = ground(w.x, w.z);
    const isTile = r() < 0.55;
    const s = 0.2 + r() * 0.3;
    if (isTile)
      pack.add(
        box(s * 2.2, s * 0.35, s * 1.5),
        r() < 0.5 ? TILE : '#9a4430',
        { x: w.x, y: y + s * 0.3, z: w.z },
        [(r() - 0.5) * 0.5, r() * PI, (r() - 0.5) * 0.5],
      );
    else
      pack.add(
        new THREE.IcosahedronGeometry(s, 0),
        STONE,
        { x: w.x, y: y + s * 0.5, z: w.z },
        [r() * 3, r() * 3, 0],
        [1.3, 0.8, 1],
      );
  }
  // Plaster has fallen from the walls in jagged bites, baring the stone under it.
  const bites = [0, 1, 3, 4][Math.max(0, Math.min(3, level))]!;
  for (let i = 0; i < bites; i++) {
    const onSide = i % 2 === 1;
    const sign = i % 4 < 2 ? 1 : -1;
    const lx = onSide
      ? sign * (b.w / 2 + 0.03)
      : (r() - 0.5) * (b.w - 1.6) + (i === 0 ? 1.2 : -0.6);
    const lz = onSide ? (r() - 0.5) * (b.d - 1.2) : b.d / 2 + 0.03;
    const cy = b.h * (0.3 + r() * 0.3);
    const sh = new THREE.Shape();
    const k = 7;
    const rad = 0.35 + r() * 0.3;
    for (let a = 0; a < k; a++) {
      const ang = (a / k) * PI * 2;
      const rr = rad * (0.6 + r() * 0.6);
      const px = Math.cos(ang) * rr * 1.2;
      const py = Math.sin(ang) * rr;
      if (a) sh.lineTo(px, py);
      else sh.moveTo(px, py);
    }
    sh.closePath();
    const w = local(b, lx, lz);
    const yaw = b.yaw + (onSide ? sign * (PI / 2) : 0);
    pack.add(new THREE.ShapeGeometry(sh), '#a07a58', { x: w.x, y: b.y + cy, z: w.z }, [0, yaw, 0]);
    pack.add(
      new THREE.ShapeGeometry(sh),
      '#6a4a34',
      { x: w.x, y: b.y + cy, z: w.z },
      [0, yaw, 0],
      0.62,
    );
  }
  // At level 3 a whole section of roof has come down and leans against the front wall.
  if (level >= 3) {
    const w = local(b, -b.w * 0.2, b.d / 2 + 0.7);
    pack.add(box(1.9, 0.09, 1.2), TILE, { x: w.x, y: ground(w.x, w.z) + 0.45, z: w.z }, [
      -0.55,
      b.yaw + 0.1,
      0.05,
    ]);
    pack.add(box(1.8, 0.07, 0.1), BEAM, { x: w.x, y: ground(w.x, w.z) + 0.62, z: w.z - 0.2 }, [
      -0.55,
      b.yaw + 0.1,
      0.05,
    ]);
  }
  // A fallen beam across the heap, and a few loose planks.
  if (level >= 1) {
    const w = local(b, b.w / 2 + 0.7, b.d / 2 - 0.3);
    pack.add(box(1.7, 0.12, 0.14), BEAM, { x: w.x, y: ground(w.x, w.z) + 0.2, z: w.z }, [
      0.12,
      b.yaw + 0.7,
      0.24,
    ]);
  }
  if (level >= 2) {
    const w = local(b, -b.w / 2 - 0.7, b.d / 2 - 0.1);
    pack.add(box(1.3, 0.1, 0.16), '#6e4a2c', { x: w.x, y: ground(w.x, w.z) + 0.16, z: w.z }, [
      0.1,
      b.yaw - 0.5,
      0.2,
    ]);
  }
}

/**
 * The mending (M2): from ruin level 2 down, a scaffold at the side and a stack of fresh
 * planks; from level 2 and 1, patches of new tile on the roof slope, more each level. The new
 * work is a bright orange tile and pale new timber, against the weathered brown, so the
 * order of work reads by shape (patches, stack) as well as by colour.
 */
export function addMending(
  pack: Pack,
  b: HouseBox,
  level: number,
  seed: number,
  ground: (x: number, z: number) => number,
): void {
  if (level >= 3 || level < 1) return;
  const r = lcg(seed * 131 + 7);
  const rh = b.h * b.pitch;
  const th = Math.atan2(rh, b.w / 2);
  // Roof patches: a slab of new tiles lying on the slope, each side, at a few places along it.
  const patches = level === 2 ? 2 : 5;
  for (let i = 0; i < patches; i++) {
    const side = i % 2 ? -1 : 1;
    const u = (0.35 + r() * 0.5) * (b.w / 2 / Math.cos(th));
    const z = (r() - 0.5) * (b.d - 1.2);
    const lx = side * u * Math.cos(th);
    const ly = b.h + rh - u * Math.sin(th);
    const w = local(b, lx, z);
    pack.add(
      box(0.9 + r() * 0.5, 0.07, 0.8 + r() * 0.4),
      NEWTILE,
      { x: w.x, y: b.y + ly + 0.1, z: w.z },
      [0, b.yaw, side * -th],
    );
  }
  // Scaffold: two poles, a cross rail and a plank, at the side, and the stack of planks.
  const sc = local(b, b.w / 2 + 1.0, 0.2);
  const gy = ground(sc.x, sc.z);
  for (const dz of [-0.8, 0.8]) {
    const p = local(b, b.w / 2 + 1.0, 0.2 + dz);
    pack.add(box(0.1, b.h * 0.9, 0.1), FRESH, { x: p.x, y: ground(p.x, p.z) + b.h * 0.45, z: p.z });
  }
  pack.add(box(0.1, 0.1, 1.9), FRESH, { x: sc.x, y: gy + b.h * 0.55, z: sc.z }, [0, b.yaw, 0]);
  pack.add(box(0.5, 0.06, 1.8), '#c49256', { x: sc.x, y: gy + b.h * 0.55 + 0.1, z: sc.z }, [
    0,
    b.yaw,
    0,
  ]);
  const st = local(b, b.w / 2 + 0.9, -b.d / 2 - 0.3);
  const sy = ground(st.x, st.z);
  for (let k = 0; k < (level === 2 ? 3 : 2); k++)
    pack.add(box(1.5, 0.1, 0.34), FRESH, { x: st.x, y: sy + 0.06 + k * 0.11, z: st.z }, [
      0,
      b.yaw + 0.1 * k,
      0,
    ]);
}

/** A warm window pane over the glass, for the chapter the Fold's lamps are lit again. */
export function litWindows(b: HouseBox): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (const dx of [-b.w * 0.3, b.w * 0.3]) {
    const g = new THREE.PlaneGeometry(0.6, 0.6);
    g.rotateY(b.yaw);
    const w = local(b, dx, b.d / 2 + 0.043);
    g.translate(w.x, b.y + b.h * 0.55, w.z);
    parts.push(g);
  }
  return mergeGeometries(parts, false)!;
}

/** A wreath hung on a house's door: a green ring, red berries and a ribbon. */
export function addWreath(
  pack: Pack,
  b: HouseBox,
  at: { dx: number; y: number; dz: number },
  ground: (x: number, z: number) => number,
): void {
  const w = local(b, at.dx, b.d / 2 + at.dz);
  const y = ground(b.x, b.z) + at.y;
  const ring = new THREE.TorusGeometry(0.27, 0.075, 5, 10);
  pack.add(ring, '#4f8a3a', { x: w.x, y, z: w.z }, [0, b.yaw, 0]);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * PI * 2 + 0.3;
    const p = local(b, at.dx + Math.cos(a) * 0.27, b.d / 2 + at.dz + 0.06);
    pack.add(new THREE.IcosahedronGeometry(0.052, 0), '#d8473a', {
      x: p.x,
      y: y + Math.sin(a) * 0.27,
      z: p.z,
    });
  }
  const rb = local(b, at.dx, b.d / 2 + at.dz + 0.05);
  pack.add(box(0.2, 0.14, 0.04), '#f2e6c8', { x: rb.x, y: y - 0.3, z: rb.z }, [0, b.yaw, 0]);
}

// ---------------------------------------------------------------- the Fold: the well's tally post

/**
 * The tally post by the well (N5): a timber post with a stroke for each day in groups of five
 * (four uprights and a slash across them), cut pale into the dark wood, rows from the top.
 */
export function buildTallyPost(
  days: number,
  perGroup: number,
  height: number,
  ground: (x: number, z: number) => number,
  at: { x: number; z: number; yaw: number },
): THREE.Mesh {
  const pack = new Pack();
  const gy = ground(at.x, at.z);
  pack.add(box(0.22, height, 0.22), '#6a4426', { x: at.x, y: gy + height / 2, z: at.z });
  pack.add(box(0.3, 0.1, 0.3), '#4a2e18', { x: at.x, y: gy + height + 0.05, z: at.z });
  // The marks sit on the post's +z face turned by yaw: four per group in a column of three.
  const c = Math.cos(at.yaw);
  const s = Math.sin(at.yaw);
  const face = (lx: number, ly: number, lz: number) => ({
    x: at.x + lx * c + lz * s,
    y: gy + ly,
    z: at.z - lx * s + lz * c,
  });
  const groups = Math.ceil(days / perGroup);
  for (let g = 0; g < groups; g++) {
    const n = Math.min(perGroup, days - g * perGroup);
    const col = g % 3;
    const row = Math.floor(g / 3);
    const baseX = -0.075 + col * 0.075;
    const topY = height - 0.18 - row * 0.2;
    for (let k = 0; k < Math.min(4, n); k++) {
      const p = face(baseX + (k - 1.5) * 0.017, topY - 0.07, 0.115);
      pack.add(box(0.008, 0.12, 0.012), FRESH, p, [0, at.yaw, 0]);
    }
    if (n >= 5) {
      const p = face(baseX, topY - 0.07, 0.118);
      pack.add(box(0.1, 0.008, 0.012), '#f2e6c8', p, [0, at.yaw, 0.55]);
    }
  }
  return pack.build('k-tally')!;
}

// ---------------------------------------------------------------- the Beetle Road

/** A banner on a pole: a timber pole with a cross bar and a cloth card bearing a crest shape. */
export function addBannerPole(
  pack: Pack,
  at: { x: number; y: number; z: number },
  yaw: number,
  height: number,
  size: { w: number; h: number },
  crest: 'sun' | 'moon' | 'drop',
  colour: string,
): void {
  pack.add(box(0.1, height, 0.1), '#5a3c28', { x: at.x, y: at.y + height / 2, z: at.z });
  pack.add(new THREE.SphereGeometry(0.1, 6, 5), '#e0c28a', {
    x: at.x,
    y: at.y + height + 0.05,
    z: at.z,
  });
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const rel = (lx: number, ly: number, lz: number) => ({
    x: at.x + lx * c + lz * s,
    y: at.y + ly,
    z: at.z - lx * s + lz * c,
  });
  const top = height - 0.12;
  pack.add(box(size.w + 0.2, 0.07, 0.07), '#5a3c28', rel(0, top, 0.04), [0, yaw, 0]);
  const cy = top - size.h / 2 - 0.04;
  // The cloth, with a swallow-tail hem so it reads as a banner, not a board.
  const cloth = new THREE.Shape();
  cloth.moveTo(-size.w / 2, size.h / 2);
  cloth.lineTo(size.w / 2, size.h / 2);
  cloth.lineTo(size.w / 2, -size.h / 2);
  cloth.lineTo(0, -size.h / 2 + 0.2);
  cloth.lineTo(-size.w / 2, -size.h / 2);
  cloth.closePath();
  pack.add(new THREE.ShapeGeometry(cloth), colour, rel(0, cy, 0.05), [0, yaw, 0]);
  // The crest, in cream relief on the cloth.
  const ink = '#fff1c9';
  const cp = rel(0, cy + 0.12, 0.062);
  if (crest === 'sun') {
    pack.add(new THREE.CircleGeometry(0.15, 14), ink, cp, [0, yaw, 0]);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * PI * 2;
      const ray = new THREE.Shape();
      ray.moveTo(-0.035, 0.19);
      ray.lineTo(0.035, 0.19);
      ray.lineTo(0, 0.31);
      ray.closePath();
      const g = new THREE.ShapeGeometry(ray);
      g.rotateZ(a);
      pack.add(g, ink, cp, [0, yaw, 0]);
    }
  } else if (crest === 'moon') {
    const m = new THREE.Shape();
    m.absarc(0, 0, 0.27, PI * 0.38, PI * 1.62, false);
    m.absarc(0.12, 0, 0.21, PI * 1.5, PI * 0.5, true);
    pack.add(new THREE.ShapeGeometry(m, 10), ink, cp, [0, yaw, 0]);
  } else {
    const d = new THREE.Shape();
    d.moveTo(0, 0.3);
    d.quadraticCurveTo(0.24, -0.04, 0.17, -0.12);
    d.quadraticCurveTo(0, -0.28, -0.17, -0.12);
    d.quadraticCurveTo(-0.24, -0.04, 0, 0.3);
    pack.add(new THREE.ShapeGeometry(d, 8), ink, cp, [0, yaw, 0]);
  }
}

/** A milestone: a knee-high stone with a rounded top and `n` notches cut in its face. */
export function addMilestone(
  pack: Pack,
  at: { x: number; y: number; z: number },
  yaw: number,
  n: number,
): void {
  pack.add(box(0.5, 0.18, 0.4), '#7c7a78', { x: at.x, y: at.y + 0.08, z: at.z }, [0, yaw, 0]);
  pack.add(box(0.36, 0.62, 0.26), '#9a9892', { x: at.x, y: at.y + 0.46, z: at.z }, [0, yaw, 0]);
  const cap = new THREE.SphereGeometry(0.18, 8, 5, 0, PI * 2, 0, PI / 2);
  pack.add(cap, '#a8a69e', { x: at.x, y: at.y + 0.77, z: at.z }, [0, yaw, 0], [1, 0.7, 0.72]);
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  for (let i = 0; i < n; i++) {
    const lx = (i - (n - 1) / 2) * 0.1;
    pack.add(
      box(0.035, 0.2, 0.02),
      '#4a4a48',
      { x: at.x + lx * c + 0.14 * s, y: at.y + 0.5, z: at.z - lx * s + 0.14 * c },
      [0, yaw, 0],
    );
  }
}

/** The lane: a dust ribbon along `pts` with two darker wheel ruts, hugging the ground. */
export function buildRoad(
  pts: ReadonlyArray<readonly [number, number]>,
  width: number,
  rutOffset: number,
  rutWidth: number,
  ground: (x: number, z: number) => number,
): THREE.Mesh {
  // Resample the polyline every 0.8 units so the ribbon follows the terrain.
  const line: Array<{ x: number; z: number; nx: number; nz: number }> = [];
  for (let i = 0; i + 1 < pts.length; i++) {
    const [ax, az] = pts[i]!;
    const [bx, bz] = pts[i + 1]!;
    const len = Math.hypot(bx - ax, bz - az);
    const steps = Math.max(1, Math.ceil(len / 0.8));
    const nx = -(bz - az) / len;
    const nz = (bx - ax) / len;
    for (let k = 0; k < steps; k++) {
      const t = k / steps;
      line.push({ x: ax + (bx - ax) * t, z: az + (bz - az) * t, nx, nz });
    }
  }
  const [lx, lz] = pts[pts.length - 1]!;
  const prev = line[line.length - 1]!;
  line.push({ x: lx, z: lz, nx: prev.nx, nz: prev.nz });
  // Smooth the normals so the ribbon doesn't gap at the bends.
  for (let i = 1; i + 1 < line.length; i++) {
    const a = line[i - 1]!;
    const b = line[i + 1]!;
    const nx = a.nx + b.nx;
    const nz = a.nz + b.nz;
    const l = Math.hypot(nx, nz) || 1;
    line[i]!.nx = nx / l;
    line[i]!.nz = nz / l;
  }
  const pos: number[] = [];
  const col: number[] = [];
  const strip = (off0: number, off1: number, lift: number, colour: string, jitter: number) => {
    const c = new THREE.Color(colour);
    for (let i = 0; i + 1 < line.length; i++) {
      const a = line[i]!;
      const b = line[i + 1]!;
      const pt = (p: typeof a, o: number) => {
        const x = p.x + p.nx * o;
        const z = p.z + p.nz * o;
        return [x, ground(x, z) + lift, z] as const;
      };
      const [p0, p1, p2, p3] = [pt(a, off0), pt(a, off1), pt(b, off0), pt(b, off1)];
      const shade = 1 - jitter * ((i * 37) % 5) * 0.04;
      for (const p of [p0, p1, p2, p2, p1, p3]) {
        pos.push(p[0], p[1], p[2]);
        col.push(c.r * shade, c.g * shade, c.b * shade);
      }
    }
  };
  // A worn verge, then the dust on it.
  strip(-width / 2 - 0.28, width / 2 + 0.28, 0.035, '#a98a58', 1);
  strip(-width / 2, width / 2, 0.045, '#c9a56e', 1);
  for (const side of [-1, 1])
    strip(side * rutOffset - rutWidth / 2, side * rutOffset + rutWidth / 2, 0.06, '#7a5a36', 0.5);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.computeVertexNormals();
  // Normals of a ground ribbon point up whatever the winding.
  const nrm = geo.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i < nrm.count; i++)
    if (nrm.getY(i) < 0) nrm.setXYZ(i, -nrm.getX(i), -nrm.getY(i), -nrm.getZ(i));
  const mesh = new THREE.Mesh(geo, packMaterial());
  mesh.name = 'k-road';
  mesh.receiveShadow = true;
  return mesh;
}

/** The beetle cart, whole: a bed, boards, four wheels and shafts; the tarp or the load on it. */
export function buildBeetleCart(open: boolean): THREE.Group {
  const g = new THREE.Group();
  const pack = new Pack();
  const wood = '#8a5c34';
  const dark = '#5a3c28';
  pack.add(box(1.7, 0.16, 1.05), wood, { x: 0, y: 0.52, z: 0 });
  for (const dz of [-0.5, 0.5]) pack.add(box(1.7, 0.3, 0.08), '#9a6a3c', { x: 0, y: 0.72, z: dz });
  pack.add(box(0.08, 0.3, 1.0), '#9a6a3c', { x: -0.82, y: 0.72, z: 0 });
  for (const [x, z] of [
    [-0.55, 0.62],
    [-0.55, -0.62],
    [0.55, 0.62],
    [0.55, -0.62],
  ] as const) {
    const w = new THREE.CylinderGeometry(0.34, 0.34, 0.1, 12);
    w.rotateX(PI / 2);
    pack.add(w, dark, { x, y: 0.34, z });
    pack.add(box(0.08, 0.56, 0.08), '#a07a48', { x, y: 0.34, z: z + 0.0 }, [0, 0, 0.4]);
  }
  pack.add(box(1.3, 0.07, 0.07), '#6a4426', { x: 1.45, y: 0.46, z: 0.24 }, [0, 0, 0.1]);
  pack.add(box(1.3, 0.07, 0.07), '#6a4426', { x: 1.45, y: 0.46, z: -0.24 }, [0, 0, 0.1]);
  if (open) {
    // The tarp off: folded into a roll at the back, crates, a sack and the great shell plate.
    pack.add(new THREE.CylinderGeometry(0.1, 0.1, 1.0, 8), '#7d8f68', { x: -0.78, y: 0.96, z: 0 }, [
      PI / 2,
      0,
      0,
    ]);
    pack.add(box(0.5, 0.42, 0.5), '#b0824a', { x: -0.2, y: 0.8, z: 0.22 }, [0, 0.2, 0]);
    pack.add(box(0.46, 0.4, 0.46), '#9a6a3c', { x: 0.38, y: 0.79, z: -0.2 }, [0, -0.3, 0]);
    pack.add(box(0.4, 0.34, 0.4), '#b0824a', { x: -0.1, y: 1.18, z: 0.08 }, [0, 0.5, 0]);
    pack.add(
      new THREE.SphereGeometry(0.3, 8, 6),
      '#c9b48a',
      { x: 0.45, y: 0.82, z: 0.3 },
      [0, 0, 0],
      [1.1, 0.7, 0.9],
    );
    const shell = new THREE.SphereGeometry(0.46, 10, 6, 0, PI * 2, 0, PI / 2);
    pack.add(shell, '#3a6a52', { x: 0.1, y: 0.62, z: -0.34 }, [0, 0.3, 0], [1.1, 0.7, 0.8]);
  } else {
    // The tarp: a hump over the load, hanging at its edges.
    const tg = new THREE.PlaneGeometry(2.0, 1.4, 12, 8);
    tg.rotateX(-PI / 2);
    const p = tg.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const u = p.getX(i) / 1.0;
      const v = p.getZ(i) / 0.7;
      const edge = Math.max(Math.abs(u), Math.abs(v));
      const hump = 0.55 * Math.max(0, 1 - u * u) * Math.max(0, 1 - v * v);
      const drop = Math.max(0, (edge - 0.72) / 0.28) ** 1.5 * 0.34;
      p.setY(i, 0.74 + hump - drop);
    }
    pack.add(tg, '#7d8f68', { x: 0, y: 0, z: 0 });
    // Rope across the hump, so a shut cart reads as tied down.
    for (const x of [-0.4, 0.4])
      pack.add(box(0.05, 0.04, 1.3), '#d9c08a', { x, y: 1.12 - Math.abs(x) * 0.5, z: 0 });
  }
  const mesh = pack.build('k-cart')!;
  g.add(mesh);
  return g;
}

// ---------------------------------------------------------------- Dawn & Dusk

/**
 * A carved plaque (M5): a dark plank board with the creature's silhouette in pale relief,
 * baked ambient occlusion darkening the relief's foot. Centred on its origin, facing +z.
 */
export function addPlaque(
  pack: Pack,
  creature: PlaqueCreature,
  size: { w: number; h: number; relief: number },
  at: { x: number; y: number; z: number },
  yaw: number,
): void {
  const { w, h, relief } = size;
  pack.add(box(w, h, 0.07), '#4a2e18', at, [0, yaw, 0]);
  // A light rim so the board's edge reads against the wall.
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const front = (lx: number, ly: number, lz: number) => ({
    x: at.x + lx * c + lz * s,
    y: at.y + ly,
    z: at.z - lx * s + lz * c,
  });
  pack.add(box(w + 0.05, 0.03, 0.05), '#c49256', front(0, h / 2 + 0.01, 0.0), [0, yaw, 0]);
  pack.add(box(w + 0.05, 0.03, 0.05), '#c49256', front(0, -h / 2 - 0.01, 0.0), [0, yaw, 0]);
  const pts = PLAQUE_OUTLINES[creature];
  const shape = new THREE.Shape();
  pts.forEach(([x, y], i) => {
    const px = (x - 0.5) * (w * 0.8);
    const py = (y - 0.5) * (h * 0.8);
    if (i) shape.lineTo(px, py);
    else shape.moveTo(px, py);
  });
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: relief, bevelEnabled: false });
  // The relief's foot (z near 0) is the darkest; its face the lightest.
  pack.add(
    geo,
    '#f0d9a0',
    front(0, 0, 0.035),
    [0, yaw, 0],
    1,
    (_x, _y, z) => 0.55 + 0.45 * Math.min(1, z / relief),
  );
}

/** The sundial on the green's centre: a stepped stone drum, a dial plate and a gnomon. */
export function buildSundial(): THREE.Group {
  const g = new THREE.Group();
  const pack = new Pack();
  const stone = '#a39e96';
  pack.add(new THREE.CylinderGeometry(0.62, 0.7, 0.18, 10), '#8f8a82', { x: 0, y: 0.09, z: 0 });
  pack.add(new THREE.CylinderGeometry(0.34, 0.44, 0.7, 8), stone, { x: 0, y: 0.5, z: 0 });
  pack.add(new THREE.CylinderGeometry(0.58, 0.46, 0.12, 12), '#bcb6aa', { x: 0, y: 0.9, z: 0 });
  // The hour marks round the plate: twelve short cuts.
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * PI * 2;
    pack.add(
      box(0.035, 0.02, i % 3 === 0 ? 0.16 : 0.09),
      '#4a4a48',
      { x: Math.sin(a) * 0.44, y: 0.965, z: Math.cos(a) * 0.44 },
      [0, a, 0],
    );
  }
  // The gnomon: a thin triangle of bronze leaning north.
  const tri = new THREE.Shape();
  tri.moveTo(0, 0);
  tri.lineTo(0.42, 0);
  tri.lineTo(0, 0.38);
  tri.closePath();
  const gn = new THREE.ExtrudeGeometry(tri, { depth: 0.035, bevelEnabled: false });
  gn.translate(-0.0175, 0, 0);
  gn.rotateY(-PI / 2);
  pack.add(gn, '#b08a3a', { x: 0, y: 0.96, z: 0.2 });
  g.add(pack.build('k-sundial')!);
  return g;
}
