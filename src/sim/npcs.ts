import { GROVE, KEEPER } from '../config/tuning';
import { clampToWorld } from './behavior';
import type { Rng } from './rng';
import type { TrainerLook } from './trainers';
import type { Npc, Vec2, World } from './types';

/** Looks for story Keepers who are not playable trainers (palette indices, see trainers.ts). */
export const EXTRA_LOOKS: Record<string, TrainerLook> = {
  corvin: {
    skin: 15,
    hat: 0,
    hatBand: 4,
    shirt: 4,
    shirtShade: 1,
    pants: 0,
    boots: 0,
    hair: 1,
    outline: 0,
    hatStyle: 'band',
  },
  hazel: {
    skin: 15,
    hat: 31,
    hatBand: 25,
    shirt: 28,
    shirtShade: 27,
    pants: 13,
    boots: 12,
    hair: 5,
    outline: 1,
    hatStyle: 'sun',
  },
};

/** Where visiting Keepers like to stand. */
const HOMES: Record<string, Vec2> = {
  fern: { x: -5, z: -2 },
  marina: { x: 14, z: 5 },
  sparks: { x: -4, z: 8 },
  clover: { x: -10, z: 3 },
  pixel: { x: 2, z: -7 },
  luna: { x: -14, z: 16 },
  ember: { x: 14, z: -7 },
  byte: { x: -8, z: -14 },
  dusty: { x: -12, z: 8 },
  nova: { x: 18, z: 9 },
  corvin: { x: 3, z: 14 },
  hazel: { x: 5, z: 2 },
};

export function spawnNpc(world: World, trainer: string): Npc {
  const home = HOMES[trainer] ?? { x: 0, z: 6 };
  const npc: Npc = {
    id: `npc-${trainer}`,
    trainer,
    pos: { x: home.x, z: home.z },
    facing: Math.PI,
    target: null,
    waitMs: 1000,
    home: { ...home },
  };
  world.npcs = world.npcs.filter((n) => n.id !== npc.id);
  world.npcs.push(npc);
  return npc;
}

export function removeNpc(world: World, trainer: string): void {
  world.npcs = world.npcs.filter((n) => n.trainer !== trainer);
}

const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);

/** Visiting Keepers potter about near their spot and turn to face the player when close. */
export function stepNpcs(world: World, dtMs: number, rng: Rng): void {
  const dt = dtMs / 1000;
  for (const npc of world.npcs) {
    const near = dist(npc.pos, world.keeper.pos) < 2.5;
    if (near) {
      npc.facing = Math.atan2(world.keeper.pos.x - npc.pos.x, world.keeper.pos.z - npc.pos.z);
      npc.target = null;
      continue;
    }
    if (npc.target) {
      const d = dist(npc.pos, npc.target);
      if (d < 0.2) {
        npc.target = null;
        npc.waitMs = rng.float(3000, 9000);
      } else {
        const step = Math.min(d, KEEPER.speed * 0.4 * dt);
        const dx = (npc.target.x - npc.pos.x) / d;
        const dz = (npc.target.z - npc.pos.z) / d;
        npc.pos.x += dx * step;
        npc.pos.z += dz * step;
        npc.facing = Math.atan2(dx, dz);
      }
    } else {
      npc.waitMs -= dtMs;
      if (npc.waitMs <= 0) {
        const a = rng.float(0, Math.PI * 2);
        const r = rng.float(0.5, 2.5);
        const t = { x: npc.home.x + Math.cos(a) * r, z: npc.home.z + Math.sin(a) * r };
        // Keep out of the pond.
        if (dist(t, GROVE.pond) < GROVE.pond.r + 1) {
          npc.waitMs = 1000;
          continue;
        }
        clampToWorld(t);
        npc.target = t;
      }
    }
  }
}

export function npcNear(world: World, id: string, radius = 3): Npc | undefined {
  const npc = world.npcs.find((n) => n.id === id);
  if (!npc) return undefined;
  return dist(npc.pos, world.keeper.pos) <= radius ? npc : undefined;
}
