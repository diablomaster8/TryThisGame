import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';
import type { PoseName, Rigged } from '../samples/species';
import { speciesArt } from '../render/sprites/species-art';
import type { Floor } from '../sim/dungeon';
import { TRAINERS } from '../sim/trainers';
import type { Location, World } from '../sim/types';
import type { CreaturePool, Look } from './creature-pool';
import { gaitTime } from './gait';

/**
 * Everyone in the 3D scene who is not the Keeper or one of the Keeper's Nubbins: visiting
 * Keepers (the campaign's NPCs), wild visitors in the Grove, the Shadow strays and the
 * wild one on a Hollow floor, and the grey Nubbins that sit about the story Hollow and
 * Corvin's rows. They read the same sim state as the pixel view's `world-view.ts` and come
 * from the same creature pool, so a look is sculpted once whoever wears it.
 */
export interface Figure {
  id: string;
  /** The pick kind the input expects for a tap on this figure. */
  kind: 'npc' | 'wild' | 'stray' | 'ambient';
  look: Look;
  x: number;
  z: number;
  facing: number;
  pose: PoseName;
  /** Head hung and arms in, laid over the pose (the Shadows' sad stand). */
  sad?: boolean;
  /** A little hop in place (a fed wild visitor). */
  hop?: boolean;
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

/** Who stands in the scene besides the Keeper and the Nubbins, for this place and moment. */
export function crowdFor(
  world: World,
  location: Location,
  floor: Floor | null,
  nowMs: number,
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
    const band = TRAINERS.find((tr) => tr.id === t)?.band === 'moon' ? 'moon' : 'sun';
    out.push({
      id: npc.id,
      kind: 'npc',
      look: { key: `keeper-${band}~npc:${t}`, height: GROVE3D.keeperHeight },
      x: npc.pos.x,
      z: npc.pos.z,
      facing: npc.facing,
      pose: npc.target ? 'walk' : 'idle',
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
    for (const w of run.wild)
      out.push({
        id: w.id,
        kind: 'wild',
        look: artLook(w.species),
        x: w.pos.x,
        z: w.pos.z,
        facing: Math.sin(nowMs / 2300 + w.pos.z) * 1.2,
        pose: w.scanned ? 'happy' : 'idle',
      });
  }
  if (location === 'hollow' || location === 'corvin') out.push(...ambient(location));
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
  overlay: Array<{ o: THREE.Object3D; x: number; z: number }>;
}

export class Crowd {
  private readonly members = new Map<string, Member>();
  private readonly sphere = new THREE.Sphere();
  private readonly hit = new THREE.Vector3();

  constructor(
    private readonly group: THREE.Group,
    private readonly pool: CreaturePool,
    private readonly standIn: (look: Look) => THREE.Object3D,
  ) {}

  update(figures: Figure[], ground: (x: number, z: number) => number, t: number, dt: number): void {
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
          overlay: [],
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
        for (const u of m.overlay) {
          u.o.rotation.x -= u.x;
          u.o.rotation.z -= u.z;
        }
        m.overlay.length = 0;
        if (m.pose !== f.pose) {
          m.pose = f.pose;
          m.rig.setPose(f.pose);
        }
        m.rig.group.position.set(m.pos.x, gy + hop, m.pos.z);
        m.rig.ground = hop > 0 ? () => gy + hop : ground;
        m.rig.face(f.facing);
        m.rig.animate(gaitTime(m.rig, m.pos.x, m.pos.z, t + m.pos.x * 0.37, dt, f.pose === 'walk'));
        if (f.sad) {
          const lay = (name: string, x: number, z: number) => {
            const o = m.rig!.bones[name];
            if (!o) return;
            o.rotation.x += x;
            o.rotation.z += z;
            m.overlay.push({ o, x, z });
          };
          lay('head', 0.42, 0);
          lay('armL', 0.2, -0.35);
          lay('armR', 0.2, 0.35);
        }
      } else if (m.stand) {
        m.stand.position.set(m.pos.x, gy + m.stand.scale.y * 0.9, m.pos.z);
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

  /** Feet on the grass, for the pushers. */
  positions(): Array<{ x: number; z: number; r: number }> {
    return [...this.members.values()]
      .filter((m) => m.rig)
      .map((m) => ({ x: m.pos.x, z: m.pos.z, r: m.look.height * 0.35 }));
  }

  private drop(id: string): void {
    const m = this.members.get(id);
    if (!m) return;
    if (m.rig) {
      for (const u of m.overlay) {
        u.o.rotation.x -= u.x;
        u.o.rotation.z -= u.z;
      }
      this.pool.release(m.key, m.rig);
    }
    m.stand?.removeFromParent();
    this.members.delete(id);
  }

  dispose(): void {
    for (const id of [...this.members.keys()]) this.drop(id);
  }
}
