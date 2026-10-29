import * as THREE from 'three';
import { SKINNED_HULL } from './toon-outline';

/**
 * R0079: a creature's stand-in for the middle distance. A sculpted rig is two dozen meshes,
 * each its own draw (and again for the shadow and the outline). Past a few units nobody can
 * tell its parts apart, so its opaque toon parts are merged into one skinned mesh: each part
 * is a bone that follows the part's own transform every frame, so the pose, the walk and the
 * blink still play, and a part the rig hides (closed lids, a pose's spare hand) is folded to a
 * point. Part colours and glow are baked into the vertices; the eyes, the face cards and
 * anything see-through stay as they are. The hull is one more skinned draw. While the
 * stand-in is on, the parts it replaces sit on a layer no camera draws, so the rig's own code
 * can keep showing and hiding them as before.
 */
export const HIDDEN_LAYER = 31;

const inv = new THREE.Matrix4();
const fold = new THREE.Matrix4().makeScale(0, 0, 0);
const tint = new THREE.Color();

export interface CreatureProxy {
  mesh: THREE.SkinnedMesh;
  hull: THREE.SkinnedMesh;
  /** The parts merged in (the hull children of each go too). */
  parts: THREE.Mesh[];
  /** See-through unlit face bits (the eyes' glints, the blush): a pixel or two past the hull distance. */
  details: THREE.Mesh[];
  /** Parts drawn on the coarse grid, of `parts.length`. */
  swapped: number;
  /** Triangles in the merged mesh. */
  tris: number;
  on: boolean;
  /** The face's small bits are off too. */
  far: boolean;
}

/** A part the stand-in can take: an opaque, untextured, lit toon part. */
function mergeable(o: THREE.Object3D): o is THREE.Mesh {
  const m = o as THREE.Mesh;
  if (!m.isMesh || m.userData.hull || m.userData.lodProxy) return false;
  if ((m as THREE.InstancedMesh).isInstancedMesh || (m as THREE.SkinnedMesh).isSkinnedMesh)
    return false;
  const mat = m.material as THREE.MeshPhysicalMaterial | THREE.Material[];
  if (Array.isArray(mat) || !mat.isMeshPhysicalMaterial) return false;
  return !mat.transparent && mat.alphaTest === 0 && !mat.map && mat.visible;
}

/** Whether `o` is drawn: it and every parent up to `root` visible, and still under it. */
function shown(o: THREE.Object3D, root: THREE.Object3D): boolean {
  let p: THREE.Object3D | null = o;
  while (p && p !== root) {
    if (!p.visible) return false;
    p = p.parent;
  }
  return p === root;
}

/** The surface material the stand-in copies: the body's, with its toon patch. */
function proxyMaterial(template: THREE.MeshPhysicalMaterial): THREE.MeshPhysicalMaterial {
  // `clone` copies userData through JSON, and the template keeps its compiled shader there.
  const ud = template.userData;
  template.userData = {};
  const m = template.clone();
  template.userData = ud;
  m.vertexColors = true;
  m.color.set(0xffffff);
  m.onBeforeCompile = (shader, renderer) => {
    const keep = template.userData.shader as unknown;
    template.onBeforeCompile(shader, renderer);
    template.userData.shader = keep;
    // Glow is baked per vertex (attribute × the part's strength).
    shader.uniforms.uGlowStrength = { value: 1 };
    // The surface shader lights by the object normal: take the skinned one.
    shader.vertexShader = shader.vertexShader.replace(
      'vObjNrm = normal;',
      'vObjNrm = objectNormal;',
    );
  };
  m.customProgramCacheKey = () => `${template.customProgramCacheKey()}|lod-proxy`;
  return m;
}

/**
 * Build the stand-in for a rig and add it under `root` (off until `setProxy`). `swap` may give a
 * coarser geometry for a part (the middle distance's sculpt grid). Null when the rig has no
 * surface material to copy.
 */
