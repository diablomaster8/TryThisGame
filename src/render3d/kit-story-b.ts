import * as THREE from 'three';
import { STORY_B } from '../config/tuning-b';
import type { Tex } from '../samples/aaa-kit';
import {
  bevelBox,
  buildingMaterial,
  Buckets,
  house,
  type HouseStyle,
  type LightSpill,
} from './building-kit';
import { KIT_SHARED, kitMaterials, type KitKey } from './kit-buildings';
import { WATER_LEVEL } from './terrain-shape';

/**
 * Campaign-graphics package b, Full 3D models (C4, C6, C7, M9, M10, N7): the Grove's field
 * gate with its swinging leaf, ivy and day post; the Fold's ruined houses; Dawn & Dusk's
 * crest houses on a mown green; the shore jetty; the mill wheel. Everything is built from
 * the Grove's building kit and merged by material, so the gate is five or six meshes, the
 * jetty two and the wheel two. Nothing here is tappable except the houses' walls.
 */

type Mats = Record<KitKey, THREE.Material>;
const PI = Math.PI;

function lcg(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function bucketsFor(m: Mats): Buckets {
  const kit = new Buckets();
  kit.material('timber', m.timber);
  kit.material('plank', m.plank);
  kit.material('stone', m.stone);
  kit.material('roof', m.roof);
  kit.material('door', m.door);
  return kit;
}

const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);

/** The gate: static frame and fence, the swinging leaf, the ivy and the day post. */
export interface GateModel {
  group: THREE.Group;
  /** Set the leaf's swing, 0 shut .. 1 wide. */
  setOpenness(o: number): void;
  setIvy(on: boolean): void;
  /** Carve `days` marks on the post (0 clears it). */
  setTally(days: number): void;
  /** The bits that change with state, for the caller's `compile`. */
  readonly parts: THREE.Object3D[];
}

