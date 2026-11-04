/**
 * R11 lane D (d1): the Keeper in a drawn region beyond the Grove (WORLD-25, 39, 56). A drawn
 * region is a `Location` of the form `region:<id>`; its ground is the walk grid and solids of
 * its `RegionSpec` (`config/region-layout.ts`), not the Grove's hills and colliders. Here:
 * - which drawn region the Keeper is in (`drawnRegion`), and the registry of region specs a
 *   new region joins (`REGION_SPECS`);
 * - walking there: stick and tap walks (A* on the walk grid), sliding along the trees, pushed
 *   out of trunks and buildings, never off the region (`stepRegionWalk`);
 * - the borders (WORLD-39): stepping into an exit's box asks for the crossing. A seamless exit
 *   crosses at once and re-bases the Keeper into the neighbour's own coordinates (a floating
 *   origin, WORLD-56: every region stays local and small); a loaded exit (gate, door, stairs)
 *   raises `exitReached` and the game plays the iris, then sends `travel` at the dark moment.
 * Nubbins stay home in the Grove and keep simulating; the region holds only the Keeper.
 */
import { REGIONS, type RegionExit, type RegionId } from '../config/regions';
import {
  cellAt,
  regionLayout,
  terraceHeight,
  type RegionLayout,
  type RegionSolid,
  type RegionSpec,
} from '../config/region-layout';
import { WOOD_SPEC } from '../config/region-wood';
import { RIDGE_SPEC } from '../config/region-ridge';
import { RUINS_SPEC, ruinsState } from '../config/region-ruins';
import { SHORE_SPEC } from '../config/region-shore';
import { MOON_SPEC, SUN_SPEC } from '../config/region-sunmoon';
import { GROVE_EDGE_SPEC } from '../config/region-grove-edge';
import { REGION_WALK } from '../config/tuning-r11d1';
import { KEEPER } from '../config/tuning';
import { astar, stringPull, gridLineOfSight } from './astar';
import { keeperSpeedMultiplier } from './perks';
import type { Location, SimEvent, Vec2, World } from './types';
import {
  inAirLane,
  ledgeAt,
  regionFlightStep,
  regionFlightTrigger,
  regionPassable,
  stepRegionVertical,
} from './region-moves';

/** Every drawn region beyond the Grove. A new region joins here with its spec (see the report). */
export const REGION_SPECS: Partial<Record<RegionId, RegionSpec>> = {
  wood: WOOD_SPEC,
  shore: SHORE_SPEC,
  sunlands: SUN_SPEC,
  moonlands: MOON_SPEC,
  ruins: RUINS_SPEC,
  ridge: RIDGE_SPEC,
};

/**
 * R11 d7: places drawn only as a seamless neighbour's edge, never entered as a region (the
 * Grove has its own scene; from inside the shore the engine draws this stand-in strip of it).
 */
export const EDGE_SPECS: Partial<Record<RegionId, RegionSpec>> = {
  grove: GROVE_EDGE_SPEC,
};

const PREFIX = 'region:';

/** The location string of a drawn region. */
export function regionLocation(id: RegionId): Location {
  return `${PREFIX}${id}`;
}

/** The drawn region the Keeper is in, or null in the Grove, a visit, the Hollow. */
export function drawnRegion(world: World | { location: Location }): RegionId | null {
  return drawnRegionOf(world.location);
}

export function drawnRegionOf(location: Location): RegionId | null {
  if (!location.startsWith(PREFIX)) return null;
  const id = location.slice(PREFIX.length) as RegionId;
  return REGION_SPECS[id] ? id : null;
}

const FLAT = (): number => 0;
const grounds = new Map<RegionId, (x: number, z: number) => number>();

/**
 * R11 d7 (WORLD-36): the ground height under (x, z) in the drawn region a location names (its
 * terraces), or a flat 0 anywhere else that is not the Grove. The renderers stand the Keeper
 * and aim the cameras with it.
 */
