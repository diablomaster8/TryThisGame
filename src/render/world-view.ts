import { STALL_SPOTS } from '../config/grove-layout';
import { memorialSpot } from './memorial-spot';
import { Vector3 } from 'three';
import { Y_STATE } from './dress-y-state';
import { LOOK_STATE, nubbinSits, storyId } from '../config/npc-looks';
import { DUNGEON, EGG, LIFECYCLE, UI } from '../config/tuning';
import { childHint } from '../sim/alignment';
import { moodOf } from '../sim/needs';
import { flaps, swimsStroke } from '../sim/stats';
import type { DungeonRun, Location, Nubbin, SimEvent, Vec2, World } from '../sim/types';
import { cellCentre, runFloor, type Cell, type Floor } from '../sim/dungeon';
import { keeperDip, keeperFooting, keeperGliding, keeperMantle, keeperRoll } from '../sim/keeper';
import { buildParticleSheet } from './sprites/particles-art';
import { deckY, groveHeight, hillHeight, WATER_LEVEL } from '../sim/terrain';
import { KEEPER_WADE, KEEPER_ACCEL, JUMP } from '../config/tuning-sim';
import {
  BUSH,
  FOOTFALL,
  JUMP_TOYS,
  KEEPER_JUMP_FX,
  POND_DIP,
  RUN_MODE,
} from '../config/tuning-move';
import { TapPath, type TapMark } from './tap-path';
import { Footfall } from './footfall';
import type { KeeperJumpClip } from './sprites/keeper';
import type { OrbitCamera } from './camera';
import type { Daylight } from './daylight';
import { GROVE, GROVE3D, SIM } from '../config/tuning';
import { CaveAmbience, landmarkSprites } from './cave-ambience';
import { placeDecorations } from './decor';
import { fenceSpots, SCENERY } from './scenery';
import { isSceneryHidden } from './scenery-hide';
import { windSway } from './wind-px';
import { neighbourGarden } from '../sim/neighbourhood';
import { isMerged } from '../sim/partners';
import { visibleStoryProps } from '../sim/story-props';
import { townUnlocks } from '../sim/town';
import { Particles } from './particles';
import { NATIVE_PPU, SpriteBatch } from './sprite-batch';
import { CLIPS, frameAt, frameKey, type ClipName } from './sprites/animations';
import { viewAngle } from './sprites/angles';
import type { FrameRect, SpriteSheet } from './sprites/atlas';
import { bubbleFor, type EmoteShape } from './sprites/emote';
import { buildShadowSheet } from './sprites/props';
import { SheetCache } from './sprites/sheets';
import { JUMP_TOY_SIZE, jumpToySheet, shroomSquash } from './scenery-jump';
import { springBouncedAt } from '../sim/decorate';
import { shroomHopY } from '../sim/behavior';
import { terraceY, type SceneStager } from './scene-stage';
import { PIXEL_BUILDINGS, PIXEL_VIEW, rectOf } from './stage-api';
import { STAGE2 } from '../config/tuning';
import { pixelPose } from './stage-pose';

interface Snapshot {
  pos: Vec2;
  y: number;
}

interface NubbinView {
  clip: string;
  clipStartMs: number;
  /** A one-off bubble shown for a reaction, with its expiry. */
  bubble: { shape: EmoteShape; untilMs: number } | null;
  prev: Snapshot;
  /** Last dust puff while walking and last ripple while swimming. */
  lastDustMs: number;
  lastRippleMs: number;
  /** A short squash (landing) or pop (hatch, evolve) scales the quad at draw time. */
  pop: { kind: 'squash' | 'pop'; startMs: number } | null;
}

export interface SpritePick {
  kind:
    | 'nubbin'
    | 'item'
    | 'npc'
    | 'memorial'
    | 'decor'
    | 'tree'
    | 'building'
    | 'plant'
    | 'wild'
    | 'lantern'
    | 'stairs'
    | 'chest'
    | 'stray'
    | 'loot'
    | 'storyProp';
  id: string;
}

/**
 * Mirrors sim state as sprites. Reads the world, never changes it. Every sprite goes
 * through one SpriteBatch (one draw call); positions are interpolated between the last
 * two sim steps so movement is smooth at any frame rate.
 */
/** MOVE-19: the Keeper's head height, the faded quads' alpha and the x-ray trim colours. */
const KEEPER_HEAD_Y = 1.7;
const OCCLUDER_ALPHA = 0.55;
const KEEPER_XRAY = { sun: 0xffa43c, moon: 0xa78bfa };

export class WorldView {
  private batchLazy: SpriteBatch | null = null;
  /**
   * The one sprite batch and its mega atlas, built on first use: the full-3D mode keeps a
   * WorldView only for its sheet cache (UI portraits) and never draws pixels.
   */
  get batch(): SpriteBatch {
    return (this.batchLazy ??= new SpriteBatch());
  }
  readonly sheets = new SheetCache();
  readonly particles = new Particles();
  private readonly decor = placeDecorations();
  private readonly fences = fenceSpots();
  private darkness = 0;
  /** The Hollow floor being shown, and its torch and crystal glow for sprites. */
  private cave: Floor | null = null;
  private readonly ambience = new CaveAmbience();
  private caveLights: Array<{ x: number; z: number; r: number }> = [];
  private readonly strayPrev = new Map<string, Vec2>();
  private keeperDustMs = 0;
  /** MOVE-43: bushes the Keeper rustled, by spot, and when. */
  private readonly bushShakes = new Map<string, number>();
  /** MOVE-44: the tap walk's footprint dots and target marker. */
  private readonly tapPath = new TapPath();
  /** MOVE-46: the Keeper's footfalls, by surface. */
  private readonly footfall = new Footfall();
  private tufts = 0;
  private readonly nubbins = new Map<string, NubbinView>();
  private readonly items = new Map<string, Snapshot>();
  /** Per-frame scratch sets, cleared and reused rather than allocated every frame. */
  private readonly seenItems = new Set<string>();
  private readonly seenNubbins = new Set<string>();
  private readonly liveStrays = new Set<string>();
  /** A neighbour's garden is fixed by their id: built once per visit, not every frame. */
  private garden: { trainer: string; list: ReturnType<typeof neighbourGarden> } | null = null;
  private keeperPrev: Snapshot = { pos: { x: 0, z: 0 }, y: 0 };
  /**
   * The share of the Keeper's own fine step drawn this frame (MOVE-15), set by game.ts;
   * null draws the Keeper on the sim step's alpha like everyone else.
   */
  keeperAlpha: number | null = null;
  private keeperClipStart = 0;
  private keeperMoving = false;
  /** MOVE-21: when the Keeper last left the ground and last landed (frame clock). */
  private keeperJumpAt = -Infinity;
  private keeperLandAt = -Infinity;
  /** MOVE-27: the leaf the gliding Keeper holds out each side (the particle sheet's leaf). */
  private leafSheet: SpriteSheet | null = null;
  /** How long the land frame holds: longer after a big fall (MOVE-25's plop). */
  private keeperLandMs: number = JUMP.landSquashMs;
  private shadowSheet: SpriteSheet | null = null;
  private readonly tmp = new Vector3();

  get root() {
    return this.batch.mesh;
  }

  /** Call right before stepping the sim, so the next frame can interpolate from here. */
  snapshot(world: World): void {
    for (const n of world.nubbins) {
      const v = this.nubbins.get(n.id);
      if (v) {
        v.prev.pos.x = n.pos.x;
        v.prev.pos.z = n.pos.z;
        v.prev.y = n.y;
      }
    }
    for (const i of world.items) {
      const v = this.items.get(i.id);
      if (v) {
        v.pos.x = i.pos.x;
        v.pos.z = i.pos.z;
        v.y = i.y;
      }
    }
    this.snapshotKeeper(world);
  }

  /** Call right before each of the Keeper's own fine steps (MOVE-15). */
  snapshotKeeper(world: World): void {
    this.keeperPrev.pos.x = world.keeper.pos.x;
    this.keeperPrev.pos.z = world.keeper.pos.z;
    this.keeperPrev.y = world.keeper.y;
  }

  /** Time of day: sprite dimming and the ambient particle layer. */
  private weather: 'clear' | 'rain' | 'snow' = 'clear';
  private weatherIntensity = 0;
  private density: 'full' | 'light' | 'off' = 'full';
  private daylight: Daylight | null = null;
  /** The Hollow is always dark and full of fireflies. */
  location: Location = 'grove';
  /** The story stager the game keeps for the pixel view: drawn spots for a scene's cast. */
  staging: SceneStager | null = null;
  /**
   * Runs inside the sprite pass, before the particles: the Grove scene's dressings draw
   * their billboards here (render/dressings.ts).
   */
  onDraw: ((world: World, nowMs: number) => void) | null = null;
  /** Which neighbour is being visited, if any (their Nubbins are render-only). */
  get visiting(): string | null {
    return this.location.startsWith('visit:') ? this.location.slice('visit:'.length) : null;
  }

  /**
   * Centre the building fade's dither circle (campaign graphics 2) on the framed cast, or
   * the Keeper, and keep the camera for the dressings' world-to-screen function.
   */
  private aimDither(world: World, camera: OrbitCamera, alpha: number): void {
    PIXEL_VIEW.camera = camera.camera;
    const st = this.staging;
    const pts = st?.active ? st.frame(world) : [this.keeperDrawPos(world, alpha)];
    const cx = pts.reduce((a, p) => a + p.x, 0) / Math.max(1, pts.length);
    const cz = pts.reduce((a, p) => a + p.z, 0) / Math.max(1, pts.length);
    this.tmp.set(cx, 1, cz).project(camera.camera);
    this.batch.ditherCircle.value.set(this.tmp.x, this.tmp.y);
    const spread = Math.max(0, ...pts.map((p) => Math.hypot(p.x - cx, p.z - cz)));
    this.batch.ditherRadius.value = Math.min(
      0.45,
      STAGE2.fadeRadius + spread / Math.max(1, camera.visibleHeight),
    );
  }

