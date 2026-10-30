import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { ROLE_COLOURS, VILLAGE, VILLAGE_PICK, type VillageService } from '../config/region-village';
import type { Tex } from '../samples/aaa-kit';
import { villageBuildings, villageDressing, villageRecruits } from '../sim/village';
import type { World } from '../sim/types';
import { buildingMaterial } from './building-kit';
import { arc, box, cyl, Parts, sph, type PartKey, type Vec3 } from './prop-kit';

/**
 * R0095 (WORLD-32): the village square in the 3D Grove (`config/region-village.ts`). The
 * paving, the fountain, the service buildings that stand and the dressing sets that hang are
 * merged into one kit mesh per material (four draws at most) and rebuilt only when the
 * village grows. Recruits are one instanced figure (one draw), coloured by role, walking the
 * loops `sim/village.ts` gives them. Buildings and recruits are tappable through invisible
 * proxies (`village:<service>`, `village:r<i>`), which draw nothing.
 */
const C = {
  wood: '#9a6a3e',
  dark: '#6a4428',
  pale: '#d9a76a',
  stone: '#c9c2b4',
  dstone: '#9a9284',
  cream: '#f4efe6',
  red: '#c8203c',
  blue: '#3f78c0',
  teal: '#4fb0b8',
  purple: '#7a4aa8',
  gold: '#f2c84a',
  water: '#8fd0f0',
  leaf: '#5f9a3e',
} as const;

const FLAGS = ['#e04a4a', '#f2c84a', '#4aa0e0', '#7ac04a', '#e07ac0', '#ffffff'];

type Put = (part: PartKey, geo: THREE.BufferGeometry, at: Vec3, color: string, rot?: Vec3) => void;

/** A placer for one building: local offsets turned by its yaw and stood on the ground. */
function placer(P: Parts, x: number, z: number, yaw: number, y0: number): Put {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return (part, geo, [lx, ly, lz], color, rot = [0, 0, 0]) =>
    P.add(part, geo, [x + lx * c + lz * s, y0 + ly, z - lx * s + lz * c], color, [
      rot[0],
      rot[1] + yaw,
      rot[2],
    ]);
}

/** A pitched roof over a w × d footprint, ridge along x, eaves at `y`. */
function roof(put: Put, w: number, d: number, y: number, color: string): void {
  const pitch = 0.6;
  const half = d / 2 + 0.25;
  const slope = half / Math.cos(pitch);
  for (const side of [-1, 1])
    put(
      'wood',
      box(w + 0.4, 0.12, slope, 0.03),
      [0, y + (Math.sin(pitch) * slope) / 2, (side * half) / 2],
      color,
      [side * pitch, 0, 0],
    );
}