export function regionGround(location: Location): (x: number, z: number) => number {
  const id = drawnRegionOf(location);
  const spec = id ? REGION_SPECS[id] : undefined;
  if (!id || !spec?.terraces) return FLAT;
  let fn = grounds.get(id);
  if (!fn) grounds.set(id, (fn = (_x: number, z: number) => terraceHeight(spec, z)));
  return fn;
}

/** R11 d7: which terrace a point stands on in a drawn region (0 the lowest; 0 when flat). */
export function regionLevel(location: Location, z: number): number {
  const id = drawnRegionOf(location);
  const t = id ? REGION_SPECS[id]?.terraces : undefined;
  if (!t) return 0;
  const ys = [...new Set(t.map((x) => x.y))].sort((a, b) => a - b);
  const y = terraceHeight(REGION_SPECS[id!]!, z);
  let level = 0;
  for (let i = 0; i < ys.length; i++) if (y >= ys[i]! - 1e-6) level = i;
  return level;
}

/** The layout of a drawn region (built once). */
export function layoutOf(id: RegionId): RegionLayout | null {
  const spec = REGION_SPECS[id] ?? EDGE_SPECS[id];
  return spec ? regionLayout(spec) : null;
}

// ---------------------------------------------------------------- solids

interface SolidIndex {
  cells: Map<number, RegionSolid[]>;
}
const solidIndex = new WeakMap<RegionLayout, SolidIndex>();
const SOLID_CELL = 4;

function solidsOf(l: RegionLayout): SolidIndex {
  let s = solidIndex.get(l);
  if (s) return s;
  const all: RegionSolid[] = [...l.solids];
  for (const t of l.trees) if (t.solid) all.push({ x: t.x, z: t.z, r: 0.3 + 0.15 * t.s });
  const cells = new Map<number, RegionSolid[]>();
  for (const c of all) {
    const reach = Math.max(c.r, (c.w ?? 0) / 2, (c.h ?? 0) / 2) + 1;
    for (
      let z = Math.floor((c.z - reach) / SOLID_CELL);
      z <= Math.floor((c.z + reach) / SOLID_CELL);
      z++
    )
      for (
        let x = Math.floor((c.x - reach) / SOLID_CELL);
        x <= Math.floor((c.x + reach) / SOLID_CELL);
        x++
      ) {
        const k = (z + 512) * 1024 + (x + 512);
        let list = cells.get(k);
        if (!list) cells.set(k, (list = []));
        list.push(c);
      }
  }
  s = { cells };
  solidIndex.set(l, s);
  return s;
}

/** Push a walker of radius `r` out of every solid it overlaps. True when moved. */
export function resolveRegion(l: RegionLayout, p: Vec2, r: number): boolean {
  const list = solidsOf(l).cells.get(
    (Math.floor(p.z / SOLID_CELL) + 512) * 1024 + (Math.floor(p.x / SOLID_CELL) + 512),
  );
  if (!list) return false;
  let moved = false;
  for (const c of list) {
    if (c.w !== undefined && c.h !== undefined) {
      const hx = c.w / 2 + r;
      const hz = c.h / 2 + r;
      const dx = p.x - c.x;
      const dz = p.z - c.z;
      if (Math.abs(dx) >= hx || Math.abs(dz) >= hz) continue;
      // Out along the shallower side.
      if (hx - Math.abs(dx) < hz - Math.abs(dz)) p.x = c.x + Math.sign(dx || 1) * hx;
      else p.z = c.z + Math.sign(dz || 1) * hz;
      moved = true;
    } else {
      const dx = p.x - c.x;
      const dz = p.z - c.z;
      const d = Math.hypot(dx, dz);
      const min = c.r + r;
      if (d >= min) continue;
      const nx = d > 1e-6 ? dx / d : 1;
      const nz = d > 1e-6 ? dz / d : 0;
      p.x = c.x + nx * min;
      p.z = c.z + nz * min;
      moved = true;
    }
  }
  return moved;
}

