import { BATTLE } from '../../../config/tuning-battle';
import type { StatKey } from '../../types';

/**
 * Reserved for the tactical grid mode (recs MOVE-61, ahead of FIGHT-50 to FIGHT-52): how far a
 * Nubbin moves and how many height levels it can climb in one step, and a board sampled from
 * any height field into whole tiles. Nothing plays on it yet; `Nubbin.combat` is an optional,
 * empty-by-default field, so adding the mode needs no save migration. FIGHT-52 may retune the
 * Jump formula (it draws on Fly); the numbers live in `BATTLE.grid`.
 */
export interface NubbinCombat {
  /** Height levels climbable per step. */
  jump: number;
  /** Tiles per turn. */
  move: number;
}

const G = BATTLE.grid;

/** Jump and Move from the stat levels (MOVE-61): jump = 1 + ⌊run/30⌋, move = 3 + ⌊run/25⌋. */
export function combatOf(levels: Readonly<Record<StatKey, number>>): NubbinCombat {
  const run = Math.max(0, Math.min(99, levels.run));
  return {
    jump: G.jumpBase + Math.floor(run / G.jumpPer),
    move: G.moveBase + Math.floor(run / G.movePer),
  };
}

/** A square board of whole tiles with integer height levels, row by row from the north-west. */
export interface Board {
  size: number;
  tile: number;
  heights: number[];
}

/**
 * Samples `heightAt` (the Grove's ground or a Hollow floor's elevation, in units) into a board
 * of `size` × `size` tiles of `BATTLE.grid.tile` units centred on (cx, cz), each height a whole
 * number of `BATTLE.grid.level` units.
 */
export function sampleBoard(
  heightAt: (x: number, z: number) => number,
  cx: number,
  cz: number,
  size: number,
): Board {
  const heights: number[] = [];
  const half = (size * G.tile) / 2;
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      const x = cx - half + (c + 0.5) * G.tile;
      const z = cz - half + (r + 0.5) * G.tile;
      heights.push(Math.max(0, Math.round(heightAt(x, z) / G.level)));
    }
  return { size, tile: G.tile, heights };
}

/** Whether a unit with `jump` may step between two neighbouring tiles. */
export function canStep(board: Board, from: number, to: number, jump: number): boolean {
  return Math.abs(board.heights[to]! - board.heights[from]!) <= jump;
}