  /**
   * The Keeper's facing as drawn (MOVE-20): Pixel's eight angles switch to a new heading only
   * once it has held for `pixelFacingHoldMs`, so a wobbly stick does not flicker the sprite.
   */
  private keeperHeading(facing: number, nowMs: number): number {
    const h = this.heading;
    if (h.shown === null || Math.abs(facing - h.want) > 1e-6) {
      if (h.shown === null) h.shown = facing;
      h.want = facing;
      h.sinceMs = nowMs;
    }
    if (nowMs - h.sinceMs >= KEEPER_ACCEL.pixelFacingHoldMs) h.shown = h.want;
    return h.shown;
  }
  private heading: { shown: number | null; want: number; sinceMs: number } = {
    shown: null,
    want: 0,
    sinceMs: 0,
  };

  /** The Keeper's head in NDC for the occluder fade; null when there is no Keeper to show. */
  private keeperHeadNdc(world: World, camera: OrbitCamera, alpha: number): Vector3 | null {
    if (this.staging?.active && this.staging.keeperHold) return null;
    const p = this.keeperDrawPos(world, alpha);
    const v = new Vector3(p.x, KEEPER_HEAD_Y, p.z).project(camera.camera);
    return v.z > 1 ? null : v;
  }

  /** How far the drawn Keeper's feet are off the painted ground (up a jump, down a wade). */
  private keeperOffset(
    world: World,
    x: number,
    z: number,
    alpha: number,
  ): { off: number; floor: number } {
    const y = lerp(this.keeperPrev.y, world.keeper.y, this.keeperAlpha ?? alpha);
    if (runFloor(world)) return { off: Math.max(0, y), floor: 0 };
    const ground = paintedGround(x, z);
    // What the feet stand on or are over: the shadow sits there.
    const floor = Math.max(0, keeperFooting(world, x, z, y).y - ground);
    return { off: y - ground, floor };
  }

  /**
   * MOVE-21: the jump frame to draw, or null on the ground: land for a moment after
   * touching down, crouch just after take-off while still near the floor, then rise, apex
   * and fall by the vertical speed.
   */
  private keeperJumpClip(world: World, nowMs: number, gap: number): KeeperJumpClip | null {
    const k = world.keeper;
    if (nowMs - this.keeperLandAt < this.keeperLandMs) return 'jump-land';
    // A roll (MOVE-64) tucks into the crouch frame all the way along.
    if (keeperRoll(world) !== null) return 'jump-crouch';
    if (k.grounded) return null;
    const fx = KEEPER_JUMP_FX;
    // A mantle (MOVE-50) scrambles up with the knees tucked: the crouch frame.
    if (keeperMantle(world) !== null) return 'jump-crouch';
    if (nowMs - this.keeperJumpAt < fx.crouchMs && gap < fx.crouchGap) return 'jump-crouch';
    if (k.vy > fx.apexVy) return 'jump-rise';
    return k.vy < -fx.apexVy ? 'jump-fall' : 'jump-apex';
  }

  /**
   * MOVE-27: a leaf-wing out to each side of a gliding Keeper at shoulder height, beating
   * slowly (held still under reduced motion).
   */
  private drawGlideLeaves(x: number, y: number, z: number, yaw: number, nowMs: number): void {
    this.leafSheet ??= buildParticleSheet();
    const sheet = this.leafSheet;
    const rect = sheet.frames.get(frameKey('leaf', 'front', 0));
    if (!rect) return;
    const beat = this.particles.reduceMotion ? 0 : Math.sin(nowMs / 120) * 0.06;
    for (const side of [-1, 1]) {
      this.batch.draw({
        sheet,
        rect,
        flip: side < 0,
        x: x + Math.cos(yaw) * side * 0.32,
        y: y + 0.85 + beat,
        z: z - Math.sin(yaw) * side * 0.32,
        mode: 'billboard',
        w: 0.42,
        h: 0.3,
        tint: this.dim,
      });
    }
  }

  /** Squash and stretch for a jump frame: taller and thinner rising, shorter and wider landing. */
  private jumpScale(clip: KeeperJumpClip | null): { w: number; h: number } | null {
    const fx = KEEPER_JUMP_FX;
    if (clip === 'jump-rise') return { w: 2 - fx.stretch, h: fx.stretch };
    if (clip === 'jump-land') return { w: 2 - fx.squash, h: fx.squash };
    return null;
  }

  /** The Keeper's position as drawn this frame (between sim steps). */
  keeperDrawPos(world: World, alpha: number): Vec2 {
    // A scene that puts the Keeper on a mark draws them there (render/scene-stage.ts).
    const held = this.staging?.active ? this.staging.keeperHold : null;
    if (held) return { x: held.x, z: held.z };
    const a = this.keeperAlpha ?? alpha;
    return {
      x: lerp(this.keeperPrev.pos.x, world.keeper.pos.x, a),
      z: lerp(this.keeperPrev.pos.z, world.keeper.pos.z, a),
    };
  }

  /** Lamps that are on: windows and lanterns, with a reach in world units. */
  lights: Array<{ x: number; z: number; r: number }> = [];
  /** The lantern posts and whether each is lit (set by the game from the scene). */
  lanterns: () => Array<{ id: string; x: number; z: number; lit: boolean }> = () => [];

  /** The Hollow floor to draw (null above ground). */
  setDungeon(f: Floor | null): void {
    this.cave = f;
    this.strayPrev.clear();
    this.caveLights = f
      ? [
          ...f.torches.map((t) => {
            const p = cellCentre(f, t);
            return { x: p.x, z: p.z - DUNGEON.cell * 0.4, r: DUNGEON.torchReach };
          }),
          ...f.crystals.map((c) => ({ ...cellCentre(f, c), r: DUNGEON.crystalReach })),
        ]
      : [];
  }

  /** The thing under the mouse or just tapped: drawn with a bright halo. */
  setHighlight(hit: { kind: string; id: string } | null): void {
    this.batch.highlight = hit;
  }

  /** A burst of sparkles where something was tapped. */
  sparkle(x: number, z: number, y = 0.4): void {
    this.particles.burst('note', x, y, z, 6, {
      spread: 0.35,
      speed: 0.9,
      rise: 1.2,
      lifeMs: 650,
      size: 0.3,
    });
  }

  /** Brightness for a sprite at a spot: the day/night dim, lifted by nearby lamps. */
  lightAt(x: number, z: number): number {
    let b = this.dim;
    if (this.darkness < 0.15) return b;
    for (const l of this.lights) {
      const d = Math.hypot(x - l.x, z - l.z) / l.r;
      if (d < 1) b += (1 - d) * (1 - d) * 0.9 * this.darkness;
    }
    return Math.min(1.15, b);
  }

  setDaylight(d: Daylight, reduceMotion: boolean): void {
    this.daylight = d;
    const hollow = this.location === 'hollow';
    const underground = this.location === 'dungeon';
    this.darkness = hollow
      ? Math.max(0.6, d.darkness)
      : underground
        ? Math.max(0.7, d.darkness)
        : d.darkness;
    this.particles.env = {
      fireflies: (d.fireflies || hollow) && !underground,
      leaves: (d.phase === 'day' || d.phase === 'dawn') && this.weather === 'clear' && !underground,
      darkness: this.darkness,
      weather: this.weather,
      weatherIntensity: this.weatherIntensity,
      density: this.density,
    };
    this.particles.reduceMotion = reduceMotion;
  }

  /** Weather and particle density from the sim and Settings; re-applies the daylight. */
  setWeather(
    kind: 'clear' | 'rain' | 'snow',
    intensity: number,
    density: 'full' | 'light' | 'off',
    reduceMotion: boolean,
  ): void {
    this.weather = kind;
    this.weatherIntensity = intensity;
    this.density = density;
    if (this.daylight) this.setDaylight(this.daylight, reduceMotion);
  }

  /** React to sim events: reaction bubbles and particle bursts. */
  onEvents(events: SimEvent[], nowMs: number): void {
    for (const e of events) {
      this.burstFor(e);
      if (e.kind === 'keeperJumped') this.keeperJumpAt = nowMs;
      else if (e.kind === 'bushRustle') {
        // MOVE-43: the bush shakes (not under reduced motion), and sometimes sheds leaves.
        if (!this.particles.reduceMotion) this.bushShakes.set(`${e.x},${e.z}`, nowMs);
        if (e.leaves && !this.particles.reduceMotion)
          this.particles.burst('leaf', e.x, 0.6, e.z, 4, { spread: 0.4, rise: 0.6, lifeMs: 900 });
      } else if (e.kind === 'keeperLanded') {
        this.keeperLandAt = nowMs;
        this.keeperLandMs =
          e.fall > KEEPER_JUMP_FX.plopFall ? KEEPER_JUMP_FX.plopMs : JUMP.landSquashMs;
      }
      if (e.kind === 'landed') {
        const v = this.nubbins.get(e.nubbinId);
        if (v) v.pop = { kind: 'squash', startMs: nowMs };
      } else if (e.kind === 'hatched' || e.kind === 'evolved' || e.kind === 'reborn') {
        const v = this.nubbins.get(e.nubbinId);
        if (v) v.pop = { kind: 'pop', startMs: nowMs };
      }
      if (e.kind !== 'reaction') continue;
      const v = this.nubbins.get(e.nubbinId);
      if (!v) continue;
      v.bubble = { shape: bubbleFor(e.reaction), untilMs: nowMs + UI.bubbleMs };
    }
  }