const BUILD: Record<VillageService, (put: Put) => void> = {
  stall: (put) => {
    for (const px of [-1.05, 1.05]) put('wood', box(0.13, 2.0, 0.13), [px, 1.0, -0.1], C.dark);
    put('wood', box(2.1, 0.8, 0.6, 0.05), [0, 0.4, 0], C.wood);
    put('wood', box(2.24, 0.09, 0.72, 0.03), [0, 0.84, 0], C.pale);
    for (let i = 0; i < 6; i++)
      put(
        'plain',
        box(0.4, 0.04, 1.0),
        [-1 + i * 0.4, 1.95, 0.05],
        i % 2 ? C.cream : C.red,
        [0.35, 0, 0],
      );
    for (let i = 0; i < 6; i++)
      put('plain', sph(0.1, 8, 6), [-0.85 + i * 0.34, 0.98, 0.05], FLAGS[i % 4]!);
  },
  gym: (put) => {
    put('plain', box(3.6, 1.9, 2.8, 0.06), [0, 0.95, 0], C.cream);
    put('wood', box(3.7, 0.18, 2.9, 0.04), [0, 0.09, 0], C.dark);
    roof(put, 3.6, 2.8, 1.9, C.red);
    put('wood', box(0.9, 1.4, 0.08), [0, 0.7, 1.42], C.dark);
    // The sign over the door: a dumbbell, so the gym reads without words.
    put('wood', box(1.4, 0.5, 0.08), [0, 1.65, 1.46], C.pale);
    put('plain', cyl(0.04, 0.04, 0.8, 6), [0, 1.65, 1.53], C.dstone, [0, 0, Math.PI / 2]);
    for (const sx of [-0.42, 0.42]) put('plain', sph(0.15, 8, 6), [sx, 1.65, 1.53], C.dstone);
  },
  attendant: (put) => {
    put('plain', box(3.2, 1.7, 2.6, 0.06), [0, 0.85, 0], C.cream);
    put('stone', box(3.3, 0.2, 2.7, 0.04), [0, 0.1, 0], C.dstone);
    roof(put, 3.2, 2.6, 1.7, C.blue);
    put('stone', box(0.4, 1.0, 0.4), [1.0, 2.5, -0.5], C.dstone);
    // The doorway's curtain: four blue strips.
    for (let i = 0; i < 4; i++)
      put('plain', box(0.2, 0.7, 0.04), [-0.33 + i * 0.22, 1.1, 1.32], C.teal);
    put('glow', sph(0.12, 8, 6), [0.75, 1.25, 1.35], '#ffe6a0');
  },
  fortune: (put) => {
    put('plain', cyl(0.05, 1.2, 2.3, 10), [0, 1.15, 0], C.purple);
    put('plain', cyl(1.22, 1.22, 0.12, 10), [0, 0.06, 0], C.dark);
    put('glow', sph(0.16, 8, 6), [0, 2.4, 0], C.gold);
    // A little table out front with a crystal ball.
    put('wood', cyl(0.32, 0.32, 0.06, 10), [0, 0.6, 1.5], C.wood);
    put('wood', cyl(0.05, 0.05, 0.6, 6), [0, 0.3, 1.5], C.dark);
    put('glow', sph(0.17, 10, 8), [0, 0.8, 1.5], '#b8e4ff');
  },
  festival: (put) => {
    put('wood', box(4.2, 0.45, 1.9, 0.05), [0, 0.22, 0], C.wood);
    for (const px of [-2, 2]) put('wood', box(0.16, 2.4, 0.16), [px, 1.4, -0.8], C.dark);
    put('plain', box(4.2, 0.5, 0.06), [0, 2.4, -0.8], C.red);
    for (let i = 0; i < 5; i++)
      put('glow', sph(0.14, 8, 6), [-1.6 + i * 0.8, 2.05, -0.75], FLAGS[i % FLAGS.length]!);
  },
};

/** The dressing sets, hung round the square in order as prosperity grows. */
function dressing(put: Put, set: (typeof VILLAGE.dressing)[number]): void {
  const R = VILLAGE.square.r;
  const ring = (n: number, r: number, f: (x: number, z: number, a: number, i: number) => void) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.2;
      f(Math.cos(a) * r, Math.sin(a) * r, a, i);
    }
  };
  if (set === 'bunting')
    ring(28, R - 0.6, (x, z, a, i) =>
      put('plain', cyl(0, 0.13, 0.26, 3), [x, 2.55, z], FLAGS[i % FLAGS.length]!, [Math.PI, -a, 0]),
    );
  if (set === 'bunting')
    ring(8, R - 0.6, (x, z) => put('wood', cyl(0.05, 0.06, 2.8, 6), [x, 1.4, z], C.dark));
  // The bunting's rope: one thin ring through the post tops.
  if (set === 'bunting')
    put('plain', arc(R - 0.6, 0.02, Math.PI * 2), [0, 2.68, 0], C.dark, [Math.PI / 2, 0, 0]);
  if (set === 'lanterns')
    ring(6, R - 1.1, (x, z) => {
      put('wood', cyl(0.05, 0.07, 1.8, 6), [x, 0.9, z], C.dark);
      put('glow', sph(0.16, 8, 6), [x, 1.85, z], '#ffd27a');
    });
  if (set === 'flowers')
    ring(8, R - 2.3, (x, z, a, i) => {
      put('wood', box(0.7, 0.3, 0.3), [x, 0.15, z], C.wood, [0, -a, 0]);
      for (let k = -1; k <= 1; k++)
        put(
          'plain',
          sph(0.12, 6, 5),
          [x + Math.sin(a) * k * 0.2, 0.38, z - Math.cos(a) * k * 0.2],
          FLAGS[(i + k + 3) % FLAGS.length]!,
        );
    });
  if (set === 'pennants')
    ring(4, R + 0.6, (x, z, _a, i) => {
      put('wood', cyl(0.05, 0.06, 3.6, 6), [x, 1.8, z], C.pale);
      put('plain', box(0.9, 0.4, 0.04), [x + 0.45, 3.3, z], FLAGS[i % FLAGS.length]!);
    });
  if (set === 'arch') {
    // A flower arch where the lane comes in, from the north-east.
    const a = Math.atan2(-0.72, 0.69);
    const x = Math.cos(a) * (R + 0.2);
    const z = Math.sin(a) * (R + 0.2);
    put('plain', arc(1.3, 0.12, Math.PI), [x, 0.2, z], C.leaf, [0, -a + Math.PI / 2, 0]);
    for (let i = 0; i < 9; i++) {
      const t = (i / 8) * Math.PI;
      const lx = Math.cos(t) * 1.3;
      put(
        'plain',
        sph(0.14, 6, 5),
        [x + Math.sin(a) * lx, 0.2 + Math.sin(t) * 1.3, z - Math.cos(a) * lx],
        FLAGS[i % FLAGS.length]!,
      );
    }
  }
}

