import { blocked, contact, lipAt, obstacles, resolve, softAt, standTopAt } from './obstacles';
import { footing, hillHeight, ledgeY, TERRACES, type Footing } from './terrain';
import { dungeonBlocked, resolveDungeon, runFloor } from './dungeon';
import { keeperWaypoint } from './dungeon-nav';
import { springBounce, springShroomAt } from './decorate';
import { autoHopOn, groveLeg, hopReaches } from './nav';
import {
  AUTO_HOP,
  GLIDE,
  JUMP_PLAY,
  JUMP_TOYS,
  KEEPER_SLOPE,
  BUSH,
  MANTLE,
  CARE_APPROACH,
  ROLL,
  POND_DIP,
  RUN_MODE,
  UNREACHABLE,
} from '../config/tuning-move';
import { GATHER, GROVE, KEEPER, NEEDS, PERKS, SIM, TREES, TRUST } from '../config/tuning';
import { MOODY } from '../config/tuning-soul-r8';
import {
  JUMP,
  KEEPER_ACCEL,
  KEEPER_MOTION,
  KEEPER_SOFT,
  KEEPER_UNSTICK,
  KEEPER_WADE,
} from '../config/tuning-sim';
import { keeperPerks, keeperSpeedMultiplier } from './perks';
import { shakeFruitBonus } from './dungeon-gear-effects';
import { swimHint, waterPace } from './swim-tow';
import { surfacePace } from './surface-pace';
import { dropFruit, withRng } from './world';
import { nudgeAlignment } from './alignment';
import { eat, pet, putDown, react } from './behavior';
import { shyHopBack } from './nubbin-hop';
import { addAffection, addHappiness, applyPet } from './needs';
import { isFree } from './nubbin';
import { giveHeartFruit } from './breeding';
import { noteCare, noteTouch } from './personality';
import { addTrust, isWary, settleStray } from './trust';
import { noteCampaign } from './campaign';
import type { Interaction, Keeper, KeeperIntent, Nubbin, SimEvent, Vec2, World } from './types';

const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);

export function createKeeper(pos: Vec2): Keeper {
  return {
    pos: { x: pos.x, z: pos.z },
    facing: 0,
    alignment: 'sun',
    moveTarget: null,
    input: { x: 0, z: 0 },
    carrying: null,
    intent: null,
    running: false,
    y: footing(pos.x, pos.z).y,
    vy: 0,
    grounded: true,
    airJumps: 0,
    coyoteMs: 0,
    bufferMs: 0,
    jumpHeld: false,
  };
}

function clampToWorld(p: Vec2): void {
  const h = SIM.worldHalf;
  p.x = Math.max(-h, Math.min(h, p.x));
  p.z = Math.max(-h, Math.min(h, p.z));
}

/** Keep the Keeper on dry land: points inside the pond move to its edge. */
export function shoreline(p: Vec2): Vec2 {
  const pond = GROVE.pond;
  const dx = p.x - pond.x;
  const dz = p.z - pond.z;
  const d = Math.hypot(dx, dz);
  const edge = pond.r + 0.5;
  if (d >= edge) return p;
  if (d < 1e-6) return { x: pond.x + edge, z: pond.z };
  return { x: pond.x + (dx / d) * edge, z: pond.z + (dz / d) * edge };
}

/** Whether a point is somewhere the Keeper may stand in the Grove: clear of every solid thing and out of the pond unless wading. */
function standable(p: Vec2, world: World, wade: boolean, feetY?: number): boolean {
  if (blocked(p, world, KEEPER_UNSTICK.clearance - 0.05, 'keeper', feetY)) return false;
  if (wade) return true;
  const pond = GROVE.pond;
  // A hair inside the shoreline ring counts as ashore: shoreline() puts the Keeper exactly on it.
  return Math.hypot(p.x - pond.x, p.z - pond.z) >= pond.r + 0.5 - 0.05;
}

/**
 * The nearest point the Keeper may stand on, searching outward in rings. A Keeper left
 * inside a blocker or the pond (a teleport, a lost Swim perk, an old save, the crack where
 * the well's footing meets the shoreline) would otherwise be pushed back and forth for good.
 */
export function freeSpot(
  world: World,
  p: Vec2,
  wade = keeperPerks(world).wade,
  feetY?: number,
): Vec2 {
  if (standable(p, world, wade, feetY)) return p;
  const h = SIM.worldHalf;
  for (
    let r = KEEPER_UNSTICK.searchStep;
    r <= KEEPER_UNSTICK.searchMax;
    r += KEEPER_UNSTICK.searchStep
  ) {
    const steps = Math.max(12, Math.ceil(r * 8));
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const q = { x: p.x + Math.cos(a) * r, z: p.z + Math.sin(a) * r };
      if (Math.abs(q.x) > h || Math.abs(q.z) > h) continue;
      if (standable(q, world, wade)) return q;
    }
  }
  return { x: GROVE.keeperStart.x, z: GROVE.keeperStart.z };
}

/** Free a Keeper standing inside a blocker or the pond; true if it moved. */
export function unstickKeeper(world: World): boolean {
  if (runFloor(world)) return false;
  const k = world.keeper;
  const to = freeSpot(world, k.pos, keeperPerks(world).wade, k.y);
  if (to === k.pos) return false;
  k.pos = { x: to.x, z: to.z };
  return true;
}

/** Progress of the current care walk, per world; transient, so it is not saved. */
const careWalk = new WeakMap<World, { intent: KeeperIntent; at: Vec2; sinceMs: number }>();

/**
 * A care walk where the Keeper stops moving (wedged where steering cannot get round)
 * gives up and says so, instead of leaving the Keeper pressing against a wall in silence.
 */
function careWalkStalled(world: World): boolean {
  const k = world.keeper;
  const intent = k.intent;
  if (!intent) {
    careWalk.delete(world);
    return false;
  }
  const w = careWalk.get(world);
  if (!w || w.intent !== intent || dist(w.at, k.pos) > KEEPER_UNSTICK.minProgress) {
    careWalk.set(world, { intent, at: { x: k.pos.x, z: k.pos.z }, sinceMs: world.timeMs });
    return false;
  }
  return world.timeMs - w.sinceMs >= KEEPER_UNSTICK.giveUpMs;
}

/**
 * Walk around a solid thing instead of into it: when the straight step would end inside a
 * hill, tree or building, follow that obstacle's edge on the side nearer the target.
 */
function steer(
  world: World,
  p: Vec2,
  to: Vec2,
  dx: number,
  dz: number,
  hop = false,
): [number, number] {
  const look = KEEPER_UNSTICK.clearance + 0.1;
  const ax = p.x + dx * look;
  const az = p.z + dz * look;
  for (const c of obstacles(world)) {
    if (c.flags.includes('soft') || c.flags.includes('nubbinOnly')) continue;
    // With Auto-hop a log, fence or bench is jumped, not walked round (MOVE-24).
    if (hop && (c.flags.includes('hop') || c.flags.includes('standable'))) continue;
    // A target inside the obstacle itself is walked into and dropped, as before.
    if (contact(c, to.x, to.z, KEEPER_UNSTICK.clearance)) continue;
    const hit = contact(c, ax, az, KEEPER_UNSTICK.clearance);
    if (!hit) continue;
    // The two tangents of the surface; keep the one that still heads toward the target.
    const tx = -hit.nz;
    const tz = hit.nx;
    return tx * dx + tz * dz >= 0 ? [tx, tz] : [-tx, -tz];
  }
  return [dx, dz];
}