/** Whether a walker of radius `r` at p stands on walkable ground (its centre and four sides). */
export function standsIn(l: RegionLayout, x: number, z: number, r: number): boolean {
  const ok = (px: number, pz: number) => {
    const c = cellAt(l, px, pz);
    return c >= 0 && l.grid[c] === 1;
  };
  return ok(x, z) && ok(x + r, z) && ok(x - r, z) && ok(x, z + r) && ok(x, z - r);
}

// ---------------------------------------------------------------- walking

interface Plan {
  target: Vec2;
  legs: Vec2[];
  atMs: number;
  /** The closest the Keeper has come to the walk's end, and when it last got closer. */
  best: number;
  bestMs: number;
}
const plans = new WeakMap<World, Plan>();

function cellCentre(l: RegionLayout, i: number): Vec2 {
  const ix = i % l.gw;
  const iz = Math.floor(i / l.gw);
  return {
    x: -l.spec.size.w / 2 + (ix + 0.5) * l.cell,
    z: -l.spec.size.h / 2 + (iz + 0.5) * l.cell,
  };
}

/** The legs of a tap walk from `from` to `to`, string-pulled; empty when out of reach. */
export function planRegionWalk(l: RegionLayout, from: Vec2, to: Vec2): Vec2[] {
  const s = cellAt(l, from.x, from.z);
  let g = cellAt(l, to.x, to.z);
  if (s < 0 || g < 0) return [];
  const walk = (ix: number, iz: number) => l.grid[iz * l.gw + ix] === 1;
  // A tap in the trees walks to the nearest open ground instead (within a few cells).
  let end: Vec2 = to;
  if (l.grid[g] !== 1) {
    g = nearestOpen(l, g);
    if (g < 0) return [];
    end = cellCentre(l, g);
  }
  const path = astar(
    l.gw,
    l.gh,
    walk,
    s % l.gw,
    Math.floor(s / l.gw),
    g % l.gw,
    Math.floor(g / l.gw),
    {
      maxExpansions: REGION_WALK.maxExpansions,
    },
  );
  if (!path) return [];
  const pulled = stringPull(path, l.gw, (ax, az, bx, bz) => gridLineOfSight(walk, ax, az, bx, bz));
  const legs = pulled.slice(1, -1).map((i) => cellCentre(l, i));
  legs.push({ x: end.x, z: end.z });
  return legs;
}

/** The nearest walkable cell to cell `i`, searching square rings out to 4 cells; -1 if none. */
function nearestOpen(l: RegionLayout, i: number): number {
  const ix = i % l.gw;
  const iz = Math.floor(i / l.gw);
  for (let r = 1; r <= 4; r++) {
    let best = -1;
    let bestD = Infinity;
    for (let dz = -r; dz <= r; dz++)
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
        const x = ix + dx;
        const z = iz + dz;
        if (x < 0 || z < 0 || x >= l.gw || z >= l.gh || l.grid[z * l.gw + x] !== 1) continue;
        const d = dx * dx + dz * dz;
        if (d < bestD) {
          bestD = d;
          best = z * l.gw + x;
        }
      }
    if (best >= 0) return best;
  }
  return -1;
}

/**
 * One substep of the Keeper in a drawn region. Called from the Keeper's substep in place of
 * the Grove's walk. R12 lane D: the Keeper jumps here too, onto stones and ledges and over
 * the air lanes of built jump routes, and rides a region's flying zones (`region-moves.ts`).
 */