  /** Which sprite is under a screen point (NDC), nearest to the camera. */
  /** Alpha of each sheet's canvas, read once, for taps that test the texel under them. */
  private readonly alphaMaps = new WeakMap<SpriteSheet, { data: Uint8ClampedArray; w: number }>();

  private opaqueAt(sheet: SpriteSheet, rect: FrameRect, s: number, t: number): boolean {
    let map = this.alphaMaps.get(sheet);
    if (!map) {
      const image = sheet.texture.image as HTMLCanvasElement | undefined;
      const ctx = image && typeof image.getContext === 'function' ? image.getContext('2d') : null;
      if (!ctx || !image) return true; // no canvas to read (tests, or an image-backed sheet): the box wins
      const w = image.width;
      map = { data: ctx.getImageData(0, 0, w, image.height).data, w };
      this.alphaMaps.set(sheet, map);
    }
    const cx = rect.x + Math.min(rect.w - 1, Math.floor(s * rect.w));
    const cy = rect.y + Math.min(rect.h - 1, Math.floor(t * rect.h));
    // A small window, so thin things (a lantern post) are still easy to tap.
    for (let y = cy - 1; y <= cy + 1; y++) {
      for (let x = cx - 1; x <= cx + 1; x++) {
        if (x < rect.x || y < rect.y || x >= rect.x + rect.w || y >= rect.y + rect.h) continue;
        if ((map.data[(y * map.w + x) * 4 + 3] ?? 0) > 40) return true;
      }
    }
    return false;
  }

  pick(ndcX: number, ndcY: number, camera: OrbitCamera): SpritePick | null {
    const cam = camera.camera;
    let best: SpritePick | null = null;
    let bestDepth = Infinity;
    const p: Array<[number, number]> = [];
    for (const q of this.batch.quads) {
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      let depth = 0;
      p.length = 0;
      for (const c of q.corners) {
        this.tmp.copy(c).project(cam);
        p.push([this.tmp.x, this.tmp.y]);
        minX = Math.min(minX, this.tmp.x);
        maxX = Math.max(maxX, this.tmp.x);
        minY = Math.min(minY, this.tmp.y);
        maxY = Math.max(maxY, this.tmp.y);
        depth += this.tmp.z / 4;
      }
      // Sprites are axis-aligned on screen, so the bounding box is the quad.
      if (ndcX < minX || ndcX > maxX || ndcY < minY || ndcY > maxY) continue;
      // Where in the frame the tap lands (corners: top-left, top-right, bottom-left,
      // bottom-right), so a tree's empty corner does not steal a tap meant for what
      // stands behind it.
      const [p0, p1, p2] = p as [[number, number], [number, number], [number, number]];
      const ex = p1[0] - p0[0];
      const ey = p1[1] - p0[1];
      const fx = p2[0] - p0[0];
      const fy = p2[1] - p0[1];
      const det = ex * fy - ey * fx;
      if (Math.abs(det) < 1e-9) continue;
      const dx = ndcX - p0[0];
      const dy = ndcY - p0[1];
      const s = (dx * fy - dy * fx) / det;
      const t = (ex * dy - ey * dx) / det;
      if (s < 0 || s > 1 || t < 0 || t > 1) continue;
      if (!this.opaqueAt(q.sheet, q.rect, q.flip ? 1 - s : s, t)) continue;
      if (depth < bestDepth) {
        bestDepth = depth;
        best = { kind: q.kind, id: q.id };
      }
    }
    return best;
  }

