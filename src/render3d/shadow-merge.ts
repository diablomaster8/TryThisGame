/**
 * Phone headroom for the sun's shadow pass. Every caster is a draw call in the shadow map, and
 * most of the Grove's casters are small, still pieces of scenery: doors, shutters, planks,
 * garden beds, gate parts. Here those are folded into a few shadow-only meshes (by side and
 * depth program, each drawing only its members inside the shadow box) that are visible only
 * while the renderer draws its shadow maps, and stop casting one by one. (Three tests shadow
 * casters against the view camera's layers, so a shadow-only layer cannot do it; the view's
 * draw list is built before the shadow pass runs, so it never sees them.)
 *
 * Only what holds still is folded in: a mesh is merged after it has kept its place and
 * visibility for a whole sweep; one that moves later is tried again, and after
 * `SHADOW_MERGE.moves` moves (or once it hides or leaves) it casts its own shadow for good.
 * Building-kit pieces keep their hide-aware depth program (the merged mesh uses the same one,
 * which works in world space). Alpha-cut, transparent and other custom-depth meshes keep their
 * own shadow, and big meshes (terrain, far trees) are one call already. Rebuilds are
 * rate-limited.
 */
import * as THREE from 'three';
import { SHADOW_MERGE } from '../config/tuning';
import { hideDepthMaterial, isOccludable } from './building-kit';

interface Member {
  readonly mesh: THREE.Mesh;
  readonly matrix: THREE.Matrix4;
  readonly stamp: string;
  readonly double: boolean;
  /** Building-kit piece: drawn with the hide-aware depth program. */
  readonly hide: boolean;
}

/** Whether a mesh may be folded in, from what it is (not yet whether it holds still). */
export function mergeable(o: THREE.Object3D, maxTris: number): o is THREE.Mesh {
  if (!(o instanceof THREE.Mesh) || o instanceof THREE.InstancedMesh) return false;
  if ((o as THREE.SkinnedMesh).isSkinnedMesh || !o.castShadow) return false;
  if (o.customDepthMaterial && o.customDepthMaterial !== hideDepthMaterial()) return false;
  const geo = o.geometry as THREE.BufferGeometry;
  const pos = geo.getAttribute('position');
  if (!pos || pos.itemSize !== 3 || geo.morphAttributes.position) return false;
  // Vertices too: the terrain draws a slice of its index that changes with the view.
  const tris = Math.max(geo.index ? geo.index.count : 0, pos.count) / 3;
  if (tris > maxTris) return false;
  const mats = Array.isArray(o.material) ? o.material : [o.material];
  return mats.every(
    (m) =>
      m.visible &&
      !m.transparent &&
      !(m.alphaTest > 0) &&
      !(m as THREE.MeshStandardMaterial).alphaMap &&
      m.side === mats[0]!.side,
  );
}

/** What the geometry is right now; a change counts as a move (a refilled or re-sliced mesh). */
function stamp(mesh: THREE.Mesh): string {
  const g = mesh.geometry as THREE.BufferGeometry;
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  const i = g.index;
  return `${g.id}:${pos.version}:${i ? `${i.version}:${i.count}` : '-'}:${g.drawRange.start}:${g.drawRange.count}`;
}

/**
 * Whether `o` and every ancestor up to (not including) `root` is visible and attached. A LOD
 * mesh's own visibility does not count: it hides while a batch draws it, and keeps its shadow.
 */
function shownUnder(o: THREE.Object3D, root: THREE.Object3D, lod: WeakSet<object>): boolean {
  let p: THREE.Object3D | null = o;
  while (p && p !== root) {
    if (!p.visible && !(p === o && lod.has(o))) return false;
    p = p.parent;
  }
  return p === root;
}

/** One merged mesh, and where each member's triangles sit in its full index. */
interface Proxy {
  readonly mesh: THREE.Mesh;
  readonly full: Uint16Array | Uint32Array;
  readonly spans: { start: number; count: number; sphere: THREE.Sphere }[];
  /** Which members the last shadow pass drew ('' before the first). */
  key: string;
}

const frustum = new THREE.Frustum();
const projView = new THREE.Matrix4();

