import { EXPEDITION } from '../../config/tuning';
import { EXPEDITION_FUN_TEXT } from '../../config/strings-fun-r6';
import { WILD_CRITTERS } from '../../sim/critters';
import { Rng } from '../../sim/rng';
import type { NubbinType, Rewards } from '../../sim/types';

/**
 * The Expedition: a 45–60 s side-scrolling dash. Pure logic, fixed steps, seeded, so it
 * can be tested without a canvas. Positions are in low-res pixels; the track scrolls
 * left past a runner fixed at `runnerX`.
 */

export type ThingKind = 'shell' | 'essence' | 'critter' | 'rock' | 'log' | 'bush';

export interface Thing {
  id: number;
  kind: ThingKind;
  /** Track x (world), y from the top of the view. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Payload for essences / critters. */
  type: NubbinType | null;
  species: string | null;
  taken: boolean;
}

export interface RunState {
  rng: Rng;
  timeMs: number;
  /** How far the track has scrolled, in px. */
  distance: number;
  speed: number;
  runnerY: number;
  runnerVy: number;
  onGround: boolean;
  holdMs: number;
  holding: boolean;
  /** Track x where the next pattern spawns. */
  nextSpawnX: number;
  things: Thing[];
  nextId: number;
  shells: number;
  hits: number;
  hitCooldownMs: number;
  rewards: Rewards;
  finished: boolean;
  /**
   * Visual pulses for the view. A hit names what was hit and how many Shells flew out
   * (R0324: the spin and the Shells bouncing away).
   */
  lastEvent: {
    kind: 'shell' | 'essence' | 'critter' | 'hit';
    atMs: number;
    thing?: ThingKind;
    dropped?: number;
  } | null;
  /** R0324 (FUN-35): what the results card's superlative is made from. */
  fun: RunFun;
}

/** R0324: run stats for the results card's one silly superlative. */
export interface RunFun {
  /** The most Shells dropped on one hit, and on what. */
  mostDropped: number;
  mostDroppedOn: ThingKind | null;
  /** Time in the air now, and the longest single jump (ms). */
  airMs: number;
  longestAirMs: number;
  jumps: number;
  bubbles: number;
  logs: number;
}

export const RUNNER_W = 20;
export const RUNNER_H = 26;

export function createRun(seed: number): RunState {
  return {
    rng: Rng.fromSeed(seed),
    timeMs: 0,
    distance: 0,
    speed: EXPEDITION.speed,
    runnerY: EXPEDITION.groundY,
    runnerVy: 0,
    onGround: true,
    holdMs: 0,
    holding: false,
    nextSpawnX: 360,
    things: [],
    nextId: 1,
    shells: 0,
    hits: 0,
    hitCooldownMs: 0,
    rewards: { shells: 0, essences: {}, critters: {} },
    finished: false,
    lastEvent: null,
    fun: {
      mostDropped: 0,
      mostDroppedOn: null,
      airMs: 0,
      longestAirMs: 0,
      jumps: 0,
      bubbles: 0,
      logs: 0,
    },
  };
}

export function jumpPressed(run: RunState): void {
  if (run.finished) return;
  run.holding = true;
  if (run.onGround) {
    run.onGround = false;
    run.runnerVy = -EXPEDITION.jumpVelocity;
    run.holdMs = 0;
  }
}

export function jumpReleased(run: RunState): void {
  run.holding = false;
}

/** Spawn one pattern of things at track x. */
function spawnPattern(run: RunState, x: number): void {
  const rng = run.rng;
  const roll = rng.next();
  const add = (kind: ThingKind, dx: number, y: number, w: number, h: number): Thing => {
    const t: Thing = {
      id: run.nextId++,
      kind,
      x: x + dx,
      y,
      w,
      h,
      type: null,
      species: null,
      taken: false,
    };
    run.things.push(t);
    return t;
  };
  const ground = EXPEDITION.groundY;

  if (roll < EXPEDITION.obstacleChance) {
    // An obstacle with a few shells arcing over it.
    const kind: ThingKind = rng.pick(['rock', 'log', 'bush']);
    const w = kind === 'log' ? 34 : 18;
    const h = kind === 'bush' ? 18 : 14;
    add(kind, 0, ground - h, w, h);
    for (let i = 0; i < 4; i++) {
      add('shell', -26 + i * 20, ground - 44 - Math.sin((i / 3) * Math.PI) * 26, 10, 10);
    }
    return;
  }
  const special = rng.next();
  if (special < EXPEDITION.critterChance) {
    // A bubble carrying a critter, floating at jump height.
    const t = add('critter', 0, ground - 58, 18, 18);
    t.species = rng.pick(WILD_CRITTERS).id;
    return;
  }
  if (special < EXPEDITION.critterChance + EXPEDITION.essenceChance) {
    const t = add('essence', 0, ground - 40 - rng.int(0, 2) * 14, 12, 14);
    t.type = rng.pick(['swim', 'fly', 'run', 'power', 'normal'] as const);
    return;
  }
  // A row or a staircase of shells.
  const count = rng.int(3, 6);
  const stairs = rng.chance(0.5);
  for (let i = 0; i < count; i++) {
    const y = stairs ? ground - 16 - i * 10 : ground - 16 - rng.int(0, 1) * 28;
    add('shell', i * 16, y, 10, 10);
  }
}