export function buildProxy(
  root: THREE.Object3D,
  swap?: (part: THREE.Mesh) => THREE.BufferGeometry | null,
): CreatureProxy | null {
  const parts: THREE.Mesh[] = [];
  root.traverse((o) => {
    if (mergeable(o)) parts.push(o);
  });
  const template = parts
    .map((p) => p.material as THREE.MeshPhysicalMaterial)
    .find((m) => m.vertexColors && m.userData.shader);
  if (!template || parts.length < 2) return null;
  let swapped = 0;
  const geos = parts.map((p) => {
    const low = swap?.(p);
    if (low) swapped++;
    return low ?? p.geometry;
  });
  let verts = 0;
  let idx = 0;
  for (const g of geos) {
    verts += g.attributes.position!.count;
    idx += g.index ? g.index.count : g.attributes.position!.count;
  }
  const pos = new Float32Array(verts * 3);
  const nrm = new Float32Array(verts * 3);
  const col = new Float32Array(verts * 3);
  const glow = new Float32Array(verts);
  const skinI = new Uint16Array(verts * 4);
  const skinW = new Float32Array(verts * 4);
  const index = verts > 65535 ? new Uint32Array(idx) : new Uint16Array(idx);
  let v = 0;
  let i = 0;
  parts.forEach((part, b) => {
    const g = geos[b]!;
    const mat = part.material as THREE.MeshPhysicalMaterial;
    const p = g.attributes.position!;
    const n = g.attributes.normal;
    const c = mat.vertexColors ? g.attributes.color : undefined;
    const gl = g.attributes.glow;
    const shader = mat.userData.shader as
      { uniforms?: Record<string, { value: number } | undefined> } | undefined;
    const strength = shader?.uniforms?.uGlowStrength?.value ?? 0;
    tint.copy(mat.color);
    for (let k = 0; k < p.count; k++) {
      const o = v + k;
      pos[o * 3] = p.getX(k);
      pos[o * 3 + 1] = p.getY(k);
      pos[o * 3 + 2] = p.getZ(k);
      if (n) {
        nrm[o * 3] = n.getX(k);
        nrm[o * 3 + 1] = n.getY(k);
        nrm[o * 3 + 2] = n.getZ(k);
      }
      col[o * 3] = tint.r * (c ? c.getX(k) : 1);
      col[o * 3 + 1] = tint.g * (c ? c.getY(k) : 1);
      col[o * 3 + 2] = tint.b * (c ? c.getZ(k) : 1);
      glow[o] = gl ? gl.getX(k) * strength : 0;
      skinI[o * 4] = b;
      skinW[o * 4] = 1;
    }
    if (g.index) for (let k = 0; k < g.index.count; k++) index[i++] = g.index.getX(k) + v;
    else for (let k = 0; k < p.count; k++) index[i++] = k + v;
    v += p.count;
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('glow', new THREE.BufferAttribute(glow, 1));
  geo.setAttribute('skinIndex', new THREE.BufferAttribute(skinI, 4));
  geo.setAttribute('skinWeight', new THREE.BufferAttribute(skinW, 4));
  geo.setIndex(new THREE.BufferAttribute(index, 1));
  // Bounds in the root's frame, from the rig as built and grown for the pose's reach, so each
  // pass (the view and the sun's shadow box) culls the stand-in as it did the parts.
  root.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(root, true);
  box.applyMatrix4(inv.copy(root.matrixWorld).invert());
  geo.boundingSphere = box.getBoundingSphere(new THREE.Sphere());
  geo.boundingSphere.radius *= 1.3;

  const bones = parts.map(() => new THREE.Bone());
  const skeleton = new THREE.Skeleton(bones);
  // Each bone is its part relative to the rig's root, where the stand-in sits.
  skeleton.update = function (this: THREE.Skeleton) {
    inv.copy(root.matrixWorld).invert();
    parts.forEach((part, b) => {
      const m = shown(part, root) ? bones[b]!.matrix.multiplyMatrices(inv, part.matrixWorld) : fold;
      m.toArray(this.boneMatrices!, b * 16);
    });
    if (this.boneTexture) this.boneTexture.needsUpdate = true;
  };
  const make = (mat: THREE.Material): THREE.SkinnedMesh => {
    const s = new THREE.SkinnedMesh(geo, mat);
    s.bindMode = THREE.DetachedBindMode;
    s.bind(skeleton, new THREE.Matrix4());
    // Its own bounds (three would otherwise skin every vertex once to find them).
    s.boundingSphere = geo.boundingSphere!.clone();
    s.visible = false;
    s.userData.lodProxy = true;
    s.raycast = () => {};
    return s;
  };
  const mesh = make(proxyMaterial(template));
  mesh.castShadow = true;
  mesh.userData.swapped = `${swapped}/${parts.length}`;
  const hull = make(SKINNED_HULL);
  hull.userData.hull = true;
  geo.addEventListener('dispose', () => skeleton.dispose());
  root.add(mesh, hull);
  const details: THREE.Mesh[] = [];
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    const mat = m.material as THREE.MeshBasicMaterial | undefined;
    if (m.isMesh && mat?.isMeshBasicMaterial && mat.transparent && !mat.map) details.push(m);
  });
  return { mesh, hull, parts, details, swapped, tris: idx / 3, on: false, far: false };
}

/** Switch a rig between its parts and its stand-in. */
export function setProxy(p: CreatureProxy, on: boolean): void {
  if (p.on === on) return;
  p.on = on;
  p.mesh.visible = on;
  if (!on) p.hull.visible = false;
  if (!on) setFar(p, false);
  for (const part of p.parts) {
    part.layers.set(on ? HIDDEN_LAYER : 0);
    for (const c of part.children) if (c.userData.hull) c.layers.set(on ? HIDDEN_LAYER : 0);
  }
}

/** Hide or show the stand-in's small face bits (only while it is on). */
export function setFar(p: CreatureProxy, far: boolean): void {
  if (p.far === far || (far && !p.on)) return;
  p.far = far;
  for (const m of p.details) m.layers.set(far ? HIDDEN_LAYER : 0);
}

/** Remove a stand-in from its rig and free its geometry and material. */
export function dropProxy(p: CreatureProxy): void {
  setProxy(p, false);
  p.mesh.removeFromParent();
  p.hull.removeFromParent();
  p.mesh.geometry.dispose();
  (p.mesh.material as THREE.Material).dispose();
}
