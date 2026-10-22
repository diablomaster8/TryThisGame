import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GROVE } from '../config/tuning';
import { markAt } from '../config/stage-marks';
import { CG_C } from '../config/tuning-c';
import { bevelBox } from './building-kit';
import { elderMemorialFlower } from './memorial';
import { groveHeight } from './terrain';

/**
 * The memorial hill and the ledge behind the falls in 3D (campaign graphics H7, H5), shown
 * in Hazel's Grove: a worn path winding up hill 0, the flat stone halfway up, a wind-bent
 * hawthorn on the crest and Briar's flower in its ring of stones; and a rock shelf behind
 * the waterfall with a flat stone on it, which glows blue on the Long Night (`stoneGlow`).
 * The path is one ribbon, the stones, tree and shelf a handful of meshes.
 */
const HILL = GROVE.hills[0];

export interface HillDress {
  group: THREE.Group;
}

/** A soft-edged ribbon lying on the ground along `pts`. */
function pathRibbon(pts: THREE.Vector3[], width: number): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
  const n = 70;
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const dirt = new THREE.Color('#a48a66');
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const p = curve.getPoint(t);
    const d = curve.getTangent(t);
    const nx = -d.z;
    const nz = d.x;
    const len = Math.hypot(nx, nz) || 1;
    // Narrower at the foot and the top, where the path fades into the grass.
    const w = (width / 2) * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.15)));
    for (const s of [-1, -0.4, 0.4, 1]) {
      const x = p.x + (nx / len) * w * s;
      const z = p.z + (nz / len) * w * s;
      pos.push(x, groveHeight(x, z) + 0.05, z);
      const edge = Math.abs(s) > 0.9;
      const fade = Math.min(1, t * 8, (1 - t) * 8);
      col.push(dirt.r, dirt.g, dirt.b, (edge ? 0 : 0.85) * fade);
    }
    if (i < n) {
      const o = i * 4;
      for (let k = 0; k < 3; k++)
        idx.push(o + k, o + k + 4, o + k + 1, o + k + 1, o + k + 4, o + k + 5);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 4));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const m = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      transparent: true,
      roughness: 1,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    }),
  );
  m.receiveShadow = true;
  m.renderOrder = 1;
  return m;
}

/**
 * Small stones along both edges of the path: the grass grows over a flat ribbon, and these
 * keep the way readable above it. One instanced mesh.
 */
function pathStones(pts: THREE.Vector3[], width: number): THREE.InstancedMesh {
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
  const n = 26;
  const mesh = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.MeshStandardMaterial({ color: '#b4b2a8', roughness: 0.95, flatShading: true }),
    n * 2,
  );
  const m4 = new THREE.Matrix4();
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < n; i++) {
    const t = 0.03 + (i / (n - 1)) * 0.94;
    const p = curve.getPoint(t);
    const d = curve.getTangent(t);
    for (const side of [-1, 1]) {
      const k = i * 2 + (side < 0 ? 0 : 1);
      const off = (width / 2) * 0.9 * side + Math.sin(k * 12.9) * 0.08;
      const x = p.x - d.z * off;
      const z = p.z + d.x * off;
      const s = 0.12 + Math.abs(Math.sin(k * 7.3)) * 0.07;
      mesh.setMatrixAt(
        k,
        m4.compose(
          new THREE.Vector3(x, groveHeight(x, z) + s * 0.4, z),
          new THREE.Quaternion().setFromAxisAngle(up, k),
          new THREE.Vector3(s * 1.4, s * 1.1, s),
        ),
      );
    }
  }
  mesh.castShadow = mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  return mesh;
}

/** A hawthorn bent by the wind: a leaning trunk and a crown swept to leeward (+x). */
function hawthorn(): THREE.Group {
  const g = new THREE.Group();
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.12, 0.8, 0),
    new THREE.Vector3(0.5, 1.5, 0.05),
    new THREE.Vector3(1.1, 2.05, 0),
  ]);
  const trunk = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 10, 0.16, 6),
    new THREE.MeshStandardMaterial({ color: '#5a4636', roughness: 1 }),
  );
  trunk.castShadow = true;
  const lobes: THREE.BufferGeometry[] = [];
  for (const [x, y, z, s] of [
    [1.3, 2.35, 0, 0.8],
    [2.0, 2.25, 0.3, 0.62],
    [0.7, 2.55, -0.3, 0.6],
    [1.6, 2.7, -0.25, 0.5],
    [2.45, 2.1, -0.1, 0.4],
  ] as const) {
    const ic = new THREE.IcosahedronGeometry(s, 1);
    ic.scale(1.25, 0.8, 1);
    ic.translate(x, y, z);
    lobes.push(ic);
  }
  const crown = new THREE.Mesh(
    mergeGeometries(lobes)!,
    new THREE.MeshStandardMaterial({ color: '#4f6a45', roughness: 0.95, flatShading: true }),
  );
  crown.castShadow = true;
  g.add(trunk, crown);
  return g;
}

