import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { StoryPropKind } from '../sim/story-props';
import type { Tex } from '../samples/aaa-kit';
import { bevelBox, buildingMaterial } from './building-kit';
import { KIT_SHARED } from './kit-buildings';

/**
 * The 3D Grove's small-prop kit (campaign graphics H10): props built from the building
 * kit's bevelled boxes and its painted, toon-lit materials, merged by material into at
 * most four meshes each (wood, stone, plain, glow). Each piece carries a vertex colour,
 * which multiplies the material's painted texture, so one wood material makes a dark
 * bench and a pale shelf alike. `glow` is unlit and may be brighter than 1, so bloom
 * picks it up in place of a point light. Origin at the prop's foot, front toward +z.
 */
export type PartKey = 'wood' | 'stone' | 'plain' | 'glow';
export type Vec3 = readonly [number, number, number];

const KITS = new WeakMap<Tex, Record<PartKey, THREE.Material>>();

function propMaterials(tex: Tex): Record<PartKey, THREE.Material> {
  let k = KITS.get(tex);
  if (k) return k;
  const tinted = (s: Tex['wood'], normal: number): THREE.Material => {
    const m = buildingMaterial(s, { normal });
    (m as THREE.MeshStandardMaterial).vertexColors = true;
    return m;
  };
  k = {
    wood: tinted(tex.wood, 0.4),
    stone: tinted(tex.cobble, 0.45),
    plain: tinted(tex.plaster, 0.25),
    glow: new THREE.MeshBasicMaterial({ vertexColors: true, fog: false }),
  };
  for (const m of Object.values(k)) KIT_SHARED.add(m);
  KITS.set(tex, k);
  return k;
}

const m4 = new THREE.Matrix4();
const q = new THREE.Quaternion();
const eul = new THREE.Euler();
const tint = new THREE.Color();

/** Pieces gathered by material and merged on `flush`. */
export class Parts {
  private readonly lists: Record<PartKey, THREE.BufferGeometry[]> = {
    wood: [],
    stone: [],
    plain: [],
    glow: [],
  };

  constructor(private readonly tex: Tex) {}

  /**
   * Add `geo` at `p`, turned by `rot` (radians about its own centre), scaled by `scale`,
   * coloured `color` (a CSS hex). `boost` multiplies the colour: above 1 it glows under bloom.
   */
  add(
    part: PartKey,
    geo: THREE.BufferGeometry,
    p: Vec3,
    color: string,
    rot: Vec3 = [0, 0, 0],
    scale: Vec3 = [1, 1, 1],
    boost = 1,
  ): void {
    q.setFromEuler(eul.set(rot[0], rot[1], rot[2]));
    m4.compose(
      new THREE.Vector3(p[0], p[1], p[2]),
      q,
      new THREE.Vector3(scale[0], scale[1], scale[2]),
    );
    const g = (geo.index ? geo.toNonIndexed() : geo.clone()).applyMatrix4(m4);
    for (const k of Object.keys(g.attributes))
      if (k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k);
    const n = g.attributes.position!.count;
    if (!g.attributes.uv)
      g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
    tint.set(color);
    const c = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      c[i * 3] = tint.r * boost;
      c[i * 3 + 1] = tint.g * boost;
      c[i * 3 + 2] = tint.b * boost;
    }
    g.setAttribute('color', new THREE.BufferAttribute(c, 3));
    this.lists[part].push(g);
    geo.dispose();
  }

  /** One mesh per material under a new group. */
  flush(): THREE.Group {
    const group = new THREE.Group();
    const mats = propMaterials(this.tex);
    for (const key of Object.keys(this.lists) as PartKey[]) {
      const geos = this.lists[key];
      if (!geos.length) continue;
      const merged = mergeGeometries(geos, false);
      for (const g of geos) g.dispose();
      geos.length = 0;
      if (!merged) continue;
      const mesh = new THREE.Mesh(merged, mats[key]);
      mesh.name = `prop-${key}`;
      mesh.castShadow = key !== 'glow';
      mesh.receiveShadow = key !== 'glow';
      group.add(mesh);
    }
    return group;
  }
}

export const box = (w: number, h: number, d: number, r = 0.02): THREE.BufferGeometry =>
  bevelBox(w, h, d, r);
export const cyl = (rt: number, rb: number, h: number, seg = 12): THREE.BufferGeometry =>
  new THREE.CylinderGeometry(rt, rb, h, seg);
export const sph = (r: number, w = 10, h = 8): THREE.BufferGeometry =>
  new THREE.SphereGeometry(r, w, h);
