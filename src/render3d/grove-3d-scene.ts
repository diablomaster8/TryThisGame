import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { GROVE3D, READ3D, UI } from '../config/tuning';
import type { OrbitCamera } from '../render/camera';
import { bandFor } from '../render/cave-bands';
import { daylightAt, type Daylight } from '../render/daylight';
import { bubbleFor } from '../render/sprites/emote';
import { Picker } from '../render/picker';
import type { TargetSize } from '../render/pipeline';
import { CLAMP, PUSHERS, type Tex } from '../samples/aaa-kit';
import type { Floor } from '../sim/dungeon';
import { townUnlocks } from '../sim/town';
import type { Location, SimEvent, Vec2, WeatherKind, World } from '../sim/types';
import { Actors } from './actors';
import type { CreaturePool } from './creature-pool';
import { pickSculptRes, qualityForRes } from './sculpt-res';

export { prewarmCreatures } from './prewarm';
import { Bursts } from './bursts';
import { PARTICLE_TIME } from './quad-particles';
import { FinishPass } from './finish-pass';
import { caveShed } from './cave-shed';
import { DofPass } from './dof-pass';
import { FrameGovernor } from './governor';
import { LampPool, type LampSource } from './lamp-pool';
import { setOutlines } from './toon-outline';
import { CrownFade } from './crowns';
import { Garden, useBuildingKit } from './garden';
import { Halo } from './halo';
import { Hollow } from './hollow';
import { buildGroveProps, buildGroveTrees, type GroveProps } from './props';
import { GroveTextures } from './grove-textures';
import { GroveSky } from './sky';
import { StorySets } from './story-sets';
import { fitShot3d, fovFor, safeNdc } from './fit-shot';
import {
  clearYaw,
  type FitPoint,
  SceneStager,
  speaksAsKeeper,
  stageObstacles,
  yawSteps,
} from '../render/scene-stage';
import { safeRect, viewRect, type ScreenRect } from '../render/stage-api';
import { LOOK_STATE } from '../config/npc-looks';
import { stageHides } from '../config/stage-sets';
import { STAGE2 } from '../config/tuning-f2';
import { STAGE4 } from '../config/tuning-f4';
import { StageBuildings3d } from './stage-buildings-3d';
import { Dressings3d } from './dressings';
import { Village } from './village';
import { GroveWeather } from './weather';
import { VisitSet } from './visit';
import { buildGroveTerrain, groveHeight, standHeight, type GroveTerrain } from './terrain';
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
/**
 * The light sets a frame can be drawn with: the Grove by day (sun and sky only), the Grove
 * with its night lamps (the lamp pool's point lights), the Hollow Below (the torch lamps)
 * and every other place (none). Each set takes its own programs for every lit material, so
 * each is linked before it is drawn.
 */
type LightSet = 'grove' | 'groveNight' | 'cave' | 'plain';

/** Burst shapes, after the pixel view's numbers (3D sparkles live a little longer). */
const BURST = {
  dizzy: { spread: 0.4, speed: 0.2, rise: 0.1, lifeMs: 600 },
  hatch: { spread: 0.5, speed: 1.4, rise: 1.2, lifeMs: 900 },
  evolve: { spread: 0.8, speed: 1.8, rise: 1.6, lifeMs: 1300 },
  evolvePetals: { spread: 0.6, speed: 1.0, rise: 1.0, lifeMs: 1600 },
  eternal: { spread: 1.2, speed: 1.2, rise: 2.0, lifeMs: 2200 },
  cocoon: { spread: 0.5, speed: 0.6, rise: 0.5, lifeMs: 1200 },
  crumbs: { spread: 0.15, speed: 0.6, rise: 0.3, lifeMs: 450 },
  collected: { spread: 0.2, speed: 0.6, rise: 0.8, lifeMs: 500 },
  eggDust: { spread: 0.2, speed: 0.5, rise: 0.3, lifeMs: 400 },
};

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

/** What a tap can land on in 3D: the pick kinds the input knows from the pixel view. */
export interface Pick3d {
  kind:
    | 'nubbin'
    | 'item'
    | 'npc'
    | 'wild'
    | 'stray'
    | 'memorial'
    | 'decor'
    | 'building'
    | 'plant'
    | 'stairs'
    | 'chest'
    | 'loot'
    | 'storyProp';
  id: string;
}

type Particles = 'full' | 'light' | 'off';

/**
 * Where the camera wants to be: on the player's orbit, framing a key moment's Nubbin, or
 * framing a story scene's speakers. `x`, `z` is the look point; `points` who is in shot.
 */
interface Shot {
  kind: 'orbit' | 'focus' | 'stage';
  x: number;
  z: number;
  yaw: number;
  pitchDeg: number;
  distance: number;
  points: FitPoint[];
  /** How far above the ground the camera looks, over the usual height. */
  lookUp: number;
  /** H4: framed inside the HUD-safe area already (no lift clear of the dialogue box). */
  fitted?: boolean;
}

/** Mix two shots (H5's push-in): look point, yaw the short way round, pitch, distance. */
function mixShot(a: Shot, b: Shot, t: number): Shot {
  const dyaw = Math.atan2(Math.sin(b.yaw - a.yaw), Math.cos(b.yaw - a.yaw));
  return {
    ...b,
    x: THREE.MathUtils.lerp(a.x, b.x, t),
    z: THREE.MathUtils.lerp(a.z, b.z, t),
    yaw: a.yaw + dyaw * t,
    pitchDeg: THREE.MathUtils.lerp(a.pitchDeg, b.pitchDeg, t),
    distance: THREE.MathUtils.lerp(a.distance, b.distance, t),
    lookUp: THREE.MathUtils.lerp(a.lookUp, b.lookUp, t),
    fitted: t < 0.5 ? a.fitted === true : b.fitted === true,
  };
}

/** The events whose Nubbin the camera turns to (review 2026-10-21, bug 10). */
const FOCUS_EVENTS = new Set<SimEvent['kind']>([
  'hatched',
  'evolved',
  'secondEvolved',
  'speciesGrew',
  'cocoonStarted',
  'reborn',
  'eternal',
]);

/** The grade's saturation (rain takes `GROVE3D.rain.saturation`). */
const GRADE_SATURATION = 1.15;
/** Bloom's HDR threshold above ground: above the lit scene, or the frame washes white. */
const BLOOM_THRESHOLD = 2.8;
/** A layer nothing is put on: the sun's shadow camera looks at it underground. */
const EMPTY_LAYER = 31;
export class Grove3dScene {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly pickables: THREE.Object3D[] = [];
  private size: TargetSize = { width: 1, height: 1, scale: 1 };
  private readonly composer: EffectComposer;
  private readonly bloom: UnrealBloomPass;
  private readonly grade: FinishPass;
  /** The HDR clamp ahead of bloom; the finish pass clamps on its own when bloom is off. */
  private readonly clamp: ShaderPass;
  /** K21: depth of field for the close and over-the-shoulder story shots (render3d/dof-pass.ts). */
  private readonly dof: DofPass;
  /** The night lights, and the lit lanterns and windows they may go to. */
  private readonly lamps: LampPool;
  private lampSources: LampSource[] = [];
  /** Lowers the render scale while frames run slow (review C, item 6). */
  readonly governor: FrameGovernor;
  /** The pixel ratio each composer was last sized at; the minigame stage shares the renderer. */
  private readonly composerRatio = new WeakMap<EffectComposer, number>();
  private shadowTick = 0;
  /** Whether the hour wants bloom, and the governor's CPU savings as last applied. */
  private bloomWanted = false;
  private cpuApplied = 0;
  /** Whether the Hollow's shed list has dropped bloom (`cave-shed.ts`). */
  private bloomShed = false;
  /**
   * Underground the sun's shadow pass draws nothing (`GROVE3D.cave.light.sunShadow`): its
   * camera looks at an empty layer, the map is cleared once and then left alone. The
   * programs keep their shadow sampling, so going down the stairs links nothing new.
   */
  private caveShadowOff = false;
  private caveShadowCleared = false;
  private sunShadowMask = 0;
  private readonly sky: GroveSky;
  private readonly time = { value: 0 };
  /** The sky fill's ground colour, put back when the Hollow's warm bounce is left. */
  private readonly hemiGround = new THREE.Color();
  /** The cave's background, reused so a relight makes no colour. */
  private readonly caveBg = new THREE.Color();
  private readonly tex: Tex;
  private readonly textures: GroveTextures;
  private readonly terrain: GroveTerrain;
  /** Whether the scene's programs are linked; until then `render` draws nothing. */
  private compiled = false;
  private compiling = false;
  /** Light sets whose programs are linked, and the compiles under way (see `warm`). */
  private readonly warmed = new Set<LightSet>();
  private readonly warms = new Map<LightSet, Promise<void>>();
  /** How long `render` has held the last frame for a place still linking, and the dimming. */
  private holdMs = 0;
  private fade = 0;
  private lastRenderMs = 0;
  private readonly world3d = new THREE.Group();
  private readonly props: GroveProps;
  /** The square's stalls and the path's fence posts. */
  private readonly village: Village;
  private readonly water: GroveWater;
  private readonly actors: Actors;
  private readonly dungeonFloor: THREE.Mesh;
  /** A neighbour's Grove, dressed, for `visit:<trainer>`. */
  private readonly visit: VisitSet;
  /** The story Hollow and Corvin's garden, dressed as in the pixel view. */
  private readonly story: StorySets;
  private readonly bursts: Bursts;
  private readonly garden: Garden;
  private readonly hollow: Hollow;
  private readonly halo: Halo;
  private highlightKey = '';
  private floor: Floor | null = null;
  private groveKind: World['grove'] = 'main';
  private lastWorld: World | null = null;
  /** Camera shake in world units, decaying; set by `landed` and `treeShaken`. */
  private shakeAmount = 0;
  private shakeSeed = 0;
  private pendingShake = 0;
  /** Rain, snow, fireflies and falling leaves. */
  private readonly weather: GroveWeather;
  private treesBuilt = false;
  private readonly treeAt = new Map<string, Vec2>();
  private readonly crowns = new CrownFade();
  private readonly holeSize = new THREE.Vector2();
  private readonly holeNdc = new THREE.Vector3();
  /** The Keeper's middle and head, which the crowns keep clear of (see crowns.ts). */
  private readonly keeperMarks = [new THREE.Vector3(), new THREE.Vector3()];
  private location: Location = 'grove';
  private lit = new Set<string>();
  private lampsOn = false;
  private readonly camPos = new THREE.Vector3(0, 6, 12);
  private readonly camTarget = new THREE.Vector3(0, 1, 0);
  private readonly raycaster = new THREE.Raycaster();
  private lastMs = 0;
  /** Frame times, for the report: the last 120 frames' render durations in ms. */
  readonly frameMs: number[] = [];
  /** Story scenes: who is framed, who holds still, the hour asked for (staging.ts). */
  private readonly staging = new SceneStager();