/** The id of what a care walk heads for: a Nubbin, a tree or an item. */
function intentTargetId(intent: KeeperIntent): string {
  if (intent.kind === 'shakeTree') return intent.treeId;
  if (intent.kind === 'collect') return intent.itemId;
  return intent.nubbinId;
}

function findNubbin(world: World, id: string): Nubbin | undefined {
  return world.nubbins.find((n) => n.id === id);
}

function intentTarget(world: World, intent: KeeperIntent): Vec2 | null {
  switch (intent.kind) {
    case 'pet':
    case 'pickUp':
    case 'feed':
    case 'interact':
    case 'heartFruit':
      return findNubbin(world, intent.nubbinId)?.pos ?? null;
    case 'shakeTree':
      return world.trees.find((t) => t.id === intent.treeId)?.pos ?? null;
    case 'collect':
      return world.items.find((i) => i.id === intent.itemId)?.pos ?? null;
  }
}

/** MOVE-59: care walks whose spot in view proved out of reach (they walk to the Nubbin). */
const noApproach = new WeakSet<KeeperIntent>();

/**
 * MOVE-59: where a care walk to a Nubbin stops, so the Nubbin stays in view: just inside
 * reach, on the far side of it from the camera (the Nubbin is drawn in front of the Keeper)
 * and turned `side` off straight behind, whichever side is nearer the Keeper. Null when the
 * view's yaw is not known, the target is not a Nubbin, or the spot is in water or a solid
 * (the walk then goes to the Nubbin as before).
 */
function careApproach(world: World, intent: KeeperIntent, n: Vec2): Vec2 | null {
  if (intent.kind === 'shakeTree' || intent.kind === 'collect') return null;
  const yaw = world.viewYaw;
  if (yaw === undefined || noApproach.has(intent)) return null;
  const k = world.keeper;
  const r = KEEPER.interactRadius - CARE_APPROACH.inset;
  const side = (CARE_APPROACH.sideDeg * Math.PI) / 180;
  // The camera sits toward (sin yaw, cos yaw) from what it looks at; behind is the other way.
  let best: Vec2 | null = null;
  let bestD = Infinity;
  for (const s of [-side, side]) {
    const a = yaw + Math.PI + s;
    const p = { x: n.x + Math.sin(a) * r, z: n.z + Math.cos(a) * r };
    if (blocked(p, world, 0.3, 'keeper', k.y) || keeperFooting(world, p.x, p.z).on === 'water')
      continue;
    const d = dist(p, k.pos);
    if (d < bestD) [best, bestD] = [p, d];
  }
  return best;
}

/** One fine Keeper step, in ms (MOVE-15). */
const SUB_MS = 1000 / KEEPER_MOTION.hz;
/** Fine steps game.ts has already run inside the coming sim step, per world; not saved. */
const ahead = new WeakMap<World, number>();

/**
 * Move the Keeper through one sim step, in fine substeps (MOVE-15): a jump's rise is about
 * 16 of them, so coyote time, the buffer and a landing on a bench are all caught. Substeps
 * game.ts already ran between sim steps (`stepKeeperMotion`) are not run again.
 */
export function updateKeeper(world: World, dtMs: number, events: SimEvent[]): void {
  const n = Math.max(1, Math.round(dtMs / SUB_MS));
  const done = Math.min(ahead.get(world) ?? 0, n);
  ahead.delete(world);
  if (done >= n) return;
  // A Keeper standing still with nothing to do takes the rest of the step at once, as
  // before substeps: the full-life runs step it a million times.
  const k = world.keeper;
  const idle =
    !k.moveTarget &&
    !k.intent &&
    k.input.x === 0 &&
    k.input.z === 0 &&
    k.grounded &&
    k.bufferMs <= 0 &&
    !rolls.has(world) &&
    !moving(world);
  if (idle) {
    keeperSubstep(world, ((n - done) * dtMs) / n, events);
    return;
  }
  for (let i = done; i < n; i++) keeperSubstep(world, dtMs / n, events);
}

/**
 * One fine Keeper step between sim steps, from game.ts's own accumulator in live play, so a
 * key press or a jump shows within a frame instead of at the next 10 Hz step. It never runs
 * more than one sim step ahead; false when it is that far ahead already.
 */
export function stepKeeperMotion(world: World, events: SimEvent[]): boolean {
  const a = ahead.get(world) ?? 0;
  if (a >= Math.round(SIM.stepMs / SUB_MS)) return false;
  ahead.set(world, a + 1);
  keeperSubstep(world, SUB_MS, events);
  return true;
}

/** Where the Keeper's feet would rest at (x, z), coming from feet at `fromY`. */
export function keeperFooting(world: World, x: number, z: number, fromY = Infinity): Footing {
  return footing(x, z, fromY, (px, pz) => standTopAt(world, px, pz));
}

/** The jump numbers in play: the floatier set in a Learning Grove or with Gentle jumps on. */
function jumpTuning(world: World): { gravity: number; coyoteMs: number; bufferMs: number } {
  return world.edu || world.settings.gentleJumps ? JUMP.kidFloat : JUMP;
}

/**
 * The jump button pressed or let go (MOVE-10). A press is held for `bufferMs`, and the next
 * substep jumps if it can: from the ground, inside coyote time, or as an air jump. Letting
 * go on the way up cuts the rise short. A Keeper carrying a Nubbin does not jump.
 */
export function keeperJump(world: World, down: boolean): void {
  const k = world.keeper;
  if (!down) {
    k.jumpHeld = false;
    if (!k.grounded && k.vy > 0) k.vy *= JUMP.shortHopScale;
    return;
  }
  if (k.carrying) return;
  k.jumpHeld = true;
  k.bufferMs = jumpTuning(world).bufferMs;
}

/**
 * MOVE-24: a tap walk with Auto-hop on jumps by itself. Ahead of the body by the run-up, a
 * rise of more than a step (a terrace face) or a hop piece the feet would not clear (a log,
 * a fence) starts a jump; at the top of it, ground still above the feet asks for the double
 * jump (two tiers). The planned path only goes this way when Auto-hop opened it (nav.ts).
 */
function autoHop(world: World, dx: number, dz: number): void {
  const k = world.keeper;
  if (k.carrying || k.bufferMs > 0) return;
  const reach = AUTO_HOP.body + AUTO_HOP.runUp;
  const ahead = { x: k.pos.x + dx * reach, z: k.pos.z + dz * reach };
  const rise = keeperFooting(world, ahead.x, ahead.z, k.y + AUTO_HOP.doubleRise).y - k.y;
  if (k.grounded) {
    const piece =
      blocked(ahead, world, 0.1, 'keeper', k.y) &&
      !blocked(ahead, world, 0.1, 'keeper', k.y + AUTO_HOP.hopRise - JUMP.stepUp);
    if (rise > JUMP.stepUp || piece) autoPress(world);
  } else if (k.vy <= 0 && k.airJumps > 0 && rise > 0) autoPress(world);
}

