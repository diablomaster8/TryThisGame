import {
  GATE_LEVEL,
  GATE_RULES,
  GATE_STAT,
  REGION_GATES,
  type GateKind,
  type RegionGate,
} from '../config/region-wild';
import { GATE_PLAN } from '../config/tuning-r12d2';
import type { RegionId } from '../config/regions';
import { isPartner } from './partners';
import { scatterSpots } from './region-spots';
import { layoutOf } from './region-walk';
import { regionOf } from './regions';
import { levelOf } from './stats';
import type { Nubbin, SimEvent, World } from './types';

/**
 * R0110 (WORLD-24): stat-shaped gates on optional ground. A boulder asks a partner with Power
 * 25, deep water Swim, an updraft Fly, a long run Run: raising the type pays off in the world,
 * the Chao-garden way. Behind a gate lies a secret or a keepsake, never a story step (a test
 * checks it). The first gate is the Wood's boulder: leave the matching partner by it for a
 * moment and it rolls aside. Open is kept per save in `world.collected` (`gate:<region>:<id>`).
 */
const gateKey = (region: string, id: string) => `gate:${region}:${id}`;

export function gateIsOpen(world: Pick<World, 'collected'>, region: string, id: string): boolean {
  return (world.collected ?? {})[gateKey(region, id)] !== undefined;
}

const planned = new Map<string, readonly RegionGate[]>();

/**
 * A region's gates: its authored ones (the Wood's boulder), or the one `GATE_PLAN` gives it,
 * seeded onto open ground far from the path and every point of interest (R12 d2).
 */
export function gatesOf(region: string): readonly RegionGate[] {
  const own = REGION_GATES[region];
  if (own) return own;
  const hit = planned.get(region);
  if (hit) return hit;
  const plan = GATE_PLAN.regions[region];
  const l = layoutOf(region as RegionId);
  let out: readonly RegionGate[] = [];
  if (plan && l) {
    const avoid = [...l.spec.path, ...l.spec.pois];
    // The path between its points too, every few units.
    for (let i = 0; i + 1 < l.spec.path.length; i++) {
      const a = l.spec.path[i]!;
      const b = l.spec.path[i + 1]!;
      const n = Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / 4);
      for (let k = 1; k < n; k++)
        avoid.push({ x: a.x + ((b.x - a.x) * k) / n, z: a.z + ((b.z - a.z) * k) / n });
    }
    const at = scatterSpots(region as RegionId, 'gate', 1, 10, avoid, GATE_PLAN.awayFrom)[0];
    if (at)
      out = [
        {
          id: `${region}-${plan.kind}`,
          kind: plan.kind,
          x: at.x,
          z: at.z,
          r: GATE_PLAN.r,
          behind: { x: at.x, z: at.z, r: 3 },
          reward: { shells: plan.shells, essence: plan.essence },
        },
      ];
  }
  planned.set(region, out);
  return out;
}

/** The gates still shut in the region the Keeper is in. */
export function closedGates(world: World): RegionGate[] {
  const region = regionOf(world.location);
  return gatesOf(region).filter((g) => !gateIsOpen(world, region, g.id));
}

/** Whether `n` has what a gate of this kind asks. */
export function canOpen(n: Nubbin, kind: GateKind): boolean {
  return n.stage !== 'egg' && levelOf(n.stats[GATE_STAT[kind]].points) >= GATE_LEVEL;
}

/** Keep the Keeper out of a shut gate, and let a fit partner standing by it open it. */
export function stepRegionGates(world: World, dtMs: number, events: SimEvent[]): void {
  if (!world.location.startsWith('region:')) return;
  const region = regionOf(world.location);
  const k = world.keeper.pos;
  for (const g of closedGates(world)) {
    // A boulder is solid: out along the line from its centre.
    const d = Math.hypot(k.x - g.x, k.z - g.z);
    const min = g.r + 0.45;
    if (d < min) {
      const nx = d > 1e-6 ? (k.x - g.x) / d : 1;
      const nz = d > 1e-6 ? (k.z - g.z) / d : 0;
      k.x = g.x + nx * min;
      k.z = g.z + nz * min;
    }
    const tries = (world.gateTries ??= {});
    const fit = world.nubbins.some(
      (n) =>
        isPartner(world, n.id) &&
        canOpen(n, g.kind) &&
        Math.hypot(n.pos.x - g.x, n.pos.z - g.z) <= GATE_RULES.reach,
    );
    const id = gateKey(region, g.id);
    if (!fit) {
      if (tries[id]) tries[id] = Math.max(0, tries[id]! - dtMs);
      continue;
    }
    tries[id] = (tries[id] ?? 0) + dtMs;
    if (tries[id]! < GATE_RULES.openMs) continue;
    delete tries[id];
    openGate(world, region, g, events);
  }
}

/** A gate gives way: kept once, its reward given once. */
export function openGate(world: World, region: string, g: RegionGate, events: SimEvent[]): void {
  if (gateIsOpen(world, region, g.id)) return;
  (world.collected ??= {})[gateKey(region, g.id)] = world.timeMs;
  if (g.reward.shells) world.inventory.shells += g.reward.shells;
  if (g.reward.essence)
    world.inventory.essences[g.reward.essence] =
      (world.inventory.essences[g.reward.essence] ?? 0) + 1;
  events.push({ kind: 'gateOpened', region, id: g.id });
}
