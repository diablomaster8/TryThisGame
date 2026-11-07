/**
 * R12 lane D (WORLD-25, WORLD-36): the Keeper's moves inside a drawn region, beyond walking.
 *
 * - **Jumping.** The same press, buffer, coyote time, air jump and short hop as the Grove's
 *   (`JUMP`, read through `keeper.ts`'s fields), on the region's own ground: its terraces and
 *   the raised boxes of its built jump routes.
 * - **Jump routes.** A route with `ledges` (`config/region-jumps.ts`) is built: its stones and
 *   ledges can be stood on, and along its line (the air lane) the Keeper may pass over water or
 *   a cliff while in the air. Coming down there on neither, the Keeper is set back where the
 *   jump began, the way a missed hop over the Grove's pond is.
 * - **Flying zones** (the ridge's updrafts and glide line home, `RIDGE_FLIGHTS`): with a Fly
 *   partner, stepping onto a zone's spot lifts the Keeper a terrace or glides it along the line,
 *   steering left and right, in place of the walking step.
 *
 * Called from `stepRegionWalk`; transient state only (a reload lands the Keeper on the ground).
 */
import { JUMP_ROUTES, type JumpLedge } from '../config/region-jumps';
import { terraceHeight, type RegionLayout } from '../config/region-layout';
import { RIDGE_FLIGHTS, type RegionFlightDef } from '../config/region-ridge';
import type { RegionId } from '../config/regions';
import { REGION_MOVES } from '../config/tuning-more/world-region-moves';
import { JUMP } from '../config/tuning-sim';
import { GLIDE } from '../config/tuning-move';
import { glided, keeperGliding } from './glide-state';
import { FLIGHT_ZONES } from '../config/tuning-more/world-camera-terrain';
import { levelOf } from './stats';
import type { SimEvent, Vec2, World } from './types';

/** A partner strong enough to fly the Keeper (the Grove's rule, `flight-zones.ts`). */
function flyPartner(world: World): boolean {
  for (const id of world.partners) {
    if (!id) continue;
    const n = world.nubbins.find((m) => m.id === id);
    if (n && n.stage !== 'egg' && levelOf(n.stats.fly.points) >= FLIGHT_ZONES.fly) return true;
  }
  return false;
}

/** The flying zones per region. */
export const REGION_FLIGHTS: Partial<Record<RegionId, readonly RegionFlightDef[]>> = {
  ridge: RIDGE_FLIGHTS,
};

interface Lane {
  from: Vec2;
  to: Vec2;
}

const lanesBy = new Map<RegionId, { lanes: Lane[]; ledges: JumpLedge[] }>();

function built(id: RegionId): { lanes: Lane[]; ledges: JumpLedge[] } {
  let b = lanesBy.get(id);
  if (!b) {
    b = { lanes: [], ledges: [] };
    for (const r of JUMP_ROUTES[id] ?? []) {
      if (!r.ledges) continue;
      b.lanes.push({ from: r.from, to: r.to });
      b.ledges.push(...r.ledges);
    }
    lanesBy.set(id, b);
  }
  return b;
}

/** The built ledges and stones of a region (the renderers draw them). */
export function regionLedges(id: RegionId): readonly JumpLedge[] {
  return built(id).ledges;
}

function segDist(x: number, z: number, a: Vec2, b: Vec2): number {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz || 1)));
  return Math.hypot(x - (a.x + dx * t), z - (a.z + dz * t));
}

/** The top of the ledge under (x, z), or null. */
export function ledgeAt(id: RegionId, x: number, z: number): number | null {
  const g = REGION_MOVES.ledgeGrace;
  let top: number | null = null;
  for (const l of built(id).ledges)
    if (Math.abs(x - l.x) <= l.w / 2 + g && Math.abs(z - l.z) <= l.h / 2 + g)
      top = top === null ? l.y : Math.max(top, l.y);
  return top;
}

/** Whether (x, z) lies in a built route's air lane. */
export function inAirLane(id: RegionId, x: number, z: number): boolean {
  for (const l of built(id).lanes)
    if (segDist(x, z, l.from, l.to) <= REGION_MOVES.laneHalf) return true;
  return false;
}

/** The ground under (x, z): a ledge's top where one stands, else the terrace. */
export function regionFloor(l: RegionLayout, id: RegionId, x: number, z: number): number {
  return ledgeAt(id, x, z) ?? terraceHeight(l.spec, z);
}

/**
 * Whether the Keeper may move to (x, z): onto walkable ground or a ledge it can step up to, or,
 * in the air, over an air lane it is high enough to clear.
 */
