import * as THREE from 'three';
import { WORLD_LOD } from '../config/tuning-world';
import type { CreatureImpostors } from './impostor-creature';
import { buildProxy, setFar, setProxy, type CreatureProxy } from './lod-proxy';

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
 * - R0079: past `proxyFrom` units a rig is drawn as its merged stand-in (`lod-proxy.ts`): one
 *   draw for the body, one for its hull and one shadow caster, instead of two dozen each.
 *   Past `hullMaxDist` no creature keeps its hull. Stand-ins are built one a frame, as rigs
 *   first need one, and shown once their programs are linked.
 * - Round 5 (phone perf): the full-detail tier has a triangle budget (`fullTrisCap`, by device
 *   tier, `WORLD_LOD.creature.fullTris`). Nearest first, rigs in view stay whole until the next
 *   would pass it; the rest are drawn as stand-ins although they are near. So how many
 *   Nubbins wander close to the camera no longer swings the frame's triangles.
 */
interface RigState {
  casters: THREE.Mesh[];
  hulls: THREE.Mesh[];
  /** Local bounding radius at scale 1, measured once. */
  radius: number;
  /** Height of the bounds' middle above the root at scale 1, measured once. */
  lift: number;
  casting: boolean;
  hulled: boolean;
  /** Drawn as its stand-in. */
  proxied: boolean;
  /** Triangles the whole rig draws (body, hulls and its shadow pass), measured once. */
  tris: number;
}

/** Each rig's stand-in (kept with the rig, which the pool reuses), or null for none. */
const proxies = new WeakMap<THREE.Object3D, CreatureProxy | null>();
/** Stand-ins whose shaders are still linking. */
const linking = new WeakSet<CreatureProxy>();

