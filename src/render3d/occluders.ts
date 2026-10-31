import * as THREE from 'three';
import { OCCLUDE } from '../config/tuning-occlude';
import { OCCLUDE_R10 } from '../config/tuning-move-r10b';

/**
 * R0018: houses, the windmill, the shed and the stalls thin out when one stands between
 * the camera and the Keeper (the crowns' sibling, `crowns.ts`). Each is a world-space box
 * with a roof line. The dither is in the material's fragment shader and tests the
 * fragment's world position against the boxes, so the buildings' shared, merged materials
 * need no per-house copy and fading never touches a program after the first compile. The
 * roof (above the roof line) keeps 25% and the walls 45%, over 150 ms, and back over
 * 300 ms. While the Keeper is behind one, a silhouette of them is drawn through it: a flat
 * fill inside a darker rim about a pixel wide.
 */
interface Box {
  key: string;
  min: THREE.Vector3;
  max: THREE.Vector3;
  roofY: number;
  t: number;
}

const patched = new WeakSet<THREE.Material>();

export class Occluders {
  private boxes: Box[] = [];
  private readonly a = { value: [] as THREE.Vector4[] };
  private readonly b = { value: [] as THREE.Vector4[] };
  private readonly n = { value: 0 };
  private readonly keep = { value: new THREE.Vector2(OCCLUDE.roofKeep, OCCLUDE.wallKeep) };
  private readonly ray = new THREE.Vector3();
  private readonly ghostMat = new THREE.MeshBasicMaterial({
    color: OCCLUDE.ghostColor,
    transparent: true,
    opacity: OCCLUDE.ghostOpacity,
    depthFunc: THREE.GreaterDepth,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
    fog: false,
    toneMapped: false,
  });
  /**
   * The silhouette's rim: the same kind of material as the fill (so the same program, no
   * new compile), drawn first from a slightly swollen twin of each part.
   */
  private readonly edgeMat = new THREE.MeshBasicMaterial({
    color: OCCLUDE_R10.edgeColor,
    transparent: true,
    opacity: 1,
    depthFunc: THREE.GreaterDepth,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
    fog: false,
    toneMapped: false,
  });
  /** Rig groups that already carry silhouette meshes. */
  private readonly ghosted = new WeakSet<THREE.Object3D>();

  constructor() {
    for (let i = 0; i < OCCLUDE.max; i++) {
      this.a.value.push(new THREE.Vector4());
      this.b.value.push(new THREE.Vector4());
    }
    this.ghostMat.visible = false;
    this.edgeMat.visible = false;
  }

  /** Add a box (centre, half-extents, heights in world units); the roof starts above `roofY`. */
  add(
    key: string,
    cx: number,
    cz: number,
    hx: number,
    hz: number,
    y0: number,
    y1: number,
    roofY: number,
  ): void {
    if (this.boxes.length >= OCCLUDE.max) return;
    this.boxes.push({
      key,
      min: new THREE.Vector3(cx - hx, y0, cz - hz),
      max: new THREE.Vector3(cx + hx, y1, cz + hz),
      roofY,
      t: 0,
    });
  }

  /** Whether any box of this owner is registered. */
  has(key: string): boolean {
    return this.boxes.some((b) => b.key === key);
  }

  /** Drop every box of one owner (the garden redraws its buildings). */
  clear(key: string): void {
    this.boxes = this.boxes.filter((b) => b.key !== key);
  }

