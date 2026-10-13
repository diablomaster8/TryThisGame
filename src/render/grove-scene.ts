import {
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  HemisphereLight,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  PlaneGeometry,
  PointLight,
  RingGeometry,
  Scene,
  SphereGeometry,
  type Texture,
} from 'three';
import { GROVE } from '../config/tuning';
import type { GroveKind } from '../sim/types';
import { daylightAt, type Daylight } from './daylight';
import { C, color } from './sprites/palette';
import { makeGroundTexture } from './ground';
import { makeHillTexture, makeWaterfallTexture, makeWaterTexture } from './textures';

/**
 * The Grove: a low-poly garden with grass, a pond, hills, two fruit trees and a
 * waterfall, all on the shared palette. Static geometry lives here; creatures and items
 * are sprites managed by WorldView.
 */
export class GroveScene {
  readonly scene = new Scene();
  /** Meshes that can be tapped, with `userData.pick = { kind, id }`. */
  readonly pickables: Object3D[] = [];
  private readonly water: Texture;
  private readonly falls: Texture;
  private readonly disposables: Array<{ dispose(): void }> = [];
  private readonly hemi: HemisphereLight;
  private readonly sun: DirectionalLight;
  /** Textured materials that take the Sun/Moon tint. */
  private readonly tintable: MeshLambertMaterial[] = [];
  private groveKind: GroveKind = 'main';
  private readonly canopies: Mesh[] = [];
  private readonly lanternGlows: Mesh[] = [];
  private readonly lanternLight: PointLight;
  private readonly foam: Mesh<RingGeometry, MeshBasicMaterial>;