  update(world: World, camera: OrbitCamera, alpha: number, nowMs: number): void {
    const yaw = camera.currentYaw;
    const batch = this.batch;
    batch.begin(yaw, camera.pitch);
    this.shadowSheet ??= buildShadowSheet();
    const shadowSheet = this.shadowSheet;
    const shadowRect = shadowSheet.frames.get(frameKey('shadow', 'front', 0));

    // `y` is the gap under the caster (it shrinks and fades the shadow); `at` is the height
    // of the floor it falls on (a bench top, the bridge deck), 0 for the painted ground.
    const shadow = (x: number, y: number, z: number, radius: number, at = 0) => {
      if (!shadowRect) return;
      const s = Math.max(0.35, 1 - y * 0.25);
      batch.draw({
        sheet: shadowSheet,
        rect: shadowRect,
        flip: false,
        x,
        y: at,
        z,
        mode: 'flat',
        w: radius * 2 * s,
        h: radius * 2 * s,
        opacity: 0.35 * Math.max(0.3, 1 - y * 0.2),
      });
    };

    const home = this.location === 'grove';
    // An exclusive stage (campaign graphics C3, C4) draws only its set: no Grove scenery,
    // garden, critters or items, and no NPC outside its cast.
    const bare = this.staging?.exclusive ?? false;
    const inGrove = (home || this.visiting !== null) && !bare;
    this.aimDither(world, camera, alpha);
    const buildings = PIXEL_BUILDINGS;
    /** Draw a building sprite through the registry: hidden, thinned, its rect kept. */
    const drawBuilding = (
      id: string,
      kind: string,
      d: Parameters<SpriteBatch['draw']>[0],
      pick?: Parameters<SpriteBatch['draw']>[1],
    ): void => {
      buildings.define(id, kind, d.x, d.z);
      if (buildings.isHidden(id)) {
        buildings.setRect(id, null);
        return;
      }
      const fade = buildings.fadeOf(id);
      batch.draw(fade > 0 ? { ...d, dither: fade } : d, pick);
      const corners = batch.lastCorners;
      buildings.setRect(id, corners ? rectOf(camera.camera, corners) : null);
    };
    // MOVE-19: where the Keeper's head sits on screen, so a nearer building or canopy over it
    // can thin to 55% (the x-ray pass shows the silhouette either way).
    const headNdc = this.keeperHeadNdc(world, camera, alpha);
    const kdFade = this.keeperDrawPos(world, alpha);
    const hides = (d: Parameters<SpriteBatch['draw']>[0]): number => {
      if (!headNdc || d.mode !== 'billboard') return 1;
      // Nearer to the camera than the Keeper along the view direction.
      if ((d.x - kdFade.x) * Math.sin(yaw) + (d.z - kdFade.z) * Math.cos(yaw) < 0.05) return 1;
      let x0 = Infinity;
      let x1 = -Infinity;
      let y0 = Infinity;
      let y1 = -Infinity;
      for (const c of batch.quadCorners(d)) {
        this.tmp.copy(c).project(camera.camera);
        x0 = Math.min(x0, this.tmp.x);
        x1 = Math.max(x1, this.tmp.x);
        y0 = Math.min(y0, this.tmp.y);
        y1 = Math.max(y1, this.tmp.y);
      }
      return headNdc.x >= x0 && headNdc.x <= x1 && headNdc.y >= y0 && headNdc.y <= y1
        ? OCCLUDER_ALPHA
        : 1;
    };
    const run = this.location === 'dungeon' ? world.dungeon : null;
    const cave = run ? this.cave : null;
    const underground = cave !== null;
    if (cave) {
      // Underground the only lights are the torches, the crystals and the Keeper's lamp.
      const kp = this.keeperDrawPos(world, alpha);
      this.lights = [...this.caveLights, { x: kp.x, z: kp.z, r: DUNGEON.lampReach }];
      this.ambience.update(
        this.particles,
        cave,
        kp,
        nowMs,
        this.particles.reduceMotion,
        this.density,
      );
    }
    const props = this.sheets.props();
    // Scenery: trees, bushes, buildings, the well, and fence posts along the main path.
    if (inGrove) {
      const scenery = this.sheets.scenery();
      const lampsOn = this.lights.length > 0;
      for (const s of SCENERY) {
        if (isSceneryHidden(s.kind)) continue;
        const litKey =
          lampsOn && !(Y_STATE.windowsOut && s.pick?.kind === 'building')
            ? scenery.frames.get(frameKey(`${s.kind}-lit`, 'front', 0))
            : undefined;
        const rect = litKey ?? scenery.frames.get(frameKey(s.kind, 'front', 0));
        if (!rect) continue;
        // K35: bushes take the wind's two-frame sway.
        let sway =
          (s.sway ? Math.sin(nowMs / 1400 + s.x) * s.sway : 0) +
          (s.kind.startsWith('bush') ? windSway(s.x, nowMs) : 0);
        // MOVE-43: a rustled bush shakes for a moment, fading out.
        const shook = this.bushShakes.size ? this.bushShakes.get(`${s.x},${s.z}`) : undefined;
        if (shook !== undefined) {
          const t = (nowMs - shook) / BUSH.shakeMs;
          if (t >= 1) this.bushShakes.delete(`${s.x},${s.z}`);
          else sway += Math.sin(t * Math.PI * 6) * BUSH.shakeAmp * (1 - t);
        }
        if (!s.kind.startsWith('rock') && !s.kind.startsWith('log')) {
          shadow(
            s.x + s.size * 0.08,
            0,
            s.z + 0.1,
            s.size * (s.kind.startsWith('tree') ? 0.3 : 0.42),
          );
        }
        const sprite = {
          sheet: scenery,
          rect,
          flip: false,
          x: s.x + sway,
          y: 0,
          z: s.z,
          mode: 'billboard' as const,
          w: s.size,
          h: (s.size * rect.h) / rect.w,
          tint: this.lightAt(s.x, s.z),
        } as Parameters<SpriteBatch['draw']>[0];
        if (!s.kind.startsWith('rock') && !s.kind.startsWith('log')) sprite.opacity = hides(sprite);
        const bid = s.pick?.kind === 'building' ? s.pick.id : s.kind === 'well' ? 'well' : null;
        if (bid) drawBuilding(bid, s.kind, sprite, s.pick);
        else batch.draw(sprite, s.pick);
      }
      // The village square fills in as prosperity grows.
      const unlocks = townUnlocks(world);
      const stall = scenery.frames.get(frameKey('stall', 'front', 0));
      if (stall) {
        for (const { x: sx, z: sz, when } of STALL_SPOTS) {
          if (!unlocks[when]) continue;
          shadow(sx, 0, sz, 0.9);
          batch.draw({
            sheet: scenery,
            rect: stall,
            flip: false,
            x: sx,
            y: 0,
            z: sz,
            mode: 'billboard',
            w: 2.4,
            h: (2.4 * stall.h) / stall.w,
            tint: this.lightAt(sx, sz),
          });
        }
      }
      // Lantern posts: painted, lit at dusk or when the Keeper lights them, tappable.
      for (const l of this.lanterns()) {
        const lrect = scenery.frames.get(
          frameKey(l.lit ? 'lanternPost-lit' : 'lanternPost', 'front', 0),
        );
        if (!lrect) continue;
        shadow(l.x, 0, l.z, 0.3);
        batch.draw(
          {
            sheet: scenery,
            rect: lrect,
            flip: false,
            x: l.x,
            y: 0,
            z: l.z,
            mode: 'billboard',
            w: 0.9,
            h: (0.9 * lrect.h) / lrect.w,
            tint: l.lit ? 1.1 : this.lightAt(l.x, l.z),
          },
          { id: l.id, kind: 'lantern' },
        );
      }
      const fence = scenery.frames.get(frameKey('fencePost', 'front', 0));
      if (fence) {
        for (const f of this.fences) {
          batch.draw({
            sheet: scenery,
            rect: fence,
            flip: false,
            x: f.x,
            y: 0,
            z: f.z,
            mode: 'billboard',
            w: 0.75,
            h: (0.75 * fence.h) / fence.w,
            tint: this.lightAt(f.x, f.z),
          });
        }
      }
    }
    // Ground dressing, then memorial flowers.
    for (const d of inGrove ? this.decor : []) {
      const rect = props.frames.get(frameKey(d.frame, 'front', 0));
      if (!rect) continue;
      batch.draw({
        sheet: props,
        rect,
        flip: d.flip,
        x: d.x,
        y: d.flat ? 0.03 : 0,
        z: d.z,
        mode: d.flat ? 'flat' : 'billboard',
        tint: this.dim,
      });
    }
    const flower = props.frames.get(frameKey('flower', 'front', 0));
    // Placed garden pieces, tappable so they can be picked up again.
    const scenerySheet = this.sheets.scenery();
    for (const d of home && !bare ? world.placed : []) {
      if (d.kind === 'nursery' || d.kind === 'bathhouse' || d.kind === 'workshop') {
        const brect =
          (this.lights.length > 0
            ? scenerySheet.frames.get(frameKey(`${d.kind}-lit`, 'front', 0))
            : undefined) ?? scenerySheet.frames.get(frameKey(d.kind, 'front', 0));
        if (!brect) continue;
        drawBuilding(
          d.kind,
          d.kind,
          {
            sheet: scenerySheet,
            rect: brect,
            flip: false,
            x: d.pos.x,
            y: 0,
            z: d.pos.z,
            mode: 'billboard',
            w: d.kind === 'workshop' ? 5.8 : d.kind === 'bathhouse' ? 5.6 : 4.4,
            h:
              ((d.kind === 'workshop' ? 5.8 : d.kind === 'bathhouse' ? 5.6 : 4.4) * brect.h) /
              brect.w,
            tint: this.lightAt(d.pos.x, d.pos.z),
          },
          { id: d.kind, kind: 'building' },
        );
        continue;
      }
      if (d.kind === 'springShroom' || d.kind === 'hayBale') {
        // MOVE-57: the jump toys come from their own little sheet; the mushroom squashes.
        const toys = jumpToySheet();
        const trect = toys.frames.get(d.kind);
        if (!trect) continue;
        const size = JUMP_TOY_SIZE[d.kind];
        const sq =
          d.kind === 'springShroom'
            ? shroomSquash(d.id, springBouncedAt(world, d.id), nowMs, this.particles.reduceMotion) *
              JUMP_TOYS.squash
            : 0;
        batch.draw(
          {
            sheet: toys,
            rect: trect,
            flip: false,
            x: d.pos.x,
            y: 0,
            z: d.pos.z,
            mode: 'billboard',
            w: size * (1 + sq * 0.5),
            h: size * (1 - sq),
            tint: this.dim,
          },
          { id: d.id, kind: 'decor' },
        );
        continue;
      }
      const rect = props.frames.get(frameKey(d.kind, 'front', 0));
      if (!rect) continue;
      const flat = d.kind === 'pathTile';
      batch.draw(
        {
          sheet: props,
          rect,
          flip: false,
          x: d.pos.x,
          y: flat ? 0.02 : 0,
          z: d.pos.z,
          mode: flat ? 'flat' : 'billboard',
          tint: this.dim,
        },
        { id: d.id, kind: 'decor' },
      );
    }
    // The side stories' props: the trowel on the step, the door in the Old Wall...
    for (const p of home && !bare ? visibleStoryProps(world) : []) {
      const rect = props.frames.get(frameKey(`prop-${p.kind}`, 'front', 0));
      if (!rect) continue;
      batch.draw(
        {
          sheet: props,
          rect,
          flip: false,
          x: p.x,
          y: 0,
          z: p.z,
          mode: 'billboard',
          tint: this.lightAt(p.x, p.z),
        },
        { id: p.id, kind: 'storyProp' },
      );
    }
    for (const m of home && !bare ? world.memorials : []) {
      if (flower) {
        const spot = memorialSpot(world, m);
        batch.draw(
          {
            sheet: props,
            rect: flower,
            flip: false,
            x: spot.x,
            y: 0,
            z: spot.z,
            mode: 'billboard',
            tint: this.dim,
          },
          { id: m.id, kind: 'memorial' },
        );
      }
    }

    // Orchard trees and crop rows, tappable to water or harvest.
    for (const p of home && !bare ? world.plants : []) {
      const rect = props.frames.get(frameKey(`${p.kind}Stage${p.stage}`, 'front', 0));
      if (!rect) continue;
      const size = p.kind === 'tree' ? 1 + p.stage * 0.45 : 1.1;
      const sway = p.kind === 'tree' && p.stage >= 2 ? Math.sin(nowMs / 1500 + p.pos.x) * 0.02 : 0;
      const dry = p.water < 0.25 ? 0.8 : 1;
      const plantDraw: Parameters<SpriteBatch['draw']>[0] = {
        sheet: props,
        rect,
        flip: false,
        x: p.pos.x + sway,
        y: 0,
        z: p.pos.z,
        mode: 'billboard',
        w: size,
        h: size,
        tint: this.dim * dry,
      };
      plantDraw.opacity = hides(plantDraw);
      batch.draw(plantDraw, { id: p.id, kind: 'plant' });
    }
    // Wild visitors looking around their patch.
    for (const w of home && !bare ? world.wild : []) {
      const wsheet = this.sheets.species(w.species);
      const facing = Math.sin(nowMs / 2300 + w.pos.z) * 1.2;
      const wview = viewAngle(facing, yaw);
      const wrect = wsheet.frames.get(
        frameKey('idle', wview.angle, frameAt(CLIPS.idle, nowMs + w.pos.x * 131)),
      );
      if (!wrect) continue;
      const hop = w.fed ? Math.abs(Math.sin(nowMs / 180)) * 0.25 : 0;
      shadow(w.pos.x, hop, w.pos.z, 0.4);
      batch.draw(
        {
          sheet: wsheet,
          rect: wrect,
          flip: wview.flip,
          x: w.pos.x,
          y: hop,
          z: w.pos.z,
          mode: 'billboard',
          tint: this.dim,
        },
        { id: w.id, kind: 'wild' },
      );
      const emotes = this.sheets.emotes(false);
      const q = emotes.frames.get(frameKey('question', 'front', 0));
      if (q && !w.fed) {
        batch.draw({
          sheet: emotes,
          rect: q,
          flip: false,
          x: w.pos.x,
          y: 1.25 + Math.sin(nowMs / 400) * 0.04,
          z: w.pos.z,
          mode: 'billboard',
          w: 0.5,
          h: 0.5,
        });
      }
    }
    // A neighbour's Grove: their pets and the host, read-only.
    if (this.visiting) {
      if (this.garden?.trainer !== this.visiting)
        this.garden = { trainer: this.visiting, list: neighbourGarden(this.visiting) };
      for (const nb of this.garden.list) {
        const sheet =
          nb.species === 'chao'
            ? this.sheets.rival(nb.band, nb.type)
            : this.sheets.species(nb.species);
        const facing = Math.sin(nowMs / 3100 + nb.x) * 1.4;
        const view = viewAngle(facing, yaw);
        const rect = sheet.frames.get(
          frameKey('idle', view.angle, frameAt(CLIPS.idle, nowMs + nb.x * 71)),
        );
        if (!rect) continue;
        shadow(nb.x, 0, nb.z, 0.4);
        batch.draw({
          sheet,
          rect,
          flip: view.flip,
          x: nb.x,
          y: 0,
          z: nb.z,
          mode: 'billboard',
          tint: this.dim,
        });
      }
      const hsheet = this.sheets.keeper(this.visiting);
      const hview = viewAngle(Math.PI, yaw);
      const hrect = hsheet.frames.get(frameKey('idle', hview.angle, frameAt(CLIPS.idle, nowMs)));
      if (hrect) {
        shadow(0, 0, -1.5, 0.45);
        batch.draw(
          {
            sheet: hsheet,
            rect: hrect,
            flip: hview.flip,
            x: 0,
            y: 0,
            z: -1.5,
            mode: 'billboard',
            tint: this.dim,
          },
          { id: 'host', kind: 'building' },
        );
      }
    }

    if (cave && run) this.drawCave(cave, run, world, nowMs, yaw, alpha, shadow);

    // Items.
    const seenItems = this.seenItems;
    seenItems.clear();
    for (const item of world.items) {
      const shownHere =
        !bare &&
        (home
          ? item.kind !== 'notebook'
          : !this.visiting && !underground && item.kind === 'notebook');
      if (!shownHere) continue;
      seenItems.add(item.id);
      let prev = this.items.get(item.id);
      if (!prev) {
        prev = { pos: { x: item.pos.x, z: item.pos.z }, y: item.y };
        this.items.set(item.id, prev);
      }
      const x = lerp(prev.pos.x, item.pos.x, alpha);
      const y = lerp(prev.y, item.y, alpha);
      const z = lerp(prev.pos.z, item.pos.z, alpha);
      const frame =
        item.kind === 'toy' && item.toy && item.toy !== 'ball'
          ? item.toy
          : item.kind === 'fruit' && item.flavor
            ? `fruit-${item.flavor}`
            : item.kind;
      const rect =
        props.frames.get(frameKey(frame, 'front', 0)) ??
        props.frames.get(frameKey(item.kind, 'front', 0));
      if (!rect) continue;
      shadow(x, y, z, 0.25);
      batch.draw(
        { sheet: props, rect, flip: false, x, y, z, mode: 'billboard', tint: this.dim },
        { id: item.id, kind: 'item' },
      );
    }
    for (const id of this.items.keys()) if (!seenItems.has(id)) this.items.delete(id);

    // Nubbins.
    const seen = this.seenNubbins;
    seen.clear();
    const shown = home
      ? world.nubbins
      : run
        ? world.nubbins.filter((x) => run.party.includes(x.id))
        : [];
    for (const n of shown) {
      seen.add(n.id);
      let v = this.nubbins.get(n.id);
      if (!v) {
        v = {
          clip: '',
          clipStartMs: nowMs,
          bubble: null,
          prev: { pos: { x: n.pos.x, z: n.pos.z }, y: n.y },
          lastDustMs: 0,
          lastRippleMs: 0,
          pop: null,
        };
        this.nubbins.set(n.id, v);
      }
      this.drawNubbin(v, n, world, yaw, alpha, nowMs, shadow);
    }
    for (const id of this.nubbins.keys()) if (!seen.has(id)) this.nubbins.delete(id);

    // Visiting Keepers (campaign).
    const npcHere = (t: string) =>
      this.location === 'grove'
        ? true
        : underground
          ? false
          : this.location === 'corvin'
            ? t === 'corvin' || t === 'ember'
            : t === 'nova';
    const cast = this.staging?.castIds;
    for (const npc of world.npcs) {
      if (!npcHere(npc.trainer) || ((bare || LOOK_STATE.tale) && !cast?.has(npc.trainer))) continue;
      const nsheet = this.sheets.keeper(storyId(npc.trainer));
      // In a story scene the cast is drawn on its marks, or brought in beside the Keeper
      // (render/scene-stage.ts); the sim's NPC stays where it is.
      const held = this.staging?.active ? this.staging.holds.get(npc.id) : undefined;
      const at = held ?? npc.pos;
      const moving = (npc.target !== null && !held) || !!this.staging?.walking.has(npc.id);
      const nclip: ClipName = moving ? 'walk' : 'idle';
      // Package a1: a staged pose, gesture or head turn (render/stage-pose.ts).
      const npose = pixelPose(npc.id, nowMs, (c) => nsheet.frames.has(frameKey(c, 'front', 0)));
      const nview = viewAngle(
        npose?.face ?? (held && this.staging?.faces.get(npc.id)) ?? npc.facing,
        yaw,
      );
      const nrect = nsheet.frames.get(
        npose?.clip
          ? frameKey(npose.clip, nview.angle, npose.frame)
          : frameKey(nclip, nview.angle, frameAt(CLIPS[nclip], nowMs + npc.pos.x * 97)),
      );
      const ay =
        (held && this.location === 'grove' ? terraceY(at.x, at.z) : 0) + (npose?.lift ?? 0);
      shadow(at.x, ay, at.z, 0.45);
      if (nrect) {
        batch.draw(
          {
            sheet: nsheet,
            rect: nrect,
            flip: nview.flip,
            x: at.x,
            y: ay,
            z: at.z,
            mode: 'billboard',
            tint: this.dim,
          },
          { id: npc.id, kind: 'npc' },
        );
      }
    }

    // Ambient creatures of the other places: the Hollow's strays, Corvin's rows.
    if (!inGrove && !underground && !bare) this.drawAmbient(nowMs, yaw, shadow);

    // Keeper.
    const k = world.keeper;
    const ksheet = this.sheets.keeper(world.trainer, k.alignment);
    const kd = this.keeperDrawPos(world, alpha);
    const kx = kd.x;
    const kz = kd.z;
    const moving =
      Math.hypot(k.pos.x - this.keeperPrev.pos.x, k.pos.z - this.keeperPrev.pos.z) > 0.001 ||
      !!this.staging?.walking.has('you');
    if (moving !== this.keeperMoving) {
      this.keeperMoving = moving;
      this.keeperClipStart = nowMs;
    }
    const kclip: ClipName = moving ? 'walk' : 'idle';
    // A scene that holds the Keeper on a mark turns them to whom it is with (H7).
    const kface = this.staging?.keeperFaceNow(world, yaw) ?? null;
    // Package a1: a staged pose, gesture, item-get or head turn (render/stage-pose.ts).
    const kpose = pixelPose(
      'keeper',
      nowMs,
      (c) => ksheet.frames.has(frameKey(c, 'front', 0)),
      moving,
    );
    const kview = viewAngle(kpose?.face ?? kface ?? this.keeperHeading(k.facing, nowMs), yaw);
    const krect = ksheet.frames.get(
      kpose?.clip
        ? frameKey(kpose.clip, kview.angle, kpose.frame)
        : frameKey(
            kclip,
            kview.angle,
            frameAt(CLIPS[kclip], (nowMs - this.keeperClipStart) * (k.running ? 1.7 : 1)),
          ),
    );
    // A Keeper held on a hill mark stands (or sits) on the terrace, as held NPCs do.
    const kHeld = this.staging?.active && this.staging.keeperHold && this.location === 'grove';
    // The Keeper's height off the flat painted ground (MOVE-10/13): a jump lifts it, a
    // bench raises it, and the stream sinks its feet under the ground plane, which hides them.
    const { off, floor } = kHeld ? { off: 0, floor: 0 } : this.keeperOffset(world, kx, kz, alpha);
    // MOVE-65: a pond dip sinks the drawn Keeper under the water and sends up bubble rings.
    const dip = keeperDip(world);
    const dipBy = dip === null ? 0 : POND_DIP.depth * Math.sin(Math.PI * dip);
    if (dip !== null && nowMs - this.keeperDustMs > POND_DIP.bubbleMs) {
      this.keeperDustMs = nowMs;
      this.particles.ripple(kx + Math.sin(nowMs) * 0.15, kz + Math.cos(nowMs * 1.3) * 0.15);
    }
    const kbase = (kHeld ? terraceY(kx, kz) : 0) + (kpose?.lift ?? 0);
    const ky = kbase + off - dipBy;
    // MOVE-21: the shadow lies on what the feet are over (bench, deck), shrinking with the gap.
    shadow(kx, Math.max(0, off - floor), kz, 0.45, kbase + floor + (floor > 0 ? 0.01 : 0));
    // MOVE-44: after a tap, dots along the path and a marker on the ground at the target.
    if (shadowRect && this.tapPath.update(world, nowMs)) {
      const calm = this.particles.reduceMotion;
      const mark = (m: TapMark, r: number, a: number) =>
        batch.draw({
          sheet: shadowSheet,
          rect: shadowRect,
          flip: false,
          x: m.x,
          y: m.y - paintedGround(m.x, m.z) + 0.01,
          z: m.z,
          mode: 'flat',
          w: r * 2,
          h: r * 2,
          opacity: 0.45 * a,
        });
      const da = this.tapPath.dotAlpha(nowMs, calm);
      if (da > 0) for (const d of this.tapPath.dots) mark(d, 0.13, da * 1.4);
      const ma = this.tapPath.markAlpha(nowMs, calm);
      if (ma > 0 && this.tapPath.mark) mark(this.tapPath.mark, 0.3, ma);
    }
    const jclip = kpose?.clip || kHeld ? null : this.keeperJumpClip(world, nowMs, off - floor);
    const jrect = jclip ? ksheet.frames.get(frameKey(jclip, kview.angle, 0)) : undefined;
    const jscale = jrect && !this.particles.reduceMotion ? this.jumpScale(jclip) : null;
    const kdrawn = jrect ?? krect;
    if (kdrawn) {
      batch.draw({
        sheet: ksheet,
        rect: kdrawn,
        ...(jscale
          ? { w: (kdrawn.w / NATIVE_PPU) * jscale.w, h: (kdrawn.h / NATIVE_PPU) * jscale.h }
          : {}),
        flip: kview.flip,
        x: kx,
        y: ky,
        z: kz,
        mode: 'billboard',
        tint: this.dim,
      });
      // The silhouette through whatever stands in front, in the Keeper's trim colour.
      batch.markXray(k.alignment === 'moon' ? KEEPER_XRAY.moon : KEEPER_XRAY.sun);
      if (keeperGliding(world)) this.drawGlideLeaves(kx, ky, kz, yaw, nowMs);
    }
    const k2 = world.coop.active ? world.keeper2 : null;
    if (k2) {
      const sheet2 = this.sheets.keeper(world.coop.trainer, k2.alignment);
      const moving2 = k2.input.x !== 0 || k2.input.z !== 0;
      const clip2: ClipName = moving2 ? 'walk' : 'idle';
      const view2 = viewAngle(k2.facing, yaw);
      const rect2 = sheet2.frames.get(frameKey(clip2, view2.angle, frameAt(CLIPS[clip2], nowMs)));
      // MOVE-54: Keeper 2 jumps and stands on tops as Keeper 1 does; its feet are its own height.
      const g2 = runFloor(world) ? 0 : paintedGround(k2.pos.x, k2.pos.z);
      const off2 = k2.y - g2;
      const floor2 = runFloor(world)
        ? 0
        : Math.max(0, keeperFooting(world, k2.pos.x, k2.pos.z, k2.y).y - g2);
      shadow(k2.pos.x, Math.max(0, off2 - floor2), k2.pos.z, 0.45, floor2);
      if (rect2) {
        batch.draw({
          sheet: sheet2,
          rect: rect2,
          flip: view2.flip,
          x: k2.pos.x,
          y: off2,
          z: k2.pos.z,
          mode: 'billboard',
          tint: this.dim,
        });
      }
    }
    // MOVE-46: the step's surface; a deck or a bench top leaves no dust, grass a tuft.
    this.footfall.step(world, kx, kz);
    const underfoot = this.footfall.surface;
    if (moving && off < -0.05 && nowMs - this.keeperDustMs > KEEPER_WADE.rippleMs) {
      // Wading: rings on the water instead of dust.
      this.keeperDustMs = nowMs;
      this.particles.ripple(kx, kz);
    } else if (
      moving &&
      off >= -0.05 &&
      off < 0.05 &&
      // Running kicks up dust about twice as often (MOVE-42).
      nowMs - this.keeperDustMs > (k.running ? RUN_MODE.dustRunMs : RUN_MODE.dustWalkMs)
    ) {
      this.keeperDustMs = nowMs;
      if (underfoot === 'grass') {
        if (++this.tufts % FOOTFALL.tuftEvery === 0)
          this.particles.burst('leaf', kx, 0.05, kz, 1, {
            spread: 0.1,
            speed: 0.2,
            rise: 0.3,
            lifeMs: 360,
            size: 0.3,
          });
      } else if (underfoot !== 'deck')
        this.particles.burst('dust', kx, 0.05, kz, 1, {
          spread: 0.15,
          speed: 0.3,
          rise: 0.4,
          lifeMs: 420,
          size: 0.4,
        });
    }

    this.onDraw?.(world, nowMs);

    // Particles last so they sit over the sprites they decorate.
    this.particles.update(nowMs);
    this.particles.draw(batch, nowMs);

    batch.end();
  }

