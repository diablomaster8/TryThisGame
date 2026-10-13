import { KARATE } from '../config/tuning';
import { Rng } from './rng';
import { levelOf } from './stats';
import type { Nubbin } from './types';

/**
 * Karate: a bout between two fighters. Power sets how hard a strike lands, Stamina how
 * much can be taken, Run how often a strike is slipped. The player times taps on a
 * swinging bar: the sweet spot lands a strong strike, a miss a weak one, and the rival
 * strikes back on a clock. Pure and seeded; the screen draws and feeds taps.
 */
export interface Fighter {
  name: string;
  hp: number;
  maxHp: number;
  power: number;
  dodge: number;
  /** Rival only: ms between strikes. */
  strikeEveryMs: number;
}

export interface Bout {
  tier: number;
  player: Fighter;
  rival: Fighter;
  timeMs: number;
  /** Timing bar phase 0..1, swings back and forth. */
  bar: number;
  barSpeed: number;
  rivalNextMs: number;
  finished: boolean;
  won: boolean | null;
  lastHit: { who: 'player' | 'rival'; strong: boolean; dodged: boolean; atMs: number } | null;
  rng: Rng;
}

export const BELTS = ['white', 'yellow', 'green', 'brown', 'black'] as const;

function fighterFor(n: Nubbin, name = n.name): Fighter {
  const power = levelOf(n.stats.power.points);
  const stamina = levelOf(n.stats.stamina.points);
  const run = levelOf(n.stats.run.points);
  const maxHp = Math.round(KARATE.hp + stamina * KARATE.staminaPerLevel);
  return {
    name,
    hp: maxHp,
    maxHp,
    power: 10 + power * KARATE.powerPerLevel,
    dodge: Math.min(0.35, run * KARATE.dodgePerRunLevel),
    strikeEveryMs: 1600,
  };
}

function rivalFor(tier: number, rng: Rng): Fighter {
  const level = KARATE.rivalLevel[tier - 1] ?? 10;
  const maxHp = Math.round(KARATE.hp + level * KARATE.staminaPerLevel * rng.float(0.8, 1.2));
  return {
    name: ['Bramble', 'Tusk', 'Needle'][tier - 1] ?? 'Rival',
    hp: maxHp,
    maxHp,
    power: 10 + level * KARATE.powerPerLevel * rng.float(0.8, 1.1),
    dodge: Math.min(0.3, level * KARATE.dodgePerRunLevel * 0.8),
    strikeEveryMs: Math.max(900, 1700 - tier * 220),
  };
}

export function createBout(player: Nubbin, tier: number, seed: number): Bout {
  const rng = Rng.fromSeed(seed);
  return {
    tier,
    player: fighterFor(player),
    rival: rivalFor(tier, rng),
    timeMs: 0,
    bar: 0,
    barSpeed: 0.9 + tier * 0.25,
    rivalNextMs: 1800,
    finished: false,
    won: null,
    lastHit: null,
    rng,
  };
}

/** How close the bar is to the centre, 0 (centre) to 1 (edge). */
export function barOffset(b: Bout): number {
  return Math.abs(b.bar - 0.5) * 2;
}

/** The player taps: strike with the timing bar where it is. */
export function strike(b: Bout): void {
  if (b.finished) return;
  const strong = barOffset(b) <= KARATE.sweetSpot;
  const dodged = b.rng.chance(b.rival.dodge);
  if (!dodged) {
    const dmg = b.player.power * (strong ? 1.6 : 0.6) * b.rng.float(0.9, 1.1);
    b.rival.hp = Math.max(0, b.rival.hp - dmg);
  }
  b.lastHit = { who: 'player', strong, dodged, atMs: b.timeMs };
  settle(b);
}

function rivalStrike(b: Bout): void {
  const strong = b.rng.chance(0.3);
  const dodged = b.rng.chance(b.player.dodge);
  if (!dodged) {
    const dmg = b.rival.power * (strong ? 1.3 : 0.7) * b.rng.float(0.9, 1.1);
    b.player.hp = Math.max(0, b.player.hp - dmg);
  }
  b.lastHit = { who: 'rival', strong, dodged, atMs: b.timeMs };
  settle(b);
}

function settle(b: Bout): void {
  if (b.rival.hp <= 0) {
    b.finished = true;
    b.won = true;
  } else if (b.player.hp <= 0) {
    b.finished = true;
    b.won = false;
  }
}

export function stepBout(b: Bout, dtMs: number): void {
  if (b.finished) return;
  b.timeMs += dtMs;
  // The bar swings back and forth.
  const phase = (b.timeMs / 1000) * b.barSpeed;
  b.bar = 0.5 + 0.5 * Math.sin(phase * Math.PI);
  if (b.timeMs >= b.rivalNextMs) {
    rivalStrike(b);
    b.rivalNextMs = b.timeMs + b.rival.strikeEveryMs;
  }
}

export function prizeForBout(tier: number, won: boolean): number {
  return won ? (KARATE.prize[tier - 1] ?? 20) : 5;
}