/** The recruit figure: a round body, two dark eyes and a little crown, in one geometry. */
function figureGeometry(): THREE.BufferGeometry {
  const h = VILLAGE.figure.h;
  const parts: THREE.BufferGeometry[] = [];
  const add = (g: THREE.BufferGeometry, x: number, y: number, z: number, white: number) => {
    const n = (g.index ? g.toNonIndexed() : g).translate(x, y, z);
    for (const k of Object.keys(n.attributes))
      if (k !== 'position' && k !== 'normal') n.deleteAttribute(k);
    const c = new Float32Array(n.attributes.position!.count * 3).fill(white);
    n.setAttribute('color', new THREE.BufferAttribute(c, 3));
    parts.push(n);
  };
  add(new THREE.SphereGeometry(h * 0.42, 10, 8), 0, h * 0.42, 0, 1);
  add(new THREE.SphereGeometry(h * 0.3, 10, 8), 0, h * 0.9, 0, 1);
  for (const ex of [-0.11, 0.11])
    add(new THREE.SphereGeometry(h * 0.05, 6, 4), ex, h * 0.95, h * 0.27, 0.05);
  add(new THREE.ConeGeometry(h * 0.1, h * 0.25, 6), 0, h * 1.28, 0, 1.15);
  return mergeGeometries(parts, false)!;
}

export class VillageSquare {
  readonly group = new THREE.Group();
  private kit: THREE.Group | null = null;
  private key = '';
  private readonly figures: THREE.InstancedMesh;
  private readonly buildingProxies = new Map<VillageService, THREE.Mesh>();
  private readonly recruitProxies: THREE.Mesh[] = [];
  private readonly m4 = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly colour = new THREE.Color();