  /** The Hollow floor's dressing: stairs, torches, crystals, the chest, loot, strays, the wild one. */
  private drawCave(
    f: Floor,
    run: DungeonRun,
    world: World,
    nowMs: number,
    yaw: number,
    alpha: number,
    shadow: (x: number, y: number, z: number, r: number) => void,
  ): void {
    const batch = this.batch;
    const sheet = this.sheets.dungeon();
    const frame = (k: string) => sheet.frames.get(frameKey(k, 'front', 0));
    const cell = DUNGEON.cell;
    // Stair markers lie flat and are tappable.
    const marks: Array<[Cell, 'up' | 'down']> = [[f.stairsUp, 'up']];
    if (f.stairsDown) marks.push([f.stairsDown, 'down']);
    for (const [c, dir] of marks) {
      const rect = frame(dir === 'up' ? 'stairsUp' : 'stairsDown');
      if (!rect) continue;
      const p = cellCentre(f, c);
      batch.draw(
        {
          sheet,
          rect,
          flip: false,
          x: p.x,
          y: 0.01,
          z: p.z,
          mode: 'flat',
          w: cell,
          h: cell,
          tint: 1.1,
        },
        { id: dir, kind: 'stairs' },
      );
    }
    // Torches hang on the north wall of their cell and flicker.
    const torch = frame('sconce');
    if (torch) {
      f.torches.forEach((t, i) => {
        const p = cellCentre(f, t);
        batch.draw({
          sheet,
          rect: torch,
          flip: false,
          x: p.x,
          y: GROVE3D.cave.pixel.sconceY - 0.72,
          z: p.z - cell * 0.49,
          mode: 'billboard',
          tint: 1.02 + (this.particles.reduceMotion ? 0 : 0.1 * Math.sin(nowMs / 90 + i * 1.7)),
        });
      });
    }
    for (const lm of landmarkSprites(f)) {
      const rect = frame(lm.key);
      if (!rect) continue;
      shadow(lm.x, 0, lm.z, lm.r);
      batch.draw({
        sheet,
        rect,
        flip: false,
        x: lm.x,
        y: 0,
        z: lm.z,
        mode: 'billboard',
        w: (rect.w / NATIVE_PPU) * GROVE3D.cave.pixel.landmarkScale,
        h: (rect.h / NATIVE_PPU) * GROVE3D.cave.pixel.landmarkScale,
        tint: 1.05,
      });
    }
    const crystal = frame('crystal');
    if (crystal) {
      for (const c of f.crystals) {
        const p = cellCentre(f, c);
        shadow(p.x, 0, p.z, 0.3);
        batch.draw({
          sheet,
          rect: crystal,
          flip: false,
          x: p.x,
          y: 0,
          z: p.z,
          mode: 'billboard',
          tint: 1.05 + 0.08 * Math.sin(nowMs / 420 + p.x),
        });
      }
    }
    const chest = frame(run.chestOpen ? 'chestOpen' : 'chest');
    if (chest) {
      const p = cellCentre(f, f.chest);
      shadow(p.x, 0, p.z, 0.4);
      batch.draw(
        {
          sheet,
          rect: chest,
          flip: false,
          x: p.x,
          y: 0,
          z: p.z,
          mode: 'billboard',
          tint: this.lightAt(p.x, p.z),
        },
        { id: 'chest', kind: 'chest' },
      );
    }
    // Loot bobs gently until someone walks over it.
    for (const l of f.loot) {
      if (run.taken.includes(l.id)) continue;
      const rect = frame(`loot-${l.kind}`);
      if (!rect) continue;
      const p = cellCentre(f, l.cell);
      const bob = 0.08 + 0.05 * Math.sin(nowMs / 350 + l.cell.x * 0.7);
      shadow(p.x, bob, p.z, 0.2);
      batch.draw(
        {
          sheet,
          rect,
          flip: false,
          x: p.x,
          y: bob,
          z: p.z,
          mode: 'billboard',
          tint: this.lightAt(p.x, p.z),
        },
        { id: l.id, kind: 'loot' },
      );
    }
    // Shadow strays: grey, sad when they stand, walking otherwise.
    const grey = this.sheets.ambientShadow();
    const liveIds = this.liveStrays;
    liveIds.clear();
    run.strays.forEach((s, i) => {
      liveIds.add(s.id);
      let prev = this.strayPrev.get(s.id);
      if (!prev) {
        prev = { x: s.pos.x, z: s.pos.z };
        this.strayPrev.set(s.id, prev);
      }
      const x = lerp(prev.x, s.pos.x, alpha);
      const z = lerp(prev.z, s.pos.z, alpha);
      const moving =
        s.target !== null && Math.hypot(s.target.x - s.pos.x, s.target.z - s.pos.z) > 0.1;
      const clip: ClipName = moving ? 'walk' : 'sad';
      const facing = s.target ? Math.atan2(s.target.x - s.pos.x, s.target.z - s.pos.z) : 0;
      const view = viewAngle(facing, yaw);
      const rect = grey.frames.get(
        frameKey(clip, view.angle, frameAt(CLIPS[clip], nowMs + i * 137)),
      );
      shadow(x, 0, z, 0.5);
      if (rect) {
        batch.draw(
          {
            sheet: grey,
            rect,
            flip: view.flip,
            x,
            y: 0,
            z,
            mode: 'billboard',
            tint: this.lightAt(x, z) * 0.9,
          },
          { id: s.id, kind: 'stray' },
        );
      }
    });
    for (const id of this.strayPrev.keys()) if (!liveIds.has(id)) this.strayPrev.delete(id);
    // The wild creature keeps to its nook until the Keeper creeps up on it.
    for (const w of run.wild) {
      if (w.scanned) continue;
      const wsheet = this.sheets.species(w.species);
      const facing = Math.sin(nowMs / 2300 + w.pos.z) * 1.2;
      const wview = viewAngle(facing, yaw);
      const wrect = wsheet.frames.get(
        frameKey('idle', wview.angle, frameAt(CLIPS.idle, nowMs + w.pos.x * 131)),
      );
      if (!wrect) continue;
      shadow(w.pos.x, 0, w.pos.z, 0.4);
      batch.draw({
        sheet: wsheet,
        rect: wrect,
        flip: wview.flip,
        x: w.pos.x,
        y: 0,
        z: w.pos.z,
        mode: 'billboard',
        tint: this.lightAt(w.pos.x, w.pos.z),
      });
      const emotes = this.sheets.emotes(false);
      const q = emotes.frames.get(frameKey('question', 'front', 0));
      if (q) {
        batch.draw({
          sheet: emotes,
          rect: q,
          flip: false,
          x: w.pos.x,
          y: 1.15 + Math.sin(nowMs / 400) * 0.05,
          z: w.pos.z,
          mode: 'billboard',
          tint: this.lightAt(w.pos.x, w.pos.z),
        });
      }
    }
    void world;
  }

