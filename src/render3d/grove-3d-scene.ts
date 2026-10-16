import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GROVE3D } from '../config/tuning';
import type { OrbitCamera } from '../render/camera';
import type { Daylight } from '../render/daylight';
import { Picker } from '../render/picker';
import type { TargetSize } from '../render/pipeline';
import {
  CLAMP,
  GRADE,
  PUSHERS,
  buildParticles,
  leafCard,
  surface,
  tuftCard,
  type Tex,
} from '../samples/aaa-styles';
import type { Floor } from '../sim/dungeon';
import type { Location, SimEvent, Vec2, WeatherKind, World } from '../sim/types';
import { Actors } from './actors';
import { Bursts } from './bursts';
import { buildGroveProps, buildGroveTrees, type GroveProps } from './props';
import { GroveSky } from './sky';
import { stubOnce } from './stubs';
import { buildGroveTerrain, groveHeight, standHeight } from './terrain';
import { buildGroveWater, type GroveWater } from './water';

/**
 * The full-3D Grove: the same sim and the same OrbitCamera controls as the pixel
 * scene, drawn as a lit heightfield world with a Lakitu camera behind the Keeper.
 * The Game drives it through the members the pixel WorldView has (snapshot, update,
 * pick, events) plus `render`; nothing in the sim knows which scene is on.
 *
 * The camera: the orbit yaw and zoom index come from the OrbitCamera (so the 45°
 * snaps, the keys and the on-screen buttons all keep working); this scene turns them
 * into a perspective camera that trails the Keeper and never dips under the ground.
 */
class Picker3d extends Picker {
  constructor(
    canvas: HTMLCanvasElement,
    private readonly ground: () => (x: number, z: number) => number,
  ) {
    super(canvas);
  }

  /** Where a tap lands on the terrain: the ray is marched against the heightfield. */
  override groundPoint(clientX: number, clientY: number, camera: THREE.Camera): Vec2 | null {
    const flat = super.groundPoint(clientX, clientY, camera);
    if (!flat) return null;
    const ray = this.rayFrom(clientX, clientY, camera);
    const h = this.ground();
    const p = new THREE.Vector3();
    let last = 0;
    for (let d = 0.5; d < 120; d += 0.5) {
      ray.at(d, p);
      const dy = p.y - h(p.x, p.z);
      if (dy < 0) {
        // Refine between the last point above and this one below.
        const t = last / (last - dy);
        ray.at(d - 0.5 + 0.5 * t, p);
        return { x: p.x, z: p.z };
      }
      last = dy;
    }
    return flat;
  }
}

export class Grove3dScene {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly pickables: THREE.Object3D[] = [];
  private size: TargetSize = { width: 1, height: 1, scale: 1 };
  private readonly composer: EffectComposer;
  private readonly bloom: UnrealBloomPass;
  private readonly grade: ShaderPass;
  private readonly sky: GroveSky;
  private readonly time = { value: 0 };
  private readonly tex: Tex;
  private readonly world3d = new THREE.Group();
  private readonly props: GroveProps;
  private readonly water: GroveWater;
  private readonly actors: Actors;
  private readonly dungeonFloor: THREE.Mesh;
  private rain: THREE.Points | null = null;
  private snow: THREE.Points | null = null;
  private readonly bursts: Bursts;
  /** Camera shake in world units, decaying; set by `landed` and `treeShaken`. */
  private shakeAmount = 0;
  private shakeSeed = 0;
  private pendingShake = 0;
  private fireflies: THREE.Points | null = null;
  private treesBuilt = false;
  private readonly treeAt = new Map<string, Vec2>();
  private location: Location = 'grove';
  private lit = new Set<string>();
  private lampsOn = false;
  private readonly camPos = new THREE.Vector3(0, 6, 12);
  private readonly camTarget = new THREE.Vector3(0, 1, 0);
  private readonly raycaster = new THREE.Raycaster();
  private lastMs = 0;
  /** Frame times, for the report: the last 120 frames' render durations in ms. */
  readonly frameMs: number[] = [];

