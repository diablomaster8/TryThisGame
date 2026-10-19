import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { GROVE3D, RACE3D } from '../config/tuning';
import { daylightAt } from '../render/daylight';
import { FinishPass } from './finish-pass';
import { buildTree, pbr, repeatUv, shadowed, terrainMaterial, type Tex } from '../samples/aaa-kit';
import type { Rigged } from '../samples/species';
import type { NubbinType } from '../sim/types';
import { Bursts } from './bursts';
import type { CreaturePool, Look } from './creature-pool';
import type { Grove3dScene } from './grove-3d-scene';
import { chasePosition, frameCamera, type CameraFrame } from './minigame-layout';
import { GroveSky } from './sky';

/**
 * What the Full 3D Expedition and races (G17) stand on: a scene of their own drawn
 * with the Grove's renderer into the game canvas (under the minigame overlay), lit by
 * the same sky, dressed with the same painted surfaces, trees and particle bursts, and
 * peopled from the same creature pool, so they read as the Grove's own world. The post
 * chain is the Grove's less bloom (no golden hour here). Everything a stage makes is
 * disposed when the minigame ends; rigs go back to the pool.
 */
/** The Grove's terrain tiles its paint every 3.2 units; the strips match (and recentre by it). */
export const UV_PERIOD = 3.2;

export class MiniStage {
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly tex: Tex;
  readonly pool: CreaturePool;
  readonly sky: GroveSky;
  readonly bursts: Bursts;
  readonly time = { value: 0 };
  /** Camera shake left to play out, world units (never set under reduced motion). */
  shake = 0;
  readonly reduceMotion: boolean;
  private readonly composer: EffectComposer;
  /** Textures made here (name tags, water normals); the shared surfaces are not ours. */
  private readonly textures: THREE.Texture[] = [];
  private readonly rigs = new Map<Rigged, string>();
  private width = 0;
  private height = 0;
  private frame: CameraFrame = { fovDeg: 42, distance: 10 };
  private lastMs = 0;
  private readonly focus = new THREE.Vector3();
  private readonly look = new THREE.Vector3();
  private readonly jitter = new THREE.Vector3();
  private daylightHour = 12;
  private rand = 7;

  constructor(
    private readonly host: Grove3dScene,
    hour: number,
  ) {
    this.renderer = host.renderer;
    this.tex = host.sharedTex;
    this.pool = host.pool;
    this.reduceMotion = host.reduceMotion;
    this.daylightHour = hour;
    this.camera = new THREE.PerspectiveCamera(42, 16 / 9, GROVE3D.near, GROVE3D.far);
    this.sky = new GroveSky(this.renderer, this.scene);
    this.sky.set(hour, daylightAt(hour), 'clear', this.focus);
    this.bursts = new Bursts(this.scene);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    // Tone mapping, the sRGB encode, the clamp and the grade in one draw (they were three).
    this.composer.addPass(new FinishPass(1.15));
    this.composer.addPass(new SMAAPass());
    // Console access during development: `miniStage.scene`, `miniStage.camera`.
    if (import.meta.env.DEV) (window as unknown as { miniStage: MiniStage }).miniStage = this;
  }

  /** Match the game canvas (the Grove's `resize` sets the renderer's size) and the framing. */
  fit(o: { height: number; minSpan: number; fovDeg: number }): void {
    const size = this.renderer.getSize(new THREE.Vector2());
    const w = Math.max(1, size.x);
    const h = Math.max(1, size.y);
    if (w === this.width && h === this.height) return;
    this.width = w;
    this.height = h;
    this.composer.setSize(w, h);
    this.frame = frameCamera(w / h, o);
    this.camera.aspect = w / h;
    this.camera.fov = this.frame.fovDeg;
    this.camera.updateProjectionMatrix();
  }

  /** Half the width of the world the camera frames at its look point. */
  get halfSpan(): number {
    return this.frame.distance * Math.tan((this.frame.fovDeg * Math.PI) / 360) * this.camera.aspect;
  }

