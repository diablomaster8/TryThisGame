import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { WORLD_LOD } from '../config/tuning-world';
import type { GroveTree } from './crowns';

/**
 * Round 4 phone perf: the Grove's trees, far ones drawn together. Each tree is its own crown,
 * trunk and fruit draw (they need their own fade uniforms, see `crowns.ts`), so a view across
 * the field from a corner spent thirty-odd calls on trees. A tree that cannot stand between
 * the camera and the Keeper never fades, so past `WORLD_LOD.farTrees` it hides and its parts
 * are drawn by three shared batches instead: one instanced crown (its cards' wind and rounded
 * shading read the tree's centre from a per-card attribute instead of a uniform), one trunk
 * mesh and one fruit mesh, both indexed, with the index rewritten to hold only the far trees
 * (the terrain chunks' trick). The batches change only when a tree crosses the band; same
 * textures, same lighting, same shadows, so nothing pops.
 */
interface Entry {
  tree: GroveTree;
  far: boolean;
  /** In the view (always, while near). */
  seen: boolean;
  x: number;
  z: number;
  /** Its crown's cards (the card size folded in), colours and per-card centre and scale. */
  mats: Float32Array;
  cols: Float32Array | null;
  canopy: Float32Array;
  n: number;
  /** Its spans in the trunk and fruit batches' full indices, and the fruit mesh it stands for. */
  wood: [number, number] | null;
  fruit: [number, number] | null;
  fruitMesh: THREE.Mesh | null;
}

const frustum = new THREE.Frustum();
const projView = new THREE.Matrix4();
const sphere = new THREE.Sphere();

/** The kit's leaf card is 1.5 units at scale 1 (`aaa-kit.ts`, `buildTree`). */
const CARD = 1.5;