export function buildGate(tex: Tex, bare: boolean): GateModel {
  const m = kitMaterials(tex);
  const G = STORY_B.gate;
  const h = G.half;
  const ph = G.postHeight;
  const ps = G.postSize;
  const group = new THREE.Group();
  group.name = 'gate-b';
  const kit = bucketsFor(m);
  // Posts: bevelled timber on a stone foot, each with a cap.
  for (const sx of [-1, 1]) {
    kit.add('stone', bevelBox(ps + 0.22, 0.34, ps + 0.22, 0.05, 0.9), { x: sx * h, y: 0.1, z: 0 });
    kit.add('timber', bevelBox(ps, ph, ps, 0.05, 1.2), { x: sx * h, y: ph / 2, z: 0 });
    kit.add('timber', bevelBox(ps + 0.1, 0.1, ps + 0.1, 0.03), { x: sx * h, y: ph + 0.03, z: 0 });
  }
  // The lintel, braces down to the posts, and a small pitched roof over the lot.
  const span = h * 2 + ps;
  kit.add('timber', bevelBox(span + 0.5, 0.2, 0.26, 0.04, 1.2), { x: 0, y: ph - 0.12, z: 0 });
  for (const sx of [-1, 1])
    kit.add('timber', box(0.12, 0.62, 0.12), { x: sx * (h - 0.32), y: ph - 0.42, z: 0 }, [
      0,
      0,
      sx * 0.7,
    ]);
  const rise = 0.34;
  const depth = 0.62;
  const a = Math.atan2(rise, depth);
  const slope = Math.hypot(depth, rise);
  for (const sz of [-1, 1])
    kit.add(
      'roof',
      bevelBox(span + 0.8, 0.08, slope + 0.1, 0.03, 1.4),
      { x: 0, y: ph + 0.12 + rise / 2, z: (sz * depth) / 2 },
      [sz * a, 0, 0],
    );
  kit.add('timber', bevelBox(span + 0.9, 0.1, 0.14, 0.03), {
    x: 0,
    y: ph + 0.12 + rise + 0.05,
    z: 0,
  });
  // A lantern hook: an iron-dark arm off the right post and a ring on its end.
  kit.add('timber', box(0.05, 0.05, 0.5), { x: h, y: ph - 0.5, z: 0.4 });
  kit.add('timber', new THREE.TorusGeometry(0.07, 0.016, 6, 12), { x: h, y: ph - 0.62, z: 0.62 });
  // Fence either side, except in The Hundred Days: posts and two rails a panel.
  if (!bare) {
    for (const sx of [-1, 1])
      for (let i = 0; i < G.panels; i++) {
        const x0 = sx * (h + ps / 2 + i * 1.1);
        const x1 = sx * (h + ps / 2 + (i + 1) * 1.1);
        kit.add('timber', bevelBox(0.14, 1.0, 0.14, 0.03, 1.2), { x: x1, y: 0.5, z: 0 });
        for (const ry of [0.38, 0.78])
          kit.add('plank', bevelBox(1.1, 0.1, 0.07, 0.02, 1.2), { x: (x0 + x1) / 2, y: ry, z: 0 });
      }
  }
  kit.flush(group);

  // The leaf, hinged on the left post: frame, slats, a cross brace and two strap hinges.
  const leaf = new THREE.Group();
  leaf.position.set(-h + ps / 2 + 0.04, 0, 0);
  const lk = bucketsFor(m);
  const L = h * 2 - ps - 0.08;
  const lh = 1.55;
  const y0 = 0.28;
  for (const sx of [0.06, L - 0.06])
    lk.add('timber', bevelBox(0.12, lh, 0.1, 0.02, 1), { x: sx, y: y0 + lh / 2, z: 0 });
  for (const ry of [0.06, lh / 2, lh - 0.06])
    lk.add('timber', bevelBox(L, 0.12, 0.12, 0.02, 1.2), { x: L / 2, y: y0 + ry, z: 0 });
  const diag = Math.hypot(L - 0.2, lh - 0.2);
  lk.add('timber', box(diag, 0.11, 0.06), { x: L / 2, y: y0 + lh / 2, z: 0.02 }, [
    0,
    0,
    Math.atan2(lh - 0.2, L - 0.2),
  ]);
  const slats = 8;
  for (let i = 0; i < slats; i++)
    lk.add('plank', bevelBox(L / slats - 0.05, lh - 0.1, 0.04, 0.01, 1.2), {
      x: 0.2 + ((L - 0.4) * i) / (slats - 1),
      y: y0 + lh / 2,
      z: -0.04,
    });
  for (const ry of [0.28, lh - 0.28])
    lk.add('door', box(0.5, 0.07, 0.14), { x: 0.28, y: y0 + ry, z: 0 });
  lk.flush(leaf);
  group.add(leaf);

  // The ivy: leaf cards and trailing strands up the posts, along the lintel and the fence.
  const rnd = lcg(4417);
  const cards: THREE.BufferGeometry[] = [];
  const greens = ['#3f6a2f', '#4f7f3a', '#668f43', '#2f5a30'].map((c) => new THREE.Color(c));
  const card = (x: number, y: number, z: number, s: number, tall = 1) => {
    const g = new THREE.PlaneGeometry(0.1 * s, 0.1 * s * tall).toNonIndexed();
    g.rotateZ((rnd() - 0.5) * 2.2);
    g.rotateY((rnd() - 0.5) * 2.4);
    g.translate(x, y, z);
    const c = greens[Math.floor(rnd() * greens.length)]!;
    const col = new Float32Array(g.attributes.position!.count * 3);
    for (let i = 0; i < col.length; i += 3) {
      col[i] = c.r;
      col[i + 1] = c.g;
      col[i + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.deleteAttribute('uv');
    cards.push(g);
  };
  for (const sx of [-1, 1]) {
    for (let i = 0; i < 70; i++) {
      const t = Math.pow(rnd(), 1.4);
      const side = Math.floor(rnd() * 4);
      const o = ps / 2 + 0.03;
      const u = (rnd() - 0.5) * ps;
      const px = sx * h + (side < 2 ? (side ? o : -o) : u);
      const pz = side >= 2 ? (side === 2 ? o : -o) : u;
      card(
        px,
        0.1 + t * (ph - 0.2) * (sx < 0 ? 1 : 0.8),
        pz,
        1.6 + rnd() * 2.2,
        rnd() < 0.3 ? 2.6 : 1,
      );
    }
    for (let i = 0; i < 24; i++) {
      const t = rnd();
      card(
        sx * (h - 0.1 - t * 1.0),
        ph - 0.12 - rnd() * 0.12,
        (rnd() - 0.5) * 0.3,
        1.8 + rnd() * 1.6,
        rnd() < 0.4 ? 3 : 1,
      );
    }
  }
  if (!bare)
    for (const sx of [-1, 1])
      for (let i = 0; i < 18; i++)
        card(
          sx * (h + 0.3 + rnd() * 1.6),
          0.3 + rnd() * 0.7,
          (rnd() - 0.5) * 0.2,
          1.6 + rnd() * 1.4,
        );
  const ivyGeo = new (THREE.BufferGeometry as unknown as { new (): THREE.BufferGeometry })();
  {
    let n = 0;
    for (const g of cards) n += g.attributes.position!.count;
    const pos = new Float32Array(n * 3);
    const nor = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    let o = 0;
    for (const g of cards) {
      pos.set(g.attributes.position!.array as Float32Array, o * 3);
      nor.set(g.attributes.normal!.array as Float32Array, o * 3);
      col.set(g.attributes.color!.array as Float32Array, o * 3);
      o += g.attributes.position!.count;
      g.dispose();
    }
    ivyGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    ivyGeo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    ivyGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  }
  const ivy = new THREE.Mesh(
    ivyGeo,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.9,
      flatShading: true,
    }),
  );
  ivy.name = 'gate-ivy';
  ivy.visible = false;
  ivy.castShadow = true;
  group.add(ivy);

  // The day post: a light board on the hinge post's lane face, strokes in tally groups.
  const tallyMat = new THREE.MeshBasicMaterial({ color: '#2b1a10' });
  const board = new THREE.Mesh(bevelBox(0.3, 0.86, 0.04, 0.015), m.plank);
  board.position.set(-h, 1.05, ps / 2 + 0.02);
  board.visible = false;
  group.add(board);
  let tallyMesh: THREE.Mesh | null = null;

  const model: GateModel = {
    group,
    parts: [],
    setOpenness(o) {
      leaf.rotation.y = -Math.max(0, Math.min(1, o)) * G.swing;
    },
    setIvy(on) {
      ivy.visible = on;
    },
    setTally(days) {
      if (tallyMesh) {
        group.remove(tallyMesh);
        tallyMesh.geometry.dispose();
        tallyMesh = null;
      }
      board.visible = days > 0;
      if (days <= 0) return;
      const geos: THREE.BufferGeometry[] = [];
      const per = STORY_B.tally.perGroup;
      const groups = Math.ceil(days / per);
      for (let gi = 0; gi < groups; gi++) {
        const col = gi % 3;
        const row = Math.floor(gi / 3);
        const gx = -h - 0.095 + col * 0.095;
        const gy = 1.05 + 0.37 - row * 0.105;
        const n = Math.min(per, days - gi * per);
        for (let s = 0; s < Math.min(4, n); s++)
          geos.push(box(0.009, 0.08, 0.012).translate(gx - 0.025 + s * 0.017, gy, ps / 2 + 0.045));
        if (n === 5)
          geos.push(
            box(0.1, 0.009, 0.012)
              .rotateZ(-0.7)
              .translate(gx, gy, ps / 2 + 0.05),
          );
      }
      const merged = mergeBoxes(geos);
      tallyMesh = new THREE.Mesh(merged, tallyMat);
      group.add(tallyMesh);
    },
  };
  return model;
}

