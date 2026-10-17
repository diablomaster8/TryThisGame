import * as THREE from 'three';
import { buildEmoteSheet, type EmoteShape } from '../render/sprites/emote';
import { C } from '../render/sprites/palette';
import { frameKey } from '../render/sprites/animations';
import { emoteFor } from '../render/world-view';
import type { PoseName, Rigged } from '../samples/species';
import type { Floor } from '../sim/dungeon';
import type { Item, Location, Nubbin, Vec2, World } from '../sim/types';
import { keeperLook, nubbinLook, openingLooks, takePool, type Look } from './creature-pool';
import { EGG_COLOURS } from '../samples/nubbin-variants-colour';
import { Crowd, crowdFor } from './crowd';
import { gaitTime } from './gait';
import { WATER_LEVEL, groveHeight } from './terrain';
import { buildToy } from './toys';
import { GROVE, GROVE3D, LIFECYCLE, THROW } from '../config/tuning';
import { isMerged } from '../sim/partners';
import { FRUIT_COLOURS, FRUIT_PLAIN, MergedGlow } from './glow';
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
  /** Rotations laid over the pose this frame (the cry's droop), undone before the next. */
  overlay: Array<{ o: THREE.Object3D; x: number; z: number }>;
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

/** How far a swimmer sinks, as a fraction of its scale (the sculpt is about 3 units tall). */
const GROVE3D_SINK = 1.1;

/** Sim behaviour and handling, mapped to the species format's poses. */
export function poseFor(n: Nubbin, moving: boolean, petted: boolean): PoseName {
  if (petted) return 'pet';
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
      // The format has no sad pose; idle with a droop laid over it (see `overlay`).
      return 'idle';
    case 'swim':
      // Paddling: the walk, with the body sunk to the shoulders in the water.
      return 'walk';
    case 'thrown':
      return 'idle';
    default:
      return moving ? 'walk' : 'idle';
  }
}

