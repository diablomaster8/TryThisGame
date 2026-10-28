import * as THREE from 'three';
import { WORLD_LOD } from '../config/tuning-world';

/**
 * WORLD-03/12: what the Full 3D Grove gives up, creature by creature, when a frame is over
 * the device's draw budget, without touching how a creature is built (`actors.ts` and
 * `creature-pool.ts` stay as they are). The scene hands it the creature rigs once a frame.
 *
 * - Shadow casting follows the view, not the sun's box. The sun's shadow box is 60 units
 *   square around the Keeper, far wider than a phone's portrait view, so every creature
 *   within 30 units was drawn again into the shadow map although neither it nor its shadow
 *   was on screen. A rig whose bounding sphere, grown by the longest shadow it can throw,
 *   is outside the camera's frustum stops casting until it is back. Nothing on screen
 *   changes, so this runs at every geometry level.
 * - Outline hulls go on small creatures first. The hull is a second draw of every outlined
 *   part; on a creature a few dozen pixels tall the line is most of what you see of it
 *   anyway. From level 2 a creature under `hullMinPx` loses its hull, and at level 3 they
 *   all go (the look the CPU governor already falls back to). At level 3 a creature under
 *   the same height also stops casting: its contact blob (every rig has one) keeps it on
 *   the ground. A creature keeps its state inside a band around each threshold, so one
 *   walking at the edge does not flicker.
 */
interface RigState {
  casters: THREE.Mesh[];
  hulls: THREE.Mesh[];
  /** Local bounding radius at scale 1, measured once. */
  radius: number;
  casting: boolean;
  hulled: boolean;
}

const sphere = new THREE.Sphere();
const frustum = new THREE.Frustum();
const projView = new THREE.Matrix4();
const box = new THREE.Box3();
const at = new THREE.Vector3();

export class CreatureLod {
  private readonly rigs = new Map<THREE.Object3D, RigState>();
  /** Rigs whose casters or hulls are switched off, to give them back once they leave. */
  private readonly changed = new Set<THREE.Object3D>();
  /** Rigs seen this frame. */
  private readonly seen = new Set<THREE.Object3D>();
  /** Creatures casting and hulls drawn after the last update, for the debug readout. */
  casting = 0;
  hulls = 0;
  inView = 0;

  private state(root: THREE.Object3D): RigState {
    let s = this.rigs.get(root);
    if (s) return s;
    const casters: THREE.Mesh[] = [];
    const hulls: THREE.Mesh[] = [];
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      if (m.userData.hull) hulls.push(m);
      else if (m.castShadow) casters.push(m);
    });
    const scale = root.scale.x || 1;
    root.updateWorldMatrix(false, true);
    box.setFromObject(root, true);
    const radius = box.isEmpty() ? 1.5 : box.getBoundingSphere(sphere).radius / scale;
    s = { casters, hulls, radius, casting: true, hulled: true };
    this.rigs.set(root, s);
    return s;
  }

  /**
   * Walk `roots` (each a creature rig's top group) against `camera`. `level` is the
   * governor's geometry level, `viewH` the drawing buffer's height in CSS pixels.
   */
  update(
    roots: readonly THREE.Object3D[],
    camera: THREE.Camera,
    level: number,
    viewH: number,
  ): void {
    projView.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projView);
    const persp = camera as THREE.PerspectiveCamera;
    const focal = persp.isPerspectiveCamera
      ? viewH / (2 * Math.tan(THREE.MathUtils.degToRad(persp.fov) / 2))
      : 0;
    const cfg = WORLD_LOD.creature;
    this.seen.clear();
    this.casting = this.hulls = this.inView = 0;
    for (const root of roots) {
      if (!root.visible) continue;
      const s = this.state(root);
      this.seen.add(root);
      root.getWorldPosition(at);
      const r = s.radius * (root.scale.x || 1);
      sphere.set(at, r + cfg.shadowReach);
      const near = frustum.intersectsSphere(sphere);
      sphere.radius = r;
      const onScreen = near && frustum.intersectsSphere(sphere);
      if (onScreen) this.inView++;
      // On-screen height in CSS pixels, from the distance along the view.
      const depth = Math.max(0.1, at.distanceTo(camera.position));
      const px = focal ? (2 * r * focal) / depth : Infinity;
      const min = level >= 3 ? Infinity : level >= 2 ? cfg.hullMinPx : 0;
      const band = s.hulled ? 1 - cfg.band : 1 + cfg.band;
      const hull = px >= min * band;
      const castMin = level >= 3 ? cfg.hullMinPx : 0;
      const cast = near && px >= castMin * (s.casting ? 1 - cfg.band : 1 + cfg.band);
      if (cast !== s.casting) {
        s.casting = cast;
        for (const m of s.casters) m.castShadow = cast;
      }
      if (hull !== s.hulled) {
        s.hulled = hull;
        for (const m of s.hulls) m.visible = hull;
      }
      if (!cast || !hull) this.changed.add(root);
      if (cast) this.casting++;
      if (hull && onScreen) this.hulls++;
    }
    for (const root of this.changed) {
      if (this.seen.has(root)) continue;
      // Gone from the Grove (back to the pool, or another place): hand it back whole.
      this.restore(root);
    }
    // Rigs that left for good: forget them so their meshes can be collected.
    if (this.rigs.size > roots.length * 2 + 16) {
      for (const root of this.rigs.keys()) if (!this.seen.has(root)) this.rigs.delete(root);
    }
  }

  private restore(root: THREE.Object3D): void {
    const s = this.rigs.get(root);
    this.changed.delete(root);
    if (!s) return;
    if (!s.casting) for (const m of s.casters) m.castShadow = true;
    if (!s.hulled) for (const m of s.hulls) m.visible = true;
    s.casting = s.hulled = true;
  }

  /** Give every rig back its casters and hulls (leaving the Grove, or disposing). */
  restoreAll(): void {
    for (const root of [...this.changed]) this.restore(root);
  }
}
