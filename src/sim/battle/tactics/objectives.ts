/**
 * Victory conditions beyond "tucker out everyone" (recs FIGHT-58). Each kind checks the state
 * after every action and at every turn end. Failing is never game over: the result is a
 * `failed` with the foes' side as winner, and the screen offers a retry or a skip. Tuckering
 * every foe always wins, whatever the objective; the Keeper's side all tuckered always fails.
 */
import { TACTICS } from '../../../config/tuning-tactics';
import { standing } from '../damage';
import { tileAt } from './map';
import { TILE, type GridMap, type TacticsResult, type TacticsState, type TUnit } from './types';

const O = TACTICS.objective;

export const CALM_FULL = 100;

const up = (u: TUnit) => standing(u.c) && !u.ward;

/** The lantern posts on the map, as "x,y" keys. */
export function lanternKeys(m: GridMap): string[] {
  const out: string[] = [];
  for (let y = 0; y < m.h; y++)
    for (let x = 0; x < m.w; x++) if (tileAt(m, x, y) === TILE.lantern) out.push(`${x},${y}`);
  return out;
}

export const litCount = (s: TacticsState): number =>
  Object.values(s.progress.lit).filter(Boolean).length;

/** The end, if the bout has reached one. */
export function checkObjective(s: TacticsState): TacticsResult | null {
  const o = s.objective;
  const p = s.progress;
  const allies = s.units.filter((u) => u.c.side === 0);
  const foes = s.units.filter((u) => u.c.side === 1);
  if (!allies.some(up))
    return { winner: 1, reason: o.kind === 'tuckerAll' ? 'tuckered' : 'failed' };
  if (!foes.some(up)) return { winner: 0, reason: 'tuckered' };
  const won: TacticsResult = { winner: 0, reason: 'objective' };
  const failed: TacticsResult = { winner: 1, reason: 'failed' };
  switch (o.kind) {
    case 'tuckerAll':
      return null;
    case 'calmBoss': {
      const boss = s.units.find((u) => u.c.id === o.target);
      return boss && (boss.c.calm ?? 0) >= CALM_FULL ? won : null;
    }
    case 'escort': {
      const w = s.units.find((u) => u.c.id === o.target);
      return w && o.goal && w.x === o.goal.x && w.y === o.goal.y ? won : null;
    }
    case 'reach':
      return o.goal && allies.some((u) => up(u) && u.x === o.goal!.x && u.y === o.goal!.y)
        ? won
        : null;
    case 'gather':
      if (p.got[0] >= (o.count ?? 1)) return won;
      return p.got[1] >= (o.count ?? 1) ? failed : null;
    case 'holdLanterns':
      if (litCount(s) < (o.count ?? 1)) return failed;
      return p.rounds >= (o.rounds ?? 1) ? won : null;
    case 'protectPlot':
      if (p.onPlot >= O.protectTurns) return failed;
      return p.rounds >= (o.rounds ?? 1) ? won : null;
    case 'surviveRounds':
      return p.rounds >= (o.rounds ?? 1) ? won : null;
  }
}

/** After a foe's turn: count consecutive turns with a foe on the crop plot. */
export function plotTurn(s: TacticsState, m: GridMap, u: TUnit): void {
  if (s.objective.kind !== 'protectPlot' || u.c.side !== 1) return;
  const on = s.units.some((f) => f.c.side === 1 && up(f) && tileAt(m, f.x, f.y) === TILE.plot);
  s.progress.onPlot = on ? s.progress.onPlot + 1 : 0;
}

/** The objective chip: what to show as "have / need". */
export function chipOf(s: TacticsState): { have: number; need: number } {
  const o = s.objective;
  const p = s.progress;
  switch (o.kind) {
    case 'tuckerAll':
      return {
        have: s.units.filter((u) => u.c.side === 1 && !up(u)).length,
        need: s.units.filter((u) => u.c.side === 1).length,
      };
    case 'calmBoss': {
      const boss = s.units.find((u) => u.c.id === o.target);
      return { have: Math.round(boss?.c.calm ?? 0), need: CALM_FULL };
    }
    case 'gather':
      return { have: p.got[0], need: o.count ?? 1 };
    case 'holdLanterns':
    case 'protectPlot':
    case 'surviveRounds':
      return { have: p.rounds, need: o.rounds ?? 1 };
    case 'escort':
    case 'reach':
      return { have: s.result?.winner === 0 ? 1 : 0, need: 1 };
  }
}
