import * as THREE from 'three';
import { GROVE, GROVE3D } from '../config/tuning';
import { fbm } from '../render/paint/noise';
import { terrainMaterial, type Tex } from '../samples/aaa-styles';

/**
 * The 3D Grove's ground, built from the same GROVE numbers the pixel ground paints
 * from: the hills are cosine bumps, the pond and the stream are dips, the outer edge
 * rises into a rim, and a faint noise roll keeps the meadow from reading as a plane.
 * `groveHeight` is the one sampler everything stands on; the mesh is built from it.
 */

const RIVER: Array<Array<{ x: number; z: number }>> = [
  [...GROVE.river.inflow],
  [...GROVE.river.outflow],
];

function segmentDistance(
  x: number,
  z: number,
  ax: number,
  az: number,
  bx: number,
  bz: number,
): number {
  const dx = bx - ax;
  const dz = bz - az;
  const len2 = dx * dx + dz * dz || 1;
  const t = THREE.MathUtils.clamp(((x - ax) * dx + (z - az) * dz) / len2, 0, 1);
  return Math.hypot(x - (ax + dx * t), z - (az + dz * t));
}

function polylineDistance(
  x: number,
  z: number,
  line: ReadonlyArray<{ x: number; z: number } | readonly [number, number]>,
): number {
  let best = Infinity;
  for (let i = 0; i + 1 < line.length; i++) {
    const a = line[i]!;
    const b = line[i + 1]!;
    const [ax, az] = Array.isArray(a) ? a : [(a as { x: number }).x, (a as { z: number }).z];
    const [bx, bz] = Array.isArray(b) ? b : [(b as { x: number }).x, (b as { z: number }).z];
    best = Math.min(best, segmentDistance(x, z, ax, az, bx, bz));
  }
  return best;
}

/** Distance to the nearest stream centre line. */
export function riverDistance(x: number, z: number): number {
  return Math.min(...RIVER.map((line) => polylineDistance(x, z, line)));
}

/** Distance to the nearest dirt path centre line. */
export function pathDistance(x: number, z: number): number {
  let best = Infinity;
  for (const line of GROVE3D.paths) best = Math.min(best, polylineDistance(x, z, line));
  return best;
}

/** Ground height before water cuts: hills, rim and roll. */
function landHeight(x: number, z: number): number {
  let y = 0;
  for (const h of GROVE.hills) {
    const d = Math.hypot(x - h.x, z - h.z) / h.r;
    if (d < 1) y += h.h * 0.5 * (1 + Math.cos(d * Math.PI));
  }
  const edge = Math.max(Math.abs(x), Math.abs(z));
  const rim = THREE.MathUtils.smoothstep(edge, GROVE3D.rimStart, GROVE.size / 2 + 6);
  y += rim * rim * GROVE3D.rimHeight * (0.8 + fbm(x / 6, z / 6, 2, 71) * 0.4);
  y += fbm(x / 11, z / 11, 3, 72) * 0.5 - 0.22;
  return y;
}

/** The height of the ground at a point in the Grove; the water lies below it in dips. */
export function groveHeight(x: number, z: number): number {
  let y = landHeight(x, z);
  const pond = GROVE.pond;
  const pd = Math.hypot(x - pond.x, z - pond.z) / (pond.r + 0.6);
  if (pd < 1) y -= GROVE3D.pondDepth * (1 - THREE.MathUtils.smoothstep(pd, 0.55, 1));
  const rd = riverDistance(x, z) / (GROVE.river.width * 0.5 + 0.5);
  if (rd < 1) y -= GROVE3D.riverDepth * (1 - THREE.MathUtils.smoothstep(rd, 0.5, 1));
  return y;
}

/** Height the water surface sits at: the pond and stream share one level. */
export const WATER_LEVEL = -0.32;

/** Walkable ground: never below the water, so creatures wade rather than sink. */
export function standHeight(x: number, z: number): number {
  return Math.max(groveHeight(x, z), WATER_LEVEL + 0.02);
}

export function buildGroveTerrain(
  scene: THREE.Object3D,
  tex: Tex,
  time: { value: number },
): THREE.Mesh {
  const size = GROVE.size + 16;
  const segs = 224;
  const geo = new THREE.PlaneGeometry(size, size, segs, segs);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  const blend = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, groveHeight(x, z));
    uv.setXY(i, x / 3.2, z / 3.2);
  }
  geo.computeVertexNormals();
  const nrm = geo.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const slope = 1 - nrm.getY(i);
    const y = pos.getY(i);
    // Steep faces and the rim go to rock; the stream bed and the paths go to dirt.
    const rock = THREE.MathUtils.smoothstep(slope, 0.2, 0.5) + THREE.MathUtils.smoothstep(y, 5, 10);
    const path = 1 - THREE.MathUtils.smoothstep(pathDistance(x, z), GROVE3D.pathWidth, 1.9);
    const bed = 1 - THREE.MathUtils.smoothstep(riverDistance(x, z), 0.9, 1.9);
    blend[i * 2] = Math.min(1, rock);
    blend[i * 2 + 1] = Math.max(path, bed);
  }
  geo.setAttribute('blend', new THREE.BufferAttribute(blend, 2));
  const mesh = new THREE.Mesh(geo, terrainMaterial(tex, false, time));
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.name = 'terrain';
  scene.add(mesh);
  return mesh;
}