  /** Aim the chase camera at a point on the track, from the viewer's side. */
  aim(x: number, y: number, z: number, pitchDeg: number, dt: number): void {
    this.look.set(x, y, z);
    const p = chasePosition(this.look, this.frame.distance, pitchDeg);
    if (this.shake > 0) {
      this.jitter.set(this.noise() * this.shake, this.noise() * this.shake, 0);
      this.shake = Math.max(0, this.shake - dt * 0.35);
    } else this.jitter.set(0, 0, 0);
    this.camera.position.set(p.x, p.y, p.z).add(this.jitter);
    this.camera.lookAt(this.look.x + this.jitter.x, this.look.y + this.jitter.y, this.look.z);
    // The sun (and its shadow box) stays over the action.
    this.focus.set(x, y, z);
    this.sky.set(this.daylightHour, daylightAt(this.daylightHour), 'clear', this.focus);
  }

  /** A camera kick, in world units; nothing under reduced motion. */
  kick(amount: number): void {
    if (!this.reduceMotion) this.shake = Math.max(this.shake, amount);
  }

  /**
   * Link every program the stage needs before its first frame, against the composer's
   * target as the Grove does (a program linked for the canvas is not the one used).
   */
  compile(objects: THREE.Object3D[] = [this.scene]): Promise<unknown> {
    const prev = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(this.composer.readBuffer);
    const done = objects.map((o) => this.renderer.compileAsync(o, this.camera, this.scene));
    this.renderer.setRenderTarget(prev);
    return Promise.all(done);
  }

  /** Draw a frame; `nowMs` drives the water, grass sway and bursts. */
  render(nowMs: number, ground: (x: number, z: number) => number): void {
    const interval = this.lastMs ? nowMs - this.lastMs : 0;
    const dt = Math.min(0.1, interval / 1000);
    this.lastMs = nowMs;
    this.time.value = nowMs / 1000;
    this.bursts.update(nowMs, dt, ground);
    // The Grove's governor runs the shared renderer's scale through races and runs too.
    this.host.governRenderScale(this.composer, interval);
    // The Grove turns `info.autoReset` off so the debug panel sums every pass; reset per frame.
    this.renderer.info.reset();
    this.composer.render();
  }

  // ---------------------------------------------------------------- creatures

  /** A rig from the pool for this look, placed in the scene; null until it is built. */
  acquire(look: Look): Rigged | null {
    const rig = this.pool.acquire(look);
    if (!rig) return null;
    this.rigs.set(rig, look.key);
    this.scene.add(rig.group);
    rig.group.visible = false;
    rig.lookAt = null;
    rig.lift = 0;
    return rig;
  }