  /** Grey Nubbins that live in the other places; render-only dressing. */
  private drawAmbient(
    nowMs: number,
    yaw: number,
    shadow: (x: number, y: number, z: number, r: number) => void,
  ): void {
    const sheet = this.sheets.ambientShadow();
    const spots: Array<[number, number, string]> =
      this.location === 'corvin'
        ? Array.from({ length: 30 }, (_, i): [number, number, string] => [
            -9 + (i % 10) * 2,
            -6 + Math.floor(i / 10) * 3,
            'sit',
          ])
        : [
            [-12, -4, 'sit'],
            [-7, -11, 'sit'],
            [4, -12, 'walk'],
            [10, -3, 'sit'],
            [12, 8, 'sit'],
            [-4, 11, 'walk'],
            [-11, 9, 'sit'],
            [7, 12, 'sit'],
          ];
    spots.forEach(([x, z], i) => {
      const clip: ClipName = this.location === 'corvin' ? 'idle' : i % 3 === 2 ? 'walk' : 'sad';
      const facing = this.location === 'corvin' ? Math.PI : (i * 1.3) % (Math.PI * 2);
      const view = viewAngle(facing, yaw);
      const rect = sheet.frames.get(
        frameKey(clip, view.angle, frameAt(CLIPS[clip], nowMs + i * 137)),
      );
      shadow(x, 0, z, 0.55);
      if (rect) {
        this.batch.draw({
          sheet,
          rect,
          flip: view.flip,
          x,
          y: 0,
          z,
          mode: 'billboard',
          tint: this.dim,
        });
      }
    });
  }