/** Merge plain box geometries (all indexed, same attributes) into one. */
function mergeBoxes(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const out = new THREE.BufferGeometry();
  let nv = 0;
  let ni = 0;
  for (const g of geos) {
    nv += g.attributes.position!.count;
    ni += g.index!.count;
  }
  const pos = new Float32Array(nv * 3);
  const nor = new Float32Array(nv * 3);
  const idx = new Uint32Array(ni);
  let vo = 0;
  let io = 0;
  for (const g of geos) {
    pos.set(g.attributes.position!.array as Float32Array, vo * 3);
    nor.set(g.attributes.normal!.array as Float32Array, vo * 3);
    const gi = g.index!.array;
    for (let i = 0; i < gi.length; i++) idx[io + i] = gi[i]! + vo;
    vo += g.attributes.position!.count;
    io += gi.length;
    g.dispose();
  }
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  return out;
}

/** The three stock buildings the Fold re-draws: footprint, wall height, plaster, shutters. */
export const FOLD_HOUSES = {
  cottage: {
    w: 5.2,
    d: 4,
    h: 2.8,
    style: { wall: '#fff6ea', shutter: '#5f8f62', overhang: 0.5, pitch: 0.7, chimney: true },
  },
  school: {
    w: 4.6,
    d: 3.6,
    h: 2.6,
    style: { wall: '#f3e2c6', shutter: '#4f78a8', overhang: 0.45, pitch: 0.72 },
  },
  dojo: {
    w: 6.4,
    d: 4.8,
    h: 2.4,
    style: { wall: '#e6d0b4', shutter: '#b0453c', overhang: 0.85, pitch: 0.55 },
  },
} as const satisfies Record<string, { w: number; d: number; h: number; style: HouseStyle }>;