export function regionPassable(
  world: World,
  l: RegionLayout,
  id: RegionId,
  x: number,
  z: number,
  walkable: (x: number, z: number) => boolean,
): boolean {
  const k = world.keeper;
  const ledge = ledgeAt(id, x, z);
  const floor = ledge ?? terraceHeight(l.spec, z);
  if (floor > k.y + JUMP.stepUp) return false;
  if (ledge !== null || walkable(x, z)) return true;
  return !k.grounded && inAirLane(id, x, z);
}

/** Whether the Keeper's feet can rest at (x, z) (else a landing there is a miss). */
function standable(
  id: RegionId,
  x: number,
  z: number,
  walkable: (x: number, z: number) => boolean,
) {
  return ledgeAt(id, x, z) !== null || walkable(x, z);
}

/** Where the last jump left the ground: a missed landing goes back there. */
const takeOff = new WeakMap<World, Vec2 & { y: number }>();

/**
 * Gravity, jumping and landing for one substep in a drawn region, after the walking step.
 * A miss (coming down on water or a cliff face in an air lane) sets the Keeper back at its
 * take-off and raises `keeperLanded` with no fall, so the renderers' landing puff plays.
 */
export function stepRegionVertical(
  world: World,
  l: RegionLayout,
  id: RegionId,
  dt: number,
  events: SimEvent[],
  walkable: (x: number, z: number) => boolean,
): void {
  const k = world.keeper;
  const gentle = world.edu || world.settings.gentleJumps;
  const tune = gentle ? JUMP.kidFloat : JUMP;
  const ground = regionFloor(l, id, k.pos.x, k.pos.z);
  if (k.grounded) {
    if (ground < k.y - JUMP.stepUp) {
      // Off a ledge or a stone: fall, with a moment's grace to still jump.
      k.grounded = false;
      k.vy = 0;
      k.coyoteMs = tune.coyoteMs;
      k.airJumps = JUMP.airJumps;
      takeOff.set(world, { x: k.pos.x, z: k.pos.z, y: k.y });
    } else k.y = ground;
  }
  if (k.bufferMs > 0 && !k.carrying) {
    const fromGround = k.grounded || k.coyoteMs > 0;
    if (fromGround || k.airJumps > 0) {
      if (!fromGround) k.airJumps -= 1;
      else {
        k.airJumps = JUMP.airJumps;
        if (k.grounded) takeOff.set(world, { x: k.pos.x, z: k.pos.z, y: k.y });
      }
      const h = fromGround ? JUMP.height : JUMP.doubleHeight;
      k.vy = Math.sqrt(2 * tune.gravity * h) * (k.jumpHeld ? 1 : JUMP.shortHopScale);
      k.grounded = false;
      k.coyoteMs = 0;
      k.bufferMs = 0;
      events.push({ kind: 'keeperJumped', air: !fromGround });
    }
  }
  k.bufferMs = Math.max(0, k.bufferMs - dt * 1000);
  k.coyoteMs = Math.max(0, k.coyoteMs - dt * 1000);
  if (k.grounded) {
    k.vy = 0;
    return;
  }
  const g = tune.gravity * (k.vy < 0 ? JUMP.fallGravityScale : 1);
  k.vy = Math.max(-JUMP.maxFall, k.vy - g * dt);
  // R0113 (R13 d1): the Fly perk's glide works in a region as in the Grove (MOVE-27).
  if (k.vy < 0 && keeperGliding(world)) {
    k.vy = Math.max(k.vy, -GLIDE.maxFall);
    glided.set(world, (glided.get(world) ?? 0) + dt * 1000);
  }
  k.y += k.vy * dt;
  if (k.y > ground) return;
  k.y = ground;
  k.vy = 0;
  k.grounded = true;
  k.airJumps = JUMP.airJumps;
  glided.delete(world);
  if (!standable(id, k.pos.x, k.pos.z, walkable)) {
    const back = takeOff.get(world);
    if (back) {
      k.pos.x = back.x;
      k.pos.z = back.z;
      k.y = back.y;
    }
    k.moveTarget = null;
    events.push({ kind: 'keeperLanded', fall: 0 });
    return;
  }
  events.push({ kind: 'keeperLanded', fall: 0 });
}

// ---------------------------------------------------------------- flying zones

interface Flight {
  def: RegionFlightDef;
  /** The whole line, from the take-off spot. */
  pts: Vec2[];
  len: number;
  ms: number;
  total: number;
  side: number;
  y0: number;
}

const flights = new WeakMap<World, Flight>();

