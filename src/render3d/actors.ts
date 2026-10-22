import * as THREE from 'three';
import type { EmoteShape } from '../render/sprites/emote';
import { frameKey } from '../render/sprites/animations';
import { emoteFor } from '../render/world-view';
import type { PoseName, Rigged } from '../samples/species';
import type { Floor } from '../sim/dungeon';
import type { Location, Nubbin, Vec2, World } from '../sim/types';
import { keeperLook, nubbinLook, openingLooks, takePool, type Look } from './creature-pool';
import { Crowd, crowdFor, type CrowdOptions } from './crowd';
import { vectorEmotes } from './emote-vector';
import { QuadCloud } from './quad-particles';
import { gaitTime } from './gait';
import { WATER_LEVEL, groveHeight } from './terrain';
import { GROVE, GROVE3D, LIFECYCLE, READ3D, THROW } from '../config/tuning';
import { isMerged } from '../sim/partners';
import { MergedGlow } from './glow';
import { memorialFlower, updateMemorials } from './memorial';
import { Dresser } from './dress';
import { ItemKit, eggFamily, placeStand, shellKey } from './item-kit';
import { flaps, swimsStroke } from '../sim/stats';
import { moodOf } from '../sim/needs';
import { KEEPER_HAND_FROM_ELBOW } from '../samples/keeper-spec';

/**
 * Everything that moves in the 3D Grove: the Nubbins and the Keeper as pooled rigs,
 * eggs and cocoons as simple shells, items as small props, the emote ball over each
 * head, the highlight ring under the thing under the pointer, and tap sparkles.
 * Positions are interpolated between sim steps, as the pixel view does.
 */
interface Snapshot {
  pos: Vec2;
  y: number;
}

interface Actor {
  key: string;
  rig: Rigged | null;
  /** The egg or cocoon shell shown instead of a rig for those stages. */
  shell: THREE.Mesh | null;
  /** The look still being sculpted, and the soft stand-in shown until it is ready. */
  look: Look | null;
  stand: THREE.Mesh | null;
  /** While thrown: when the flight began and how long it should last, for the tumble. */
  flight: { startMs: number; totalMs: number } | null;
  /** The ring spreading on the water around a swimmer. */
  ripple: THREE.Mesh | null;
  /** The scale a squash or pop was laid over this frame, put back before the next. */
  squash: { o: THREE.Object3D; base: THREE.Vector3 } | null;
  prev: Snapshot;
  pose: PoseName;
  emote: THREE.Sprite;
  /** The emote frame showing (Shadow sheet prefix, shape, flip frame), or '' for none. */
  emoteKey: string;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * How far a body in the pond sinks, as a fraction of its scale (the sculpt is about 3
 * units tall): a swimmer to the shoulders, a wader (no stroke yet) only to the belly.
 */
const GROVE3D_SINK = 1.1;
const GROVE3D_WADE = 0.6;

/**
 * Sim behaviour and handling, mapped to the species format's poses, by the pixel view's
 * rule (`clipFor`): crying and a low or hungry mood at rest are sad, the reactions get
 * their own body, a thrown body tumbles, a flyer flaps as it moves and a swimmer strokes
 * (any other Nubbin in the pond wades, which is the walk).
 */
export function poseFor(n: Nubbin, moving: boolean, petted: boolean): PoseName {
  if (petted) return 'pet';
  const walk = (): PoseName => (moving ? (flaps(n) ? 'flap' : 'walk') : 'idle');
  switch (n.behavior.state) {
    case 'held':
    case 'carried':
    case 'pet':
      return 'pet';
    case 'nap':
    case 'shelter':
      return 'sleep';
    case 'eat':
      return 'eat';
    case 'play':
    case 'greet':
    case 'court':
    case 'perform':
    case 'fetch':
      return 'happy';
    case 'cry':
      return 'sad';
    case 'swim':
      return swimsStroke(n) ? 'swim' : 'walk';
    case 'thrown':
      return 'tumble';
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
          return walk();
      }
    case 'wander':
    case 'findFood':
    case 'avoid':
      return walk();
    default: {
      if (moving) return walk();
      const mood = moodOf(n);
      return mood === 'sad' || mood === 'hungry' ? 'sad' : 'idle';
    }
  }
}

interface KeeperSlot {
  key: string;
  look: Look;
  rig: Rigged | null;
  stand: THREE.Mesh | null;
}