  constructor() {
    this.scene.background = new Color(color(C.nightBlue));

    this.hemi = new HemisphereLight(new Color(color(C.shallows)), new Color(color(C.forest)), 1.5);
    this.scene.add(this.hemi);
    this.sun = new DirectionalLight(new Color(color(C.cream)), 1.1);
    this.sun.position.set(6, 10, 4);
    this.scene.add(this.sun);

    // Ground.
    const size = GROVE.size;
    const grass = makeGroundTexture();
    const groundGeo = new PlaneGeometry(size, size);
    const groundMat = new MeshLambertMaterial({ map: grass });
    this.tintable.push(groundMat);
    const ground = new Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.userData.pick = { kind: 'ground', id: 'ground' };
    this.scene.add(ground);
    this.pickables.push(ground);
    this.disposables.push(groundGeo, groundMat, grass);

    // Pond: a darker rim then the water disc, just above the grass to avoid z-fighting.
    const pond = GROVE.pond;
    const rimGeo = new CircleGeometry(pond.r + 0.5, 24);
    const rimMat = new MeshLambertMaterial({ color: new Color(color(C.sand)) });
    const rim = new Mesh(rimGeo, rimMat);
    rim.rotation.x = -Math.PI / 2;
    rim.position.set(pond.x, 0.01, pond.z);
    this.scene.add(rim);
    this.water = makeWaterTexture(8, pond.r);
    const waterGeo = new CircleGeometry(pond.r, 24);
    const waterMat = new MeshLambertMaterial({ map: this.water });
    const water = new Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(pond.x, 0.02, pond.z);
    water.userData.pick = { kind: 'ground', id: 'pond' };
    this.scene.add(water);
    this.pickables.push(water);
    this.disposables.push(rimGeo, rimMat, waterGeo, waterMat, this.water);

    // Hills: flattened spheres with a hill texture, sunk into the ground.
    const hillTex = makeHillTexture(8, 6);
    const hillMat = new MeshLambertMaterial({ map: hillTex, flatShading: true });
    this.tintable.push(hillMat);
    this.disposables.push(hillTex, hillMat);
    for (const h of GROVE.hills) {
      const geo = new SphereGeometry(h.r, 10, 6);
      const mesh = new Mesh(geo, hillMat);
      mesh.scale.set(1, h.h / h.r, 1);
      mesh.position.set(h.x, 0, h.z);
      mesh.userData.pick = { kind: 'ground', id: 'hill' };
      this.scene.add(mesh);
      this.pickables.push(mesh);
      this.disposables.push(geo);
    }

    // Waterfall on the big hill: a vertical scrolling plane plus a splash pool.
    const wf = GROVE.waterfall;
    this.falls = makeWaterfallTexture(12, 24);
    const fallGeo = new PlaneGeometry(wf.width, wf.height);
    const fallMat = new MeshBasicMaterial({ map: this.falls });
    const fall = new Mesh(fallGeo, fallMat);
    fall.position.set(wf.x - 3.2, wf.height / 2 + 0.3, wf.z + 4.6);
    fall.rotation.y = Math.PI / 6;
    this.scene.add(fall);
    const poolGeo = new CircleGeometry(1.6, 16);
    const poolMat = new MeshLambertMaterial({ color: new Color(color(C.shallows)) });
    const pool = new Mesh(poolGeo, poolMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(wf.x - 3.6, 0.015, wf.z + 5.6);
    this.scene.add(pool);
    this.disposables.push(fallGeo, fallMat, this.falls, poolGeo, poolMat);

    // Fruit trees.
    const trunkGeo = new CylinderGeometry(0.28, 0.42, 2.0, 6);
    const trunkMat = new MeshLambertMaterial({
      color: new Color(color(C.bark)),
      flatShading: true,
    });
    const canopyGeo = new IcosahedronGeometry(1.7, 0);
    const canopyMat = new MeshLambertMaterial({
      color: new Color(color(C.leaf)),
      flatShading: true,
    });
    const fruitGeo = new SphereGeometry(0.22, 6, 4);
    const fruitMat = new MeshLambertMaterial({ color: new Color(color(C.orange)) });
    this.disposables.push(trunkGeo, trunkMat, canopyGeo, canopyMat, fruitGeo, fruitMat);
    GROVE.trees.forEach((t, i) => {
      const tree = new Object3D();
      tree.position.set(t.x, 0, t.z);
      const trunk = new Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.0;
      const canopy = new Mesh(canopyGeo, canopyMat);
      this.canopies.push(canopy);
      canopy.position.y = 3.0;
      canopy.rotation.y = i * 0.7;
      const pick = { kind: 'tree', id: `tree-${i + 1}` };
      trunk.userData.pick = pick;
      canopy.userData.pick = pick;
      tree.add(trunk, canopy);
      // A few fruit on the canopy for dressing.
      for (let k = 0; k < 3; k++) {
        const f = new Mesh(fruitGeo, fruitMat);
        const a = (k / 3) * Math.PI * 2 + i;
        f.position.set(Math.cos(a) * 1.3, 2.8 + Math.sin(a * 2) * 0.4, Math.sin(a) * 1.3);
        f.userData.pick = pick;
        tree.add(f);
        this.pickables.push(f);
      }
      this.scene.add(tree);
      this.pickables.push(trunk, canopy);
    });

    // Foam ring on the pond edge, animated in update().
    const foamGeo = new RingGeometry(pond.r - 0.35, pond.r, 32);
    const foamMat = new MeshBasicMaterial({
      color: new Color(color(C.skyLight)),
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    this.foam = new Mesh(foamGeo, foamMat);
    this.foam.rotation.x = -Math.PI / 2;
    this.foam.position.set(pond.x, 0.03, pond.z);
    this.scene.add(this.foam);
    this.disposables.push(foamGeo, foamMat);

    // Lanterns: posts with a glowing top that comes on at dusk (bloom picks it up).
    const postGeo = new CylinderGeometry(0.08, 0.1, 1.6, 5);
    const postMat = new MeshLambertMaterial({ color: new Color(color(C.darkBark)) });
    const glowGeo = new SphereGeometry(0.22, 6, 5);
    const glowMat = new MeshBasicMaterial({ color: new Color(color(C.sunLight)) });
    this.disposables.push(postGeo, postMat, glowGeo, glowMat);
    for (const [x, z] of [
      [-4, 4],
      [4, -3],
      [9, 7],
      [-8, -6],
    ] as const) {
      const post = new Mesh(postGeo, postMat);
      post.position.set(x, 0.8, z);
      const glow = new Mesh(glowGeo, glowMat);
      glow.position.set(x, 1.75, z);
      glow.visible = false;
      this.scene.add(post, glow);
      this.lanternGlows.push(glow);
    }
    this.lanternLight = new PointLight(new Color(color(C.sunYellow)), 0, 14, 1.2);
    this.lanternLight.position.set(0, 2.5, 0);
    this.lanternLight.visible = false;
    this.lanternLight.intensity = 6;
    this.scene.add(this.lanternLight);

    // A couple of decorative bushes.
    const bushGeo = new ConeGeometry(0.9, 1.1, 5);
    const bushMat = new MeshLambertMaterial({
      color: new Color(color(C.forest)),
      flatShading: true,
    });
    this.disposables.push(bushGeo, bushMat);
    for (const [x, z] of [
      [-9, 2],
      [9, 9],
      [-3, -11],
      [12, 1],
    ] as const) {
      const bush = new Mesh(bushGeo, bushMat);
      bush.position.set(x, 0.5, z);
      bush.userData.pick = { kind: 'ground', id: 'bush' };
      this.scene.add(bush);
      this.pickables.push(bush);
    }
  }

  /** Animate water, the waterfall, swaying canopies and the foam ring. `nowMs` is wall time. */
  update(nowMs: number): void {
    this.water.offset.set((nowMs / 6000) % 1, (nowMs / 9000) % 1);
    this.falls.offset.set(0, (-nowMs / 400) % 1);
    this.canopies.forEach((c, i) => {
      c.rotation.z = Math.sin(nowMs / 1400 + i * 1.7) * 0.03;
      c.rotation.x = Math.cos(nowMs / 1900 + i) * 0.02;
    });
    this.foam.material.opacity = 0.35 + 0.2 * Math.sin(nowMs / 700);
    this.foam.scale.setScalar(1 + 0.02 * Math.sin(nowMs / 900));
    for (const l of this.lanternGlows) {
      l.scale.setScalar(1 + 0.12 * Math.sin(nowMs / 230 + l.position.x));
    }
  }

  /**
   * The Sun and Moon Groves are recolours of the main Grove: a tint on the lit
   * materials, a different sky and light. Cheap, and every sprite stays the same.
   */
  setGrove(kind: GroveKind): void {
    if (this.groveKind === kind) return;
    this.groveKind = kind;
    const tint = kind === 'sun' ? color(C.cream) : kind === 'moon' ? color(C.lavender) : '#ffffff';
    for (const m of this.tintable) m.color.set(tint);
    this.applyLight();
  }

  private daylight: Daylight = daylightAt(12);

  /** Time of day: sky, light rig and lanterns. The Grove kind layers on top. */
  setDaylight(d: Daylight): void {
    this.daylight = d;
    this.applyLight();
  }

  private applyLight(): void {
    const d = this.daylight;
    const kind = this.groveKind;
    const sky =
      kind === 'sun' && d.phase === 'day'
        ? color(C.shallows)
        : kind === 'moon' && d.phase === 'day'
          ? color(C.ink)
          : d.sky;
    this.scene.background = new Color(sky);
    this.hemi.intensity = d.hemiIntensity * (kind === 'moon' ? 0.85 : 1);
    this.hemi.color.set(kind === 'moon' && d.phase === 'day' ? color(C.violet) : d.hemiColor);
    this.sun.intensity = d.sunIntensity * (kind === 'sun' ? 1.3 : 1);
    this.sun.color.set(d.sunColor);
    for (const l of this.lanternGlows) l.visible = d.lanterns;
    this.lanternLight.visible = d.lanterns;
  }

  dispose(): void {
    for (const d of this.disposables) d.dispose();
  }
}