  constructor(
    parent: THREE.Object3D,
    private readonly tex: Tex,
    private readonly ground: (x: number, z: number) => number,
    pickables: THREE.Object3D[],
  ) {
    this.group.name = 'village-square';
    parent.add(this.group);
    const mat = buildingMaterial(tex.plaster, { normal: 0.2 });
    mat.vertexColors = true;
    this.figures = new THREE.InstancedMesh(figureGeometry(), mat, VILLAGE.loop.max);
    this.figures.name = 'village-recruits';
    this.figures.count = 0;
    this.figures.castShadow = true;
    this.figures.frustumCulled = false;
    this.group.add(this.figures);
    const hidden = new THREE.MeshBasicMaterial({ visible: false });
    for (const b of VILLAGE.buildings) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(b.hw * 2, b.h, b.hd * 2), hidden);
      p.position.set(b.x, ground(b.x, b.z) + b.h / 2, b.z);
      p.rotation.y = b.yaw;
      p.userData.pick = { kind: 'building', id: `${VILLAGE_PICK}${b.id}` };
      p.visible = false;
      this.group.add(p);
      pickables.push(p);
      this.buildingProxies.set(b.id, p);
    }
    const r = VILLAGE.figure.pick;
    const pickGeo = new THREE.CylinderGeometry(r, r, VILLAGE.figure.h * 1.4, 8);
    for (let i = 0; i < VILLAGE.loop.max; i++) {
      const p = new THREE.Mesh(pickGeo, hidden);
      p.userData.pick = { kind: 'building', id: `${VILLAGE_PICK}r${i}` };
      p.visible = false;
      this.group.add(p);
      pickables.push(p);
      this.recruitProxies.push(p);
    }
  }

  /** Rebuild the merged kit for the buildings standing and the dressing hung. */
  private rebuild(standing: readonly VillageService[], sets: number): void {
    if (this.kit) {
      this.group.remove(this.kit);
      this.kit.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
    }
    const P = new Parts(this.tex);
    const sq = VILLAGE.square;
    const y0 = this.ground(sq.x, sq.z);
    const at = placer(P, sq.x, sq.z, 0, y0);
    // The paving and the fountain, there from the start.
    at('stone', cyl(sq.r, sq.r + 0.15, 0.06, 28), [0, 0.03, 0], C.stone);
    const f = VILLAGE.fountain;
    at('stone', cyl(f.r, f.r + 0.1, f.h, 18), [0, f.h / 2, 0], C.dstone);
    at('glow', cyl(f.r - 0.12, f.r - 0.12, 0.04, 18), [0, f.h - 0.04, 0], C.water);
    at('stone', cyl(0.18, 0.24, f.spout, 8), [0, f.spout / 2, 0], C.stone);
    at('stone', cyl(0.5, 0.2, 0.18, 12), [0, f.spout, 0], C.dstone);
    at('glow', sph(0.22, 8, 6), [0, f.spout + 0.18, 0], C.water);
    for (const b of VILLAGE.buildings)
      if (standing.includes(b.id)) BUILD[b.id](placer(P, b.x, b.z, b.yaw, this.ground(b.x, b.z)));
    for (let i = 0; i < sets; i++) dressing(at, VILLAGE.dressing[i]!);
    this.kit = P.flush();
    this.kit.name = 'village-kit';
    this.group.add(this.kit);
  }

  update(world: World, home: boolean): void {
    this.group.visible = home;
    if (!home) return;
    const standing = villageBuildings(world).map((b) => b.id);
    const sets = villageDressing(world);
    const key = `${standing.join(',')}|${sets}`;
    if (key !== this.key) {
      this.key = key;
      this.rebuild(standing, sets);
      for (const [id, p] of this.buildingProxies) p.visible = standing.includes(id);
    }
    const recruits = villageRecruits(world);
    this.figures.count = recruits.length;
    // An instanced mesh with no instances still costs a draw call.
    this.figures.visible = recruits.length > 0;
    recruits.forEach((r, i) => {
      const y = this.ground(r.pos.x, r.pos.z);
      // A gentle walking bob.
      const bob = Math.abs(Math.sin(world.timeMs / 180 + i)) * 0.06;
      this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, r.yaw);
      this.m4.compose(
        new THREE.Vector3(r.pos.x, y + bob, r.pos.z),
        this.q,
        new THREE.Vector3(1, 1, 1),
      );
      this.figures.setMatrixAt(i, this.m4);
      this.figures.setColorAt(i, this.colour.set(ROLE_COLOURS[r.role]));
      const p = this.recruitProxies[i]!;
      p.position.set(r.pos.x, y + VILLAGE.figure.h * 0.7, r.pos.z);
    });
    this.recruitProxies.forEach((p, i) => (p.visible = i < recruits.length));
    this.figures.instanceMatrix.needsUpdate = true;
    if (this.figures.instanceColor) this.figures.instanceColor.needsUpdate = true;
  }
}
