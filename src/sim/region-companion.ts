import { FOLLOW_SLOT } from '../config/tuning-move-nub';
import { KEEPER } from '../config/tuning';
import {
  BIOME_LEAN,
  BIOME_LEAN_AMOUNT,
  BIOME_REACTIONS,
  REACTION_MS,
  type BiomeReaction,
} from '../config/region-wild';
import { REGIONS } from '../config/regions';
import { isFree } from './nubbin';
import { isPartner } from './partners';
import { drawnRegion, layoutOf, resolveRegion } from './region-walk';
import { regionOf } from './regions';
import type { Nubbin, Personality, SimEvent, World } from './types';

/**
 * R0121 (WORLD-54): Nubbins come along on trips. The partners follow the Keeper into a drawn
 * region (the Wood), walking at its heels round the trees, and on first stepping into a new
 * biome each plays a short reaction for its personality (a Shy one hides behind the Keeper's
 * legs, a Lazy one flops down) and takes a small, one-time type lean for that biome. A Nubbin
 * left in the Grove stays home and is not drawn. The Grove's own behaviour step skips a partner
 * while the Keeper is away; this step moves it instead, with no random draws.
 */

/** The partners that travel (free, not eggs), in slot order. */
export function companions(world: World): Nubbin[] {
  const out: Nubbin[] = [];
  for (const id of world.partners) {
    const n = id ? world.nubbins.find((x) => x.id === id) : undefined;
    if (n && n.stage !== 'egg' && n.stage !== 'cocoon') out.push(n);
  }
  return out;
}

/** The reaction a personality has to a biome (a Nubbin with none yet is cheerful). */
export function reactionFor(biome: string, personality: Personality | null): BiomeReaction {
  const set = BIOME_REACTIONS[biome as keyof typeof BIOME_REACTIONS] ?? BIOME_REACTIONS.meadow!;
  return set[personality ?? 'cheerful'];
}

function slotOf(world: World, index: number): { x: number; z: number } {
  const k = world.keeper;
  const a = k.facing + Math.PI + (index === 0 ? 1 : -1) * FOLLOW_SLOT.spread;
  return {
    x: k.pos.x + Math.sin(a) * FOLLOW_SLOT.slot,
    z: k.pos.z + Math.cos(a) * FOLLOW_SLOT.slot,
  };
}

/** Called as the Keeper arrives somewhere (`noteRegion`): bring the partners, react, lean. */
export function companionsArrive(world: World, events: SimEvent[]): void {
  const region = regionOf(world.location);
  const here = drawnRegion(world);
  const list = companions(world);
  list.forEach((n, i) => {
    if (!isFree(n)) return;
    const s = slotOf(world, i);
    n.pos = { x: s.x, z: s.z };
    n.vel = { x: 0, y: 0, z: 0 };
    n.y = 0;
    if (!here) {
      n.behavior.state = 'wander';
      n.behavior.target = null;
      return;
    }
    const biome = REGIONS[region].biome;
    const r = reactionFor(biome, n.personality);
    n.behavior.state = r.state;
    n.behavior.sinceMs = world.timeMs;
    n.behavior.untilMs = world.timeMs + REACTION_MS;
    n.behavior.target = null;
    const seen = (n.regionsSeen ??= []);
    const first = !seen.includes(region);
    if (first) {
      seen.push(region);
      const stat = BIOME_LEAN[biome];
      if (stat) n.typeLean[stat] += BIOME_LEAN_AMOUNT;
    }
    events.push({ kind: 'companionReacts', id: n.id, region, first });
  });
}

/** One step of a travelling partner: true when it moved it (the Grove's step then skips it). */
export function stepRegionCompanion(world: World, n: Nubbin, dtMs: number): boolean {
  const here = drawnRegion(world);
  if (!here || !isPartner(world, n.id) || !isFree(n)) return false;
  const index = world.partners[0] === n.id ? 0 : 1;
  const biome = REGIONS[here].biome;
  const r = reactionFor(biome, n.personality);
  const reacting = world.timeMs < n.behavior.untilMs && n.behavior.state === r.state;
  // The shy one hides right at the Keeper's back while it reacts.
  let slot = slotOf(world, index);
  if (reacting && r.hide) {
    const k = world.keeper;
    slot = { x: k.pos.x - Math.sin(k.facing) * 0.4, z: k.pos.z - Math.cos(k.facing) * 0.4 };
  }
  const dx = slot.x - n.pos.x;
  const dz = slot.z - n.pos.z;
  const d = Math.hypot(dx, dz);
  const lay = layoutOf(here);
  if (d > 0.35 && !(reacting && d < 1.2)) {
    // Keeps up at a little over a walk, and catches up fast when left behind.
    const step = Math.min(d, KEEPER.speed * (d > 6 ? 1.8 : 1.1) * (dtMs / 1000));
    n.pos.x += (dx / d) * step;
    n.pos.z += (dz / d) * step;
    n.facing = Math.atan2(dx, dz);
    if (lay) resolveRegion(lay, n.pos, 0.35);
    if (!reacting && n.behavior.state !== 'wander') {
      n.behavior.state = 'wander';
      n.behavior.sinceMs = world.timeMs;
      n.behavior.untilMs = world.timeMs + 4000;
    }
  } else if (!reacting && n.behavior.state === 'wander') {
    n.behavior.state = 'sit';
    n.behavior.sinceMs = world.timeMs;
    n.behavior.untilMs = world.timeMs + 4000;
  }
  // Keep a long state from lapsing into the Grove's own idle picks.
  if (world.timeMs >= n.behavior.untilMs) n.behavior.untilMs = world.timeMs + 4000;
  return true;
}

/** R13 d2 (R0121): what a drawn region shows: the partners and the Nubbin the Keeper carries. */
export function regionShown(world: World): Nubbin[] {
  const out = companions(world);
  const c = world.keeper.carrying;
  const n = c ? world.nubbins.find((x) => x.id === c) : undefined;
  if (n && !out.includes(n)) out.push(n);
  return out;
}