export interface BuiltHouse {
  group: THREE.Group;
  walls: THREE.Mesh;
}

/**
 * A kit house standing at (x, y, z) turned to `yaw`, at ruin level `ruin`. Walls are the
 * tappable mesh (the caller sets its pick); the trim merges into a few meshes.
 */
export function buildHouse(
  tex: Tex,
  at: { x: number; y: number; z: number },
  yaw: number,
  size: { w: number; d: number; h: number },
  style: HouseStyle,
  roofColor: string | null,
  extra?: (kit: Buckets, size: { w: number; d: number; h: number }) => void,
): BuiltHouse {
  const m = kitMaterials(tex);
  const kit = new Buckets();
  kit.material('roof', roofColor ? tintedRoof(tex, roofColor) : m.roof);
  kit.material('timber', m.timber);
  kit.material('stone', m.stone);
  kit.material('glass', m.glass, false, false);
  kit.material('door', m.door);
  kit.material('plank', m.plank);
  const shutter = `shutter-b-${style.shutter}`;
  kit.material(shutter, shutterMaterial(tex, style.shutter));
  const spills: LightSpill[] = [];
  const lights: THREE.Vector3[] = [];
  const g = new THREE.Group();
  const wallMat = wallMaterial(tex, style.wall);
  const walls = house(kit, wallMat, shutter, { x: 0, y: 0, z: 0 }, size, style, spills, lights);
  g.add(walls);
  extra?.(kit, size);
  kit.flush(g);
  g.position.set(at.x, at.y, at.z);
  g.rotation.y = yaw;
  return { group: g, walls };
}

const TINTS = new Map<string, THREE.Material>();
function cached(key: string, make: () => THREE.Material): THREE.Material {
  let t = TINTS.get(key);
  if (!t) {
    t = make();
    KIT_SHARED.add(t);
    TINTS.set(key, t);
  }
  return t;
}
const tintedRoof = (tex: Tex, c: string) =>
  cached(`roof|${c}`, () => buildingMaterial(tex.plaster, { color: c, normal: 0.6 }));
const shutterMaterial = (tex: Tex, c: string) =>
  cached(`shutter|${c}`, () => buildingMaterial(tex.wood, { color: c, normal: 0.3 }));
const wallMaterial = (tex: Tex, c: string) =>
  cached(`wall|${c}`, () => buildingMaterial(tex.plaster, { color: c, normal: 0.3 }));