export class ShadowMerge {
  private readonly members = new Map<THREE.Mesh, Member>();
  /** Seen once, merged if it is unchanged at the next sweep. */
  private readonly pending = new Map<THREE.Mesh, { matrix: THREE.Matrix4; stamp: string }>();
  /** Moved or hid after merging (or while pending): casts its own shadow from now on. */
  private readonly dynamic = new WeakSet<THREE.Mesh>();
  /** How often each mesh has moved since it was first seen. */
  private readonly moved = new WeakMap<THREE.Mesh, number>();
  private readonly proxies: Proxy[] = [];
  /** Meshes that hide for a level of detail, not for good (see `shownUnder`). */
  private readonly lod = new WeakSet<object>();
  /** Batches that draw those meshes when they hide: they cast no shadow while merging is on. */
  private readonly standIns: THREE.Mesh[] = [];
  /** Meshes drawn only in the shadow pass while merging is on (all trees' crowns). */
  private readonly shadowOnly: THREE.Object3D[] = [];
  private readonly invRoot = new THREE.Matrix4();
  private nextSweep = 0;
  private lastBuild = -Infinity;
  private dirty = false;
  enabled = false;

  constructor(
    private readonly root: THREE.Object3D,
    renderer: THREE.WebGLRenderer,
  ) {
    const map = renderer.shadowMap;
    const draw = map.render.bind(map);
    map.render = (lights, scene, camera) => {
      this.show(lights);
      for (const o of this.shadowOnly) o.visible = this.enabled;
      try {
        draw(lights, scene, camera);
      } finally {
        for (const p of this.proxies) p.mesh.visible = false;
        for (const o of this.shadowOnly) o.visible = false;
      }
    };
  }

  /**
   * Far trees (`FarTrees`): their trunks and fruit hide while a batch draws them, so their
   * shadows come from the merged meshes whether near or far, and the batches cast none.
   */
  addLod(meshes: THREE.Mesh[], standIns: THREE.Mesh[], shadowOnly?: THREE.Object3D | null): void {
    for (const m of meshes) this.lod.add(m);
    this.standIns.push(...standIns);
    if (shadowOnly) this.shadowOnly.push(shadowOnly);
  }

  /** How many casters the merged mesh stands in for (debug and tests). */
  get merged(): number {
    return this.members.size;
  }

  /** Call once a frame; does work at most once per `sweepMs`. */
  update(now: number): void {
    for (const b of this.standIns) b.castShadow = !this.enabled;
    if (!this.enabled) {
      if (this.members.size || this.pending.size) this.clear();
      return;
    }
    if (now < this.nextSweep) return;
    this.nextSweep = now + SHADOW_MERGE.sweepMs;
    this.sweep();
    if (this.dirty && now - this.lastBuild >= SHADOW_MERGE.rebuildMs) {
      this.lastBuild = now;
      this.dirty = false;
      this.rebuild();
    }
  }

  /** Give every member its own shadow back and drop the merged mesh. */
  clear(): void {
    for (const m of this.members.keys()) m.castShadow = true;
    this.members.clear();
    this.pending.clear();
    this.dropProxies();
    this.dirty = false;
  }

  private sweep(): void {
    const root = this.root;
    // Members that moved, hid or left get their own shadow back (a mover may come back).
    for (const [mesh, m] of this.members) {
      if (
        shownUnder(mesh, root, this.lod) &&
        mesh.matrixWorld.equals(m.matrix) &&
        stamp(mesh) === m.stamp
      )
        continue;
      this.members.delete(mesh);
      mesh.castShadow = true;
      this.dirty = true;
      this.moveOrDrop(mesh);
    }
    for (const [mesh, { matrix, stamp: was }] of this.pending) {
      this.pending.delete(mesh);
      if (!mesh.castShadow || !shownUnder(mesh, root, this.lod)) {
        this.dynamic.add(mesh);
        continue;
      }
      if (!mesh.matrixWorld.equals(matrix) || stamp(mesh) !== was) {
        this.moveOrDrop(mesh);
        continue;
      }
      const mat = Array.isArray(mesh.material) ? mesh.material[0]! : mesh.material;
      this.members.set(mesh, {
        mesh,
        matrix: matrix.clone(),
        stamp: was,
        double: mat.side === THREE.DoubleSide,
        hide: mesh.customDepthMaterial === hideDepthMaterial() || isOccludable(mesh.material),
      });
      this.dirty = true;
    }
    const walk = (o: THREE.Object3D): void => {
      if (!o.visible && !this.lod.has(o)) return;
      if (
        o.layers.mask === 1 &&
        o.name !== 'shadow-merge' &&
        mergeable(o, SHADOW_MERGE.maxTris) &&
        !this.members.has(o) &&
        !this.dynamic.has(o)
      )
        this.pending.set(o, { matrix: o.matrixWorld.clone(), stamp: stamp(o) });
      for (const c of o.children) walk(c);
    };
    for (const c of root.children) walk(c);
  }