  /** Sprite brightness for the time of day. */
  private get dim(): number {
    return 1 - this.darkness * 0.35;
  }

  /** Particle bursts for sim events. Positions come from the last snapshot. */
  private burstFor(e: SimEvent): void {
    if (e.kind === 'dungeonFound' || e.kind === 'chestOpened') {
      const p =
        e.kind === 'dungeonFound' && e.by ? this.nubbins.get(e.by)?.prev.pos : this.keeperPrev.pos;
      if (p) this.sparkle(p.x, p.z);
      return;
    }
    const at = (id: string) => this.nubbins.get(id)?.prev;
    const p = this.particles;
    switch (e.kind) {
      case 'keeperRolled':
      case 'keeperLanded':
      case 'keeperJumped': {
        // MOVE-21: a little dust each side on landing, a puff of sparkles under a double
        // jump. Under reduced motion the frames stay and the particles go.
        if (p.reduceMotion) break;
        const k = this.keeperPrev;
        const feet = Math.max(0.05, k.y - paintedGround(k.pos.x, k.pos.z) + 0.05);
        if (e.kind === 'keeperRolled') {
          // MOVE-64: a puff of dust where the roll starts.
          p.burst('dust', k.pos.x, feet, k.pos.z, KEEPER_JUMP_FX.landDust * 2, {
            spread: 0.25,
            speed: 0.6,
            rise: 0.15,
            lifeMs: 300,
            size: 0.35,
          });
          break;
        }
        if (e.kind === 'keeperLanded') {
          const n = KEEPER_JUMP_FX.landDust;
          for (const side of [-1, 1])
            p.burst('dust', k.pos.x + side * 0.18, feet, k.pos.z, n, {
              spread: 0.1,
              speed: 0.5,
              rise: 0.2,
              lifeMs: 260,
              size: 0.35,
            });
        } else if (e.air) {
          p.burst('sparkle', k.pos.x, feet, k.pos.z, KEEPER_JUMP_FX.airSparkles, {
            spread: 0.2,
            speed: 0.4,
            rise: -0.2,
            lifeMs: 380,
            size: 0.4,
          });
        }
        break;
      }
      case 'keeperSkid': {
        // A sharp turn at speed (MOVE-20): a puff of dust at the Keeper's heels.
        const k = this.keeperPrev.pos;
        p.burst('dust', k.x, 0.05, k.z, 4, {
          spread: 0.2,
          speed: 0.6,
          rise: 0.3,
          lifeMs: 320,
          size: 0.45,
        });
        break;
      }
      case 'landed': {
        const v = at(e.nubbinId);
        if (v)
          p.burst('dust', v.pos.x, 0.05, v.pos.z, 6, {
            spread: 0.25,
            speed: 1.2,
            rise: 0.5,
            lifeMs: 500,
            size: 0.45,
          });
        break;
      }
      case 'reaction': {
        const v = at(e.nubbinId);
        if (!v) break;
        if (e.reaction === 'love') {
          p.burst('heart', v.pos.x, v.y + 1.6, v.pos.z, 3, {
            spread: 0.3,
            speed: 0.1,
            rise: 0.6,
            lifeMs: 1100,
            size: 0.45,
            fadeMs: 250,
          });
        } else if (e.reaction === 'dizzy') {
          p.burst('sparkle', v.pos.x, v.y + 1.9, v.pos.z, 3, {
            spread: 0.4,
            speed: 0.2,
            rise: 0.1,
            lifeMs: 600,
            size: 0.35,
          });
        }
        break;
      }
      case 'hatched':
      case 'reborn':
      case 'speciesGrew': {
        const v = at(e.nubbinId);
        if (v)
          p.burst('sparkle', v.pos.x, v.y + 0.6, v.pos.z, 14, {
            spread: 0.5,
            speed: 1.4,
            rise: 1.2,
            lifeMs: 900,
            size: 0.5,
            fadeMs: 200,
          });
        break;
      }
      case 'evolved':
      case 'secondEvolved': {
        const v = at(e.nubbinId);
        if (v) {
          p.burst('sparkle', v.pos.x, v.y + 0.8, v.pos.z, 24, {
            spread: 0.8,
            speed: 1.8,
            rise: 1.6,
            lifeMs: 1300,
            size: 0.55,
            fadeMs: 250,
          });
          p.burst('petal', v.pos.x, v.y + 1.2, v.pos.z, 8, {
            spread: 0.6,
            speed: 1.0,
            rise: 1.0,
            lifeMs: 1600,
            size: 0.45,
            fadeMs: 300,
          });
        }
        break;
      }
      case 'eternal': {
        const v = at(e.nubbinId);
        if (v)
          p.burst('sparkle', v.pos.x, v.y + 0.5, v.pos.z, 40, {
            spread: 1.2,
            speed: 1.2,
            rise: 2.0,
            lifeMs: 2200,
            size: 0.6,
            fadeMs: 400,
          });
        break;
      }
      case 'cocoonStarted': {
        const v = at(e.nubbinId);
        if (v)
          p.burst('sparkle', v.pos.x, v.y + 0.6, v.pos.z, 8, {
            spread: 0.5,
            speed: 0.6,
            rise: 0.5,
            lifeMs: 1200,
            size: 0.45,
            fadeMs: 300,
          });
        break;
      }
      case 'ate': {
        const v = at(e.nubbinId);
        if (v)
          p.burst('crumb', v.pos.x, v.y + 0.9, v.pos.z, 4, {
            spread: 0.15,
            speed: 0.6,
            rise: 0.3,
            lifeMs: 450,
            size: 0.3,
          });
        break;
      }
      case 'treeShaken': {
        const i = Number(e.treeId.replace('tree-', '')) - 1;
        const t = GROVE.trees[i];
        if (t) {
          p.burst('leaf', t.x, 2.6, t.z, 10, {
            spread: 1.4,
            speed: 0.6,
            rise: -0.2,
            lifeMs: 4000,
            size: 0.45,
            fadeMs: 300,
          });
          p.burst('petal', t.x, 2.8, t.z, 4, {
            spread: 1.2,
            speed: 0.5,
            rise: -0.1,
            lifeMs: 4000,
            size: 0.4,
            fadeMs: 300,
          });
        }
        break;
      }
      case 'collected': {
        const it = this.items.get(e.itemId);
        if (it)
          p.burst('sparkle', it.pos.x, it.y + 0.4, it.pos.z, 5, {
            spread: 0.2,
            speed: 0.6,
            rise: 0.8,
            lifeMs: 500,
            size: 0.4,
          });
        break;
      }
      case 'eggShaken': {
        const v = at(e.nubbinId);
        if (v)
          p.burst('dust', v.pos.x, 0.05, v.pos.z, 2, {
            spread: 0.2,
            speed: 0.5,
            rise: 0.3,
            lifeMs: 400,
            size: 0.35,
          });
        break;
      }
      default:
        break;
    }
  }

