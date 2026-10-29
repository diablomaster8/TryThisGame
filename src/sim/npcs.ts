import { NPC_MOVE } from '../config/tuning-move-npc';
import { nubbinAim, type NubbinRoute } from './nav';
import { blocked, resolve, wayAt } from './obstacles';
import { GROVE, KEEPER, NPC_ROUTINE } from '../config/tuning';
import { routineArrived, routineTarget } from './npc-routines';
import { clampToWorld } from './behavior';
import type { Rng } from './rng';
import type { TrainerLook } from './trainers';
import type { Npc, SimEvent, Vec2, World } from './types';

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
  // The language teachers: their own faces on the dialogue portrait, not a stand-in Keeper's.
  ori: {
    skin: 14,
    hat: 29,
    hatBand: 17,
    shirt: 29,
    shirtShade: 17,
    pants: 16,
    boots: 12,
    hair: 12,
    outline: 0,
    hatStyle: 'none',
  },
  hana: {
    skin: 15,
    hat: 31,
    hatBand: 24,
    shirt: 24,
    shirtShade: 23,
    pants: 2,
    boots: 1,
    hair: 0,
    outline: 0,
    hatStyle: 'band',
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

/** Where a Keeper stands in the current layout. */
export function npcHome(trainer: string): Vec2 {
  return HOMES[trainer] ?? { x: 0, z: 6 };
}

export function spawnNpc(world: World, trainer: string): Npc {
  const home = npcHome(trainer);
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

/** A wandering visitor's walk: the planned route (kept outside the save) and its pauses. */
interface NpcWalk {
  route: NubbinRoute | null;
  /** The path request for the next aim: 1 on a fresh target, 2 after being stuck, then 0. */
  want: 0 | 1 | 2;
  pauseMs: number;
  /** Already waited once for the Keeper this stretch, so it goes round next. */
  yielded: boolean;
  stuckMs: number;
  gaveUp: boolean;
}
const walkOf = new WeakMap<Npc, NpcWalk>();
const probeAt: Vec2 = { x: 0, z: 0 };

/**
 * A spot near home a visitor can stand on: out of every solid and the pond (R0036), redrawn
 * a few times, else null and it waits.
 */
function wanderTarget(world: World, npc: Npc, rng: Rng, centre: Vec2 = npc.home): Vec2 | null {
  for (let i = 0; i < NPC_MOVE.resample; i++) {
    const a = rng.float(0, Math.PI * 2);
    const r = rng.float(0.5, centre === npc.home ? 2.5 : NPC_ROUTINE.potter);
    const t = { x: centre.x + Math.cos(a) * r, z: centre.z + Math.sin(a) * r };
    if (dist(t, GROVE.pond) < GROVE.pond.r + 1) continue;
    clampToWorld(t);
    if (!blocked(t, world, NPC_MOVE.radius, 'keeper')) return t;
  }
  return null;
}

/** Whether a probe at (x, z) is open ground and clear of the Keeper. */
function open(world: World, x: number, z: number, withKeeper: boolean): boolean {
  probeAt.x = x;
  probeAt.z = z;
  if (wayAt(probeAt, world, NPC_MOVE.radius, 'keeper') === 2) return false;
  return !(withKeeper && dist(probeAt, world.keeper.pos) < NPC_MOVE.keeperBlock);
}

/**
 * One step of a wander: aim at the next corner of a planned path (planned once per target,
 * the Nubbins' grid), look ahead, turn aside for a solid, and stop 600 ms when the Keeper
 * is in the way before walking round.
 */
function walkStep(world: World, npc: Npc, d: number, dt: number, dtMs: number): void {
  const st = walkOf.get(npc) ?? {
    route: null,
    want: 0,
    pauseMs: 0,
    yielded: false,
    stuckMs: 0,
    gaveUp: false,
  };
  walkOf.set(npc, st);
  if (st.pauseMs > 0) {
    st.pauseMs -= dtMs;
    return;
  }
  const target = npc.target!;
  const aim = nubbinAim(world, st, 'keeper', npc.pos, target, d > NPC_MOVE.pathFar ? st.want : 0);
  st.want = 0;
  const h0 = Math.atan2(aim.x - npc.pos.x, aim.z - npc.pos.z);
  const step = Math.min(d, KEEPER.speed * 0.4 * dt);
  const ahead = Math.min(NPC_MOVE.probe, d);
  const at = (h: number, withKeeper: boolean): boolean =>
    open(world, npc.pos.x + Math.sin(h) * ahead, npc.pos.z + Math.cos(h) * ahead, withKeeper);
  let heading = h0;
  if (!at(h0, true)) {
    if (at(h0, false) && !st.yielded) {
      // Only the Keeper is in the way: wait a beat, then go round.
      st.pauseMs = NPC_MOVE.keeperPauseMs;
      st.yielded = true;
      return;
    }
    let found = false;
    for (const deg of NPC_MOVE.turnsDeg)
      for (const s of [1, -1]) {
        const h = h0 + s * ((deg * Math.PI) / 180);
        if (!found && at(h, true)) {
          heading = h;
          found = true;
        }
      }
    if (!found) {
      st.pauseMs = 1000;
      st.want = 2;
      st.route = null;
      return;
    }
  } else st.yielded = false;
  const before = { x: npc.pos.x, z: npc.pos.z };
  npc.pos.x += Math.sin(heading) * step;
  npc.pos.z += Math.cos(heading) * step;
  resolve(npc.pos, world, NPC_MOVE.radius, 'keeper');
  npc.facing = heading;
  // Pressed against something with no way on: plan again, then give the spot up.
  if (dist(before, npc.pos) < step * 0.3) {
    st.stuckMs += dtMs;
    if (st.stuckMs > NPC_MOVE.stuckMs) {
      st.stuckMs = 0;
      st.route = null;
      st.want = 2;
      if (st.gaveUp) npc.target = null;
      st.gaveUp = !st.gaveUp;
    }
  } else st.stuckMs = 0;
}

/** Visiting Keepers potter about near their spot and turn to face the player when close. */
export function stepNpcs(world: World, dtMs: number, rng: Rng, events: SimEvent[] = []): void {
  const dt = dtMs / 1000;
  // While a story scene is up the cast holds its places, turned to the Keeper (review D, 11).
  const scene = (world.campaign?.queue.length ?? 0) > 0;
  for (const npc of world.npcs) {
    const near = dist(npc.pos, world.keeper.pos) < 2.5;
    if (near || scene) {
      npc.facing = Math.atan2(world.keeper.pos.x - npc.pos.x, world.keeper.pos.z - npc.pos.z);
      npc.target = null;
      continue;
    }
    if (npc.target) {
      const d = dist(npc.pos, npc.target);
      // R0296: near enough to a routine station counts as there (its spot can sit by a solid).
      const spot = routineTarget(world, npc);
      const atStation =
        spot !== null &&
        npc.target.x === spot.x &&
        npc.target.z === spot.z &&
        d < NPC_ROUTINE.arrive;
      // The day moved on to the next station while pottering: head there instead.
      if (spot && !atStation && npc.target !== spot && dist(npc.pos, spot) > NPC_ROUTINE.near) {
        if (npc.target.x !== spot.x || npc.target.z !== spot.z) {
          npc.target = spot;
          walkOf.set(npc, {
            route: null,
            want: 1,
            pauseMs: 0,
            yielded: false,
            stuckMs: 0,
            gaveUp: false,
          });
          continue;
        }
      }
      if (d < 0.2 || atStation) {
        npc.target = null;
        npc.waitMs = rng.float(3000, 9000);
        // Arriving at a routine station says its line.
        if (spot && dist(npc.pos, spot) < NPC_ROUTINE.near) routineArrived(world, npc, events);
      } else {
        walkStep(world, npc, d, dt, dtMs);
      }
    } else {
      npc.waitMs -= dtMs;
      if (npc.waitMs <= 0) {
        // R0296: off to the routine's station, else potter round it (or round home).
        const spot = routineTarget(world, npc);
        const t =
          spot && dist(npc.pos, spot) > NPC_ROUTINE.near
            ? spot
            : wanderTarget(world, npc, rng, spot ?? npc.home);
        if (!t) {
          npc.waitMs = 1000;
          continue;
        }
        npc.target = t;
        walkOf.set(npc, {
          route: null,
          want: 1,
          pauseMs: 0,
          yielded: false,
          stuckMs: 0,
          gaveUp: false,
        });
      }
    }
  }
}

export function npcNear(world: World, id: string, radius = 3): Npc | undefined {
  const npc = world.npcs.find((n) => n.id === id);
  if (!npc) return undefined;
  return dist(npc.pos, world.keeper.pos) <= radius ? npc : undefined;
}