/** The region flight under way: its kind and how far along it is (0..1), or null. */
export function regionFlight(world: World): { kind: 'updraft' | 'glide'; t: number } | null {
  const f = flights.get(world);
  return f ? { kind: f.def.kind, t: Math.min(1, f.ms / f.total) } : null;
}

function lineLength(pts: readonly Vec2[]): number {
  let n = 0;
  for (let i = 1; i < pts.length; i++)
    n += Math.hypot(pts[i]!.x - pts[i - 1]!.x, pts[i]!.z - pts[i - 1]!.z);
  return n;
}

/** The point `d` units along a line, and the line's heading there. */
function along(pts: readonly Vec2[], d: number): { p: Vec2; dir: Vec2 } {
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    const s = Math.hypot(b.x - a.x, b.z - a.z) || 1;
    if (d <= s || i === pts.length - 1) {
      const t = Math.min(1, d / s);
      return {
        p: { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t },
        dir: { x: (b.x - a.x) / s, z: (b.z - a.z) / s },
      };
    }
    d -= s;
  }
  const last = pts[pts.length - 1]!;
  return { p: { ...last }, dir: { x: 0, z: 1 } };
}

/**
 * After the walking step from (fx, fz): a grounded step onto a zone's spot, heading its way,
 * with a Fly partner along, starts its flight.
 */
export function regionFlightTrigger(world: World, id: RegionId, fx: number, fz: number): void {
  const k = world.keeper;
  if (flights.has(world) || k.carrying || !k.grounded) return;
  for (const def of REGION_FLIGHTS[id] ?? []) {
    if (Math.hypot(k.pos.x - def.at.x, k.pos.z - def.at.z) > REGION_MOVES.reach) continue;
    const first = def.path[0]!;
    if ((k.pos.x - fx) * (first.x - def.at.x) + (k.pos.z - fz) * (first.z - def.at.z) <= 0)
      continue;
    if (!flyPartner(world)) return;
    const pts = [{ ...def.at }, ...def.path.map((p) => ({ ...p }))];
    const len = lineLength(pts);
    flights.set(world, {
      def,
      pts,
      len,
      ms: 0,
      total: def.kind === 'updraft' ? REGION_MOVES.liftMs : (len / REGION_MOVES.glideSpeed) * 1000,
      side: 0,
      y0: k.y,
    });
    k.pos = { ...def.at };
    k.moveTarget = null;
    return;
  }
}

/**
 * One step of a region flight under way, in place of the Keeper's walking step: true while
 * it runs (and on its last step). A glide reads the stick's sideways part to steer.
 */
export function regionFlightStep(
  world: World,
  l: RegionLayout,
  id: RegionId,
  dtMs: number,
): boolean {
  const f = flights.get(world);
  if (!f) return false;
  const k = world.keeper;
  f.ms = Math.min(f.total, f.ms + dtMs);
  const t = f.ms / f.total;
  const glide = f.def.kind === 'glide';
  const end = f.pts[f.pts.length - 1]!;
  if (glide) {
    const { p, dir } = along(f.pts, f.len * t);
    if (!world.edu) {
      const across = -k.input.x * dir.z + k.input.z * dir.x;
      f.side = Math.max(-2, Math.min(2, f.side + across * 1.5 * (dtMs / 1000)));
    }
    // The steer eases out over the last stretch, so the line sets down where it was laid.
    const side = f.side * Math.min(1, (1 - t) / 0.15);
    k.pos.x = p.x - dir.z * side;
    k.pos.z = p.z + dir.x * side;
    k.facing = Math.atan2(dir.x, dir.z);
  } else {
    // A lift rises over the first 60 % and steps in over the cliff in the rest.
    const s = Math.max(0, (t - 0.6) / 0.4);
    k.pos.x = f.pts[0]!.x + (end.x - f.pts[0]!.x) * s;
    k.pos.z = f.pts[0]!.z + (end.z - f.pts[0]!.z) * s;
  }
  const ground = regionFloor(l, id, k.pos.x, k.pos.z);
  const y1 = regionFloor(l, id, end.x, end.z);
  const y = glide
    ? Math.max(ground + REGION_MOVES.glideClear * (1 - t), f.y0 + (y1 - f.y0) * t)
    : f.y0 + (y1 - f.y0 + 0.3) * Math.sin(Math.min(1, t / 0.6) * Math.PI * 0.5);
  k.vy = 0;
  if (t >= 1) {
    flights.delete(world);
    k.y = ground;
    k.grounded = true;
    return true;
  }
  k.y = Math.max(ground, y);
  k.grounded = false;
  return true;
}
