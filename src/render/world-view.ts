import { openSky } from './cave-bands';
import { ridePose } from './ride-pose';
import { STALL_SPOTS } from '../config/grove-layout';
import { memorialSpot } from './memorial-spot';
import { Vector3 } from 'three';
import { Y_STATE } from './dress-y-state';
import { LOOK_STATE, nubbinSits, storyId } from '../config/npc-looks';
import { DUNGEON, EGG, FERN_STONE, LIFECYCLE, UI } from '../config/tuning';
import { childHint } from '../sim/alignment';
import { moodOf } from '../sim/needs';
import { flaps } from '../sim/stats';
import type { DungeonRun, Location, Nubbin, SimEvent, Vec2, World } from '../sim/types';
import { cellCentre, runFloor, type Cell, type Floor } from '../sim/dungeon';
import { rumbleOpen } from '../sim/dungeon-rumble';
import { keeperDip, keeperFooting, keeperGliding, keeperMantle, keeperRoll } from '../sim/keeper';
import { buildParticleSheet } from './sprites/particles-art';
import { deckY, groveHeight, hillHeight, WATER_LEVEL } from '../sim/terrain';
import { KEEPER_WADE, KEEPER_ACCEL, JUMP } from '../config/tuning-sim';
import { eggAntics } from './egg-antics';
import { sitWithBeat, towardKeeper } from './sit-with';
import { quipBeat } from './evolve-quip';
import { keeperIdlePose } from '../sim/keeper-idle';
import {
  BUSH,
  FOOTFALL,
  JUMP_TOYS,
  KEEPER_JUMP_FX,
  POND_DIP,
  RUN_MODE,
} from '../config/tuning-move';
import { TapPath, type TapMark } from './tap-path';
import { buildHeldRingSheet, HeldRing } from './held-ring';
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
import { fernStones } from '../sim/fern-stone';
import { townUnlocks } from '../sim/town';
import { drawVillage } from './region-village';
import { Particles } from './particles';
import { NATIVE_PPU, SpriteBatch } from './sprite-batch';
import { EmoteSprings } from './emote-spring';
import { swimClip, swimStyle } from './swim-style';
import { cocoonPulse } from './sprites/cocoon';
import { landBeatFor, PET_BEAT_BURST, PetBeats, petBeatFor } from './pet-reactions';
import { noticeFace } from './notice';
import { soulEmote } from './soul-emotes';
import { bigBubbles, emoteFocused, emoteScale } from './emote-size';
import { SWIM_CLIPS } from './sprites/chao';
import { flightY } from '../sim/flight';
import { signatureAt } from './signature';
import { FLIGHT } from '../config/tuning-look';
import { EMOTE_SPRING, SWIM_STYLE } from '../config/tuning-look';
import { CLIPS, frameAt, frameKey, type ClipName } from './sprites/animations';
import { viewAngle } from './sprites/angles';
import type { FrameRect, SpriteSheet } from './sprites/atlas';
import { bubbleFor, type EmoteShape } from './sprites/emote';
import { wantsFirstFruit } from '../sim/first-feed';
import { buildShadowSheet, decorFrame } from './sprites/props';
import { buildTapFlagSheet } from './sprites/tap-flags';
import { TAP_FLAG } from '../config/tuning-move-r10';
import { SheetCache } from './sprites/sheets';
import { JUMP_TOY_SIZE, jumpToySheet, shroomSquash } from './scenery-jump';
import { hopFlagsShown, hopGhostAt } from './hop-course-view';
import { springBouncedAt } from '../sim/decorate';
import { shroomHopY } from '../sim/behavior';
import { terraceY, type SceneStager } from './scene-stage';
import { PIXEL_BUILDINGS, PIXEL_VIEW, rectOf } from './stage-api';
import { STAGE2 } from '../config/tuning';
import { HELD_RING } from '../config/tuning-tech';
import { EYE_TRACK, HELD_REACT, RARITY } from '../config/tuning';
import { heldMood, heldStyle, type HeldMood } from './held-mood';
import { gagAt } from './gag-play';
import { cocoonShake, revealTurn } from './evolve-reveal';
import { rarityOf } from './rarity';
import { pixelPose } from './stage-pose';
import { glintPlace, glintShape } from './sprites/shiny-glint';

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
  /** R0549: draw emote balls big this frame (far zoom or Big mood bubbles). */
  private emoteBig = false;
  /** LOOK-16: each Nubbin's emote ball on its spring. */
  private readonly emoteSprings = new EmoteSprings();
  /** FUN-09: each Nubbin's pet-action beat. */
  private readonly petBeats = new PetBeats();
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
  /** TECH-02: the ring under a held Nubbin and the ease down after a place. */
  private readonly heldRing = new HeldRing();
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
  /** R0035 (lane A r10): the tap marker's ✕ / ⤒ glyphs. */
  private tapFlagSheet: SpriteSheet | null = null;
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
    // An act's camp and fields are under the open sky (lane B, R0147): daylight, not the cave.
    const underground = this.location === 'dungeon' && !openSky(this.cave);
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
      // FUN-09: each pet action queues its own beat over the sim's reaction.
      if (e.kind === 'interacted') this.petBeats.queue(e.nubbinId, e.action, e.ok, nowMs);
      // R0536: a favourite or disliked fruit plays its own beat.
      if (e.kind === 'fruitTaste') this.petBeats.queueKind(e.nubbinId, e.taste, nowMs);
      // R0551: a pet and a throw's landing play out by personality.
      if (e.kind === 'petted') this.petBeats.queueKind(e.nubbinId, petBeatFor, nowMs);
      if (e.kind === 'landed') this.petBeats.queueKind(e.nubbinId, landBeatFor, nowMs);
      // R0532: a grumpy refusal huffs.
      if (e.kind === 'highFiveRefused') {
        const v = this.nubbins.get(e.nubbinId);
        if (v) v.bubble = { shape: 'puff', untilMs: nowMs + UI.bubbleMs };
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
    // R0549 (lane A r8): mood bubbles read on a phone at the far zoom, or when set big.
    this.emoteBig = camera.currentZoomIndex === 0 || bigBubbles(world);
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

    // TECH-02: under a held Nubbin, a ring that turns green when letting go would be a place.
    this.heldRing.frame(world, nowMs, this.particles.reduceMotion);
    const hr = this.heldRing.spot;
    if (hr) {
      const rs = this.sheets.get('tech:heldRing', buildHeldRingSheet);
      const rect = rs.frames.get(frameKey(hr.gentle ? 'heldRingGentle' : 'heldRing', 'front', 0));
      if (rect)
        batch.draw({
          sheet: rs,
          rect,
          flip: false,
          x: hr.x,
          y: HELD_RING.lift,
          z: hr.z,
          mode: 'flat',
          w: HELD_RING.radius * 2,
          h: HELD_RING.radius * 2,
          opacity: hr.gentle ? 0.95 : 0.7,
        });
    }

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
      // R0095: the village square at the lane's end (`render/region-village.ts`).
      drawVillage(batch, world, scenery, shadow, (x, z) => this.lightAt(x, z));
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
      // R0007: a turned fence, bench or bed shows its three-quarter or end-on frame.
      const turned = decorFrame(d.kind, d.yaw, yaw);
      const rect = props.frames.get(turned.key);
      if (!rect) continue;
      const flat = d.kind === 'pathTile';
      batch.draw(
        {
          sheet: props,
          rect,
          flip: turned.flip,
          x: d.pos.x,
          y: flat ? 0.02 : 0,
          z: d.pos.z,
          mode: flat ? 'flat' : 'billboard',
          tint: this.dim,
        },
        { id: d.id, kind: 'decor' },
      );
    }
    // MOVE-63: the hop course's flags and the best run's ghost.
    if (home && !bare) {
      const toys = jumpToySheet();
      for (const f of hopFlagsShown(world)) {
        const rect = toys.frames.get(f.kind === 'start' ? 'flagStart' : 'flag');
        if (!rect) continue;
        batch.draw({
          sheet: toys,
          rect,
          flip: false,
          x: f.x,
          y: Math.max(0, keeperFooting(world, f.x, f.z).y - paintedGround(f.x, f.z)),
          z: f.z,
          mode: 'billboard',
          w: 1.2,
          h: 1.2,
          opacity: f.kind === 'after' ? 0.45 : 1,
          tint: this.dim,
        });
      }
      const gh = hopGhostAt(world, world.timeMs - (1 - alpha) * SIM.stepMs);
      const grect = toys.frames.get('ghost');
      if (gh && grect)
        batch.draw({
          sheet: toys,
          rect: grect,
          flip: false,
          x: gh.x,
          y: Math.max(0, gh.y - paintedGround(gh.x, gh.z)),
          z: gh.z,
          mode: 'billboard',
          w: 1.1,
          h: 1.1,
          opacity: 0.5,
        });
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
    // R0313: Fern's cairn by the signpost, one stone a chapter, the faced one on top.
    const cairn = home && !bare ? fernStones(world) : 0;
    const faced = props.frames.get(frameKey('prop-fernStone', 'front', 0));
    const flat = props.frames.get(frameKey('prop-flatStone', 'front', 0));
    for (let i = 0; i < cairn && faced && flat; i++) {
      const top = i === cairn - 1;
      batch.draw(
        {
          sheet: props,
          rect: top ? faced! : flat!,
          flip: false,
          x: FERN_STONE.x + ((i * 37) % 7) * 0.02 - 0.06,
          y: i * 0.13,
          z: FERN_STONE.z,
          mode: 'billboard',
          w: top ? 0.42 : 0.5 - i * 0.02,
          h: top ? 0.32 : 0.2,
          tint: this.lightAt(FERN_STONE.x, FERN_STONE.z),
        },
        { id: FERN_STONE.id, kind: 'storyProp' },
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
    // R0352: left alone, the Keeper reads the letter, pats a pocket, then sits on the grass.
    const kidle = kpose || moving ? null : keeperIdlePose(world);
    const kidleKey = kidle
      ? frameKey(
          kidle === 'sit' ? 'sit' : kidle === 'letter' ? 'g-down' : 'g-chest',
          kview.angle,
          kidle === 'sit' && !this.particles.reduceMotion ? Math.floor(nowMs / 900) % 2 : 0,
        )
      : '';
    // R0085: on a Nubbin's back the Keeper sits, smaller and raised (render/ride-pose.ts).
    const kride = kpose ? null : ridePose(world, nowMs, moving, this.particles.reduceMotion);
    const krideRect = kride?.sits ? ksheet.frames.get(frameKey('sit', kview.angle, 0)) : undefined;
    const krect =
      krideRect ??
      ksheet.frames.get(
        kpose?.clip
          ? frameKey(kpose.clip, kview.angle, kpose.frame)
          : kidleKey && ksheet.frames.has(kidleKey)
            ? kidleKey
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
      // R0035: a grey ✕ flat where a refused tap landed, or a bobbing ⤒ over a ledge.
      const fl = this.tapPath.flag;
      const fa = this.tapPath.flagAlpha(nowMs, calm);
      if (fl && fa > 0) {
        this.tapFlagSheet ??= buildTapFlagSheet();
        const up = fl.kind === 'jump';
        const frect = this.tapFlagSheet.frames.get(frameKey(up ? 'tapJump' : 'tapCant', 'front', 0));
        const bob = up && !calm ? Math.sin((nowMs / TAP_FLAG.bobMs) * Math.PI * 2) * TAP_FLAG.bob : 0;
        if (frect)
          batch.draw({
            sheet: this.tapFlagSheet,
            rect: frect,
            flip: false,
            x: fl.x,
            y: fl.y - paintedGround(fl.x, fl.z) + (up ? TAP_FLAG.lift + bob : 0.02),
            z: fl.z,
            mode: up ? 'billboard' : 'flat',
            w: TAP_FLAG.size,
            h: TAP_FLAG.size,
            opacity: fa,
          });
      }
    }
    const jclip =
      kpose?.clip || kHeld || krideRect ? null : this.keeperJumpClip(world, nowMs, off - floor);
    const jrect = jclip ? ksheet.frames.get(frameKey(jclip, kview.angle, 0)) : undefined;
    const jscale = jrect && !this.particles.reduceMotion ? this.jumpScale(jclip) : null;
    const kdrawn = jrect ?? krect;
    if (kdrawn) {
      batch.draw({
        sheet: ksheet,
        rect: kdrawn,
        ...(jscale
          ? { w: (kdrawn.w / NATIVE_PPU) * jscale.w, h: (kdrawn.h / NATIVE_PPU) * jscale.h }
          : kride
            ? { w: (kdrawn.w / NATIVE_PPU) * kride.scale, h: (kdrawn.h / NATIVE_PPU) * kride.scale }
            : {}),
        flip: kview.flip,
        x: kx + (kride?.dx ?? 0),
        y: ky + (kride?.lift ?? 0),
        z: kz + (kride?.dz ?? 0),
        mode: 'billboard',
        tint: this.dim,
      });
      // The silhouette through whatever stands in front, in the Keeper's trim colour; not
      // through its own carrier on a ride (R0085).
      if (!kride?.sits) batch.markXray(k.alignment === 'moon' ? KEEPER_XRAY.moon : KEEPER_XRAY.sun);
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
    // Lane B round 5: a rumble room's doorway glows until it is won (R0282).
    const door = crystal ? rumbleOpen(run, f) : null;
    if (door && crystal) {
      const glow = this.particles.reduceMotion ? 1.4 : 1.4 + 0.25 * Math.sin(nowMs / 260);
      for (const c of door.door) {
        const p = cellCentre(f, c);
        batch.draw({
          sheet,
          rect: crystal,
          flip: false,
          x: p.x,
          y: 0.02,
          z: p.z,
          mode: 'flat',
          w: cell * 0.8,
          h: cell * 0.8,
          tint: glow,
        });
      }
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
    // TECH-31: at most one new sheet baked a frame; a changed look may wait a frame.
    const sheet = this.sheets.forNubbin(n, true);
    const merged = isMerged(world, n.id);
    // A scene that seats Moss or Sable on a mark draws them there (render/scene-stage.ts).
    const held = this.staging?.active ? this.staging.nubbinHolds.get(n.id) : undefined;
    const x = held?.x ?? lerp(v.prev.pos.x, n.pos.x, alpha);
    const z = held?.z ?? lerp(v.prev.pos.z, n.pos.z, alpha);
    // LOOK-24: a strong flier on a flight leg is drawn in the air; the shadow shrinks below.
    const fly = held ? null : flightY(n, world.timeMs - (1 - alpha) * SIM.stepMs);
    // LOOK-44: an idle favourite plays its signature beat now and then (render/signature.ts).
    const sig =
      !held && !fly && n.stage !== 'egg' && n.stage !== 'cocoon' && clipFor(n) === 'idle'
        ? signatureAt(n.id, n.species, nowMs, this.particles.reduceMotion)
        : null;
    // On a hill mark, stand on the terrace (the sim's Nubbin is on flat ground).
    const y = Math.max(
      lerp(v.prev.y, n.y, alpha) +
        (held && this.location === 'grove' ? terraceY(x, z) : 0) +
        (shroomHopY(world, n, world.timeMs - (1 - alpha) * SIM.stepMs) ?? 0) +
        (fly?.y ?? 0) +
        (sig?.dy ?? 0),
      this.heldRing.lowerY(n.id, nowMs),
    );

    let key: string;
    let flip = false;
    let eggHop = 0;
    let swDx = 0;
    let swDz = 0;
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
      // R0351: its own wobble now and then, a hop near the end, and the foot on a third shake.
      const ant = eggAntics(n, world.timeMs, nowMs, x * 997, this.particles.reduceMotion);
      if (ant.foot) f = 'foot';
      else if (f === 'idle' && ant.wobble) f = ant.wobble < 0 ? 'wobbleL' : 'wobbleR';
      eggHop = ant.hop;
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
      if (fly) clip = fly.phase === 'glide' ? 'glide' : 'flap';
      // R0355: sitting with the Keeper, it leans in, then nods off on the Keeper's foot.
      const sw = sitWithBeat(world, n, world.timeMs);
      if (sw?.doze && sheet.frames.has(frameKey('sleep', 'front', 0))) clip = 'sleep';
      if (sw?.lean) {
        const dir = towardKeeper(world, n);
        swDx = dir.x * 0.12 * sw.lean;
        swDz = dir.z * 0.12 * sw.lean;
      }
      // K5, K40: a walk-on faces its way; the partner at the Keeper's side keeps its pose.
      const hf = held ? this.staging?.faces.get(n.id) : undefined;
      // R0354: after the card, it turns round to see its tail, wobbles and sits down.
      const qb = held ? null : quipBeat(n.id, nowMs, this.particles.reduceMotion);
      if (qb?.phase === 'wobble') clip = 'tumble';
      else if (qb?.phase === 'sit') clip = 'sit';
      else if (qb) clip = 'idle';
      // LOOK-62: a newly evolved form spins one turn as it lands.
      const turn =
        (qb?.turn ?? 0) +
        (n.stage === 'adult' && v.pop?.kind === 'pop'
          ? revealTurn(v.pop.startMs, nowMs, this.particles.reduceMotion)
          : 0);
      // R0533 (lane A r9): a resting Nubbin turns to look at the Keeper close by.
      const look = held ? null : noticeFace(n, world.keeper.pos);
      const view = viewAngle((hf ?? npose?.face ?? look ?? n.facing) + turn, yaw);
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
          // LOOK-23: a sheet without the paddle or crawl swims its stock stroke, or walks.
          paddle: sheet.frames.has(frameKey('swim', view.angle, 0)) ? 'swim' : 'walk',
          crawl: sheet.frames.has(frameKey('swim', view.angle, 0)) ? 'swim' : 'walk',
          flap: 'walk',
          glide: sheet.frames.has(frameKey('flap', view.angle, 0)) ? 'flap' : 'walk',
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
      const def =
        fly && clip === 'flap'
          ? { frames: 2, ms: 500 / FLIGHT.flapHz, loop: true }
          : (CLIPS[clip as ClipName] ?? SWIM_CLIPS[clip]);
      const frame =
        clip === 'sit'
          ? npose?.clip === 'sit'
            ? npose.frame
            : Math.floor((nowMs - v.clipStartMs) / 600) % 2
          : def
            ? frameAt(def, nowMs - v.clipStartMs)
            : 0;
      key = frameKey(clip, view.angle, frame);
      // LOOK-52: standing idle near the Keeper, the eyes glance its way across the screen
      // (never on the blink frame).
      const kp = world.keeper.pos;
      const kdx = kp.x - n.pos.x;
      const kdz = kp.z - n.pos.z;
      if (
        clip === 'idle' &&
        frame % 8 !== 7 &&
        !held &&
        Math.hypot(kdx, kdz) < EYE_TRACK.range &&
        sheet.frames.has(frameKey('glance', view.angle, 0))
      ) {
        const sx = kdx * Math.cos(yaw) - kdz * Math.sin(yaw);
        if (Math.abs(sx) > EYE_TRACK.deadZone)
          key = frameKey('glance', view.angle, sx > 0 !== view.flip ? 1 : 0);
      }
      if (sig && sheet.frames.has(frameKey(sig.clip, view.angle, sig.frame))) {
        key = frameKey(sig.clip, view.angle, sig.frame);
        flip = flip !== sig.flip;
      }
      // FUN-04: a content idle Nubbin plays its personality's comic gag now and then.
      const mood = moodOf(n);
      const gag =
        !sig && !held && clip === 'idle'
          ? gagAt(n, nowMs, mood === 'content' || mood === 'happy')
          : null;
      const gkey = gag ? frameKey(gag.look.clip, view.angle, gag.frame) : '';
      const gagOn = !!gag && sheet.frames.has(gkey);
      if (gagOn) key = gkey;
      emote = emoteFor(n);
      if (gagOn && gag.look.emote !== 'none') emote = gag.look.emote;
      // R0355: the snore bubble swells, pops with a sparkle, and the Zs carry on between.
      if (sw?.doze) emote = sw.bubble > 0 ? 'ball' : 'zz';
      if (sw && sw.bubbleN > 0 && sw.bubble === 0 && (SNORE_POPS.get(n.id) ?? 0) < sw.bubbleN) {
        SNORE_POPS.set(n.id, sw.bubbleN);
        this.particles.burst('sparkle', x, Math.max(0, y) + 1.1, z, 3, {
          spread: 0.25,
          rise: 0.3,
          lifeMs: 450,
        });
      }
      if (gagOn && gag.look.burst && gag.frame === 0 && (GAG_BURSTS.get(n.id) ?? 0) < nowMs - 900) {
        GAG_BURSTS.set(n.id, nowMs);
        const kind = gag.look.burst === 'notes' ? 'note' : gag.look.burst;
        this.particles.burst(kind, x, Math.max(0, y) + 1.2, z, 2, {
          spread: 0.35,
          rise: 0.7,
          lifeMs: 700,
        });
      }
      // LOOK-50: held, it hugs, dangles or flails by affection, with a heart or a swirl.
      if (clip === 'held') {
        const mood = heldMood(n, world.keeper.alignment);
        // R0551 (lane A r9): a hug by personality: kicking legs, stiff, or limp as a noodle.
        const style = heldStyle(n, mood);
        const hz = mood === 'flail' ? HELD_REACT.flailHz : HELD_REACT.dangleHz;
        const swings = (mood !== 'hug' || style === 'kick') && !this.particles.reduceMotion;
        const hf = swings ? Math.floor((nowMs * hz * 2) / 1000) % 2 : 0;
        const hk = frameKey(HELD_CLIPS[style === 'noodle' ? 'dangle' : mood], view.angle, hf);
        if (sheet.frames.has(hk)) key = hk;
        if (mood === 'hug' && style !== 'stiff') emote = 'heart';
        else if (mood === 'flail') emote = 'spiral';
      }
      // K40: the partner's ball follows the line's mood.
      if (held && this.staging?.partner?.id === n.id) emote = this.staging.partnerEmote() ?? emote;
    }

    // FUN-09: a pet action's own beat over the sim's reaction: its frame, squash and nudge.
    this.petBeats.calm = this.particles.reduceMotion;
    this.petBeats.keeper = world.keeper.pos;
    const beat = n.stage === 'egg' || n.stage === 'cocoon' ? null : this.petBeats.frame(n, nowMs);
    if (beat?.clip) {
      const angle = key.split(':')[1] ?? 'front';
      const bkey = frameKey(beat.clip, angle, beat.frame ?? Math.floor(nowMs / 180) % 2);
      if (sheet.frames.has(bkey)) key = bkey;
    }
    if (beat?.fresh) {
      const kind = PET_BEAT_BURST[beat.kind];
      if (kind)
        this.particles.burst(kind, x, y + 1.6, z, kind === 'dust' ? 6 : 3, {
          spread: 0.4,
          rise: 0.8,
          lifeMs: 700,
        });
    }
    if (sig?.burst)
      this.particles.burst(sig.burst, x, Math.max(0, y) + (sig.burstAt ?? 0.5) * 1.4, z, 2, {
        spread: 0.35,
        rise: 0.6,
        lifeMs: 600,
      });
    const rect = sheet.frames.get(key) ?? sheet.frames.values().next().value;
    shadow(x, Math.max(0, y), z, 0.55);
    if (rect) {
      // Squash and stretch at draw time: a landing flattens, a hatch or evolution pops.
      let sw = 1;
      let sh = 1;
      // LOOK-25: a cocoon breathes, 1 to 1.03 at 0.8 Hz.
      if (n.stage === 'cocoon') sw = sh = cocoonPulse(nowMs);
      if (beat) {
        sw *= beat.sw;
        sh *= beat.sh;
      }
      if (sig) {
        sw *= sig.sw;
        sh *= sig.sh;
      }
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
      const tier = n.stage === 'egg' ? 'common' : rarityOf(n);
      const phase = [...n.id].reduce((a, c) => a + c.charCodeAt(0) * 37, 0);
      // LOOK-58: a legendary one sheds a soft mote now and then.
      if (
        tier === 'legendary' &&
        !this.particles.reduceMotion &&
        (nowMs + phase) % RARITY.legendaryMoteMs < 20
      )
        this.particles.burst('mote', x, Math.max(0, y) + 0.9, z, 1, {
          spread: 0.5,
          rise: 0.5,
          lifeMs: 1200,
        });
      this.batch.draw(
        {
          sheet,
          rect,
          flip,
          // LOOK-62: the evolving cocoon shakes in its last moments.
          x: x + swDx + (beat?.dx ?? 0) * 2 + cocoonShake(n, nowMs) * 0.08,
          // LOOK-37: an Eternal floats a hand's breadth up with a slow bob.
          y:
            (beat?.dy ?? 0) * 2 + eggHop + (n.eternal ? y + 0.1 + Math.sin(nowMs / 770) * 0.03 : y),
          z: z + swDz,
          mode: 'billboard',
          opacity,
          tint: this.dim * glowTint,
          w: (rect.w / NATIVE_PPU) * sw,
          h: (rect.h / NATIVE_PPU) * sh,
        },
        { id: n.id, kind: 'nubbin' },
      );
      // LOOK-30: a shiny's glint sweeps its head every 2 s, an overlay from one shared sheet
      // laid on the head in the sprite's own plane, a hair toward the camera.
      const cam = PIXEL_VIEW.camera;
      // LOOK-58: a rare or legendary one that is not shiny glints too, half as often (4 s).
      const rareBeat =
        (tier === 'rare' || tier === 'legendary') &&
        Math.floor((nowMs + phase) / (RARITY.rareGlintMs / 2)) % 2 === 0;
      if ((n.shiny || n.heirloom || rareBeat) && n.species === 'chao' && n.stage !== 'egg' && cam) {
        const shape = glintShape(n);
        const g = glintPlace(key, shape, nowMs, phase);
        const gs = this.sheets.shinyGlint(shape.grow);
        const grect = g ? gs.frames.get(g.key) : undefined;
        if (g && grect) {
          const W = (rect.w / NATIVE_PPU) * sw;
          const H = (rect.h / NATIVE_PPU) * sh;
          const m = cam.matrixWorld.elements;
          const r = (flip ? -g.right : g.right) * W;
          const u = g.up * H;
          this.batch.draw({
            sheet: gs,
            rect: grect,
            flip,
            x: x + Math.cos(yaw) * r + m[4]! * u + m[8]! * 0.04,
            y: y + m[5]! * u + m[9]! * 0.04,
            z: z - Math.sin(yaw) * r + m[6]! * u + m[10]! * 0.04,
            mode: 'billboard',
            opacity,
            tint: this.dim,
            w: g.w * W,
            h: g.h * H,
          });
        }
      }
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
    } else if (inPond && nowMs - v.lastRippleMs > SWIM_STYLE.strokeMs[swimStyle(n)]) {
      // LOOK-23: every stroke sends a ring and two to four splash drops.
      v.lastRippleMs = nowMs;
      this.particles.ripple(x, z);
      this.particles.burst('splash', x, 0.1, z, 2 + (Math.floor(nowMs / 97) % 3), {
        spread: 0.2,
        speed: 0.4,
        rise: 0.7,
        lifeMs: 380,
        size: 0.25,
      });
    }

    if (v.bubble && nowMs < v.bubble.untilMs) emote = v.bubble.shape;
    else v.bubble = null;
    if (emote !== 'none' && n.stage !== 'egg' && n.stage !== 'cocoon') {
      const emotes = this.sheets.emotes(n.shadow);
      const erect = emotes.frames.get(frameKey(emote, 'front', Math.floor(nowMs / 400) % 2));
      if (erect) {
        // LOOK-16: the ball trails an anchor over the swept-back point on a soft spring,
        // rounded to whole native pixels, and squashes on a landing or pops on a new shape.
        const back = EMOTE_SPRING.backPixel;
        const ball = this.emoteSprings.step(
          n.id,
          x - Math.sin(n.facing) * back,
          y + 2.15,
          z - Math.cos(n.facing) * back,
          emote,
          nowMs,
          EMOTE_SPRING.clampPixel,
          1 / NATIVE_PPU,
          v.pop?.kind === 'squash' ? v.pop.startMs : null,
        );
        // R0549: bigger at the far zoom; a fresh reaction pops to 2× (lifted to clear the head).
        const es = emoteScale(
          this.emoteBig || emoteFocused(n.id),
          v.bubble ? nowMs - (v.bubble.untilMs - UI.bubbleMs) : null,
          this.particles.reduceMotion,
        );
        this.batch.draw({
          sheet: emotes,
          rect: erect,
          flip: false,
          x: ball.x,
          y: ball.y + ((es - 1) * erect.h) / NATIVE_PPU / 2,
          z: ball.z,
          mode: 'billboard',
          w: (erect.w / NATIVE_PPU) * ball.sx * es,
          h: (erect.h / NATIVE_PPU) * ball.sy * es,
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
      // LOOK-23: each swims its own stroke: a paddle, a breaststroke or a crawl.
      return swimClip(n);
    // The pose table follows the 3D one (`render3d/actors.ts`, `poseFor`).
    case 'nap':
      return 'sleep';
    // R0534: sheltering walks to its tree, then huddles (a sit, eyes open), never the sleep pose.
    case 'shelter':
      return n.behavior.target ? 'walk' : 'sit';
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
      // R0539: a visit to a friend's flower is a quiet sit.
      return n.behavior.itemId === 'visitFlower' && !n.behavior.target ? 'sit' : 'happy';
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

/** FUN-04: when each Nubbin last threw up its gag's particles (notes, dust, a splash). */
const GAG_BURSTS = new Map<string, number>();
/** R0355: the last snore bubble popped, per Nubbin, so each pops once. */
const SNORE_POPS = new Map<string, number>();

/** LOOK-50: the baked frames for each way of being held. */
const HELD_CLIPS: Record<HeldMood, string> = {
  hug: 'heldHug',
  dangle: 'heldDangle',
  flail: 'heldFlail',
};

/** Resting emote shape by mood and alignment hint. */
export function emoteFor(n: Nubbin): EmoteShape {
  const mood = moodOf(n);
  if (n.behavior.state === 'nap') return 'zz';
  // Lane A r9: the new acts' own balls (render/soul-emotes.ts).
  const own = soulEmote(n);
  if (own) return own;
  // TECH-01: a new hatchling asks for its first fruit.
  if (wantsFirstFruit(n)) return 'fruit';
  // R0532 (lane A r8): a harrumph huffs.
  if (n.behavior.state === 'sit' && n.behavior.itemId === 'harrumph') return 'puff';
  if (n.behavior.state === 'lesson') return 'question';
  if (n.behavior.state === 'perform') {
    // R0542 (lane A r8): a comforter carries a heart over; a prankster a spiky grin.
    const id = n.behavior.itemId ?? '';
    if (id.startsWith('prank:')) return 'spiky';
    return id === 'visitFlower' || id.startsWith('comfort:') ? 'heart' : 'star';
  }
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
