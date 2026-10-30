import * as THREE from 'three';
import { WORLD_LOD } from '../config/tuning-world';

/**
 * Round 6 phone perf: the Grove's four lantern posts, far ones drawn together. Each lantern has
 * its own timber, roof, stone and glass draws (its own materials, so one standing in front of
 * the Keeper can thin out alone, `crowns.ts`), sixteen calls for under two thousand triangles.
 * A lantern that cannot stand between the camera and the Keeper never fades, so past the
 * far-tree band (`WORLD_LOD.farTrees`) its parts hide and one instanced mesh per material draws
 * every far lantern: four calls however many there are. All four lanterns are built from the
 * same parts at their foot, so one lantern's geometry, moved to the origin, serves them all.
 * A lantern whose glass glows differently from the rest (a story-lit one by day) stays near.
 */
export interface FarLantern {
  foot: THREE.Vector3;
  /** Its near draws, in the batch's order: timber, roof, stone, glass. */
  parts: THREE.Mesh[];
  glass: THREE.MeshStandardMaterial;
}

const frustum = new THREE.Frustum();
const projView = new THREE.Matrix4();
const sphere = new THREE.Sphere();
const m4 = new THREE.Matrix4();
/** A lantern's reach from its foot: the post is 2.7 tall. */
const REACH = 1.6;

export class FarLanterns {
  private readonly batch: THREE.InstancedMesh[] = [];
  private readonly far: boolean[];
  private key = '';
  /** How many lanterns the batch drew at the last rebuild (the debug line and tests). */
  drawn = 0;

  constructor(
    group: THREE.Object3D,
    private readonly lanterns: FarLantern[],
    materials: THREE.Material[],
    private readonly glass: THREE.MeshStandardMaterial,
  ) {
    this.far = lanterns.map(() => false);
    const first = lanterns[0];
    if (!first) return;
    first.parts.forEach((part, i) => {
      // The part's world geometry less the first lantern's foot (the glass box carries its own
      // offset as a mesh position).
      const geo = part.geometry.clone();
      geo.applyMatrix4(m4.makeTranslation(part.position.x, part.position.y, part.position.z));
      geo.translate(-first.foot.x, -first.foot.y, -first.foot.z);
      const mesh = new THREE.InstancedMesh(geo, materials[i]!, lanterns.length);
      mesh.name = 'far-lanterns';
      mesh.castShadow = part.castShadow;
      mesh.receiveShadow = part.receiveShadow;
      mesh.count = 0;
      mesh.visible = false;
      group.add(mesh);
      this.batch.push(mesh);
    });
  }

  update(view: THREE.Camera, targets: THREE.Vector3[], lampsOn: boolean): void {
    if (!this.batch.length) return;
    const camera = view.position;
    projView.multiplyMatrices(view.projectionMatrix, view.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projView);
    const t = WORLD_LOD.farTrees;
    let reach = 0;
    for (const p of targets) reach = Math.max(reach, camera.distanceTo(p));
    this.glass.emissiveIntensity = lampsOn ? 2.2 : 0;
    let key = lampsOn ? 'L' : 'D';
    this.lanterns.forEach((l, i) => {
      const d = Math.hypot(l.foot.x - camera.x, l.foot.z - camera.z);
      const need = Math.max(t.farFrom, reach + REACH + t.farMargin);
      const same = l.glass.emissiveIntensity > 0 === lampsOn;
      this.far[i] = same && (this.far[i] ? d > need : d > need + t.farBand);
      sphere.center.set(l.foot.x, l.foot.y + 1.35, l.foot.z);
      sphere.radius = REACH + WORLD_LOD.terrainMargin;
      key += this.far[i] ? (frustum.intersectsSphere(sphere) ? '1' : '2') : '0';
    });
    if (key === this.key) return;
    this.key = key;
    let n = 0;
    this.lanterns.forEach((l, i) => {
      for (const p of l.parts) p.visible = !this.far[i];
      if (!this.far[i] || key[i + 1] !== '1') return;
      m4.makeTranslation(l.foot.x, l.foot.y, l.foot.z);
      for (const b of this.batch) b.setMatrixAt(n, m4);
      n++;
    });
    this.drawn = n;
    for (const b of this.batch) {
      b.count = n;
      b.visible = n > 0;
      b.instanceMatrix.needsUpdate = true;
      b.computeBoundingSphere();
    }
  }
}