/** The tap sparkles' colour. */
const SPARK = new THREE.Color('#fff2a8');
export class Actors {
  readonly group = new THREE.Group();
  readonly pool = takePool();
  private readonly nubbins = new Map<string, Actor>();
  private readonly items = new Map<
    string,
    { mesh: THREE.Object3D; lift: number; prev: Snapshot }
  >();
  private readonly memorials = new Map<string, THREE.Group>();
  private keeper: KeeperSlot | null = null;
  /** The co-op partner's Keeper, while co-op is on, and where it was at the last step. */
  private keeper2: KeeperSlot | null = null;
  private keeper2Prev: Vec2 | null = null;
  /** Eggs, cocoons, items and stand-ins, with their geometry and materials shared. */
  readonly kit = new ItemKit();
  /** Hats, scarves and glasses on the Chao line's rigs. */
  private readonly dresser = new Dresser();
  /** The world of the last frame, so the loading bar can count every Nubbin to be drawn. */
  private world: World | null = null;
  private keeperPrev: Vec2 = { x: 0, z: 0 };
  private keeperMoving = false;
  private readonly emoteMats = new Map<string, THREE.SpriteMaterial>();
  /** Reaction bubbles (heart, !, ?, spiral) by Nubbin id, shown over the ball until expiry. */
  private readonly bubbles = new Map<string, { shape: EmoteShape; untilMs: number }>();
  /** A short squash (landing) or pop (hatch, evolve, rebirth) by Nubbin id. */
  private readonly pops = new Map<string, { kind: 'squash' | 'pop'; startMs: number }>();
  private readonly highlight: THREE.Mesh;
  private readonly glow: MergedGlow;
  private highlightId: string | null = null;
  /** For a highlighted thing that is not a Nubbin or an item: where it is now, and how wide. */
  private highlightSpot: (() => { x: number; z: number; r: number } | null) | null = null;
  private readonly sparks: Array<{ p: THREE.Vector3; v: THREE.Vector3; born: number }> = [];
  private readonly sparkCloud: QuadCloud;
  private readonly tmp = new THREE.Vector3();
  private readonly tmp2 = new THREE.Vector3();
  private readonly tmp3 = new THREE.Vector3();
  private readonly tmpQ = new THREE.Quaternion();
  /** Where the scene is and the Hollow floor, if any: the crowd depends on both. */
  location: Location = 'grove';
  floor: Floor | null = null;
  private readonly crowd: Crowd;
  /** Story holds and the lantern posts, set by the scene (see staging.ts, crowd.ts). */
  crowdOptions: CrowdOptions = {};
  /** Ground height for feet: the terrain in the Grove, flat elsewhere. */
  ground: (x: number, z: number) => number = () => 0;

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
    this.group.name = 'actors';
    this.crowd = new Crowd(
      this.group,
      this.pool,
      (look) => this.standIn(look),
      () => this.emoteMats.get(frameKey('question', 'front', 0)),
    );
    // The emote ball frames: the plain set and the Shadow's plum one, one sprite material
    // per frame.
    for (const shadow of [false, true]) this.addEmoteSheet(shadow);
    this.highlight = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.72, 32),
      new THREE.MeshBasicMaterial({
        color: '#ffe680',
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.glow = new MergedGlow(this.group);
    this.highlight.rotation.x = -Math.PI / 2;
    this.highlight.visible = false;
    this.group.add(this.highlight);
    this.sparkCloud = new QuadCloud(this.group, 96);
  }

  /** Build the Keeper and the child first, so the opening seconds do not stall. */
  warm(world: World): void {
    this.warmed = true;
    this.world = world;
    this.pool.warm(openingLooks(world));
  }

  private warmed = false;

  /**
   * The opening build, for the loading bar: surfaces back (most of the wait) and figures
   * rigged. Done once the Keeper (both in co-op), every Nubbin the world will draw here
   * and the crowd all stand as themselves, no stand-ins left. Nubbins are counted from
   * the world, not from the actors already made, so a frame that has not reached them
   * yet (or one that just swapped a look) does not count as finished.
   */
  loadState(): { progress: number; done: boolean } {
    const world = this.world;
    if (!this.warmed || !this.keeper || !world) return { progress: 0, done: false };
    const figures = [!!this.keeper.rig];
    if (world.coop.active && world.keeper2) figures.push(!!this.keeper2?.rig);
    for (const n of this.location.startsWith('visit:') ? [] : world.nubbins) {
      const a = this.nubbins.get(n.id);
      figures.push(!!a && a.key === this.wantKey(n) && !!(a.rig || a.shell));
    }
    figures.push(...this.crowd.readiness());
    const rigged = figures.filter(Boolean).length;
    if (rigged === figures.length && this.pool.burst) this.pool.loaded();
    return {
      progress: this.pool.warmProgress * 0.85 + (rigged / figures.length) * 0.15,
      done: rigged === figures.length,
    };
  }

  snapshot(world: World): void {
    for (const n of world.nubbins) {
      const a = this.nubbins.get(n.id);
      if (a) {
        a.prev.pos.x = n.pos.x;
        a.prev.pos.z = n.pos.z;
        a.prev.y = n.y;
      }
    }
    for (const i of world.items) {
      const v = this.items.get(i.id);
      if (v) {
        v.prev.pos.x = i.pos.x;
        v.prev.pos.z = i.pos.z;
        v.prev.y = i.y;
      }
    }
    this.keeperPrev.x = world.keeper.pos.x;
    this.keeperPrev.z = world.keeper.pos.z;
    const k2 = world.coop.active ? world.keeper2 : null;
    this.keeper2Prev = k2 ? { x: k2.pos.x, z: k2.pos.z } : null;
  }

  keeperDrawPos(world: World, alpha: number): Vec2 {
    return {
      x: lerp(this.keeperPrev.x, world.keeper.pos.x, alpha),
      z: lerp(this.keeperPrev.z, world.keeper.pos.z, alpha),
    };
  }

  /**
   * Ring the thing under the pointer, as the pixel view haloes every pick: Nubbins and
   * items here, memorials and the crowd here too, anything else through `spot` (the
   * scene's finder for props, plants, stairs, chests and loot).
   */
  setHighlight(
    hit: { kind: string; id: string } | null,
    spot: (() => { x: number; z: number; r: number } | null) | null = null,
  ): void {
    this.highlightId = hit && (hit.kind === 'nubbin' || hit.kind === 'item') ? hit.id : null;
    const id = hit?.id ?? '';
    const memorial = hit?.kind === 'memorial' ? this.memorials.get(id) : undefined;
    this.highlightSpot = this.highlightId
      ? null
      : memorial
        ? () => ({ x: memorial.position.x, z: memorial.position.z, r: 0.35 })
        : hit && ['npc', 'wild', 'stray'].includes(hit.kind)
          ? () => this.crowd.spot(id)
          : hit?.kind === 'building' && id === 'host'
            ? () => this.crowd.spot(id)
            : spot;
  }

  sparkle(x: number, z: number, y: number, nowMs: number): void {
    for (let i = 0; i < 8 && this.sparks.length < 96; i++) {
      const a = (i / 8) * Math.PI * 2;
      this.sparks.push({
        p: new THREE.Vector3(x, this.ground(x, z) + y, z),
        v: new THREE.Vector3(Math.cos(a) * 0.9, 1.4 + (i % 3) * 0.3, Math.sin(a) * 0.9),
        born: nowMs,
      });
    }
  }

  /** What a ray passes through first: a Nubbin, an item, a memorial or the crowd. */
  pick(ray: THREE.Ray): {
    kind: 'nubbin' | 'item' | 'memorial' | 'npc' | 'wild' | 'stray' | 'building';
    id: string;
    d: number;
  } | null {
    const sphere = new THREE.Sphere();
    type Hit = {
      kind: 'nubbin' | 'item' | 'memorial' | 'npc' | 'wild' | 'stray' | 'building';
      id: string;
      d: number;
    };
    let best: Hit | null = null;
    const test = (kind: Hit['kind'], id: string, o: THREE.Object3D, r: number, lift: number) => {
      sphere.center.copy(o.position);
      sphere.center.y += lift;
      sphere.radius = r;
      if (!ray.intersectSphere(sphere, this.tmp)) return;
      const d = this.tmp.distanceTo(ray.origin);
      if (!best || d < best.d) best = { kind, id, d };
    };
    for (const [id, a] of this.nubbins) {
      const o = a.rig?.group ?? a.shell ?? a.stand;
      if (!o) continue;
      const r = a.rig
        ? Math.max(
            0.55,
            ((a.rig.group.userData.footprint as number) ?? 0.4) * a.rig.group.scale.x * 1.4,
          )
        : 0.5;
      test('nubbin', id, o, r, a.rig ? 0.6 : 0.4);
    }
    for (const [id, i] of this.items) test('item', id, i.mesh, 0.4, 0.1);
    for (const [id, m] of this.memorials)
      test('memorial', id, m, 0.45, READ3D.memorial.height * 0.75);
    const c = this.crowd.pick(ray);
    const b = best as Hit | null;
    if (c && c.kind !== 'ambient' && (!b || c.d < b.d)) return { kind: c.kind, id: c.id, d: c.d };
    return b;
  }

  private addEmoteSheet(shadow: boolean): void {
    // Vector frames (art pass 2), keyed as the pixel sheet's frames are.
    for (const [key, tex] of vectorEmotes(shadow)) {
      const [shape, f] = key.split(':') as [EmoteShape, string];
      const mat = new THREE.SpriteMaterial({ map: tex, depthTest: true, fog: false });
      this.emoteMats.set(`${shadow ? 'shadow:' : ''}${frameKey(shape, 'front', Number(f))}`, mat);
    }
  }

  /** A reaction bubble over a Nubbin until `untilMs` (the pixel view's rule and timing). */
  react(id: string, shape: EmoteShape, untilMs: number): void {
    this.bubbles.set(id, { shape, untilMs });
  }

  private ensureNubbin(n: Nubbin): Actor {
    const want = this.wantKey(n);
    let a = this.nubbins.get(n.id);
    if (a && a.key !== want) {
      this.drop(n.id);
      a = undefined;
    }
    if (a) return a;
    const emote = new THREE.Sprite(this.emoteMats.get(frameKey('ball', 'front', 0)));
    emote.scale.setScalar(0.5);
    emote.visible = false;
    this.group.add(emote);
    const actor: Actor = {
      key: want,
      rig: null,
      shell: null,
      look: null,
      stand: null,
      flight: null,
      ripple: null,
      squash: null,
      prev: { pos: { x: n.pos.x, z: n.pos.z }, y: n.y },
      pose: 'idle',
      emote,
      emoteKey: '',
    };
    if (n.stage === 'egg' || n.stage === 'cocoon') {
      actor.shell = this.kit.shell(n);
      this.group.add(actor.shell);
    } else {
      actor.look = nubbinLook(n);
      this.tryRig(actor);
    }
    this.nubbins.set(n.id, actor);
    return actor;
  }

  /** What a Nubbin is drawn as: its shell (by family, colour and cocoon kind) or its look. */
  private wantKey(n: Nubbin): string {
    return n.stage === 'egg' || n.stage === 'cocoon' ? shellKey(n) : nubbinLook(n).key;
  }

  /** A stand-in sized to a look: a low, warm shimmer on the grass (see `ItemKit.stand`). */
  standIn(look: Look): THREE.Mesh {
    const m = this.kit.stand(look.height);
    this.group.add(m);
    return m;
  }

  /** Swap a Nubbin's stand-in for its rig once the pool can build it. */
  private tryRig(a: Actor): void {
    if (a.rig || !a.look) return;
    const rig = this.pool.acquire(a.look);
    if (!rig) {
      a.stand ??= this.standIn(a.look);
      return;
    }
    a.rig = rig;
    a.look = null;
    a.stand?.removeFromParent();
    a.stand = null;
    a.pose = 'idle';
    rig.ground = this.ground;
    rig.setPose('idle');
    this.group.add(rig.group);
  }

  /**
   * A thrown Nubbin rolls once about its side axis over the flight, so it is upright
   * again as it lands. The flight time comes from the sim's launch speed and height; the
   * rig re-poses the body every frame, so the roll is laid on after `animate`.
   */
  private tumble(a: Actor, n: Nubbin, o: THREE.Object3D, nowMs: number): void {
    if (n.behavior.state !== 'thrown') {
      a.flight = null;
      return;
    }
    if (!a.flight) {
      const g = THROW.gravity;
      const vy = n.vel.y;
      const totalS = (vy + Math.sqrt(vy * vy + 2 * g * Math.max(0, n.y))) / g;
      a.flight = { startMs: nowMs, totalMs: Math.max(200, totalS * 1000) };
    }
    const k = Math.min(1, (nowMs - a.flight.startMs) / a.flight.totalMs);
    o.rotateX(k * Math.PI * 2);
  }

  // One ring and one material for every swimmer: the swell runs on the shared clock, so
  // every ripple fades in step and the opacity can be set once.
  private readonly rippleGeo = new THREE.RingGeometry(0.42, 0.5, 32);
  private readonly rippleMat = new THREE.MeshBasicMaterial({
    color: '#ffffff',
    transparent: true,
    depthWrite: false,
  });

  /** A ring that swells and fades on the water around a swimmer. */
  private ripple(a: Actor, on: boolean, x: number, z: number, t: number): void {
    if (!on) {
      if (a.ripple) a.ripple.visible = false;
      return;
    }
    if (!a.ripple) {
      a.ripple = new THREE.Mesh(this.rippleGeo, this.rippleMat);
      a.ripple.rotation.x = -Math.PI / 2;
      this.group.add(a.ripple);
    }
    const k = (t * 0.8) % 1;
    a.ripple.visible = true;
    a.ripple.position.set(x, WATER_LEVEL + 0.02, z);
    a.ripple.scale.setScalar(0.8 + k * 1.2);
    this.rippleMat.opacity = 0.5 * (1 - k);
  }

  /** Start a squash (a landing flattens) or a pop (a hatch or evolution stretches up). */
  pop(id: string, kind: 'squash' | 'pop', nowMs: number): void {
    this.pops.set(id, { kind, startMs: nowMs });
  }

  /**
   * Lay the squash or pop over a body's scale, with the pixel view's timing and amounts.
   * The rig's origin is at its feet, so the body squashes onto the ground.
   */
  private squash(a: Actor, id: string, o: THREE.Object3D, nowMs: number): void {
    const p = this.pops.get(id);
    if (!p) return;
    const dur = p.kind === 'squash' ? 260 : 420;
    const t = (nowMs - p.startMs) / dur;
    if (t >= 1 || t < 0) {
      if (t >= 1) this.pops.delete(id);
      return;
    }
    const s = Math.sin(Math.PI * t);
    const sw = p.kind === 'squash' ? 1 + 0.22 * s : 1 - 0.1 * s;
    const sh = p.kind === 'squash' ? 1 - 0.22 * s : 1 + 0.28 * s;
    a.squash = { o, base: o.scale.clone() };
    o.scale.set(a.squash.base.x * sw, a.squash.base.y * sh, a.squash.base.z * sw);
  }

  private unsquash(a: Actor): void {
    if (!a.squash) return;
    a.squash.o.scale.copy(a.squash.base);
    a.squash = null;
  }

  /** A Nubbin's feet and the top of its head in world space, for bursts round it. */
  nubbinSpot(id: string): { feet: THREE.Vector3; head: THREE.Vector3 } | null {
    const a = this.nubbins.get(id);
    const o = a?.rig?.group ?? a?.shell ?? a?.stand;
    if (!a || !o) return null;
    const feet = new THREE.Vector3(
      o.position.x,
      this.ground(o.position.x, o.position.z),
      o.position.z,
    );
    const head = a.rig?.bones.head;
    if (head) return { feet, head: head.getWorldPosition(new THREE.Vector3()) };
    return { feet, head: feet.clone().setY(o.position.y + 0.45) };
  }

  /** Where an item is drawn, or null once it is gone. */
  itemPosition(id: string): THREE.Vector3 | null {
    return this.items.get(id)?.mesh.position.clone() ?? null;
  }

  /** Where the Keeper stands (its last snapshot). */
  keeperPosition(): Vec2 {
    return { x: this.keeperPrev.x, z: this.keeperPrev.z };
  }

  /** Where a Nubbin is drawn, for bursts at its feet. */
  nubbinPosition(id: string): Vec2 | null {
    const a = this.nubbins.get(id);
    const o = a?.rig?.group ?? a?.shell ?? a?.stand;
    return o ? { x: o.position.x, z: o.position.z } : null;
  }

  private drop(id: string): void {
    const a = this.nubbins.get(id);
    if (!a) return;
    this.unsquash(a);
    if (a.rig) {
      this.dresser.strip(a.rig);
      this.pool.release(a.key, a.rig);
    }
    a.stand?.removeFromParent();
    a.ripple?.removeFromParent();
    if (a.shell) this.kit.release(a.shell);
    a.emote.removeFromParent();
    this.nubbins.delete(id);
  }

  /**
   * The ground under the Keeper. In the pond (which the sim only allows with the Swim
   * perk) the Keeper wades: it stands on the bed, at most `wadeDepth` under the water.
   */
  private keeperGround(x: number, z: number): number {
    if (this.location === 'grove' && Math.hypot(x - GROVE.pond.x, z - GROVE.pond.z) < GROVE.pond.r)
      return Math.max(groveHeight(x, z), WATER_LEVEL - GROVE3D.wadeDepth);
    return this.ground(x, z);
  }

  /** Where the Keeper's stroking hand is, in world space (a fresh vector). */
  private keeperHand(rig: Rigged | null, keeper: World['keeper']): THREE.Vector3 {
    const elbow = rig?.bones.elbowR;
    if (elbow) {
      elbow.getWorldPosition(this.tmp);
      const off = this.tmp2.copy(KEEPER_HAND_FROM_ELBOW).multiply(elbow.getWorldScale(this.tmp3));
      off.applyQuaternion(elbow.getWorldQuaternion(this.tmpQ));
      return this.tmp.add(off).clone();
    }
    const gy = this.ground(keeper.pos.x, keeper.pos.z);
    return new THREE.Vector3(
      keeper.pos.x + Math.sin(keeper.facing) * 0.5,
      gy + 1.0,
      keeper.pos.z + Math.cos(keeper.facing) * 0.5,
    );
  }

  /**
   * A Keeper's slot for a look: its rig once the pool can build it, the stand-in until
   * then. Switching looks (another trainer, or the alignment crossing a side) keeps the
   * old rig on screen until the new one is ready.
   */
  private fitKeeper(k: KeeperSlot | null, look: Look): KeeperSlot {
    if (k && k.key === look.key && k.rig) return k;
    const rig = this.pool.acquire(look);
    if (rig) {
      if (k?.rig) this.pool.release(k.key, k.rig);
      k?.stand?.removeFromParent();
      rig.ground = (x, z) => this.keeperGround(x, z);
      rig.setPose('idle');
      rig.group.userData.pose = 'idle';
      this.group.add(rig.group);
      return { key: look.key, look, rig, stand: null };
    }
    return k ?? { key: look.key, look, rig: null, stand: this.standIn(look) };
  }

  private ensureKeeper(world: World): Rigged | null {
    this.keeper = this.fitKeeper(this.keeper, keeperLook(world.keeper, world.trainer));
    return this.keeper.rig;
  }

  /** Give a Keeper slot back: its rig to the pool, its stand-in out of the scene. */
  private dropKeeper(k: KeeperSlot | null): null {
    if (k?.rig) this.pool.release(k.key, k.rig);
    k?.stand?.removeFromParent();
    return null;
  }

  /** Pose, place and animate a Keeper's rig (or set its stand-in on the ground). */
  private driveKeeper(
    k: KeeperSlot,
    pose: PoseName,
    p: Vec2,
    facing: number,
    t: number,
    dt: number,
  ): void {
    const rig = k.rig;
    if (rig) {
      if (pose !== (rig.group.userData.pose as PoseName | undefined)) {
        rig.group.userData.pose = pose;
        rig.setPose(pose);
      }
      rig.group.position.set(p.x, this.keeperGround(p.x, p.z), p.z);
      rig.face(facing);
      rig.animate(gaitTime(rig, p.x, p.z, t, dt, pose === 'walk'));
    } else if (k.stand) placeStand(k.stand, p.x, this.ground(p.x, p.z), p.z, t);
  }

  /**
   * The co-op partner's Keeper, as the pixel view draws it: its trainer's look, walking
   * while its stick is held, interpolated between steps like the first. Released when
   * co-op ends.
   */
  private updateKeeper2(world: World, alpha: number, t: number, dt: number): void {
    const k2 = world.coop.active ? world.keeper2 : null;
    if (!k2) {
      this.keeper2 = this.dropKeeper(this.keeper2);
      return;
    }
    this.keeper2 = this.fitKeeper(this.keeper2, keeperLook(k2, world.coop.trainer));
    const prev = this.keeper2Prev ?? k2.pos;
    const p = { x: lerp(prev.x, k2.pos.x, alpha), z: lerp(prev.z, k2.pos.z, alpha) };
    const moving = k2.input.x !== 0 || k2.input.z !== 0;
    this.driveKeeper(this.keeper2, moving ? 'walk' : 'idle', p, k2.facing, t, dt);
  }

  update(world: World, alpha: number, nowMs: number, dt: number, cameraPos: THREE.Vector3): void {
    const t = nowMs / 1000;
    const keeper = world.keeper;
    this.world = world;
    this.pool.frame();
    // The Keeper first: when it and a hatchling are both waiting, the Keeper is built.
    const rig = this.ensureKeeper(world);
    const petting = keeper.intent?.kind === 'pet' ? keeper.intent.nubbinId : null;
    // The hand the petted Nubbin looks at: the Keeper's right hand when the rig is up,
    // else a point at chest height in front of the Keeper.
    const hand = this.keeperHand(rig, keeper);
    let petted = false;
    // Visitors, wild ones, the Hollow's strays and the story places' grey Nubbins.
    this.crowd.update(
      crowdFor(world, this.location, this.floor, nowMs, this.crowdOptions),
      this.ground,
      t,
      dt,
    );

    // Nubbins. On a visit the Keeper's own stay at home, as do the items.
    const away = this.location.startsWith('visit:');
    const live = new Set<string>();
    for (const n of away ? [] : world.nubbins) {
      live.add(n.id);
      const a = this.ensureNubbin(n);
      this.unsquash(a);
      this.tryRig(a);
      const x = lerp(a.prev.pos.x, n.pos.x, alpha);
      const z = lerp(a.prev.pos.z, n.pos.z, alpha);
      const y = lerp(a.prev.y, n.y, alpha);
      const gy = this.ground(x, z);
      const o = a.rig?.group ?? a.shell ?? a.stand!;
      const moving = Math.hypot(n.pos.x - a.prev.pos.x, n.pos.z - a.prev.pos.z) > 0.004;
      if (a.rig) {
        const near = Math.hypot(keeper.pos.x - n.pos.x, keeper.pos.z - n.pos.z) < 1.5;
        const pose = poseFor(n, moving, petting === n.id && near);
        if (pose !== a.pose) {
          a.pose = pose;
          a.rig.setPose(pose);
        }
        // In the pond: a swimmer with the stroke sinks to the shoulders, feet free of the
        // bed; any other Nubbin wades, sunk only to the belly.
        const inWater = n.behavior.state === 'swim' && groveHeight(x, z) < WATER_LEVEL - 0.15;
        const sink = inWater ? o.scale.y * (pose === 'swim' ? GROVE3D_SINK : GROVE3D_WADE) : 0;
        o.position.set(x, gy + y - sink, z);
        const footY = gy + y - sink;
        // A body in the water stands on a flat floor at its sunk height; a held or thrown
        // body is lifted off the real ground so its shadow blob stays down there under it.
        a.rig.ground = inWater ? () => footY : this.ground;
        a.rig.lift = inWater ? 0 : Math.max(0, y);
        a.rig.face(n.facing);
        a.rig.lookAt = pose === 'pet' ? hand : null;
        if (n.behavior.state === 'pet' && near) petted = true;
        if (eggFamily(n) === 'chao') this.dresser.update(a.rig, n);
        a.rig.animate(gaitTime(a.rig, x, z, t, dt, pose === 'walk', inWater ? 0.6 : 1));
        this.tumble(a, n, o, nowMs);
        this.ripple(a, inWater, x, z, t);
      } else if (a.stand) {
        placeStand(a.stand, x, gy + y, z, t);
      } else if (a.shell) {
        o.position.set(x, gy + ((o.userData.half as number | undefined) ?? 0.46) + y, z);
        if (n.stage === 'egg') o.rotation.z = Math.sin(t * 2.2 + x) * 0.06;
        else {
          o.rotation.y = t * 0.4;
          // As the pixel cocoon: a departing one fades as it closes, a rebirth one shimmers.
          (a.shell.material as THREE.MeshPhysicalMaterial).opacity =
            n.cocoonKind === 'depart'
              ? 1 - Math.min(1, n.stageMs / LIFECYCLE.cocoonMs) * 0.85
              : n.cocoonKind === 'rebirth'
                ? 0.85 + 0.15 * Math.sin(nowMs / 150)
                : 1;
        }
      }
      this.squash(a, n.id, o, nowMs);
      const tall = a.rig ? (a.look?.height ?? GROVE3D.nubbinHeight) : 0.9;
      this.glow.set(n.id, isMerged(world, n.id), o.position, tall, nowMs);
      // The emote ball over the head: the same choice the pixel view makes, a reaction
      // bubble over it for a moment, two frames flipping every 400 ms, plum for a Shadow.
      let bubble = this.bubbles.get(n.id);
      if (bubble && nowMs >= bubble.untilMs) {
        this.bubbles.delete(n.id);
        bubble = undefined;
      }
      const shape: EmoteShape =
        n.stage === 'egg' || n.stage === 'cocoon' ? 'none' : (bubble?.shape ?? emoteFor(n));
      const flip = Math.floor(nowMs / 400) % 2;
      const key =
        shape === 'none' ? '' : `${n.shadow ? 'shadow:' : ''}${frameKey(shape, 'front', flip)}`;
      if (key !== a.emoteKey) {
        a.emoteKey = key;
        const mat = key ? this.emoteMats.get(key) : undefined;
        a.emote.visible = !!mat;
        if (mat) a.emote.material = mat;
      }
      if (a.emote.visible) {
        const head = a.rig?.bones.head;
        if (head) {
          head.getWorldPosition(this.tmp);
          // Over the top of the creature, never inside it: the head bone sits low in the
          // head, and 0.48 above it left the ball buried (the depth test hid it).
          const top = Math.max(this.tmp.y + 0.48, gy + y + tall + 0.3);
          a.emote.position.set(this.tmp.x, top + Math.sin(t * 2) * 0.03, this.tmp.z);
        } else a.emote.position.set(x, gy + y + 1.2, z);
      }
    }
    for (const id of [...this.nubbins.keys()]) if (!live.has(id)) this.drop(id);
    for (const id of [...this.pops.keys()]) if (!live.has(id)) this.pops.delete(id);
    this.glow.keep(live);

    // The Keeper.
    const kp = this.keeperDrawPos(world, alpha);
    const kMoving =
      Math.hypot(keeper.pos.x - this.keeperPrev.x, keeper.pos.z - this.keeperPrev.z) > 0.004;
    this.keeperMoving = kMoving;
    // The Keeper strokes for as long as the Nubbin at its feet holds the pet state.
    const kPose: PoseName = keeper.carrying
      ? 'carry'
      : petted
        ? 'pet'
        : this.keeperMoving
          ? 'walk'
          : 'idle';
    this.driveKeeper(this.keeper!, kPose, kp, keeper.facing, t, dt);
    this.updateKeeper2(world, alpha, t, dt);
    // Stand-ins shimmer while they wait.
    this.kit.pulseStands(t);

    // Items, by the pixel view's rule: the Grove shows everything but notebooks, the story
    // places show only their notebooks, and the Hollow Below and visits show none.
    const liveItems = new Set<string>();
    const home = this.location === 'grove';
    const story = !home && !away && this.location !== 'dungeon';
    for (const i of world.items.filter((it) =>
      home ? it.kind !== 'notebook' : story && it.kind === 'notebook',
    )) {
      liveItems.add(i.id);
      let v = this.items.get(i.id);
      if (!v) {
        v = { ...this.kit.item(i), prev: { pos: { x: i.pos.x, z: i.pos.z }, y: i.y } };
        this.group.add(v.mesh);
        this.items.set(i.id, v);
      }
      const x = lerp(v.prev.pos.x, i.pos.x, alpha);
      const z = lerp(v.prev.pos.z, i.pos.z, alpha);
      v.mesh.position.set(x, this.ground(x, z) + v.lift + lerp(v.prev.y, i.y, alpha), z);
    }
    for (const [id, v] of [...this.items]) {
      if (liveItems.has(id)) continue;
      this.kit.release(v.mesh);
      this.items.delete(id);
    }

    // Memorial flowers on the hill: only in the Grove (as the pixel view draws them), and
    // removed when their memorial is gone (a reset or an imported save).
    const memorials = this.location === 'grove' ? world.memorials : [];
    for (const m of memorials) {
      if (this.memorials.has(m.id)) continue;
      const g = memorialFlower();
      g.position.set(m.pos.x, this.ground(m.pos.x, m.pos.z), m.pos.z);
      this.group.add(g);
      this.memorials.set(m.id, g);
    }
    const liveMemorials = new Set(memorials.map((m) => m.id));
    for (const [id, g] of [...this.memorials]) {
      if (liveMemorials.has(id)) continue;
      // Geometry and materials are shared by every flower (memorial.ts): nothing to free.
      g.removeFromParent();
      this.memorials.delete(id);
    }
    updateMemorials(this.memorials.values(), cameraPos, t);

    // The highlight ring.
    const hl = this.highlightId;
    const target = hl
      ? (this.nubbins.get(hl)?.rig?.group ??
        this.nubbins.get(hl)?.shell ??
        this.nubbins.get(hl)?.stand ??
        this.items.get(hl)?.mesh)
      : null;
    // The ring is sized for a Nubbin; anything else scales it to its own reach.
    const spot = target
      ? { x: target.position.x, z: target.position.z, r: 0 }
      : (this.highlightSpot?.() ?? null);
    this.highlight.visible = !!spot;
    if (spot) {
      this.highlight.position.set(spot.x, this.ground(spot.x, spot.z) + 0.04, spot.z);
      const k = spot.r ? Math.min(GROVE3D.highlightMaxScale, Math.max(0.6, spot.r / 0.6)) : 1;
      this.highlight.scale.setScalar(k);
      (this.highlight.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(t * 6) * 0.25;
    }

    // Sparkles.
    let n = 0;
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i]!;
      if (nowMs - s.born > 700) {
        this.sparks.splice(i, 1);
        continue;
      }
      s.v.y -= 3.2 * dt;
      s.p.addScaledVector(s.v, dt);
      const fade = 1 - (nowMs - s.born) / 700;
      this.sparkCloud.set(s.p.x, s.p.y, s.p.z, SPARK, Math.min(1, fade * 1.6), 0.3, 'star', {
        rot: (nowMs - s.born) / 300 + n++,
        additive: true,
      });
    }
    this.sparkCloud.flush();
    void cameraPos;
  }

  /** Creatures pushing the grass: positions and footprints, nearest to the camera first. */
  pushers(): Array<{ x: number; z: number; r: number }> {
    const out: Array<{ x: number; z: number; r: number }> = [];
    for (const k of [this.keeper, this.keeper2]) {
      if (!k?.rig) continue;
      const g = k.rig.group;
      out.push({
        x: g.position.x,
        z: g.position.z,
        r: ((g.userData.footprint as number) ?? 0.4) * g.scale.x * 1.6,
      });
    }
    out.push(...this.crowd.positions());
    for (const a of this.nubbins.values()) {
      if (!a.rig) continue;
      const g = a.rig.group;
      out.push({
        x: g.position.x,
        z: g.position.z,
        r: ((g.userData.footprint as number) ?? 0.35) * g.scale.x * 1.6,
      });
    }
    return out;
  }

  dispose(): void {
    for (const id of [...this.nubbins.keys()]) this.drop(id);
    this.keeper = this.dropKeeper(this.keeper);
    this.keeper2 = this.dropKeeper(this.keeper2);
    for (const v of this.items.values()) this.kit.release(v.mesh);
    this.items.clear();
    for (const g of this.memorials.values()) {
      g.removeFromParent();
      g.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (o.material as THREE.Material).dispose();
        }
      });
    }
    this.memorials.clear();
    this.crowd.dispose();
    this.glow.dispose();
    this.pool.dispose();
    this.dresser.dispose();
    this.kit.dispose();
    this.rippleGeo.dispose();
    this.rippleMat.dispose();
    this.highlight.geometry.dispose();
    (this.highlight.material as THREE.Material).dispose();
    this.sparkCloud.dispose();
    for (const m of this.emoteMats.values()) {
      m.map?.dispose();
      m.dispose();
    }
    this.group.removeFromParent();
  }
}
