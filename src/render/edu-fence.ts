import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { LITTLE_GROVE } from '../config/tuning-world';

/**
 * R0099: the Learning Grove's low picket fence round its play area (`sim/little-grove.ts`),
 * one merged mesh in whichever scene is drawing: white pickets with pointed tops on two
 * rails, standing on the ground the scene gives (flat in Pixel, the terraced field in 3D).
 */
export function buildEduFence(ground: (x: number, z: number) => number): THREE.Mesh {
  const b = LITTLE_GROVE;
  const parts: THREE.BufferGeometry[] = [];
  const paint = (g: THREE.BufferGeometry, hex: string): THREE.BufferGeometry => {
    const c = new THREE.Color(hex);
    const n = g.attributes.position!.count;
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) col.set([c.r, c.g, c.b], i * 3);
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.deleteAttribute('uv');
    return g;
  };
  const side = (x0: number, z0: number, x1: number, z1: number): void => {
    const len = Math.hypot(x1 - x0, z1 - z0);
    const n = Math.max(1, Math.round(len / b.picket));
    const yaw = Math.atan2(-(z1 - z0), x1 - x0);
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      const z = z0 + ((z1 - z0) * i) / n;
      const y = ground(x, z);
      const post = new THREE.BoxGeometry(0.1, 0.55, 0.06).translate(0, 0.275, 0);
      const tip = new THREE.ConeGeometry(0.07, 0.12, 4).rotateY(Math.PI / 4).translate(0, 0.61, 0);
      for (const g of [post, tip]) {
        g.rotateY(yaw).translate(x, y, z);
        parts.push(paint(g.index ? g.toNonIndexed() : g, i % 2 ? '#f4efe2' : '#e8e0cc'));
      }
      if (i < n) {
        const xn = x0 + ((x1 - x0) * (i + 1)) / n;
        const zn = z0 + ((z1 - z0) * (i + 1)) / n;
        const seg = Math.hypot(xn - x, zn - z);
        const ym = (y + ground(xn, zn)) / 2;
        for (const h of [0.18, 0.42]) {
          const rail = new THREE.BoxGeometry(seg, 0.05, 0.04)
            .rotateY(yaw)
            .translate((x + xn) / 2, ym + h, (z + zn) / 2);
          parts.push(paint(rail.toNonIndexed(), '#d8cfba'));
        }
      }
    }
  };
  side(b.minX, b.minZ, b.maxX, b.minZ);
  side(b.maxX, b.minZ, b.maxX, b.maxZ);
  side(b.maxX, b.maxZ, b.minX, b.maxZ);
  side(b.minX, b.maxZ, b.minX, b.minZ);
  const geo = mergeGeometries(parts)!;
  for (const g of parts) g.dispose();
  const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true }));
  mesh.name = 'edu-fence';
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
