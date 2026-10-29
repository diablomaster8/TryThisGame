import * as THREE from 'three';
import { OUTER_PROPS, type OuterProp } from '../config/outer-ring';
import type { Tex } from '../samples/aaa-kit';
import { arc, box, cyl, Parts, sph, type PartKey, type Vec3 } from './prop-kit';
import { groveHeight, WATER_LEVEL } from './terrain';

/**
 * R0072: the outer ring's pieces in Full 3D, from the list the pixel painter reads
 * (`config/outer-ring.ts`). Built from the prop kit and merged by material, so the whole ring
 * is at most four draws beside the trees (the orchard and north-wood trees are kit trees from
 * `wild.ts`, so they fade and batch like the rest). A tappable piece gets an invisible pick
 * cylinder; the HUD answers `outer:<id>` with its line.
 */
const C = {
  wood: '#9a6a3e',
  dark: '#6a4428',
  pale: '#d9a76a',
  stone: '#b9b4aa',
  dstone: '#8d887e',
  moss: '#6f9e4a',
  leaf: '#5f9a3e',
  dleaf: '#3f6e2a',
  straw: '#e6c260',
  dstraw: '#b08a36',
  cream: '#f3ead2',
  red: '#d8402e',
  brass: '#e0b048',
} as const;

type Put = (
  part: PartKey,
  geo: THREE.BufferGeometry,
  local: Vec3,
  color: string,
  rot?: Vec3,
  scale?: Vec3,
  boost?: number,
) => void;

/** A placer for one piece: local offsets turned by its yaw and stood on the ground. */
function placer(P: Parts, p: OuterProp, y0: number): Put {
  const yaw = p.yaw ?? 0;
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return (part, geo, [lx, ly, lz], color, rot = [0, 0, 0], scale = [1, 1, 1], boost = 1) =>
    P.add(
      part,
      geo,
      [p.x + lx * c + lz * s, y0 + ly, p.z - lx * s + lz * c],
      color,
      [rot[0], rot[1] + yaw, rot[2]],
      scale,
      boost,
    );
}

function mushroom(put: Put, x: number, z: number, s: number, cap: string): void {
  put('plain', cyl(0.05 * s, 0.065 * s, 0.2 * s, 6), [x, 0.1 * s, z], C.cream);
  put('plain', sph(0.15 * s, 8, 5), [x, 0.2 * s, z], cap, [0, 0, 0], [1, 0.6, 1]);
}

/** Thin stalks in a clump; `head` caps every other one with a cattail. */
function stalks(put: Put, n: number, r: number, h: number, seed: number, head: boolean): void {
  for (let i = 0; i < n; i++) {
    const a = i * 2.4 + seed;
    const d = r * Math.sqrt(((i * 7 + seed) % n) / n);
    const tall = h * (0.7 + ((i * 13) % 7) / 20);
    const tilt: Vec3 = [Math.sin(a) * 0.12, 0, Math.cos(a) * 0.12];
    put(
      'plain',
      cyl(0.012, 0.022, tall, 4),
      [Math.cos(a) * d, tall / 2, Math.sin(a) * d],
      i % 3 ? C.leaf : C.dleaf,
      tilt,
    );
    if (head && i % 2 === 0)
      put(
        'plain',
        cyl(0.04, 0.04, 0.2, 6),
        [Math.cos(a) * d, tall - 0.05, Math.sin(a) * d],
        '#6a4022',
        tilt,
      );
  }
}

function flowers(put: Put, color: string, seed: number): void {
  put('plain', sph(0.32, 8, 5), [0, 0.05, 0], C.leaf, [0, 0, 0], [1.4, 0.35, 1]);
  for (let i = 0; i < 9; i++) {
    const a = i * 2.39 + seed;
    const d = 0.38 * Math.sqrt(i / 9);
    put('plain', cyl(0.01, 0.01, 0.2, 3), [Math.cos(a) * d, 0.1, Math.sin(a) * d], C.dleaf);
    put(
      'plain',
      sph(0.06, 6, 4),
      [Math.cos(a) * d, 0.22, Math.sin(a) * d],
      color,
      [0, 0, 0],
      [1, 0.7, 1],
    );
  }
}

