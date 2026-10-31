import * as THREE from 'three';
import { npcLookOf, storyId } from '../config/npc-looks';
import { GROVE3D, HOLLOW, HOLLOW_R7, READ3D } from '../config/tuning';
import type { PoseName, Rigged } from '../samples/species';
import { speciesArt } from '../render/sprites/species-art';
import { uniqueArtId, uniqueScale } from '../render/sprites/unique-art';
import type { Floor } from '../sim/dungeon';
import { actorShown } from '../sim/dungeon-sight';
import { friendWalking } from '../sim/dungeon-friends';
import { neighbourGarden, visitingTrainer, type NeighbourNubbin } from '../sim/neighbourhood';
import { ROSTER } from '../samples/species-roster';
import { variantById } from '../samples/nubbin-variant-catalogue';
import { TRAINERS, trainerOf } from '../sim/trainers';
import type { Location, Vec2, World } from '../sim/types';
import type { CreaturePool, Look } from './creature-pool';
import { gaitTime } from './gait';
import { placeStand } from './item-kit';
import { poseRig } from './stage-pose3d';
import { byteLaceUntied } from '../sim/byte-lace'; /* Lane E r10, R0366 */
import {
  STRAY_GAIT,
  strayGait,
  tipLift,
  wobble,
  type StrayGait,
} from '../render/stray-gait'; /* Lane E r10, R0326 */

/**
 * Everyone in the 3D scene who is not the Keeper or one of the Keeper's Nubbins: visiting
 * Keepers (the campaign's NPCs), wild visitors in the Grove, the Shadow strays and the
 * wild one on a Hollow floor, and the grey Nubbins that sit about the story Hollow and
 * Corvin's rows. They read the same sim state as the pixel view's `world-view.ts` and come
 * from the same creature pool, so a look is sculpted once whoever wears it.
 */
export interface Figure {
  id: string;
  /** The pick kind the input expects for a tap on this figure (`building` is the host). */
  kind: 'npc' | 'wild' | 'stray' | 'ambient' | 'building';
  look: Look;
  x: number;
  z: number;
  facing: number;
  pose: PoseName;
  /** Stands in the sad pose instead of idle (the Shadows' sad stand). */
  sad?: boolean;
  /** A little hop in place (a fed wild visitor). */
  hop?: boolean;
  /** A "?" over the head, as the pixel view draws it: an unfed wild visitor, a floor's wild one. */
  ask?: boolean;
  /** R0366 (lane E r10): Byte's undone shoelace, a white strand on the grass by his foot. */
  lace?: boolean;
  /** R0326 (lane E r10): a stray's tiptoe up to the Keeper, or its loaded wobble away. */
  gait?: StrayGait;
}

/**
 * Campaign graphics 2 (C1, H9): figures the story dressing adds this frame, render-only: the
 * storylines' speakers who have no sim NPC, and the festival's Nubbins. `render3d/dress-p.ts`
 * sets the list each frame; `crowdFor` appends it, so they come from the same creature pool
 * and keep their rigs between frames. None can be tapped (`ambient`).
 */
export const STAGE_FIGURES: { list: Figure[] } = { list: [] };

const SHADOW_LOOK = (height: number): Look => ({ key: 'variant:shadow', height });

/** The pixel view's ambient spots: the story Hollow's eight and Corvin's thirty in rows. */
function ambient(location: Location): Figure[] {
  const h = GROVE3D.nubbinHeight;
  if (location === 'corvin')
    return Array.from({ length: 30 }, (_, i) => ({
      id: `ambient-${i}`,
      kind: 'ambient' as const,
      look: SHADOW_LOOK(h),
      x: -9 + (i % 10) * 2,
      z: -6 + Math.floor(i / 10) * 3,
      facing: Math.PI,
      pose: 'idle' as PoseName,
    }));
  const spots: Array<[number, number]> = [
    [-12, -4],
    [-7, -11],
    [4, -12],
    [10, -3],
    [12, 8],
    [-4, 11],
    [-11, 9],
    [7, 12],
  ];
  return spots.map(([x, z], i) => ({
    id: `ambient-${i}`,
    kind: 'ambient' as const,
    look: SHADOW_LOOK(h),
    x,
    z,
    facing: (i * 1.3) % (Math.PI * 2),
    pose: i % 3 === 2 ? 'walk' : 'idle',
    sad: i % 3 !== 2,
  }));
}