  /** Hook the dither into every material under `root` (hulls included), once each. */
  patch(root: THREE.Object3D): void {
    root.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      if (!m || o.userData.obxGhost) return;
      for (const mat of Array.isArray(m) ? m : [m]) this.patchMat(mat);
    });
  }

  private patchMat(mat: THREE.Material): void {
    if (patched.has(mat)) return;
    patched.add(mat);
    const prev = mat.onBeforeCompile.bind(mat);
    const prevKey = mat.customProgramCacheKey();
    mat.customProgramCacheKey = () => `${prevKey}|occlude`;
    mat.onBeforeCompile = (shader, renderer) => {
      prev(shader, renderer);
      shader.uniforms.uObxA = this.a;
      shader.uniforms.uObxB = this.b;
      shader.uniforms.uObxN = this.n;
      shader.uniforms.uObxKeep = this.keep;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vObxW;')
        .replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\nvObxW = (modelMatrix * vec4(transformed, 1.0)).xyz;',
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
varying vec3 vObxW;
uniform vec4 uObxA[${OCCLUDE.max}];
uniform vec4 uObxB[${OCCLUDE.max}];
uniform float uObxN;
uniform vec2 uObxKeep;`,
        )
        .replace(
          '#include <alphatest_fragment>',
          `#include <alphatest_fragment>
          if (uObxN > 0.5) {
            float obxKeep = 1.0;
            for (int i = 0; i < ${OCCLUDE.max}; i++) {
              if (float(i) >= uObxN) break;
              vec4 oa = uObxA[i];
              vec4 ob = uObxB[i];
              if (ob.w > 0.001 && all(greaterThan(vObxW, oa.xyz)) && all(lessThan(vObxW, ob.xyz))) {
                float goal = vObxW.y > oa.w ? uObxKeep.x : uObxKeep.y;
                obxKeep = min(obxKeep, mix(1.0, goal, ob.w));
              }
            }
            if (obxKeep < 0.999) {
              float on = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
              if (on >= obxKeep) discard;
            }
          }`,
        );
    };
    mat.needsUpdate = true;
  }

  /** Does the segment `from`→`to` pass through the box (slab test, no allocation)? */
  private hits(bx: Box, from: THREE.Vector3, to: THREE.Vector3): boolean {
    const m = OCCLUDE.margin;
    const d = this.ray.subVectors(to, from);
    let t0 = 0;
    let t1 = 1;
    for (let i = 0; i < 3; i++) {
      const o = from.getComponent(i);
      const dd = d.getComponent(i);
      const lo = bx.min.getComponent(i) - m;
      const hi = bx.max.getComponent(i) + m;
      if (Math.abs(dd) < 1e-9) {
        if (o < lo || o > hi) return false;
      } else {
        let u = (lo - o) / dd;
        let v = (hi - o) / dd;
        if (u > v) [u, v] = [v, u];
        if (u > t0) t0 = u;
        if (v < t1) t1 = v;
        if (t0 > t1) return false;
      }
    }
    return true;
  }

  /**
   * Ease each box toward its goal and upload the uniforms. `targets[0..keeperN)` are the
   * Keeper's marks, the rest a focused Nubbin. Returns whether the Keeper is hidden.
   */
  update(
    camera: THREE.Vector3,
    targets: THREE.Vector3[],
    keeperN: number,
    dt: number,
    reduceMotion: boolean,
  ): boolean {
    let any = false;
    let keeperHidden = false;
    for (let i = 0; i < this.boxes.length; i++) {
      const bx = this.boxes[i]!;
      let hit = false;
      for (let k = 0; k < targets.length; k++) {
        if (this.hits(bx, camera, targets[k]!)) {
          hit = true;
          if (k < keeperN) keeperHidden = true;
        }
      }
      if (reduceMotion || dt === 0) bx.t = hit ? 1 : 0;
      else
        bx.t = hit ? Math.min(1, bx.t + dt / OCCLUDE.inS) : Math.max(0, bx.t - dt / OCCLUDE.outS);
      if (bx.t > 0) any = true;
      this.a.value[i]!.set(bx.min.x, bx.min.y, bx.min.z, bx.roofY);
      this.b.value[i]!.set(bx.max.x, bx.max.y, bx.max.z, bx.t);
    }
    this.n.value = any ? this.boxes.length : 0;
    return keeperHidden;
  }

  /**
   * Show or hide the Keeper's see-through silhouette. `rig` is the Keeper's figure; each
   * of its meshes gets one flat twin (same geometry, drawn only where something nearer
   * hides it) the first time it is needed.
   */
  ghost(on: boolean, rig: THREE.Object3D | null): void {
    this.ghostMat.visible = on && rig !== null;
    this.edgeMat.visible = this.ghostMat.visible;
    if (!on || !rig || this.ghosted.has(rig)) return;
    this.ghosted.add(rig);
    const hosts: THREE.Mesh[] = [];
    rig.traverse((o) => {
      const m = o as THREE.Mesh;
      if (
        m.isMesh &&
        !(m as THREE.InstancedMesh).isInstancedMesh &&
        !o.userData.hull &&
        !o.userData.obxGhost
      )
        hosts.push(m);
    });
    for (const h of hosts) {
      // The rim: the part swollen about its own centre by `edgeU` on every side.
      const geo = h.geometry;
      if (!geo.boundingSphere) geo.computeBoundingSphere();
      const sph = geo.boundingSphere!;
      if (sph.radius > 1e-4) {
        const e = new THREE.Mesh(geo, this.edgeMat);
        const k = 1 + OCCLUDE_R10.edgeU / sph.radius;
        const c = sph.center;
        e.matrix.makeScale(k, k, k).setPosition(c.x * (1 - k), c.y * (1 - k), c.z * (1 - k));
        e.userData.obxGhost = true;
        e.renderOrder = 998;
        e.castShadow = e.receiveShadow = false;
        e.raycast = () => {};
        e.matrixAutoUpdate = false;
        e.frustumCulled = h.frustumCulled;
        // A part the creature's stand-in replaces sits on a hidden layer; its twins follow.
        e.layers.mask = h.layers.mask;
        h.add(e);
      }
      const g = new THREE.Mesh(h.geometry, this.ghostMat);
      g.userData.obxGhost = true;
      g.renderOrder = 999;
      g.castShadow = g.receiveShadow = false;
      g.raycast = () => {};
      g.matrixAutoUpdate = false;
      g.frustumCulled = h.frustumCulled;
      g.layers.mask = h.layers.mask;
      h.add(g);
    }
  }
}

/** The one set of boxes the Grove's buildings register with. */
export const occluders = new Occluders();

/** The child of `parent` standing nearest to (x, z), within `within`. */
export function nearestChild(
  parent: THREE.Object3D,
  x: number,
  z: number,
  within: number,
): THREE.Object3D | null {
  let best: THREE.Object3D | null = null;
  let bd = within * within;
  for (const c of parent.children) {
    const d = (c.position.x - x) ** 2 + (c.position.z - z) ** 2;
    if (d < bd) {
      bd = d;
      best = c;
    }
  }
  return best;
}