/** The crown's wind and rounded shading, from `canopyShading` with the centre per card. */
function farCanopy(mat: THREE.MeshStandardMaterial, time: { value: number }): void {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = time;
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nuniform float uTime;\nattribute vec4 aCanopy;\nvarying vec3 vCanopyN;',
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vec3 cp = instanceMatrix[ 3 ].xyz;
         vec3 out3 = cp - aCanopy.xyz;
         float outer = clamp( length( out3 ) / ( 2.6 * aCanopy.w ), 0.0, 1.0 );
         float ph = uTime * 1.4 + cp.x * 0.6 + cp.y * 0.9 + cp.z * 0.4;
         transformed += vec3( sin( ph ), sin( ph * 1.7 ) * 0.5, cos( ph * 1.3 ) ) * 0.05 * ( 0.4 + outer );
         vCanopyN = normalize( normalMatrix * ( out3 + vec3( 0.0, 0.9 * aCanopy.w, 0.0 ) ) );`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vCanopyN;')
      .replace(
        '#include <normal_fragment_begin>',
        `#include <normal_fragment_begin>
         normal = normalize( mix( normal, vCanopyN, 0.8 ) );`,
      );
    mat.userData.shader = shader;
  };
  mat.customProgramCacheKey = () => 'canopy-far';
}

/** One indexed batch of world-space meshes, drawn with only the spans asked for. */
class SpanBatch {
  readonly mesh: THREE.Mesh;
  private readonly full: Uint32Array;

  constructor(geo: THREE.BufferGeometry, mat: THREE.Material, like: THREE.Mesh) {
    this.full = Uint32Array.from(geo.index!.array);
    geo.setIndex(new THREE.BufferAttribute(new Uint32Array(this.full.length), 1));
    geo.setDrawRange(0, 0);
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.castShadow = like.castShadow;
    this.mesh.receiveShadow = like.receiveShadow;
    this.mesh.name = 'far-trees';
  }

  show(spans: [number, number][]): void {
    const index = this.mesh.geometry.index!;
    const out = index.array as Uint32Array;
    let n = 0;
    for (const [from, count] of spans) {
      out.set(this.full.subarray(from, from + count), n);
      n += count;
    }
    index.clearUpdateRanges();
    index.addUpdateRange(0, n);
    index.needsUpdate = true;
    this.mesh.geometry.setDrawRange(0, n);
    this.mesh.visible = n > 0;
  }
}

/** Merge meshes into world space (their parent's) and note each one's span of the index. */
function merge(meshes: THREE.Mesh[]): {
  geo: THREE.BufferGeometry;
  spans: [number, number][];
} | null {
  const geos = meshes.map((m) => {
    m.updateMatrix();
    const g = m.geometry.clone().applyMatrix4(m.matrix);
    return g.index ? g : g.setIndex([...Array(g.attributes.position!.count).keys()]);
  });
  const spans: [number, number][] = [];
  let at = 0;
  for (const g of geos) {
    spans.push([at, g.index!.count]);
    at += g.index!.count;
  }
  const geo = mergeGeometries(geos);
  for (const g of geos) g.dispose();
  return geo ? { geo, spans } : null;
}

export class FarTrees {
  private readonly entries: Entry[] = [];
  private readonly crown: THREE.InstancedMesh | null = null;
  private readonly wood: SpanBatch | null = null;
  private readonly fruit: SpanBatch | null = null;
  /** Every tree's leaf cards, drawn only in the shadow pass (see `ShadowMerge.addShadowOnly`). */
  readonly shadowCrown: THREE.InstancedMesh | null = null;
  private key = '';
  /** Trees in the far batch after the last update (the debug readout and the probe). */
  far = 0;

  /** Each tree's trunk and fruit, which hide while the batch draws them. */
  get lodMeshes(): THREE.Mesh[] {
    return this.entries.flatMap((e) => [
      ...(e.tree.trunk ? [e.tree.trunk.mesh] : []),
      ...(e.fruitMesh ? [e.fruitMesh] : []),
    ]);
  }

  /**
   * The trunk and fruit batches, and every crown with the far crown batch: while
   * `ShadowMerge` is on, their shadows come from it and `shadowCrown` instead.
   */
  get standIns(): THREE.Mesh[] {
    return [
      this.wood?.mesh,
      this.fruit?.mesh,
      ...(this.shadowCrown ? [this.crown, ...this.entries.map((e) => e.tree.crown)] : []),
    ].filter((m): m is THREE.Mesh => !!m);
  }

  constructor(parent: THREE.Object3D, trees: GroveTree[], time: { value: number }) {
    const m = new THREE.Matrix4();
    const s = new THREE.Matrix4();
    let cards = 0;
    for (const tree of trees) {
      const c = tree.crown as THREE.InstancedMesh;
      if (!c.isInstancedMesh || c.parent !== parent) continue;
      const scale = ((c.geometry as THREE.PlaneGeometry).parameters?.width ?? CARD) / CARD;
      s.makeScale(scale, scale, scale);
      const mats = new Float32Array(c.count * 16);
      for (let i = 0; i < c.count; i++) {
        c.getMatrixAt(i, m);
        m.multiply(s).toArray(mats, i * 16);
      }
      // The kit's canopy centre: the trunk stands at y0 + 1.5 s and the crown at y0 + 4.6 s.
      const k = tree.trunk?.mesh.position;
      const cx = k ? [k.x, k.y + 3.1 * scale, k.z] : [tree.centre.x, tree.centre.y, tree.centre.z];
      const canopy = new Float32Array(c.count * 4);
      for (let i = 0; i < c.count; i++) canopy.set([...cx, scale], i * 4);
      // Fruit: one mesh of the inner parts at most (the compacted bunch); anything else
      // keeps the tree out of the batch.
      const inner = tree.inner.filter((o): o is THREE.Mesh => (o as THREE.Mesh).isMesh);
      if (inner.length !== tree.inner.length || inner.length > 1) continue;
      this.entries.push({
        tree,
        far: false,
        seen: true,
        x: tree.centre.x,
        z: tree.centre.z,
        mats,
        cols: c.instanceColor ? Float32Array.from(c.instanceColor.array) : null,
        canopy,
        n: c.count,
        wood: null,
        fruit: null,
        fruitMesh: inner[0] ?? null,
      });
      cards += c.count;
    }
    const first = this.entries[0];
    if (!first) return;
    const leafMat = first.tree.crown.material as THREE.MeshStandardMaterial;
    const mat = new THREE.MeshStandardMaterial({
      map: leafMat.map,
      alphaTest: leafMat.alphaTest,
      side: THREE.DoubleSide,
      roughness: leafMat.roughness,
    });
    farCanopy(mat, time);
    const geo = new THREE.PlaneGeometry(CARD, CARD);
    geo.setAttribute(
      'aCanopy',
      new THREE.InstancedBufferAttribute(new Float32Array(cards * 4), 4).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );
    const crown = new THREE.InstancedMesh(geo, mat, cards);
    crown.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    if (first.cols) crown.setColorAt(0, new THREE.Color());
    crown.count = 0;
    crown.visible = false;
    crown.name = 'far-trees';
    crown.castShadow = first.tree.crown.castShadow;
    crown.receiveShadow = first.tree.crown.receiveShadow;
    if (first.tree.crown.customDepthMaterial)
      crown.customDepthMaterial = first.tree.crown.customDepthMaterial;
    parent.add(crown);
    this.crown = crown;
    // Lane D r8: one shadow draw for all crowns, near or far (the crowns' depth program is a
    // plain alpha-cut leaf, the same for every tree, so the shadow is the same).
    if (crown.customDepthMaterial) {
      const all = new THREE.InstancedMesh(new THREE.PlaneGeometry(CARD, CARD), mat, cards);
      let k = 0;
      for (const e of this.entries) {
        (all.instanceMatrix.array as Float32Array).set(e.mats, k * 16);
        k += e.n;
      }
      all.count = k;
      all.name = 'tree-shadows';
      all.castShadow = true;
      all.customDepthMaterial = crown.customDepthMaterial;
      all.visible = false;
      all.computeBoundingSphere();
      parent.add(all);
      this.shadowCrown = all;
    }

    const trunks = this.entries.filter((e) => e.tree.trunk);
    const wood = merge(trunks.map((e) => e.tree.trunk!.mesh));
    if (wood) {
      trunks.forEach((e, i) => (e.wood = wood.spans[i]!));
      const like = trunks[0]!.tree.trunk!.mesh;
      // A clone drops the per-tree dither patch: a far trunk never thins.
      this.wood = new SpanBatch(wood.geo, (like.material as THREE.Material).clone(), like);
      parent.add(this.wood.mesh);
    }
    const bunches = this.entries.filter((e) => e.fruitMesh);
    const fruit = merge(bunches.map((e) => e.fruitMesh!));
    if (fruit) {
      bunches.forEach((e, i) => (e.fruit = fruit.spans[i]!));
      const like = bunches[0]!.fruitMesh!;
      this.fruit = new SpanBatch(fruit.geo, (like.material as THREE.Material).clone(), like);
      parent.add(this.fruit.mesh);
    }
  }

  /**
   * Move trees in and out of the batch. `view` is the camera; `targets` are what
   * the crowns keep clear of (`CrownFade.update`'s), so a batched tree can never be in the way.
   * Call after `CrownFade.update`, which shows each tree's inner parts again.
   */
  update(view: THREE.Camera, targets: THREE.Vector3[]): void {
    if (!this.crown) return;
    const camera = view.position;
    projView.multiplyMatrices(view.projectionMatrix, view.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projView);
    const t = WORLD_LOD.farTrees;
    let reach = 0;
    for (const p of targets) reach = Math.max(reach, camera.distanceTo(p));
    let key = '';
    for (const e of this.entries) {
      const d = Math.hypot(e.x - camera.x, e.z - camera.z);
      const need = Math.max(t.farFrom, reach + e.tree.rx + t.farMargin);
      // The band only ever adds distance, so a batched tree is never inside `need`.
      e.far = e.far ? d > need : d > need + t.farBand;
      // A far tree out of view (grown by the shadow it may throw in) is not drawn at all.
      sphere.center.set(e.x, e.tree.centre.y, e.z);
      sphere.radius = Math.max(e.tree.rx, e.tree.ry) + WORLD_LOD.terrainMargin;
      e.seen = !e.far || frustum.intersectsSphere(sphere);
      key += e.far ? (e.seen ? '1' : '2') : '0';
      if (e.far && e.fruitMesh) e.fruitMesh.visible = false;
    }
    if (key === this.key) return;
    this.key = key;
    this.rebuild();
  }

  private rebuild(): void {
    const crown = this.crown!;
    const mats = crown.instanceMatrix.array as Float32Array;
    const canopy = crown.geometry.getAttribute('aCanopy') as THREE.InstancedBufferAttribute;
    const cols = crown.instanceColor;
    let n = 0;
    const wood: [number, number][] = [];
    const fruit: [number, number][] = [];
    this.far = 0;
    for (const e of this.entries) {
      e.tree.crown.visible = !e.far;
      if (e.tree.trunk) e.tree.trunk.mesh.visible = !e.far;
      if (e.fruitMesh && !e.far) e.fruitMesh.visible = true;
      if (!e.far) continue;
      this.far++;
      if (!e.seen) continue;
      mats.set(e.mats, n * 16);
      (canopy.array as Float32Array).set(e.canopy, n * 4);
      if (cols && e.cols) (cols.array as Float32Array).set(e.cols, n * 3);
      n += e.n;
      if (e.wood) wood.push(e.wood);
      if (e.fruit) fruit.push(e.fruit);
    }
    crown.count = n;
    crown.visible = n > 0;
    crown.instanceMatrix.needsUpdate = true;
    canopy.needsUpdate = true;
    if (cols) cols.needsUpdate = true;
    crown.computeBoundingSphere();
    this.wood?.show(wood);
    this.fruit?.show(fruit);
  }
}
