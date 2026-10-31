/**
 * The outer ring's wild props in Full 3D, from the same `WILD_PROPS` list the pixel scenery
 * and the sim's colliders use (R0037). Wild trees come from the tree kit with no fruit and
 * no pick, and are returned so they fade with the fruit trees; bushes, logs and rocks are one
 * instanced mesh each, so the whole ring costs three draw calls beside the trees.
 */
import * as THREE from 'three';
import { GROVE } from '../config/tuning';
import { WILD_PROPS, type WildProp } from '../config/grove-layout';
import { OUTER_PROPS, OUTER_TREES } from '../config/outer-ring';
import { WILD_3D as T } from '../config/tuning-move-wild';
import { BUSH } from '../config/tuning-move';
import { buildTree, pbr, type Tex } from '../samples/aaa-kit';
import { treeOf, type GroveTree } from './crowns';
import { groveHeight } from './terrain';
import { borderBlockers } from '../sim/border';
import { BORDER } from '../config/tuning-r9d2';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/**
 * R0079/WORLD perf: a kit tree is nine draws (trunk, three branches, five fruit) beside its
 * crown, and each again in the shadow pass. The branches are baked into the trunk (they
 * thin with it when it stands in the way) and the fruit into one mesh, so a tree is three.
 * Returns the parts in the kit's order: trunk first, then the crown, then the fruit.
 */