  /** K48: the story stager this view follows (the stage inspector reads it). */
  get storyStager(): SceneStager {
    return this.staging;
  }
  /** Who speaks the dialogue line on screen (the game sets it); always framed (C5). */
  storySpeaker: string | null = null;
  /** The dialogue's line index in the scene (the game sets it); H5 pushes in after line 0. */
  storyLine = 0;
  /** The dressings' buildings API (campaign graphics 2): list, hide, thin. */
  private readonly buildings3d: StageBuildings3d;
  /** A camera to try fitted shots with (H4), and the last fit, kept while nothing changes. */
  private readonly fitCam = new THREE.PerspectiveCamera();
  private fitCache: { key: string; x: number; z: number; distance: number } | null = null;
  /** The points the last fit kept (K3), for the stage inspector (K48). */
  fitKept: FitPoint[] = [];
  /** The last story shot before H5's push-in, which the push eases from. */
  private prePush: Shot | null = null;
  /** K9: the exchange the last shot cut to ('speaker|listener'), and a cut due this frame. */
  private reverseKey = '';
  private reverseCut = false;
  /** K48: the last reverse shot's yaw, or null, for the stage inspector. */
  reverseYaw: number | null = null;
  private safe: { atMs: number; rect: ScreenRect; view: ScreenRect } | null = null;
  /** The campaign-graphics packages' story dressing (render3d/dressings.ts). */
  private readonly dressings = new Dressings3d();
  /** Lamp-pool sources the dressings borrow this frame. */
  private readonly dressLamps: LampSource[] = [];
  /** The daylight the frame is lit with, staged hour included, for the dressings. */
  private drawnDay: Daylight = daylightAt(12);
  /** The Nubbin a key moment is about (hatch, evolution, cocoon, rebirth), until when. */
  private focus: { id: string; untilMs: number } | null = null;
  /** 0 on the player's orbit, 1 on a framed shot; eased between. */
  private blend = 0;
  private lastShot: Shot | null = null;
  /** The framed shot's turn off the player's yaw, eased; WASD follows it (`cameraRig`). */
  private yawOffset = 0;
  private readonly subjectMarks = [new THREE.Vector3(), new THREE.Vector3()];
  /** The last daylight the game set, to light a story scene's hour over it at once. */
  private dayArgs: [number, Daylight, Location, WeatherKind, Particles] | null = null;
  /** The player's reduced-motion choice as the game resolves it; the minigames read it. */
  reduceMotion = false;