export class Actors {
  readonly group = new THREE.Group();
  readonly pool = takePool();
  private readonly nubbins = new Map<string, Actor>();
  private readonly items = new Map<
    string,
    { mesh: THREE.Object3D; lift: number; prev: Snapshot }
  >();
  private readonly memorials = new Map<string, THREE.Group>();
  private keeper: { key: string; look: Look; rig: Rigged | null; stand: THREE.Mesh | null } | null =
    null;
  /** Stand-ins for figures still in the sculpt workers: one soft, breathing capsule. */
  private readonly standGeo = new THREE.CapsuleGeometry(0.5, 0.6, 6, 16);
  private readonly standMat = new THREE.MeshStandardMaterial({
    color: '#e8f0ff',
    emissive: '#a8c8ff',
    emissiveIntensity: 0.4,
    roughness: 0.6,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
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
  private readonly sparkPoints: THREE.Points;
  private readonly sparkPos: THREE.BufferAttribute;
  private readonly tmp = new THREE.Vector3();
  private readonly tmp2 = new THREE.Vector3();
  private readonly tmp3 = new THREE.Vector3();
  private readonly tmpQ = new THREE.Quaternion();
  /** Where the scene is and the Hollow floor, if any: the crowd depends on both. */
  location: Location = 'grove';
  floor: Floor | null = null;
  private readonly crowd: Crowd;
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
    // The emote ball frames come from the pixel sheets (the plain one and the Shadow plum
    // one), one sprite material per frame.
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
    const max = 96;
    this.sparkPos = new THREE.BufferAttribute(new Float32Array(max * 3), 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', this.sparkPos);
    geo.setDrawRange(0, 0);
    this.sparkPoints = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: '#fff2a8',
        size: 0.14,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      }),
    );
    this.sparkPoints.frustumCulled = false;
    this.group.add(this.sparkPoints);
  }

  /** Build the Keeper and the child first, so the opening seconds do not stall. */
  warm(world: World): void {
    this.warmed = true;
    this.pool.warm(openingLooks(world));
  }

  private warmed = false;

  /**
   * The opening build, for the loading bar: surfaces back (most of the wait) and figures
   * rigged. Done once the Keeper and every Nubbin stand as themselves, no stand-ins left.
   */
  loadState(): { progress: number; done: boolean } {
    if (!this.warmed || !this.keeper) return { progress: 0, done: false };
    const figures = [!!this.keeper.rig];
    for (const a of this.nubbins.values()) figures.push(!!(a.rig || a.shell));
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
    for (const [id, m] of this.memorials) test('memorial', id, m, 0.35, 0.4);
    const c = this.crowd.pick(ray);
    const b = best as Hit | null;
    if (c && c.kind !== 'ambient' && (!b || c.d < b.d)) return { kind: c.kind, id: c.id, d: c.d };
    return b;
  }

  private shell(stage: 'egg' | 'cocoon', n: Nubbin): THREE.Mesh {
    // Egg colours are the Nubbin's colours for life, so the shell wears the body colour.
    const egg = EGG_COLOURS.find((c) => c.name === n.eggColor);
    const color = stage === 'egg' ? (egg?.body ?? '#f3efe2') : '#d8c8f0';
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 20, 16),
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: stage === 'egg' ? 0.5 : 0.15,
        clearcoat: stage === 'egg' ? 0.3 : 1,
        transmission: stage === 'egg' ? 0 : 0.35,
        thickness: 0.6,
        emissive: stage === 'egg' ? '#000000' : '#8a70c0',
        emissiveIntensity: stage === 'egg' ? 0 : 0.5,
        // A cocoon fades or shimmers (see `update`).
        transparent: stage === 'cocoon',
      }),
    );
    mesh.scale.set(0.85, 1.1, 0.85);
    mesh.castShadow = true;
    return mesh;
  }

  private addEmoteSheet(shadow: boolean): void {
    const sheet = buildEmoteSheet(shadow ? C.plum : undefined);
    const image = sheet.texture.image as HTMLCanvasElement;
    for (const [key, rect] of sheet.frames) {
      const c = document.createElement('canvas');
      c.width = rect.w;
      c.height = rect.h;
      const ctx = c.getContext('2d');
      ctx?.drawImage(image, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
      const tex = new THREE.CanvasTexture(c);
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.SpriteMaterial({ map: tex, depthTest: true, fog: false });
      this.emoteMats.set(`${shadow ? 'shadow:' : ''}${key}`, mat);
    }
    sheet.dispose();
  }

  /** A reaction bubble over a Nubbin until `untilMs` (the pixel view's rule and timing). */
  react(id: string, shape: EmoteShape, untilMs: number): void {
    this.bubbles.set(id, { shape, untilMs });
  }

  private ensureNubbin(n: Nubbin): Actor {
    const want = n.stage === 'egg' || n.stage === 'cocoon' ? `shell:${n.stage}` : nubbinLook(n).key;
    let a = this.nubbins.get(n.id);
    if (a && a.key !== want) {
      this.drop(n.id);
      a = undefined;
    }
    if (a) return a;
    const emote = new THREE.Sprite(this.emoteMats.get(frameKey('ball', 'front', 0)));
    emote.scale.setScalar(0.42);
    emote.visible = false;
    this.group.add(emote);
    const actor: Actor = {
      key: want,
      rig: null,
      shell: null,
      look: null,
      stand: null,
      overlay: [],
      flight: null,
      ripple: null,
      squash: null,
      prev: { pos: { x: n.pos.x, z: n.pos.z }, y: n.y },
      pose: 'idle',
      emote,
      emoteKey: '',
    };
    if (n.stage === 'egg' || n.stage === 'cocoon') {
      actor.shell = this.shell(n.stage, n);
      this.group.add(actor.shell);
    } else {
      actor.look = nubbinLook(n);
      this.tryRig(actor);
    }
    this.nubbins.set(n.id, actor);
    return actor;
  }

  /** A stand-in sized to a look: the height it will have, as a soft capsule. */
  standIn(look: Look): THREE.Mesh {
    const m = new THREE.Mesh(this.standGeo, this.standMat);
    m.scale.set(look.height * 0.32, look.height * 0.5, look.height * 0.32);
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

  /** The cry: head hung and arms in, with a small sob, laid over the idle pose. */
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

  private droop(a: Actor, rig: Rigged, t: number): void {
    const lay = (name: string, x: number, z: number) => {
      const o = rig.bones[name];
      if (!o) return;
      o.rotation.x += x;
      o.rotation.z += z;
      a.overlay.push({ o, x, z });
    };
    lay('head', 0.42 + Math.sin(t * 9) * 0.04, 0);
    lay('armL', 0.2, -0.35);
    lay('armR', 0.2, 0.35);
  }

  private rippleGeo: THREE.RingGeometry | null = null;

  /** A ring that swells and fades on the water around a swimmer. */
  private ripple(a: Actor, on: boolean, x: number, z: number, t: number): void {
    if (!on) {
      if (a.ripple) a.ripple.visible = false;
      return;
    }
    if (!a.ripple) {
      this.rippleGeo ??= new THREE.RingGeometry(0.42, 0.5, 32);
      a.ripple = new THREE.Mesh(
        this.rippleGeo,
        new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, depthWrite: false }),
      );
      a.ripple.rotation.x = -Math.PI / 2;
      this.group.add(a.ripple);
    }
    const k = (t * 0.8) % 1;
    a.ripple.visible = true;
    a.ripple.position.set(x, WATER_LEVEL + 0.02, z);
    a.ripple.scale.setScalar(0.8 + k * 1.2);
    (a.ripple.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - k);
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
    for (const u of a.overlay) {
      u.o.rotation.x -= u.x;
      u.o.rotation.z -= u.z;
    }
    this.unsquash(a);
    if (a.rig) this.pool.release(a.key, a.rig);
    a.stand?.removeFromParent();
    a.ripple?.removeFromParent();
    a.shell?.removeFromParent();
    a.emote.removeFromParent();
    this.nubbins.delete(id);
  }

  /**
   * The Keeper's rig, or null while it is still being sculpted (a stand-in shows then).
   * Switching Keepers keeps the old rig on screen until the new one is ready.
   */
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

  private ensureKeeper(world: World): Rigged | null {
    const look = keeperLook(world.keeper);
    const k = this.keeper;
    if (k && k.key === look.key && k.rig) return k.rig;
    const rig = this.pool.acquire(look);
    if (rig) {
      if (k?.rig) this.pool.release(k.key, k.rig);
      k?.stand?.removeFromParent();
      rig.ground = (x, z) => this.keeperGround(x, z);
      rig.setPose('idle');
      rig.group.userData.pose = 'idle';
      this.group.add(rig.group);
      this.keeper = { key: look.key, look, rig, stand: null };
      return rig;
    }
    if (k?.rig) return k.rig;
    if (!k) this.keeper = { key: look.key, look, rig: null, stand: this.standIn(look) };
    return null;
  }

  /** An item's model and how high its origin sits above the ground. */
  private itemMesh(i: Item): { mesh: THREE.Object3D; lift: number } {
    if (i.kind === 'toy') return { mesh: buildToy(i.toy), lift: 0 };
    let mesh: THREE.Mesh;
    if (i.kind === 'fruit') {
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 14, 10),
        new THREE.MeshPhysicalMaterial({
          color: i.flavor ? FRUIT_COLOURS[i.flavor] : FRUIT_PLAIN,
          roughness: 0.35,
          clearcoat: 0.6,
        }),
      );
    } else {
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.36, 0.06, 0.46),
        new THREE.MeshStandardMaterial({ color: '#f0e6c8', roughness: 0.8 }),
      );
    }
    mesh.castShadow = true;
    return { mesh, lift: 0.2 };
  }

  update(world: World, alpha: number, nowMs: number, dt: number, cameraPos: THREE.Vector3): void {
    const t = nowMs / 1000;
    const keeper = world.keeper;
    this.pool.frame();
    // The Keeper first: when it and a hatchling are both waiting, the Keeper is built.
    const rig = this.ensureKeeper(world);
    const petting = keeper.intent?.kind === 'pet' ? keeper.intent.nubbinId : null;
    // The hand the petted Nubbin looks at: the Keeper's right hand when the rig is up,
    // else a point at chest height in front of the Keeper.
    const hand = this.keeperHand(rig, keeper);
    let petted = false;
    // Visitors, wild ones, the Hollow's strays and the story places' grey Nubbins.
    this.crowd.update(crowdFor(world, this.location, this.floor, nowMs), this.ground, t, dt);

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
        // A swimmer over deep water sinks to the shoulders, feet free of the bed.
        const swimming = n.behavior.state === 'swim' && groveHeight(x, z) < WATER_LEVEL - 0.15;
        const sink = swimming ? o.scale.y * GROVE3D_SINK : 0;
        o.position.set(x, gy + y - sink, z);
        const footY = gy + y - sink;
        // A swimmer stands on a flat floor at its sunk height; a held or thrown body is
        // lifted off the real ground so its shadow blob stays down there under it.
        a.rig.ground = swimming ? () => footY : this.ground;
        a.rig.lift = swimming ? 0 : Math.max(0, y);
        a.rig.face(n.facing);
        a.rig.lookAt = pose === 'pet' ? hand : null;
        if (n.behavior.state === 'pet' && near) petted = true;
        for (const u of a.overlay) {
          u.o.rotation.x -= u.x;
          u.o.rotation.z -= u.z;
        }
        a.overlay.length = 0;
        a.rig.animate(gaitTime(a.rig, x, z, t, dt, pose === 'walk', swimming ? 0.6 : 1));
        if (n.behavior.state === 'cry') this.droop(a, a.rig, t);
        this.tumble(a, n, o, nowMs);
        this.ripple(a, swimming, x, z, t);
      } else if (a.stand) {
        o.position.set(x, gy + y + o.scale.y * 0.9, z);
      } else if (a.shell) {
        o.position.set(x, gy + 0.46 + y, z);
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
          a.emote.position.set(this.tmp.x, this.tmp.y + 0.48 + Math.sin(t * 2) * 0.03, this.tmp.z);
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
    if (rig) {
      if (kPose !== (rig.group.userData.pose as PoseName | undefined)) {
        rig.group.userData.pose = kPose;
        rig.setPose(kPose);
      }
      rig.group.position.set(kp.x, this.keeperGround(kp.x, kp.z), kp.z);
      rig.face(keeper.facing);
      rig.animate(gaitTime(rig, kp.x, kp.z, t, dt, kPose === 'walk'));
    } else if (this.keeper?.stand) {
      const s = this.keeper.stand;
      s.position.set(kp.x, this.ground(kp.x, kp.z) + s.scale.y * 0.9, kp.z);
    }
    // Stand-ins breathe while they wait.
    this.standMat.emissiveIntensity = 0.35 + Math.sin(t * 3) * 0.2;

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
        v = { ...this.itemMesh(i), prev: { pos: { x: i.pos.x, z: i.pos.z }, y: i.y } };
        this.group.add(v.mesh);
        this.items.set(i.id, v);
      }
      const x = lerp(v.prev.pos.x, i.pos.x, alpha);
      const z = lerp(v.prev.pos.z, i.pos.z, alpha);
      v.mesh.position.set(x, this.ground(x, z) + v.lift + lerp(v.prev.y, i.y, alpha), z);
    }
    for (const [id, v] of [...this.items]) {
      if (liveItems.has(id)) continue;
      v.mesh.removeFromParent();
      this.items.delete(id);
    }

    // Memorial flowers on the hill: only in the Grove (as the pixel view draws them), and
    // removed when their memorial is gone (a reset or an imported save).
    const memorials = this.location === 'grove' ? world.memorials : [];
    for (const m of memorials) {
      if (this.memorials.has(m.id)) continue;
      const g = new THREE.Group();
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.04, 0.5, 6),
        new THREE.MeshStandardMaterial({ color: '#4f8a3a' }),
      );
      stem.position.y = 0.25;
      const bloom = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 10, 8),
        new THREE.MeshStandardMaterial({
          color: '#ffd1e8',
          emissive: '#ff9ecb',
          emissiveIntensity: 0.4,
        }),
      );
      bloom.position.y = 0.55;
      g.add(stem, bloom);
      g.position.set(m.pos.x, this.ground(m.pos.x, m.pos.z), m.pos.z);
      this.group.add(g);
      this.memorials.set(m.id, g);
    }
    const liveMemorials = new Set(memorials.map((m) => m.id));
    for (const [id, g] of [...this.memorials]) {
      if (liveMemorials.has(id)) continue;
      g.removeFromParent();
      g.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (o.material as THREE.Material).dispose();
        }
      });
      this.memorials.delete(id);
    }

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
      this.sparkPos.setXYZ(n++, s.p.x, s.p.y, s.p.z);
    }
    this.sparkPos.needsUpdate = true;
    this.sparkPoints.geometry.setDrawRange(0, n);
    void cameraPos;
  }

  /** Creatures pushing the grass: positions and footprints, nearest to the camera first. */
  pushers(): Array<{ x: number; z: number; r: number }> {
    const out: Array<{ x: number; z: number; r: number }> = [];
    if (this.keeper?.rig) {
      const g = this.keeper.rig.group;
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
    this.crowd.dispose();
    this.pool.dispose();
    this.standGeo.dispose();
    this.standMat.dispose();
    for (const m of this.emoteMats.values()) {
      m.map?.dispose();
      m.dispose();
    }
    this.group.removeFromParent();
  }
}