function overlaps(ax: number, ay: number, aw: number, ah: number, t: Thing): boolean {
  return ax < t.x + t.w && ax + aw > t.x && ay < t.y + t.h && ay + ah > t.y;
}

/** Advance the run by one fixed step. */
export function stepRun(run: RunState, dtMs: number): void {
  if (run.finished) return;
  const dt = dtMs / 1000;
  run.timeMs += dtMs;

  // Scroll.
  run.speed = EXPEDITION.speed + EXPEDITION.speedRamp * (run.timeMs / 1000);
  run.distance += run.speed * dt;

  // Runner physics with a variable-height jump.
  if (!run.onGround) {
    let g = EXPEDITION.gravity;
    if (run.holding && run.runnerVy < 0 && run.holdMs < EXPEDITION.holdMaxMs) {
      g -= EXPEDITION.holdGravityCancel;
      run.holdMs += dtMs;
    }
    run.runnerVy += g * dt;
    run.runnerY += run.runnerVy * dt;
    run.fun.airMs += dtMs;
    if (run.runnerY >= EXPEDITION.groundY) {
      run.runnerY = EXPEDITION.groundY;
      run.runnerVy = 0;
      run.onGround = true;
      run.fun.longestAirMs = Math.max(run.fun.longestAirMs, run.fun.airMs);
      run.fun.airMs = 0;
      run.fun.jumps += 1;
    }
  }

  // Spawn ahead of the view.
  const viewRight = run.distance + EXPEDITION.maxViewW + 60;
  while (run.nextSpawnX < viewRight) {
    spawnPattern(run, run.nextSpawnX);
    run.nextSpawnX += run.rng.float(...EXPEDITION.patternGapPx);
  }

  // Collisions in track space: the runner's box is at distance + runnerX.
  if (run.hitCooldownMs > 0) run.hitCooldownMs -= dtMs;
  const rx = run.distance + EXPEDITION.runnerX - RUNNER_W / 2;
  const ry = run.runnerY - RUNNER_H;
  for (const t of run.things) {
    if (t.taken) continue;
    if (!overlaps(rx + 3, ry + 3, RUNNER_W - 6, RUNNER_H - 4, t)) continue;
    switch (t.kind) {
      case 'shell':
        t.taken = true;
        run.shells += EXPEDITION.shellValue;
        run.lastEvent = { kind: 'shell', atMs: run.timeMs };
        break;
      case 'essence':
        t.taken = true;
        if (t.type) run.rewards.essences[t.type] = (run.rewards.essences[t.type] ?? 0) + 1;
        // Essences come with a seed of the same flavour now and then.
        if (t.type && run.rng.chance(0.5)) {
          run.rewards.seeds ??= {};
          const f = t.type === 'normal' ? 'stamina' : t.type;
          run.rewards.seeds[f] = (run.rewards.seeds[f] ?? 0) + 1;
        }
        run.lastEvent = { kind: 'essence', atMs: run.timeMs };
        break;
      case 'critter':
        t.taken = true;
        if (t.species) run.rewards.critters[t.species] = (run.rewards.critters[t.species] ?? 0) + 1;
        run.fun.bubbles += 1;
        run.lastEvent = { kind: 'critter', atMs: run.timeMs };
        break;
      default:
        // Obstacles cost Shells but never end the run.
        if (run.hitCooldownMs <= 0) {
          run.hits += 1;
          const dropped = Math.min(run.shells, EXPEDITION.obstaclePenalty);
          run.shells -= dropped;
          run.hitCooldownMs = EXPEDITION.hitCooldownMs;
          run.lastEvent = { kind: 'hit', atMs: run.timeMs, thing: t.kind, dropped };
          if (dropped > run.fun.mostDropped) {
            run.fun.mostDropped = dropped;
            run.fun.mostDroppedOn = t.kind;
          }
          if (t.kind === 'log') run.fun.logs += 1;
        }
        break;
    }
  }

  // Drop what scrolled off.
  run.things = run.things.filter((t) => !t.taken && t.x + t.w > run.distance - 40);

  // The rewards always hold the Shells so far, so quitting early keeps them like the rest.
  run.rewards.shells = run.shells;
  if (run.timeMs >= EXPEDITION.durationMs) run.finished = true;
}

/** Progress 0..1 for the HUD bar. */
export function progressOf(run: RunState): number {
  return Math.min(1, run.timeMs / EXPEDITION.durationMs);
}

/**
 * R0324 (FUN-35): the results card's one superlative, from the run's own numbers. Every
 * run has one: the list ends with lines any run can earn. Which one is picked rotates with
 * the run (its jumps and hits), so two runs rarely read the same.
 */
export function superlative(run: RunState): string {
  const f = run.fun;
  const t = EXPEDITION_FUN_TEXT;
  const options: string[] = [];
  if (f.mostDropped > 0 && f.mostDroppedOn)
    options.push(t.mostDropped(f.mostDropped, t.things[f.mostDroppedOn] ?? f.mostDroppedOn));
  if (f.longestAirMs > 0) options.push(t.longestAir((f.longestAirMs / 1000).toFixed(1)));
  if (f.bubbles > 0) options.push(t.bubbles(f.bubbles));
  if (f.logs > 0) options.push(t.logs(f.logs));
  if (run.hits === 0) options.push(t.noHits);
  options.push(t.jumps(f.jumps));
  return options[(f.jumps + run.hits) % options.length]!;
}