/**
 * MOVE-35: stand-in targets for shut-in taps, each with the tap it stands in for. A nav cell
 * is open a little closer to a wall than the Keeper's body fits, so these count as reached
 * from a little further off.
 */
const standIns = new WeakMap<Vec2, Vec2>();
/** When a stand-in walk last asked whether its real tap had come within reach (sim ms). */
const tapRecheck = new WeakMap<World, number>();
/** How often (ms) a stand-in walk looks again at its real tap. */
const RECHECK_MS = 1000;

/** Worlds whose pending jump came from Auto-hop: it jumps full height but is not "held". */
const autoPressed = new WeakSet<World>();

function autoPress(world: World): void {
  keeperJump(world, true);
  autoPressed.add(world);
}

/** How long the Keeper has glided this time in the air (MOVE-27), transient. */
const glided = new WeakMap<World, number>();

/**
 * MOVE-27: whether the Keeper is gliding now: in the air, falling, jump held, with the
 * Fly perk, and within the glide's time. The renderers read it for the wing overlay.
 */
export function keeperGliding(world: World): boolean {
  const k = world.keeper;
  return (
    !k.grounded &&
    k.vy <= 0 &&
    k.jumpHeld &&
    (glided.get(world) ?? 0) < GLIDE.maxMs &&
    keeperPerks(world).glide
  );
}

/** MOVE-64: a roll under way (its heading and time), and when the last one ended. */
const rolls = new WeakMap<World, { dx: number; dz: number; ms: number }>();
const rolledAt = new WeakMap<World, number>();
/** Per Nubbin, when it last giggled at a roll (sim ms). */
const giggledAt = new WeakMap<Nubbin, number>();

/** MOVE-64: how far through a roll the Keeper is (0..1), or null when not rolling. */
export function keeperRoll(world: World): number | null {
  const r = rolls.get(world);
  return r ? Math.min(1, r.ms / ROLL.ms) : null;
}

/**
 * MOVE-64: start a roll the way the Keeper faces (or along `dir`): on the ground, empty-
 * handed, not mid-mantle, and past the cooldown. Nearby Nubbins giggle. Never underground:
 * the Hollow's walker has no roll step, so a roll there would eat the jump at a chasm lip.
 */
export function keeperStartRoll(world: World, events: SimEvent[], dir?: Vec2): boolean {
  const k = world.keeper;
  if (runFloor(world)) return false;
  if (!k.grounded || k.carrying || mantles.has(world) || rolls.has(world)) return false;
  if (world.timeMs - (rolledAt.get(world) ?? -Infinity) < ROLL.cooldownMs) return false;
  let dx = dir ? dir.x : Math.sin(k.facing);
  let dz = dir ? dir.z : Math.cos(k.facing);
  const len = Math.hypot(dx, dz);
  if (len < 1e-6) return false;
  dx /= len;
  dz /= len;
  k.facing = Math.atan2(dx, dz);
  k.moveTarget = null;
  k.intent = null;
  rolls.set(world, { dx, dz, ms: 0 });
  events.push({ kind: 'keeperRolled' });
  if (world.location !== 'grove') return true;
  for (const n of world.nubbins) {
    if (n.stage === 'egg' || n.stage === 'cocoon' || !isFree(n)) continue;
    if (Math.hypot(n.pos.x - k.pos.x, n.pos.z - k.pos.z) > ROLL.giggleReach) continue;
    if (world.timeMs - (giggledAt.get(n) ?? -Infinity) < ROLL.giggleCooldownMs) continue;
    giggledAt.set(n, world.timeMs);
    react(n, 'happy', world.timeMs, events);
  }
  return true;
}

/**
 * One substep of a roll: along its heading at roll speed, through the same solids and
 * ledges as a walk. False once it has ended (its time is up, it ran off an edge, or a jump
 * cancels it): the substep then goes on as usual, so the jump happens at once.
 */
function stepRoll(world: World, dtMs: number, events: SimEvent[]): boolean {
  const r = rolls.get(world)!;
  const k = world.keeper;
  const speed = ROLL.dist / (ROLL.ms / 1000);
  if (k.bufferMs > 0 || !k.grounded || r.ms >= ROLL.ms) {
    rolls.delete(world);
    rolledAt.set(world, world.timeMs);
    // A cancelled roll keeps some of its speed into the jump.
    const v = velOf(world);
    const carry = r.ms < ROLL.ms ? ROLL.carry : 0;
    v.x = r.dx * speed * carry;
    v.z = r.dz * speed * carry;
    return false;
  }
  const dt = dtMs / 1000;
  r.ms += dtMs;
  const fromX = k.pos.x;
  const fromZ = k.pos.z;
  k.pos.x += r.dx * speed * dt;
  k.pos.z += r.dz * speed * dt;
  const floor = runFloor(world);
  if (floor) resolveDungeon(k.pos, floor, 0.35);
  else {
    resolve(k.pos, world, 0.35, 'keeper', k.y);
    holdAtLedges(k, fromX, fromZ);
    if (!keeperPerks(world).wade) {
      const s = shoreline(k.pos);
      k.pos.x = s.x;
      k.pos.z = s.z;
    }
    clampToWorld(k.pos);
    unstickKeeper(world);
  }
  stepVertical(world, dt, !!floor, events);
  return true;
}

/** A climb onto a lip the jump fell short of (MOVE-50): transient, never saved. */
interface Mantle {
  from: number;
  to: number;
  ms: number;
  /** Where the feet start and end across the lip (a piece's edge is stepped over). */
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}
const mantles = new WeakMap<World, Mantle>();

/** MOVE-50: how far through a mantle the Keeper is (0..1), or null when not mantling. */
export function keeperMantle(world: World): number | null {
  const m = mantles.get(world);
  return m ? Math.min(1, m.ms / MANTLE.ms) : null;
}

/** MOVE-65: a dip under the pond under way (its time), transient. */
const dips = new WeakMap<World, { ms: number }>();

/** MOVE-65: how far through a pond dip the Keeper is (0..1), or null. Drawn only. */
export function keeperDip(world: World): number | null {
  const d = dips.get(world);
  return d ? Math.min(1, d.ms / POND_DIP.ms) : null;
}

/**
 * MOVE-65: a jump into the pond with the Swim perk and the button let go dips under. The
 * dip is only drawn (the feet stay on the bed); the pond's sector it is in may give its
 * one-time shell.
 */
function startDip(world: World, events: SimEvent[]): void {
  const k = world.keeper;
  const p = GROVE.pond;
  const a = Math.atan2(k.pos.x - p.x, k.pos.z - p.z);
  const sector = Math.floor(((a + Math.PI) / (2 * Math.PI)) * POND_DIP.spots) % POND_DIP.spots;
  const spot = `pond-${sector}`;
  dips.set(world, { ms: 0 });
  const found = (world.pondFinds ??= []);
  let shells = 0;
  if (!found.includes(spot) && withRng(world, (r) => r.chance(POND_DIP.findChance))) {
    found.push(spot);
    shells = POND_DIP.findShells;
    world.inventory.shells += shells;
  }
  events.push({ kind: 'keeperDipped', shells });
}

