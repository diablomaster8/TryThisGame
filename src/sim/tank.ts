import { TANK } from '../config/tuning';
import { Rng } from './rng';

/**
 * The Beetle Run: a cart rolls through a seeded cave on three lanes. Tap up or down to
 * change lane, dodge spores, loose rocks and acid, pick up shells, wood and stone until
 * the cargo is full, and reach the boss door at the end. Pure and seeded; the screen
 * draws it and feeds inputs.
 */
export type TankThing = 'spore' | 'rock' | 'acid' | 'shell' | 'wood' | 'stone';

export interface TankEntity {
  id: number;
  kind: TankThing;
  lane: number;
  /** Distance along the cave in units. */
  at: number;
  taken: boolean;
}

export interface TankState {
  seed: number;
  timeMs: number;
  /** Cart position along the cave and its lane (0..lanes-1), with a lane tween. */
  distance: number;
  lane: number;
  laneFrom: number;
  laneT: number;
  stunMs: number;
  cargo: { shells: number; wood: number; stone: number };
  cargoCount: number;
  hits: number;
  entities: TankEntity[];
  finished: boolean;
  /** Reached the boss door with cargo (a win) or limped home after too many hits. */
  won: boolean;
}

export function createTank(seed: number): TankState {
  const rng = Rng.fromSeed(seed);
  const entities: TankEntity[] = [];
  let id = 0;
  let hazardAt = 10 + rng.float(...TANK.hazardEvery) * 3;
  let lootAt = 6 + rng.float(...TANK.lootEvery) * 3;
  while (hazardAt < TANK.lengthUnits - 12) {
    entities.push({
      id: id++,
      kind: rng.pick(['spore', 'rock', 'acid'] as const),
      lane: rng.int(0, TANK.lanes - 1),
      at: hazardAt,
      taken: false,
    });
    hazardAt += rng.float(...TANK.hazardEvery) * TANK.speed;
  }
  while (lootAt < TANK.lengthUnits - 8) {
    const kind = rng.chance(0.55) ? 'shell' : rng.chance(0.5) ? 'wood' : 'stone';
    entities.push({ id: id++, kind, lane: rng.int(0, TANK.lanes - 1), at: lootAt, taken: false });
    lootAt += rng.float(...TANK.lootEvery) * TANK.speed;
  }
  return {
    seed,
    timeMs: 0,
    distance: 0,
    lane: 1,
    laneFrom: 1,
    laneT: 1,
    stunMs: 0,
    cargo: { shells: 0, wood: 0, stone: 0 },
    cargoCount: 0,
    hits: 0,
    entities,
    finished: false,
    won: false,
  };
}

export function steer(t: TankState, dir: -1 | 1): void {
  if (t.finished) return;
  const next = Math.max(0, Math.min(TANK.lanes - 1, t.lane + dir));
  if (next === t.lane) return;
  t.laneFrom = t.lane;
  t.lane = next;
  t.laneT = 0;
}

/** Advance the run; returns what was taken or hit this step. */
export function stepTank(t: TankState, dtMs: number): Array<{ kind: TankThing; hit: boolean }> {
  const out: Array<{ kind: TankThing; hit: boolean }> = [];
  if (t.finished) return out;
  t.timeMs += dtMs;
  const dt = dtMs / 1000;
  t.laneT = Math.min(1, t.laneT + dt * 6);
  if (t.stunMs > 0) t.stunMs = Math.max(0, t.stunMs - dtMs);
  else t.distance += TANK.speed * dt;
  for (const e of t.entities) {
    if (e.taken || e.lane !== t.lane || t.laneT < 0.6) continue;
    if (Math.abs(e.at - t.distance) > 0.7) continue;
    e.taken = true;
    if (e.kind === 'spore' || e.kind === 'rock' || e.kind === 'acid') {
      t.hits += 1;
      t.stunMs = TANK.stunMs;
      // A knock spills one piece of cargo.
      if (t.cargo.shells > 0) t.cargo.shells = Math.max(0, t.cargo.shells - 5);
      else if (t.cargo.wood > 0) t.cargo.wood -= 1;
      else if (t.cargo.stone > 0) t.cargo.stone -= 1;
      t.cargoCount = Math.max(0, t.cargoCount - 1);
      out.push({ kind: e.kind, hit: true });
    } else if (t.cargoCount < TANK.cargo) {
      if (e.kind === 'shell') t.cargo.shells += 10;
      else if (e.kind === 'wood') t.cargo.wood += 1;
      else t.cargo.stone += 1;
      t.cargoCount += 1;
      out.push({ kind: e.kind, hit: false });
    } else {
      e.taken = false; // no room: leave it
    }
  }
  if (t.distance >= TANK.lengthUnits) {
    t.finished = true;
    t.won = true;
    t.cargo.shells += TANK.bossBonus;
  } else if (t.hits >= 6) {
    t.finished = true;
    t.won = false;
  }
  return out;
}