/** A carved crest in relief on a plank board, for the front of a Dawn & Dusk house. */
export function crestBoard(
  kit: Buckets,
  crest: string,
  at: { x: number; y: number; z: number },
): void {
  kit.add('plank', bevelBox(1.25, 0.9, 0.1, 0.04, 1), at);
  const z = at.z + 0.06;
  const rel = (shape: THREE.Shape) => {
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.07, bevelEnabled: false });
    g.scale(1.25, 1.25, 1);
    g.translate(at.x, at.y, z);
    return g;
  };
  const s = new THREE.Shape();
  switch (crest) {
    case 'sun': {
      s.absarc(0, 0, 0.17, 0, PI * 2, false);
      kit.add('timber', rel(s), { x: 0, y: 0, z: 0 });
      for (let i = 0; i < 8; i++) {
        const r = new THREE.Shape();
        r.moveTo(-0.045, 0.21);
        r.lineTo(0.045, 0.21);
        r.lineTo(0, 0.31);
        r.closePath();
        const g = new THREE.ExtrudeGeometry(r, { depth: 0.07, bevelEnabled: false });
        g.rotateZ((i / 8) * PI * 2);
        g.scale(1.25, 1.25, 1);
        g.translate(at.x, at.y, z);
        kit.add('timber', g, { x: 0, y: 0, z: 0 });
      }
      break;
    }
    case 'moon': {
      s.absarc(0, 0, 0.27, PI * 0.35, PI * 1.65, false);
      s.absarc(0.13, 0, 0.22, PI * 1.5, PI * 0.5, true);
      kit.add('timber', rel(s), { x: 0, y: 0, z: 0 });
      break;
    }
    case 'leaf': {
      s.moveTo(0, -0.3);
      s.quadraticCurveTo(0.3, -0.05, 0, 0.3);
      s.quadraticCurveTo(-0.3, -0.05, 0, -0.3);
      kit.add('timber', rel(s), { x: 0, y: 0, z: 0 });
      // The midrib, in plank colour, so the leaf reads by shape.
      const rib = new THREE.Shape();
      rib.moveTo(-0.012, -0.24);
      rib.lineTo(0.012, -0.24);
      rib.lineTo(0.012, 0.22);
      rib.lineTo(-0.012, 0.22);
      const rg = new THREE.ExtrudeGeometry(rib, { depth: 0.03, bevelEnabled: false });
      rg.scale(1.25, 1.25, 1);
      rg.translate(at.x, at.y, z + 0.07);
      kit.add('plank', rg, { x: 0, y: 0, z: 0 });
      break;
    }
    default: {
      // Waves: three crests as a thick sine ribbon.
      const top: Array<[number, number]> = [];
      for (let i = 0; i <= 16; i++) {
        const t = i / 16;
        top.push([-0.34 + t * 0.68, 0.06 + Math.sin(t * PI * 3) * 0.07]);
      }
      s.moveTo(top[0]![0], top[0]![1]);
      for (const [x, y] of top) s.lineTo(x, y);
      for (let i = top.length - 1; i >= 0; i--) s.lineTo(top[i]![0], top[i]![1] - 0.11);
      kit.add('timber', rel(s), { x: 0, y: 0, z: 0 });
      const low = new THREE.Shape();
      for (let i = 0; i <= 16; i++) {
        const t = i / 16;
        const px = -0.34 + t * 0.68;
        const py = -0.14 + Math.sin(t * PI * 3 + 1) * 0.06;
        if (i === 0) low.moveTo(px, py);
        else low.lineTo(px, py);
      }
      for (let i = 16; i >= 0; i--) {
        const t = i / 16;
        low.lineTo(-0.34 + t * 0.68, -0.14 + Math.sin(t * PI * 3 + 1) * 0.06 - 0.09);
      }
      kit.add('timber', rel(low), { x: 0, y: 0, z: 0 });
    }
  }
}