  constructor(readonly canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'high-performance',
    });
    this.governor = new FrameGovernor(window.devicePixelRatio);
    this.renderer.setPixelRatio(this.governor.ratio);
    // Count every composer pass, reset once per frame in `render` (review C, item 19).
    this.renderer.info.autoReset = false;
    // The page CSS scales the pixel mode's low-res canvas with nearest-neighbour; the 3D
    // backing store stops at 1.5x, so on a 2x or 3x phone that would turn edges to blocks.
    canvas.style.imageRendering = 'auto';
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.62;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.camera = new THREE.PerspectiveCamera(GROVE3D.fovDeg, 16 / 9, GROVE3D.near, GROVE3D.far);
    this.sky = new GroveSky(this.renderer, this.scene);
    this.hemiGround.copy(this.sky.hemi.groundColor);
    // Painted in workers while the scene boots; the veil waits for them (`loadState`).
    this.textures = new GroveTextures((t) => this.renderer.initTexture(t));
    this.tex = this.textures.tex;
    this.scene.add(this.world3d);
    // Sampled in a worker too; the mesh is in place at once and filled when it lands.
    this.terrain = buildGroveTerrain(this.world3d, this.tex, this.time);
    this.terrain.mesh.userData.pick = { kind: 'ground', id: 'ground' };
    this.pickables.push(this.terrain.mesh);
    this.props = buildGroveProps(this.world3d, this.tex, this.time);
    this.pickables.push(...this.props.pickables);
    this.lamps = new LampPool(this.world3d, GROVE3D.nightLamps);
    this.village = new Village(this.world3d, this.tex, groveHeight);
    this.weather = new GroveWeather(this.scene, this.world3d);
    this.water = buildGroveWater(this.world3d);
    this.actors = new Actors(this.scene);
    // Compile against the composer's target: the game draws into it (linear, no tone
    // mapping), and programs compiled for the canvas would not be the ones it uses.
    // A rig compiles for the light set it is shown in and for every set already linked,
    // so walking into the Hollow Below with it does not stall either.
    this.actors.pool.compile = (o) => {
      const sets = new Set([this.lightSet(), ...this.warmed]);
      return Promise.all([...sets].map((set) => this.compileAs(set, [o])));
    };
    this.actors.ground = standHeight;
    // The lantern posts thin like trunks when in the way, and NPCs are drawn clear of them.
    for (const l of this.props.lanterns)
      this.crowns.addPillar(l.materials, l.foot, l.height, READ3D.post.r);
    this.actors.crowdOptions = {
      posts: this.props.lanterns.map((l) => ({ x: l.x, z: l.z })),
      holds: this.staging.holds,
      faces: this.staging.faces,
      walking: this.staging.walking,
      // An exclusive stage draws only its cast (campaign graphics C3, C4).
      only: () => (this.staging.exclusive || LOOK_STATE.tale ? this.staging.castIds : null),
    };
    this.bursts = new Bursts(this.scene);
    // The garden's and the story's buildings wear the Grove's building kit (bug 15).
    useBuildingKit(this.tex);
    this.garden = new Garden(this.world3d);
    this.hollow = new Hollow(this.scene, this.tex, this.sky);
    this.halo = new Halo(this.scene);
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
    this.visit = new VisitSet(this.scene, this.tex, this.pickables);
    this.story = new StorySets(this.scene, this.tex, this.pickables);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.dof = DofPass.install(this.composer, this.camera);
    this.clamp = new ShaderPass(CLAMP);
    this.clamp.enabled = false;
    this.composer.addPass(this.clamp);
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.35, 0.4, BLOOM_THRESHOLD);
    this.bloom.enabled = false;
    this.composer.addPass(this.bloom);
    // Underground, bloom is the last effect shed before the render scale (`cave-shed.ts`).
    caveShed.register({
      name: 'bloom',
      apply: (shed) => {
        this.bloomShed = shed;
        this.bloom.enabled = this.bloomWanted && this.cpuApplied < 2 && !shed;
        this.clamp.enabled = this.bloom.enabled;
      },
    });
    // Tone mapping, the sRGB encode and the grade in one draw (they were three).
    this.grade = new FinishPass(GRADE_SATURATION);
    this.composer.addPass(this.grade);
    this.composer.addPass(new SMAAPass());
    this.buildings3d = new StageBuildings3d(this.pickables, () => this.garden.buildings());
    this.buildings3d.discover();
    this.dressings.build({
      scene: this.scene,
      world3d: this.world3d,
      tex: this.tex,
      pickables: this.pickables,
      lamps: this.dressLamps,
      lampsOn: () => this.lampsOn,
      reduceMotion: () => this.reduceMotion,
      time: this.time,
      compile: (o) => {
        const sets = new Set([this.lightSet(), ...this.warmed]);
        return Promise.all([...sets].map((set) => this.compileAs(set, [o])));
      },
      buildings: this.buildings3d,
      camera: this.camera,
      safeRect,
    });
  }

  /** The painted surfaces and the creature pool, shared with the Full 3D minigames (G17). */
  get sharedTex(): Tex {
    return this.tex;
  }

  get pool(): CreaturePool {
    return this.actors.pool;
  }

  /** What the debug panel reads: the backing-store size, at the device's ratio. */
  get currentSize(): TargetSize {
    return this.size;
  }

  /** The camera the input casts rays from, with the orbit's yaw for key directions. */
  cameraRig(orbit: OrbitCamera): { readonly currentYaw: number; readonly camera: THREE.Camera } {
    const cam = this.camera;
    // Keys move the Keeper relative to the view on screen, framed shots included.
    const offset = () => this.yawOffset;
    return {
      get currentYaw() {
        return orbit.currentYaw + offset();
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

  setDungeon(f: Floor | null, depth = 1): void {
    this.floor = f;
    this.hollow.set(f, depth);
    this.actors.floor = f;
    // A new floor may sit in a new depth band: relight now, not at the next daylight tick.
    if (this.dayArgs && this.location === 'dungeon') this.setDaylight(...this.dayArgs);
  }

  setDaylight(
    hour: number,
    d: Daylight,
    place: Location,
    weather: WeatherKind,
    particles: Particles,
  ): void {
    this.dayArgs = [hour, d, place, weather, particles];
    // A story scene that names its hour is lit at it (render/scene-stage.ts: stage.hour,
    // else its narration); the clock resumes after. Caves have no sky to stage.
    const staged = this.staging.hour;
    if (staged !== null) {
      hour = staged;
      d = daylightAt(staged);
    }
    this.drawnDay = d;
    const grove = place === 'grove';
    this.location = place;
    this.actors.location = place;
    // An exclusive stage (campaign graphics C3, C4) hides the Grove's whole world.
    this.world3d.visible = grove && !this.staging.exclusive;
    // A neighbour's Grove and the two story places get their dressed sets; anywhere else
    // off the home ground keeps the plain floor.
    const visiting = place.startsWith('visit:') ? place.slice('visit:'.length) : null;
    this.visit.show(visiting, this.tex);
    this.story.show(place);
    const cave = place === 'dungeon' || place === 'hollow';
    this.dungeonFloor.visible =
      !grove && !visiting && !this.story.showing && !(place === 'dungeon' && this.floor);
    this.actors.ground = grove ? standHeight : () => 0;
    this.sky.set(hour, d, grove ? weather : 'clear', this.camTarget);
    // Underground there is no sky: a mid-tone vault, a cool fill, the torches.
    this.sky.sky.visible = !cave;
    const band = bandFor(place === 'dungeon' ? (this.lastWorld?.dungeon?.depth ?? 1) : 1);
    if (cave) {
      // The cave light rig (Hollow recommendations items 2, 3, 8 and 21): the floor's depth
      // band colours a cool-over-warm fill, a coloured key and a mid-tone fog the distance
      // fades into, never black. Deeper floors dim, down to `depthFloor` of full.
      const light = place === 'dungeon' ? this.hollow.light : 0.6;
      const c = GROVE3D.cave.light;
      const k = c.depthFloor + (1 - c.depthFloor) * light;
      this.caveBg.set(band.background);
      this.scene.background = this.caveBg;
      this.scene.environmentIntensity = c.env * k;
      this.sky.sun.intensity = c.key * k;
      this.sky.sun.color.set(band.key);
      this.sky.hemi.intensity = c.hemi * k;
      this.sky.hemi.color.set(band.hemiSky);
      this.sky.hemi.groundColor.set(band.hemiGround);
      this.sky.fog.color.set(band.background);
      this.sky.fog.density = c.fogDensity;
      this.hollow.lamps.torchColor.set(band.torch);
    }
    // The creatures keep their contact shadows; the cave's sun shadow was a second draw of
    // every caster (about 150 calls in the great chamber) for a key light no one can see.
    const shadowOff = cave && !GROVE3D.cave.light.sunShadow;
    if (shadowOff !== this.caveShadowOff) {
      this.caveShadowOff = shadowOff;
      this.caveShadowCleared = false;
      const layers = this.sky.sun.shadow.camera.layers;
      if (shadowOff) this.sunShadowMask = layers.mask;
      layers.mask = shadowOff ? 1 << EMPTY_LAYER : this.sunShadowMask;
    }
    if (!cave) {
      this.scene.background = null;
      this.sky.hemi.groundColor.copy(this.hemiGround);
    }
    const elevation = this.sky.elevationDeg;
    // Bloom at dusk and night above ground, and always underground, whatever the hour (item
    // 3). The governor may still hold it off on a device short of CPU (`governRenderScale`).
    const c = GROVE3D.cave.light;
    this.bloomWanted = cave || elevation < GROVE3D.bloomBelowDeg;
    // Underground the governor sheds the cave list before any sharpness; above ground, not.
    this.governor.setShedSteps(cave ? caveShed.steps : 0);
    caveShed.apply(this.governor.shedLevel);
    this.bloom.enabled = this.bloomWanted && this.cpuApplied < 2 && !this.bloomShed;
    this.clamp.enabled = this.bloom.enabled;
    this.bloom.strength = cave ? c.bloom : elevation < -2 ? 0.25 : 0.35;
    this.bloom.threshold = cave ? c.bloomThreshold : BLOOM_THRESHOLD;
    this.renderer.toneMappingExposure = cave
      ? c.exposure
      : elevation < -2
        ? 0.6
        : elevation < GROVE3D.bloomBelowDeg
          ? 0.75
          : 0.68;
    this.grade.uniforms.uTint!.value.set(
      cave
        ? band.grade
        : elevation < -2
          ? '#c8d4ff'
          : elevation < GROVE3D.bloomBelowDeg
            ? '#fff2e2'
            : '#ffffff',
    );
    // Under rock: a stronger radial vignette and a darker top edge (item 21).
    const a = GROVE3D.cave.atmos;
    this.grade.uniforms.uVignette!.value = cave ? a.vignette : a.groundVignette;
    this.grade.uniforms.uTop!.value = cave ? a.top : 0;
    this.grade.uniforms.uTopFrom!.value = a.topFrom;
    // The Sun and Moon Groves are recolours, as in the pixel mode (cream and lavender on
    // the lit materials); here a grade over the whole frame. Corvin's rows are drained.
    // The Sun and Moon tints shift hue and keep luminance, held back on the grass (M15).
    const hue =
      grove && !this.staging.exclusive && this.groveKind === 'sun'
        ? GROVE3D.groveTint.sun
        : grove && !this.staging.exclusive && this.groveKind === 'moon'
          ? GROVE3D.groveTint.moon
          : '#ffffff';
    (this.grade.uniforms.uHue!.value as THREE.Color).set(hue);
    if (place === 'corvin')
      (this.grade.uniforms.uTint!.value as THREE.Color).multiply(
        new THREE.Color(GROVE3D.groveTint.corvin),
      );
    // Lamps come on with the pixel scene's rule: dusk, night, or a lit campaign lantern.
    this.lampsOn = d.lanterns || d.darkness > 0.5;
    // The glass glows on every lit lamp; the few point lights go to the nearest (`update`).
    const sources: LampSource[] = [];
    const at = (p: THREE.Vector3) => ({ x: p.x, y: p.y, z: p.z });
    for (const l of this.props.lanterns) {
      const on = this.lampsOn || this.lit.has(l.id);
      l.glass.emissiveIntensity = on ? 2.2 : 0;
      if (on)
        sources.push({ ...at(l.light), color: '#ffb347', intensity: 5, distance: 10, decay: 1.4 });
    }
    this.props.windows.material.emissiveIntensity = this.lampsOn ? 2.5 : 0;
    // The pools of lamplight on the ground come with the lamps (one additive mesh).
    this.props.spills.visible = this.lampsOn;
    (this.props.spills.material as THREE.MeshBasicMaterial).opacity = d.darkness > 0.5 ? 0.7 : 0.45;
    if (this.lampsOn) {
      for (const w of this.props.windows.lights)
        sources.push({ ...at(w), color: '#ffb347', intensity: 4, distance: 9, decay: 1.6 });
    }
    this.lampSources = sources;
    this.weather.set(grove, place, weather, d, particles);
    // Rain cools the grade a touch (it used to grey it to a wash; art pass 2) and snow
    // brightens and cools it, as the pixel post pass.
    const wet = grove && weather === 'rain';
    this.grade.uniforms.uSaturation!.value = wet ? GROVE3D.rain.saturation : GRADE_SATURATION;
    if (wet)
      (this.grade.uniforms.uTint!.value as THREE.Color).multiply(
        new THREE.Color(...GROVE3D.rain.tint),
      );
    else if (grove && weather === 'snow')
      (this.grade.uniforms.uTint!.value as THREE.Color).multiply(new THREE.Color(1.04, 1.06, 1.12));
  }

  snapshot(world: World): void {
    this.actors.snapshot(world);
  }

  keeperDrawPos(world: World, alpha: number): Vec2 {
    return this.actors.keeperDrawPos(world, alpha);
  }

  /**
   * Sim events, by the pixel view's `burstFor`: leaves from a shaken tree, dust where a
   * Nubbin lands, sparkles for a hatch, an evolution, a rebirth, Eternal, a cocoon and a
   * find, hearts for love, crumbs for a meal; the squash and pop; the shake; and reaction
   * bubbles. Heights are fractions of the body (feet to head), since 3D Nubbins vary.
   */
  onEvents(events: SimEvent[]): void {
    const ground = this.location === 'grove' ? standHeight : () => 0;
    const now = this.lastMs;
    const b = this.bursts;
    /** A point up a Nubbin's body: 0 at the feet, 1 at the head. */
    const up = (id: string, k: number): THREE.Vector3 | null => {
      const s = this.actors.nubbinSpot(id);
      return s ? s.feet.lerp(s.head, k) : null;
    };
    for (const e of events) {
      if (FOCUS_EVENTS.has(e.kind) && 'nubbinId' in e && this.location !== 'dungeon')
        this.focus = { id: e.nubbinId, untilMs: now + READ3D.focus.ms };
      if (e.kind === 'landed') this.actors.pop(e.nubbinId, 'squash', now);
      else if (e.kind === 'hatched' || e.kind === 'evolved' || e.kind === 'reborn')
        this.actors.pop(e.nubbinId, 'pop', now);
      if (e.kind === 'dungeonFound' || e.kind === 'chestOpened') {
        const p =
          e.kind === 'dungeonFound' && e.by
            ? this.actors.nubbinPosition(e.by)
            : this.actors.keeperPosition();
        if (p) this.sparkle(p.x, p.z);
        continue;
      }
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
      } else if (e.kind === 'reaction') {
        this.actors.react(e.nubbinId, bubbleFor(e.reaction), this.lastMs + UI.bubbleMs);
        const head = up(e.nubbinId, 1.05);
        if (!head) continue;
        if (e.reaction === 'love')
          b.burst('heart', head, 3, { spread: 0.3, speed: 0.1, rise: 0.6, lifeMs: 1100 }, now);
        else if (e.reaction === 'dizzy')
          b.burst('sparkle', head.setY(head.y + 0.2), 3, BURST.dizzy, now);
      } else if (e.kind === 'hatched' || e.kind === 'reborn' || e.kind === 'speciesGrew') {
        const at = up(e.nubbinId, 0.4);
        if (at) b.burst('sparkle', at, 14, BURST.hatch, now);
      } else if (e.kind === 'evolved' || e.kind === 'secondEvolved') {
        const at = up(e.nubbinId, 0.5);
        if (!at) continue;
        b.burst('sparkle', at, 24, BURST.evolve, now);
        b.burst('petal', at.setY(at.y + 0.4), 8, BURST.evolvePetals, now);
      } else if (e.kind === 'eternal') {
        const at = up(e.nubbinId, 0.3);
        if (at) b.burst('sparkle', at, 40, BURST.eternal, now);
      } else if (e.kind === 'cocoonStarted') {
        const at = up(e.nubbinId, 0.4);
        if (at) b.burst('sparkle', at, 8, BURST.cocoon, now);
      } else if (e.kind === 'ate') {
        const at = up(e.nubbinId, 0.6);
        if (at) b.burst('crumb', at, 4, BURST.crumbs, now);
      } else if (e.kind === 'collected') {
        const at = this.actors.itemPosition(e.itemId);
        if (at) b.burst('sparkle', at.setY(at.y + 0.3), 5, BURST.collected, now);
      } else if (e.kind === 'eggShaken') {
        const at = up(e.nubbinId, 0);
        if (at) b.burst('dust', at.setY(at.y + 0.05), 2, BURST.eggDust, now);
      }
    }
  }

  setHighlight(hit: { kind: string; id: string } | null): void {
    const key = hit ? `${hit.kind}:${hit.id}` : '';
    if (key === this.highlightKey) return;
    this.highlightKey = key;
    if (!hit || hit.kind === 'ground') {
      this.halo.show('', []);
      this.actors.setHighlight(null);
      return;
    }
    const { kind, id } = hit;
    // Still props (buildings, lanterns, decor, trees) get the pixel view's rim; everything
    // else gets the ground ring, which follows it.
    const parts = this.pickables.filter((o) => {
      const p = o.userData.pick as { kind: string; id: string } | undefined;
      return p?.kind === kind && p.id === id && o.visible && o !== this.terrain.mesh;
    });
    if (parts.length) {
      this.world3d.traverse((o) => {
        const h = o.userData.halo as { kind: string; id: string } | undefined;
        if (h?.kind === kind && h.id === id) parts.push(o);
      });
      this.halo.show(key, parts);
      this.actors.setHighlight(null);
      return;
    }
    this.halo.show('', []);
    this.actors.setHighlight(hit, () => this.garden.spot(kind, id) ?? this.hollow.spot(kind, id));
  }

  sparkle(x: number, z: number, y = 0.4): void {
    this.actors.sparkle(x, z, y, this.lastMs);
  }

  /**
   * A snapshot of a Nubbin in the 3D Grove for photo mode (review 2026-10-21, bug 19): the
   * camera steps in to frame it, one frame is drawn and copied out of the canvas in the same
   * task (so no preserved drawing buffer is needed), and the view is put back and drawn
   * again. `w` × `h` is the picture's size and shape; null when the Nubbin is not drawn.
   */
  portrait(id: string, w: number, h: number): HTMLCanvasElement | null {
    const spot = this.actors.nubbinSpot(id);
    if (!spot || !this.compiled) return null;
    const cam = this.camera;
    const pos = cam.position.clone();
    const quat = cam.quaternion.clone();
    const look = spot.feet.clone().lerp(spot.head, 0.75);
    const tall = Math.max(0.5, spot.head.y - spot.feet.y);
    // From the side the view already looks from, a little above, close enough that the
    // Nubbin fills the middle of the picture.
    // From in front of its face, turned a little toward where the view already looks
    // from, so the picture shows the Nubbin and not its back.
    const side = pos.clone().sub(look).setY(0);
    if (side.lengthSq() < 1e-6) side.set(0, 0, 1);
    side.normalize();
    const front = this.actors.nubbinFront(id);
    const dir = front ? front.multiplyScalar(2).add(side).normalize() : side;
    const dist = tall * 4.5 + 2;
    cam.position
      .copy(look)
      .addScaledVector(dir, dist)
      .setY(look.y + dist * 0.45);
    cam.lookAt(look);
    this.composer.render();
    const src = this.renderer.domElement;
    const out = document.createElement('canvas');
    out.width = w;
    out.height = h;
    const ctx = out.getContext('2d');
    if (ctx) {
      // The middle of the frame at the picture's shape.
      const k = Math.min(src.width / w, src.height / h);
      const sw = w * k;
      const sh = h * k;
      ctx.drawImage(src, (src.width - sw) / 2, (src.height - sh) / 2, sw, sh, 0, 0, w, h);
    }
    cam.position.copy(pos);
    cam.quaternion.copy(quat);
    this.composer.render();
    return ctx ? out : null;
  }

  /** Creatures under a screen point (NDC), nearest first. */
  pick(ndcX: number, ndcY: number): Pick3d | null {
    this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);
    const ray = this.raycaster.ray;
    const hits = [
      this.actors.pick(ray),
      this.garden.pick(ray),
      this.hollow.pick(ray, this.lastWorld?.dungeon ?? null),
    ].filter((h): h is NonNullable<typeof h> => !!h);
    hits.sort((a, b) => a.d - b.d);
    const h = hits[0];
    return h ? { kind: h.kind, id: h.id } : null;
  }

  /**
   * The sculpt grid for this device, as the torso resolution the save picked
   * (`settings.sculptRes`); every surface scales by the same share of its authored grid.
   * Set before the first `update`, which starts the build.
   */
  setSculptRes(res: number): void {
    this.actors.pool.quality = qualityForRes(res);
  }

  /** First run on a device: time a small march and pick the grid (see `sculpt-res.ts`). */
  pickSculptRes(): number {
    return pickSculptRes();
  }

  /** Start the opening creatures before the first frame (the frame builds the trees too). */
  prewarm(world: World): void {
    this.actors.warm(world);
  }

  /** How far the opening build has got, for the loading bar. */
  loadState(): { progress: number; done: boolean } {
    const a = this.actors.loadState();
    return {
      progress: a.progress * 0.8 + this.textures.progress * 0.15 + (this.compiled ? 0.05 : 0),
      done:
        a.done &&
        this.textures.done &&
        this.terrain.ready &&
        this.props.grass.ready &&
        this.sky.ready &&
        this.compiled,
    };
  }

  /** Build the trees once the world is known, so taps reach the sim's tree ids. */
  private ensureTrees(world: World): void {
    if (this.treesBuilt) return;
    this.treesBuilt = true;
    for (const t of world.trees) this.treeAt.set(t.id, { x: t.pos.x, z: t.pos.z });
    for (const t of buildGroveTrees(this.world3d, this.tex, world.trees, this.pickables, this.time))
      this.crowns.add(t);
    this.actors.warm(world);
  }

  /**
   * The shot this frame wants. A key moment: look mostly at the Nubbin, closer and lower,
   * from its side of the Keeper and a little off the line between them, so the Nubbin
   * stands in front and the Keeper beside it, never in the way; the turn is capped so the
   * view never swings round wholesale. A story scene: the Keeper and the speakers present,
   * the distance opening with how far apart they stand. Otherwise the player's orbit.
   */
  private shot(world: World, orbit: OrbitCamera): Shot {
    const base: Shot = {
      kind: 'orbit',
      x: orbit.target.x,
      z: orbit.target.z,
      yaw: orbit.currentYaw,
      pitchDeg: GROVE3D.pitchDeg,
      distance: GROVE3D.distance[orbit.currentZoomIndex] ?? GROVE3D.distance[0],
      points: [],
      lookUp: 0,
    };
    const f = READ3D.focus;
    const focus = this.focus;
    const subject =
      focus && this.lastMs < focus.untilMs && this.location !== 'dungeon'
        ? this.actors.nubbinPosition(focus.id)
        : null;
    if (!subject) this.focus = null;
    if (subject) {
      const k = orbit.target;
      const dx = subject.x - k.x;
      const dz = subject.z - k.z;
      let yaw = orbit.currentYaw;
      if (Math.hypot(dx, dz) > 0.3) {
        const line = Math.atan2(dx, dz);
        const turn = (a: number) => Math.atan2(Math.sin(a - yaw), Math.cos(a - yaw));
        const a = turn(line + f.sideRad);
        const b = turn(line - f.sideRad);
        const d = Math.abs(a) < Math.abs(b) ? a : b;
        yaw += THREE.MathUtils.clamp(d, -f.maxTurnRad, f.maxTurnRad);
      }
      return {
        kind: 'focus',
        x: THREE.MathUtils.lerp(k.x, subject.x, f.towardSubject),
        z: THREE.MathUtils.lerp(k.z, subject.z, f.towardSubject),
        yaw,
        pitchDeg: f.pitchDeg,
        // A phone held upright frames the pair from further back, or one falls off the side.
        distance: Math.min(base.distance, f.distance * (this.camera.aspect < 1 ? 1.3 : 1)),
        points: [subject],
        // Looking a little over the Nubbin puts it low on screen, clear of the evolution
        // or hatch card the HUD shows in the middle.
        lookUp: f.lookUp,
      };
    }
    if (!this.staging.active) return base;
    return this.stageShot(world, base);
  }

  /**
   * A story scene's shot (H8): `two` (the default) frames the Keeper and the speakers;
   * `wide` stands back; `establish` dollies in to the wide shot over 2 s (a cut under
   * reduced motion); `close` frames the speaker on the near zoom; `over` looks past the
   * Keeper's shoulder at the speaker. `stage.shot.yaw` sets the side (radians, world).
   * The lift clear of the dialogue box is applied in `update`.
   */
  private stageShot(world: World, base: Shot): Shot {
    const st = this.staging;
    const kind = st.shotKind() ?? 'two';
    // H5: the push-in after the first line eases from the first shot (a cut under reduced
    // motion). The first shot is worked out first, so the pushed shot's facings stand.
    const first = st.stage.shot?.kind;
    const t =
      st.pushedMs !== null && first && first !== kind && !this.reduceMotion
        ? THREE.MathUtils.clamp((this.lastMs - st.pushedMs) / (STAGE2.pushS * 1000), 0, 1)
        : 1;
    let shot = this.stageShotFor(world, base, kind);
    // The shot held before the push is the one to ease from (its framing has changed since).
    if (st.pushedMs === null) this.prePush = shot;
    else if (t < 1 && this.prePush)
      shot = mixShot(this.prePush, shot, THREE.MathUtils.smootherstep(t, 0, 1));
    // K9: two speakers alternating cut to an over-the-shoulder of the listener, both cuts
    // from the same side of the pair's line (the 180-degree rule).
    const rv = STAGE4.reverse;
    const rev = st.reverse(world, base.yaw, rv.sideRad);
    const revKey = rev ? `${rev.speaker}|${rev.listener}` : '';
    if (revKey !== this.reverseKey) {
      this.reverseKey = revKey;
      this.reverseCut = true;
    }
    this.reverseYaw = rev ? rev.yaw : null;
    if (rev) {
      const s = READ3D.stage;
      shot = {
        ...shot,
        x: THREE.MathUtils.lerp(rev.from.x, rev.at.x, rv.toward),
        z: THREE.MathUtils.lerp(rev.from.z, rev.at.z, rv.toward),
        yaw: rev.yaw,
        distance: s.overDistance * (this.camera.aspect < 1 ? 1.25 : 1),
        pitchDeg: s.overPitchDeg,
        points: [rev.from, { ...rev.at, speaker: true }],
        fitted: false,
      };
    }
    // K15: a grave moment pushes in slowly over 2 s (straight to the end under reduced motion).
    if (st.grave && shot.kind === 'stage') {
      const g = STAGE4.grave;
      const t = this.reduceMotion
        ? 1
        : THREE.MathUtils.clamp((this.lastMs - st.startedMs) / (g.pushS * 1000), 0, 1);
      shot = {
        ...shot,
        distance:
          shot.distance * THREE.MathUtils.lerp(1, g.pushK, THREE.MathUtils.smootherstep(t, 0, 1)),
      };
    }
    // Review fix 3: whoever speaks the line on screen stands inside the HUD-safe area; a shot
    // that leaves them out is fitted again round its points and the speaker.
    const spk = this.speakerSpot(world);
    if (spk && shot.kind === 'stage' && !this.inSafe(shot, spk)) {
      const pts: FitPoint[] = [...shot.points, { ...spk, speaker: true }];
      const f = this.fitShot(pts, shot.yaw, shot.pitchDeg, (x, z) =>
        this.location === 'grove' ? standHeight(x, z) : 0,
      );
      shot = { ...shot, ...f, points: pts, fitted: true };
    }
    // A phone held upright: never pull out to the whole map, unless the shot is fitted.
    if (shot.kind === 'stage' && this.camera.aspect < 1 && !shot.fitted)
      shot.distance = Math.min(shot.distance, READ3D.stage.portraitMaxDistance);
    return shot;
  }

  /** Where whoever speaks the line on screen is drawn, or null (the narrator, the Keeper). */
  private speakerSpot(world: World): Vec2 | null {
    const who = this.staging.speaker;
    if (!who || who === 'narrator' || speaksAsKeeper(world, who, this.staging.stage)) return null;
    return this.staging.spotOf(world, who);
  }

  /** Whether `p` (feet and head) falls inside the HUD-safe area seen from `shot`. */
  private inSafe(shot: Shot, p: Vec2): boolean {
    const { rect, view } = this.safeArea();
    const cam = this.fitCam;
    cam.fov = this.camera.fov;
    cam.aspect = this.camera.aspect;
    cam.near = this.camera.near;
    cam.far = this.camera.far;
    cam.updateProjectionMatrix();
    const pitch = THREE.MathUtils.degToRad(shot.pitchDeg);
    const ground = (x: number, z: number) => (this.location === 'grove' ? standHeight(x, z) : 0);
    const ty = ground(shot.x, shot.z) + GROVE3D.lookHeight + shot.lookUp;
    let x = shot.x;
    let z = shot.z;
    if (!shot.fitted) {
      // The lift clear of the dialogue box that `update` applies.
      const visH = 2 * shot.distance * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
      const g = (READ3D.stage.boxLift * visH) / Math.max(0.2, Math.sin(pitch));
      x += Math.sin(shot.yaw) * g;
      z += Math.cos(shot.yaw) * g;
    }
    cam.position.set(
      x + Math.sin(shot.yaw) * Math.cos(pitch) * shot.distance,
      ty + Math.sin(pitch) * shot.distance,
      z + Math.cos(shot.yaw) * Math.cos(pitch) * shot.distance,
    );
    cam.lookAt(x, ty, z);
    cam.updateMatrixWorld();
    const x0 = ((rect.x - view.x) / view.w) * 2 - 1;
    const x1 = ((rect.x + rect.w - view.x) / view.w) * 2 - 1;
    const y1 = 1 - ((rect.y - view.y) / view.h) * 2;
    const y0 = 1 - ((rect.y + rect.h - view.y) / view.h) * 2;
    const g = ground(p.x, p.z);
    for (const h of [0.1, 1.6]) {
      const v = new THREE.Vector3(p.x, g + h, p.z).project(cam);
      if (v.z > 1 || v.x < x0 || v.x > x1 || v.y < y0 || v.y > y1) return false;
    }
    return true;
  }

  /** The HUD-safe rect and the view, read from the DOM at most four times a second. */
  private safeArea(): { rect: ScreenRect; view: ScreenRect } {
    if (!this.safe || this.lastMs - this.safe.atMs > 250 || this.lastMs < this.safe.atMs)
      this.safe = { atMs: this.lastMs, rect: safeRect(), view: viewRect() };
    return this.safe;
  }

  /**
   * H4, K3: the look point and distance that fit `points` inside the HUD-safe area at this
   * yaw and pitch (`fitShot3d` in fit-shot.ts, weighted). Kept while the points, the angles
   * and the safe area stay the same; the points it kept are on `fitKept` for the inspector.
   */
  private fitShot(
    points: FitPoint[],
    yaw: number,
    pitchDeg: number,
    ground: (x: number, z: number) => number,
  ): { x: number; z: number; distance: number } {
    const { rect, view } = this.safeArea();
    const safe = safeNdc(rect, view);
    const key = [
      ...points.map((p) => `${p.x.toFixed(2)},${p.z.toFixed(2)},${p.w ?? 1},${p.speaker ? 1 : 0}`),
      yaw.toFixed(3),
      pitchDeg,
      this.camera.aspect.toFixed(3),
      safe.sx0.toFixed(3),
      safe.sx1.toFixed(3),
      safe.sy0.toFixed(3),
      safe.sy1.toFixed(3),
    ].join('|');
    if (this.fitCache?.key === key) return this.fitCache;
    const f = fitShot3d(points, yaw, pitchDeg, this.camera, safe, ground, this.fitCam);
    this.fitCache = { key, x: f.x, z: f.z, distance: f.distance };
    this.fitKept = f.kept;
    return this.fitCache;
  }

  /**
   * Who a shot frames. On a phone held upright, a cast spread too wide for the capped
   * distance is narrowed: first without the Keeper (a two-shot on the speakers), then to
   * whoever speaks now and the one nearest them.
   */
  private framedPoints(world: World, points: Vec2[]): Vec2[] {
    if (this.camera.aspect >= 1 || points.length < 3) return points;
    const s = READ3D.stage;
    const fits = (pts: Vec2[]) => {
      const cx = pts.reduce((a, p) => a + p.x, 0) / pts.length;
      const cz = pts.reduce((a, p) => a + p.z, 0) / pts.length;
      const spread = Math.max(...pts.map((p) => Math.hypot(p.x - cx, p.z - cz)));
      return spread <= s.portraitSpread;
    };
    if (fits(points)) return points;
    const speakers = points.slice(1);
    if (fits(speakers)) return speakers;
    const who = this.staging.speaker;
    const now = who && who !== 'narrator' ? this.staging.spotOf(world, who) : null;
    const a = now ?? speakers[0]!;
    const others = points.filter((p) => p !== a && (p.x !== a.x || p.z !== a.z));
    others.sort((p, q) => Math.hypot(p.x - a.x, p.z - a.z) - Math.hypot(q.x - a.x, q.z - a.z));
    return others[0] ? [a, others[0]] : [a];
  }

  private stageShotFor(world: World, base: Shot, kind: string): Shot {
    const st = this.staging.stage.shot;
    const all = this.staging.frame(world);
    if (all.length < 2 && !st) return base;
    const points = this.framedPoints(world, this.staging.subjects(world));
    const s = READ3D.stage;
    const cx = points.reduce((a, p) => a + p.x, 0) / points.length;
    const cz = points.reduce((a, p) => a + p.z, 0) / points.length;
    const spread = Math.max(...points.map((p) => Math.hypot(p.x - cx, p.z - cz)));
    const two: Shot = {
      ...base,
      kind: 'stage',
      x: cx,
      z: cz,
      yaw: st?.yaw ?? base.yaw,
      // A phone held upright sees less across: stand back by how much narrower it is.
      distance: Math.max(
        s.minDistance,
        (spread * s.spreadK) / Math.min(1, Math.max(0.5, this.camera.aspect)) + 4,
      ),
      points,
    };
    const k = all[0]!;
    // Whoever speaks the line on screen comes first, then the shot's own focus.
    const now = this.speakerSpot(world);
    const who = st?.focus?.[0];
    const focusSpot =
      who && who !== 'narrator' && !speaksAsKeeper(world, who, this.staging.stage)
        ? this.staging.spotOf(world, who)
        : null;
    const sp = now ?? focusSpot ?? all[1] ?? k;
    const portrait = this.camera.aspect < 1 ? 1.25 : 1;
    // Review fix 2: of the 45° steps from the player's yaw, the one that sees the cast past
    // the houses (the nearest step that hides fewest).
    const wideKind = kind === 'establish' || kind === 'wide';
    const pitchR = THREE.MathUtils.degToRad(base.pitchDeg + (wideKind ? 6 : 0));
    const obstacles = stageObstacles(world, (id) => this.buildings3d.isHidden(id));
    const seen = now ? [...points, now] : points;
    const clear = (cands: number[]) =>
      clearYaw(cands, seen, { x: cx, z: cz }, pitchR, two.distance, obstacles);
    if (st?.yaw === undefined) two.yaw = clear(yawSteps(base.yaw));
    // H4: an establishing or wide shot fits its focus inside the HUD-safe area.
    const fit =
      (kind === 'establish' || kind === 'wide') && (st?.fit ?? true)
        ? this.fitShot(points, two.yaw, base.pitchDeg + 6, (x, z) =>
            this.location === 'grove' ? standHeight(x, z) : 0,
          )
        : null;
    // H7: a two-shot of the Keeper and one speaker is framed from the side, and both turn
    // a little to the camera, so both faces show three-quarter.
    let side: number | null = null;
    if (kind === 'two' && st?.yaw === undefined && sp !== k) {
      const line = Math.atan2(sp.x - k.x, sp.z - k.z);
      const turn = (a: number) =>
        Math.abs(Math.atan2(Math.sin(a - base.yaw), Math.cos(a - base.yaw)));
      const a = line + STAGE2.twoSideRad;
      const b = line - STAGE2.twoSideRad;
      // The fallback steps never look along the pair's line: one would stand in front of
      // the other (Marigold behind the Keeper, Dawn & Dusk ch6; campaign graphics 3).
      const steps = yawSteps(two.yaw).filter((y) => Math.abs(Math.sin(y - line)) > 0.5);
      side = turn(a) < turn(b) ? clear([a, b, ...steps]) : clear([b, a, ...steps]);
    }
    this.staging.turnFaces(side, side === null ? 0 : STAGE2.faceTurnRad);
    switch (kind) {
      case 'wide':
        if (fit) return { ...two, ...fit, pitchDeg: base.pitchDeg + 6, fitted: true };
        return { ...two, distance: two.distance * s.wideK, pitchDeg: base.pitchDeg + 6 };
      case 'establish': {
        const t = this.reduceMotion
          ? 1
          : THREE.MathUtils.clamp((this.lastMs - this.staging.startedMs) / s.establishMs, 0, 1);
        const e = 1 - (1 - t) ** 3;
        const wide = fit ? fit.distance : two.distance * s.wideK;
        return {
          ...two,
          ...(fit ? { x: fit.x, z: fit.z, fitted: true } : {}),
          distance: wide * THREE.MathUtils.lerp(s.establishFrom, 1, e),
          pitchDeg: base.pitchDeg + 6,
        };
      }
      case 'close':
        return {
          ...two,
          x: THREE.MathUtils.lerp(k.x, sp.x, s.closeToward),
          z: THREE.MathUtils.lerp(k.z, sp.z, s.closeToward),
          distance: (GROVE3D.distance[GROVE3D.distance.length - 1] ?? 8.5) * portrait,
          points: [k, sp],
        };
      case 'over': {
        // Behind the Keeper on the line from the speaker, a little round to one side.
        const line = Math.atan2(k.x - sp.x, k.z - sp.z) + s.overSideRad;
        return {
          ...two,
          x: THREE.MathUtils.lerp(k.x, sp.x, 0.6),
          z: THREE.MathUtils.lerp(k.z, sp.z, 0.6),
          yaw: st?.yaw ?? line,
          distance: s.overDistance * portrait,
          pitchDeg: s.overPitchDeg,
          points: [k, sp],
        };
      }
      default:
        return side === null ? two : { ...two, yaw: side };
    }
  }

  update(world: World, orbit: OrbitCamera, alpha: number, nowMs: number): void {
    // Never negative: a clock that steps back (a resumed tab, a hand-driven frame) would
    // turn the eased camera into NaN, and NaN never recovers.
    const dt = this.lastMs === 0 ? 0 : Math.max(0, Math.min(0.1, (nowMs - this.lastMs) / 1000));
    this.lastMs = nowMs;
    this.time.value = nowMs / 1000;
    this.village.update(townUnlocks(world));
    this.ensureTrees(world);
    this.groveKind = world.grove;
    this.lastWorld = world;
    this.actors.update(world, alpha, nowMs, dt, this.camPos);
    const home = this.location === 'grove';
    this.garden.update(world, standHeight, nowMs, home);
    const run = this.location === 'dungeon' ? world.dungeon : null;
    // Last frame's camera is close enough to judge which walls stand in the way.
    const party = run
      ? world.nubbins.filter((n) => run.party.includes(n.id)).map((n) => n.pos)
      : [];
    this.hollow.lamps.reduceMotion = this.reduceMotion;
    this.hollow.update(run, world.keeper.pos, nowMs / 1000, this.camPos, party);

    // The Lakitu camera: orbit the Keeper at the snapped yaw, eased, never underground.
    // A key moment frames its Nubbin instead, and a story scene its speakers (bugs 10, 11).
    const ground = this.location === 'grove' ? standHeight : () => 0;
    // Reduced motion: the camera cuts to where it is going instead of gliding there.
    const snap = dt === 0 || this.reduceMotion;
    // A story scene cuts in at once: the render pauses behind the dialogue box soon after.
    this.staging.speaker = this.storySpeaker;
    const stageCut = this.staging.update(world, nowMs);
    this.staging.noteLine(this.storyLine, nowMs, this.storySpeaker);
    if (stageCut) {
      // Campaign graphics 2: sets build late, so look again; a set hides the Grove-only
      // buildings and an exclusive stage hides the world (`setDaylight`) and every building.
      this.buildings3d.discover();
      this.buildings3d.stageHidden = new Set(stageHides(this.staging.stage));
      this.buildings3d.stageHidesAll = this.staging.exclusive;
      this.fitCache = null;
      this.fitKept = [];
      this.prePush = null;
    }
    this.actors.keeperHold = this.staging.active ? this.staging.keeperHold : null;
    this.actors.nubbinHolds = this.staging.active ? this.staging.nubbinHolds : null;
    this.actors.stager = this.staging.active ? this.staging : null;
    this.reverseCut = false;
    const shot = this.shot(world, orbit);
    // K9: a speaker change in an exchange is a cut, like a new scene.
    const cut = stageCut || this.reverseCut;
    const ease = (rate: number) => (snap ? 1 : 1 - Math.exp(-rate * dt));
    if (stageCut) {
      if (this.dayArgs) this.setDaylight(...this.dayArgs);
      this.blend = shot.kind === 'stage' ? 1 : this.blend;
    }
    const goal = shot.kind === 'orbit' ? 0 : 1;
    this.blend += (goal - this.blend) * ease(3);
    if (Math.abs(this.blend - goal) < 0.001) this.blend = goal;
    if (shot.kind !== 'orbit') this.lastShot = shot;
    const b = this.blend;
    const s = this.lastShot ?? shot;
    let dyaw = 0;
    if (b > 0) {
      // Turn the shortest way to the shot's yaw, as an offset over the player's own yaw.
      dyaw = Math.atan2(Math.sin(s.yaw - orbit.currentYaw), Math.cos(s.yaw - orbit.currentYaw));
    }
    this.yawOffset += (dyaw * b - this.yawOffset) * (cut ? 1 : ease(4));
    const tx = THREE.MathUtils.lerp(orbit.target.x, s.x, b);
    const tz = THREE.MathUtils.lerp(orbit.target.z, s.z, b);
    const ty = ground(tx, tz) + GROVE3D.lookHeight + s.lookUp * b;
    this.camTarget.x = tx;
    this.camTarget.z = tz;
    this.camTarget.y += (ty - this.camTarget.y) * (snap || cut ? 1 : 1 - Math.exp(-6 * dt));
    const yaw = orbit.currentYaw + this.yawOffset;
    const cave = this.location === 'dungeon';
    const basePitch = cave ? READ3D.hollow.pitchDeg : GROVE3D.pitchDeg;
    const baseDist =
      (GROVE3D.distance[orbit.currentZoomIndex] ?? GROVE3D.distance[0]) *
      (cave ? READ3D.hollow.distanceK : 1);
    const pitch = THREE.MathUtils.degToRad(THREE.MathUtils.lerp(basePitch, s.pitchDeg, b));
    const dist = THREE.MathUtils.lerp(baseDist, s.distance, b);
    if (s.kind === 'stage' && b > 0 && !s.fitted) {
      // H8: the dialogue box covers the bottom of the frame, so slide the rig toward the
      // camera along the ground until the subjects sit `boxLift` of the frame higher.
      const visH = 2 * dist * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
      const g = ((READ3D.stage.boxLift * visH) / Math.max(0.2, Math.sin(pitch))) * b;
      this.camTarget.x += Math.sin(yaw) * g;
      this.camTarget.z += Math.cos(yaw) * g;
    }
    const want = new THREE.Vector3(
      this.camTarget.x + Math.sin(yaw) * Math.cos(pitch) * dist,
      this.camTarget.y + Math.sin(pitch) * dist,
      this.camTarget.z + Math.cos(yaw) * Math.cos(pitch) * dist,
    );
    const k = 1 - Math.exp(-9 * dt);
    this.camPos.lerp(want, snap || cut ? 1 : k);
    this.dressLamps.length = 0;
    this.dressings.update(world, this.staging.stage, this.drawnDay, dt);
    this.buildings3d.apply();
    this.actors.keeperFace = this.staging.keeperFaceNow(world, orbit.currentYaw + this.yawOffset);
    this.lamps.place(
      this.dressLamps.length > 0 ? [...this.lampSources, ...this.dressLamps] : this.lampSources,
      this.camTarget,
    );
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
    // K21: the close and over-the-shoulder shots blur what is past the speaker.
    this.dof.setShot(
      this.staging.active &&
        (this.staging.shotKind() === 'close' ||
          this.staging.shotKind() === 'over' ||
          this.reverseYaw !== null),
      this.camera.position.distanceTo(this.camTarget),
      dt,
      this.reduceMotion,
    );
    // What the crowns, trunks and lantern posts keep clear of: the Keeper's middle and head
    // (the orbit target), and the focused Nubbin or the speakers, when there are any.
    const [mid, head] = this.keeperMarks as [THREE.Vector3, THREE.Vector3];
    const kp = orbit.target;
    mid.set(kp.x, ground(kp.x, kp.z) + GROVE3D.lookHeight, kp.z);
    head.copy(mid).setY(mid.y + 0.7);
    const targets = [mid, head];
    const subject = this.focus ? this.actors.nubbinSpot(this.focus.id) : null;
    const [sFeet, sHead] = this.subjectMarks as [THREE.Vector3, THREE.Vector3];
    if (subject) {
      sFeet.copy(subject.feet).lerp(subject.head, 0.35);
      sHead.copy(subject.head);
      targets.push(sFeet, sHead);
    } else if (shot.kind === 'stage') {
      for (const p of shot.points.slice(1, 4))
        targets.push(new THREE.Vector3(p.x, ground(p.x, p.z) + GROVE3D.lookHeight, p.z));
    }
    // The crowns thin only in a circle round the Keeper on screen (see crowns.ts), and
    // round the focused Nubbin too.
    const buf = this.renderer.getDrawingBufferSize(this.holeSize);
    const onScreen = this.holeNdc.copy(mid).lerp(head, 0.5).project(this.camera);
    CrownFade.setHole(
      (onScreen.x * 0.5 + 0.5) * buf.x,
      (onScreen.y * 0.5 + 0.5) * buf.y,
      buf.y * GROVE3D.crownFade.holeRadius,
    );
    if (subject) {
      const at = this.holeNdc.copy(sFeet).lerp(sHead, 0.5).project(this.camera);
      CrownFade.setHole2(
        (at.x * 0.5 + 0.5) * buf.x,
        (at.y * 0.5 + 0.5) * buf.y,
        buf.y * GROVE3D.crownFade.holeRadius,
      );
    } else CrownFade.setHole2(0, 0, 0);
    this.crowns.update(this.camera.position, targets, dt);
    if (this.location.startsWith('visit:'))
      this.visit.crowns.update(this.camera.position, this.keeperMarks, dt);
    this.halo.update(this.time.value);
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
    this.water.update(this.time.value, this.sky.sun, this.sky.hemi);
    this.sky.tick(this.time.value);
    PARTICLE_TIME.value = this.time.value;
    this.weather.update(world, this.treeAt.values(), dt, this.time.value, this.camTarget);
  }

  render(): void {
    if (!this.compiled) {
      this.compileScene();
      return;
    }
    const t0 = performance.now();
    const interval = t0 - (this.lastRenderMs || t0);
    const dt = Math.min(100, interval);
    this.lastRenderMs = t0;
    // A place whose light set is not linked yet (the first trip down the stairs, if the
    // background warm-up has not finished): keep the last frame up, dim it after a beat,
    // and draw again once the programs are ready, rather than stall on linking them.
    const set = this.lightSet();
    const hold = !this.warmed.has(set);
    if (hold) void this.warm(set);
    this.holdMs = hold ? this.holdMs + dt : 0;
    const { delayMs, ms } = GROVE3D.placeFade;
    const step = dt / ms;
    this.fade =
      hold && this.holdMs > delayMs ? Math.min(1, this.fade + step) : Math.max(0, this.fade - step);
    this.canvas.style.filter = this.fade > 0 ? `brightness(${(1 - this.fade).toFixed(3)})` : '';
    if (hold) return;
    this.governRenderScale(this.composer, interval);
    this.dof.tick(interval);
    // One reset per frame with `autoReset` off, so the debug panel sums every composer pass.
    this.renderer.info.reset();
    this.composer.render();
    this.frameMs.push(performance.now() - t0);
    if (this.frameMs.length > 120) this.frameMs.shift();
  }

  /**
   * Link every program the Grove needs before its first frame, without blocking: with
   * KHR_parallel_shader_compile the driver compiles in the background while the page
   * keeps running, where a first `render` stalled on the whole set. The first call comes
   * after the first `update`, so the trees are in. Compiled against the composer's
   * target, where the scene is drawn (as for the creatures, see the constructor).
   */
  private compileScene(): void {
    if (this.compiling) return;
    this.compiling = true;
    // The post chain's full-screen materials too, bloom's included (it wakes at golden
    // hour). Each draws into one of the composer's targets; the last pass also draws to
    // the screen, which takes its own program, so its materials compile both ways.
    // The composer's own full-screen triangle (position and uv, no normals): the
    // attributes are part of a program's key.
    const quad = new THREE.BufferGeometry();
    quad.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3),
    );
    quad.setAttribute('uv', new THREE.Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2));
    const post = new THREE.Scene();
    const screen = new THREE.Scene();
    const passes = this.composer.passes;
    for (const pass of passes)
      for (const v of Object.values(pass) as unknown[])
        for (const m of Array.isArray(v) ? (v as unknown[]) : [v])
          if (m instanceof THREE.Material) {
            post.add(new THREE.Mesh(quad, m));
            if (pass === passes[passes.length - 1]) screen.add(new THREE.Mesh(quad, m));
          }
    const prev = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(this.composer.readBuffer);
    const done = [
      this.renderer.compileAsync(this.scene, this.camera),
      this.renderer.compileAsync(post, this.camera),
    ];
    this.renderer.setRenderTarget(null);
    done.push(this.renderer.compileAsync(screen, this.camera));
    this.renderer.setRenderTarget(prev);
    void Promise.all(done)
      .catch((err: unknown) => {
        // A program that will not link in the background still gets its chance in the
        // first frame; the Grove must open either way, never wait on this for ever.
        console.warn('Grove: shader warm-up failed.', err);
      })
      .then(() => {
        quad.dispose();
        this.compiled = true;
        this.warmed.add(this.lightSet());
        // Then, in the background, the other places' sets, the Hollow Below's first (a game
        // that boots in a story place or a visit still needs the Grove's for the way home).
        void this.warm('cave')
          .then(() => this.warm('plain'))
          .then(() => this.warm('grove'))
          .then(() => this.warm('groveNight'));
      });
  }

  /** The light set the scene is in right now (see `LightSet`). */
  private lightSet(): LightSet {
    if (this.world3d.visible) return this.lamps.on ? 'groveNight' : 'grove';
    return this.hollow.lit ? 'cave' : 'plain';
  }

  /**
   * Compile `objects` as they would be drawn with `set`'s lights, without blocking: the
   * Grove's lanterns sit in `world3d`, so hiding it drops them; the lamps are switched in
   * for the cave. Both are put back before this returns, so no frame sees the change.
   */
  private compileAs(set: LightSet, objects: THREE.Object3D[]): Promise<unknown> {
    const shown = this.world3d.visible;
    this.world3d.visible = set === 'grove' || set === 'groveNight';
    const prev = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(this.composer.readBuffer);
    const fog = this.scene.fog;
    try {
      return this.lamps.withOn(set === 'groveNight', () =>
        this.hollow.withLamps(set === 'cave', () => {
          const done = objects.map((o) => this.renderer.compileAsync(o, this.camera, this.scene));
          // The shadow pass draws its depth with no fog.
          this.scene.fog = null;
          done.push(this.renderer.compileAsync(this.hollow.shadowSamples, this.camera, this.scene));
          return Promise.all(done);
        }),
      );
    } finally {
      this.scene.fog = fog;
      this.renderer.setRenderTarget(prev);
      this.world3d.visible = shown;
    }
  }

  /** Link `set`'s programs for everything it can show; once per set. */
  private warm(set: LightSet): Promise<void> {
    let p = this.warms.get(set);
    if (!p) {
      // Off the home ground the Grove's own props are hidden, so they are left out.
      const objects =
        set === 'grove' || set === 'groveNight'
          ? [this.scene]
          : this.scene.children.filter((c) => c !== this.world3d);
      // A failed warm-up still counts as warm: the first frame compiles what is left, where
      // waiting would hold the place dark for good.
      p = this.compileAs(set, objects).then(
        () => void this.warmed.add(set),
        (err: unknown) => {
          console.warn('Grove: shader warm-up failed.', err);
          this.warmed.add(set);
        },
      );
      this.warms.set(set, p);
    }
    return p;
  }

  /**
   * Feed the governor one frame interval and apply its render scale to the renderer and to
   * `composer` (the Grove's, or a minigame stage's on the same renderer).
   */
  governRenderScale(composer: EffectComposer, intervalMs: number): void {
    const r = this.governor.sample(intervalMs);
    caveShed.apply(this.governor.shedLevel);
    if (r !== null) {
      this.renderer.setPixelRatio(r);
      const css = this.renderer.getSize(new THREE.Vector2());
      this.size = { width: Math.round(css.x * r), height: Math.round(css.y * r), scale: 1 / r };
    }
    // The CPU savings, cheapest to lose first: the creature outlines (a second draw of every
    // outlined part), then the second grass pass and the dusk bloom's passes, then most of
    // the shadow redraws. None of them changes a program, so a step never stalls.
    const level = this.governor.cpuLevel;
    if (level !== this.cpuApplied) {
      this.cpuApplied = level;
      setOutlines(level < 1);
      const second = this.props.grass.meshes[1];
      if (second) second.visible = level < 2;
      this.bloom.enabled = this.bloomWanted && level < 2 && !this.bloomShed;
      this.clamp.enabled = this.bloom.enabled;
    }
    // Under strain the sun's shadow map is redrawn every second frame (every fourth at the
    // last CPU step): it is a second draw of every caster, and a frame late is not visible
    // at that frame rate.
    const shadows = this.renderer.shadowMap;
    const strained = this.governor.ratio < this.governor.maxRatio || level > 0;
    if (this.caveShadowOff) {
      // Underground: clear the map once (nothing is on its layer), then never redraw it.
      shadows.autoUpdate = false;
      if (!this.caveShadowCleared) shadows.needsUpdate = this.caveShadowCleared = true;
    } else {
      shadows.autoUpdate = !strained;
      if (strained) shadows.needsUpdate = (this.shadowTick++ & (level >= 3 ? 3 : 1)) === 0;
    }
    const pr = this.renderer.getPixelRatio();
    if (this.composerRatio.get(composer) !== pr) {
      composer.setPixelRatio(pr);
      this.composerRatio.set(composer, pr);
    }
  }

  resize(width: number, height: number): TargetSize {
    const w = Math.max(1, Math.floor(width));
    const h = Math.max(1, Math.floor(height));
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.fov = fovFor(w / h);
    this.camera.updateProjectionMatrix();
    const pr = this.renderer.getPixelRatio();
    this.size = { width: Math.round(w * pr), height: Math.round(h * pr), scale: 1 / pr };
    return this.size;
  }

  dispose(): void {
    this.dressings.dispose();
    this.actors.dispose();
    this.bursts.dispose();
    this.sky.dispose();
    this.composer.dispose();
    this.renderer.dispose();
  }
}