/** Each kind's pieces, around its foot (local units, front toward +z). */
const BUILD: Partial<Record<OuterProp['art'], (put: Put) => void>> = {
  'mushroom-ring': (put) => {
    put('plain', cyl(1.2, 1.2, 0.02, 20), [0, 0.01, 0], '#4f7e32');
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      mushroom(
        put,
        Math.cos(a) * 1.1,
        Math.sin(a) * 1.1,
        0.9 + (i % 3) * 0.2,
        i % 3 ? C.red : '#e8784a',
      );
    }
  },
  'moss-log': (put) => {
    put('wood', cyl(0.26, 0.3, 2.2, 10), [0, 0.27, 0], C.dark, [0, 0, Math.PI / 2]);
    put('plain', box(1.7, 0.08, 0.36), [0.1, 0.52, 0], C.moss);
    mushroom(put, -0.5, 0.32, 0.7, C.pale);
    mushroom(put, 0.4, 0.3, 0.6, C.pale);
  },
  signpost: (put) => {
    put('wood', box(0.12, 1.4, 0.12), [0, 0.7, 0], C.dark);
    put('wood', box(0.75, 0.2, 0.05), [0.25, 1.18, 0.08], C.wood, [0, 0.35, 0]);
    put('wood', box(0.7, 0.2, 0.05), [-0.22, 0.9, 0.08], C.pale, [0, -0.3, 0]);
    put('plain', box(0.1, 0.1, 0.02), [0.4, 1.18, 0.14], '#3f8a3a');
  },
  toadstools: (put) => {
    mushroom(put, -0.2, 0, 2.2, '#b07a46');
    mushroom(put, 0.2, 0.1, 1.6, '#9a6234');
    mushroom(put, 0.4, -0.15, 1.2, '#c08a52');
  },
  fern: (put) => {
    for (let i = 0; i < 9; i++)
      put(
        'plain',
        box(0.12, 0.02, 0.7),
        [0, 0.18, 0],
        i % 2 ? C.leaf : C.dleaf,
        [-0.55, (i / 9) * Math.PI * 2, 0],
        [1, 1, 1],
      );
  },
  stair: (put) => {
    for (let i = 0; i < 5; i++)
      put(
        'stone',
        box(1.8 - i * 0.12, 0.22, 0.5),
        [0, 0.11 + i * 0.22, 0.8 - i * 0.42],
        i % 2 ? C.stone : C.dstone,
      );
    put('plain', box(0.3, 0.06, 0.3), [0.75, 0.24, 0.8], C.moss);
  },
  cairn: (put) => {
    const stones: [number, number, number][] = [
      [0.5, 0.14, 0],
      [0.38, 0.38, 0.03],
      [0.3, 0.58, -0.02],
      [0.22, 0.75, 0.02],
      [0.14, 0.88, 0],
    ];
    stones.forEach(([r, y, x], i) =>
      put('stone', sph(r, 9, 6), [x, y, 0], i % 2 ? C.stone : C.dstone, [0, i, 0], [1, 0.42, 0.9]),
    );
  },
  telescope: (put) => {
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      put('wood', cyl(0.03, 0.035, 1.05, 5), [Math.cos(a) * 0.2, 0.5, Math.sin(a) * 0.2], C.dark, [
        Math.sin(a) * 0.35,
        0,
        -Math.cos(a) * 0.35,
      ]);
    }
    put('plain', cyl(0.06, 0.09, 0.9, 10), [0.05, 1.08, 0], C.brass, [0, 0, -1.2]);
    put('plain', cyl(0.05, 0.05, 0.08, 10), [0.48, 1.25, 0], '#4a3a20', [0, 0, -1.2]);
  },
  scree: (put) => {
    const bits: [number, number, number][] = [
      [-0.3, 0, 0.3],
      [0.25, 0.15, 0.22],
      [0.55, -0.1, 0.14],
      [-0.05, -0.3, 0.12],
    ];
    bits.forEach(([x, z, r], i) =>
      put(
        'stone',
        sph(r, 7, 5),
        [x, r * 0.35, z],
        i % 2 ? C.stone : C.dstone,
        [0, i, 0],
        [1.2, 0.6, 1],
      ),
    );
  },
  gentians: (put) => flowers(put, '#3a6ae0', 1),
  poppies: (put) => flowers(put, '#e0302a', 2),
  reeds: (put) => stalks(put, 14, 0.35, 1.5, 3, false),
  cattails: (put) => stalks(put, 10, 0.3, 1.3, 5, true),
  boardwalk: (put) => {
    for (let i = 0; i < 9; i++)
      put('wood', box(0.36, 0.06, 1.0), [-1.6 + i * 0.4, 0.3, 0], i % 2 ? C.wood : C.pale);
    for (const z of [-0.42, 0.42]) put('wood', box(3.6, 0.08, 0.08), [0, 0.24, z], C.dark);
    for (const x of [-1.6, 0, 1.6])
      for (const z of [-0.42, 0.42]) put('wood', box(0.1, 0.5, 0.1), [x, 0.05, z], C.dark);
  },
  'lane-gate': (put) => {
    for (const x of [-1.25, 1.25]) put('wood', box(0.18, 2.4, 0.18), [x, 1.2, 0], C.dark);
    put('wood', box(3, 0.2, 0.22), [0, 2.3, 0], C.wood);
    put('stone', box(1.6, 0.06, 0.45), [-0.75, 2.55, 0], '#8a7a8a', [0, 0, 0.32]);
    put('stone', box(1.6, 0.06, 0.45), [0.75, 2.55, 0], '#8a7a8a', [0, 0, -0.32]);
    put('wood', box(1.1, 0.34, 0.05), [0, 1.85, 0.05], C.pale);
    put('plain', box(0.8, 0.06, 0.02), [0, 1.85, 0.085], '#3a6a8a');
    put('glow', box(0.12, 0.16, 0.12), [1.25, 1.75, 0.18], '#ffd25a', [0, 0, 0], [1, 1, 1], 1.6);
  },
  hay: (put) => {
    put('plain', cyl(0.55, 0.55, 0.85, 16), [0, 0.55, 0], C.straw, [0, 0, Math.PI / 2]);
    put(
      'plain',
      cyl(0.4, 0.4, 0.87, 16),
      [0, 0.55, 0],
      C.dstraw,
      [0, 0, Math.PI / 2],
      [1, 1.001, 1],
    );
    put('plain', arc(0.56, 0.02, Math.PI * 2), [0, 0.55, 0], '#7a5a22', [0, Math.PI / 2, 0]);
  },
  scarecrow: (put) => {
    put('wood', cyl(0.05, 0.06, 2.0, 6), [0, 1.0, 0], C.dark);
    put('wood', box(1.5, 0.08, 0.08), [0, 1.4, 0], C.wood);
    put('plain', box(0.55, 0.7, 0.3), [0, 1.2, 0], '#3a5a8a');
    put('plain', box(0.16, 0.16, 0.02), [-0.12, 1.15, 0.16], '#c0563a');
    for (const x of [-0.78, 0.78])
      put('plain', cyl(0.07, 0.03, 0.2, 5), [x, 1.38, 0], C.straw, [0, 0, x > 0 ? -1.4 : 1.4]);
    put('plain', sph(0.24, 10, 8), [0, 1.78, 0], '#d8c08a');
    put('plain', cyl(0.36, 0.36, 0.04, 12), [0, 1.98, 0], '#5a4030');
    put('plain', cyl(0.18, 0.22, 0.26, 10), [0, 2.12, 0], '#6a4a36');
  },
  'hay-cart': (put) => {
    put('wood', box(1.6, 0.12, 0.9), [0, 0.55, 0], C.wood);
    for (const z of [-0.45, 0.45]) put('wood', box(1.6, 0.3, 0.05), [0, 0.75, z], C.pale);
    put('plain', sph(0.75, 10, 6), [0, 0.75, 0], C.straw, [0, 0, 0], [1.05, 0.55, 0.6]);
    for (const x of [-0.5, 0.5])
      for (const z of [-0.5, 0.5]) {
        put('wood', arc(0.32, 0.04, Math.PI * 2), [x, 0.33, z], C.dark);
        put('wood', cyl(0.06, 0.06, 0.08, 8), [x, 0.33, z], C.pale, [Math.PI / 2, 0, 0]);
      }
    for (const z of [-0.25, 0.25])
      put('wood', box(1.0, 0.06, 0.06), [1.25, 0.5, z], C.dark, [0, 0, -0.2]);
  },
  'cider-press': (put) => {
    put('wood', cyl(0.48, 0.44, 0.55, 14), [0, 0.42, 0], C.wood);
    for (const y of [0.25, 0.6])
      put('stone', arc(0.47, 0.02, Math.PI * 2), [0, y, 0], '#3a3a44', [Math.PI / 2, 0, 0]);
    for (const x of [-0.6, 0.6]) put('wood', box(0.12, 1.6, 0.12), [x, 0.8, 0], C.dark);
    put('wood', box(1.35, 0.16, 0.16), [0, 1.55, 0], C.wood);
    put('stone', cyl(0.04, 0.04, 0.8, 8), [0, 1.12, 0], '#9a9aa6');
    put('wood', box(0.7, 0.06, 0.06), [0, 0.95, 0], C.dark);
    put('plain', sph(0.08, 6, 4), [0.2, 0.75, 0.1], C.red);
  },
  beehive: (put) => {
    put('wood', box(0.12, 0.5, 0.12), [0, 0.25, 0], C.dark);
    put('wood', box(0.6, 0.06, 0.6), [0, 0.52, 0], C.wood);
    for (let i = 0; i < 5; i++)
      put(
        'plain',
        arc(0.28 - i * 0.045, 0.06, Math.PI * 2),
        [0, 0.6 + i * 0.1, 0],
        i % 2 ? C.straw : C.dstraw,
        [Math.PI / 2, 0, 0],
      );
    put('plain', sph(0.1, 8, 5), [0, 1.08, 0], C.straw);
    put('plain', box(0.12, 0.08, 0.02), [0, 0.62, 0.3], '#2a1a0a');
  },
  'apple-crate': (put) => {
    for (const y of [0.08, 0.22]) {
      for (const z of [-0.25, 0.25]) put('wood', box(0.75, 0.1, 0.03), [0, y, z], C.pale);
      for (const x of [-0.36, 0.36]) put('wood', box(0.03, 0.1, 0.5), [x, y, 0], C.pale);
    }
    for (let i = 0; i < 8; i++)
      put(
        'plain',
        sph(0.09, 7, 5),
        [-0.24 + (i % 4) * 0.16, 0.3, i < 4 ? -0.1 : 0.1],
        i % 3 ? C.red : '#e8b030',
      );
  },
  ladder: (put) => {
    for (const x of [-0.2, 0.2])
      put('wood', box(0.06, 1.9, 0.06), [x, 0.9, 0.25], C.wood, [-0.28, 0, 0]);
    for (let i = 0; i < 6; i++)
      put(
        'wood',
        box(0.42, 0.04, 0.05),
        [0, 0.2 + i * 0.3, 0.3 - i * 0.085],
        C.pale,
        [-0.28, 0, 0],
      );
  },
};