  constructor(readonly canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.62;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.camera = new THREE.PerspectiveCamera(GROVE3D.fovDeg, 16 / 9, GROVE3D.near, GROVE3D.far);
    this.sky = new GroveSky(this.renderer, this.scene);
    this.tex = {
      grass: surface('grass', 512, 2.2),
      rock: surface('rock', 512, 5),
      dirt: surface('dirt', 256, 2.5),
      bark: surface('bark', 256, 4),
      cobble: surface('cobble', 512, 5),
      plaster: surface('plaster', 256, 1.5),
      roof: surface('roof', 256, 4),
      wood: surface('wood', 256, 3),
      leaf: leafCard(256),
      tuft: tuftCard(128),
    };
    this.scene.add(this.world3d);
    buildGroveTerrain(this.world3d, this.tex, this.time);
    const terrain = this.world3d.children[0]!;
    terrain.userData.pick = { kind: 'ground', id: 'ground' };
    this.pickables.push(terrain);
    this.props = buildGroveProps(this.world3d, this.tex, this.time);
    this.pickables.push(...this.props.pickables);
    this.water = buildGroveWater(this.world3d);
    this.actors = new Actors(this.scene);
    // Compile against the composer's target: the game draws into it (linear, no tone
    // mapping), and programs compiled for the canvas would not be the ones it uses.
    this.actors.pool.compile = (o) => {
      const prev = this.renderer.getRenderTarget();
      this.renderer.setRenderTarget(this.composer.readBuffer);
      const done = this.renderer.compileAsync(o, this.camera, this.scene);
      this.renderer.setRenderTarget(prev);
      return done;
    };
    this.actors.ground = standHeight;
    this.bursts = new Bursts(this.scene);
    // Underground: a plain dark floor, until the Hollow gets its own 3D rooms.
    this.dungeonFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({ color: '#2a2630', roughness: 0.95 }),
    );
    this.dungeonFloor.rotation.x = -Math.PI / 2;
    this.dungeonFloor.receiveShadow = true;
    this.dungeonFloor.visible = false;
    this.dungeonFloor.userData.pick = { kind: 'ground', id: 'ground' };
    this.scene.add(this.dungeonFloor);
    this.pickables.push(this.dungeonFloor);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(new ShaderPass(CLAMP));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.35, 0.4, 2.8);
    this.bloom.enabled = false;
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
    this.grade = new ShaderPass(GRADE);
    this.grade.uniforms.uSaturation!.value = 1.15;
    this.composer.addPass(this.grade);
    this.composer.addPass(new SMAAPass());
  }

  /** What the debug panel reads: the backing-store size, at the device's ratio. */
  get currentSize(): TargetSize {
    return this.size;
  }

  /** The camera the input casts rays from, with the orbit's yaw for key directions. */
  cameraRig(orbit: OrbitCamera): { readonly currentYaw: number; readonly camera: THREE.Camera } {
    const cam = this.camera;
    return {
      get currentYaw() {
        return orbit.currentYaw;
      },
      camera: cam,
    };
  }

  picker(canvas: HTMLCanvasElement): Picker {
    return new Picker3d(canvas, () => (this.location === 'grove' ? standHeight : () => 0));
  }

  lanternStates(): Array<{ id: string; x: number; z: number; lit: boolean }> {
    return this.props.lanterns.map((l) => ({
      id: l.id,
      x: l.x,
      z: l.z,
      lit: this.lampsOn || this.lit.has(l.id),
    }));
  }

  setLit(ids: Set<string>): void {
    this.lit = ids;
  }

  setDungeon(f: Floor | null): void {
    if (f)
      stubOnce(
        'dungeon:floor',
        'the Hollow is a flat dark floor; rooms, torches and loot are not drawn',
      );
  }

  setDaylight(
    hour: number,
    d: Daylight,
    place: Location,
    weather: WeatherKind,
    particles: 'full' | 'light' | 'off',
  ): void {
    const grove = place === 'grove';
    if (place !== this.location) {
      this.location = place;
      if (!grove) stubOnce(`location:${place}`, 'drawn as the Grove sky over a bare floor');
    }
    this.world3d.visible = grove;
    this.dungeonFloor.visible = !grove;
    this.actors.ground = grove ? standHeight : () => 0;
    this.sky.set(hour, d, grove ? weather : 'clear', this.camTarget);
    const elevation = this.sky.elevationDeg;
    this.bloom.enabled = elevation < GROVE3D.bloomBelowDeg;
    this.bloom.strength = elevation < -2 ? 0.25 : 0.35;
    this.renderer.toneMappingExposure =
      elevation < -2 ? 0.5 : elevation < GROVE3D.bloomBelowDeg ? 0.75 : 0.62;
    this.grade.uniforms.uTint!.value.set(
      elevation < -2 ? '#c8d4ff' : elevation < GROVE3D.bloomBelowDeg ? '#ffe9d0' : '#ffffff',
    );
    // Lamps come on with the pixel scene's rule: dusk, night, or a lit campaign lantern.
    this.lampsOn = d.lanterns || d.darkness > 0.5;
    for (const l of this.props.lanterns) {
      const on = this.lampsOn || this.lit.has(l.id);
      l.glass.emissiveIntensity = on ? 2.2 : 0;
      l.light.intensity = on ? 5 : 0;
    }
    this.props.windows.material.emissiveIntensity = this.lampsOn ? 2.5 : 0;
    for (const w of this.props.windows.lights) w.intensity = this.lampsOn ? 4 : 0;
    // Weather and fireflies, built on first need.
    const wantRain = grove && weather === 'rain' && particles !== 'off';
    if (wantRain && !this.rain) this.rain = buildParticles(this.scene, 'rain');
    if (this.rain) this.rain.visible = wantRain;
    // Snow: the rain cloud's layout, white, fat and slow, drifting as it falls.
    const wantSnow = grove && weather === 'snow' && particles !== 'off';
    if (wantSnow && !this.snow) {
      this.snow = buildParticles(this.scene, 'rain');
      if (this.snow) {
        const m = this.snow.material as THREE.PointsMaterial;
        m.color.set('#ffffff');
        m.size = 0.13;
        m.opacity = 0.9;
        this.snow.geometry.setDrawRange(0, particles === 'light' ? 600 : 1500);
      }
    }
    if (this.snow) this.snow.visible = wantSnow;
    const wantFlies = grove && d.fireflies && particles !== 'off';
    if (wantFlies && !this.fireflies) this.fireflies = buildParticles(this.scene, 'golden');
    if (this.fireflies) this.fireflies.visible = wantFlies;
  }

  snapshot(world: World): void {
    this.actors.snapshot(world);
  }

  keeperDrawPos(world: World, alpha: number): Vec2 {
    return this.actors.keeperDrawPos(world, alpha);
  }

  /** Sim events: leaves from a shaken tree, dust where a Nubbin lands, and the shake. */
  onEvents(events: SimEvent[]): void {
    const ground = this.location === 'grove' ? standHeight : () => 0;
    for (const e of events) {
      if (e.kind === 'treeShaken') {
        const tree = this.treeAt.get(e.treeId);
        if (!tree) continue;
        const at = new THREE.Vector3(tree.x, ground(tree.x, tree.z) + GROVE3D.treeCrown, tree.z);
        const o = { spread: 1.4, speed: 0.6, rise: -0.2, lifeMs: 4000 };
        this.bursts.burst('leaf', at, 10, o, this.lastMs);
        this.bursts.burst('petal', at, 4, { ...o, spread: 1.2, speed: 0.5 }, this.lastMs);
        this.pendingShake = Math.max(this.pendingShake, GROVE3D.shake.tree);
      } else if (e.kind === 'landed') {
        const p = this.actors.nubbinPosition(e.nubbinId);
        if (!p) continue;
        const at = new THREE.Vector3(p.x, ground(p.x, p.z) + 0.05, p.z);
        this.bursts.burst(
          'dust',
          at,
          8,
          { spread: 0.3, speed: 1.4, rise: 0.6, lifeMs: 600 },
          this.lastMs,
        );
        this.pendingShake = Math.max(this.pendingShake, GROVE3D.shake.landed);
      }
    }
  }

  setHighlight(hit: { kind: string; id: string } | null): void {
    this.actors.setHighlight(hit);
  }

  sparkle(x: number, z: number, y = 0.4): void {
    this.actors.sparkle(x, z, y, this.lastMs);
  }

  /** Creatures under a screen point (NDC), nearest first. */
  pick(ndcX: number, ndcY: number): { kind: 'nubbin' | 'item'; id: string } | null {
    this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);
    return this.actors.pick(this.raycaster.ray);
  }

  /** Build the trees once the world is known, so taps reach the sim's tree ids. */
  private ensureTrees(world: World): void {
    if (this.treesBuilt) return;
    this.treesBuilt = true;
    for (const t of world.trees) this.treeAt.set(t.id, { x: t.pos.x, z: t.pos.z });
    buildGroveTrees(this.world3d, this.tex, world.trees, this.pickables);
    this.actors.warm(world);
  }

  update(world: World, orbit: OrbitCamera, alpha: number, nowMs: number): void {
    const dt = this.lastMs === 0 ? 0 : Math.min(0.1, (nowMs - this.lastMs) / 1000);
    this.lastMs = nowMs;
    this.time.value = nowMs / 1000;
    this.ensureTrees(world);
    this.actors.update(world, alpha, nowMs, dt, this.camPos);

    // The Lakitu camera: orbit the Keeper at the snapped yaw, eased, never underground.
    const ground = this.location === 'grove' ? standHeight : () => 0;
    const tx = orbit.target.x;
    const tz = orbit.target.z;
    const ty = ground(tx, tz) + GROVE3D.lookHeight;
    this.camTarget.x = tx;
    this.camTarget.z = tz;
    this.camTarget.y += (ty - this.camTarget.y) * (1 - Math.exp(-6 * dt));
    const yaw = orbit.currentYaw;
    const pitch = THREE.MathUtils.degToRad(GROVE3D.pitchDeg);
    const dist = GROVE3D.distance[orbit.currentZoomIndex] ?? GROVE3D.distance[0];
    const want = new THREE.Vector3(
      this.camTarget.x + Math.sin(yaw) * Math.cos(pitch) * dist,
      this.camTarget.y + Math.sin(pitch) * dist,
      this.camTarget.z + Math.cos(yaw) * Math.cos(pitch) * dist,
    );
    const k = 1 - Math.exp(-9 * dt);
    this.camPos.lerp(want, dt === 0 ? 1 : k);
    const floor = (this.location === 'grove' ? groveHeight(this.camPos.x, this.camPos.z) : 0) + 0.9;
    if (this.camPos.y < floor) this.camPos.y = floor;
    // Shake: the same rule as the pixel camera (the Settings switch), in 3D units.
    if (this.pendingShake > 0) {
      if (world.settings.screenShake)
        this.shakeAmount = Math.max(this.shakeAmount, this.pendingShake);
      this.pendingShake = 0;
    }
    this.camera.position.copy(this.camPos);
    if (this.shakeAmount > 0.001) {
      this.shakeSeed += 1;
      this.camera.position.x += Math.sin(this.shakeSeed * 12.9898) * this.shakeAmount;
      this.camera.position.y += Math.cos(this.shakeSeed * 78.233) * this.shakeAmount * 0.6;
      this.shakeAmount *= Math.exp(-12 * dt);
    } else this.shakeAmount = 0;
    this.camera.lookAt(this.camTarget);
    this.bursts.update(nowMs, dt, ground);

    // Grass parting under the creatures nearest the camera.
    for (const p of PUSHERS) p.set(0, 0, 0, 0);
    const pushers = this.actors
      .pushers()
      .sort(
        (a, b) =>
          Math.hypot(a.x - this.camPos.x, a.z - this.camPos.z) -
          Math.hypot(b.x - this.camPos.x, b.z - this.camPos.z),
      );
    pushers.slice(0, PUSHERS.length).forEach((p, i) => PUSHERS[i]!.set(p.x, p.z, p.r, 0));
    this.props.blades.rotation.z += dt * 0.6;
    this.water.update(this.time.value);
    if (this.rain?.visible) {
      const p = this.rain.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        let y = p.getY(i) - 0.35;
        if (y < 0) y += 14;
        p.setY(i, y);
      }
      p.needsUpdate = true;
      this.rain.position.set(this.camTarget.x, 0, this.camTarget.z - 6);
    }
    if (this.snow?.visible) {
      const p = this.snow.geometry.attributes.position as THREE.BufferAttribute;
      const t = this.time.value;
      for (let i = 0; i < p.count; i++) {
        let y = p.getY(i) - 1.1 * dt;
        if (y < 0) y += 14;
        p.setY(i, y);
        p.setX(i, p.getX(i) + Math.sin(t * 0.9 + i) * 0.4 * dt);
      }
      p.needsUpdate = true;
      this.snow.position.set(this.camTarget.x, 0, this.camTarget.z - 6);
    }
    if (this.fireflies?.visible) {
      const p = this.fireflies.geometry.attributes.position as THREE.BufferAttribute;
      const t = this.time.value;
      for (let i = 0; i < p.count; i++) {
        p.setY(i, p.getY(i) + Math.sin(t * 1.3 + i) * 0.004);
        p.setX(i, p.getX(i) + Math.cos(t * 0.7 + i * 0.3) * 0.004);
      }
      p.needsUpdate = true;
    }
  }

  render(): void {
    const t0 = performance.now();
    this.composer.render();
    this.frameMs.push(performance.now() - t0);
    if (this.frameMs.length > 120) this.frameMs.shift();
  }

  resize(width: number, height: number): TargetSize {
    const w = Math.max(1, Math.floor(width));
    const h = Math.max(1, Math.floor(height));
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    const pr = this.renderer.getPixelRatio();
    this.size = { width: Math.round(w * pr), height: Math.round(h * pr), scale: 1 / pr };
    return this.size;
  }

  dispose(): void {
    this.actors.dispose();
    this.sky.dispose();
    this.composer.dispose();
    this.renderer.dispose();
  }
}
