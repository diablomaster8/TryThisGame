import * as THREE from 'three';
import { GROVE3D, READ3D } from '../config/tuning';
import type { PoseName, Rigged } from '../samples/species';
import { speciesArt } from '../render/sprites/species-art';
import type { Floor } from '../sim/dungeon';
import { neighbourGarden, visitingTrainer, type NeighbourNubbin } from '../sim/neighbourhood';
import { ROSTER } from '../samples/species-roster';
import { variantById } from '../samples/nubbin-variant-catalogue';
import { TRAINERS, trainerOf } from '../sim/trainers';
import type { Location, Vec2, World } from '../sim/types';
import type { CreaturePool, Look } from './creature-pool';
import { gaitTime } from './gait';
import { placeStand } from './item-kit';

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
}

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
  /** The Grove's lantern posts, which a visiting Keeper is drawn clear of. */
  posts?: ReadonlyArray<Vec2>;
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

/** Who stands in the scene besides the Keeper and the Nubbins, for this place and moment. */
export function crowdFor(
  world: World,
  location: Location,
  floor: Floor | null,
  nowMs: number,
  opts: CrowdOptions = {},
): Figure[] {
  const out: Figure[] = [];
  const home = location === 'grove';
  const underground = location === 'dungeon';
  // Visiting Keepers: the same rule as the pixel view's `npcHere`.
  for (const npc of world.npcs) {
    const t = npc.trainer;
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
    const band = TRAINERS.find((tr) => tr.id === t)?.band === 'moon' ? 'moon' : 'sun';
    out.push({
      id: npc.id,
      kind: 'npc',
      look: { key: `keeper-${band}~npc:${t}`, height: GROVE3D.keeperHeight },
      x: at.x,
      z: at.z,
      facing: held ? (opts.faces?.get(npc.id) ?? Math.atan2(k.x - at.x, k.z - at.z)) : npc.facing,
      pose: npc.target && !held ? 'walk' : 'idle',
    });
  }
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
    for (const s of run.strays)
      out.push({
        id: s.id,
        kind: 'stray',
        look: SHADOW_LOOK(GROVE3D.nubbinHeight),
        x: s.pos.x,
        z: s.pos.z,
        facing: s.target ? Math.atan2(s.target.x - s.pos.x, s.target.z - s.pos.z) : 0,
        pose: s.target ? 'walk' : 'idle',
        sad: !s.target,
      });
    // The floor's wild one keeps to its nook until the Keeper creeps up on it, then is gone
    // (the pixel view stops drawing it once scanned).
    for (const w of run.wild)
      if (!w.scanned)
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
    const live = new Set<string>();
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
        const pose: PoseName = f.sad && f.pose === 'idle' ? 'sad' : f.pose;
        if (m.pose !== pose) {
          m.pose = pose;
          m.rig.setPose(pose);
        }
        m.rig.group.position.set(m.pos.x, gy + hop, m.pos.z);
        m.rig.ground = hop > 0 ? () => gy + hop : ground;
        m.rig.face(f.facing);
        m.rig.animate(gaitTime(m.rig, m.pos.x, m.pos.z, t + m.pos.x * 0.37, dt, f.pose === 'walk'));
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
  positions(): Array<{ x: number; z: number; r: number }> {
    return [...this.members.values()]
      .filter((m) => m.rig)
      .map((m) => ({ x: m.pos.x, z: m.pos.z, r: m.look.height * 0.35 }));
  }

  private drop(id: string): void {
    const m = this.members.get(id);
    if (!m) return;
    if (m.rig) this.pool.release(m.key, m.rig);
    m.stand?.removeFromParent();
    m.ask?.removeFromParent();
    m.ring?.removeFromParent();
    this.members.delete(id);
  }

  dispose(): void {
    for (const id of [...this.members.keys()]) this.drop(id);
  }
}