const artLook = (species: string): Look => ({
  key: speciesArt(species) ? `art:${species}` : 'nubbin',
  height: GROVE3D.nubbinHeight * (speciesArt(species)?.size ?? 1),
});

/** A unique's leader, made once per unique. */
const UNIQUE_LOOK_CACHE = new Map<string, Look>();
function uniqueLook(id: string): Look {
  let look = UNIQUE_LOOK_CACHE.get(id);
  if (!look) {
    const art = artLook(uniqueArtId(id));
    look = { key: art.key, height: art.height * uniqueScale(id) };
    UNIQUE_LOOK_CACHE.set(id, look);
  }
  return look;
}

/** A neighbour's Nubbin: the adult form for its band and type, or its own line's recipe. */
function neighbourLook(nb: NeighbourNubbin): Look {
  if (nb.species !== 'chao') {
    const roster = ROSTER.find((s) => s.name.toLowerCase() === nb.species.toLowerCase());
    return roster
      ? { key: `roster:${roster.name}`, height: GROVE3D.adultHeight }
      : artLook(nb.species);
  }
  const id = `first-${nb.band}-${nb.type}`;
  return { key: variantById(id) ? `variant:${id}` : 'nubbin', height: GROVE3D.adultHeight };
}

/** The neighbour's pets and the host, read-only, where the pixel view puts them. */
function neighbours(trainer: string, nowMs: number): Figure[] {
  const out: Figure[] = neighbourGarden(trainer).map((nb, i) => ({
    id: `nb-${i}`,
    kind: 'ambient' as const,
    look: neighbourLook(nb),
    x: nb.x,
    z: nb.z,
    facing: Math.sin(nowMs / 3100 + nb.x) * 1.4,
    pose: 'idle' as const,
  }));
  const band = trainerOf(trainer).band === 'moon' ? 'moon' : 'sun';
  out.push({
    id: 'host',
    kind: 'building',
    look: { key: `keeper-${band}~npc:${trainer}`, height: GROVE3D.keeperHeight },
    x: 0,
    z: -1.5,
    facing: Math.PI,
    pose: 'idle',
  });
  return out;
}

export interface CrowdOptions {
  /** A story scene's held spots, by NPC id (see staging.ts). */
  holds?: ReadonlyMap<string, Vec2>;
  /** A story scene's drawn facings, by NPC id (render/scene-stage.ts); else toward the Keeper. */
  faces?: ReadonlyMap<string, number>;
  /** K5: NPC ids walking on to their marks now (their walk pose while held). */
  walking?: ReadonlySet<string>;
  /** The Grove's lantern posts, which a visiting Keeper is drawn clear of. */
  posts?: ReadonlyArray<Vec2>;
  /**
   * An exclusive stage's cast (campaign graphics C3, C4): when it returns a set, only the
   * NPCs it names are drawn, and no wild visitors, strays or ambient figures.
   */
  only?: () => ReadonlySet<string> | null;
}

/**
 * Nudge a figure out of the posts' keep-off circles. The sim does not count lantern posts
 * as obstacles, so an NPC's path can cross one; drawn a step aside, it never stands
 * inside the post (review 2026-10-21, play-test).
 */