/** Land at the end of a fall or a mantle: on the ground, air jumps and glide reset. */
function land(world: World, fall: number, events: SimEvent[]): void {
  const k = world.keeper;
  k.vy = 0;
  k.grounded = true;
  k.airJumps = JUMP.airJumps;
  glided.delete(world);
  events.push({ kind: 'keeperLanded', fall });
  // MOVE-65: into the pond with the Swim perk and the button let go: a dip.
  if (
    fall >= POND_DIP.minFall &&
    !k.jumpHeld &&
    world.location === 'grove' &&
    Math.hypot(k.pos.x - GROVE.pond.x, k.pos.z - GROVE.pond.z) < GROVE.pond.r &&
    keeperFooting(world, k.pos.x, k.pos.z, k.y).on === 'water' &&
    keeperPerks(world).wade
  )
    startDip(world, events);
  if (world.location === 'grove') shyHopBack(world, k.pos, events);
}

/**
 * MOVE-50: in the air, a body pressed against a standable piece (a bench, a rock, a hay
 * bale) whose top the jump's own arc will not lift the feet onto, but which is within a
 * step of them, is mantled onto. Houses and walls are never standable, so never mantled.
 */
function grabLip(world: World): boolean {
  const k = world.keeper;
  if (k.carrying || (k.input.x === 0 && k.input.z === 0 && !k.moveTarget && !k.intent))
    return false;
  const lip = lipAt(world, k.pos, 0.4, k.y, MANTLE.minRise, JUMP.stepUp);
  if (!lip) return false;
  const arc = k.vy > 0 ? (k.vy * k.vy) / (2 * jumpTuning(world).gravity) : 0;
  if (k.y + arc >= lip.top) return false;
  // Only toward the lip: the way the Keeper faces must point at it.
  const dx = lip.x - k.pos.x;
  const dz = lip.z - k.pos.z;
  if (Math.sin(k.facing) * dx + Math.cos(k.facing) * dz <= 0) return false;
  mantles.set(world, {
    from: k.y,
    to: lip.top,
    ms: 0,
    x0: k.pos.x,
    z0: k.pos.z,
    x1: lip.x,
    z1: lip.z,
  });
  k.vy = 0;
  halt(world);
  return true;
}

/** One substep of a mantle: the feet ease up to the lip, then land on it. */
function stepMantle(world: World, dtMs: number, events: SimEvent[]): void {
  const m = mantles.get(world)!;
  const k = world.keeper;
  m.ms += dtMs;
  const t = Math.min(1, m.ms / MANTLE.ms);
  const e = t * t * (3 - 2 * t);
  k.y = m.from + (m.to - m.from) * e;
  k.pos.x = m.x0 + (m.x1 - m.x0) * e;
  k.pos.z = m.z0 + (m.z1 - m.z0) * e;
  if (t < 1) return;
  mantles.delete(world);
  k.y = m.to;
  land(world, 0, events);
}

/** The highest the feet got since they left the ground, for the landing's fall height. */
const peakY = new WeakMap<World, number>();

/** Gravity, jumping and landing for one substep (MOVE-10/11). */
function stepVertical(world: World, dt: number, dungeon: boolean, events: SimEvent[]): void {
  const k = world.keeper;
  const dip = dips.get(world);
  if (dip) {
    // A dip ends with its time, or at once on a jump or on leaving the water.
    dip.ms += dt * 1000;
    if (dip.ms >= POND_DIP.ms || k.bufferMs > 0 || !k.grounded) dips.delete(world);
  }
  const tune = jumpTuning(world);
  const ground = dungeon ? 0 : keeperFooting(world, k.pos.x, k.pos.z, k.y).y;
  if (k.grounded) {
    if (ground < k.y - JUMP.stepUp) {
      // Walked off a ledge: fall, with a moment's grace to still jump.
      k.grounded = false;
      k.vy = 0;
      k.coyoteMs = tune.coyoteMs;
      k.airJumps = JUMP.airJumps;
      peakY.set(world, k.y);
    } else {
      // Slopes, ramps and steps up to `stepUp` are followed.
      k.y = ground;
    }
  }
  if (k.bufferMs > 0 && !k.carrying) {
    const fromGround = k.grounded || k.coyoteMs > 0;
    if (fromGround || k.airJumps > 0) {
      if (!fromGround) k.airJumps -= 1;
      else k.airJumps = JUMP.airJumps;
      const h = fromGround ? JUMP.height : JUMP.doubleHeight;
      // Each jump sets the rise afresh; a press already let go is a short hop.
      k.vy = Math.sqrt(2 * tune.gravity * h) * (k.jumpHeld ? 1 : JUMP.shortHopScale);
      k.grounded = false;
      k.coyoteMs = 0;
      k.bufferMs = 0;
      if (fromGround) peakY.set(world, k.y);
      events.push({ kind: 'keeperJumped', air: !fromGround });
      if (autoPressed.delete(world)) k.jumpHeld = false;
    }
  }
  k.bufferMs = Math.max(0, k.bufferMs - dt * 1000);
  k.coyoteMs = Math.max(0, k.coyoteMs - dt * 1000);
  if (k.grounded) return;
  const g = tune.gravity * (k.vy < 0 ? JUMP.fallGravityScale : 1);
  k.vy = Math.max(-JUMP.maxFall, k.vy - g * dt);
  if (k.vy < 0 && keeperGliding(world)) {
    // The glide holds the fall to a drift for a while (MOVE-27).
    k.vy = Math.max(k.vy, -GLIDE.maxFall);
    glided.set(world, (glided.get(world) ?? 0) + dt * 1000);
  }
  const before = k.y;
  k.y += k.vy * dt;
  if (k.y > (peakY.get(world) ?? -Infinity)) peakY.set(world, k.y);
  // Ground that rises under a jump (a slope, the far bank) is never passed through.
  const under = dungeon ? 0 : keeperFooting(world, k.pos.x, k.pos.z, k.y).y;
  if (k.y <= under) {
    // MOVE-50: a lip the jump's own arc would not lift the feet onto is climbed in a mantle.
    // The feet were under it before this substep's move, so a fast fall onto flat ground is a landing.
    const arc = k.vy > 0 ? (k.vy * k.vy) / (2 * tune.gravity) : 0;
    if (!dungeon && under - before > MANTLE.minRise && k.y + arc < under) {
      mantles.set(world, {
        from: k.y,
        to: under,
        ms: 0,
        x0: k.pos.x,
        z0: k.pos.z,
        x1: k.pos.x,
        z1: k.pos.z,
      });
      k.vy = 0;
      halt(world);
      return;
    }
    k.y = under;
    // MOVE-57: a spring mushroom's cap throws the Keeper back up, higher than a jump.
    const shroom = k.vy <= 0 && !dungeon ? springShroomAt(world, k.pos.x, k.pos.z) : null;
    if (shroom) {
      k.vy = Math.sqrt(2 * tune.gravity * JUMP.height * JUMP_TOYS.bounce);
      k.airJumps = JUMP.airJumps;
      peakY.set(world, k.y);
      springBounce(world, shroom, events);
    } else if (k.vy <= 0) land(world, Math.max(0, (peakY.get(world) ?? k.y) - k.y), events);
  }
}

