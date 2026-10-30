/**
 * The Hollow's Shells faucet, measured (R0178, DUNG-35): what one level pays on average,
 * split into pickups, packs and the chest, straight from the same formulas the run uses
 * (`placeLoot` and the chest in dungeon.ts, the pack reward in dungeon-encounters.ts). The
 * economy test compares it, per minute of play, with the bands in `config/dungeon-economy.ts`.
 *
 * Pure sim: no DOM. It only reads a floor.
 */
import { DUNGEON, HOLLOW } from '../config/tuning';
import { HOLLOW_ECONOMY } from '../config/dungeon-economy';
import type { Floor } from './dungeon';
import type { DungeonRun } from './types';

export interface LevelIncome {
  pickups: number;
  packs: number;
  chest: number;
  total: number;
}

/** A level's Shells at `depth`: the loot lying there, every pack beaten, the chest's average. */
export function levelIncome(f: Floor, depth: number): LevelIncome {
  const pickups = f.loot.filter((l) => l.kind === 'shells').reduce((s, l) => s + l.amount, 0);
  const E = HOLLOW.packs;
  const packs = (f.packs ?? [])
    .filter((p) => p.kind !== 'boss')
    .reduce(
      (s, p) =>
        s + (E.rewardShells + p.tier * E.rewardPerTier + depth * 2) * (p.kind === 'normal' ? 1 : 2),
      0,
    );
  const [lo, hi] = DUNGEON.chestShells;
  const chest = (lo + hi) / 2 + depth * 10;
  return { pickups, packs, chest, total: pickups + packs + chest };
}

/** The act's payout scale (R0178): act runs by their act, anything else by Act I's. */
export function payoutScale(act: number | undefined): number {
  const P = HOLLOW_ECONOMY.payout;
  return P[Math.max(0, Math.min(P.length - 1, act ?? 0))]!;
}

/** Shells actually paid for a raw `amount`: scaled for the act, never below 1. */
export function shellPay(run: Pick<DungeonRun, 'act'>, amount: number): number {
  return Math.max(1, Math.round(amount * payoutScale(run.act)));
}

/** A level's Shells as paid (scaled), for the economy test and the debug numbers. */
export function paidIncome(f: Floor, depth: number, act: number): LevelIncome {
  const raw = levelIncome(f, depth);
  const s = payoutScale(act);
  const out = { pickups: raw.pickups * s, packs: raw.packs * s, chest: raw.chest * s, total: 0 };
  out.total = out.pickups + out.packs + out.chest;
  return out;
}

/** Estimated minutes for a level of `size` in act `act`. */
export function levelMinutes(size: 'small' | 'standard' | 'big', act: number): number {
  const M = HOLLOW_ECONOMY.minutes;
  return M[size] * (1 + M.perAct * act);
}