/** Build the ring's pieces into `group`, and register the tappable ones in `pickables`. */
export function buildOuterRing(group: THREE.Object3D, tex: Tex, pickables: THREE.Object3D[]): void {
  const P = new Parts(tex);
  const proxyMat = new THREE.MeshBasicMaterial({ visible: false });
  const proxyGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.8, 8);
  for (const p of OUTER_PROPS) {
    // Lilies float on the stream; everything else stands on the ground.
    if (p.art === 'lily') {
      const y = WATER_LEVEL + 0.02;
      const put = placer(P, p, y);
      put('plain', cyl(0.32, 0.32, 0.02, 12), [0, 0, 0], '#4f8a3a');
      put('plain', cyl(0.22, 0.22, 0.02, 12), [0.45, 0, 0.2], '#5f9a46');
      put('plain', sph(0.08, 8, 5), [0, 0.06, 0], '#f0a0c0');
      put('plain', sph(0.09, 8, 5), [0.45, 0.07, 0.2], '#5aa040', [0, 0, 0], [1.2, 0.8, 1]);
      continue;
    }
    const make = BUILD[p.art];
    if (!make) continue;
    make(placer(P, p, groveHeight(p.x, p.z)));
    if (p.tap) {
      const proxy = new THREE.Mesh(proxyGeo, proxyMat);
      proxy.position.set(p.x, groveHeight(p.x, p.z) + 0.9, p.z);
      proxy.userData.pick = { kind: 'building', id: `outer:${p.id}` };
      group.add(proxy);
      pickables.push(proxy);
    }
  }
  const ring = P.flush();
  ring.name = 'outer-ring';
  group.add(ring);
}
