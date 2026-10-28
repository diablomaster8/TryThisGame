/**
 * The outer ring's wild props in Full 3D, from the same `WILD_PROPS` list the pixel scenery
 * and the sim's colliders use (R0037). Wild trees come from the tree kit with no fruit and
 * no pick, and are returned so they fade with the fruit trees; bushes, logs and rocks are one
 * instanced mesh each, so the whole ring costs three draw calls beside the trees.
 */
import * as THREE from 'three';
import { GROVE } from '../config/tuning';
import { WILD_PROPS, type WildProp } from '../config/grove-layout';
import { WILD_3D as T } from '../config/tuning-move-wild';
import { buildTree, pbr, type Tex } from '../samples/aaa-kit';
import { treeOf, type GroveTree } from './crowns';
import { groveHeight } from './terrain';

const isTree = (p: WildProp) => p.art.startsWith('wild');
const isBush = (p: WildProp) => p.art.startsWith('bush');

/** Pseudo-random 0..1 from an index, so the same prop looks the same in every load. */
const hash = (i: number, k: number) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export function buildWildTrees(
  scene: THREE.Object3D,
  tex: Tex,
  time?: { value: number },
): GroveTree[] {
  const made: GroveTree[] = [];
  WILD_PROPS.forEach((p, i) => {
    if (!isTree(p)) return;
    const parts = buildTree(
      scene,
      tex,
      p.x,
      p.z,
      p.size * T.treeScalePerSize,
      T.treeSeedBase + i,
      groveHeight,
      time,
    );
    // The kit hangs fruit on every tree; a wild tree bears none, so take it back off.
    const bare = parts.filter((o) => {
      const fruit = o instanceof THREE.Mesh && o.geometry instanceof THREE.SphereGeometry;
      if (fruit) {
        scene.remove(o);
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
      return !fruit;
    });
    const tree = treeOf(bare, p.size * T.treeScalePerSize);
    if (tree) made.push(tree);
  });
  return made;
}

function instanced(
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  items: { m: THREE.Matrix4; c: THREE.Color }[],
  name: string,
): THREE.InstancedMesh | null {
  if (!items.length) return null;
  const mesh = new THREE.InstancedMesh(geo, mat, items.length);
  items.forEach((it, k) => {
    mesh.setMatrixAt(k, it.m);
    mesh.setColorAt(k, it.c);
  });
  mesh.castShadow = mesh.receiveShadow = true;
  mesh.name = name;
  mesh.frustumCulled = false;
  return mesh;
}

/** Bushes, logs and rocks as instanced meshes, added to `group`. */
export function buildWildGround(group: THREE.Object3D, tex: Tex): void {
  const bushes: { m: THREE.Matrix4; c: THREE.Color }[] = [];
  const logs: typeof bushes = [];
  const rocks: typeof bushes = [];
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const pos = new THREE.Vector3();
  const sc = new THREE.Vector3();
  const matrix = (
    x: number,
    y: number,
    z: number,
    yaw: number,
    sx: number,
    sy: number,
    sz: number,
  ) => {
    q.setFromEuler(e.set(0, yaw, 0));
    return new THREE.Matrix4().compose(pos.set(x, y, z), q, sc.set(sx, sy, sz));
  };
  const tint = (hex: string, i: number) =>
    new THREE.Color(hex).offsetHSL(0, 0, (hash(i, 3) - 0.5) * T.jitter);

  WILD_PROPS.forEach((p, i) => {
    if (isTree(p)) return;
    const y = groveHeight(p.x, p.z);
    const yaw = hash(i, 1) * Math.PI * 2;
    if (isBush(p)) {
      const r = p.size * T.bushRadius;
      bushes.push({
        m: matrix(p.x, y + r * T.bushSquash * 0.55, p.z, yaw, r, r * T.bushSquash, r),
        c: tint(T.bushColours[i % T.bushColours.length]!, i),
      });
    } else if (p.art === 'log') {
      const len = 0.8 * p.size + T.logExtra;
      logs.push({
        m: matrix(p.x, y + T.logRadius * 0.8, p.z, p.yaw ?? 0, len, T.logRadius, T.logRadius),
        c: tint(T.logColour, i),
      });
    } else {
      // A rock that stands on one of the big rocks is that rock, which is built already.
      if (GROVE.rocks.some((k) => Math.hypot(k.x - p.x, k.z - p.z) < 0.3)) return;
      const r = p.size * T.rockRadius;
      rocks.push({
        m: matrix(p.x, y + r * T.rockHeight * 0.4, p.z, yaw, r, r * T.rockHeight, r * 0.85),
        c: tint(T.rockColour, i),
      });
    }
  });

  // Bush: a unit blob; log: a unit-length cylinder along x; rock: a faceted unit blob.
  const blob = new THREE.IcosahedronGeometry(1, 1);
  const cyl = new THREE.CylinderGeometry(0.5, 0.5, 1, 10).rotateZ(Math.PI / 2);
  // The cylinder is 1 long along x and 1 wide: scale (len, r*2, r*2) wanted, so scale by r*2.
  cyl.scale(1, 2, 2);
  const rockGeo = new THREE.DodecahedronGeometry(1, 0);
  const bushMat = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.9,
    flatShading: true,
  });
  const logMat = pbr(tex.bark, { scale: 0.8 });
  const rockMat = pbr(tex.rock, { scale: 0.6 });
  for (const m of [
    instanced(blob, bushMat, bushes, 'wild-bushes'),
    instanced(cyl, logMat, logs, 'wild-logs'),
    instanced(rockGeo, rockMat, rocks, 'wild-rocks'),
  ])
    if (m) group.add(m);
}