/** A mown circle: rings that follow the ground, so a slope never hides it. */
export function buildGreen(
  center: { x: number; z: number },
  radius: number,
  height: (x: number, z: number) => number,
  kerbMat: THREE.Material,
): THREE.Group {
  const out = new THREE.Group();
  const rings = 7;
  const segs = 48;
  const pos: number[] = [];
  const idx: number[] = [];
  pos.push(center.x, height(center.x, center.z) + 0.12, center.z);
  for (let r = 1; r <= rings; r++) {
    const rr = (r / rings) * radius;
    for (let s = 0; s < segs; s++) {
      const t = (s / segs) * PI * 2;
      const x = center.x + Math.cos(t) * rr * (1 + Math.sin(t * 3) * 0.02);
      const z = center.z + Math.sin(t) * rr * (1 + Math.cos(t * 2) * 0.02);
      pos.push(x, height(x, z) + 0.12 - (r === rings ? 0.04 : 0), z);
    }
  }
  for (let s = 0; s < segs; s++) idx.push(0, 1 + ((s + 1) % segs), 1 + s);
  for (let r = 1; r < rings; r++)
    for (let s = 0; s < segs; s++) {
      const a = 1 + (r - 1) * segs + s;
      const b = 1 + (r - 1) * segs + ((s + 1) % segs);
      const c = a + segs;
      const d = b + segs;
      idx.push(a, b, c, b, d, c);
    }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      color: '#9cd16c',
      roughness: 1,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    }),
  );
  mesh.receiveShadow = true;
  mesh.name = 'dd-green';
  out.add(mesh);
  // A low stone kerb round the edge, so the circle reads even under the long grass.
  const ks = 64;
  const kp: number[] = [];
  const ki: number[] = [];
  for (let s = 0; s < ks; s++) {
    const t = (s / ks) * PI * 2;
    for (const [rr, up] of [
      [radius - 0.15, 0.2],
      [radius + 0.2, 0.2],
      [radius - 0.15, 0.02],
      [radius + 0.2, 0.02],
    ] as const) {
      const x = center.x + Math.cos(t) * rr * (1 + Math.sin(t * 3) * 0.02);
      const z = center.z + Math.sin(t) * rr * (1 + Math.cos(t * 2) * 0.02);
      kp.push(x, height(x, z) + up, z);
    }
  }
  for (let s = 0; s < ks; s++) {
    const a = s * 4;
    const b = ((s + 1) % ks) * 4;
    // Top face, outer face and inner face.
    ki.push(a, b, a + 1, b, b + 1, a + 1);
    ki.push(a + 1, b + 1, a + 3, b + 1, b + 3, a + 3);
    ki.push(a, a + 2, b, b, a + 2, b + 2);
  }
  const kg = new THREE.BufferGeometry();
  kg.setAttribute('position', new THREE.Float32BufferAttribute(kp, 3));
  kg.setIndex(ki);
  kg.computeVertexNormals();
  const kerb = new THREE.Mesh(kg, kerbMat);
  kerb.name = 'dd-kerb';
  kerb.castShadow = kerb.receiveShadow = true;
  out.add(kerb);
  return out;
}

/** The jetty: boards across two bearers on piles, `missing` boards left out. */
export function buildJetty(tex: Tex, missing: readonly number[]): THREE.Group {
  const m = kitMaterials(tex);
  const J = STORY_B.shore;
  const g = new THREE.Group();
  const kit = new Buckets();
  kit.material('plank', m.plank);
  kit.material('timber', m.timber);
  const pitch = J.length / J.boards;
  for (let i = 0; i < J.boards; i++) {
    if (missing.includes(i)) continue;
    kit.add('plank', bevelBox(J.width, 0.07, pitch * 0.82, 0.02, 1), {
      x: 0,
      y: 0,
      z: (i + 0.5) * pitch,
    });
  }
  for (const sx of [-1, 1]) {
    kit.add('timber', bevelBox(0.12, 0.12, J.length, 0.03, 1.2), {
      x: (sx * J.width) / 2 - sx * 0.1,
      y: -0.12,
      z: J.length / 2,
    });
    for (let i = 0; i < 4; i++)
      kit.add('timber', bevelBox(0.16, 1.1, 0.16, 0.04, 1.2), {
        x: (sx * J.width) / 2 - sx * 0.1,
        y: -0.55,
        z: 0.3 + (i * (J.length - 0.6)) / 3,
      });
  }
  // Two taller mooring posts at the far end.
  for (const sx of [-1, 1])
    kit.add('timber', bevelBox(0.14, 0.5, 0.14, 0.03, 1.2), {
      x: (sx * J.width) / 2,
      y: 0.28,
      z: J.length - 0.1,
    });
  kit.flush(g);
  return g;
}

/** The mill wheel: a turning pivot (rim, spokes, paddles) on a standing frame. */
export interface WheelModel {
  group: THREE.Group;
  pivot: THREE.Group;
  /** The sheet of water running over the top, shown while the wheel runs. */
  water: THREE.Mesh;
}