export function stepRegionWalk(world: World, dtMs: number, events: SimEvent[] = []): void {
  const id = drawnRegion(world);
  const l = id ? layoutOf(id) : null;
  if (!l || !id) return;
  if (regionFlightStep(world, l, id, dtMs)) return;
  const k = world.keeper;
  const walk = (x: number, z: number) => standsIn(l, x, z, r);
  const pass = (x: number, z: number) => regionPassable(world, l, id, x, z, walk);
  const dt = dtMs / 1000;
  const r = REGION_WALK.radius;
  let dx = 0;
  let dz = 0;
  let speed = 0;
  if (k.input.x !== 0 || k.input.z !== 0) {
    const len = Math.hypot(k.input.x, k.input.z);
    dx = k.input.x / len;
    dz = k.input.z / len;
    speed =
      KEEPER.speed *
      Math.min(1, len) *
      keeperSpeedMultiplier(world, k.running, KEEPER.runMultiplier);
    plans.delete(world);
  } else if (k.moveTarget) {
    let plan = plans.get(world);
    if (
      !plan ||
      plan.target !== k.moveTarget ||
      world.timeMs - plan.atMs > REGION_WALK.replanMs * 10
    ) {
      plan = {
        target: k.moveTarget,
        legs: planRegionWalk(l, k.pos, k.moveTarget),
        atMs: world.timeMs,
        best: Infinity,
        bestMs: world.timeMs,
      };
      plans.set(world, plan);
    }
    while (
      plan.legs.length > 1 &&
      Math.hypot(plan.legs[0]!.x - k.pos.x, plan.legs[0]!.z - k.pos.z) < 0.4
    )
      plan.legs.shift();
    const next = plan.legs[0];
    const d = next ? Math.hypot(next.x - k.pos.x, next.z - k.pos.z) : 0;
    // R11 d7: progress is the walk still to go along the legs, not the straight line to the
    // end (a switchback heads away from its end for a while without being stuck).
    let left = d;
    for (let i = 1; i < plan.legs.length; i++)
      left += Math.hypot(
        plan.legs[i]!.x - plan.legs[i - 1]!.x,
        plan.legs[i]!.z - plan.legs[i - 1]!.z,
      );
    if (left < plan.best - 0.05) {
      plan.best = left;
      plan.bestMs = world.timeMs;
    }
    // Pressed against a trunk with the end just beyond it: it has got as near as it can.
    const stalled = world.timeMs - plan.bestMs > REGION_WALK.stallMs;
    if (!next || stalled || (plan.legs.length === 1 && d <= REGION_WALK.arrive)) {
      k.moveTarget = null;
      k.intent = null;
      plans.delete(world);
    } else {
      dx = (next.x - k.pos.x) / d;
      dz = (next.z - k.pos.z) / d;
      speed = Math.min(
        d / Math.max(dt, 1e-6),
        KEEPER.speed * keeperSpeedMultiplier(world, k.running, KEEPER.runMultiplier),
      );
    }
  }
  const fx = k.pos.x;
  const fz = k.pos.z;
  if (speed > 0) {
    const step = speed * dt;
    const nx = k.pos.x + dx * step;
    const nz = k.pos.z + dz * step;
    // Slide along the edge of open ground: the whole step, else either axis alone.
    if (pass(nx, nz)) {
      k.pos.x = nx;
      k.pos.z = nz;
    } else if (pass(nx, k.pos.z)) k.pos.x = nx;
    else if (pass(k.pos.x, nz)) k.pos.z = nz;
    k.facing = Math.atan2(dx, dz);
  }
  const bx = k.pos.x;
  const bz = k.pos.z;
  resolveRegion(l, k.pos, r);
  // Never pushed out of a solid into the trees.
  if (
    !standsIn(l, k.pos.x, k.pos.z, r * 0.5) &&
    ledgeAt(id, k.pos.x, k.pos.z) === null &&
    !inAirLane(id, k.pos.x, k.pos.z)
  ) {
    k.pos.x = bx;
    k.pos.z = bz;
  }
  const hw = l.spec.size.w / 2 - r;
  const hh = l.spec.size.h / 2 - r;
  k.pos.x = Math.max(-hw, Math.min(hw, k.pos.x));
  k.pos.z = Math.max(-hh, Math.min(hh, k.pos.z));
  // R11 d7 (WORLD-36): a terraced region carries the Keeper up its ramps; R12: and jumps.
  stepRegionVertical(world, l, id, dt, events, walk);
  regionFlightTrigger(world, id, fx, fz);
}

// ---------------------------------------------------------------- borders

/** The region whose exits the Keeper's position is read against. */
function hereRegion(world: World): RegionId | null {
  if (world.location === 'grove') return 'grove';
  return drawnRegion(world);
}