export function keepOff(p: Vec2, posts?: ReadonlyArray<Vec2>): Vec2 {
  if (!posts) return p;
  const r = READ3D.post.keepOff;
  let x = p.x;
  let z = p.z;
  for (const q of posts) {
    const dx = x - q.x;
    const dz = z - q.z;
    const d = Math.hypot(dx, dz);
    if (d >= r) continue;
    // Straight on the post's centre: step aside along x.
    const k = d < 1e-4 ? 1 : dx / d;
    const m = d < 1e-4 ? 0 : dz / d;
    x = q.x + k * r;
    z = q.z + m * r;
  }
  return { x, z };
}

/** A visiting trainer's look, made once per trainer (it was rebuilt every frame). */
const NPC_LOOKS = new Map<string, Look>();
function npcFigureLook(t: string): Look {
  let look = NPC_LOOKS.get(t);
  if (!look) {
    const band = TRAINERS.find((tr) => tr.id === t)?.band === 'moon' ? 'moon' : 'sun';
    look = {
      key: `keeper-${band}~npc:${storyId(t)}`,
      height: GROVE3D.keeperHeight * (npcLookOf(storyId(t))?.scale ?? 1),
    };
    NPC_LOOKS.set(t, look);
  }
  return look;
}

/** Who stands in the scene besides the Keeper and the Nubbins, for this place and moment. */
export function crowdFor(
  world: World,
  location: Location,
  floor: Floor | null,
  nowMs: number,
  opts: CrowdOptions = {},
  /** A list to fill (cleared first), so the per-frame call can reuse one. */
  out: Figure[] = [],
): Figure[] {
  out.length = 0;
  const home = location === 'grove';
  const underground = location === 'dungeon';
  const only = opts.only?.() ?? null;
  // Visiting Keepers: the same rule as the pixel view's `npcHere`.
  for (const npc of world.npcs) {
    const t = npc.trainer;
    if (only && !only.has(t)) continue;
    const here = home
      ? true
      : underground
        ? false
        : location === 'corvin'
          ? t === 'corvin' || t === 'ember'
          : t === 'nova';
    if (!here) continue;
    // In a story scene everyone holds where they stood, turned to the Keeper (staging.ts).
    const held = opts.holds?.get(npc.id);
    const at = keepOff(held ?? npc.pos, home ? opts.posts : undefined);
    const k = world.keeper.pos;
    out.push({
      id: npc.id,
      kind: 'npc',
      look: npcFigureLook(t),
      x: at.x,
      z: at.z,
      facing: held ? (opts.faces?.get(npc.id) ?? Math.atan2(k.x - at.x, k.z - at.z)) : npc.facing,
      pose: (npc.target && !held) || opts.walking?.has(npc.id) ? 'walk' : 'idle',
      ...(t === 'byte' && !held && byteLaceUntied(world) ? { lace: true } : {}),
    });
  }
  out.push(...STAGE_FIGURES.list);
  if (only) return out;
  if (home)
    for (const w of world.wild)
      out.push({
        id: w.id,
        kind: 'wild',
        look: artLook(w.species),
        x: w.pos.x,
        z: w.pos.z,
        facing: Math.sin(nowMs / 2300 + w.pos.z) * 1.2,
        pose: w.fed ? 'happy' : 'idle',
        hop: w.fed,
        ask: !w.fed,
      });
  const run = world.dungeon;
  if (underground && run && floor) {
    // Fog of war (R0153): live actors draw only while in the Keeper's sight.
    const shown = (p: Vec2) => actorShown(run, floor, world.keeper.pos, p);
    // R0181 (lane B round 9): a friend hired at a camp walks with the party.
    const fr = run.friend;
    if (fr)
      out.push({
        id: `friend-${fr.trainer}`,
        kind: 'npc',
        look: npcFigureLook(fr.trainer),
        x: fr.pos.x,
        z: fr.pos.z,
        facing: fr.facing,
        pose: friendWalking(world, fr) ? 'walk' : 'idle',
      });
    for (const s of run.strays)
      if (shown(s.pos))
        out.push({
          id: s.id,
          kind: 'stray',
          look: SHADOW_LOOK(GROVE3D.nubbinHeight),
          x: s.pos.x,
          z: s.pos.z,
          facing: s.target ? Math.atan2(s.target.x - s.pos.x, s.target.z - s.pos.z) : 0,
          pose: s.target ? 'walk' : 'idle',
          sad: !s.target,
          ...(s.target ? { gait: strayGait(s, world.keeper.pos, world.inventory.shells) } : {}),
        });
    // Monster packs (lane B, R0146): up to three of a pack's members in a huddle; a hop is
    // the beat of surprise when one notices the Keeper. Beaten packs have gone home.
    for (const p of run.packs ?? []) {
      if (p.state === 'beaten' || !shown(p.pos)) continue;
      const spec = floor.packs?.find((q) => q.id === p.id);
      if (!spec) continue;
      const moving =
        p.state !== 'idle' ||
        (p.target !== null && Math.hypot(p.target.x - p.pos.x, p.target.z - p.pos.z) > 0.1);
      const facing = p.target ? Math.atan2(p.target.x - p.pos.x, p.target.z - p.pos.z) : 0;
      const surprised = p.state === 'chase' && world.timeMs - p.noticedMs < HOLLOW.packs.noticeMs;
      spec.members.slice(0, 3).forEach((m, i) => {
        const a = facing + Math.PI + (i - 1) * 0.9;
        const r = i === 0 ? 0 : 0.55;
        out.push({
          // One figure per member (the id was a bare ":" and every member shared one rig).
          id: `${p.id}:${i}`,
          kind: 'ambient',
          // A named unique's leader wears its own look, a size up (R0156, `unique-art.ts`).
          look: i === 0 && spec.unique ? uniqueLook(spec.unique) : artLook(m.species),
          x: p.pos.x + Math.sin(a) * r,
          z: p.pos.z + Math.cos(a) * r,
          facing,
          pose: moving ? 'walk' : 'idle',
          hop: surprised,
          // R0200: a "?" over the leader as a pack gives up and wanders home.
          ...(i === 0 &&
          p.gaveUpMs !== undefined &&
          world.timeMs - p.gaveUpMs < HOLLOW_R7.aggro.askMs
            ? { ask: true }
            : {}),
        });
      });
    }
    // The floor's wild one keeps to its nook until the Keeper creeps up on it, then is gone
    // (the pixel view stops drawing it once scanned).
    for (const w of run.wild)
      if (!w.scanned && shown(w.pos))
        out.push({
          id: w.id,
          kind: 'wild',
          look: artLook(w.species),
          x: w.pos.x,
          z: w.pos.z,
          facing: Math.sin(nowMs / 2300 + w.pos.z) * 1.2,
          pose: 'idle',
          ask: true,
        });
  }
  if (location === 'hollow' || location === 'corvin') out.push(...ambient(location));
  const visiting = visitingTrainer(world);
  if (visiting && location.startsWith('visit:')) out.push(...neighbours(visiting, nowMs));
  return out;
}