  /** A soft capsule of a look's height, shown while its rig is still being built. */
  standIn(look: Look): THREE.Mesh {
    const m = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.32, 0.5, 4, 10),
      new THREE.MeshStandardMaterial({ color: '#cfd8e8', transparent: true, opacity: 0.6 }),
    );
    m.scale.setScalar(look.height);
    m.position.y = look.height * 0.55;
    this.scene.add(m);
    return m;
  }

  // ---------------------------------------------------------------- props

  /**
   * A strip of ground: `x0..x1` along the track, `zBack..zFront` across, in the Grove's
   * own terrain material (grass, worn earth or rock by the blend the Grove's terrain
   * samples), or cobbles for a channel bed. `y1` makes a ramp rising to it.
   */
  strip(
    x0: number,
    x1: number,
    zBack: number,
    zFront: number,
    surface: 'grass' | 'dirt' | 'rock' | 'cobble',
    opts: { y?: number; y1?: number } = {},
  ): THREE.Mesh {
    const w = x1 - x0;
    const d = zFront - zBack;
    const rise = (opts.y1 ?? opts.y ?? 0) - (opts.y ?? 0);
    const len = Math.hypot(w, rise);
    const geo = repeatUv(new THREE.PlaneGeometry(len, d), len / UV_PERIOD, d / UV_PERIOD);
    let mat: THREE.Material;
    if (surface === 'cobble') {
      mat = this.mat('cobble', () => pbr(this.tex.cobble, { rough: 0.9, scale: 0.6 }));
    } else {
      const blend = new Float32Array(geo.attributes.position!.count * 2);
      const [rock, dirt] = surface === 'rock' ? [1, 0] : surface === 'dirt' ? [0, 1] : [0, 0];
      for (let i = 0; i < blend.length; i += 2) {
        blend[i] = rock;
        blend[i + 1] = dirt;
      }
      geo.setAttribute('blend', new THREE.BufferAttribute(blend, 2));
      mat = this.mat('terrain', () => {
        // Walls and skirts are seen from either side.
        const t = terrainMaterial(this.tex, false, this.time, GROVE3D.terrainLook);
        t.side = THREE.DoubleSide;
        return t;
      });
    }
    const m = new THREE.Mesh(geo, mat);
    m.rotation.x = -Math.PI / 2;
    // A ramp: the plane tips up along x by the rise over its length.
    m.rotation.order = 'ZXY';
    m.rotation.z = Math.atan2(rise, w);
    m.position.set((x0 + x1) / 2, (opts.y ?? 0) + rise / 2, (zBack + zFront) / 2);
    m.receiveShadow = true;
    this.scene.add(m);
    // An earth skirt under the near edge, down past the frame, so nothing shows under a
    // raised strip and the track always stands on ground.
    const skirt = this.earth(new THREE.PlaneGeometry(len, RACE3D.earthDepth));
    skirt.rotation.z = m.rotation.z;
    skirt.position.set((x0 + x1) / 2, (opts.y ?? 0) + rise / 2 - RACE3D.earthDepth / 2, zFront);
    this.scene.add(skirt);
    return m;
  }

  /** A face of bare earth (or rock) in the Grove's terrain paint, for walls and skirts. */
  earth(geo: THREE.BufferGeometry, rock = false): THREE.Mesh {
    const blend = new Float32Array(geo.attributes.position!.count * 2);
    for (let i = 0; i < blend.length; i += 2) {
      blend[i] = rock ? 1 : 0;
      blend[i + 1] = rock ? 0 : 1;
    }
    geo.setAttribute('blend', new THREE.BufferAttribute(blend, 2));
    geo.computeBoundingBox();
    const size = geo.boundingBox!.getSize(new THREE.Vector3());
    const m = new THREE.Mesh(
      repeatUv(geo, size.x / UV_PERIOD, size.y / UV_PERIOD),
      this.mat('terrain', () => terrainMaterial(this.tex, false, this.time, GROVE3D.terrainLook)),
    );
    m.receiveShadow = true;
    this.scene.add(m);
    return m;
  }

  /** A tree from the Grove's own recipe, in a group at the origin so it can be moved. */
  tree(scale: number, seed: number): THREE.Group {
    const g = new THREE.Group();
    buildTree(g, this.tex, 0, 0, scale, seed, () => 0, this.time);
    this.scene.add(g);
    return g;
  }

  shell(): THREE.Mesh {
    const m = shadowed(
      new THREE.Mesh(
        this.geo('shell', () => new THREE.SphereGeometry(1, 14, 10).scale(1, 0.55, 1)),
        this.mat(
          'shell',
          () =>
            new THREE.MeshPhysicalMaterial({
              color: '#f2d34c',
              roughness: 0.3,
              clearcoat: 0.8,
              emissive: '#8a6a10',
              emissiveIntensity: 0.25,
            }),
        ),
      ),
    );
    this.scene.add(m);
    return m;
  }

  essence(type: NubbinType): THREE.Mesh {
    const colour = ESSENCE_COLOURS[type];
    const m = shadowed(
      new THREE.Mesh(
        this.geo('essence', () => new THREE.OctahedronGeometry(1, 0)),
        this.mat(
          `essence:${type}`,
          () =>
            new THREE.MeshPhysicalMaterial({
              color: colour,
              roughness: 0.15,
              clearcoat: 1,
              emissive: colour,
              emissiveIntensity: 0.35,
              transparent: true,
              opacity: 0.9,
            }),
        ),
      ),
    );
    this.scene.add(m);
    return m;
  }

  /** A soap bubble with a small critter curled inside. */
  bubble(): THREE.Group {
    const g = new THREE.Group();
    const film = new THREE.Mesh(
      this.geo('bubble', () => new THREE.SphereGeometry(1, 20, 14)),
      this.mat(
        'bubble',
        () =>
          new THREE.MeshPhysicalMaterial({
            color: '#dff4ff',
            roughness: 0.05,
            transparent: true,
            opacity: 0.32,
            clearcoat: 1,
            depthWrite: false,
          }),
      ),
    );
    const critter = shadowed(
      new THREE.Mesh(
        this.geo('critter', () => new THREE.SphereGeometry(0.38, 10, 8).scale(1.2, 0.8, 1)),
        this.mat(
          'critter',
          () => new THREE.MeshStandardMaterial({ color: '#c88a5a', roughness: 0.8 }),
        ),
      ),
    );
    critter.position.y = -0.15;
    g.add(critter, film);
    this.scene.add(g);
    return g;
  }

  rock(): THREE.Mesh {
    const m = shadowed(
      new THREE.Mesh(
        this.geo('rock', () => new THREE.DodecahedronGeometry(1, 0).scale(1, 0.8, 0.9)),
        this.mat('rock', () => pbr(this.tex.rock, { rough: 0.95, color: '#b8b4ae' })),
      ),
    );
    this.scene.add(m);
    return m;
  }

  log(): THREE.Mesh {
    const m = shadowed(
      new THREE.Mesh(
        this.geo('log', () =>
          repeatUv(new THREE.CylinderGeometry(1, 1, 1, 12, 1).rotateZ(Math.PI / 2), 2, 1),
        ),
        this.mat('log', () => pbr(this.tex.bark, { rough: 0.9, scale: 1.2 })),
      ),
    );
    this.scene.add(m);
    return m;
  }

  bush(): THREE.Group {
    const g = new THREE.Group();
    const geo = this.geo('bush', () => new THREE.SphereGeometry(1, 12, 9));
    const mat = this.mat(
      'bush',
      () => new THREE.MeshStandardMaterial({ color: '#3f8a3a', roughness: 0.95 }),
    );
    for (const [x, y, s] of [
      [0, 0, 1],
      [-0.6, -0.15, 0.7],
      [0.6, -0.1, 0.75],
      [0.1, 0.45, 0.6],
    ] as const) {
      const m = shadowed(new THREE.Mesh(geo, mat));
      m.position.set(x, y, 0);
      m.scale.setScalar(s);
      g.add(m);
    }
    this.scene.add(g);
    return g;
  }

  /** A billboard name tag; `o.width` world units across, the text filling its height. */
  nameTag(
    text: string,
    colour: string,
    o: { width: number; height: number; fontPx: number },
  ): THREE.Sprite {
    const c = document.createElement('canvas');
    const scale = o.width / o.height;
    c.width = Math.ceil(o.fontPx * 1.3 * scale);
    c.height = Math.ceil(o.fontPx * 1.3);
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.font = `bold ${o.fontPx}px "Nunito", "Segoe UI", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = o.fontPx * 0.16;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(20,14,40,0.85)';
      ctx.strokeText(text, c.width / 2, c.height / 2, c.width - 8);
      ctx.fillStyle = colour;
      ctx.fillText(text, c.width / 2, c.height / 2, c.width - 8);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.textures.push(tex);
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthTest: false,
        toneMapped: false,
      }),
    );
    s.scale.set(o.width, o.height, 1);
    s.renderOrder = 5;
    this.scene.add(s);
    return s;
  }

  /** A flat bar (two sprites: a dark back and a fill anchored at the left). */
  bar(width: number, height: number, colour: string): { group: THREE.Group; fill: THREE.Sprite } {
    const group = new THREE.Group();
    const back = new THREE.Sprite(this.spriteMat('bar-back', '#140e28', 0.6));
    back.scale.set(width, height, 1);
    const fill = new THREE.Sprite(this.spriteMat(`bar:${colour}`, colour, 1));
    fill.center.set(0, 0.5);
    fill.position.x = -width / 2;
    fill.scale.set(width, height * 0.7, 1);
    back.renderOrder = 5;
    fill.renderOrder = 6;
    group.add(back, fill);
    this.scene.add(group);
    return { group, fill };
  }

  /**
   * A screen-filling gradient behind everything, zenith colour at the top: the Preetham
   * dome's pale horizon band is all a chase camera would see of it. The dome still lights
   * the scene through the environment map; only its drawing is skipped.
   */
  backdrop(top: string, bottom: string): void {
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 64;
    const ctx = c.getContext('2d');
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 64);
      g.addColorStop(0, top);
      g.addColorStop(1, bottom);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1, 64);
    }
    const tex = this.own(new THREE.CanvasTexture(c));
    tex.colorSpace = THREE.SRGBColorSpace;
    this.scene.background = tex;
    this.sky.sky.visible = false;
  }

  /** Register a texture of ours for disposal. */
  own<T extends THREE.Texture>(t: T): T {
    this.textures.push(t);
    return t;
  }

  /** Hand every rig back to the pool and free everything else the stage made. */
  dispose(): void {
    for (const [rig, key] of this.rigs) {
      rig.group.visible = true;
      this.pool.release(key, rig);
    }
    this.rigs.clear();
    this.sky.dispose();
    const mats = new Set<THREE.Material>();
    const geos = new Set<THREE.BufferGeometry>();
    this.scene.traverse((o) => {
      if ((o as THREE.Light).isLight) (o as THREE.Light).dispose();
      const m = o as THREE.Mesh;
      if (m.geometry) geos.add(m.geometry);
      // The burst clouds paint their own point sprites; the other maps are the shared surfaces.
      if ((o as THREE.Points).isPoints) (m.material as THREE.PointsMaterial).map?.dispose();
      if (Array.isArray(m.material)) for (const x of m.material) mats.add(x);
      else if (m.material) mats.add(m.material);
    });
    this.scene.clear();
    this.scene.background = null;
    for (const g of geos) g.dispose();
    for (const m of mats) m.dispose();
    for (const t of this.textures) t.dispose();
    this.textures.length = 0;
    // The composer frees only its own two targets; each pass holds materials and, for
    // SMAA, its edge and weight targets and lookup textures.
    for (const pass of this.composer.passes) pass.dispose();
    this.composer.dispose();
  }

  // ---------------------------------------------------------------- shared parts

  private readonly geos = new Map<string, THREE.BufferGeometry>();
  private readonly mats = new Map<string, THREE.Material>();

  private geo(key: string, make: () => THREE.BufferGeometry): THREE.BufferGeometry {
    let g = this.geos.get(key);
    if (!g) {
      g = make();
      this.geos.set(key, g);
    }
    return g;
  }

  private mat<T extends THREE.Material>(key: string, make: () => T): T {
    let m = this.mats.get(key) as T | undefined;
    if (!m) {
      m = make();
      this.mats.set(key, m);
    }
    return m;
  }

  private spriteMat(key: string, colour: string, opacity: number): THREE.SpriteMaterial {
    return this.mat(
      key,
      () =>
        new THREE.SpriteMaterial({
          color: colour,
          opacity,
          transparent: true,
          depthTest: false,
          toneMapped: false,
        }),
    );
  }

  private noise(): number {
    this.rand = (this.rand * 16807) % 2147483647;
    return this.rand / 2147483647 - 0.5;
  }
}

/** Essence colours by type, the pixel art's hues. */
const ESSENCE_COLOURS: Record<NubbinType, string> = {
  swim: '#4aa3ff',
  fly: '#c58cff',
  run: '#5fd36b',
  power: '#ff5a4a',
  normal: '#f2eee0',
};