function inRect(e: RegionExit, p: Vec2): boolean {
  return (
    p.x >= e.rect.x && p.x <= e.rect.x + e.rect.w && p.z >= e.rect.z && p.z <= e.rect.z + e.rect.h
  );
}

/** Whether an exit leads somewhere drawn that walking into it may take (not the lane or the Hollow). */
export function walkableExit(e: RegionExit): boolean {
  return e.to === 'grove' || !!REGION_SPECS[e.to];
}

/**
 * R11 d7: why a way out is shut now, or null: a campaign flag not yet set, the Sun or Moon
 * lands before the first adult of that alignment unlocks them (WORLD-34), or the ruins from
 * the Learning Grove (WORLD-37, `main` audience).
 */
export function exitLocked(world: World, e: RegionExit): 'locked' | null {
  if (e.unlock && !world.campaign?.flags[e.unlock]) return 'locked';
  if (e.to === 'sunlands' && !world.unlocks.sunGrove) return 'locked';
  if (e.to === 'moonlands' && !world.unlocks.moonGrove) return 'locked';
  if (e.to === 'ruins' && world.edu) return 'locked';
  // R0115: the ruins' door stays sealed under ice until chapter 9 is behind the Keeper.
  if (e.id === 'ruins-door' && ruinsState(world.campaign) === 'sealed') return 'locked';
  return null;
}

/** The exits of the current region that walking can take, for the renderers' approach checks. */
export function walkExitsHere(world: World): readonly RegionExit[] {
  const here = hereRegion(world);
  return here ? REGIONS[here].exits.filter(walkableExit) : [];
}

/**
 * WORLD-39/56: how a seamless crossing re-bases a point: the neighbour's coordinates are this
 * region's shifted by the exit's arrival less its centre, so the Keeper keeps its footing
 * and no coordinate grows past the region's own half size.
 */
export function seamlessOffset(e: RegionExit): Vec2 {
  return {
    x: e.arrive.x - (e.rect.x + e.rect.w / 2),
    z: e.arrive.z - (e.rect.z + e.rect.h / 2),
  };
}

const inside = new WeakMap<World, string | null>();

/**
 * After the Keeper's step (live play only): stepping into a walkable exit's box raises it once.
 * Leaving the box re-arms it, so arriving on a box never bounces the Keeper straight back.
 * A loaded exit raises `exitReached` (the game irises, then sends `travel`); a seamless one is
 * returned for the step to take now.
 */
export function crossExits(world: World, events: SimEvent[]): RegionExit | null {
  const here = hereRegion(world);
  if (!here) return null;
  const k = world.keeper;
  const hit = REGIONS[here].exits.find((e) => walkableExit(e) && inRect(e, k.pos)) ?? null;
  const was = inside.get(world);
  inside.set(world, hit ? hit.id : null);
  if (!hit || was === hit.id || was === undefined || world.ride) return null;
  // R11 d7: a shut way says why once (the HUD toasts it) and the Keeper stays put.
  if (exitLocked(world, hit)) {
    events.push({ kind: 'travelRefused', exit: hit.id, reason: 'locked' });
    return null;
  }
  // A seamless edge is crossed by the caller at once (`travel`, which re-bases the Keeper).
  if (hit.kind === 'seamless') return hit;
  events.push({ kind: 'exitReached', exit: hit.id });
  return null;
}

/** Forget the armed exit (a load, a travel): the next step only notes where the Keeper is. */
export function resetCrossing(world: World): void {
  inside.delete(world);
}

/** Keep a point inside the drawn region the Keeper is in; false (untouched) anywhere else. */
export function clampToRegion(world: World, p: Vec2): boolean {
  const id = drawnRegion(world);
  const spec = id ? REGION_SPECS[id] : undefined;
  if (!spec) return false;
  // Just inside: a point on the far edge would fall past the walk grid's last cell.
  const hw = spec.size.w / 2 - 0.01;
  const hh = spec.size.h / 2 - 0.01;
  p.x = Math.max(-hw, Math.min(hw, p.x));
  p.z = Math.max(-hh, Math.min(hh, p.z));
  return true;
}