export function compactTree(scene: THREE.Object3D, parts: THREE.Object3D[]): THREE.Object3D[] {
  const trunk = parts[0] as THREE.Mesh | undefined;
  if (!trunk?.isMesh) return parts;
  const isCyl = (o: THREE.Object3D): o is THREE.Mesh =>
    o !== trunk && o instanceof THREE.Mesh && o.geometry instanceof THREE.CylinderGeometry;
  const isFruit = (o: THREE.Object3D): o is THREE.Mesh =>
    o instanceof THREE.Mesh && o.geometry instanceof THREE.SphereGeometry;
  const fold = (meshes: THREE.Mesh[], into: THREE.Matrix4): THREE.BufferGeometry | null => {
    const geos = meshes.map((m) => {
      m.updateMatrix();
      return m.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(into, m.matrix));
    });
    const out = mergeGeometries(geos);
    for (const g of geos) g.dispose();
    return out;
  };
  const drop = (m: THREE.Mesh) => {
    scene.remove(m);
    m.geometry.dispose();
    (m.material as THREE.Material).dispose();
  };
  const branches = parts.filter(isCyl);
  trunk.updateMatrix();
  const toTrunk = trunk.matrix.clone().invert();
  const wood = fold([trunk, ...branches], toTrunk);
  if (wood) {
    trunk.geometry.dispose();
    trunk.geometry = wood;
    for (const b of branches) drop(b);
  }
  const fruit = parts.filter(isFruit);
  let bunch: THREE.Mesh | null = null;
  const fruitGeo = fruit.length > 1 ? fold(fruit, new THREE.Matrix4()) : null;
  if (fruitGeo) {
    bunch = new THREE.Mesh(fruitGeo, fruit[0]!.material);
    bunch.castShadow = fruit[0]!.castShadow;
    bunch.receiveShadow = fruit[0]!.receiveShadow;
    for (const f of fruit) {
      scene.remove(f);
      f.geometry.dispose();
      if (f.material !== bunch.material) (f.material as THREE.Material).dispose();
    }
    scene.add(bunch);
  }
  const gone = new Set<THREE.Object3D>([...(wood ? branches : []), ...(bunch ? fruit : [])]);
  const kept = parts.filter((o) => !gone.has(o));
  return bunch ? [...kept, bunch] : kept;
}

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
    const tree = treeOf(compactTree(scene, bare), p.size * T.treeScalePerSize);
    if (tree) made.push(tree);
  });
  // R0072: the north wood's extra trees (bare) and the far orchard's three (fruit kept).
  const outer = [
    ...OUTER_TREES.map((t) => ({ ...t, fruit: false })),
    ...OUTER_PROPS.filter((p) => p.art === 'orchard-tree').map((p) => ({ ...p, fruit: true })),
  ];
  outer.forEach((p, i) => {
    const scale = p.size * T.treeScalePerSize;
    const parts = buildTree(
      scene,
      tex,
      p.x,
      p.z,
      scale,
      T.treeSeedBase + 100 + i,
      groveHeight,
      time,
    );
    const kept = parts.filter((o) => {
      const fruit = o instanceof THREE.Mesh && o.geometry instanceof THREE.SphereGeometry;
      if (fruit && !p.fruit) {
        scene.remove(o);
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
      return p.fruit || !fruit;
    });
    const tree = treeOf(compactTree(scene, kept), scale);
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
  bushRest.length = 0;
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
      bushRest.push({
        m: matrix(p.x, y + r * T.bushSquash * 0.55, p.z, yaw, r, r * T.bushSquash, r),
        x: p.x,
        z: p.z,
        // The collider's radius (MOVE-03), plus the Keeper's half-width.
        r: 0.3 * p.size + 0.2,
      });
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

  // WORLD-67: the hedge round the Grove's edge and a fallen log across each way not open
  // yet. The ~160 hedge bushes are their own low-poly mesh (20 triangles each, no shadow,
  // the bushes' material so no new program): one draw and ~3k triangles from every spot,
  // where 80-triangle shadow-casting bush instances cost ~25k (farOrchard 436k → 461k).
  const hedge: typeof bushes = [];
  borderBlockers().forEach((b, i) => {
    const y = groveHeight(b.x, b.z);
    if (b.kind === 'hedge') {
      const r = BORDER.bushSize * T.bushRadius * (0.9 + hash(i, 7) * 0.25);
      hedge.push({
        m: matrix(b.x, y + r * T.bushSquash * 0.55, b.z, hash(i, 5) * 6.28, r, r * T.bushSquash, r),
        c: tint(T.bushColours[i % T.bushColours.length]!, i + 500),
      });
    } else {
      logs.push({
        m: matrix(
          b.x,
          y + T.logRadius * 1.1,
          b.z,
          b.yaw,
          BORDER.logLen,
          T.logRadius * 1.4,
          T.logRadius * 1.4,
        ),
        c: tint(T.logColour, i + 500),
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
  bushMesh = instanced(blob, bushMat, bushes, 'wild-bushes');
  bushShakes.clear();
  const hedgeMesh = instanced(new THREE.IcosahedronGeometry(1, 0), bushMat, hedge, 'border-hedge');
  if (hedgeMesh) hedgeMesh.castShadow = false;
  for (const m of [
    bushMesh,
    hedgeMesh,
    instanced(cyl, logMat, logs, 'wild-logs'),
    instanced(rockGeo, rockMat, rocks, 'wild-rocks'),
  ])
    if (m) group.add(m);
}

// MOVE-43: the bushes the Keeper rustles. The instanced mesh, each bush's resting matrix
// and spot, and the shakes under way (by instance), filled when the ground is built.
let bushMesh: THREE.InstancedMesh | null = null;
const bushRest: { m: THREE.Matrix4; x: number; z: number; r: number }[] = [];
const bushShakes = new Map<number, number>();
const shakeM = new THREE.Matrix4();

/**
 * Shake a bush the Keeper walks into (once per entry), and run the shakes under way. Read
 * from the Keeper's drawn spot each frame, so it needs no sim event; a few compares when
 * nothing shakes. `calm` (reduced motion) never shakes.
 */
export function rustleWild(x: number, z: number, moving: boolean, nowMs: number, calm: boolean) {
  if (!bushMesh || calm) return;
  if (moving)
    bushRest.forEach((b, k) => {
      const inside = Math.hypot(b.x - x, b.z - z) < b.r;
      if (inside && !bushShakes.has(k)) bushShakes.set(k, nowMs);
    });
  if (!bushShakes.size) return;
  for (const [k, at] of bushShakes) {
    const b = bushRest[k]!;
    const t = (nowMs - at) / BUSH.shakeMs;
    // Stay marked (still) while the Keeper is still inside, so one entry is one shake.
    const inside = Math.hypot(b.x - x, b.z - z) < b.r;
    if (t >= 1) {
      bushMesh.setMatrixAt(k, b.m);
      if (!inside) bushShakes.delete(k);
      continue;
    }
    const off = Math.sin(t * Math.PI * 6) * BUSH.shakeAmp * (1 - t);
    shakeM.copy(b.m);
    shakeM.elements[12]! += off;
    bushMesh.setMatrixAt(k, shakeM);
  }
  bushMesh.instanceMatrix.needsUpdate = true;
}