  private drawNubbin(
    v: NubbinView,
    n: Nubbin,
    world: World,
    yaw: number,
    alpha: number,
    nowMs: number,
    shadow: (x: number, y: number, z: number, r: number) => void,
  ): void {
    const sheet = this.sheets.forNubbin(n);
    const merged = isMerged(world, n.id);
    // A scene that seats Moss or Sable on a mark draws them there (render/scene-stage.ts).
    const held = this.staging?.active ? this.staging.nubbinHolds.get(n.id) : undefined;
    const x = held?.x ?? lerp(v.prev.pos.x, n.pos.x, alpha);
    const z = held?.z ?? lerp(v.prev.pos.z, n.pos.z, alpha);
    // On a hill mark, stand on the terrace (the sim's Nubbin is on flat ground).
    const y =
      lerp(v.prev.y, n.y, alpha) +
      (held && this.location === 'grove' ? terraceY(x, z) : 0) +
      (shroomHopY(world, n, world.timeMs - (1 - alpha) * SIM.stepMs) ?? 0);

    let key: string;
    let flip = false;
    let emote: EmoteShape = 'none';
    let opacity = 1;
    const glowTint = merged ? 1.35 + 0.15 * Math.sin(nowMs / 120) : 1;

    if (n.stage === 'egg') {
      const shaking = world.timeMs - n.lastShakeMs < EGG.shakeCooldownMs * 2;
      let f = 'idle';
      if (n.behavior.state === 'held' || n.behavior.state === 'carried') f = 'held';
      else if (shaking) f = Math.floor(nowMs / 90) % 2 === 0 ? 'wobbleL' : 'wobbleR';
      else if (n.hatchRemainingMs < 5000) f = 'crack2';
      else if (n.hatchRemainingMs < 20000) f = 'crack1';
      else if (n.hatchRemainingMs < EGG.hatchMs * 0.5 && Math.floor(nowMs / 700) % 6 === 0) {
        f = 'wobbleL';
      }
      key = frameKey(f, 'front', 0);
    } else if (n.stage === 'cocoon') {
      key = frameKey('idle', 'front', Math.floor(nowMs / 600) % 2);
      if (n.cocoonKind === 'depart') {
        opacity = 1 - Math.min(1, n.stageMs / LIFECYCLE.cocoonMs) * 0.85;
      } else if (n.cocoonKind === 'rebirth') {
        opacity = 0.85 + 0.15 * Math.sin(nowMs / 150);
      }
    } else {
      // M6 and K1: a scene that seats Moss draws his sit frames (awake), or the sleep ones on
      // a sheet without them; package a1 turns a listener's head to the speaker.
      const npose = pixelPose(n.id, nowMs, (c) => sheet.frames.has(frameKey(c, 'front', 0)));
      let clip = nubbinSits(this.staging?.stage, world.campaign?.mossId, n.id)
        ? sheet.frames.has(frameKey('sit', 'front', 0))
          ? 'sit'
          : 'sleep'
        : clipFor(n);
      // K5, K40: a walk-on faces its way; the partner at the Keeper's side keeps its pose.
      const hf = held ? this.staging?.faces.get(n.id) : undefined;
      const view = viewAngle(hf ?? npose?.face ?? n.facing, yaw);
      if (held && this.staging?.partner?.id === n.id) {
        const pp = this.staging.partnerPose();
        clip = this.staging.walking.has(n.id)
          ? 'walk'
          : pp === 'happy'
            ? 'happy'
            : pp === 'sad'
              ? 'sad'
              : 'idle';
      }
      // A look without the flap or swim clip moves with its walk instead; a hand-drawn sheet
      // without love or tumble falls back to happy or surprised.
      if (!sheet.frames.has(frameKey(clip, view.angle, 0))) {
        const stand: Record<string, string> = {
          flap: 'walk',
          swim: 'walk',
          sit: 'idle',
          love: 'happy',
          tumble: 'surprised',
        };
        clip = stand[clip] ?? clip;
      }
      if (clip !== v.clip) {
        v.clip = clip;
        v.clipStartMs = nowMs;
      }
      flip = view.flip;
      const def = CLIPS[clip as ClipName];
      const frame =
        clip === 'sit'
          ? npose?.clip === 'sit'
            ? npose.frame
            : Math.floor((nowMs - v.clipStartMs) / 600) % 2
          : def
            ? frameAt(def, nowMs - v.clipStartMs)
            : 0;
      key = frameKey(clip, view.angle, frame);
      emote = emoteFor(n);
      // K40: the partner's ball follows the line's mood.
      if (held && this.staging?.partner?.id === n.id) emote = this.staging.partnerEmote() ?? emote;
    }

    const rect = sheet.frames.get(key) ?? sheet.frames.values().next().value;
    shadow(x, y, z, 0.55);
    if (rect) {
      // Squash and stretch at draw time: a landing flattens, a hatch or evolution pops.
      let sw = 1;
      let sh = 1;
      if (v.pop) {
        const dur = v.pop.kind === 'squash' ? 260 : 420;
        const t = (nowMs - v.pop.startMs) / dur;
        if (t >= 1) v.pop = null;
        else {
          const s = Math.sin(Math.PI * t);
          if (v.pop.kind === 'squash') {
            sw = 1 + 0.22 * s;
            sh = 1 - 0.22 * s;
          } else {
            sw = 1 - 0.1 * s;
            sh = 1 + 0.28 * s;
          }
        }
      }
      this.batch.draw(
        {
          sheet,
          rect,
          flip,
          x,
          y,
          z,
          mode: 'billboard',
          opacity,
          tint: this.dim * glowTint,
          w: (rect.w / NATIVE_PPU) * sw,
          h: (rect.h / NATIVE_PPU) * sh,
        },
        { id: n.id, kind: 'nubbin' },
      );
    }

    // Footstep dust and swimming ripples.
    const inPond = n.behavior.state === 'swim';
    if (v.clip === 'walk' && !inPond && y < 0.05 && nowMs - v.lastDustMs > 300) {
      v.lastDustMs = nowMs;
      this.particles.burst('dust', x, 0.05, z, 1, {
        spread: 0.12,
        speed: 0.25,
        rise: 0.35,
        lifeMs: 380,
        size: 0.35,
      });
    } else if (
      n.behavior.state === 'perform' &&
      (n.behavior.itemId === 'sled' || n.behavior.itemId === 'bath') &&
      nowMs - v.lastDustMs > 140
    ) {
      v.lastDustMs = nowMs;
      this.particles.burst(n.behavior.itemId === 'bath' ? 'splash' : 'snow', x, 0.1, z, 2, {
        spread: 0.25,
        speed: 0.5,
        rise: 0.6,
        lifeMs: 450,
        size: 0.3,
      });
    } else if (inPond && nowMs - v.lastRippleMs > 650) {
      v.lastRippleMs = nowMs;
      this.particles.ripple(x, z);
    }

    if (v.bubble && nowMs < v.bubble.untilMs) emote = v.bubble.shape;
    else v.bubble = null;
    if (emote !== 'none' && n.stage !== 'egg' && n.stage !== 'cocoon') {
      const emotes = this.sheets.emotes(n.shadow);
      const erect = emotes.frames.get(frameKey(emote, 'front', Math.floor(nowMs / 400) % 2));
      if (erect) {
        this.batch.draw({
          sheet: emotes,
          rect: erect,
          flip: false,
          x,
          y: y + 2.15,
          z,
          mode: 'billboard',
        });
      }
    }
  }

  dispose(): void {
    this.batchLazy?.dispose();
    this.sheets.dispose();
    this.particles.dispose();
  }
}

/**
 * The ground the pixel view paints flat, in the sim's heights: the bridge deck, else the land
 * (less the hills, which Pixel builds as real terraces, MOVE-09) or the water's surface. The
 * Keeper is drawn by how far its feet are from this, so on a hill it stands on the shelf.
 */
function paintedGround(x: number, z: number): number {
  return deckY(x, z) ?? Math.max(groveHeight(x, z) - hillHeight(x, z), WATER_LEVEL);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Which clip a free Nubbin plays. */
export function clipFor(n: Nubbin): string {
  switch (n.behavior.state) {
    case 'wander':
    case 'findFood':
    case 'avoid':
      // Strong fliers flap their wings as they go.
      return flaps(n) ? 'flap' : 'walk';
    case 'swim':
      // Strong swimmers swim a stroke; everyone else wades through the shallows.
      return swimsStroke(n) ? 'swim' : 'walk';
    // The pose table follows the 3D one (`render3d/actors.ts`, `poseFor`).
    case 'nap':
    case 'shelter':
      return 'sleep';
    case 'eat':
      return 'eat';
    // LOOK-20: the Chao sit, legs out (a sheet without the clip stands idle); a low or hungry sitter is sad.
    case 'sit': {
      const mood = moodOf(n);
      return mood === 'sad' || mood === 'hungry' ? 'sad' : 'sit';
    }
    case 'cry':
      return 'sad';
    case 'greet':
    case 'play':
    case 'pet':
    case 'court':
    case 'perform':
    case 'fetch':
      return 'happy';
    case 'held':
    case 'carried':
      return 'held';
    case 'thrown':
      // A strong flier catches itself in the air and flutters down; the rest tumble.
      return flaps(n) ? 'flap' : 'tumble';
    case 'react':
      switch (n.behavior.reaction) {
        case 'love':
          return 'love';
        case 'happy':
          return 'happy';
        case 'dizzy':
          return 'dizzy';
        case 'surprised':
          return 'surprised';
        case 'sad':
          return 'sad';
        default:
          return 'idle';
      }
    default: {
      const mood = moodOf(n);
      if (mood === 'sad' || mood === 'hungry') return 'sad';
      return 'idle';
    }
  }
}

/** Resting emote shape by mood and alignment hint. */
export function emoteFor(n: Nubbin): EmoteShape {
  const mood = moodOf(n);
  if (n.behavior.state === 'nap') return 'zz';
  if (n.behavior.state === 'lesson') return 'question';
  if (n.behavior.state === 'perform') return 'star';
  if (n.behavior.state === 'court') return 'heart';
  // The floating ball is the Chao line's; other species show bubbles only when something is up.
  if (n.species !== 'chao' && mood === 'content') return 'none';
  // A wary Shadow Nubbin shows nothing it does not have to; a bonded one carries a dark heart.
  if (n.shadow && !n.bond && mood === 'content') return 'none';
  if (n.shadow && n.bond && mood === 'content') return 'heart';
  switch (mood) {
    case 'happy':
      return 'heart';
    case 'hungry':
      return 'exclaim';
    case 'sad':
    case 'dizzy':
      return 'spiral';
    default: {
      if (n.eternal === 'neutral') return 'star';
      const hint = n.eternal ?? (n.form ? n.form.band : childHint(n.alignment));
      return hint === 'sun' ? 'halo' : hint === 'moon' ? 'spiky' : 'ball';
    }
  }
}