/** A stand-in's triangles at `depth`: its mesh, its hull and shadow pass while it keeps them. */
function proxyTris(root: THREE.Object3D, depth: number): number {
  const p = proxies.get(root);
  const cfg = WORLD_LOD.creature;
  if (!p) return 0;
  const g = p.mesh.geometry;
  const n = (g.index ? g.index.count : (g.attributes.position?.count ?? 0)) / 3;
  return n * (1 + +(depth < cfg.hullMaxDist) + +(depth < cfg.shadowMaxDist));
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
  /** The far tier's atlas (the scene sets it); null keeps far rigs as stand-ins. */
  impostors: CreatureImpostors | null = null;
  /** Rigs drawn as impostors after the last update. */
  far = 0;
  /** Rigs drawn as stand-ins after the last update. */
  proxied = 0;
  /** Compiles a stand-in's programs before it is first shown (the scene sets it). */
  compile: ((o: THREE.Object3D) => Promise<unknown>) | null = null;
  /**
   * The pool's coarse-grid surfaces (`CreaturePool.lowState` and `lowSurface`), so a
   * stand-in is built on the middle distance's sculpt grid. Null: the rig's own geometry.
   */
  low: {
    state(key: string, res: number): 'ready' | 'pending' | 'none';
    surface(key: string, part: THREE.BufferGeometry): THREE.BufferGeometry | null;
  } | null = null;
  /** Stand-ins built this frame. */
  private built = 0;
  /** Round 5: full-detail triangles allowed a frame (the scene sets it by device tier). */
  fullTrisCap = Infinity;
  /** Rigs held to their stand-in this frame by the cap, and how many. */
  private readonly capped = new Set<THREE.Object3D>();
  private readonly toFar = new Set<THREE.Object3D>();
  cappedCount = 0;
  private readonly order: Array<[THREE.Object3D, number]> = [];

  private state(root: THREE.Object3D): RigState {
    let s = this.rigs.get(root);
    if (s) return s;
    const casters: THREE.Mesh[] = [];
    const hulls: THREE.Mesh[] = [];
    let tris = 0;
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh || m.userData.lodProxy) return;
      const g = m.geometry;
      const n = (g.index ? g.index.count : (g.attributes.position?.count ?? 0)) / 3;
      const k = (m as THREE.InstancedMesh).isInstancedMesh ? (m as THREE.InstancedMesh).count : 1;
      tris += n * k * (m.castShadow ? 2 : 1);
      if (m.userData.hull) hulls.push(m);
      else if (m.castShadow) casters.push(m);
    });
    const scale = root.scale.x || 1;
    root.updateWorldMatrix(false, true);
    box.setFromObject(root, true);
    const radius = box.isEmpty() ? 1.5 : box.getBoundingSphere(sphere).radius / scale;
    const lift = box.isEmpty() ? radius : (sphere.center.y - root.getWorldPosition(at).y) / scale;
    s = { casters, hulls, radius, casting: true, hulled: true, proxied: false, lift, tris };
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
    this.casting = this.hulls = this.inView = this.proxied = this.far = 0;
    this.built = 0;
    this.capFull(roots, camera);
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
      const hull =
        px >= min * band && depth < cfg.hullMaxDist * (s.hulled ? 1 + cfg.band : 1 - cfg.band);
      const proxy = this.proxyFor(root, depth, s);
      const castMin = level >= 3 ? cfg.hullMinPx : 0;
      const keep = s.casting ? 1 - cfg.band : 1 + cfg.band;
      const cast = near && px >= castMin * keep && depth < cfg.shadowMaxDist / keep;
      if (cast !== s.casting) {
        s.casting = cast;
        for (const m of s.casters) m.castShadow = cast;
      }
      if (hull !== s.hulled) {
        s.hulled = hull;
        for (const m of s.hulls) m.visible = hull;
      }
      if (proxy) {
        proxy.mesh.castShadow = cast;
        proxy.mesh.visible = proxy.on && (near || cast);
        proxy.hull.visible = proxy.on && hull && onScreen;
        if (proxy.on) this.proxied++;
        if (this.farTier(root, proxy, depth, s)) {
          proxy.mesh.castShadow = false;
          proxy.mesh.visible = true;
          proxy.hull.visible = false;
          this.far++;
        }
      }
      if (!cast || !hull || s.proxied) this.changed.add(root);
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

  /**
   * Round 5: the creature triangle budget. Rigs whose shadow reach is in view and that are not
   * impostors already are costed nearest first (whole: all their parts, hulls and shadow pass;
   * a stand-in: its mesh, plus its hull and shadow where it keeps them). The first always
   * keeps its tier. Past `fullTrisCap`, a rig nearer than `capFarFrom` drops to its stand-in
   * and one farther to the impostor tier, so how many creatures crowd the view no longer
   * swings the frame's triangles.
   */
  private capFull(roots: readonly THREE.Object3D[], camera: THREE.Camera): void {
    const cfg = WORLD_LOD.creature;
    this.capped.clear();
    this.toFar.clear();
    this.cappedCount = 0;
    if (!Number.isFinite(this.fullTrisCap)) return;
    this.order.length = 0;
    for (const root of roots) {
      if (!root.visible) continue;
      const s = this.state(root);
      root.getWorldPosition(at);
      sphere.set(at, s.radius * (root.scale.x || 1) + cfg.shadowReach);
      if (!frustum.intersectsSphere(sphere)) continue;
      const depth = at.distanceTo(camera.position);
      if (depth > cfg.impostorFrom * (this.impostors?.has(root) ? 1 - cfg.band : 1 + cfg.band))
        continue;
      this.order.push([root, depth]);
    }
    this.order.sort((a, b) => a[1] - b[1]);
    let used = 0;
    for (const [root, depth] of this.order) {
      const s = this.rigs.get(root)!;
      const near = depth <= cfg.proxyFrom * (s.proxied ? 1 - cfg.band : 1 + cfg.band);
      const stand = proxyTris(root, depth);
      const cost = near ? s.tris : stand;
      if (used === 0 || used + cost <= this.fullTrisCap) {
        used += cost;
        continue;
      }
      this.cappedCount++;
      if (depth >= cfg.capFarFrom && proxies.get(root)) this.toFar.add(root);
      else if (near) {
        this.capped.add(root);
        used += stand;
      } else used += stand;
    }
  }

  private restore(root: THREE.Object3D): void {
    const s = this.rigs.get(root);
    this.changed.delete(root);
    if (!s) return;
    this.impostors?.leave(root);
    const p = proxies.get(root);
    if (p) setProxy(p, false);
    s.proxied = false;
    if (!s.casting) for (const m of s.casters) m.castShadow = true;
    if (!s.hulled) for (const m of s.hulls) m.visible = true;
    s.casting = s.hulled = true;
  }

  /**
   * The rig's stand-in, switched for `depth` (null when it has none). Built on first need, one
   * a frame, and held off until its programs are linked.
   */
  private proxyFor(root: THREE.Object3D, depth: number, s: RigState): CreatureProxy | null {
    const cfg = WORLD_LOD.creature;
    const want =
      this.capped.has(root) || depth > cfg.proxyFrom * (s.proxied ? 1 - cfg.band : 1 + cfg.band);
    let p = proxies.get(root);
    if (p === undefined) {
      const key = root.userData.lookKey as string | undefined;
      if (!key) return null;
      // Asked even while the rig is near, so its coarse grid is marched before it walks off.
      const low = this.low?.state(key, cfg.proxyRes) ?? 'none';
      if (!want || this.built > 0 || low === 'pending') return null;
      this.built++;
      const swap = low === 'ready' ? this.low : null;
      p = buildProxy(root, swap ? (part) => swap.surface(key, part.geometry) : undefined);
      proxies.set(root, p);
      if (p && this.compile) {
        const proxy = p;
        linking.add(proxy);
        proxy.mesh.visible = proxy.hull.visible = true;
        const done = () => linking.delete(proxy);
        this.compile(proxy.mesh).then(done, done);
        proxy.mesh.visible = proxy.hull.visible = false;
      }
    }
    if (!p) return null;
    const on = want && !linking.has(p);
    setProxy(p, on);
    setFar(p, on && depth > cfg.hullMaxDist * (p.far ? 1 - cfg.band : 1 + cfg.band));
    s.proxied = on;
    return p;
  }

  /** Whether the rig is drawn as an impostor now (entering or leaving the tier as `depth` says). */
  private farTier(root: THREE.Object3D, proxy: CreatureProxy, depth: number, s: RigState): boolean {
    const imp = this.impostors;
    if (!imp) return false;
    const cfg = WORLD_LOD.creature;
    const was = imp.has(root);
    const far =
      proxy.on &&
      (this.toFar.has(root) || depth > cfg.impostorFrom * (was ? 1 - cfg.band : 1 + cfg.band));
    if (far && !was) {
      // Everything it draws goes to the impostor layer: the stand-in on, its hull off.
      proxy.mesh.visible = true;
      proxy.hull.visible = false;
      const k = root.scale.x || 1;
      return imp.enter(root, s.lift * k, s.radius * k * cfg.impostor.margin);
    }
    if (!far && was) imp.leave(root);
    return far;
  }

  /** Give every rig back its casters and hulls (leaving the Grove, or disposing). */
  restoreAll(): void {
    for (const root of [...this.changed]) this.restore(root);
  }
}