/** The Keeper's ground velocity (MOVE-20): transient, so it is never saved. */
const vel = new WeakMap<World, Vec2>();
/** Worlds whose Keeper is mid-skid, so a reversal sends one skid, not one per substep. */
const skidding = new WeakSet<World>();

function velOf(world: World): Vec2 {
  let v = vel.get(world);
  if (!v) {
    v = { x: 0, z: 0 };
    vel.set(world, v);
  }
  return v;
}

function moving(world: World): boolean {
  const v = vel.get(world);
  return !!v && (v.x !== 0 || v.z !== 0);
}

/** Drop the Keeper's ground speed (a tap walk, a teleport). */
function halt(world: World): void {
  const v = vel.get(world);
  if (v) v.x = v.z = 0;
}

/**
 * Move the Keeper's velocity toward (wx, wz) (MOVE-20): at `accel`, or `decel` when the
 * stick is let go, or `turnAccel` with one skid event when the new heading is more than
 * `skidDeg` off the way it is going. In the air it steers at `airAccelScale` of that.
 */
function accelerate(world: World, wx: number, wz: number, dt: number, events: SimEvent[]): Vec2 {
  const A = KEEPER_ACCEL;
  const v = velOf(world);
  const want = Math.hypot(wx, wz);
  const have = Math.hypot(v.x, v.z);
  let rate: number = want === 0 ? A.decel : A.accel;
  const reverse =
    want > 0 &&
    have > 1e-6 &&
    (v.x * wx + v.z * wz) / (want * have) < Math.cos((A.skidDeg * Math.PI) / 180);
  if (reverse) {
    rate = A.turnAccel;
    if (!skidding.has(world) && have > KEEPER.speed * 0.5 && world.keeper.grounded) {
      skidding.add(world);
      events.push({ kind: 'keeperSkid' });
    }
  } else skidding.delete(world);
  if (!world.keeper.grounded) rate *= A.airAccelScale;
  const dx = wx - v.x;
  const dz = wz - v.z;
  const d = Math.hypot(dx, dz);
  const most = rate * dt;
  if (d <= most) {
    v.x = wx;
    v.z = wz;
  } else {
    v.x += (dx / d) * most;
    v.z += (dz / d) * most;
  }
  return v;
}

/**
 * Keep a walking Keeper off a terrace cliff it cannot step up (MOVE-09): a step may rise at
 * most `stepUp` over its feet, or over the shelf it already stands on (part way down a
 * soft cliff edge the feet sit below the shelf). Every cliff is a ring round its hill's
 * centre, so a blocked step slides round the ring (the step less its part toward the
 * centre), else along an axis, else stays put.
 * A jump lifts the feet, so a jump clears a tier.
 */
function holdAtLedges(k: World['keeper'], px: number, pz: number): void {
  if (k.pos.x === px && k.pos.z === pz) return;
  const lift = Math.max(k.y, ledgeY(px, pz)) + JUMP.stepUp;
  if (ledgeY(k.pos.x, k.pos.z) <= lift) return;
  const t = TERRACES.find((h) => Math.hypot(px - h.x, pz - h.z) < h.reach);
  if (t) {
    const d = Math.hypot(px - t.x, pz - t.z) || 1;
    const nx = (px - t.x) / d;
    const nz = (pz - t.z) / d;
    const mx = k.pos.x - px;
    const mz = k.pos.z - pz;
    const inward = Math.min(0, mx * nx + mz * nz);
    const sx = px + mx - inward * nx;
    const sz = pz + mz - inward * nz;
    if (ledgeY(sx, sz) <= lift) {
      k.pos.x = sx;
      k.pos.z = sz;
      return;
    }
  }
  if (ledgeY(k.pos.x, pz) <= lift) k.pos.z = pz;
  else if (ledgeY(px, k.pos.z) <= lift) k.pos.x = px;
  else {
    k.pos.x = px;
    k.pos.z = pz;
  }
}

/**
 * MOVE-41: the pace on a slope, walking from (x, z) along the unit heading (dx, dz): slower
 * up, a little quicker down, on the hills only. Only on Grove ground; a jump keeps its pace.
 * Stick and keyboard walks only: a tap walk keeps its planned pace, since a slower climb
 * can carry it into a spot the nav grid and the ledges disagree about (near 28, -33).
 */
export function slopePace(x: number, z: number, dx: number, dz: number): number {
  const r = KEEPER_SLOPE.probe;
  const slope = (hillHeight(x + dx * r, z + dz * r) - hillHeight(x, z)) / r;
  const f = 1 - KEEPER_SLOPE.up * Math.max(0, slope) + KEEPER_SLOPE.down * Math.max(0, -slope);
  return Math.min(KEEPER_SLOPE.max, Math.max(KEEPER_SLOPE.min, f));
}

// MOVE-43: the bush the Keeper is in, so only stepping into one rustles it.
const inBush = new WeakMap<World, string>();

/** Rustle a bush the Keeper has just pushed into; maybe shed leaves, maybe find its shell. */
function rustleBush(world: World, bush: { id: string; x: number; z: number }, events: SimEvent[]) {
  const finds = (world.bushFinds ??= { found: [], checked: {} });
  const hours = (world.timeMs - (finds.checked[bush.id] ?? 0)) / 3_600_000;
  finds.checked[bush.id] = world.timeMs;
  const [leaves, lucky] = withRng(world, (r) => [
    r.chance(BUSH.leafChance),
    r.chance(Math.min(1, BUSH.findPerHour * hours)),
  ]);
  const found = lucky && !finds.found.includes(bush.id);
  if (found) {
    finds.found.push(bush.id);
    world.inventory.shells += BUSH.findShells;
  }
  events.push({ kind: 'bushRustle', id: bush.id, x: bush.x, z: bush.z, leaves, found });
}

// MOVE-42: the tap target a walk was judged for, and whether it runs (Auto-run, long walks).
const tapRuns = new WeakMap<World, { at: Vec2; run: boolean }>();

/** R0102: Travel assist marks its walk as a run (`sim/travel.ts`). */
export function markRunWalk(world: World, at: Vec2): void {
  tapRuns.set(world, { at, run: true });
}

/** Whether this tap walk runs: the Run toggle, or Auto-run on a walk over ten units. */
function tapRunning(world: World, target: Vec2): boolean {
  const k = world.keeper;
  if (k.running) return true;
  let t = tapRuns.get(world);
  // R0102: a Travel assist walk runs whatever the Auto-run setting says.
  if (t?.run && t.at === target) return true;
  if (!world.settings.autoRun) return false;
  if (!t || t.at !== target) {
    t = { at: target, run: dist(k.pos, target) > RUN_MODE.autoRunOver };
    tapRuns.set(world, t);
  }
  return t.run;
}

