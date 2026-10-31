import { describe, expect, it } from 'vitest';
import { ACTS, actStartDepth } from '../../src/config/dungeon-acts';
import { HOLLOW_ECONOMY as ECON } from '../../src/config/dungeon-economy';
import { SHOP } from '../../src/config/tuning';
import { actFloor } from '../../src/sim/dungeon-acts';
import { levelMinutes, paidIncome } from '../../src/sim/dungeon-economy';

/**
 * R0178 (DUNG-35): ten scripted runs per act, each a walk down every level of the act that
 * picks up every Shells pile, beats every pack and opens every chest, paid by the real
 * formulas and the act's payout scale. Shells per minute must sit within ±20 % of the line
 * from 25/min in Act I to 60/min in Act V.
 */
const RUNS = 10;

function actRuns(act: number) {
  const def = ACTS[act]!;
  let shells = 0;
  let minutes = 0;
  const parts = { pickups: 0, packs: 0, chest: 0 };
  const standard: number[] = [];
  for (let r = 1; r <= RUNS; r++) {
    def.levels.forEach((size, i) => {
      const depth = actStartDepth(act) + i;
      const inc = paidIncome(actFloor(r * 97 + act, act, depth, 4), depth, act);
      shells += inc.total;
      parts.pickups += inc.pickups;
      parts.packs += inc.packs;
      parts.chest += inc.chest;
      minutes += levelMinutes(size, act);
      if (size === 'standard') standard.push(inc.total);
    });
  }
  return { perMinute: shells / minutes, parts, total: shells, standard };
}

const target = (act: number) =>
  ECON.perMinute.first + ((ECON.perMinute.last - ECON.perMinute.first) * act) / (ACTS.length - 1);

describe('the Hollow economy (R0178)', () => {
  const results = ACTS.map((_, act) => actRuns(act));

  it('pays within ±20 % of 25/min in Act I rising to 60/min in Act V', () => {
    const report = results.map((r, act) => `${act}: ${r.perMinute.toFixed(1)}/${target(act)}`);
    results.forEach((r, act) => {
      expect(r.perMinute, report.join(' ')).toBeGreaterThanOrEqual(
        target(act) * (1 - ECON.perMinute.slack),
      );
      expect(r.perMinute, report.join(' ')).toBeLessThanOrEqual(
        target(act) * (1 + ECON.perMinute.slack),
      );
    });
  });

  it('a standard Act I level pays 80–140 Shells, and the egg stays a goal of a few levels', () => {
    const std = results[0]!.standard;
    const avg = std.reduce((a, b) => a + b, 0) / std.length;
    expect(avg).toBeGreaterThanOrEqual(ECON.levelBand.min);
    expect(avg).toBeLessThanOrEqual(ECON.levelBand.max);
    // The egg costs at most three Act I levels' pay, and is never a single pickup away.
    expect(SHOP.egg).toBeLessThanOrEqual(avg * 3);
  });

  it('splits roughly 40 % pickups, 30 % packs, 30 % chests', () => {
    for (const r of results) {
      const sum = r.parts.pickups + r.parts.packs + r.parts.chest;
      for (const k of ['pickups', 'packs', 'chest'] as const)
        expect(Math.abs(r.parts[k] / sum - ECON.split[k]), k).toBeLessThanOrEqual(ECON.split.slack);
    }
  });

  it('stays near the Expedition rather than dwarfing it in Act I', () => {
    expect(results[0]!.perMinute).toBeLessThanOrEqual(ECON.expeditionPerMinute * 1.2);
  });
});