interface Member {
  key: string;
  look: Look;
  rig: Rigged | null;
  stand: THREE.Object3D | null;
  pos: THREE.Vector3;
  pose: PoseName | null;
  kind: Figure['kind'];
  ask: THREE.Sprite | null;
  /** A stray's soft ring of light on the Hollow floor, so it reads in the dark (bug 12). */
  ring: THREE.Mesh | null;
}

/** R0366 (lane E r10): one lace strand shape, shared; only Byte ever wears it. */
const LACE = {
  geo: new THREE.PlaneGeometry(0.26, 0.03),
  mat: new THREE.MeshBasicMaterial({ color: 0xffffff }),
};
const laces = new WeakMap<Member, THREE.Mesh>();

/** One ring for every stray, shared for the page's life. */
const STRAY_RING = {
  geo: new THREE.RingGeometry(0.42, 0.62, 28),
  mat: new THREE.MeshBasicMaterial({
    color: GROVE3D.cave.read.stray.color,
    transparent: true,
    opacity: GROVE3D.cave.read.stray.opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
};

export class Crowd {
  /** Reduced motion is on (read once per update): the stray rings hold still. */
  private still = false;
  private readonly members = new Map<string, Member>();
  /** Ids seen this update (kept to save a Set a frame). */
  private readonly live = new Set<string>();
  private readonly sphere = new THREE.Sphere();
  private readonly hit = new THREE.Vector3();

  constructor(
    private readonly group: THREE.Group,
    private readonly pool: CreaturePool,
    private readonly standIn: (look: Look) => THREE.Object3D,
    /** The "?" emote frame (the pixel sheet's), for `Figure.ask`. */
    private readonly askMat: () => THREE.SpriteMaterial | undefined = () => undefined,
  ) {}

  update(figures: Figure[], ground: (x: number, z: number) => number, t: number, dt: number): void {
    this.still = document.documentElement.classList.contains('reduce-motion');
    const live = this.live;
    live.clear();
    for (const f of figures) {
      live.add(f.id);
      let m = this.members.get(f.id);
      if (m && m.key !== f.look.key) {
        this.drop(f.id);
        m = undefined;
      }
      if (!m) {
        m = {
          key: f.look.key,
          look: f.look,
          rig: null,
          stand: null,
          pos: new THREE.Vector3(f.x, ground(f.x, f.z), f.z),
          pose: null,
          kind: f.kind,
          ask: null,
          ring: null,
        };
        this.members.set(f.id, m);
      }
      if (!m.rig) {
        const rig = this.pool.acquire(m.look);
        if (rig) {
          m.rig = rig;
          m.stand?.removeFromParent();
          m.stand = null;
          rig.ground = ground;
          this.group.add(rig.group);
        } else if (!m.stand) {
          m.stand = this.standIn(m.look);
        }
      }
      // Sim positions step at 10 Hz; ease toward them so walkers glide.
      const k = dt === 0 ? 1 : 1 - Math.exp(-12 * dt);
      m.pos.x += (f.x - m.pos.x) * k;
      m.pos.z += (f.z - m.pos.z) * k;
      const gy = ground(m.pos.x, m.pos.z);
      const hop = f.hop ? Math.abs(Math.sin(t * 5.5)) * 0.25 : 0;
      if (m.rig) {
        // K1, K6, K7, K41 (package a1): the stage's pose, head turn and gesture for this figure.
        const cue = poseRig(m.rig, f.id);
        const pose: PoseName =
          f.pose === 'walk' ? 'walk' : (cue ?? (f.sad && f.pose === 'idle' ? 'sad' : f.pose));
        if (m.pose !== pose) {
          m.pose = pose;
          m.rig.setPose(pose);
        }
        // R0326 (lane E r10): a stray's tiptoe lifts it; a loaded one sways as it goes.
        const ms = t * 1000;
        const tip = f.gait === 'tiptoe' ? tipLift(ms, this.still) : 0;
        const sway = f.gait === 'wobble' ? wobble(ms, this.still) * STRAY_GAIT.wobbleTurn : 0;
        m.rig.group.position.set(m.pos.x, gy + hop + tip, m.pos.z);
        m.rig.ground = hop + tip > 0 ? () => gy + hop + tip : ground;
        m.rig.face(f.facing + sway);
        m.rig.animate(
          gaitTime(
            m.rig,
            m.pos.x,
            m.pos.z,
            t + m.pos.x * 0.37,
            dt,
            f.pose === 'walk',
            f.gait === 'tiptoe' ? STRAY_GAIT.tipPace : 1,
          ),
        );
      } else if (m.stand) {
        placeStand(m.stand, m.pos.x, gy, m.pos.z, t);
      }
      const mat = f.ask ? this.askMat() : undefined;
      if (mat && !m.ask) {
        m.ask = new THREE.Sprite(mat);
        m.ask.scale.setScalar(0.42);
        this.group.add(m.ask);
      } else if (!mat && m.ask) {
        m.ask.removeFromParent();
        m.ask = null;
      }
      m.ask?.position.set(m.pos.x, gy + m.look.height + 0.35 + Math.sin(t * 2.5) * 0.04, m.pos.z);
      // R0366 (lane E r10): Byte's lace trails beside his right foot, flicking as he walks.
      let lace = laces.get(m);
      if (f.lace && !lace) {
        lace = new THREE.Mesh(LACE.geo, LACE.mat);
        laces.set(m, lace);
        this.group.add(lace);
      } else if (!f.lace && lace) {
        lace.removeFromParent();
        laces.delete(m);
        lace = undefined;
      }
      if (lace) {
        const fx = Math.sin(f.facing);
        const fz = Math.cos(f.facing);
        const flick = this.still || f.pose !== 'walk' ? 0 : Math.sin(t * 9) * 0.35;
        lace.position.set(
          m.pos.x + fz * 0.13 - fx * 0.08,
          gy + 0.03,
          m.pos.z - fx * 0.13 - fz * 0.08,
        );
        lace.rotation.set(-Math.PI / 2, 0, f.facing + 0.6 + flick);
      }
      if (f.kind === 'stray' && !m.ring) {
        m.ring = new THREE.Mesh(STRAY_RING.geo, STRAY_RING.mat);
        m.ring.rotation.x = -Math.PI / 2;
        this.group.add(m.ring);
      }
      if (m.ring) {
        // A slow sway of the ring (a bob, not a pulse), held still under reduced motion.
        const r = GROVE3D.cave.read.stray;
        const sway = this.still ? 0 : Math.sin(t * r.bobHz * Math.PI * 2 + m.pos.x);
        m.ring.position.set(m.pos.x, gy + 0.04 + (sway + 1) * r.bob * 0.5, m.pos.z);
        m.ring.scale.setScalar(1 + sway * r.bob);
      }
    }
    for (const id of [...this.members.keys()]) if (!live.has(id)) this.drop(id);
  }

  /** The nearest figure a ray passes through, with its distance. */
  pick(ray: THREE.Ray): { kind: Figure['kind']; id: string; d: number } | null {
    let best: { kind: Figure['kind']; id: string; d: number } | null = null;
    for (const [id, m] of this.members) {
      if (m.kind === 'ambient') continue;
      this.sphere.center.copy(m.pos);
      this.sphere.center.y += m.look.height * 0.5;
      this.sphere.radius = Math.max(0.5, m.look.height * 0.45);
      if (!ray.intersectSphere(this.sphere, this.hit)) continue;
      const d = this.hit.distanceTo(ray.origin);
      if (!best || d < best.d) best = { kind: m.kind, id, d };
    }
    return best;
  }

  /** Where a figure stands and how wide it is, for the tap highlight. */
  spot(id: string): { x: number; z: number; r: number } | null {
    const m = this.members.get(id);
    return m && m.kind !== 'ambient'
      ? { x: m.pos.x, z: m.pos.z, r: Math.max(0.5, m.look.height * 0.45) }
      : null;
  }

  /** Whether each figure stands as itself yet (false while a stand-in waits), for the veil. */
  readiness(): boolean[] {
    return [...this.members.values()].map((m) => !!m.rig);
  }

  /** Feet on the grass, for the pushers. */
  forEachPosition(fn: (x: number, z: number, r: number) => void): void {
    for (const m of this.members.values()) if (m.rig) fn(m.pos.x, m.pos.z, m.look.height * 0.35);
  }

  private drop(id: string): void {
    const m = this.members.get(id);
    if (!m) return;
    if (m.rig) this.pool.release(m.key, m.rig);
    m.stand?.removeFromParent();
    m.ask?.removeFromParent();
    m.ring?.removeFromParent();
    laces.get(m)?.removeFromParent();
    this.members.delete(id);
  }

  dispose(): void {
    for (const id of [...this.members.keys()]) this.drop(id);
  }
}