function keeperSubstep(world: World, dtMs: number, events: SimEvent[]): void {
  const k = world.keeper;
  // A roll moves the Keeper itself until it ends or a jump cancels it (MOVE-64).
  if (rolls.has(world) && stepRoll(world, dtMs, events)) {
    rideCarried(world);
    return;
  }
  // A mantle takes the Keeper's whole substep: no walking, no gravity (MOVE-50).
  if (mantles.has(world)) {
    stepMantle(world, dtMs, events);
    rideCarried(world);
    return;
  }
  const dt = dtMs / 1000;
  const fromX = k.pos.x;
  const fromZ = k.pos.z;
  const dungeonFloor = runFloor(world);
  // Pushing through a bush or a flowerbed is slow going (MOVE-03), and so is wading the
  // stream (MOVE-13); a jump over either keeps its pace.
  // Only a Keeper on the move needs its pace (the full-life runs step a still one).
  const going =
    !dungeonFloor && (k.input.x !== 0 || k.input.z !== 0 || !!k.moveTarget || !!k.intent);
  const wet = going && k.grounded && keeperFooting(world, k.pos.x, k.pos.z, k.y).on === 'water';
  const soft =
    (going && softAt(k.pos, world) ? KEEPER_SOFT.slow : 1) *
    (wet ? waterPace(world, k.pos.x, k.pos.z, KEEPER_WADE.speed) : 1) *
    // R0119: a path or a deck is a little quicker than grass.
    (going && k.grounded && !wet ? surfacePace(world, k.pos.x, k.pos.z) : 1) *
    (going && !k.grounded && keeperGliding(world) ? GLIDE.airSpeed : 1) *
    // A running jump carries further (MOVE-42).
    (going && !k.grounded && k.running ? RUN_MODE.airCarry : 1);

  // Direct input wins over tap targets.
  if (k.input.x !== 0 || k.input.z !== 0) {
    const len = Math.hypot(k.input.x, k.input.z);
    const nx = k.input.x / len;
    const nz = k.input.z / len;
    // The stick's length (up to 1) is the pace: a light touch walks slowly.
    const speed =
      KEEPER.speed *
      Math.min(1, len) *
      keeperSpeedMultiplier(world, k.running, KEEPER.runMultiplier) *
      soft *
      (k.grounded && !dungeonFloor && world.location === 'grove'
        ? slopePace(k.pos.x, k.pos.z, nx, nz)
        : 1);
    const v = accelerate(world, nx * speed, nz * speed, dt, events);
    k.pos.x += v.x * dt;
    k.pos.z += v.z * dt;
    k.facing = Math.atan2(nx, nz);
    k.moveTarget = null;
    k.intent = null;
    // Without the Swim perk the Keeper does not wade: a step into the pond stops at the
    // shore, as a tap target in the pond does below.
    if (!dungeonFloor && !keeperPerks(world).wade) {
      const s = shoreline(k.pos);
      // R0088: stopped by deep water: say a swimmer could take the Keeper across.
      if (Math.hypot(s.x - k.pos.x, s.z - k.pos.z) > 1e-4) swimHint(world, events);
      k.pos.x = s.x;
      k.pos.z = s.z;
    }
  } else if (!k.moveTarget && !k.intent && moving(world)) {
    // Let go of the stick: the Keeper slows to a stop over a few hundredths of a second.
    const v = accelerate(world, 0, 0, dt, events);
    k.pos.x += v.x * dt;
    k.pos.z += v.z * dt;
  } else {
    let target = k.moveTarget;
    // MOVE-59: a care walk to a Nubbin stands where the Nubbin stays in view (careApproach).
    let around: Vec2 | null = null;
    if (k.intent) {
      target = intentTarget(world, k.intent);
      if (target && !dungeonFloor) around = careApproach(world, k.intent, target);
    }
    // A tap walk keeps its own pace; any speed left from the stick is dropped.
    halt(world);
    if (k.intent && !target) k.intent = null;
    // The Keeper does not wade: a target in the pond becomes the nearest shoreline point,
    // and a Nubbin in the water is reached from there.
    const raw = target;
    if (target && !dungeonFloor && !keeperPerks(world).wade) {
      target = shoreline(target);
      // R0088: a tap out on the pond, with nobody to swim it there.
      if (raw && !k.intent && Math.hypot(target.x - raw.x, target.z - raw.z) > 0.5)
        swimHint(world, events);
    }
    if (around) target = around;
    if (target) {
      const d = dist(k.pos, target);
      // On land the Keeper walks up to arm's length; from the shore, a swimming Nubbin is
      // within reach however far out it is.
      const reach = !k.intent
        ? standIns.has(raw!)
          ? UNREACHABLE.standInReach
          : KEEPER.arriveRadius
        : around
          ? CARE_APPROACH.arrive
          : target !== raw
            ? KEEPER.interactRadius + GROVE.pond.r
            : KEEPER.interactRadius;
      if (d <= reach) {
        if (k.intent) {
          // MOVE-59: turn to the Nubbin on arrival.
          if (around && raw) k.facing = Math.atan2(raw.x - k.pos.x, raw.z - k.pos.z);
          performIntent(world, k.intent, events);
          k.intent = null;
        }
        k.moveTarget = null;
      } else if (k.intent && careWalkStalled(world)) {
        events.push({ kind: 'cantReach', targetId: intentTargetId(k.intent) });
        k.intent = null;
        k.moveTarget = null;
      } else if (dungeonFloor) {
        // Underground the Keeper follows an A* path round the rock (dungeon-nav.ts). No
        // waypoint means it already stands as near as it can get: a plain tap ends there,
        // a care walk is left to give up through careWalkStalled.
        const wp = keeperWaypoint(world, dungeonFloor, target);
        if (!wp) {
          if (!k.intent) k.moveTarget = null;
        } else {
          const wd = dist(k.pos, wp);
          const speed =
            KEEPER.speed * keeperSpeedMultiplier(world, k.running, KEEPER.runMultiplier);
          if (wd > 1e-6) {
            const dx = (wp.x - k.pos.x) / wd;
            const dz = (wp.z - k.pos.z) / wd;
            const step = Math.min(wd, speed * dt);
            k.pos.x += dx * step;
            k.pos.z += dz * step;
            k.facing = Math.atan2(dx, dz);
          }
        }
      } else {
        // In the Grove the Keeper follows a planned path round what stands in the way
        // (nav.ts). A target with nothing reachable near it is refused at once; a shut-in
        // tap walks to the nearest reachable point and stops there.
        // A stand-in walk that has come down off a rim or a tier looks again, now and then, at
        // the tap it stands in for, and heads there once it can.
        const tapped = !k.intent ? standIns.get(target) : undefined;
        if (tapped && world.timeMs - (tapRecheck.get(world) ?? -Infinity) >= RECHECK_MS) {
          tapRecheck.set(world, world.timeMs);
          const back = groveLeg(world, k.pos, tapped);
          if (back && dist(back.end, tapped) < 1e-3) target = k.moveTarget = tapped;
        }
        const leg = groveLeg(world, k.pos, target);
        // A walk to a stand-in that is itself out of reach from here (the Keeper slid onto
        // another tier on the way) has got as close as it can: stop, rather than dither
        // between fresh stand-ins for ever.
        const stuck =
          !!leg &&
          !k.intent &&
          standIns.has(target) &&
          dist(leg.end, target) > UNREACHABLE.standInReach;
        if (around && k.intent && (!leg || dist(leg.end, target) > reach)) {
          // MOVE-59: the spot in view cannot be reached: walk to the Nubbin as before.
          noApproach.add(k.intent);
        } else if (!leg || stuck || (k.intent && dist(leg.end, target) > reach)) {
          if (k.intent) events.push({ kind: 'cantReach', targetId: intentTargetId(k.intent) });
          // MOVE-35: a plain tap with nowhere reachable near it says so.
          else if (!stuck)
            events.push({ kind: 'moveUnreachable', nearest: { ...k.pos }, jump: false });
          k.intent = null;
          k.moveTarget = null;
        } else {
          if (!k.intent && leg.end !== target) {
            // MOVE-35: the tap is shut in; walk to the nearest reachable point and say so,
            // with a hint when a jump would get there.
            k.moveTarget = leg.end;
            standIns.set(leg.end, standIns.get(target) ?? target);
            const jump = !autoHopOn(world) && hopReaches(world, k.pos, target);
            events.push({ kind: 'moveUnreachable', nearest: { ...leg.end }, jump });
          }
          const to = leg.next;
          const td = Math.max(dist(k.pos, to), 1e-6);
          // It eases in over the last stretch to where it stops (MOVE-20).
          const ease = Math.max(0.35, Math.min(1, dist(k.pos, leg.end) / KEEPER_ACCEL.arriveEase));
          const step = Math.min(
            td,
            KEEPER.speed *
              keeperSpeedMultiplier(
                world,
                !k.intent && !!k.moveTarget && tapRunning(world, k.moveTarget),
                KEEPER.runMultiplier,
              ) *
              soft *
              ease *
              dt,
          );
          let dx = (to.x - k.pos.x) / td;
          let dz = (to.z - k.pos.z) / td;
          // Steering stays as the local fallback on a straight leg.
          const hops = autoHopOn(world);
          if (to === target) [dx, dz] = steer(world, k.pos, target, dx, dz, hops);
          if (hops) autoHop(world, dx, dz);
          k.pos.x += dx * step;
          k.pos.z += dz * step;
          k.facing = Math.atan2(dx, dz);
        }
      }
    }
  }
  // Solid things: hills, trees, buildings, rocks, or the Hollow's walls. A tap target
  // inside one is dropped.
  if (dungeonFloor) {
    if (
      resolveDungeon(k.pos, dungeonFloor, 0.35) &&
      k.moveTarget &&
      dungeonBlocked(k.moveTarget, dungeonFloor, 0.3)
    ) {
      k.moveTarget = null;
      k.intent = null;
    }
  } else {
    if (
      resolve(k.pos, world, 0.35, 'keeper', k.y) &&
      k.moveTarget &&
      blocked(k.moveTarget, world, 0.3)
    ) {
      k.moveTarget = null;
      k.intent = null;
    }
    holdAtLedges(k, fromX, fromZ);
    // MOVE-43: stepping into a bush (on foot, not over it) rustles it.
    if (going && k.grounded) {
      const now = softAt(k.pos, world);
      const was = inBush.get(world);
      if (now && now.id !== was && now.id.startsWith('wild-')) rustleBush(world, now, events);
      if (now) inBush.set(world, now.id);
      else if (was) inBush.delete(world);
    }
    // A soft piece does not stop the Keeper; once it stops walking it eases back out.
    const idle = !k.moveTarget && !k.intent && k.input.x === 0 && k.input.z === 0;
    const bush = idle ? softAt(k.pos, world) : null;
    const out = bush && contact(bush, k.pos.x, k.pos.z, KEEPER_UNSTICK.clearance);
    if (out) {
      // The ease is per sim step; a substep eases its share of it.
      const ease = KEEPER_SOFT.push * Math.min(1, dtMs / SIM.stepMs);
      k.pos.x += out.nx * out.depth * ease;
      k.pos.z += out.nz * out.depth * ease;
    }
    clampToWorld(k.pos);
    // Still inside something (two blockers, or a blocker and the shore, pushing in turn):
    // step out to the nearest free spot so no position can trap the Keeper.
    unstickKeeper(world);
    // Speed into a wall, a cliff or the shore is lost, so a Keeper let go there does not
    // slide on, and one that jumps from a wall starts from still.
    if (moving(world)) {
      const v = velOf(world);
      const gx = (k.pos.x - fromX) / dt;
      const gz = (k.pos.z - fromZ) / dt;
      if (Math.hypot(gx, gz) < Math.hypot(v.x, v.z)) {
        v.x = gx;
        v.z = gz;
      }
    }
  }
  if (!dungeonFloor && !k.grounded && grabLip(world)) {
    rideCarried(world);
    return;
  }
  stepVertical(world, dt, !!dungeonFloor, events);
  if (!k.grounded && !dungeonFloor) jumpPlay(world, events);
  rideCarried(world);
}

