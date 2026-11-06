import * as THREE from 'three';
import { TURNTABLE3D } from '../config/tuning-photo3d';
import type { Nubbin } from '../sim/types';
import { nubbinLook, type CreaturePool } from './creature-pool';

/**
 * R0411 (LOOK-55): the collection book's 3D figure. A Nubbin's look is rigged from the
 * shared creature pool, posed once, and drawn offscreen into a small render target at
 * `TURNTABLE3D.frames` angles round the vertical; the frames are read back into one canvas
 * strip and cached by look key (a few strips at most). The book page then flips through
 * the strip with plain 2D draws, so an open page costs no 3D frames at all.
 *
 * The figure is lit by its own small set of lights in its own scene; its programs are
 * linked with `compileAsync` before the first draw, so opening a page never stalls the Grove.
 */
export class Turntable {
  private readonly cache = new Map<string, HTMLCanvasElement>();
  private readonly pending = new Map<string, Promise<HTMLCanvasElement | null>>();
  private readonly scene = new THREE.Scene();
  private readonly cam = new THREE.PerspectiveCamera(28, 1, 0.05, 50);
  private rt: THREE.WebGLRenderTarget | null = null;

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    private readonly pool: CreaturePool,
  ) {
    this.scene.add(new THREE.HemisphereLight(0xfff6e8, 0x8a9a7a, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(2, 4, 3);
    this.scene.add(sun);
  }

  /** The strip for a Nubbin's look (cached), or null when its sculpt did not come back in time. */
  strip(n: Nubbin): Promise<HTMLCanvasElement | null> {
    const look = nubbinLook(n);
    const hit = this.cache.get(look.key);
    if (hit) {
      // Most recently used last, so the oldest goes first.
      this.cache.delete(look.key);
      this.cache.set(look.key, hit);
      return Promise.resolve(hit);
    }
    const busy = this.pending.get(look.key);
    if (busy) return busy;
    const p = this.build(look).finally(() => this.pending.delete(look.key));
    this.pending.set(look.key, p);
    return p;
  }

  private async build(look: ReturnType<typeof nubbinLook>): Promise<HTMLCanvasElement | null> {
    const t = TURNTABLE3D;
    const until = performance.now() + t.waitMs;
    let rig = this.pool.acquire(look);
    while (!rig && performance.now() < until) {
      await new Promise((r) => setTimeout(r, t.pollMs));
      rig = this.pool.acquire(look);
    }
    if (!rig) return null;
    try {
      const g = rig.group;
      g.position.set(0, 0, 0);
      g.rotation.set(0, 0, 0);
      rig.lift = 0;
      rig.lookAt = null;
      rig.faceOverride = null;
      rig.setPose('idle');
      // Settle the pose and the face (they ease in over a beat).
      for (let s = 0; s <= 12; s++) rig.animate(s * 0.1);
      this.scene.add(g);
      const box = visibleBox(g);
      const size = box.getSize(new THREE.Vector3());
      const mid = box.getCenter(new THREE.Vector3());
      const tall = Math.max(size.y, size.x * 0.9, size.z * 0.9, 0.1);
      const dist = (tall * 0.62) / Math.tan(THREE.MathUtils.degToRad(this.cam.fov / 2));
      this.cam.position.set(mid.x, mid.y + dist * 0.18, mid.z + dist);
      this.cam.lookAt(mid);
      await this.renderer.compileAsync(this.scene, this.cam);
      const out = this.draw(rig);
      this.cache.set(look.key, out);
      while (this.cache.size > t.cache) {
        const oldest = this.cache.keys().next().value;
        if (oldest === undefined) break;
        this.cache.delete(oldest);
      }
      return out;
    } finally {
      this.scene.remove(rig.group);
      this.pool.release(look.key, rig);
    }
  }

  /** Draw every angle into the target and copy each into the strip. */
  private draw(rig: { group: THREE.Object3D }): HTMLCanvasElement {
    const { px, frames } = TURNTABLE3D;
    this.rt ??= new THREE.WebGLRenderTarget(px, px, { samples: 4 });
    const r = this.renderer;
    const out = document.createElement('canvas');
    out.width = px * frames;
    out.height = px;
    const ctx = out.getContext('2d');
    const buf = new Uint8Array(px * px * 4);
    const img = ctx?.createImageData(px, px);
    const prevTarget = r.getRenderTarget();
    const prevColor = r.getClearColor(new THREE.Color());
    const prevAlpha = r.getClearAlpha();
    const prevAuto = r.shadowMap.autoUpdate;
    r.shadowMap.autoUpdate = false;
    r.setClearColor(0x000000, 0);
    try {
      for (let i = 0; i < frames; i++) {
        rig.group.rotation.y = (i / frames) * Math.PI * 2;
        r.setRenderTarget(this.rt);
        r.clear();
        r.render(this.scene, this.cam);
        r.readRenderTargetPixels(this.rt, 0, 0, px, px, buf);
        if (!ctx || !img) continue;
        // Flip rows (GL reads bottom-up) and encode the linear target to sRGB.
        const d = img.data;
        for (let y = 0; y < px; y++) {
          const src = (px - 1 - y) * px * 4;
          const dst = y * px * 4;
          for (let x = 0; x < px * 4; x += 4) {
            const a = buf[src + x + 3]!;
            d[dst + x] = SRGB[buf[src + x]!]!;
            d[dst + x + 1] = SRGB[buf[src + x + 1]!]!;
            d[dst + x + 2] = SRGB[buf[src + x + 2]!]!;
            d[dst + x + 3] = a;
          }
        }
        ctx.putImageData(img, i * px, 0);
      }
    } finally {
      r.setRenderTarget(prevTarget);
      r.setClearColor(prevColor, prevAlpha);
      r.shadowMap.autoUpdate = prevAuto;
    }
    return out;
  }
}

/**
 * The bounds of what is drawn: shown meshes only (a rig carries hidden hearts, Zzz and the
 * emote's parts), and not the flat contact shadow under the feet, which is wider than the body.
 */
function visibleBox(root: THREE.Object3D): THREE.Box3 {
  root.updateWorldMatrix(true, true);
  const box = new THREE.Box3();
  const part = new THREE.Box3();
  const shown = (o: THREE.Object3D): boolean => {
    for (let p: THREE.Object3D | null = o; p && p !== root.parent; p = p.parent)
      if (!p.visible) return false;
    return true;
  };
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || !shown(m)) return;
    const mat = (Array.isArray(m.material) ? m.material[0] : m.material) as
      THREE.Material | undefined;
    if (mat?.transparent && !mat.depthWrite) return;
    m.geometry.computeBoundingBox();
    if (!m.geometry.boundingBox) return;
    part.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld);
    if (part.max.y - part.min.y < 0.02 * (part.max.x - part.min.x)) return;
    box.union(part);
  });
  return box.isEmpty() ? new THREE.Box3().setFromObject(root) : box;
}

/** Linear 0..255 to sRGB 0..255. */
const SRGB = Uint8Array.from({ length: 256 }, (_, i) => {
  const c = i / 255;
  const s = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, s)) * 255);
});