export function buildWheel(tex: Tex): WheelModel {
  const m = kitMaterials(tex);
  const R = STORY_B.mill.radius;
  const group = new THREE.Group();
  const frame = bucketsFor(m);
  const axleY = R + 0.3;
  for (const sx of [-1, 1]) {
    frame.add('stone', bevelBox(0.5, 0.5, 0.7, 0.05, 1), { x: sx * 0.62, y: 0.25, z: 0 });
    frame.add('timber', bevelBox(0.2, axleY + 0.1, 0.2, 0.04, 1.2), {
      x: sx * 0.62,
      y: (axleY + 0.1) / 2 + 0.2,
      z: 0,
    });
  }
  // A short plank flume that feeds the top of the wheel from the bank.
  frame.add('plank', bevelBox(0.7, 0.08, 1.6, 0.02, 1), { x: 0, y: axleY + R + 0.12, z: -1.0 });
  for (const sx of [-1, 1])
    frame.add('plank', bevelBox(0.06, 0.2, 1.6, 0.02, 1), {
      x: sx * 0.34,
      y: axleY + R + 0.22,
      z: -1.0,
    });
  frame.add('timber', bevelBox(0.14, axleY + R + 0.1, 0.14, 0.03, 1.2), {
    x: 0,
    y: (axleY + R + 0.1) / 2,
    z: -1.7,
  });
  frame.flush(group);
  const pivot = new THREE.Group();
  pivot.position.set(0, axleY, 0);
  const wk = bucketsFor(m);
  for (const sx of [-1, 1])
    wk.add('timber', new THREE.TorusGeometry(R, 0.06, 6, 24), { x: sx * 0.26, y: 0, z: 0 }, [
      0,
      PI / 2,
      0,
    ]);
  for (let i = 0; i < 8; i++) {
    const t = (i / 8) * PI * 2;
    wk.add('timber', box(0.52, 0.07, R * 2 - 0.1), { x: 0, y: 0, z: 0 }, [t, 0, 0]);
    wk.add('plank', box(0.54, 0.05, 0.32), { x: 0, y: Math.cos(t) * R, z: Math.sin(t) * R }, [
      t + 0.5,
      0,
      0,
    ]);
  }
  wk.add('timber', new THREE.CylinderGeometry(0.14, 0.14, 0.9, 10), { x: 0, y: 0, z: 0 }, [
    0,
    0,
    PI / 2,
  ]);
  wk.flush(pivot);
  group.add(pivot);
  // The water sheet over the wheel's top: pale, soft, and still-form friendly.
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(0.6, 1.0),
    new THREE.MeshBasicMaterial({
      color: '#bfe6ff',
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  water.position.set(0, axleY + R * 0.78, 0.35);
  water.rotation.x = -0.85;
  water.visible = false;
  group.add(water);
  return { group, pivot, water };
}

/** A grey-sand band round the pond's edge, following the ground (M9). */
export function buildSandRing(
  center: { x: number; z: number },
  r0: number,
  r1: number,
  color: string,
  height: (x: number, z: number) => number,
): THREE.Mesh {
  const segs = 72;
  const rings = 4;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let r = 0; r <= rings; r++) {
    const rr = r0 + ((r1 - r0) * r) / rings;
    for (let s = 0; s < segs; s++) {
      const t = (s / segs) * PI * 2;
      const wob = 1 + Math.sin(t * 5 + 1) * 0.03;
      const x = center.x + Math.cos(t) * rr * wob;
      const z = center.z + Math.sin(t) * rr * wob;
      pos.push(x, Math.max(height(x, z), WATER_LEVEL) + 0.1, z);
    }
  }
  for (let r = 0; r < rings; r++)
    for (let s = 0; s < segs; s++) {
      const a = r * segs + s;
      const b = r * segs + ((s + 1) % segs);
      idx.push(a, b, a + segs, b, b + segs, a + segs);
    }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      color,
      roughness: 1,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
    }),
  );
  mesh.name = 'shore-sand';
  mesh.renderOrder = 1;
  return mesh;
}