/** A carried Nubbin rides above the Keeper's head. */
function rideCarried(world: World): void {
  const k = world.keeper;
  if (k.carrying) {
    const n = findNubbin(world, k.carrying);
    if (n && n.behavior.state === 'carried') {
      n.pos.x = k.pos.x;
      n.pos.z = k.pos.z;
      n.y = KEEPER.carryHeight;
      n.facing = k.facing;
    } else {
      k.carrying = null;
    }
  }
}

/** Per world: when each tree was last jumped into and each Nubbin last leapt over (MOVE-26). */
const playCooldowns = new WeakMap<World, Map<string, number>>();

/**
 * What a jump does on its way (MOVE-26), checked only while the Keeper is in the air: a
 * jump into a fruit tree's trunk shakes it, as a tap does; a jump over a sitting Nubbin is
 * a leapfrog that makes it giggle. Each has its own cooldown per tree or Nubbin.
 */
function jumpPlay(world: World, events: SimEvent[]): void {
  const k = world.keeper;
  const P = JUMP_PLAY;
  let seen = playCooldowns.get(world);
  const ready = (id: string, ms: number): boolean => {
    const at = seen?.get(id);
    return at === undefined || world.timeMs - at >= ms;
  };
  const mark = (id: string): void => {
    if (!seen) playCooldowns.set(world, (seen = new Map()));
    seen.set(id, world.timeMs);
  };
  for (const t of world.trees) {
    if (dist(k.pos, t.pos) > P.trunkReach || !ready(t.id, P.treeCooldownMs)) continue;
    mark(t.id);
    shakeTreeNow(world, t, events);
  }
  for (const n of world.nubbins) {
    if (n.behavior.state !== 'sit' || !isFree(n)) continue;
    if (dist(k.pos, n.pos) > P.leapReach || k.y - footing(n.pos.x, n.pos.z).y < P.leapClear)
      continue;
    if (!ready(n.id, P.leapCooldownMs)) continue;
    mark(n.id);
    addHappiness(n, P.leapHappiness);
    react(n, 'love', world.timeMs, events);
  }
}