export const arc = (R: number, tube: number, a: number): THREE.BufferGeometry =>
  new THREE.TorusGeometry(R, tube, 6, 12, a);

const WOOD = '#9a6a3e';
const DARK = '#6a4428';
const STONE = '#b9b4aa';
const DSTONE = '#8d887e';
const LICHEN = '#8fae6a';
const CREAM = '#f3ead2';
const SHELL = ['#f4efe2', '#d9e6ee', '#efe1c8', '#e8e4d8', '#cfe0d6'];

/** A story prop (sim/story-props.ts) as a kit-built group, or null for the cabins. */
export function buildStoryProp(tex: Tex, kind: StoryPropKind): THREE.Group | null {
  const P = new Parts(tex);
  switch (kind) {
    case 'trowel': {
      // A pointed blade on a short neck, a grip with a curved loop handle.
      P.add(
        'plain',
        new THREE.ConeGeometry(0.075, 0.26, 4),
        [-0.1, 0.035, 0.27],
        '#9aa3ab',
        [-Math.PI / 2, 0, Math.PI / 4],
        [1, 1, 0.35],
      );
      P.add('plain', box(0.03, 0.03, 0.12, 0.01), [-0.1, 0.04, 0.1], '#7a828a');
      P.add('wood', box(0.05, 0.045, 0.2, 0.02), [-0.1, 0.045, -0.04], WOOD);
      P.add('wood', arc(0.06, 0.014, Math.PI * 1.2), [-0.1, 0.07, -0.16], DARK, [
        0,
        Math.PI / 2,
        Math.PI / 2 - 0.3,
      ]);
      break;
    }
    case 'register': {
      // A ledger: cover, ruled pages, a ribbon.
      P.add('wood', box(0.4, 0.04, 0.3, 0.015), [0, 0.02, 0], '#5e3a2a');
      P.add('plain', box(0.36, 0.06, 0.26, 0.01), [0.01, 0.07, 0], CREAM);
      for (let i = 0; i < 6; i++)
        P.add('plain', box(0.3, 0.004, 0.006, 0.002), [0.01, 0.102, -0.1 + i * 0.04], '#8a7a62');
      P.add('wood', box(0.4, 0.035, 0.3, 0.015), [0, 0.12, 0], '#5e3a2a', [0, 0, 0], [1, 0.4, 1]);
      P.add('plain', box(0.02, 0.01, 0.2, 0.004), [0.14, 0.108, 0.12], '#b04a3a');
      break;
    }
    case 'handLantern': {
      // A pole with a wire cage round an emissive glass.
      P.add('wood', box(0.05, 0.9, 0.05, 0.015), [0, 0.45, 0], DARK);
      P.add('wood', box(0.2, 0.03, 0.2, 0.01), [0, 0.5, 0], DARK);
      P.add('glow', box(0.14, 0.18, 0.14, 0.02), [0, 0.6, 0], '#ffcf70', [0, 0, 0], [1, 1, 1], 1.8);
      for (const sx of [-1, 1])
        for (const sz of [-1, 1])
          P.add('plain', box(0.015, 0.24, 0.015, 0.005), [sx * 0.085, 0.61, sz * 0.085], '#3a3a42');
      for (const y of [0.52, 0.7])
        P.add('plain', box(0.19, 0.012, 0.19, 0.004), [0, y, 0], '#3a3a42');
      P.add('wood', new THREE.ConeGeometry(0.15, 0.1, 4), [0, 0.78, 0], DARK, [0, Math.PI / 4, 0]);
      P.add('plain', arc(0.06, 0.008, Math.PI), [0, 0.81, 0], '#3a3a42');
      break;
    }
    case 'flatStone': {
      // A broad slab on a lower one, speckled with lichen.
      P.add('stone', box(1.3, 0.16, 0.9, 0.06), [0, 0.08, 0], STONE);
      P.add('stone', box(1.05, 0.08, 0.72, 0.04), [0.08, 0.2, 0.02], DSTONE);
      const dots: Array<[number, number, number]> = [
        [-0.45, 0.17, 0.2],
        [-0.3, 0.17, -0.25],
        [0.4, 0.17, 0.3],
        [0.5, 0.17, -0.2],
        [-0.1, 0.25, 0.1],
        [0.2, 0.25, -0.15],
        [-0.35, 0.25, -0.1],
        [0.0, 0.17, 0.4],
      ];
      dots.forEach(([x, y, z], i) =>
        P.add(
          'plain',
          sph(0.05 + (i % 3) * 0.015, 6, 4),
          [x, y, z],
          i % 2 ? LICHEN : '#c9d18a',
          [0, i, 0],
          [1.5, 0.3, 1.2],
        ),
      );
      break;
    }
    case 'gardenDoor': {
      for (const x of [-0.75, 0.75]) P.add('stone', box(0.5, 1.5, 0.5, 0.05), [x, 0.75, 0], DSTONE);
      P.add('stone', box(2.0, 0.18, 0.56, 0.05), [0, 1.59, 0], STONE);
      for (let i = 0; i < 4; i++)
        P.add(
          'wood',
          box(0.24, 1.35, 0.08, 0.02),
          [-0.375 + i * 0.25, 0.675, 0.18],
          i % 2 ? '#8a5a34' : '#9a6236',
        );
      P.add('wood', box(1.0, 0.07, 0.1, 0.02), [0, 1.0, 0.24], '#4a3220');
      P.add('wood', box(1.0, 0.07, 0.1, 0.02), [0, 0.3, 0.24], '#4a3220');
      P.add('plain', sph(0.05, 8, 6), [0.35, 0.7, 0.3], '#c8a24e');
      break;
    }
    case 'oldBench': {
      P.add('wood', box(1.1, 0.08, 0.36, 0.025), [0, 0.36, 0], DARK);
      P.add('wood', box(1.1, 0.08, 0.05, 0.02), [0, 0.52, -0.16], DARK, [0.15, 0, 0]);
      P.add('wood', box(1.1, 0.06, 0.05, 0.02), [0, 0.64, -0.18], DARK, [0.15, 0, 0]);
      for (const x of [-0.45, 0.45]) {
        P.add('wood', box(0.08, 0.36, 0.3, 0.02), [x, 0.18, 0], '#58381f');
        P.add('wood', box(0.07, 0.3, 0.06, 0.02), [x, 0.5, -0.17], '#58381f', [0.15, 0, 0]);
      }
      break;
    }
    case 'chair': {
      // A seat, four legs and a carved back: rails, slats and a diamond.
      P.add('wood', box(0.5, 0.06, 0.5, 0.02), [0, 0.4, 0], WOOD);
      for (const [x, z] of [
        [-0.2, -0.2],
        [0.2, -0.2],
        [-0.2, 0.2],
        [0.2, 0.2],
      ] as const)
        P.add('wood', box(0.05, 0.4, 0.05, 0.015), [x, 0.2, z], DARK);
      for (const x of [-0.2, 0.2])
        P.add('wood', box(0.05, 0.62, 0.05, 0.015), [x, 0.74, -0.22], DARK);
      P.add('wood', box(0.5, 0.09, 0.05, 0.03), [0, 1.04, -0.22], DARK);
      P.add('wood', box(0.4, 0.05, 0.04, 0.015), [0, 0.5, -0.22], WOOD);
      for (const x of [-0.1, 0.1])
        P.add('wood', box(0.05, 0.4, 0.035, 0.012), [x, 0.74, -0.22], WOOD);
      P.add('wood', box(0.12, 0.12, 0.04, 0.012), [0, 0.8, -0.215], '#4a3220', [0, 0, Math.PI / 4]);
      break;
    }
    case 'shelf': {
      // A wall shelf: a board on brackets, dated eggshells with their tags.
      P.add('wood', box(0.9, 0.045, 0.22, 0.015), [0, 0.9, 0], WOOD);
      for (const x of [-0.34, 0.34])
        P.add('wood', box(0.04, 0.2, 0.18, 0.012), [x, 0.78, -0.02], DARK);
      P.add('wood', box(0.9, 0.3, 0.03, 0.01), [0, 1.07, -0.1], '#7c5532');
      shellRow(P, 0.925, 0.0);
      break;
    }
    default:
      return null;
  }
  return P.flush();
}

/** Five eggshell halves on a board at height `y`, each with a pinned date tag. */
export function shellRow(P: Parts, y: number, z: number, n = 5): void {
  for (let i = 0; i < n; i++) {
    const x = (i - (n - 1) / 2) * 0.16;
    const g = new THREE.SphereGeometry(0.052, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.62);
    P.add(
      'plain',
      g,
      [x, y, z],
      SHELL[i % SHELL.length]!,
      [-0.35 + (i % 3) * 0.25, i, 0],
      [1, 1.15, 0.95],
    );
    P.add('plain', box(0.045, 0.055, 0.006, 0.003), [x, y + 0.03, z + 0.075], CREAM);
    P.add('plain', box(0.03, 0.004, 0.002, 0.001), [x, y + 0.035, z + 0.079], '#8a7a62');
  }
}
