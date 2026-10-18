import * as THREE from 'three';
import { GROVE } from '../config/tuning';
import { surface } from '../samples/aaa-kit';
import { WATER_LEVEL, groveHeight } from './terrain';

/**
 * The pond, the stream and the waterfall as physical water: refraction through a
 * scrolling normal map, the same recipe as the AAA stage's pond. The stream is a
 * ribbon laid along GROVE's two polylines; the waterfall is a sheet down the hill face
 * with its own faster scroll.
 */
export interface GroveWater {
  materials: THREE.MeshPhysicalMaterial[];
  fall: THREE.MeshPhysicalMaterial;
  update(t: number): void;
}

/** The scrolling normal map every Grove water shares (the minigames' water uses it too). */
export function waterNormal(): THREE.DataTexture {
  const normal = surface('cobble', 128, 1.2).normal;
  normal.wrapS = THREE.RepeatWrapping;
  normal.wrapT = THREE.RepeatWrapping;
  return normal;
}

export function waterMaterial(
  normal: THREE.DataTexture,
  scale: number,
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: '#3f8fd0',
    roughness: 0.06,
    metalness: 0,
    // No transmission: it costs a full second draw of the scene into a refraction target
    // every frame, which a phone cannot pay (review C, item 6). Plain alpha reads as water.
    normalMap: normal,
    normalScale: new THREE.Vector2(scale, scale),
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
  });
}

/** A flat ribbon of the given width along a polyline, at the water level. */
function ribbon(
  line: ReadonlyArray<{ x: number; z: number }>,
  width: number,
): THREE.BufferGeometry {
  const pts = line.map((p) => new THREE.Vector3(p.x, WATER_LEVEL, p.z));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
  const n = pts.length * 6;
  const verts: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const p = curve.getPoint(t);
    const d = curve.getTangent(t);
    const nx = -d.z;
    const nz = d.x;
    const half = width * 0.5 + 0.35;
    verts.push(p.x + nx * half, WATER_LEVEL, p.z + nz * half);
    verts.push(p.x - nx * half, WATER_LEVEL, p.z - nz * half);
    uvs.push(0, t * n * 0.4, 1, t * n * 0.4);
    if (i < n) {
      const b = i * 2;
      idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

export function buildGroveWater(scene: THREE.Object3D): GroveWater {
  const normal = waterNormal();
  const materials: THREE.MeshPhysicalMaterial[] = [];

  const pondMat = waterMaterial(normal, 0.18);
  const pond = new THREE.Mesh(new THREE.CircleGeometry(GROVE.pond.r + 0.5, 48), pondMat);
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(GROVE.pond.x, WATER_LEVEL, GROVE.pond.z);
  pond.receiveShadow = true;
  scene.add(pond);
  materials.push(pondMat);

  const streamMat = waterMaterial(normal, 0.22);
  for (const line of [GROVE.river.inflow, GROVE.river.outflow]) {
    const mesh = new THREE.Mesh(ribbon(line, GROVE.river.width), streamMat);
    mesh.receiveShadow = true;
    scene.add(mesh);
  }
  materials.push(streamMat);

  // The waterfall: a sheet from the hill top down to the inflow's first pool.
  const wf = GROVE.waterfall;
  const top = groveHeight(wf.x, wf.z) - 0.2;
  const first = GROVE.river.inflow[0]!;
  const fallMat = waterMaterial(normal, 0.5);
  fallMat.color.set('#bfe4ff');
  fallMat.opacity = 0.8;
  const dx = first.x - wf.x;
  const dz = first.z - wf.z;
  const len = Math.hypot(dx, dz);
  const drop = top - WATER_LEVEL;
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(wf.width, Math.hypot(len, drop)), fallMat);
  sheet.position.set((wf.x + first.x) / 2, (top + WATER_LEVEL) / 2, (wf.z + first.z) / 2);
  sheet.lookAt(sheet.position.x + dz, sheet.position.y, sheet.position.z - dx);
  sheet.rotateX(Math.atan2(drop, len) - Math.PI / 2);
  scene.add(sheet);
  // Foam where it lands.
  const foam = new THREE.Mesh(
    new THREE.CircleGeometry(1.4, 24),
    new THREE.MeshStandardMaterial({ color: '#eaf6ff', transparent: true, opacity: 0.6 }),
  );
  foam.rotation.x = -Math.PI / 2;
  foam.position.set(first.x, WATER_LEVEL + 0.03, first.z);
  scene.add(foam);

  return {
    materials,
    fall: fallMat,
    update(t) {
      pondMat.normalMap!.offset.set(t * 0.015, t * 0.02);
      streamMat.normalScale.set(0.22, 0.22);
      fallMat.normalScale.set(0.5, 0.5);
      // One shared map, so the pond's offset moves the stream too; the sheet keeps its
      // own faster fall by offsetting its uv through the material's map transform.
      fallMat.normalMap!.offset.set(t * 0.015, t * 0.02);
      sheet.material = fallMat;
      (sheet.geometry.attributes.uv as THREE.BufferAttribute).needsUpdate = false;
    },
  };
}