const stoneMat = (): THREE.MeshStandardMaterial =>
  new THREE.MeshStandardMaterial({ color: '#a7a9b6', roughness: 0.95, flatShading: true });

export function buildHillDress(): HillDress {
  const group = new THREE.Group();
  const pts = CG_C.hill.path.map(([dx, dz]) => new THREE.Vector3(HILL.x + dx, 0, HILL.z + dz));
  group.add(pathRibbon(pts, CG_C.hill.pathWidth), pathStones(pts, CG_C.hill.pathWidth));
  const fs = markAt('grove', 'flat-stone');
  if (fs) {
    const stone = new THREE.Mesh(bevelBox(1.5, 0.2, 1.0, 0.05), stoneMat());
    stone.position.set(fs.x, groveHeight(fs.x, fs.z) + 0.06, fs.z);
    stone.rotation.y = fs.yaw + 0.3;
    stone.castShadow = stone.receiveShadow = true;
    group.add(stone);
  }
  const tree = hawthorn();
  const tx = HILL.x + CG_C.hill.crest.dx;
  const tz = HILL.z + CG_C.hill.crest.dz;
  tree.position.set(tx, groveHeight(tx, tz) - 0.05, tz);
  group.add(tree);
  const briar = markAt('grove', 'briar');
  if (briar) {
    const b = CG_C.hill.briar;
    const flower = elderMemorialFlower(b.scale, b.ring, b.ringR);
    flower.position.set(briar.x, groveHeight(briar.x, briar.z), briar.z);
    group.add(flower);
  }
  return { group };
}

export interface Ledge {
  group: THREE.Group;
  /** Where the blue stone lies, for its glow card. */
  stoneAt: THREE.Vector3;
  inlay: THREE.MeshStandardMaterial;
}

/** The rock shelf behind the falls' foot, and the flat stone that glows blue on it. */
export function buildLedge(): Ledge {
  const wf = GROVE.waterfall;
  const first = GROVE.river.inflow[0]!;
  const dx = first.x - wf.x;
  const dz = first.z - wf.z;
  const len = Math.hypot(dx, dz);
  const t = CG_C.ledge.along;
  // Along the sheet, then back toward the hill, behind the water.
  const bx = wf.x + dx * t - (dx / len) * CG_C.ledge.behind;
  const bz = wf.z + dz * t - (dz / len) * CG_C.ledge.behind;
  const y = groveHeight(bx, bz);
  const yaw = Math.atan2(dx, dz);
  const group = new THREE.Group();
  group.position.set(bx, y, bz);
  group.rotation.y = yaw;
  const rock = new THREE.MeshStandardMaterial({
    color: '#7f8190',
    roughness: 1,
    flatShading: true,
  });
  const shelf = new THREE.Mesh(bevelBox(CG_C.ledge.width, 0.5, 1.7, 0.1), rock);
  shelf.position.y = 0.1;
  const lip = new THREE.Mesh(bevelBox(CG_C.ledge.width * 0.7, 0.2, 0.5, 0.06), rock);
  lip.position.set(0.2, 0.42, 0.55);
  shelf.castShadow = shelf.receiveShadow = true;
  const stone = new THREE.Mesh(bevelBox(0.95, 0.14, 0.65, 0.04), stoneMat());
  stone.position.set(-0.3, 0.42, -0.1);
  stone.castShadow = true;
  const inlay = new THREE.MeshStandardMaterial({
    color: '#26364f',
    emissive: CG_C.fx.stone,
    emissiveIntensity: 0,
    roughness: 0.4,
  });
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.03, 0.42), inlay);
  plate.position.set(-0.3, 0.5, -0.1);
  group.add(shelf, lip, stone, plate);
  const stoneAt = new THREE.Vector3();
  group.updateMatrixWorld(true);
  stoneAt.set(-0.3, 0.6, -0.1).applyMatrix4(group.matrixWorld);
  return { group, stoneAt, inlay };
}