  /**
   * Before a shadow pass: each merged mesh draws only its members inside the sun's shadow box
   * (last frame's box, with a margin; the index is rewritten only when that set changes), and a
   * mesh with none is not drawn at all.
   */
  private show(lights: THREE.Light[]): void {
    if (!this.proxies.length) return;
    const sun = lights.find(
      (l): l is THREE.DirectionalLight => (l as THREE.DirectionalLight).isDirectionalLight,
    );
    const cam = sun?.castShadow ? sun.shadow.camera : null;
    if (cam)
      frustum.setFromProjectionMatrix(
        projView.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse),
      );
    for (const p of this.proxies) {
      let key = '';
      for (const s of p.spans) key += !cam || frustum.intersectsSphere(s.sphere) ? '1' : '0';
      if (key !== p.key) {
        p.key = key;
        const index = p.mesh.geometry.index!;
        const out = index.array as Uint16Array | Uint32Array;
        let n = 0;
        p.spans.forEach((s, i) => {
          if (key[i] !== '1') return;
          out.set(p.full.subarray(s.start, s.start + s.count), n);
          n += s.count;
        });
        p.mesh.geometry.setDrawRange(0, n);
        index.needsUpdate = true;
      }
      p.mesh.visible = p.mesh.geometry.drawRange.count > 0;
    }
  }

  /** A mesh that moved: watch it again, or after too many moves leave it be. */
  private moveOrDrop(mesh: THREE.Mesh): void {
    const n = (this.moved.get(mesh) ?? 0) + 1;
    this.moved.set(mesh, n);
    if (n >= SHADOW_MERGE.moves || !shownUnder(mesh, this.root, this.lod)) this.dynamic.add(mesh);
  }

  private rebuild(): void {
    this.dropProxies();
    this.root.updateWorldMatrix(true, false);
    this.invRoot.copy(this.root.matrixWorld).invert();
    // One mesh per side and depth program: two to four calls in all.
    const groups = new Map<string, Member[]>();
    for (const m of this.members.values()) {
      const key = `${m.double ? 1 : 0}${m.hide ? 1 : 0}`;
      let list = groups.get(key);
      if (!list) groups.set(key, (list = []));
      list.push(m);
    }
    for (const group of groups.values()) {
      const { double, hide } = group[0]!;
      let verts = 0;
      let idx = 0;
      for (const { mesh } of group) {
        const g = mesh.geometry as THREE.BufferGeometry;
        const n = g.getAttribute('position').count;
        verts += n;
        idx += g.index ? g.index.count : n;
      }
      const pos = new Float32Array(verts * 3);
      const index = verts > 65535 ? new Uint32Array(idx) : new Uint16Array(idx);
      const v = new THREE.Vector3();
      const local = new THREE.Matrix4();
      let vo = 0;
      let io = 0;
      const spans: Proxy['spans'] = [];
      for (const { mesh, matrix } of group) {
        const g = mesh.geometry as THREE.BufferGeometry;
        const p = g.getAttribute('position');
        local.multiplyMatrices(this.invRoot, matrix);
        for (let i = 0; i < p.count; i++) {
          v.fromBufferAttribute(p, i).applyMatrix4(local);
          pos[(vo + i) * 3] = v.x;
          pos[(vo + i) * 3 + 1] = v.y;
          pos[(vo + i) * 3 + 2] = v.z;
        }
        const start = io;
        if (g.index) for (let i = 0; i < g.index.count; i++) index[io++] = g.index.getX(i) + vo;
        else for (let i = 0; i < p.count; i++) index[io++] = i + vo;
        if (!g.boundingSphere) g.computeBoundingSphere();
        const sphere = g.boundingSphere!.clone().applyMatrix4(matrix);
        sphere.radius += SHADOW_MERGE.boxMargin;
        spans.push({ start, count: io - start, sphere });
        vo += p.count;
        mesh.castShadow = false;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setIndex(new THREE.BufferAttribute(index.slice(), 1));
      geo.computeBoundingSphere();
      const mat = new THREE.MeshBasicMaterial({
        colorWrite: false,
        side: double ? THREE.DoubleSide : THREE.FrontSide,
      });
      const proxy = new THREE.Mesh(geo, mat);
      proxy.name = 'shadow-merge';
      proxy.castShadow = true;
      proxy.receiveShadow = false;
      proxy.matrixAutoUpdate = false;
      proxy.visible = false;
      if (hide) proxy.customDepthMaterial = hideDepthMaterial();
      proxy.raycast = () => {};
      this.root.add(proxy);
      proxy.updateMatrixWorld(true);
      // Never culled whole: `show` culls its members one by one instead.
      proxy.frustumCulled = false;
      this.proxies.push({ mesh: proxy, full: index, spans, key: '' });
    }
  }

  private dropProxies(): void {
    for (const { mesh } of this.proxies) {
      mesh.removeFromParent();
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    }
    this.proxies.length = 0;
  }
}