/** Shake a fruit tree: the next fruit comes sooner, now and then wood, and Power drops fruit. */
function shakeTreeNow(world: World, tree: World['trees'][number], events: SimEvent[]): void {
  tree.fruitTimerMs = Math.max(0, tree.fruitTimerMs - TREES.shakeBonusMs);
  events.push({ kind: 'treeShaken', treeId: tree.id });
  // Wood now and then, and a Power-type friend shakes fruit loose at once.
  withRng(world, (rng) => {
    if (rng.chance(GATHER.woodChance)) {
      world.inventory.wood += 1;
      events.push({ kind: 'gathered', what: 'wood', count: 1 });
    }
    if (keeperPerks(world).power) {
      for (let i = 0; i < PERKS.powerShakeFruit; i++) dropFruit(world, tree, rng, events);
    }
    // R0164: Crumbs on worn gear shakes loose a little more.
    const extra = shakeFruitBonus(world, () => rng.next());
    for (let i = 0; i < extra; i++) dropFruit(world, tree, rng, events);
  });
}

function performIntent(world: World, intent: KeeperIntent, events: SimEvent[]): void {
  const now = world.timeMs;
  switch (intent.kind) {
    case 'pet': {
      const n = findNubbin(world, intent.nubbinId);
      if (!n || n.stage === 'egg') return;
      petNubbin(world, n, events);
      return;
    }
    case 'pickUp': {
      const n = findNubbin(world, intent.nubbinId);
      if (!n || world.keeper.carrying) return;
      if (n.behavior.state === 'held' || n.behavior.state === 'thrown') return;
      n.behavior.state = 'carried';
      n.behavior.sinceMs = now;
      n.behavior.target = null;
      n.behavior.itemId = null;
      world.keeper.carrying = n.id;
      events.push({ kind: 'pickedUp', nubbinId: n.id });
      return;
    }
    case 'feed': {
      const n = findNubbin(world, intent.nubbinId);
      if (!n || n.stage === 'egg' || world.inventory.fruit <= 0) return;
      if (n.behavior.state === 'thrown') return;
      world.inventory.fruit -= 1;
      eat(n, now, events);
      addTrust(n, TRUST.feed, events);
      noteCampaign(world, 'feed', n.id);
      if (n.stray) settleStray(n);
      nudgeAlignment(n, world.keeper.alignment);
      noteCare(n, 'feeds');
      return;
    }
    case 'shakeTree': {
      const tree = world.trees.find((t) => t.id === intent.treeId);
      if (tree) shakeTreeNow(world, tree, events);
      return;
    }
    case 'collect': {
      const item = world.items.find((i) => i.id === intent.itemId);
      if (!item || item.kind === 'toy') return;
      world.items = world.items.filter((i) => i.id !== item.id);
      if (item.kind === 'fruit') world.inventory.fruit += 1;
      else if (item.kind === 'notebook' && world.campaign)
        world.campaign.flags.notebookFound = true;
      events.push({ kind: 'collected', itemId: item.id });
      return;
    }
    case 'heartFruit': {
      const n = findNubbin(world, intent.nubbinId);
      if (n) giveHeartFruit(world, n, events);
      return;
    }
    case 'interact': {
      const n = findNubbin(world, intent.nubbinId);
      if (!n || n.stage === 'egg' || n.stage === 'cocoon') return;
      interact(world, n, intent.action, events);
      return;
    }
  }
}

/**
 * The gentler interactions. A wary Shadow Nubbin refuses most of them (it is not ready),
 * which is its own lesson; tucking in and praise always land.
 */
export function interact(world: World, n: Nubbin, action: Interaction, events: SimEvent[]): void {
  const now = world.timeMs;
  const refused = isWary(n) && action !== 'tuckIn' && action !== 'praise';
  if (refused) {
    react(n, 'surprised', now, events);
    events.push({ kind: 'interacted', nubbinId: n.id, action, ok: false });
    return;
  }
  // R0530: every kind of care shapes a child's personality, not only pets.
  noteTouch(n, action, now);
  switch (action) {
    case 'tickle':
      addHappiness(n, 4);
      addTrust(n, 1, events);
      react(n, 'happy', now, events);
      break;
    case 'hug':
      addAffection(n, 4);
      addTrust(n, 2.5, events);
      addHappiness(n, 3);
      react(n, 'love', now, events);
      break;
    case 'groom':
      addHappiness(n, 3);
      addAffection(n, 2);
      addTrust(n, 1.5, events);
      react(n, 'happy', now, events);
      break;
    case 'tuckIn':
      if (n.needs.energy < 0.6 && isFree(n)) {
        n.behavior.state = 'nap';
        n.behavior.sinceMs = now;
        n.behavior.untilMs = now + NEEDS.napMs;
        n.behavior.target = null;
        addTrust(n, 2, events);
        events.push({ kind: 'napStarted', nubbinId: n.id });
      } else {
        react(n, 'confused', now, events);
      }
      break;
    case 'praise':
      addHappiness(n, 2);
      addTrust(n, 1, events);
      nudgeAlignment(n, world.keeper.alignment);
      react(n, 'happy', now, events);
      break;
    case 'highFive':
      // R0532 (lane A r8): a grumpy one turns it down three times in ten, with a huff.
      if (n.moody === 'grumpy' && withRng(world, (r) => r.chance(MOODY.grumpyRefuse))) {
        react(n, 'sad', now, events);
        events.push({ kind: 'highFiveRefused', nubbinId: n.id });
        events.push({ kind: 'interacted', nubbinId: n.id, action, ok: false });
        return;
      }
      addHappiness(n, 3);
      addTrust(n, 1, events);
      react(n, n.personality === 'shy' ? 'confused' : 'happy', now, events);
      break;
  }
  if (n.stray) settleStray(n);
  noteCampaign(world, 'pet', n.id);
  events.push({ kind: 'interacted', nubbinId: n.id, action, ok: true });
}

export function petNubbin(world: World, n: Nubbin, events: SimEvent[]): void {
  const now = world.timeMs;
  applyPet(n);
  addTrust(n, TRUST.pet, events);
  noteCampaign(world, 'pet', n.id);
  if (n.stray) settleStray(n);
  nudgeAlignment(n, world.keeper.alignment);
  if (now - n.lastPetMs >= NEEDS.petCooldownMs) noteCare(n, 'pets');
  n.lastPetMs = now;
  pet(n, world.keeper.pos, now, events);
}

/** Put a carried Nubbin down at the Keeper's feet. */
export function keeperPutDown(world: World, events: SimEvent[]): void {
  const k = world.keeper;
  if (!k.carrying) return;
  const n = findNubbin(world, k.carrying);
  k.carrying = null;
  if (!n) return;
  n.pos.x = k.pos.x + Math.sin(k.facing) * 0.8;
  n.pos.z = k.pos.z + Math.cos(k.facing) * 0.8;
  putDown(n, world.timeMs, events);
}

/**
 * MOVE-64: whether a jump press asks for a roll instead: running, on the ground, with the
 * stick pulled toward the camera (the view's yaw is the UI's hint; none known, no roll).
 */
export function rollAsked(world: World): boolean {
  const k = world.keeper;
  const yaw = world.viewYaw;
  const len = Math.hypot(k.input.x, k.input.z);
  if (!k.running || !k.grounded || yaw === undefined || len < 0.5) return false;
  return (k.input.x * Math.sin(yaw) + k.input.z * Math.cos(yaw)) / len > ROLL.downDot;
}
